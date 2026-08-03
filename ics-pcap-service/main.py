"""
ICS-Risk Framework — PCAP Analysis Microservice
================================================
Author: Osama Ali (ICS-Risk Framework)
Engine: Python + dpkt + FastAPI

يحل مشكلة الـ PCAP الوهمي في البرنامج الأصلي بتحليل حقيقي
للبروتوكولات الصناعية: Modbus TCP, DNP3, EtherNet/IP
"""

from __future__ import annotations

import io
import ipaddress
import os
import socket
import struct
import time
from collections import defaultdict
from dataclasses import dataclass, field, asdict
from typing import Any

import dpkt
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# ──────────────────────────────────────────────────────────────────────────────
# Constants — ICS Protocol Ports
# ──────────────────────────────────────────────────────────────────────────────
ICS_PORTS: dict[int, str] = {
    502:  "Modbus TCP",
    20000: "DNP3",
    44818: "EtherNet/IP",
    102:  "S7comm (Siemens)",
    2404: "IEC 60870-5-104",
    4840: "OPC-UA",
    1089: "FF HSE",
    1090: "FF HSE",
    1091: "FF HSE",
    9600: "OMRON FINS",
    18245: "GE SRTP",
    18246: "GE SRTP",
}

# Modbus Function Codes — RFC Reference
MODBUS_FC_NAMES: dict[int, str] = {
    0x01: "Read Coils",
    0x02: "Read Discrete Inputs",
    0x03: "Read Holding Registers",
    0x04: "Read Input Registers",
    0x05: "Write Single Coil",          # ⚠️ Dangerous if unauthorized
    0x06: "Write Single Register",      # ⚠️ Dangerous if unauthorized
    0x0F: "Write Multiple Coils",       # 🔴 CRITICAL — FC 15
    0x10: "Write Multiple Registers",   # 🔴 CRITICAL — FC 16
    0x11: "Report Server ID",
    0x2B: "Read Device Identification",
    0x01 | 0x80: "Error: Read Coils",
    0x05 | 0x80: "Error: Write Coil",
}

DANGEROUS_MODBUS_FCS = {0x05, 0x06, 0x0F, 0x10}  # FC5, FC6, FC15, FC16

# DNP3 Magic bytes
DNP3_START = b"\x05\x64"

MAX_UPLOAD_BYTES = int(os.getenv("PCAP_MAX_UPLOAD_BYTES", str(100 * 1024 * 1024)))
MAX_PACKETS = int(os.getenv("PCAP_MAX_PACKETS", "250000"))
MAX_JSON_PACKETS = int(os.getenv("PCAP_MAX_JSON_PACKETS", "50000"))
RATE_LIMIT_WINDOW_SECONDS = int(os.getenv("PCAP_RATE_LIMIT_WINDOW_SECONDS", "60"))
RATE_LIMIT_MAX_REQUESTS = int(os.getenv("PCAP_RATE_LIMIT_MAX_REQUESTS", "30"))
RATE_LIMIT_MAX_CLIENTS = int(os.getenv("PCAP_RATE_LIMIT_MAX_CLIENTS", "10000"))
ALLOWED_EXTENSIONS = {".pcap", ".pcapng", ".cap"}


def _allowed_origins() -> list[str]:
    configured = os.getenv("PCAP_ALLOWED_ORIGINS")
    if configured:
        return [origin.strip() for origin in configured.split(",") if origin.strip()]
    return ["http://localhost:3000", "http://127.0.0.1:3000"]

# ──────────────────────────────────────────────────────────────────────────────
# Data Models
# ──────────────────────────────────────────────────────────────────────────────

@dataclass
class PacketRecord:
    timestamp: float
    src_ip: str
    dst_ip: str
    src_port: int
    dst_port: int
    protocol: str      # TCP / UDP
    length: int
    ics_protocol: str  # Modbus, DNP3, etc.
    payload_hex: str   # First 32 bytes as hex for forensics


@dataclass
class ModbusEvent:
    timestamp: float
    src_ip: str
    dst_ip: str
    transaction_id: int
    unit_id: int
    function_code: int
    function_name: str
    is_dangerous: bool
    raw_data: str


@dataclass
class DNP3Event:
    timestamp: float
    src_ip: str
    dst_ip: str
    src_address: int
    dst_address: int
    function_code: int
    direction: str     # master / outstation
    raw_data: str


@dataclass
class SuspiciousAlert:
    alert_type: str
    severity: str      # low | medium | high | critical
    description: str
    affected_ips: list[str]
    count: int
    mitre_technique: str
    mitre_tactic: str
    recommendation: str


@dataclass
class AnalysisResult:
    # ── Summary ──────────────────────────────────────────────────────────────
    total_packets: int = 0
    duration_seconds: float = 0.0
    file_size_bytes: int = 0

    # ── Protocol breakdown ────────────────────────────────────────────────────
    protocols: dict[str, int] = field(default_factory=dict)
    ics_protocols_found: list[str] = field(default_factory=list)

    # ── Traffic stats ─────────────────────────────────────────────────────────
    top_sources: list[dict] = field(default_factory=list)
    top_destinations: list[dict] = field(default_factory=list)
    port_scan_suspects: list[dict] = field(default_factory=list)

    # ── ICS-specific events ───────────────────────────────────────────────────
    modbus_events: list[dict] = field(default_factory=list)
    dnp3_events: list[dict] = field(default_factory=list)
    enip_packet_count: int = 0

    # ── Threat detection ──────────────────────────────────────────────────────
    alerts: list[dict] = field(default_factory=list)

    # ── Risk score ────────────────────────────────────────────────────────────
    risk_score: float = 0.0
    risk_level: str = "LOW"

    # ── Recommendations ───────────────────────────────────────────────────────
    recommendations: list[str] = field(default_factory=list)

    # ── Metadata ──────────────────────────────────────────────────────────────
    analysis_engine: str = "ICS-Risk PCAP Engine v2.0 (dpkt)"
    error: str | None = None


# ──────────────────────────────────────────────────────────────────────────────
# Core Parser
# ──────────────────────────────────────────────────────────────────────────────

class ICSPCAPAnalyzer:
    """
    محرك تحليل حقيقي لملفات PCAP مع تخصص في بروتوكولات ICS.
    يكشف: Modbus FC anomalies, DNP3 traffic, EtherNet/IP, Port Scanning
    """

    def __init__(self) -> None:
        self.packets: list[PacketRecord] = []
        self.modbus_events: list[ModbusEvent] = []
        self.dnp3_events: list[DNP3Event] = []
        self.enip_count = 0
        self.src_counter: dict[str, int] = defaultdict(int)
        self.dst_counter: dict[str, int] = defaultdict(int)
        self.proto_counter: dict[str, int] = defaultdict(int)
        # port scan detection: src_ip → set of unique dst_ports
        self.src_port_map: dict[str, set[int]] = defaultdict(set)
        self.timestamps: list[float] = []

    # ── Low-level helpers ──────────────────────────────────────────────────────

    @staticmethod
    def _ip_str(raw: bytes) -> str:
        try:
            return socket.inet_ntoa(raw)
        except Exception:
            return "0.0.0.0"

    @staticmethod
    def _is_private(ip: str) -> bool:
        try:
            return ipaddress.ip_address(ip).is_private
        except ValueError:
            return False

    # ── Modbus TCP Parser ──────────────────────────────────────────────────────

    def _parse_modbus(self, ts: float, src_ip: str, dst_ip: str, payload: bytes) -> None:
        """
        Modbus TCP ADU structure:
        [2B Transaction ID][2B Protocol ID=0x0000][2B Length][1B Unit ID][1B FC][...]
        """
        if len(payload) < 8:
            return
        try:
            transaction_id = struct.unpack(">H", payload[0:2])[0]
            protocol_id    = struct.unpack(">H", payload[2:4])[0]
            # Protocol ID must be 0x0000 for Modbus
            if protocol_id != 0x0000:
                return
            unit_id        = payload[6]
            function_code  = payload[7]
        except (struct.error, IndexError):
            return

        fc_name     = MODBUS_FC_NAMES.get(function_code, f"Unknown FC 0x{function_code:02X}")
        is_dangerous = function_code in DANGEROUS_MODBUS_FCS

        event = ModbusEvent(
            timestamp=ts,
            src_ip=src_ip,
            dst_ip=dst_ip,
            transaction_id=transaction_id,
            unit_id=unit_id,
            function_code=function_code,
            function_name=fc_name,
            is_dangerous=is_dangerous,
            raw_data=payload[:16].hex(),
        )
        self.modbus_events.append(event)

    # ── DNP3 Parser ───────────────────────────────────────────────────────────

    def _parse_dnp3(self, ts: float, src_ip: str, dst_ip: str, payload: bytes) -> None:
        """
        DNP3 Data Link Layer:
        [2B Start=0x0564][1B Length][1B Control][2B DST][2B SRC]...
        """
        # Find DNP3 magic bytes in payload (may be inside TCP stream)
        idx = payload.find(DNP3_START)
        if idx == -1 or len(payload) < idx + 8:
            return
        try:
            data = payload[idx:]
            ctrl        = data[2]
            dst_address = struct.unpack("<H", data[4:6])[0]
            src_address = struct.unpack("<H", data[6:8])[0]
            # Direction bit: bit 7 of control
            direction = "master" if (ctrl & 0x80) else "outstation"
            # Application layer function code if available
            fc = data[12] if len(data) > 12 else 0xFF
        except (struct.error, IndexError):
            return

        event = DNP3Event(
            timestamp=ts,
            src_ip=src_ip,
            dst_ip=dst_ip,
            src_address=src_address,
            dst_address=dst_address,
            function_code=fc,
            direction=direction,
            raw_data=payload[idx:idx+16].hex(),
        )
        self.dnp3_events.append(event)

    # ── Packet dispatcher ─────────────────────────────────────────────────────

    def _process_tcp(self, ts: float, ip_src: str, ip_dst: str, tcp: dpkt.tcp.TCP) -> None:
        src_port = tcp.sport
        dst_port = tcp.dport
        payload  = bytes(tcp.data)

        ics_proto = ICS_PORTS.get(dst_port) or ICS_PORTS.get(src_port, "")

        record = PacketRecord(
            timestamp=ts,
            src_ip=ip_src,
            dst_ip=ip_dst,
            src_port=src_port,
            dst_port=dst_port,
            protocol="TCP",
            length=len(payload),
            ics_protocol=ics_proto,
            payload_hex=payload[:32].hex() if payload else "",
        )
        self.packets.append(record)

        # Protocol counters
        label = ics_proto if ics_proto else "TCP"
        self.proto_counter[label] += 1

        # ICS parsers
        if dst_port == 502 or src_port == 502:
            self._parse_modbus(ts, ip_src, ip_dst, payload)
        if dst_port == 20000 or src_port == 20000 or DNP3_START in payload[:4]:
            self._parse_dnp3(ts, ip_src, ip_dst, payload)
        if dst_port == 44818 or src_port == 44818:
            self.enip_count += 1

        # Port scan tracking
        self.src_port_map[ip_src].add(dst_port)

    def _process_udp(self, ts: float, ip_src: str, ip_dst: str, udp: dpkt.udp.UDP) -> None:
        src_port = udp.sport
        dst_port = udp.dport
        payload  = bytes(udp.data)

        ics_proto = ICS_PORTS.get(dst_port) or ICS_PORTS.get(src_port, "")
        label = ics_proto if ics_proto else "UDP"
        self.proto_counter[label] += 1

        record = PacketRecord(
            timestamp=ts,
            src_ip=ip_src,
            dst_ip=ip_dst,
            src_port=src_port,
            dst_port=dst_port,
            protocol="UDP",
            length=len(payload),
            ics_protocol=ics_proto,
            payload_hex=payload[:32].hex() if payload else "",
        )
        self.packets.append(record)

        # DNP3 can run over UDP on port 20000
        if dst_port == 20000 or src_port == 20000:
            self._parse_dnp3(ts, ip_src, ip_dst, payload)

    # ── Main parse loop ───────────────────────────────────────────────────────

    def parse(self, data: bytes) -> None:
        """Parse raw PCAP bytes."""
        try:
            stream = io.BytesIO(data)
            if data.startswith(b"\x0a\x0d\x0d\x0a"):
                pcap = dpkt.pcapng.Reader(stream)
            else:
                pcap = dpkt.pcap.Reader(stream)
        except Exception as e:
            raise ValueError(f"Invalid PCAP file: {e}") from e

        for packet_index, (ts, buf) in enumerate(pcap, start=1):
            if packet_index > MAX_PACKETS:
                raise ValueError(f"PCAP packet limit exceeded (max {MAX_PACKETS}).")

            self.timestamps.append(ts)
            try:
                eth = dpkt.ethernet.Ethernet(buf)
            except Exception:
                continue

            if not isinstance(eth.data, dpkt.ip.IP):
                continue

            ip     = eth.data
            ip_src = self._ip_str(ip.src)
            ip_dst = self._ip_str(ip.dst)

            self.src_counter[ip_src] += 1
            self.dst_counter[ip_dst] += 1

            if isinstance(ip.data, dpkt.tcp.TCP):
                self._process_tcp(ts, ip_src, ip_dst, ip.data)
            elif isinstance(ip.data, dpkt.udp.UDP):
                self._process_udp(ts, ip_src, ip_dst, ip.data)

    # ── Threat detection ──────────────────────────────────────────────────────

    def _detect_threats(self) -> list[SuspiciousAlert]:
        alerts: list[SuspiciousAlert] = []

        # ── 1. Unauthorized Modbus Write Commands ─────────────────────────────
        dangerous = [e for e in self.modbus_events if e.is_dangerous]
        if dangerous:
            # Group by source IP
            by_src: dict[str, list[ModbusEvent]] = defaultdict(list)
            for e in dangerous:
                by_src[e.src_ip].append(e)

            for src_ip, events in by_src.items():
                fc_names = list({e.function_name for e in events})
                alerts.append(SuspiciousAlert(
                    alert_type="MODBUS_UNAUTHORIZED_WRITE",
                    severity="critical",
                    description=(
                        f"Detected {len(events)} unauthorized Modbus write command(s) "
                        f"from {src_ip}. Commands: {', '.join(fc_names)}. "
                        f"These can modify PLC output coils/registers — hallmark of "
                        f"Stuxnet/Industroyer attack pattern."
                    ),
                    affected_ips=[src_ip],
                    count=len(events),
                    mitre_technique="T0836",
                    mitre_tactic="Impair Process Control",
                    recommendation=(
                        "Immediately block source IP at OT firewall. "
                        "Audit Modbus whitelists. Enable FC-level ACLs on gateways."
                    ),
                ))

        # ── 2. Port Scanning ──────────────────────────────────────────────────
        SCAN_THRESHOLD = 10
        for src_ip, ports in self.src_port_map.items():
            if len(ports) > SCAN_THRESHOLD:
                alerts.append(SuspiciousAlert(
                    alert_type="PORT_SCAN_DETECTED",
                    severity="high",
                    description=(
                        f"Source IP {src_ip} contacted {len(ports)} unique ports. "
                        f"Likely reconnaissance phase targeting ICS assets."
                    ),
                    affected_ips=[src_ip],
                    count=len(ports),
                    mitre_technique="T0846",
                    mitre_tactic="Discovery",
                    recommendation=(
                        "Block IP at perimeter. Review Purdue Model zones — "
                        "scanners reaching OT level indicate missing DMZ."
                    ),
                ))

        # ── 3. DNP3 from External IPs ─────────────────────────────────────────
        external_dnp3 = [
            e for e in self.dnp3_events
            if not self._is_private(e.src_ip)
        ]
        if external_dnp3:
            srcs = list({e.src_ip for e in external_dnp3})
            alerts.append(SuspiciousAlert(
                alert_type="DNP3_EXTERNAL_SOURCE",
                severity="critical",
                description=(
                    f"DNP3 traffic from {len(srcs)} external (non-RFC1918) IP(s): "
                    f"{', '.join(srcs[:3])}. DNP3 should NEVER originate externally."
                ),
                affected_ips=srcs,
                count=len(external_dnp3),
                mitre_technique="T0869",
                mitre_tactic="Initial Access",
                recommendation=(
                    "Block all external DNP3 at firewall immediately. "
                    "DNP3 has no authentication in older versions — "
                    "upgrade to DNP3 SA (Secure Authentication)."
                ),
            ))

        # ── 4. ICS Protocols on Non-Standard Ports ────────────────────────────
        # Future: detect Modbus tunneled in HTTP, etc.

        return alerts

    # ── Risk scoring ──────────────────────────────────────────────────────────

    def _calculate_risk(self, alerts: list[SuspiciousAlert]) -> tuple[float, str]:
        score = 0.0
        severity_weights = {"low": 1, "medium": 2, "high": 4, "critical": 8}
        for alert in alerts:
            score += severity_weights.get(alert.severity, 0) * min(alert.count, 10)

        # Normalize to 0-10
        score = min(score / 8, 10)

        if score < 3:   level = "LOW"
        elif score < 6: level = "MEDIUM"
        elif score < 8: level = "HIGH"
        else:           level = "CRITICAL"

        return round(score, 2), level

    # ── Recommendations generator ──────────────────────────────────────────────

    def _build_recommendations(self, alerts: list[SuspiciousAlert], result: AnalysisResult) -> list[str]:
        recs: list[str] = []

        if any(a.alert_type == "MODBUS_UNAUTHORIZED_WRITE" for a in alerts):
            recs.append("🔴 Deploy Modbus-aware firewall (e.g., Tofino, Fortinet FortiGate ICS) with FC-level ACLs.")
            recs.append("🔴 Whitelist only authorized Modbus masters by IP + Unit ID + FC combination.")

        if any(a.alert_type == "PORT_SCAN_DETECTED" for a in alerts):
            recs.append("🟠 Implement network segmentation per Purdue Model — IT/OT separation is insufficient.")
            recs.append("🟠 Deploy passive IDS (Claroty/Dragos) at OT network perimeter for asset discovery.")

        if any(a.alert_type == "DNP3_EXTERNAL_SOURCE" for a in alerts):
            recs.append("🔴 Block port 20000 at all external firewalls immediately.")
            recs.append("🔴 Upgrade DNP3 to Secure Authentication v5 (IEC 62351-5).")

        if result.ics_protocols_found:
            recs.append(
                f"ℹ️ ICS protocols detected: {', '.join(result.ics_protocols_found)}. "
                "Ensure all are explicitly authorized in network documentation."
            )

        if not recs:
            recs.append("✅ No critical threats detected. Continue monitoring and maintain baseline.")

        return recs

    # ── Final result builder ──────────────────────────────────────────────────

    def build_result(self, file_size: int) -> AnalysisResult:
        result = AnalysisResult()
        result.file_size_bytes = file_size
        result.total_packets = len(self.packets)

        if self.timestamps:
            result.duration_seconds = round(
                max(self.timestamps) - min(self.timestamps), 3
            )

        result.protocols = dict(self.proto_counter)

        # ICS protocols found
        ics_seen = {p.ics_protocol for p in self.packets if p.ics_protocol}
        result.ics_protocols_found = sorted(ics_seen)

        # Top sources / destinations
        result.top_sources = [
            {"ip": ip, "count": cnt}
            for ip, cnt in sorted(self.src_counter.items(), key=lambda x: -x[1])[:10]
        ]
        result.top_destinations = [
            {"ip": ip, "count": cnt}
            for ip, cnt in sorted(self.dst_counter.items(), key=lambda x: -x[1])[:10]
        ]

        # Port scan suspects
        result.port_scan_suspects = [
            {"ip": ip, "unique_ports_contacted": len(ports)}
            for ip, ports in self.src_port_map.items()
            if len(ports) > 10
        ]

        # ICS events
        result.modbus_events = [asdict(e) for e in self.modbus_events[:200]]
        result.dnp3_events   = [asdict(e) for e in self.dnp3_events[:200]]
        result.enip_packet_count = self.enip_count

        # Threats
        alerts = self._detect_threats()
        result.alerts = [asdict(a) for a in alerts]

        # Risk
        result.risk_score, result.risk_level = self._calculate_risk(alerts)

        # Recommendations
        result.recommendations = self._build_recommendations(alerts, result)

        return result


# ──────────────────────────────────────────────────────────────────────────────
# FastAPI Application
# ──────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="ICS-Risk PCAP Microservice",
    description=(
        "Real PCAP analysis engine for ICS/OT environments. "
        "Detects Modbus anomalies, DNP3 traffic, EtherNet/IP, and port scans. "
        "Integrates with ICS-Risk Framework frontend."
    ),
    version="2.0.0",
)

_rate_limit_store: dict[str, tuple[int, float]] = {}


@app.middleware("http")
async def enforce_request_limits(request: Request, call_next):
    if request.url.path in {"/analyze", "/analyze/json-traffic"}:
        content_length = request.headers.get("content-length")
        if content_length:
            try:
                parsed_length = int(content_length)
            except ValueError:
                return JSONResponse({"detail": "Invalid Content-Length."}, status_code=400)

            if parsed_length > MAX_UPLOAD_BYTES + (1024 * 1024):
                return JSONResponse({"detail": "Request body too large."}, status_code=413)

        client_ip = request.client.host if request.client else "unknown"
        now = time.monotonic()
        count, reset_at = _rate_limit_store.get(client_ip, (0, now + RATE_LIMIT_WINDOW_SECONDS))

        if now > reset_at:
            count = 0
            reset_at = now + RATE_LIMIT_WINDOW_SECONDS

        if count >= RATE_LIMIT_MAX_REQUESTS:
            return JSONResponse({"detail": "Too many requests."}, status_code=429)

        if client_ip not in _rate_limit_store and len(_rate_limit_store) >= RATE_LIMIT_MAX_CLIENTS:
            expired_clients = [
                key for key, (_, client_reset_at) in _rate_limit_store.items()
                if client_reset_at <= now
            ]
            for key in expired_clients:
                _rate_limit_store.pop(key, None)

            while len(_rate_limit_store) >= RATE_LIMIT_MAX_CLIENTS:
                oldest_client = next(iter(_rate_limit_store), None)
                if oldest_client is None:
                    break
                _rate_limit_store.pop(oldest_client, None)

        _rate_limit_store[client_ip] = (count + 1, reset_at)

    return await call_next(request)


app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins(),
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "online", "engine": "ICS-Risk PCAP Microservice v2.0"}


@app.post("/analyze")
async def analyze_pcap(file: UploadFile = File(...)) -> dict[str, Any]:
    """
    قبول ملف .pcap وإرجاع تحليل كامل بـ JSON.
    يتكامل مع Next.js frontend عبر fetch POST.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    ext = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Accepted: {sorted(ALLOWED_EXTENSIONS)}",
        )

    raw = await file.read(MAX_UPLOAD_BYTES + 1)
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail=f"File too large (max {MAX_UPLOAD_BYTES} bytes).")

    analyzer = ICSPCAPAnalyzer()
    try:
        analyzer.parse(raw)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    result = analyzer.build_result(file_size=len(raw))
    return asdict(result)


@app.post("/analyze/json-traffic")
async def analyze_json_traffic(payload: dict[str, Any]) -> dict[str, Any]:
    """
    يقبل JSON traffic logs (مثل mock-attack-traffic.json في المشروع الأصلي)
    ويحللها بنفس منطق الـ PCAP.
    """
    packets = payload.get("packets", [])
    if not isinstance(packets, list) or not packets:
        raise HTTPException(status_code=400, detail="No packets in payload.")

    if len(packets) > MAX_JSON_PACKETS:
        raise HTTPException(status_code=413, detail=f"Too many packets (max {MAX_JSON_PACKETS}).")

    # Reuse existing detection logic on JSON packets
    modbus_dangerous_count = 0
    port_map: dict[str, set] = defaultdict(set)
    alerts = []

    for pkt in packets:
        if not isinstance(pkt, dict):
            continue

        proto = pkt.get("protocol", "")
        dst_port = pkt.get("dst_port", pkt.get("destination_port", 0))
        src_ip = pkt.get("src_ip", "")
        payload_data = pkt.get("payload", "")
        function_code = pkt.get("function_code")
        try:
            function_code = int(function_code) if function_code is not None else None
        except (TypeError, ValueError):
            function_code = None

        if src_ip:
            port_map[src_ip].add(dst_port)

        # Modbus write detection from JSON
        if str(proto).lower() == "modbus" and (
            function_code in DANGEROUS_MODBUS_FCS
            or "FC 05" in str(payload_data)
            or "FC 15" in str(payload_data)
        ):
            modbus_dangerous_count += 1

    if modbus_dangerous_count > 0:
        alerts.append({
            "alert_type": "MODBUS_UNAUTHORIZED_WRITE",
            "severity": "critical",
            "count": modbus_dangerous_count,
            "mitre_technique": "T0836",
        })

    for src_ip, ports in port_map.items():
        if len(ports) > 10:
            alerts.append({
                "alert_type": "PORT_SCAN_DETECTED",
                "severity": "high",
                "affected_ip": src_ip,
                "unique_ports": len(ports),
                "mitre_technique": "T0846",
            })

    return {
        "total_packets": len(packets),
        "alerts": alerts,
        "risk_level": "CRITICAL" if any(a["severity"] == "critical" for a in alerts) else ("HIGH" if alerts else "LOW"),
        "analysis_engine": "ICS-Risk JSON Traffic Engine v2.0",
    }
