export interface SimulationParams {
    baseImpact: number // 1-10
    baseLikelihood: number // 0-1
    mitigationFactor: number // 0-1 (e.g., 0.8 means 80% reduction)
    uncertainty: number // 0-1 (Standard Deviation factor)
    iterations: number
}

export interface SimulationResult {
    riskScore: number
    count: number
}

export interface SimulationStats {
    mean: number
    p90: number // 90% confidence the risk is below this
    p10: number // 10% chance the risk is below this (optimistic)
    data: SimulationResult[]
}

export function runMonteCarloSimulation(params: SimulationParams): SimulationStats {
    const results: number[] = []

    for (let i = 0; i < params.iterations; i++) {
        // Randomize likelihood and impact within uncertainty bounds (Normal distribution approximation)
        // Box-Muller transform for normal distribution
        const u1 = Math.random()
        const u2 = Math.random()
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
        const mitigationEffect = params.mitigationFactor * (1 + (Math.random() - 0.5) * 0.2)

        const residualRisk = scenarioImpact * scenarioLikelihood * 10 * (1 - Math.max(0, Math.min(1, mitigationEffect)))
        results.push(Math.round(residualRisk * 10) / 10) // Round to 1 decimal
    }

    // Sort for statistics
    results.sort((a, b) => a - b)

    // Calculate Stats
    const sum = results.reduce((a, b) => a + b, 0)
    const mean = sum / results.length
    const p90 = results[Math.floor(results.length * 0.9)]
    const p10 = results[Math.floor(results.length * 0.1)]

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
        data: histogramData
    }
}
