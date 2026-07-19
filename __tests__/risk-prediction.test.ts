import { describe, expect, it } from "vitest"
import { RiskPredictor } from "@/lib/risk-prediction"

describe("RiskPredictor", () => {
  it("produces a deterministic forecast from device inputs", () => {
    const predictor = new RiskPredictor()

    const result = predictor.predictRisk(
      [
        {
          type: "PLC",
          manufacturer: "Example Vendor",
          protocols: [],
          internetExposed: false,
          isLegacy: false,
          riskScore: 5,
          vulnerabilitiesFound: 0,
        },
      ],
      "Manufacturing",
    )

    expect(result.predictedRiskScore).toBe(5)
    expect(result.confidence).toBe(30)
    expect(result.trends).toHaveLength(2)
    expect(result.recommendations).toContain("Continue current security practices")
  })
})
