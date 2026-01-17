
/**
 * ICS-Risk Framework - PCAP/JSON Data Ingestor
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 */

export interface Packet {
    id: number;
    timestamp: string;
    source_ip: string;
    dest_ip: string;
    protocol: string; // 'Modbus', 'TCP', 'HTTP', etc.
    destination_port: number;
    function_code?: number; // For Modbus
    length?: number;
}

export interface DetectedThreat {
    id: string;
    type: 'Modbus Anomaly' | 'Port Scanning' | 'Unauthorized Access';
    source_ip: string;
    severity: 'High' | 'Critical' | 'Medium';
    description: string;
    timestamp: string;
}

export class TraficAnalyzer {

    /**
     * Parses raw JSON content into Packet array.
     * Expects format: [{...}, {...}]
     */
    static parseImportedFile(jsonContent: string): Packet[] {
        try {
            const packets = JSON.parse(jsonContent);
            if (!Array.isArray(packets)) throw new Error("File must be a JSON array");
            return packets;
        } catch (e) {
            console.error("Failed to parse packet log", e);
            throw new Error("Invalid JSON format");
        }
    }

    /**
     * Applies heuristic rules to detect threats.
     */
    static analyze(packets: Packet[]): DetectedThreat[] {
        const threats: DetectedThreat[] = [];
        const portScanTracker: Record<string, Set<number>> = {};

        packets.forEach(pkt => {
            // Rule 1: Modbus Write Anomaly
            // Build a simplistic assumption: Writes (FC 5, 15, 6, 16) are suspicious if not from Engineering Workstation
            // For sim purposes, we flag ANY Write Coil (FC 5) as suspicious/Medium
            if (pkt.protocol === 'Modbus' && (pkt.function_code === 5 || pkt.function_code === 15)) {
                threats.push({
                    id: `threat-${Math.random().toString(36).substr(2, 9)}`,
                    type: 'Modbus Anomaly',
                    source_ip: pkt.source_ip,
                    severity: 'Critical',
                    description: `Unauthorized Write Coil (FC ${pkt.function_code}) detected targeting ${pkt.dest_ip}`,
                    timestamp: pkt.timestamp
                });
            }

            // Rule 2: Port Scanning
            // Track unique ports accessed by source IP
            if (!portScanTracker[pkt.source_ip]) {
                portScanTracker[pkt.source_ip] = new Set();
            }
            portScanTracker[pkt.source_ip].add(pkt.destination_port);
        });

        // Finalize Port Scan Detection
        Object.entries(portScanTracker).forEach(([ip, ports]) => {
            if (ports.size >= 10) {
                threats.push({
                    id: `threat-${Math.random().toString(36).substr(2, 9)}`,
                    type: 'Port Scanning',
                    source_ip: ip,
                    severity: 'High',
                    description: `Detected scan of ${ports.size} unique ports`,
                    timestamp: new Date().toISOString()
                });
            }
        });

        return threats;
    }
}
