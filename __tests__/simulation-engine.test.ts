import { describe, expect, it } from "vitest"
import { runSimulation, simulationScenarios } from "@/lib/simulation-engine"

describe("Attack simulation scenarios", () => {
    it("keeps the Engineering Toolset scenario count at four", () => {
        expect(simulationScenarios).toHaveLength(4)
    })

    it("runs every scenario without crashing", () => {
        simulationScenarios.forEach((scenario) => {
            const result = runSimulation(scenario.id, "en")

            expect(result.totalRisk).toBeGreaterThanOrEqual(0)
            expect(result.totalRisk).toBeLessThanOrEqual(100)
            expect(result.scenario.steps.length).toBeGreaterThan(0)
            expect(result.cascadingImpact.length).toBeGreaterThan(0)
            expect(result.recommendations.length).toBeGreaterThan(0)
        })
    })

    it("includes the new engineering workstation compromise scenario", () => {
        const result = runSimulation("scenario-4", "en")

        expect(result.scenario.name).toBe("Engineering Workstation Compromise")
        expect(result.scenario.detectionPoints.length).toBeGreaterThan(0)
        expect(result.scenario.preventionMeasures.length).toBeGreaterThan(0)
    })
})
