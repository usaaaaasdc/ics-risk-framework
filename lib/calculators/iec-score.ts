import { iec62443Standards, SecurityLevel } from "../standards/iec62443"

export interface CalculationResult {
    overallSL: SecurityLevel
    frScores: {
        frId: string
        achievedSL: SecurityLevel
        percentage: number
        missingRequirements: string[]
    }[]
}

export function calculateIECScore(checkedRequirements: string[]): CalculationResult {
    const frScores = iec62443Standards.map((fr) => {
        // Determine the highest SL achieved for this FR
        // We assume to achieve SL N, you must achieve all requirements for SL N AND all requirements for SL < N?
        // Simplified model: Score is determined by the "weakest link" or accumulated points.
        // Standard approach: To achieve SL-T 1, all SL 1 requirements must be met.

        let achievedSL: SecurityLevel = 0
        let totalReqs = fr.requirements.length
        let metReqs = 0
        const missing: string[] = []

        // Check SL1
        const sl1Reqs = fr.requirements.filter(r => r.requiredForSL === 1)
        const sl1Met = sl1Reqs.every(r => checkedRequirements.includes(r.id))

        // Check SL2
        const sl2Reqs = fr.requirements.filter(r => r.requiredForSL === 2)
        const sl2Met = sl2Reqs.every(r => checkedRequirements.includes(r.id))

        if (sl1Met) achievedSL = 1
        if (sl1Met && sl2Met) achievedSL = 2
        // Extend logic for 3 and 4 if data existed

        // Calculate generic percentage for progress bar
        fr.requirements.forEach(r => {
            if (checkedRequirements.includes(r.id)) {
                metReqs++
            } else {
                missing.push(r.id)
            }
        })

        const percentage = totalReqs > 0 ? Math.round((metReqs / totalReqs) * 100) : 100

        return {
            frId: fr.id,
            achievedSL,
            percentage,
            missingRequirements: missing
        }
    })

    // Overall SL is the minimum of all FR SLs (Weakest Link Principle)
    const slValues = frScores.map(s => s.achievedSL)
    const overallSL = slValues.length > 0 ? Math.min(...slValues) as SecurityLevel : 0

    return {
        overallSL,
        frScores,
    }
}
