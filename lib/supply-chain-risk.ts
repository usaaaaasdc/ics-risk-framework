export interface VendorRiskProfile {
  vendor: string
  trustScore: number // 0-100
  cveHistory: {
    year: number
    critical: number
    high: number
    medium: number
    low: number
  }[]
  responseTime: {
    avg_days: number
    rating: "Excellent" | "Good" | "Fair" | "Poor"
  }
  marketShare: number
  certifications: string[]
  incidents: {
    year: number
    description: string
    severity: "Critical" | "High" | "Medium" | "Low"
  }[]
  recommendations: string[]
}

export function calculateVendorRisk(vendor: string): VendorRiskProfile {
  const vendors: Record<string, VendorRiskProfile> = {
    Siemens: {
      vendor: "Siemens",
      trustScore: 85,
      cveHistory: [
        { year: 2023, critical: 12, high: 28, medium: 45, low: 23 },
        { year: 2022, critical: 15, high: 32, medium: 50, low: 28 },
        { year: 2021, critical: 10, high: 25, medium: 40, low: 20 },
      ],
      responseTime: {
        avg_days: 45,
        rating: "Good",
      },
      marketShare: 25,
      certifications: ["IEC 62443-4-1", "ISO 27001", "Common Criteria EAL4+"],
      incidents: [
        {
          year: 2022,
          description: "Critical vulnerability in S7 communication processor",
          severity: "Critical",
        },
        {
          year: 2021,
          description: "Denial of service in Profinet implementation",
          severity: "High",
        },
      ],
      recommendations: [
        "Strong security track record with quick response times",
        "Extensive certifications demonstrate commitment to security",
        "Regular security updates and patches available",
        "Consider implementing additional network segmentation",
      ],
    },
    "Rockwell Automation": {
      vendor: "Rockwell Automation",
      trustScore: 82,
      cveHistory: [
        { year: 2023, critical: 8, high: 22, medium: 38, low: 18 },
        { year: 2022, critical: 10, high: 25, medium: 42, low: 20 },
        { year: 2021, critical: 6, high: 20, medium: 35, low: 15 },
      ],
      responseTime: {
        avg_days: 38,
        rating: "Good",
      },
      marketShare: 20,
      certifications: ["IEC 62443-4-1", "ISO 27001", "UL 2900-1"],
      incidents: [
        {
          year: 2023,
          description: "Authentication bypass in FactoryTalk View",
          severity: "High",
        },
        {
          year: 2022,
          description: "Buffer overflow in ControlLogix firmware",
          severity: "Critical",
        },
      ],
      recommendations: [
        "Good security posture with proactive vulnerability management",
        "Strong North American market presence",
        "Regular security advisories and updates",
        "Implement defense-in-depth strategy",
      ],
    },
    "Schneider Electric": {
      vendor: "Schneider Electric",
      trustScore: 80,
      cveHistory: [
        { year: 2023, critical: 10, high: 26, medium: 42, low: 22 },
        { year: 2022, critical: 12, high: 30, medium: 48, low: 25 },
        { year: 2021, critical: 8, high: 24, medium: 40, low: 20 },
      ],
      responseTime: {
        avg_days: 52,
        rating: "Fair",
      },
      marketShare: 18,
      certifications: ["IEC 62443-4-1", "ISO 27001", "Achilles Level 2"],
      incidents: [
        {
          year: 2023,
          description: "Remote code execution in Modicon controllers",
          severity: "Critical",
        },
        {
          year: 2022,
          description: "Hardcoded credentials in EcoStruxure",
          severity: "High",
        },
      ],
      recommendations: [
        "Moderate security track record with room for improvement",
        "Longer response times compared to competitors",
        "Strong European market presence",
        "Ensure all patches are applied promptly",
      ],
    },
    HollySys: {
      vendor: "HollySys",
      trustScore: 65,
      cveHistory: [
        { year: 2023, critical: 15, high: 30, medium: 40, low: 15 },
        { year: 2022, critical: 12, high: 25, medium: 35, low: 12 },
        { year: 2021, critical: 8, high: 18, medium: 28, low: 10 },
      ],
      responseTime: {
        avg_days: 90,
        rating: "Poor",
      },
      marketShare: 8,
      certifications: ["ISO 9001", "CE"],
      incidents: [
        {
          year: 2023,
          description: "Buffer overflow in Modbus TCP implementation",
          severity: "Critical",
        },
        {
          year: 2022,
          description: "Unpatched vulnerabilities discovered in legacy products",
          severity: "High",
        },
      ],
      recommendations: [
        "Lower trust score due to slower response times",
        "Limited international certifications",
        "Strong presence in Asian markets",
        "Consider additional security controls and monitoring",
        "Evaluate alternative vendors for critical applications",
      ],
    },
    Mitsubishi: {
      vendor: "Mitsubishi",
      trustScore: 78,
      cveHistory: [
        { year: 2023, critical: 6, high: 18, medium: 32, low: 16 },
        { year: 2022, critical: 8, high: 20, medium: 35, low: 18 },
        { year: 2021, critical: 5, high: 15, medium: 28, low: 14 },
      ],
      responseTime: {
        avg_days: 60,
        rating: "Fair",
      },
      marketShare: 12,
      certifications: ["IEC 62443-4-1", "ISO 27001"],
      incidents: [
        {
          year: 2023,
          description: "Denial of service in MELSEC series",
          severity: "High",
        },
      ],
      recommendations: [
        "Solid security record with moderate response times",
        "Strong in Asian and Japanese markets",
        "Regular firmware updates available",
        "Language barriers may affect support experience",
      ],
    },
  }

  return (
    vendors[vendor] || {
      vendor,
      trustScore: 50,
      cveHistory: [],
      responseTime: { avg_days: 0, rating: "Fair" },
      marketShare: 0,
      certifications: [],
      incidents: [],
      recommendations: ["No historical data available for this vendor"],
    }
  )
}

export function compareVendors(vendors: string[]): {
  comparison: VendorRiskProfile[]
  recommendation: string
} {
  const profiles = vendors.map((v) => calculateVendorRisk(v))
  const bestVendor = profiles.reduce((prev, current) => (prev.trustScore > current.trustScore ? prev : current))

  return {
    comparison: profiles,
    recommendation: `Based on trust scores and security track records, ${bestVendor.vendor} (${bestVendor.trustScore}/100) appears to be the most secure option among the selected vendors.`,
  }
}

export function calculateSupplyChainRisk(devices: { manufacturer: string }[]): {
  overallRisk: number
  vendorBreakdown: { vendor: string; count: number; avgTrustScore: number }[]
  diversificationScore: number
  recommendations: string[]
} {
  const vendorCounts: Record<string, number> = {}
  const vendorScores: Record<string, number[]> = {}

  devices.forEach((device) => {
    const vendor = device.manufacturer
    vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1

    const profile = calculateVendorRisk(vendor)
    if (!vendorScores[vendor]) {
      vendorScores[vendor] = []
    }
    vendorScores[vendor].push(profile.trustScore)
  })

  const vendorBreakdown = Object.entries(vendorCounts).map(([vendor, count]) => ({
    vendor,
    count,
    avgTrustScore: vendorScores[vendor].reduce((a, b) => a + b, 0) / vendorScores[vendor].length,
  }))

  const totalDevices = devices.length
  const uniqueVendors = Object.keys(vendorCounts).length
  const diversificationScore = Math.min(100, (uniqueVendors / Math.max(totalDevices / 10, 1)) * 100)

  const avgTrustScore = vendorBreakdown.reduce((sum, v) => sum + v.avgTrustScore, 0) / vendorBreakdown.length

  const overallRisk = 100 - (avgTrustScore * 0.7 + diversificationScore * 0.3)

  const recommendations: string[] = []

  if (diversificationScore < 50) {
    recommendations.push("⚠️ Low vendor diversification increases supply chain risk")
    recommendations.push("Consider diversifying across multiple vendors to reduce dependency")
  }

  if (avgTrustScore < 70) {
    recommendations.push("⚠️ Some vendors have lower trust scores")
    recommendations.push("Review security track records of vendors with scores below 70")
  }

  const dominantVendor = vendorBreakdown.reduce((prev, current) => (prev.count > current.count ? prev : current))

  if (dominantVendor.count / totalDevices > 0.6) {
    recommendations.push(
      `⚠️ High dependency on ${dominantVendor.vendor} (${Math.round((dominantVendor.count / totalDevices) * 100)}% of devices)`,
    )
    recommendations.push("Develop contingency plans in case of vendor-wide vulnerabilities")
  }

  if (recommendations.length === 0) {
    recommendations.push("✓ Good supply chain risk management")
    recommendations.push("✓ Balanced vendor distribution detected")
  }

  return {
    overallRisk,
    vendorBreakdown,
    diversificationScore,
    recommendations,
  }
}
