
import { describe, it, expect } from 'vitest'
import { runMonteCarloSimulation, type SimulationParams } from '@/lib/calculators/risk-engine'

describe('Monte Carlo Risk Engine', () => {
    const defaultParams: SimulationParams = {
        baseImpact: 5,
        baseLikelihood: 0.5,
        mitigationFactor: 0.0,
        uncertainty: 0.1,
        iterations: 1000
    }

    it('should run simulation and return statistical data', () => {
        const result = runMonteCarloSimulation(defaultParams)

        expect(result).toHaveProperty('mean')
        expect(result).toHaveProperty('p90')
        expect(result).toHaveProperty('p10')
        expect(result.data.length).toBeGreaterThan(0)

        // Mean should be roughly Impact * Likelihood * 10 
        // 5 * 0.5 * 10 = 25
        expect(result.mean).toBeGreaterThan(20)
        expect(result.mean).toBeLessThan(30)
    })

    it('should reflect mitigation impact', () => {
        const noMitigation = runMonteCarloSimulation(defaultParams)

        const withMitigation = runMonteCarloSimulation({
            ...defaultParams,
            mitigationFactor: 0.5 // 50% Reduction
        })

        // Risk should be significantly lower with mitigation
        expect(withMitigation.mean).toBeLessThan(noMitigation.mean)
        console.log(`Risk reduced from ${noMitigation.mean.toFixed(2)} to ${withMitigation.mean.toFixed(2)}`)
    })

    it('should handle uncertainty correctly', () => {
        const lowUncertainty = runMonteCarloSimulation({
            ...defaultParams,
            uncertainty: 0.01
        })

        const highUncertainty = runMonteCarloSimulation({
            ...defaultParams,
            uncertainty: 0.5
        })

        // Higher uncertainty should lead to wider spread between p10 and p90
        const spreadLow = lowUncertainty.p90 - lowUncertainty.p10
        const spreadHigh = highUncertainty.p90 - highUncertainty.p10

        expect(spreadHigh).toBeGreaterThan(spreadLow)
    })

    it('should clamp values within bounds', () => {
        const result = runMonteCarloSimulation({
            baseImpact: 10, // Max
            baseLikelihood: 1, // Max
            mitigationFactor: 0,
            uncertainty: 0.5, // High variance
            iterations: 1000
        })

        // Maximum theoretical risk is 10 * 1 * 10 = 100
        // But our engine clamps inputs, so output shouldn't explode
        expect(result.p90).toBeLessThanOrEqual(100)

        result.data.forEach(bin => {
            expect(bin.riskScore).toBeGreaterThanOrEqual(0)
            expect(bin.riskScore).toBeLessThanOrEqual(100)
        })
    })
})
