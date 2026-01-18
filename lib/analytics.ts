import { ProjectManager } from "./project-manager"

export interface AnalyticsData {
  totalProjects: number
  totalVulnerabilities: number
  averageRiskScore: number
  criticalSystems: number
  highRiskSystems: number
  mediumRiskSystems: number
  lowRiskSystems: number
  vulnerabilityTrends: VulnerabilityTrend[]
  deviceTypeDistribution: DeviceTypeStats[]
  protocolUsage: ProtocolStats[]
  topVulnerabilities: TopVulnerability[]
  complianceOverview: ComplianceStats
  industryDistribution: IndustryStats[]
}

export interface VulnerabilityTrend {
  date: string
  count: number
  critical: number
  high: number
  medium: number
  low: number
}

export interface DeviceTypeStats {
  type: string
  count: number
  averageRisk: number
}

export interface ProtocolStats {
  protocol: string
  usage: number
  riskLevel: "High" | "Medium" | "Low"
}

export interface TopVulnerability {
  cveId: string
  occurrences: number
  averageCVSS: number
  severity: string
}

export interface ComplianceStats {
  iec62443Average: number
  nistAverage: number
  compliantProjects: number
  nonCompliantProjects: number
}

export interface IndustryStats {
  industry: string
  projectCount: number
  averageRisk: number
}

export function generateAnalytics(): AnalyticsData {
  const projects = ProjectManager.getAllProjects()

  const totalProjects = projects.length

  // Count total vulnerabilities
  let totalVulnerabilities = 0
  let totalRiskScore = 0
  let criticalSystems = 0
  let highRiskSystems = 0
  let mediumRiskSystems = 0
  let lowRiskSystems = 0

  projects.forEach((project) => {
    if (project.assessment) {
      totalVulnerabilities += project.assessment.vulnerabilities?.length || 0
      totalRiskScore += project.assessment.riskScore || 0

      if (project.assessment.riskScore >= 9) criticalSystems++
      else if (project.assessment.riskScore >= 7) highRiskSystems++
      else if (project.assessment.riskScore >= 4) mediumRiskSystems++
      else lowRiskSystems++
    }
  })

  const averageRiskScore = totalProjects > 0 ? totalRiskScore / totalProjects : 0

  // Vulnerability trends (last 30 days)
  const vulnerabilityTrends: VulnerabilityTrend[] = []
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toISOString().split("T")[0]
  })

  last30Days.forEach((date) => {
    const projectsOnDate = projects.filter((p) => p.createdAt.split("T")[0] === date)
    let critical = 0,
      high = 0,
      medium = 0,
      low = 0

    projectsOnDate.forEach((p) => {
      if (p.assessment) {
        p.assessment.vulnerabilities?.forEach((v: any) => {
          if (v.severity === "CRITICAL") critical++
          else if (v.severity === "HIGH") high++
          else if (v.severity === "MEDIUM") medium++
          else low++
        })
      }
    })

    vulnerabilityTrends.push({
      date,
      count: critical + high + medium + low,
      critical,
      high,
      medium,
      low,
    })
  })

  // Device type distribution
  const deviceTypeMap = new Map<string, { count: number; totalRisk: number }>()
  projects.forEach((project) => {
    if (project.config?.deviceType) {
      const existing = deviceTypeMap.get(project.config.deviceType) || { count: 0, totalRisk: 0 }
      deviceTypeMap.set(project.config.deviceType, {
        count: existing.count + 1,
        totalRisk: existing.totalRisk + (project.assessment?.riskScore || 0),
      })
    }
  })

  const deviceTypeDistribution: DeviceTypeStats[] = Array.from(deviceTypeMap.entries()).map(([type, data]) => ({
    type,
    count: data.count,
    averageRisk: data.count > 0 ? data.totalRisk / data.count : 0,
  }))

  // Protocol usage
  const protocolMap = new Map<string, number>()
  projects.forEach((project) => {
    project.config?.protocols?.forEach((protocol: string) => {
      protocolMap.set(protocol, (protocolMap.get(protocol) || 0) + 1)
    })
  })

  const protocolUsage: ProtocolStats[] = Array.from(protocolMap.entries()).map(([protocol, usage]) => {
    let riskLevel: "High" | "Medium" | "Low" = "Low"
    if (["Modbus TCP", "Modbus RTU", "DNP3"].includes(protocol)) riskLevel = "High"
    else if (["Profinet", "EtherNet/IP", "S7 Protocol"].includes(protocol)) riskLevel = "Medium"

    return { protocol, usage, riskLevel }
  })

  // Top vulnerabilities
  const vulnMap = new Map<string, { count: number; totalCVSS: number; severity: string }>()
  projects.forEach((project) => {
    project.assessment?.vulnerabilities?.forEach((v: any) => {
      const existing = vulnMap.get(v.id) || { count: 0, totalCVSS: 0, severity: v.severity }
      vulnMap.set(v.id, {
        count: existing.count + 1,
        totalCVSS: existing.totalCVSS + v.cvss,
        severity: v.severity,
      })
    })
  })

  const topVulnerabilities: TopVulnerability[] = Array.from(vulnMap.entries())
    .map(([cveId, data]) => ({
      cveId,
      occurrences: data.count,
      averageCVSS: data.count > 0 ? data.totalCVSS / data.count : 0,
      severity: data.severity,
    }))
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, 10)

  // Compliance overview (mock data - would be calculated from actual compliance checks)
  const complianceOverview: ComplianceStats = {
    iec62443Average: 65,
    nistAverage: 58,
    compliantProjects: Math.floor(totalProjects * 0.3),
    nonCompliantProjects: Math.ceil(totalProjects * 0.7),
  }

  // Industry distribution
  const industryMap = new Map<string, { count: number; totalRisk: number }>()
  projects.forEach((project) => {
    const industry = project.industry || "Unknown"
    const existing = industryMap.get(industry) || { count: 0, totalRisk: 0 }
    industryMap.set(industry, {
      count: existing.count + 1,
      totalRisk: existing.totalRisk + (project.assessment?.riskScore || 0),
    })
  })

  const industryDistribution: IndustryStats[] = Array.from(industryMap.entries()).map(([industry, data]) => ({
    industry,
    projectCount: data.count,
    averageRisk: data.count > 0 ? data.totalRisk / data.count : 0,
  }))

  return {
    totalProjects,
    totalVulnerabilities,
    averageRiskScore,
    criticalSystems,
    highRiskSystems,
    mediumRiskSystems,
    lowRiskSystems,
    vulnerabilityTrends,
    deviceTypeDistribution,
    protocolUsage,
    topVulnerabilities,
    complianceOverview,
    industryDistribution,
  }
}
