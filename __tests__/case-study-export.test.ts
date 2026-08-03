import { describe, expect, it } from "vitest"
import { buildCaseStudyBundleFiles, CASE_STUDY_BUNDLE_FILES } from "@/lib/case-study-export"
import { MarkovEngine } from "@/lib/calculators/markov-engine"
import { runMonteCarloSimulation, type SimulationParams } from "@/lib/calculators/risk-engine"
import { TraficAnalyzer, type Packet } from "@/lib/calculators/pcap-ingestor"

describe("Case study bundle export", () => {
    it("builds all expected publication bundle files with documented equations", () => {
        const simulationParams: SimulationParams = {
            baseImpact: 7,
            baseLikelihood: 0.7,
            mitigationFactor: 0.3,
            uncertainty: 0.2,
            iterations: 250,
            seed: 42,
        }
        const monteCarloStats = runMonteCarloSimulation(simulationParams)
        const markovRiskScore = simulationParams.baseImpact * simulationParams.baseLikelihood * (1 - simulationParams.mitigationFactor)
        const markovHistory = MarkovEngine.simulateAttackProgression(markovRiskScore, 24)
        const transitionMatrix = MarkovEngine.createTransitionMatrix(markovRiskScore)
        const markovSummary = MarkovEngine.summarize(markovHistory)
        const packets: Packet[] = [
            {
                id: 1,
                timestamp: "2026-06-30T00:00:00.000Z",
                source_ip: "172.27.224.100",
                dest_ip: "172.27.224.250",
                protocol: "Modbus",
                destination_port: 502,
                function_code: 15,
            },
        ]
        const trafficAnalysis = TraficAnalyzer.analyzeDetailed(packets)

        const files = buildCaseStudyBundleFiles({
            trafficAnalysis,
            simulationParams,
            monteCarloStats,
            markovHistory,
            markovSummary,
            transitionMatrix,
        })

        expect(Object.keys(files).sort()).toEqual([...CASE_STUDY_BUNDLE_FILES].sort())
        expect(files["ground_truth_validation.csv"]).toContain("expected_label")
        expect(files["case_study_report.json"]).toContain("Residual Risk Score (0-100)")
        expect(files["case_study_report.json"]).toContain("P(t+1)")
        expect(files["attack_path_network.svg"]).toContain("<svg")
    })
})
