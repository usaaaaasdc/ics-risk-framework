import type { RiskAssessment, SystemConfig } from "./risk-engine"

export interface CostEstimationInput {
  dailyRevenue: number // Daily revenue in EUR
  downtimeCostPerHour: number // Cost of downtime per hour
  recoveryTimeHours: number // Estimated recovery time
  dataLossImpact: number // Estimated cost of data loss
  reputationImpact: number // Estimated reputation damage cost
  regulatoryFines: number // Potential regulatory fines
  industryType: string
}

export interface CostEstimationResult {
  totalFinancialRisk: number
  breakdown: {
    downtimeCost: number
    dataLossCost: number
    reputationCost: number
    regulatoryCost: number
    incidentResponseCost: number
    recoveryAndRemediationCost: number
  }
  annualizedLossExpectancy: number // ALE
  returnOnSecurityInvestment: {
    recommendedBudget: number
    paybackPeriod: string
    costBenefitRatio: number
  }
  industryBenchmark: {
    averageCost: number
    yourPosition: "Above Average" | "Average" | "Below Average"
  }
}

// Industry-specific average breach costs (in EUR)
const industryAverageCosts: Record<string, number> = {
  Manufacturing: 420000,
  Energy: 680000,
  "Water Treatment": 520000,
  "Oil & Gas": 750000,
  Chemical: 580000,
  Pharmaceutical: 620000,
  Automotive: 480000,
  "Food & Beverage": 390000,
  Transportation: 510000,
  Utilities: 590000,
}

export function calculateCostEstimation(
  assessment: RiskAssessment,
  config: SystemConfig,
  input: CostEstimationInput,
): CostEstimationResult {
  // Calculate downtime cost
  const downtimeCost = input.downtimeCostPerHour * input.recoveryTimeHours

  // Calculate data loss cost
  const dataLossCost = input.dataLossImpact

  // Calculate reputation cost
  const reputationCost = input.reputationImpact

  // Calculate regulatory cost
  const regulatoryCost = input.regulatoryFines

  // Incident response cost (typically 15-20% of total breach cost)
  const incidentResponseCost = (downtimeCost + dataLossCost) * 0.18

  // Recovery and remediation cost
  const vulnerabilityCount = assessment.vulnerabilities.length
  const criticalVulnCount = assessment.vulnerabilities.filter((v) => v.cvss >= 9).length
  const highVulnCount = assessment.vulnerabilities.filter((v) => v.cvss >= 7 && v.cvss < 9).length

  const recoveryAndRemediationCost = criticalVulnCount * 25000 + highVulnCount * 10000 + vulnerabilityCount * 2000

  // Total financial risk
  const totalFinancialRisk =
    downtimeCost + dataLossCost + reputationCost + regulatoryCost + incidentResponseCost + recoveryAndRemediationCost

  // Annualized Loss Expectancy (ALE) = Asset Value × Exposure Factor × Annual Rate of Occurrence
  // Using risk score as probability indicator (risk score / 10 as percentage)
  const attackProbability = assessment.riskScore / 10 // 0 to 1
  const annualizedLossExpectancy = totalFinancialRisk * attackProbability

  // Recommended security budget (typically 10-15% of ALE)
  const recommendedBudget = annualizedLossExpectancy * 0.12

  // Calculate ROI metrics
  const costBenefitRatio = annualizedLossExpectancy / recommendedBudget
  const paybackPeriod =
    costBenefitRatio > 1 ? `${(1 / (costBenefitRatio - 1)).toFixed(1)} years` : "Immediate positive return"

  // Industry benchmark
  const industryAverage = industryAverageCosts[input.industryType] || 500000
  let yourPosition: "Above Average" | "Average" | "Below Average"

  if (totalFinancialRisk > industryAverage * 1.2) {
    yourPosition = "Above Average"
  } else if (totalFinancialRisk < industryAverage * 0.8) {
    yourPosition = "Below Average"
  } else {
    yourPosition = "Average"
  }

  return {
    totalFinancialRisk,
    breakdown: {
      downtimeCost,
      dataLossCost,
      reputationCost,
      regulatoryCost,
      incidentResponseCost,
      recoveryAndRemediationCost,
    },
    annualizedLossExpectancy,
    returnOnSecurityInvestment: {
      recommendedBudget,
      paybackPeriod,
      costBenefitRatio,
    },
    industryBenchmark: {
      averageCost: industryAverage,
      yourPosition,
    },
  }
}

// Preset values by industry type
export const industryPresets: Record<
  string,
  {
    downtimeCostPerHour: number
    recoveryTimeHours: number
    dataLossImpact: number
    reputationImpact: number
    regulatoryFines: number
  }
> = {
  Manufacturing: {
    downtimeCostPerHour: 15000,
    recoveryTimeHours: 24,
    dataLossImpact: 50000,
    reputationImpact: 80000,
    regulatoryFines: 100000,
  },
  Energy: {
    downtimeCostPerHour: 35000,
    recoveryTimeHours: 36,
    dataLossImpact: 80000,
    reputationImpact: 150000,
    regulatoryFines: 250000,
  },
  "Water Treatment": {
    downtimeCostPerHour: 20000,
    recoveryTimeHours: 48,
    dataLossImpact: 60000,
    reputationImpact: 120000,
    regulatoryFines: 200000,
  },
  "Oil & Gas": {
    downtimeCostPerHour: 45000,
    recoveryTimeHours: 72,
    dataLossImpact: 100000,
    reputationImpact: 200000,
    regulatoryFines: 350000,
  },
  Chemical: {
    downtimeCostPerHour: 25000,
    recoveryTimeHours: 48,
    dataLossImpact: 70000,
    reputationImpact: 130000,
    regulatoryFines: 220000,
  },
  Pharmaceutical: {
    downtimeCostPerHour: 30000,
    recoveryTimeHours: 36,
    dataLossImpact: 90000,
    reputationImpact: 140000,
    regulatoryFines: 280000,
  },
  Automotive: {
    downtimeCostPerHour: 22000,
    recoveryTimeHours: 30,
    dataLossImpact: 60000,
    reputationImpact: 100000,
    regulatoryFines: 150000,
  },
  "Food & Beverage": {
    downtimeCostPerHour: 12000,
    recoveryTimeHours: 24,
    dataLossImpact: 40000,
    reputationImpact: 90000,
    regulatoryFines: 120000,
  },
  Transportation: {
    downtimeCostPerHour: 18000,
    recoveryTimeHours: 36,
    dataLossImpact: 65000,
    reputationImpact: 110000,
    regulatoryFines: 180000,
  },
  Utilities: {
    downtimeCostPerHour: 28000,
    recoveryTimeHours: 48,
    dataLossImpact: 75000,
    reputationImpact: 135000,
    regulatoryFines: 240000,
  },
}
