
/**
 * ICS-Risk Framework - PCAP/JSON Data Ingestor
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 * 
 * Enhanced with Smart Threat Detection:
 * - Whitelist-based authorization for Modbus writes
 * - Configurable detection thresholds
 * - Reduced false positives
 */

// ============================================
// CONFIGURATION CONSTANTS
// ============================================

/**
 * Authorized Engineering Workstation IPs
 * These IPs are permitted to perform Modbus write operations
 * without triggering critical alerts.
 */
export const AUTHORIZED_ENGINEERING_IPS = [
    '192.168.1.10',  // Primary Engineering Workstation
    '10.0.0.5',      // Secondary Engineering Workstation
    '192.168.1.100', // SCADA Server
];

/**
 * Port scanning detection threshold
 * Source IP accessing this many unique ports triggers a HIGH severity alert
 */
export const PORT_SCAN_THRESHOLD = 20;

/**
 * Modbus function codes that involve write operations
 * FC 5: Write Single Coil
 * FC 6: Write Single Register
 * FC 15: Write Multiple Coils
 * FC 16: Write Multiple Registers
 */
export const MODBUS_WRITE_FUNCTION_CODES = [5, 6, 15, 16];

// ============================================
// TYPE DEFINITIONS
// ============================================

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
    type: 'Modbus Anomaly' | 'Port Scanning' | 'Unauthorized Access' | 'Legitimate Operation';
    source_ip: string;
    severity: 'High' | 'Critical' | 'Medium' | 'Info';
    description: string;
    timestamp: string;
}

// ============================================
// TRAFFIC ANALYZER CLASS
// ============================================

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
     * Applies heuristic rules with whitelist-based authorization to detect threats.
     * Enhanced to reduce false positives from legitimate engineering operations.
     */
    static analyze(packets: Packet[]): DetectedThreat[] {
        const threats: DetectedThreat[] = [];
        const portScanTracker: Record<string, Set<number>> = {};

        packets.forEach(pkt => {
            // ================================================
            // RULE 1: Modbus Write Anomaly Detection (Smart)
            // ================================================
            if (pkt.protocol === 'Modbus' && pkt.function_code !== undefined) {
                if (MODBUS_WRITE_FUNCTION_CODES.includes(pkt.function_code)) {

                    // Check if source IP is authorized
                    const isAuthorized = AUTHORIZED_ENGINEERING_IPS.includes(pkt.source_ip);

                    if (isAuthorized) {
                        // Legitimate operation - log as informational only
                        threats.push({
                            id: `info-${Math.random().toString(36).substr(2, 9)}`,
                            type: 'Legitimate Operation',
                            source_ip: pkt.source_ip,
                            severity: 'Info',
                            description: `Authorized Modbus Write (FC ${pkt.function_code}) from Engineering Workstation to ${pkt.dest_ip}`,
                            timestamp: pkt.timestamp
                        });
                    } else {
                        // CRITICAL: Unauthorized write operation
                        threats.push({
                            id: `threat-${Math.random().toString(36).substr(2, 9)}`,
                            type: 'Modbus Anomaly',
                            source_ip: pkt.source_ip,
                            severity: 'Critical',
                            description: `UNAUTHORIZED Modbus Write (FC ${pkt.function_code}) from UNKNOWN source ${pkt.source_ip} targeting ${pkt.dest_ip} - Potential attack!`,
                            timestamp: pkt.timestamp
                        });
                    }
                }
            }

            // ================================================
            // RULE 2: Port Scanning Detection (Enhanced)
            // ================================================
            // Track unique ports accessed by each source IP
            if (!portScanTracker[pkt.source_ip]) {
                portScanTracker[pkt.source_ip] = new Set();
            }
            portScanTracker[pkt.source_ip].add(pkt.destination_port);
        });

        // Finalize Port Scan Detection with configurable threshold
        Object.entries(portScanTracker).forEach(([ip, ports]) => {
            if (ports.size >= PORT_SCAN_THRESHOLD) {
                threats.push({
                    id: `threat-${Math.random().toString(36).substr(2, 9)}`,
                    type: 'Port Scanning',
                    source_ip: ip,
                    severity: 'High',
                    description: `Detected port scan activity: ${ports.size} unique ports accessed (threshold: ${PORT_SCAN_THRESHOLD})`,
                    timestamp: new Date().toISOString()
                });
            }
        });

        return threats;
    }

    /**
     * Helper method to check if an IP is in the authorized whitelist
     * @param ip - IP address to check
     * @returns true if IP is authorized for write operations
     */
    static isAuthorizedIP(ip: string): boolean {
        return AUTHORIZED_ENGINEERING_IPS.includes(ip);
    }

    /**
     * Helper method to get the list of authorized IPs (for UI display)
     * @returns Array of authorized IP addresses
     */
    static getAuthorizedIPs(): string[] {
        return [...AUTHORIZED_ENGINEERING_IPS];
    }

    /**
     * Helper method to add an IP to the authorized list at runtime
     * (Note: This is in-memory only, not persisted)
     * @param ip - IP address to authorize
     */
    static addAuthorizedIP(ip: string): void {
        if (!AUTHORIZED_ENGINEERING_IPS.includes(ip)) {
            AUTHORIZED_ENGINEERING_IPS.push(ip);
        }
    }

    /**
     * Helper method to remove an IP from the authorized list at runtime
     * @param ip - IP address to deauthorize
     */
    static removeAuthorizedIP(ip: string): void {
        const index = AUTHORIZED_ENGINEERING_IPS.indexOf(ip);
        if (index > -1) {
            AUTHORIZED_ENGINEERING_IPS.splice(index, 1);
        }
    }
}
