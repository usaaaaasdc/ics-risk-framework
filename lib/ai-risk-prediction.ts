/**
 * ICS-Risk Framework - AI-Powered Risk Prediction Engine
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 */

interface HistoricalData {
  devices: Array<{
    type: string
    manufacturer: string
    protocols: string[]
    internetExposed: boolean
    isLegacy: boolean
    riskScore: number
    vulnerabilitiesFound: number
  }>
  timestamp: number
  industry: string
}

interface PredictionResult {
  predictedRiskScore: number
  confidence: number
  trends: {
    label: string
    change: number
    severity: "improving" | "stable" | "worsening"
  }[]
  recommendations: string[]
  futureRisks: {
    timeframe: string
    risk: string
    probability: number
  }[]
}

export class AIRiskPredictor {
  private historicalData: HistoricalData[] = []

  // Load historical data from localStorage
  loadHistoricalData() {
    if (typeof window === "undefined") return

    const stored = localStorage.getItem("ics-risk-history")
    if (stored) {
      try {
        this.historicalData = JSON.parse(stored)
      } catch (e) {
        console.error("Failed to load historical data", e)
      }
    }
  }

  // Save current assessment to history
  saveAssessment(data: Omit<HistoricalData, "timestamp">) {
    if (typeof window === "undefined") return

    const entry: HistoricalData = {
      ...data,
      timestamp: Date.now(),
    }

    this.historicalData.push(entry)

    // Keep only last 50 assessments
    if (this.historicalData.length > 50) {
      this.historicalData = this.historicalData.slice(-50)
    }

    localStorage.setItem("ics-risk-history", JSON.stringify(this.historicalData))
  }

  // Predict risk based on current configuration and historical trends
  predictRisk(currentDevices: HistoricalData["devices"], industry: string): PredictionResult {
    // Calculate base risk score
    const baseRisk = this.calculateBaseRisk(currentDevices)

    // Apply historical trend analysis
    const trendAdjustment = this.analyzeTrends(industry)

    // Calculate predicted score
    const predictedRiskScore = Math.min(10, Math.max(0, baseRisk + trendAdjustment))

    // Calculate confidence based on data availability
    const confidence = this.calculateConfidence()

    // Generate trends
    const trends = this.generateTrends(currentDevices, industry)

    // Generate recommendations
    const recommendations = this.generatePredictiveRecommendations(predictedRiskScore, trends)

    // Predict future risks
    const futureRisks = this.predictFutureRisks(currentDevices, trends)

    return {
      predictedRiskScore,
      confidence,
      trends,
      recommendations,
      futureRisks,
    }
  }

  private calculateBaseRisk(devices: HistoricalData["devices"]): number {
    if (devices.length === 0) return 5

    let totalRisk = 0
    let weights = 0

    devices.forEach((device) => {
      let deviceRisk = device.riskScore || 5

      // Adjust for internet exposure
      if (device.internetExposed) deviceRisk += 1.5

      // Adjust for legacy systems
      if (device.isLegacy) deviceRisk += 1

      // Adjust for vulnerability count
      deviceRisk += Math.min(2, device.vulnerabilitiesFound * 0.2)

      totalRisk += deviceRisk
      weights += 1
    })

    return totalRisk / weights
  }

  private analyzeTrends(industry: string): number {
    if (this.historicalData.length < 2) return 0

    // Filter by industry
    const industryData = this.historicalData.filter((d) => d.industry === industry)

    if (industryData.length < 2) return 0

    // Calculate average risk change over time
    const recent = industryData.slice(-5)
    const older = industryData.slice(-10, -5)

    if (older.length === 0 || recent.length === 0) return 0

    const recentAvg =
      recent.reduce((sum, d) => {
        const avg = d.devices.reduce((s, dev) => s + dev.riskScore, 0) / d.devices.length
        return sum + avg
      }, 0) / recent.length

    const olderAvg =
      older.reduce((sum, d) => {
        const avg = d.devices.reduce((s, dev) => s + dev.riskScore, 0) / d.devices.length
        return sum + avg
      }, 0) / older.length

    return (recentAvg - olderAvg) * 0.3 // Dampening factor
  }

  private calculateConfidence(): number {
    const dataPoints = this.historicalData.length

    if (dataPoints === 0) return 30 // Low confidence with no data
    if (dataPoints < 5) return 50
    if (dataPoints < 15) return 70
    if (dataPoints < 30) return 85
    return 95 // High confidence with lots of data
  }

  private generateTrends(devices: HistoricalData["devices"], industry: string): PredictionResult["trends"] {
    const trends: PredictionResult["trends"] = []

    // Internet exposure trend
    const exposedCount = devices.filter((d) => d.internetExposed).length
    const exposureRate = devices.length > 0 ? exposedCount / devices.length : 0

    if (exposureRate > 0.5) {
      trends.push({
        label: "Internet Exposure",
        change: exposureRate * 100,
        severity: "worsening",
      })
    } else if (exposureRate < 0.2) {
      trends.push({
        label: "Internet Exposure",
        change: exposureRate * 100,
        severity: "improving",
      })
    }

    // Legacy systems trend
    const legacyCount = devices.filter((d) => d.isLegacy).length
    const legacyRate = devices.length > 0 ? legacyCount / devices.length : 0

    if (legacyRate > 0.3) {
      trends.push({
        label: "Legacy Systems",
        change: legacyRate * 100,
        severity: "worsening",
      })
    }

    // Vulnerability density
    const avgVulns = devices.reduce((sum, d) => sum + d.vulnerabilitiesFound, 0) / devices.length || 0

    if (avgVulns > 5) {
      trends.push({
        label: "Vulnerability Density",
        change: avgVulns,
        severity: "worsening",
      })
    } else if (avgVulns < 2) {
      trends.push({
        label: "Vulnerability Density",
        change: avgVulns,
        severity: "improving",
      })
    }

    return trends
  }

  private generatePredictiveRecommendations(predictedRisk: number, trends: PredictionResult["trends"]): string[] {
    const recommendations: string[] = []

    if (predictedRisk > 7) {
      recommendations.push("URGENT: Immediate security audit recommended within 30 days")
      recommendations.push("Consider engaging external ICS security consultants")
    }

    trends.forEach((trend) => {
      if (trend.severity === "worsening") {
        if (trend.label === "Internet Exposure") {
          recommendations.push("Implement network segmentation and DMZ for internet-facing devices")
          recommendations.push("Deploy industrial firewall with deep packet inspection")
        } else if (trend.label === "Legacy Systems") {
          recommendations.push("Create a legacy system replacement roadmap (12-24 months)")
          recommendations.push("Implement compensating controls for legacy devices")
        } else if (trend.label === "Vulnerability Density") {
          recommendations.push("Establish a regular patch management cycle")
          recommendations.push("Subscribe to ICS-CERT advisories for your vendors")
        }
      }
    })

    if (recommendations.length === 0) {
      recommendations.push("Continue current security practices")
      recommendations.push("Schedule next assessment in 6 months")
    }

    return recommendations
  }

  private predictFutureRisks(
    devices: HistoricalData["devices"],
    trends: PredictionResult["trends"],
  ): PredictionResult["futureRisks"] {
    const futureRisks: PredictionResult["futureRisks"] = []

    // Analyze device types
    const hasScada = devices.some((d) => d.type.toLowerCase().includes("scada"))
    const hasHmi = devices.some((d) => d.type.toLowerCase().includes("hmi"))

    if (hasScada && devices.some((d) => d.internetExposed)) {
      futureRisks.push({
        timeframe: "3-6 months",
        risk: "Targeted SCADA attack (ransomware or APT)",
        probability: 0.65,
      })
    }

    if (hasHmi && devices.some((d) => d.isLegacy)) {
      futureRisks.push({
        timeframe: "6-12 months",
        risk: "Legacy HMI exploitation through zero-day vulnerability",
        probability: 0.45,
      })
    }

    const worseningTrends = trends.filter((t) => t.severity === "worsening")
    if (worseningTrends.length >= 2) {
      futureRisks.push({
        timeframe: "1-3 months",
        risk: "Cumulative risk from multiple weakening security postures",
        probability: 0.7,
      })
    }

    if (devices.some((d) => d.protocols.includes("Modbus/TCP"))) {
      futureRisks.push({
        timeframe: "12+ months",
        risk: "Protocol-level attacks on unencrypted Modbus communications",
        probability: 0.4,
      })
    }

    return futureRisks
  }

  // Get statistics for display
  getStatistics() {
    if (this.historicalData.length === 0) {
      return {
        totalAssessments: 0,
        averageRisk: 0,
        trend: "stable" as const,
        mostCommonIndustry: "N/A",
      }
    }

    const totalAssessments = this.historicalData.length

    const averageRisk =
      this.historicalData.reduce((sum, data) => {
        const avg = data.devices.reduce((s, d) => s + d.riskScore, 0) / data.devices.length
        return sum + avg
      }, 0) / totalAssessments

    // Calculate trend
    const recent = this.historicalData.slice(-5)
    const older = this.historicalData.slice(-10, -5)

    let trend: "improving" | "stable" | "worsening" = "stable"

    if (recent.length > 0 && older.length > 0) {
      const recentAvg =
        recent.reduce((sum, d) => {
          const avg = d.devices.reduce((s, dev) => s + dev.riskScore, 0) / d.devices.length
          return sum + avg
        }, 0) / recent.length

      const olderAvg =
        older.reduce((sum, d) => {
          const avg = d.devices.reduce((s, dev) => s + dev.riskScore, 0) / d.devices.length
          return sum + avg
        }, 0) / older.length

      if (recentAvg > olderAvg + 0.5) trend = "worsening"
      else if (recentAvg < olderAvg - 0.5) trend = "improving"
    }

    // Most common industry
    const industryCounts: Record<string, number> = {}
    this.historicalData.forEach((d) => {
      industryCounts[d.industry] = (industryCounts[d.industry] || 0) + 1
    })

    const mostCommonIndustry = Object.entries(industryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

    return {
      totalAssessments,
      averageRisk: Math.round(averageRisk * 10) / 10,
      trend,
      mostCommonIndustry,
    }
  }
}
