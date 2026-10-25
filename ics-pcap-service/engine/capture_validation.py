"""Bounded container admission, not an application decoder. Conservative P0 profile."""

import hashlib
import struct


def inspect_capture(path):
    with path.open("rb") as source:
        data = source.read(32 * 1024 * 1024 + 1)
    if len(data) > 32 * 1024 * 1024:
        raise ValueError("input_limit")
    result = {
        "sha256": hashlib.sha256(data).hexdigest(),
        "bytes": len(data),
        "container": "unknown",
        "frames": [],
        "issues": [],
        "linkTypes": [],
        "captureLoss": None,
    }

    def issue(code):
        if code not in result["issues"]:
            result["issues"].append(code)

    try:
        if data[:4] in [b"\xd4\xc3\xb2\xa1", b"\xa1\xb2\xc3\xd4"]:
            result["container"] = "pcap"
            endian = "<" if data[:4] == b"\xd4\xc3\xb2\xa1" else ">"
            if len(data) < 24:
                raise ValueError("truncated_container")
            _, major, minor, _, _, snaplen, link = struct.unpack_from(
                endian + "IHHIIII", data
            )
            if (major, minor) != (2, 4):
                raise ValueError("unsupported_container_version")
            result["linkTypes"] = [link]
            offset = 24
            while offset < len(data):
                if offset + 16 > len(data):
                    raise ValueError("truncated_container")
                seconds, useconds, caplen, wirelen = struct.unpack_from(
                    endian + "IIII", data, offset
                )
                offset += 16
                if caplen > snaplen or caplen > wirelen or useconds >= 1000000:
                    raise ValueError("invalid_container")
                if offset + caplen > len(data):
                    raise ValueError("truncated_container")
                result["frames"].append(
                    {
                        "ordinal": len(result["frames"]) + 1,
                        "timestamp": seconds + useconds / 1e6,
                        "interfaceId": 0,
                        "linkType": link,
                        "capturedLength": caplen,
                        "wireLength": wirelen,
                    }
                )
                if caplen < wirelen:
                    issue("truncated_frame")
                offset += caplen
                if len(result["frames"]) > 100000:
                    raise ValueError("record_limit")
        elif data[:4] == b"\x0a\x0d\x0d\x0a":
            result["container"] = "pcapng"
            if len(data) < 28:
                raise ValueError("truncated_container")
            endian = (
                "<"
                if data[8:12] == b"\x4d\x3c\x2b\x1a"
                else ">"
                if data[8:12] == b"\x1a\x2b\x3c\x4d"
                else None
            )
            if endian is None:
                raise ValueError("invalid_container")
            interfaces, offset, sections = [], 0, 0
            while offset < len(data):
                if offset + 12 > len(data):
                    raise ValueError("truncated_container")
                kind, length = struct.unpack_from(endian + "II", data, offset)
                if length < 12 or length % 4:
                    raise ValueError("invalid_container")
                if offset + length > len(data):
                    raise ValueError("truncated_container")
                if (
                    struct.unpack_from(endian + "I", data, offset + length - 4)[0]
                    != length
                ):
                    raise ValueError("invalid_container")
                payload = data[offset + 8 : offset + length - 4]
                if kind == 0x0A0D0D0A:
                    if len(payload) < 16:
                        raise ValueError("invalid_container")
                    if struct.unpack_from(endian + "q", payload, 8)[0] != -1:
                        raise ValueError("unsupported_section_length")
                    sections += 1
                    if sections > 1:
                        raise ValueError("unsupported_multiple_sections")
                    if struct.unpack_from(endian + "HH", payload, 4) != (1, 0):
                        raise ValueError("unsupported_container_version")
                elif kind == 1:
                    if len(payload) < 8:
                        raise ValueError("invalid_container")
                    link, _, snaplen = struct.unpack_from(endian + "HHI", payload)
                    # P0 accepts the default microsecond resolution only.
                    if len(payload) > 8 and any(payload[8:]):
                        raise ValueError("unsupported_interface_options")
                    interfaces.append((link, snaplen))
                    result["linkTypes"].append(link)
                elif kind == 6:
                    if len(payload) < 20:
                        raise ValueError("invalid_container")
                    interface, high, low, caplen, wirelen = struct.unpack_from(
                        endian + "IIIII", payload
                    )
                    if (
                        interface >= len(interfaces)
                        or ((caplen + 3) // 4 * 4) > len(payload) - 20
                    ):
                        raise ValueError("invalid_container")
                    link, snaplen = interfaces[interface]
                    if len(payload) > 20 + ((caplen + 3) // 4 * 4):
                        issue("unsupported_packet_options")
                    if caplen > wirelen or caplen > snaplen:
                        raise ValueError("invalid_container")
                    result["frames"].append(
                        {
                            "ordinal": len(result["frames"]) + 1,
                            "timestamp": ((high << 32) + low) / 1e6,
                            "interfaceId": interface,
                            "linkType": link,
                            "capturedLength": caplen,
                            "wireLength": wirelen,
                        }
                    )
                    if caplen < wirelen:
                        issue("truncated_frame")
                elif kind not in [2, 3, 4, 5]:
                    issue("unknown_pcapng_block")
                elif kind in [2, 3]:
                    raise ValueError("unsupported_packet_block")
                offset += length
                if len(result["frames"]) > 100000:
                    raise ValueError("record_limit")
        else:
            raise ValueError("invalid_container")
        if any(link != 1 for link in result["linkTypes"]):
            issue("unsupported_linktype")
        if not result["frames"]:
            issue("no_observations")
        result["admitted"] = "unsupported_linktype" not in result["issues"] and bool(
            result["frames"]
        )
    except (ValueError, struct.error) as exc:
        issue(str(exc) if isinstance(exc, ValueError) else "invalid_container")
        result["admitted"] = False
    return result
