"""Zeek 9.0.0 structured-log adapter. No packet decoding or security policy."""

from pathlib import Path
from datetime import datetime, timezone
from collections import defaultdict, deque
import hashlib
import json
import math
import ipaddress
from .contracts import AnalysisResult

from .capture_validation import inspect_capture

ROOT = Path(__file__).resolve().parent
FC = {
    "READ_HOLDING_REGISTERS": 3,
    "WRITE_SINGLE_REGISTER": 6,
    "WRITE_MULTIPLE_REGISTERS": 16,
}


def stable(*parts):
    return hashlib.sha256(json.dumps(parts, separators=(",", ":")).encode()).hexdigest()


def iso(value):
    return datetime.fromtimestamp(value, timezone.utc).isoformat(
        timespec="microseconds"
    )


def rows(path):
    if not path.exists():
        return []
    if path.is_symlink() or not path.is_file():
        raise ValueError("unsafe_output")
    records = []
    for line in path.read_text().splitlines():
        if not line.strip():
            continue
        value = json.loads(
            line,
            parse_constant=lambda x: (_ for _ in ()).throw(
                ValueError("nonfinite_number")
            ),
        )
        if not isinstance(value, dict):
            raise ValueError("invalid_log_row")
        if len(records) >= 100000:
            raise ValueError("output_record_limit")
        records.append(value)
    return records


def validate_native(row):
    if not isinstance(row.get("uid"), str):
        raise ValueError("invalid_native_uid")
    if type(row.get("ts")) not in (int, float) or not math.isfinite(row["ts"]):
        raise ValueError("invalid_native_time")
    for key in ["id.orig_h", "id.resp_h"]:
        ipaddress.ip_address(row[key])
    for key in ["id.orig_p", "id.resp_p"]:
        if type(row.get(key)) is not int or not 0 <= row[key] <= 65535:
            raise ValueError("invalid_native_port")


def normalize_capture(
    capture, raw, profile, job_id, site_id, classification
) -> AnalysisResult:
    admission = inspect_capture(capture)
    capture_id = job_id
    result = {
        "schemaVersion": "1.0-p0",
        "siteId": site_id,
        "sensorId": None,
        "dataClassification": classification,
        "sourceMode": "pcap-import",
        "analysisProfile": profile,
        "captureJob": {
            "id": capture_id,
            "sha256": admission["sha256"],
            "filename": capture.name,
            "container": admission["container"],
            "status": "completed",
            "policyApplied": False,
        },
        "assets": [],
        "flows": [],
        "protocolObservations": [],
        "transactions": [],
        "findings": [],
        "alerts": [],
        "quality": {
            "inputFrames": len(admission["frames"]),
            "truncatedFrames": sum(
                f["capturedLength"] < f["wireLength"] for f in admission["frames"]
            ),
            "linkTypes": admission["linkTypes"],
            "captureLoss": None,
            "issues": admission["issues"],
            "limitations": [
                "Offline input does not prove live capture loss or source authenticity.",
                "P0 admission supports PCAP2.4/microseconds and PCAPNG1.0/EPB/default microseconds/Ethernet only.",
                "Zeek Modbus native rows expose flow UID and source time, not original packet ordinal.",
                "No authorization policy or calibrated prediction is evaluated.",
            ],
        },
    }
    issues = result["quality"]["issues"]
    result["quality"]["completeness"] = "unknown"
    result["quality"]["unsupportedRecords"] = [i for i in issues if "unsupported" in i]
    if not admission["admitted"]:
        result["captureJob"]["status"] = (
            "completed" if issues == ["no_observations"] else "failed"
        )
        return result
    if (raw / "complete.marker").is_symlink() or not (
        raw / "complete.marker"
    ).is_file():
        raise ValueError("unsafe_output")
    marker = (raw / "complete.marker").read_text().strip().split()
    if len(marker) != 3 or marker[0] != "ics-zeek-p0-v1":
        raise ValueError("missing_completion_marker")
    native_flows = rows(raw / "conn.log")
    native_pdus = rows(raw / "modbus.log")
    if [len(native_flows), len(native_pdus)] != [int(marker[1]), int(marker[2])]:
        raise ValueError("missing_or_incomplete_output")
    weird = rows(raw / "weird.log")
    diagnostics = rows(raw / "analyzer_debug.log")
    result["quality"]["decoderDiagnostics"] = [
        {
            "nativeRow": i,
            "observedAt": iso(d["ts"]),
            "analyzer": d["analyzer_name"],
            "cause": d["cause"],
            "reason": d.get("failure_reason"),
            "nativeFlowId": d.get("uid"),
        }
        for i, d in enumerate(diagnostics, 1)
        if d["cause"] == "violation"
    ]
    for d in diagnostics:
        if d["cause"] == "violation" and d["analyzer_name"] == "MODBUS":
            code = (
                "invalid_mbap"
                if "TransportHeader:len" in d.get("failure_reason", "")
                else "undecoded_application"
            )
            if code not in issues:
                issues.append(code)
    for item in weird:
        reason = "zeek:" + item["name"]
        if reason not in issues:
            issues.append(reason)
    flow_ids, endpoints = {}, {}
    for ordinal, f in enumerate(native_flows, 1):
        validate_native(f)
        flow_id = (
            "flow-"
            + stable(
                admission["sha256"],
                profile["sha256"],
                f["ts"],
                f["id.orig_h"],
                f["id.orig_p"],
                f["id.resp_h"],
                f["id.resp_p"],
                f["proto"],
            )[:24]
        )
        flow_ids[f["uid"]] = flow_id
        evidence = {
            "captureSha256": admission["sha256"],
            "analysisProfileSha256": profile["sha256"],
            "nativeLog": "conn.log",
            "nativeRow": ordinal,
            "nativeFlowId": f["uid"],
            "packetOrdinals": None,
        }
        start, end = f["ts"], f["ts"] + f.get("duration", 0)
        result["flows"].append(
            {
                "id": flow_id,
                "basis": "observed",
                "protocol": f["proto"],
                "origin": {"ip": f["id.orig_h"], "port": f["id.orig_p"]},
                "responder": {"ip": f["id.resp_h"], "port": f["id.resp_p"]},
                "firstObservedAt": iso(start),
                "lastObservedAt": iso(end),
                "applicationProtocol": "modbus"
                if "modbus" in f.get("service", "")
                else None,
                "missedBytes": f.get("missed_bytes"),
                "evidence": evidence,
            }
        )
        for ip in [f["id.orig_h"], f["id.resp_h"]]:
            if ip not in endpoints:
                endpoints[ip] = {
                    "id": "endpoint-"
                    + stable(site_id, admission["sha256"], profile["sha256"], ip)[:24],
                    "basis": "observed",
                    "ip": ip,
                    "firstObservedAt": iso(start),
                    "lastObservedAt": iso(end),
                    "sourceProtocol": f["proto"],
                    "identity": {
                        "deviceClass": None,
                        "operationalFunction": None,
                        "vendor": None,
                        "model": None,
                        "firmware": None,
                        "status": "unknown",
                        "confidence": None,
                    },
                    "evidence": [evidence],
                    "uncertainty": "Observed address within this capture, not verified physical asset identity; no cross-capture auto-merge.",
                }
            else:
                endpoint = endpoints[ip]
                endpoint["firstObservedAt"] = min(
                    endpoint["firstObservedAt"], iso(start)
                )
                endpoint["lastObservedAt"] = max(endpoint["lastObservedAt"], iso(end))
                endpoint["evidence"].append(evidence)
    result["assets"] = list(endpoints.values())
    pending = defaultdict(deque)
    for ordinal, p in enumerate(native_pdus, 1):
        validate_native(p)
        if p["uid"] not in flow_ids:
            raise ValueError("unlinked_modbus_output")
        for key, upper in [("tid", 65535), ("unit", 255)]:
            if type(p.get(key)) is not int or not 0 <= p[key] <= upper:
                raise ValueError("invalid_modbus_metadata")
        code = FC.get(p.get("func"))
        if code is None and "unsupported_modbus_function" not in issues:
            issues.append("unsupported_modbus_function")
        direction = {"REQ": "request", "RESP": "response"}.get(
            p.get("pdu_type"), "unknown"
        )
        if direction == "unknown":
            raise ValueError("unsupported_native_direction")
        flow_id = flow_ids.get(p["uid"])
        observation_id = (
            "obs-"
            + stable(
                admission["sha256"],
                profile["sha256"],
                ordinal,
                p["ts"],
                p.get("tid"),
                p.get("unit"),
                p.get("pdu_type"),
            )[:24]
        )
        request = direction == "request"
        src = {
            "ip": p["id.orig_h"] if request else p["id.resp_h"],
            "port": p["id.orig_p"] if request else p["id.resp_p"],
        }
        dst = {
            "ip": p["id.resp_h"] if request else p["id.orig_h"],
            "port": p["id.resp_p"] if request else p["id.orig_p"],
        }
        ob = {
            "id": observation_id,
            "basis": "observed",
            "protocol": "modbus/tcp",
            "decoder": {"name": "Zeek", "version": "9.0.0"},
            "observedAt": iso(p["ts"]),
            "sourceEpochSeconds": p["ts"],
            "source": src,
            "destination": dst,
            "flowId": flow_id,
            "transactionId": p.get("tid"),
            "unitId": p.get("unit"),
            "functionCode": code,
            "functionName": p.get("func"),
            "direction": direction,
            "operation": "read"
            if code == 3
            else "write"
            if code in [6, 16]
            else "unknown",
            "authorization": "not_evaluated",
            "identityVerified": False,
            "evidence": {
                "captureSha256": admission["sha256"],
                "analysisProfileSha256": profile["sha256"],
                "nativeLog": "modbus.log",
                "nativeRow": ordinal,
                "nativeFlowId": p["uid"],
                "packetOrdinals": None,
            },
            "timestampSemantics": "pdu-observed",
            "uncertainty": []
            if direction != "unknown" and code is not None
            else ["Unmapped native direction or function"],
        }
        result["protocolObservations"].append(ob)
        key = (flow_id, p.get("tid"), p.get("unit"), code)
        if direction == "request":
            tx = {
                "id": "transaction-" + stable(observation_id)[:24],
                "flowId": flow_id,
                "modbusTransactionId": p.get("tid"),
                "unitId": p.get("unit"),
                "requestRef": observation_id,
                "responseRef": None,
                "status": "request_observed",
            }
            result["transactions"].append(tx)
            pending[key].append(tx)
        elif direction == "response":
            if pending[key]:
                tx = pending[key].popleft()
                tx.update(responseRef=observation_id, status="paired")
            else:
                issues.append("orphan_response")
    if any(tx["responseRef"] is None for tx in result["transactions"]):
        issues.append("response_not_observed")
    if not native_pdus and native_flows and not issues:
        issues.append("unsupported_or_undecoded_application")
    if not native_flows:
        issues.append("no_supported_activity")
    if any(f.get("missed_bytes", 0) for f in native_flows):
        issues.append("missing_stream_bytes")
    if issues:
        result["captureJob"]["status"] = "partial"
    result["quality"]["completeness"] = (
        "partial" if issues else "complete-within-profile"
    )
    result["quality"]["unsupportedRecords"] = [
        i for i in issues if "unsupported" in i or "undecoded" in i or "unknown" in i
    ]
    return result
