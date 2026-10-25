"""
اختبار محرك PCAP — يولّد حزم Modbus TCP حقيقية ويتحقق من الكشف
"""
import io
import struct
import dpkt


def build_modbus_pdu(transaction_id: int, unit_id: int, fc: int, extra: bytes = b"") -> bytes:
    """بناء Modbus TCP ADU حقيقي."""
    pdu = bytes([unit_id, fc]) + extra
    header = struct.pack(">HHH", transaction_id, 0x0000, len(pdu))
    return header + pdu


def build_eth_ip_tcp_packet(
    src_ip: str,
    dst_ip: str,
    src_port: int,
    dst_port: int,
    payload: bytes,
) -> bytes:
    """بناء Ethernet/IP/TCP frame كامل."""
    import socket

    tcp = dpkt.tcp.TCP(
        sport=src_port,
        dport=dst_port,
        seq=1000,
        ack=0,
        off_x2=0x50,
        flags=dpkt.tcp.TH_PUSH | dpkt.tcp.TH_ACK,
        win=65535,
        sum=0,
        urp=0,
        data=payload,
    )

    ip = dpkt.ip.IP(
        v=4,
        hl=5,
        tos=0,
        off=0,
        ttl=64,
        p=dpkt.ip.IP_PROTO_TCP,
        src=socket.inet_aton(src_ip),
        dst=socket.inet_aton(dst_ip),
        data=tcp,
    )
    ip.len = len(ip)

    eth = dpkt.ethernet.Ethernet(
        src=b"\xaa\xbb\xcc\xdd\xee\x01",
        dst=b"\xaa\xbb\xcc\xdd\xee\x02",
        type=dpkt.ethernet.ETH_TYPE_IP,
        data=ip,
    )
    return bytes(eth)


def create_test_pcap() -> bytes:
    """
    ينشئ pcap اختباري يحتوي على:
    - 5 حزمة Modbus read (طبيعي)
    - 3 حزمة Modbus FC05 Write Coil (خطير!)
    - 1 حزمة Modbus FC15 Write Multiple Coils (خطير جداً!)
    - 15 اتصال لمنافذ مختلفة من نفس المصدر (port scan)
    """
    buf = io.BytesIO()
    pcap_writer = dpkt.pcap.Writer(buf)

    import time
    base_ts = time.time()

    # ── Modbus Read packets (legitimate) ──────────────────────────────────────
    for i in range(5):
        pdu = build_modbus_pdu(transaction_id=i, unit_id=1, fc=0x03)  # Read Holding Registers
        frame = build_eth_ip_tcp_packet("192.168.1.100", "192.168.1.10", 12345, 502, pdu)
        pcap_writer.writepkt(frame, ts=base_ts + i * 0.1)

    # ── Modbus FC05 Write Coil (DANGEROUS) ────────────────────────────────────
    for i in range(3):
        pdu = build_modbus_pdu(
            transaction_id=100 + i,
            unit_id=1,
            fc=0x05,                        # Write Single Coil
            extra=struct.pack(">HH", 0, 0xFF00),  # Coil 0 → ON
        )
        frame = build_eth_ip_tcp_packet("10.0.0.99", "192.168.1.10", 54321, 502, pdu)
        pcap_writer.writepkt(frame, ts=base_ts + 10 + i * 0.5)

    # ── Modbus FC15 Write Multiple Coils (CRITICAL) ───────────────────────────
    pdu = build_modbus_pdu(
        transaction_id=200,
        unit_id=1,
        fc=0x0F,                         # Write Multiple Coils
        extra=struct.pack(">HHB", 0, 8, 1) + b"\xFF",  # 8 coils all ON
    )
    frame = build_eth_ip_tcp_packet("10.0.0.99", "192.168.1.10", 54321, 502, pdu)
    pcap_writer.writepkt(frame, ts=base_ts + 15)

    # ── Port Scan (15 different ports) ────────────────────────────────────────
    scan_ports = [21, 22, 23, 80, 443, 502, 102, 20000, 44818, 4840, 8080, 8443, 9600, 1089, 2404]
    for i, port in enumerate(scan_ports):
        frame = build_eth_ip_tcp_packet("172.16.0.50", "192.168.1.10", 60000 + i, port, b"")
        pcap_writer.writepkt(frame, ts=base_ts + 20 + i * 0.01)

    return buf.getvalue()


# ──────────────────────────────────────────────────────────────────────────────
# Run test
# ──────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    from main import ICSPCAPAnalyzer
    from dataclasses import asdict
    import json

    print("=" * 60)
    print("ICS-Risk PCAP Engine — Integration Test")
    print("=" * 60)

    # Generate test PCAP
    pcap_bytes = create_test_pcap()
    print(f"✓ Generated test PCAP: {len(pcap_bytes)} bytes")

    # Parse it
    analyzer = ICSPCAPAnalyzer()
    analyzer.parse(pcap_bytes)
    result = analyzer.build_result(file_size=len(pcap_bytes))

    print(f"\n📦 Total packets parsed:     {result.total_packets}")
    print(f"⏱  Duration:                 {result.duration_seconds:.2f}s")
    print(f"📡 Protocols detected:        {result.protocols}")
    print(f"🏭 ICS protocols found:       {result.ics_protocols_found}")

    print(f"\n🔧 Modbus events found:       {len(result.modbus_events)}")
    dangerous = [e for e in result.modbus_events if e["is_dangerous"]]
    print(f"⚠️  Dangerous Modbus events:   {len(dangerous)}")
    for e in dangerous:
        print(f"   → FC {e['function_code']:02X} ({e['function_name']}) from {e['src_ip']} → {e['dst_ip']}")

    print(f"\n🔍 Port scan suspects:        {len(result.port_scan_suspects)}")
    for s in result.port_scan_suspects:
        print(f"   → {s['ip']} contacted {s['unique_ports_contacted']} ports")

    print(f"\n🚨 ALERTS ({len(result.alerts)}):")
    for alert in result.alerts:
        sev_emoji = {"low": "🟡", "medium": "🟠", "high": "🔴", "critical": "💀"}.get(alert["severity"], "❓")
        print(f"   {sev_emoji} [{alert['severity'].upper()}] {alert['alert_type']}")
        print(f"      MITRE: {alert['mitre_technique']} — {alert['mitre_tactic']}")

    print(f"\n📊 RISK SCORE: {result.risk_score}/10  →  {result.risk_level}")

    print(f"\n💡 RECOMMENDATIONS:")
    for rec in result.recommendations:
        print(f"   {rec}")

    print("\n" + "=" * 60)
    print("Legacy demonstration completed; classification is not operationally validated.")
    print("=" * 60)

    # Save sample output
    with open("sample_output.json", "w") as f:
        json.dump(asdict(result), f, indent=2)
    print("\n📄 Full JSON output saved to sample_output.json")
