/**
 * ICS-Risk Framework - PCAP/JSON Data Ingestor
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 *
 * Detection rules are heuristic and evidence-driven. They do not change the
 * Monte Carlo or Markov equations; they only classify observed traffic so the
 * risk simulation can select appropriate input parameters.
 */

export const AUTHORIZED_ENGINEERING_IPS = [
    '192.168.1.10',
    '10.0.0.5',
    '192.168.1.100',
];

export const DEFAULT_INDUSTRIAL_PORTS = [502, 44818, 20000, 1911];
export const PORT_SCAN_THRESHOLD = 10;
export const PORT_SCAN_WINDOW_SECONDS = 60;
export const MODBUS_WRITE_FUNCTION_CODES = [5, 6, 15, 16];

export interface TrafficAnalysisOptions {
    portScanUniquePortThreshold: number;
    portScanWindowSeconds: number;
    industrialPorts: number[];
}

export const DEFAULT_TRAFFIC_ANALYSIS_OPTIONS: TrafficAnalysisOptions = {
    portScanUniquePortThreshold: PORT_SCAN_THRESHOLD,
    portScanWindowSeconds: PORT_SCAN_WINDOW_SECONDS,
    industrialPorts: DEFAULT_INDUSTRIAL_PORTS,
};

export interface Packet {
    id: number;
    timestamp: string;
    source_ip: string;
    dest_ip: string;
    protocol: string;
    destination_port: number;
    dst_port?: number;
    function_code?: number | string;
    payload?: string;
    length?: number;
}

export type ThreatSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export interface DetectedThreat {
    id: string;
    type:
    | 'Modbus Anomaly'
    | 'Modbus Read Reconnaissance'
    | 'TCP Port Scan'
    | 'Port Scanning'
    | 'Industrial Port Exposure'
    | 'Unauthorized Access'
    | 'Legitimate Operation';
    source_ip: string;
    target_ip?: string;
    severity: ThreatSeverity;
    description: string;
    timestamp: string;
    port?: number;
    function_code?: number;
    count?: number;
    time_window_seconds?: number;
    confidence?: number;
    evidence?: Record<string, string | number | boolean | string[] | number[] | undefined>;
}

export interface ModbusFunctionCodeStat {
    functionCode: number;
    meaning: string;
    count: number;
    severity: ThreatSeverity;
    sources: string[];
    targets: string[];
}

export interface GroundTruthValidationRow {
    expectedLabel: string;
    expectedEvidence: string;
    toolOutput: string;
    match: 'Yes' | 'No';
}

export interface GroundTruthValidationSummary {
    matchedEvents: number;
    missedEvents: number;
    detectionCoverage: number;
}

export interface AttackPathHint {
    sourceIp: string;
    targetIp: string;
    ports: number[];
    label: string;
}

export interface TrafficAnalysisResult {
    packets: Packet[];
    threats: DetectedThreat[];
    modbusFunctionCodes: ModbusFunctionCodeStat[];
    groundTruthValidation: GroundTruthValidationRow[];
    groundTruthSummary: GroundTruthValidationSummary;
    attackPaths: AttackPathHint[];
    options: TrafficAnalysisOptions;
}

const MODBUS_FUNCTION_MEANINGS: Record<number, string> = {
    3: 'Read Holding Registers',
    5: 'Write Single Coil',
    6: 'Write Single Register',
    15: 'Write Multiple Coils',
    16: 'Write Multiple Registers',
};

let threatCounter = 0;

function nextThreatId(prefix = 'threat') {
    threatCounter += 1;
    return `${prefix}-${threatCounter}`;
}

function normalizePort(packet: Packet): number {
    return Number(packet.destination_port ?? packet.dst_port ?? 0);
}

function normalizeFunctionCode(value: Packet['function_code']): number | undefined {
    if (value === undefined || value === null || value === '') return undefined;
    const parsed = typeof value === 'number' ? value : Number(String(value).replace(/^FC\s*/i, ''));
    return Number.isFinite(parsed) ? parsed : undefined;
}

function packetTimeMs(packet: Packet): number {
    const parsed = Date.parse(packet.timestamp);
    return Number.isFinite(parsed) ? parsed : 0;
}

function isModbusTraffic(packet: Packet): boolean {
    return String(packet.protocol).toLowerCase().includes('modbus') || normalizePort(packet) === 502;
}

function severityForFunctionCode(functionCode: number): ThreatSeverity {
    if (functionCode === 15 || functionCode === 16) return 'Critical';
    if (functionCode === 5 || functionCode === 6) return 'High';
    if (functionCode === 3) return 'Medium';
    return 'Low';
}

function meaningForFunctionCode(functionCode: number): string {
    return MODBUS_FUNCTION_MEANINGS[functionCode] ?? `Unknown FC ${functionCode}`;
}

function buildGroundTruth(threats: DetectedThreat[], modbusStats: ModbusFunctionCodeStat[]): GroundTruthValidationRow[] {
    const hasFc3 = modbusStats.some((stat) => stat.functionCode === 3);
    const hasFc5 = modbusStats.some((stat) => stat.functionCode === 5);
    const hasFc15 = modbusStats.some((stat) => stat.functionCode === 15);
    const hasTcpScan = threats.some((threat) => threat.type === 'TCP Port Scan');

    return [
        {
            expectedLabel: 'FC3 read probing',
            expectedEvidence: 'Modbus/TCP FC3 read activity',
            toolOutput: hasFc3 ? 'Modbus Read Reconnaissance / Medium' : 'Not detected',
            match: hasFc3 ? 'Yes' : 'No',
        },
        {
            expectedLabel: 'FC5 write manipulation',
            expectedEvidence: 'Modbus/TCP FC5 write single coil',
            toolOutput: hasFc5 ? 'Modbus Anomaly / High' : 'Not detected',
            match: hasFc5 ? 'Yes' : 'No',
        },
        {
            expectedLabel: 'FC15 multiple coil manipulation',
            expectedEvidence: 'Modbus/TCP FC15 write multiple coils',
            toolOutput: hasFc15 ? 'Modbus Anomaly / Critical' : 'Not detected',
            match: hasFc15 ? 'Yes' : 'No',
        },
        {
            expectedLabel: 'TCP port scan',
            expectedEvidence: 'One scanner host contacts many ports on one target in the configured time window',
            toolOutput: hasTcpScan ? 'TCP Port Scan / High' : 'Not detected',
            match: hasTcpScan ? 'Yes' : 'No',
        },
    ];
}

export class TraficAnalyzer {
    static parseImportedFile(jsonContent: string): Packet[] {
        try {
            const parsed = JSON.parse(jsonContent);
            if (Array.isArray(parsed)) return parsed;
            if (parsed && typeof parsed === 'object' && Array.isArray(parsed.packets)) return parsed.packets;
            throw new Error('File must be a JSON array or an object with a packets array');
        } catch (e) {
            console.error('Failed to parse packet log', e);
            throw new Error('Invalid JSON format');
        }
    }

    static analyze(packets: Packet[], options: Partial<TrafficAnalysisOptions> = {}): DetectedThreat[] {
        return this.analyzeDetailed(packets, options).threats;
    }

    static analyzeDetailed(packets: Packet[], options: Partial<TrafficAnalysisOptions> = {}): TrafficAnalysisResult {
        const finalOptions = { ...DEFAULT_TRAFFIC_ANALYSIS_OPTIONS, ...options };
        const threats: DetectedThreat[] = [];
        const modbusStatMap = new Map<number, ModbusFunctionCodeStat>();
        const sourceTargetPackets = new Map<string, Packet[]>();
        const exposedIndustrialPorts = new Map<string, Set<number>>();

        packets.forEach((packet) => {
            const port = normalizePort(packet);
            const key = `${packet.source_ip}|${packet.dest_ip}`;

            if (!sourceTargetPackets.has(key)) sourceTargetPackets.set(key, []);
            sourceTargetPackets.get(key)?.push(packet);

            if (finalOptions.industrialPorts.includes(port)) {
                if (!exposedIndustrialPorts.has(key)) exposedIndustrialPorts.set(key, new Set());
                exposedIndustrialPorts.get(key)?.add(port);
            }

            if (!isModbusTraffic(packet)) return;

            const functionCode = normalizeFunctionCode(packet.function_code);
            if (functionCode === undefined) return;

            const existingStat = modbusStatMap.get(functionCode) ?? {
                functionCode,
                meaning: meaningForFunctionCode(functionCode),
                count: 0,
                severity: severityForFunctionCode(functionCode),
                sources: [],
                targets: [],
            };

            existingStat.count += 1;
            existingStat.sources = Array.from(new Set([...existingStat.sources, packet.source_ip]));
            existingStat.targets = Array.from(new Set([...existingStat.targets, packet.dest_ip]));
            modbusStatMap.set(functionCode, existingStat);

            const isAuthorized = AUTHORIZED_ENGINEERING_IPS.includes(packet.source_ip);
            const baseEvidence = {
                sourceIp: packet.source_ip,
                targetIp: packet.dest_ip,
                port,
                functionCode,
                protocol: packet.protocol,
                modbusTcpValidated: true,
            };

            if (functionCode === 3) {
                threats.push({
                    id: nextThreatId('modbus-read'),
                    type: 'Modbus Read Reconnaissance',
                    source_ip: packet.source_ip,
                    target_ip: packet.dest_ip,
                    severity: 'Medium',
                    description: `Modbus FC3 read probing from ${packet.source_ip} to ${packet.dest_ip}.`,
                    timestamp: packet.timestamp,
                    port,
                    function_code: functionCode,
                    count: 1,
                    confidence: 0.82,
                    evidence: {
                        ...baseEvidence,
                        reason: 'FC3 reads holding registers and is treated as reconnaissance, not a write attack.',
                    },
                });
                return;
            }

            if (MODBUS_WRITE_FUNCTION_CODES.includes(functionCode)) {
                const severity = severityForFunctionCode(functionCode);
                threats.push({
                    id: nextThreatId(isAuthorized ? 'authorized-write' : 'modbus-write'),
                    type: isAuthorized ? 'Legitimate Operation' : 'Modbus Anomaly',
                    source_ip: packet.source_ip,
                    target_ip: packet.dest_ip,
                    severity: isAuthorized ? 'Info' : severity,
                    description: `${isAuthorized ? 'Authorized' : 'Unauthorized'} Modbus ${meaningForFunctionCode(functionCode)} (FC ${functionCode}) from ${packet.source_ip} to ${packet.dest_ip}.`,
                    timestamp: packet.timestamp,
                    port,
                    function_code: functionCode,
                    count: 1,
                    confidence: functionCode === 15 || functionCode === 16 ? 0.96 : 0.92,
                    evidence: {
                        ...baseEvidence,
                        reason: functionCode === 15 || functionCode === 16
                            ? 'Multiple coil/register write can manipulate process state.'
                            : 'Single coil/register write can manipulate a field/control point.',
                        authorizedSource: isAuthorized,
                    },
                });
            }
        });

        for (const [key, groupedPackets] of sourceTargetPackets.entries()) {
            const [sourceIp, targetIp] = key.split('|');
            const sorted = [...groupedPackets].sort((a, b) => packetTimeMs(a) - packetTimeMs(b));

            for (let start = 0; start < sorted.length; start++) {
                const windowStart = packetTimeMs(sorted[start]);
                const ports = new Set<number>();
                for (let end = start; end < sorted.length; end++) {
                    const elapsedSeconds = (packetTimeMs(sorted[end]) - windowStart) / 1000;
                    if (elapsedSeconds > finalOptions.portScanWindowSeconds) break;
                    ports.add(normalizePort(sorted[end]));
                }

                if (ports.size >= finalOptions.portScanUniquePortThreshold) {
                    threats.push({
                        id: nextThreatId('tcp-scan'),
                        type: 'TCP Port Scan',
                        source_ip: sourceIp,
                        target_ip: targetIp,
                        severity: 'High',
                        description: `TCP port scan detected: ${sourceIp} contacted ${ports.size} ports on ${targetIp} within ${finalOptions.portScanWindowSeconds}s.`,
                        timestamp: sorted[start].timestamp,
                        count: ports.size,
                        time_window_seconds: finalOptions.portScanWindowSeconds,
                        confidence: 0.9,
                        evidence: {
                            sourceIp,
                            targetIp,
                            ports: Array.from(ports).sort((a, b) => a - b),
                            threshold: finalOptions.portScanUniquePortThreshold,
                        },
                    });
                    break;
                }
            }
        }

        for (const [key, ports] of exposedIndustrialPorts.entries()) {
            const [sourceIp, targetIp] = key.split('|');
            threats.push({
                id: nextThreatId('industrial-exposure'),
                type: 'Industrial Port Exposure',
                source_ip: sourceIp,
                target_ip: targetIp,
                severity: 'Medium',
                description: `Industrial service exposure observed from ${sourceIp} to ${targetIp}: ports ${Array.from(ports).join(', ')}.`,
                timestamp: new Date().toISOString(),
                count: ports.size,
                confidence: 0.74,
                evidence: {
                    sourceIp,
                    targetIp,
                    ports: Array.from(ports).sort((a, b) => a - b),
                    reason: 'Traffic touched known industrial protocol ports.',
                },
            });
        }

        const modbusFunctionCodes = Array.from(modbusStatMap.values()).sort((a, b) => a.functionCode - b.functionCode);
        const groundTruthValidation = buildGroundTruth(threats, modbusFunctionCodes);
        const matchedEvents = groundTruthValidation.filter((row) => row.match === 'Yes').length;
        const missedEvents = groundTruthValidation.length - matchedEvents;
        const attackPaths = threats
            .filter((threat) => threat.type === 'TCP Port Scan' && threat.target_ip)
            .map((threat) => ({
                sourceIp: threat.source_ip,
                targetIp: threat.target_ip as string,
                ports: (threat.evidence?.ports as number[] | undefined) ?? [],
                label: 'Scanner to industrial target',
            }));

        return {
            packets,
            threats,
            modbusFunctionCodes,
            groundTruthValidation,
            groundTruthSummary: {
                matchedEvents,
                missedEvents,
                detectionCoverage: groundTruthValidation.length === 0 ? 0 : matchedEvents / groundTruthValidation.length,
            },
            attackPaths,
            options: finalOptions,
        };
    }

    static isAuthorizedIP(ip: string): boolean {
        return AUTHORIZED_ENGINEERING_IPS.includes(ip);
    }

    static getAuthorizedIPs(): string[] {
        return [...AUTHORIZED_ENGINEERING_IPS];
    }

    static addAuthorizedIP(ip: string): void {
        if (!AUTHORIZED_ENGINEERING_IPS.includes(ip)) {
            AUTHORIZED_ENGINEERING_IPS.push(ip);
        }
    }

    static removeAuthorizedIP(ip: string): void {
        const index = AUTHORIZED_ENGINEERING_IPS.indexOf(ip);
        if (index > -1) {
            AUTHORIZED_ENGINEERING_IPS.splice(index, 1);
        }
    }
}

export function rowsToCsv(rows: Array<Record<string, unknown>>): string {
    if (rows.length === 0) return '';
    const headers = Object.keys(rows[0]);
    const escapeCell = (value: unknown) => {
        const text = Array.isArray(value) ? value.join('|') : String(value ?? '');
        return `"${text.replace(/"/g, '""')}"`;
    };
    return [headers.join(','), ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(','))].join('\n');
}
