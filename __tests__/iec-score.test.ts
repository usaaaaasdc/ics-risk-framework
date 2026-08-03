import { describe, expect, it } from "vitest"
import { calculateIECScore } from "@/lib/calculators/iec-score"
import { iec62443Standards } from "@/lib/standards/iec62443"

const idsForLevel = (level: number) =>
    iec62443Standards.flatMap((fr) =>
        fr.requirements.filter((req) => req.requiredForSL === level).map((req) => req.id),
    )

describe("IEC 62443 baseline scoring", () => {
    it("keeps overall SL at 0 when only one requirement is checked", () => {
        const result = calculateIECScore([iec62443Standards[0].requirements[0].id])

        expect(result.overallSL).toBe(0)
    })

    it("uses weakest-link scoring across foundational requirements", () => {
        const onlyFr1Requirements = iec62443Standards[0].requirements.map((req) => req.id)
        const result = calculateIECScore(onlyFr1Requirements)

        expect(result.frScores.find((score) => score.frId === "FR1")?.achievedSL).toBeGreaterThan(0)
        expect(result.overallSL).toBe(0)
    })

    it("calculates SL-1 and SL-2 for the available baseline dataset", () => {
        const sl1 = calculateIECScore(idsForLevel(1))
        const sl2 = calculateIECScore([...idsForLevel(1), ...idsForLevel(2)])

        expect(sl1.overallSL).toBe(1)
        expect(sl2.overallSL).toBe(2)
    })

    it("documents that no detailed SL-3 or SL-4 requirement data is available yet", () => {
        const highestRequirementLevel = Math.max(...iec62443Standards.flatMap((fr) => fr.requirements.map((req) => req.requiredForSL)))

        expect(highestRequirementLevel).toBe(2)
    })
})
