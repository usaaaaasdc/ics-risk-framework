"""Synthetic documentation-address Modbus captures. Standard library only; sends no packets.
Fixture bytes and golden expectations are independently specified. Fixtures: CC0-1.0.
"""

from pathlib import Path
import hashlib
import json
import socket
import struct

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "fixtures"
CLIENT, SERVER, SPORT, DPORT = "192.0.2.10", "192.0.2.20", 41000, 502
BASE = 1700000000


def checksum(data):
    if len(data) % 2:
        data += b"\0"
    total = sum(struct.unpack("!%dH" % (len(data) // 2), data))
    while total >> 16:
        total = (total & 0xFFFF) + (total >> 16)
    return (~total) & 0xFFFF


def frame(src, dst, sport, dport, seq, ack, flags, payload=b""):
    sip, dip = socket.inet_aton(src), socket.inet_aton(dst)
    tcp = (
        struct.pack("!HHIIBBHHH", sport, dport, seq, ack, 0x50, flags, 65535, 0, 0)
        + payload
    )
    pseudo = sip + dip + struct.pack("!BBH", 0, 6, len(tcp))
    tcp = tcp[:16] + struct.pack("!H", checksum(pseudo + tcp)) + tcp[18:]
    ip = struct.pack(
        "!BBHHHBBH4s4s", 0x45, 0, 20 + len(tcp), 1, 0x4000, 64, 6, 0, sip, dip
    )
    ip = ip[:10] + struct.pack("!H", checksum(ip)) + ip[12:]
    return bytes.fromhex("0200000000200200000000100800") + ip + tcp


def adu(tid, pdu, unit=1):
    return struct.pack("!HHHB", tid, 0, 1 + len(pdu), unit) + pdu


class Conversation:
    def __init__(self):
        self.records, self.cseq, self.sseq = [], 1001, 9001
        self.add(True, b"", flags=2, seq=1000, ack=0)
        self.add(False, b"", flags=18, seq=9000, ack=1001)
        self.add(True, b"", flags=16)

    def add(
        self, request, data, flags=24, seq=None, ack=None, retransmit=False, truncate=0
    ):
        seq = (self.cseq if request else self.sseq) if seq is None else seq
        ack = (self.sseq if request else self.cseq) if ack is None else ack
        wire = frame(
            CLIENT if request else SERVER,
            SERVER if request else CLIENT,
            SPORT if request else DPORT,
            DPORT if request else SPORT,
            seq,
            ack,
            flags,
            data,
        )
        self.records.append(
            {
                "timestamp_us": BASE * 1000000 + len(self.records) * 10000,
                "bytes": wire[:-truncate] if truncate else wire,
                "wirelen": len(wire),
            }
        )
        if not retransmit:
            if request:
                self.cseq += len(data)
            else:
                self.sseq += len(data)

    def close(self):
        self.add(True, b"", flags=17)
        self.cseq += 1
        self.add(False, b"", flags=17)
        self.sseq += 1
        self.add(True, b"", flags=16)


def pcap(records, linktype=1):
    out = struct.pack("<IHHIIII", 0xA1B2C3D4, 2, 4, 0, 0, 65535, linktype)
    for r in records:
        sec, us = divmod(r["timestamp_us"], 1000000)
        out += struct.pack("<IIII", sec, us, len(r["bytes"]), r["wirelen"]) + r["bytes"]
    return out


def block(kind, data):
    data += b"\0" * ((-len(data)) % 4)
    size = len(data) + 12
    return struct.pack("<II", kind, size) + data + struct.pack("<I", size)


def pcapng(records):
    out = block(0x0A0D0D0A, struct.pack("<IHHq", 0x1A2B3C4D, 1, 0, -1))
    out += block(1, struct.pack("<HHI", 1, 0, 65535))
    for r in records:
        ts = r["timestamp_us"]
        out += block(
            6,
            struct.pack(
                "<IIIII", 0, ts >> 32, ts & 0xFFFFFFFF, len(r["bytes"]), r["wirelen"]
            )
            + r["bytes"],
        )
    return out


def main():
    OUT.mkdir(exist_ok=True)
    req3 = adu(1, bytes.fromhex("0300000002"))
    resp3 = adu(1, bytes.fromhex("0304000a0014"))
    req6 = adu(2, bytes.fromhex("0600100007"))
    resp6 = adu(2, bytes.fromhex("0600100007"))
    req16 = adu(3, bytes.fromhex("10002000020400080009"))
    resp16 = adu(3, bytes.fromhex("1000200002"))
    messages = [
        (True, req3),
        (False, resp3),
        (True, req6),
        (False, resp6),
        (True, req16),
        (False, resp16),
    ]
    good = Conversation()
    for direction, data in messages:
        good.add(direction, data)
    good.close()
    segmented = Conversation()
    for i, (direction, data) in enumerate(messages):
        if i == 2:
            start = segmented.cseq
            segmented.add(direction, data)
            segmented.add(direction, data, seq=start, retransmit=True)
        elif i == 4:
            segmented.add(direction, data[:4])
            segmented.add(direction, data[4:])
        else:
            segmented.add(direction, data)
    segmented.close()
    incomplete = Conversation()
    incomplete.add(True, req3)
    truncated = Conversation()
    truncated.add(True, req3, truncate=3)
    nonmodbus = Conversation()
    nonmodbus.add(True, b"HELLO-NOT-MODBUS")
    nonmodbus.close()
    # Invalid MBAP Length=1 contradicts the actual function bytes: no complete ADU.
    badmbap = Conversation()
    badmbap.add(True, req3[:4] + b"\x00\x01" + req3[6:])
    badmbap.close()
    values = {
        "good.pcap": pcap(good.records),
        "good.pcapng": pcapng(good.records),
        "segmented-retransmit.pcap": pcap(segmented.records),
        "request-only.pcap": pcap(incomplete.records),
        "truncated-packet.pcap": pcap(truncated.records),
        "not-modbus-on-502.pcap": pcap(nonmodbus.records),
        "malformed-mbap.pcap": pcap(badmbap.records),
        "unsupported-link.pcap": pcap(good.records, linktype=147),
        "empty.pcap": pcap([]),
        "malformed.bin": b"not a capture\x00\xff",
        "truncated-container.pcap": pcap(good.records)[:-5],
    }
    expectations = {
        "good.pcap": {
            "container": "pcap",
            "expected_pdus": 6,
            "requests": 3,
            "responses": 3,
            "write_requests": 2,
            "pairs": 3,
        },
        "good.pcapng": {
            "container": "pcapng",
            "expected_pdus": 6,
            "requests": 3,
            "responses": 3,
            "write_requests": 2,
            "pairs": 3,
        },
        "segmented-retransmit.pcap": {
            "container": "pcap",
            "expected_pdus": 6,
            "requests": 3,
            "responses": 3,
            "write_requests": 2,
            "pairs": 3,
        },
        "request-only.pcap": {
            "expected_pdus": 1,
            "requests": 1,
            "responses": 0,
            "write_requests": 0,
            "pairs": 0,
        },
        "truncated-packet.pcap": {
            "expected_pdus": 0,
            "quality_issue": "truncated_frame",
        },
        "not-modbus-on-502.pcap": {
            "expected_pdus": 0,
            "quality_issue": "undecoded_application",
        },
        "malformed-mbap.pcap": {"expected_pdus": 0, "quality_issue": "invalid_mbap"},
        "unsupported-link.pcap": {
            "expected_pdus": 0,
            "quality_issue": "unsupported_linktype",
        },
        "empty.pcap": {"expected_pdus": 0, "quality_issue": "no_observations"},
        "malformed.bin": {"expected_pdus": 0, "quality_issue": "invalid_container"},
        "truncated-container.pcap": {
            "expected_pdus": 0,
            "quality_issue": "truncated_container",
        },
    }
    golden = {
        "client": CLIENT,
        "server": SERVER,
        "client_port": SPORT,
        "server_port": DPORT,
        "source": "self-authored synthetic offline data; no device or network contact",
        "license": "CC0-1.0",
        "good_messages": [
            {
                "tid": 1,
                "unit": 1,
                "fc": 3,
                "direction": "request",
                "operation": "read",
                "timestamp": BASE + 0.03,
            },
            {
                "tid": 1,
                "unit": 1,
                "fc": 3,
                "direction": "response",
                "operation": "read",
                "timestamp": BASE + 0.04,
            },
            {
                "tid": 2,
                "unit": 1,
                "fc": 6,
                "direction": "request",
                "operation": "write",
                "timestamp": BASE + 0.05,
            },
            {
                "tid": 2,
                "unit": 1,
                "fc": 6,
                "direction": "response",
                "operation": "write",
                "timestamp": BASE + 0.06,
            },
            {
                "tid": 3,
                "unit": 1,
                "fc": 16,
                "direction": "request",
                "operation": "write",
                "timestamp": BASE + 0.07,
            },
            {
                "tid": 3,
                "unit": 1,
                "fc": 16,
                "direction": "response",
                "operation": "write",
                "timestamp": BASE + 0.08,
            },
        ],
        "fixtures": expectations,
    }
    ledger = []
    for name, data in values.items():
        (OUT / name).write_bytes(data)
        ledger.append(
            {
                "file": name,
                "bytes": len(data),
                "sha256": hashlib.sha256(data).hexdigest(),
                "expected": expectations[name],
            }
        )
    (OUT / "golden.json").write_text(json.dumps(golden, indent=2))
    (OUT / "manifest.json").write_text(json.dumps(ledger, indent=2))
    print(json.dumps(ledger, indent=2))


if __name__ == "__main__":
    main()
