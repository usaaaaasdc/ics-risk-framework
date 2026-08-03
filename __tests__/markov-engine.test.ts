import { describe, expect, it } from "vitest"
import { MARKOV_STATES, MarkovEngine } from "@/lib/calculators/markov-engine"

describe("Markov attack progression engine", () => {
    it("builds a valid transition matrix with each row summing to one", () => {
        const matrix = MarkovEngine.createTransitionMatrix(4.2)

        expect(MarkovEngine.validateTransitionMatrix(matrix)).toBe(true)
        MARKOV_STATES.forEach((state) => {
            const rowSum = MARKOV_STATES.reduce((sum, target) => sum + matrix[state][target], 0)
            expect(rowSum).toBeCloseTo(1, 8)
        })
    })

    it("keeps compromised as an absorbing state for publication-grade attack progression", () => {
        const matrix = MarkovEngine.createTransitionMatrix(9)

        expect(matrix.Compromised).toEqual({
            Secure: 0,
            Reconnaissance: 0,
            Exploitation: 0,
            Compromised: 1,
        })
    })

    it("summarizes 24-hour compromise metrics", () => {
        const history = MarkovEngine.simulateAttackProgression(5, 24)
        const summary = MarkovEngine.summarize(history)

        expect(summary.probabilityOfCompromiseAt24h).toBeGreaterThanOrEqual(0)
        expect(summary.probabilityOfCompromiseAt24h).toBeLessThanOrEqual(1)
        expect(summary.peakReconnaissanceTime).toBeGreaterThanOrEqual(0)
        expect(summary.peakExploitationTime).toBeGreaterThanOrEqual(0)
    })
})
