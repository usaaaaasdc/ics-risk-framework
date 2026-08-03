import { describe, expect, it } from "vitest"
import { TraficAnalyzer, type Packet } from "@/lib/calculators/pcap-ingestor"

function packet(overrides: Partial<Packet>): Packet {
    return {
        id: overrides.id ?? 1,
        timestamp: overrides.timestamp ?? "2026-06-30T00:00:00.000Z",
        source_ip: overrides.source_ip ?? "172.27.224.100",
        dest_ip: overrides.dest_ip ?? "172.27.224.250",
        protocol: overrides.protocol ?? "Modbus",
        destination_port: overrides.destination_port ?? 502,
        ...overrides,
    }
}

describe("Traffic analyzer ICS detections", () => {
    it("classifies Modbus FC3 as medium reconnaissance", () => {
        const result = TraficAnalyzer.analyzeDetailed([packet({ function_code: 3 })])
        const fc3Threat = result.threats.find((threat) => threat.type === "Modbus Read Reconnaissance")

        expect(fc3Threat?.severity).toBe("Medium")
        expect(fc3Threat?.function_code).toBe(3)
        expect(result.modbusFunctionCodes.find((stat) => stat.functionCode === 3)?.count).toBe(1)
    })

    it("classifies Modbus FC5 as high write manipulation", () => {
        const result = TraficAnalyzer.analyzeDetailed([packet({ function_code: 5 })])
        const fc5Threat = result.threats.find((threat) => threat.function_code === 5)

        expect(fc5Threat?.type).toBe("Modbus Anomaly")
        expect(fc5Threat?.severity).toBe("High")
    })

    it("classifies Modbus FC15 as critical multiple-coil write manipulation", () => {
        const result = TraficAnalyzer.analyzeDetailed([packet({ function_code: 15 })])
        const fc15Threat = result.threats.find((threat) => threat.function_code === 15)

        expect(fc15Threat?.type).toBe("Modbus Anomaly")
        expect(fc15Threat?.severity).toBe("Critical")
    })

    it("does not treat non-Modbus text mentioning FC15 as a Modbus write", () => {
        const result = TraficAnalyzer.analyzeDetailed([
            packet({
                protocol: "TCP",
                destination_port: 80,
                function_code: 15,
                payload: "operator note says FC 15 but this is web traffic",
            }),
        ])

        expect(result.threats.some((threat) => threat.function_code === 15)).toBe(false)
        expect(result.modbusFunctionCodes.some((stat) => stat.functionCode === 15)).toBe(false)
    })

    it("detects one scanner touching many TCP ports on one industrial target", () => {
        const now = Date.parse("2026-06-30T00:00:00.000Z")
        const ports = [21, 22, 80, 443, 502, 1911, 20000, 44818, 8080, 8443]
        const packets = ports.map((portNumber, index) => packet({
            id: index + 1,
            timestamp: new Date(now + index * 1000).toISOString(),
            protocol: "TCP",
            destination_port: portNumber,
        }))

        const result = TraficAnalyzer.analyzeDetailed(packets)
        const scan = result.threats.find((threat) => threat.type === "TCP Port Scan")

        expect(scan?.severity).toBe("High")
        expect(scan?.source_ip).toBe("172.27.224.100")
        expect(scan?.target_ip).toBe("172.27.224.250")
        expect(scan?.count).toBe(10)
        expect(result.attackPaths[0]?.ports).toEqual(expect.arrayContaining([502, 44818, 20000, 1911]))
    })
})
