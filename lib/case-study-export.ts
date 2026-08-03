import {
    type SimulationParams,
    type SimulationStats,
    monteCarloDistributionToCsv,
    monteCarloSummaryToCsv,
} from "@/lib/calculators/risk-engine"
import {
    MARKOV_STATES,
    MarkovEngine,
    type MarkovStep,
    type MarkovSummaryMetrics,
    type MarkovTransitionMatrix,
} from "@/lib/calculators/markov-engine"
import { type TrafficAnalysisResult } from "@/lib/calculators/pcap-ingestor"

export const CASE_STUDY_BUNDLE_FILES = [
    "traffic_summary.csv",
    "threats_detected.csv",
    "modbus_function_codes.csv",
    "monte_carlo_summary.csv",
    "monte_carlo_results.csv",
    "markov_probabilities.csv",
    "markov_summary.csv",
    "transition_matrix.csv",
    "ground_truth_validation.csv",
    "case_study_report.json",
    "attack_path_network.svg",
] as const

export interface CaseStudyBundleInput {
    trafficAnalysis?: TrafficAnalysisResult | null
    simulationParams: SimulationParams
    monteCarloStats: SimulationStats
    markovHistory: MarkovStep[]
    markovSummary: MarkovSummaryMetrics
    transitionMatrix: MarkovTransitionMatrix
}

export type CaseStudyBundleFiles = Record<(typeof CASE_STUDY_BUNDLE_FILES)[number], string>

function csvEscape(value: unknown): string {
    const text = Array.isArray(value) ? value.join("|") : String(value ?? "")
    return `"${text.replace(/"/g, '""')}"`
}

function csvFromRows(headers: string[], rows: Array<Record<string, unknown>>): string {
    return [
        headers.join(","),
        ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
    ].join("\n")
}

function buildTrafficSummary(trafficAnalysis?: TrafficAnalysisResult | null): string {
    const rows = [
        { metric: "packet_count", value: trafficAnalysis?.packets.length ?? 0 },
        { metric: "detected_threat_count", value: trafficAnalysis?.threats.length ?? 0 },
        { metric: "modbus_function_code_count", value: trafficAnalysis?.modbusFunctionCodes.length ?? 0 },
        { metric: "ground_truth_matched_events", value: trafficAnalysis?.groundTruthSummary.matchedEvents ?? 0 },
        { metric: "ground_truth_missed_events", value: trafficAnalysis?.groundTruthSummary.missedEvents ?? 0 },
        {
            metric: "ground_truth_detection_coverage",
            value: trafficAnalysis?.groundTruthSummary.detectionCoverage ?? 0,
        },
        {
            metric: "port_scan_unique_port_threshold",
            value: trafficAnalysis?.options.portScanUniquePortThreshold ?? "",
        },
        {
            metric: "port_scan_window_seconds",
            value: trafficAnalysis?.options.portScanWindowSeconds ?? "",
        },
        {
            metric: "industrial_ports",
            value: trafficAnalysis?.options.industrialPorts.join("|") ?? "",
        },
    ]
    return csvFromRows(["metric", "value"], rows)
}

function buildThreatsCsv(trafficAnalysis?: TrafficAnalysisResult | null): string {
    const rows = trafficAnalysis?.threats.map((threat) => ({
        id: threat.id,
        type: threat.type,
        severity: threat.severity,
        source_ip: threat.source_ip,
        target_ip: threat.target_ip,
        port: threat.port,
        function_code: threat.function_code,
        count: threat.count,
        timestamp: threat.timestamp,
        confidence: threat.confidence,
        evidence: JSON.stringify(threat.evidence ?? {}),
        description: threat.description,
    })) ?? []

    return csvFromRows(
        [
            "id",
            "type",
            "severity",
            "source_ip",
            "target_ip",
            "port",
            "function_code",
            "count",
            "timestamp",
            "confidence",
            "evidence",
            "description",
        ],
        rows,
    )
}

function buildModbusCsv(trafficAnalysis?: TrafficAnalysisResult | null): string {
    const rows = trafficAnalysis?.modbusFunctionCodes.map((stat) => ({
        function_code: stat.functionCode,
        meaning: stat.meaning,
        count: stat.count,
        severity: stat.severity,
        sources: stat.sources,
        targets: stat.targets,
    })) ?? []

    return csvFromRows(["function_code", "meaning", "count", "severity", "sources", "targets"], rows)
}

function buildGroundTruthCsv(trafficAnalysis?: TrafficAnalysisResult | null): string {
    return csvFromRows(
        ["expected_label", "expected_evidence", "tool_output", "match"],
        trafficAnalysis?.groundTruthValidation.map((row) => ({
            expected_label: row.expectedLabel,
            expected_evidence: row.expectedEvidence,
            tool_output: row.toolOutput,
            match: row.match,
        })) ?? [],
    )
}

function buildMarkovSummaryCsv(summary: MarkovSummaryMetrics): string {
    return csvFromRows(
        ["metric", "value"],
        [
            { metric: "probability_of_compromise_at_24h", value: summary.probabilityOfCompromiseAt24h },
            { metric: "time_to_50_percent_compromise", value: summary.timeTo50PercentCompromise ?? "" },
            { metric: "peak_reconnaissance_time", value: summary.peakReconnaissanceTime },
            { metric: "peak_exploitation_time", value: summary.peakExploitationTime },
            { metric: "dominant_final_state", value: summary.dominantFinalState },
        ],
    )
}

function buildAttackPathSvg(trafficAnalysis?: TrafficAnalysisResult | null): string {
    const path = trafficAnalysis?.attackPaths[0]
    const source = path?.sourceIp ?? "No scanner"
    const target = path?.targetIp ?? "No target"
    const ports = path?.ports.length ? path.ports.join(", ") : "n/a"

    return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="260" viewBox="0 0 900 260" role="img" aria-label="ICS attack path">
  <rect width="900" height="260" fill="#f8fafc"/>
  <defs>
    <marker id="arrow" markerWidth="12" markerHeight="8" refX="11" refY="4" orient="auto">
      <path d="M0,0 L12,4 L0,8 Z" fill="#dc2626"/>
    </marker>
  </defs>
  <circle cx="130" cy="110" r="44" fill="#fff" stroke="#dc2626" stroke-width="4"/>
  <text x="130" y="104" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#0f172a">Scanner</text>
  <text x="130" y="126" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#334155">${source}</text>
  <line x1="180" y1="110" x2="395" y2="110" stroke="#dc2626" stroke-width="4" stroke-dasharray="9 6" marker-end="url(#arrow)"/>
  <text x="287" y="88" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#7f1d1d">TCP scan / industrial ports</text>
  <rect x="410" y="66" width="150" height="88" rx="8" fill="#fff" stroke="#f59e0b" stroke-width="4"/>
  <text x="485" y="104" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#0f172a">ICS Target</text>
  <text x="485" y="126" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#334155">${target}</text>
  <line x1="560" y1="110" x2="725" y2="110" stroke="#64748b" stroke-width="3" marker-end="url(#arrow)"/>
  <rect x="740" y="66" width="110" height="88" rx="8" fill="#fff" stroke="#22c55e" stroke-width="4"/>
  <text x="795" y="104" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#0f172a">PLC/HMI</text>
  <text x="795" y="126" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#334155">OT asset</text>
  <text x="450" y="205" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#334155">Observed ports: ${ports}</text>
</svg>`
}

export function buildCaseStudyBundleFiles(input: CaseStudyBundleInput): CaseStudyBundleFiles {
    const report = {
        generatedAt: new Date().toISOString(),
        equations: {
            monteCarlo: input.monteCarloStats.equation,
            markov: "P(t+1) = P(t) x TransitionMatrix; Compromised is absorbing with row [0,0,0,1].",
            riskScoreForMarkov:
                "Markov input risk score (0-10) = Impact(1-10) x Likelihood(0-1) x (1 - Mitigation Efficacy)",
        },
        simulationParams: input.simulationParams,
        monteCarlo: {
            mean: input.monteCarloStats.mean,
            median: input.monteCarloStats.median,
            p10: input.monteCarloStats.p10,
            p90: input.monteCarloStats.p90,
            standardDeviation: input.monteCarloStats.standardDeviation,
            minRisk: input.monteCarloStats.minRisk,
            maxRisk: input.monteCarloStats.maxRisk,
            confidenceInterval95: input.monteCarloStats.confidenceInterval95,
            iterations: input.monteCarloStats.iterations,
        },
        markov: {
            states: MARKOV_STATES,
            summary: input.markovSummary,
            transitionMatrixValid: MarkovEngine.validateTransitionMatrix(input.transitionMatrix),
            transitionMatrix: input.transitionMatrix,
        },
        traffic: {
            packetCount: input.trafficAnalysis?.packets.length ?? 0,
            threatCount: input.trafficAnalysis?.threats.length ?? 0,
            attackPaths: input.trafficAnalysis?.attackPaths ?? [],
            groundTruthSummary: input.trafficAnalysis?.groundTruthSummary ?? null,
        },
    }

    return {
        "traffic_summary.csv": buildTrafficSummary(input.trafficAnalysis),
        "threats_detected.csv": buildThreatsCsv(input.trafficAnalysis),
        "modbus_function_codes.csv": buildModbusCsv(input.trafficAnalysis),
        "monte_carlo_summary.csv": monteCarloSummaryToCsv(input.monteCarloStats),
        "monte_carlo_results.csv": monteCarloDistributionToCsv(input.monteCarloStats),
        "markov_probabilities.csv": MarkovEngine.historyToCsv(input.markovHistory),
        "markov_summary.csv": buildMarkovSummaryCsv(input.markovSummary),
        "transition_matrix.csv": MarkovEngine.transitionMatrixToCsv(input.transitionMatrix),
        "ground_truth_validation.csv": buildGroundTruthCsv(input.trafficAnalysis),
        "case_study_report.json": JSON.stringify(report, null, 2),
        "attack_path_network.svg": buildAttackPathSvg(input.trafficAnalysis),
    }
}
