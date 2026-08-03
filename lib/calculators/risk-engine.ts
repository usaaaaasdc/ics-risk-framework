export interface SimulationParams {
    baseImpact: number // 1-10
    baseLikelihood: number // 0-1
    mitigationFactor: number // 0-1 (e.g., 0.8 means 80% reduction)
    uncertainty: number // 0-1 (Standard Deviation factor)
    iterations: number
    seed?: number // Optional deterministic seed for reproducibility
}

export interface SimulationResult {
    riskScore: number
    count: number
}

export interface SimulationStats {
    mean: number
    p90: number // 90% confidence the risk is below this
    p10: number // 10% chance the risk is below this (optimistic)
    median: number
    standardDeviation: number
    minRisk: number
    maxRisk: number
    confidenceInterval95: {
        lower: number
        upper: number
    }
    iterations: number
    data: SimulationResult[]
    rawResults: number[]
    equation: string
}

export const MONTE_CARLO_EQUATION =
    "Residual Risk Score (0-100) = Impact(1-10) x Likelihood(0-1) x 10 x (1 - Mitigation Efficacy)"

function createSeededRandom(seed?: number): () => number {
    if (seed === undefined || !Number.isFinite(seed)) return Math.random

    // Mulberry32 deterministic PRNG. This changes only random sampling order, not the risk equation.
    let state = seed >>> 0
    return () => {
        state += 0x6D2B79F5
        let t = state
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function percentile(sorted: number[], percentileValue: number): number {
    if (sorted.length === 0) return 0
    const index = Math.min(sorted.length - 1, Math.max(0, Math.floor(sorted.length * percentileValue)))
    return sorted[index]
}

export function runMonteCarloSimulation(params: SimulationParams): SimulationStats {
    const results: number[] = []
    const random = createSeededRandom(params.seed)

    for (let i = 0; i < params.iterations; i++) {
        // Randomize likelihood and impact within uncertainty bounds (Normal distribution approximation)
        // Box-Muller transform for normal distribution
        const u1 = Math.max(random(), Number.EPSILON)
        const u2 = random()
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)

        // Apply variation
        const variation = z * params.uncertainty

        // Calculate scenario likelihood (clamped 0-1)
        let scenarioLikelihood = params.baseLikelihood + (variation * 0.2) // Scale variation
        scenarioLikelihood = Math.max(0, Math.min(1, scenarioLikelihood))

        // Calculate scenario impact (clamped 1-10)
        let scenarioImpact = params.baseImpact + (variation * 0.5)
        scenarioImpact = Math.max(1, Math.min(10, scenarioImpact))

        // Calculate Risk = Impact * Likelihood * (1 - Mitigation)
        // Add random noise to mitigation efficacy too
        const mitigationEffect = params.mitigationFactor * (1 + (random() - 0.5) * 0.2)

        const residualRisk = scenarioImpact * scenarioLikelihood * 10 * (1 - Math.max(0, Math.min(1, mitigationEffect)))
        results.push(Math.round(residualRisk * 10) / 10) // Round to 1 decimal
    }

    // Sort for statistics
    results.sort((a, b) => a - b)

    // Calculate Stats
    const sum = results.reduce((a, b) => a + b, 0)
    const mean = sum / results.length
    const p90 = percentile(results, 0.9)
    const p10 = percentile(results, 0.1)
    const median = percentile(results, 0.5)
    const variance = results.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / results.length
    const standardDeviation = Math.sqrt(variance)
    const minRisk = results[0] ?? 0
    const maxRisk = results[results.length - 1] ?? 0
    const marginOfError95 = 1.96 * (standardDeviation / Math.sqrt(results.length || 1))

    // Group for Histogram (Frequency Distribution)
    const distribution: Record<number, number> = {}
    results.forEach(r => {
        const bin = Math.floor(r) // Group by integer buckets
        distribution[bin] = (distribution[bin] || 0) + 1
    })

    const histogramData = Object.keys(distribution).map(bin => ({
        riskScore: Number(bin),
        count: distribution[Number(bin)]
    })).sort((a, b) => a.riskScore - b.riskScore)

    return {
        mean,
        p90,
        p10,
        median,
        standardDeviation,
        minRisk,
        maxRisk,
        confidenceInterval95: {
            lower: mean - marginOfError95,
            upper: mean + marginOfError95,
        },
        iterations: params.iterations,
        data: histogramData,
        rawResults: [...results],
        equation: MONTE_CARLO_EQUATION,
    }
}

export function monteCarloSummaryToCsv(stats: SimulationStats): string {
    const rows = [
        ["metric", "value"],
        ["mean", stats.mean],
        ["median", stats.median],
        ["p10", stats.p10],
        ["p90", stats.p90],
        ["standardDeviation", stats.standardDeviation],
        ["minRisk", stats.minRisk],
        ["maxRisk", stats.maxRisk],
        ["ci95Lower", stats.confidenceInterval95.lower],
        ["ci95Upper", stats.confidenceInterval95.upper],
        ["iterations", stats.iterations],
    ]
    return rows.map((row) => row.join(",")).join("\n")
}

export function monteCarloDistributionToCsv(stats: SimulationStats): string {
    const rows = [["sample", "residual_risk_score"], ...stats.rawResults.map((risk, index) => [index + 1, risk])]
    return rows.map((row) => row.join(",")).join("\n")
}
