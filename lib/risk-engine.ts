/**
 * ICS-Risk Framework - Risk Assessment Engine
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 *
 * This module implements the core risk assessment algorithm combining
 * CVSS scoring, exposure analysis, and legacy system evaluation.
 */

import { improvedMatcher } from "./improved-matching"
import { compareWithBaseline, type BaselineComparisonResult } from "./secure-baseline"

export interface SystemConfig {
  deviceType: string
  manufacturer: string
  model: string
  protocols: string[]
  interfaces: string[]
  internetConnected: boolean
  connectedToIT: boolean
  osVersion?: string
  isLegacy: boolean
}

export interface Vulnerability {
  id: string
  device: string
  protocol: string
  cvss: number
  severity: string
  description: string
  description_ar: string
  recommendation: string
  recommendation_ar: string
  category: string
}

export interface RiskAssessment {
  riskScore: number
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  vulnerabilities: Vulnerability[]
  vulnerabilityConfidence: Map<string, number>
  recommendations: string[]
  recommendations_ar: string[]
  attackSurface: {
    exposureLevel: string
    criticalPoints: string[]
  }
  baselineComparison?: BaselineComparisonResult
}

export function calculateRiskScore(config: SystemConfig, vulnerabilities: Vulnerability[]): number {
  const cvssAvg =
    vulnerabilities.length > 0 ? vulnerabilities.reduce((sum, vuln) => sum + vuln.cvss, 0) / vulnerabilities.length : 0

  // Internet exposure: scale to 0-10 for the formula
  const internetExposure = config.internetConnected ? 10 : 0

  // Legacy device weight: scale to 0-10
  const legacyWeight = config.isLegacy ? 10 : 0

  // Risk Score = (CVSS_avg × 0.6) + (Internet_Exposure × 0.3) + (Legacy_Weight × 0.1)
  const riskScore = cvssAvg * 0.6 + internetExposure * 0.3 + legacyWeight * 0.1

  return Math.min(riskScore, 10) // Cap at 10
}

export function getRiskLevel(score: number): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  if (score < 4) return "LOW"
  if (score < 7) return "MEDIUM"
  if (score < 9) return "HIGH"
  return "CRITICAL"
}

export function findVulnerabilities(
  config: SystemConfig,
  allVulnerabilities: Vulnerability[],
): { vulnerabilities: Vulnerability[]; confidenceMap: Map<string, number> } {
  const found: Vulnerability[] = []
  const confidenceMap = new Map<string, number>()

  // Convert config to ImprovedMatcher format
  const deviceConfig = {
    deviceType: config.deviceType,
    manufacturer: config.manufacturer,
    model: config.model,
    firmwareVersion: config.osVersion,
    protocols: config.protocols,
    osVersion: config.osVersion,
    installationDate: undefined, // Could be added to SystemConfig if needed
  }

  // Find vulnerabilities matching device
  const deviceVulns = allVulnerabilities.filter((vuln) => {
    const deviceMatch =
      vuln.device.toLowerCase().includes(config.model.toLowerCase()) ||
      vuln.device.toLowerCase().includes(config.manufacturer.toLowerCase())
    return deviceMatch
  })

  deviceVulns.forEach((vuln) => {
    found.push(vuln)
    const confidence = improvedMatcher.getMatchConfidence(deviceConfig, {
      id: vuln.id,
      cveId: vuln.id,
      affectedDevices: [vuln.device],
      affectedProtocols: [vuln.protocol],
      publishedDate: new Date().toISOString(),
      affectedVersions: undefined,
      patchedVersions: undefined,
    })
    confidenceMap.set(vuln.id, confidence)
  })

  // Find vulnerabilities matching protocols
  config.protocols.forEach((protocol) => {
    const protocolVulns = allVulnerabilities.filter((vuln) => vuln.protocol.toLowerCase() === protocol.toLowerCase())
    protocolVulns.forEach((vuln) => {
      if (!found.find((v) => v.id === vuln.id)) {
        found.push(vuln)
        confidenceMap.set(vuln.id, 60) // Medium confidence for protocol matches
      }
    })
  })

  // Add generic vulnerabilities
  if (config.internetConnected) {
    const internetVuln = allVulnerabilities.find((v) => v.id === "ICS-GENERIC-001")
    if (internetVuln && !found.find((v) => v.id === internetVuln.id)) {
      found.push(internetVuln)
      confidenceMap.set(internetVuln.id, 100) // High confidence for configuration-based
    }
  }

  if (config.isLegacy) {
    const legacyVuln = allVulnerabilities.find((v) => v.id === "ICS-GENERIC-002")
    if (legacyVuln && !found.find((v) => v.id === legacyVuln.id)) {
      found.push(legacyVuln)
      confidenceMap.set(legacyVuln.id, 100) // High confidence for configuration-based
    }
  }

  return { vulnerabilities: found, confidenceMap }
}

export function generateRecommendations(
  config: SystemConfig,
  _vulnerabilities: Vulnerability[],
): { en: string[]; ar: string[] } {
  const recommendationsEn: string[] = []
  const recommendationsAr: string[] = []

  // Network segmentation
  if (config.connectedToIT) {
    recommendationsEn.push("Implement network segmentation between OT and IT networks")
    recommendationsAr.push("تنفيذ تقسيم الشبكة بين شبكات OT و IT")
  }

  // Internet exposure
  if (config.internetConnected) {
    recommendationsEn.push("Remove direct internet connectivity and use VPN with multi-factor authentication")
    recommendationsAr.push("إزالة الاتصال المباشر بالإنترنت واستخدام VPN مع مصادقة متعددة العوامل")
  }

  // Legacy devices
  if (config.isLegacy) {
    recommendationsEn.push("Plan device replacement or implement compensating security controls")
    recommendationsAr.push("التخطيط لاستبدال الجهاز أو تنفيذ ضوابط أمنية تعويضية")
  }

  // Protocol-specific
  if (config.protocols.includes("Modbus TCP")) {
    recommendationsEn.push("Implement firewall rules to restrict Modbus TCP access")
    recommendationsAr.push("تنفيذ قواعد جدار الحماية لتقييد الوصول إلى Modbus TCP")
  }

  // Wireless
  if (config.interfaces.some((i) => i.includes("Wireless"))) {
    recommendationsEn.push("Use WPA3 encryption for wireless connections and regularly rotate keys")
    recommendationsAr.push("استخدام تشفير WPA3 للاتصالات اللاسلكية وتدوير المفاتيح بانتظام")
  }

  // General recommendations
  recommendationsEn.push(
    "Enable audit logging and implement SIEM for monitoring",
    "Conduct regular security assessments and penetration testing",
    "Implement role-based access control (RBAC)",
    "Keep firmware and software updated to latest versions",
  )

  recommendationsAr.push(
    "تفعيل سجلات التدقيق وتنفيذ SIEM للمراقبة",
    "إجراء تقييمات أمنية منتظمة واختبار اختراق",
    "تنفيذ التحكم في الوصول القائم على الأدوار (RBAC)",
    "الحفاظ على تحديث البرامج الثابتة والبرمجيات لأحدث الإصدارات",
  )

  return { en: recommendationsEn, ar: recommendationsAr }
}

export function assessSystem(config: SystemConfig, allVulnerabilities: Vulnerability[]): RiskAssessment {
  const { vulnerabilities, confidenceMap } = findVulnerabilities(config, allVulnerabilities)
  const riskScore = calculateRiskScore(config, vulnerabilities)
  const riskLevel = getRiskLevel(riskScore)
  const recommendations = generateRecommendations(config, vulnerabilities)

  const baselineComparison = compareWithBaseline(
    config.manufacturer,
    config.model,
    config.internetConnected,
    config.connectedToIT,
    config.protocols,
    config.osVersion,
  )

  const criticalPoints: string[] = []
  if (config.internetConnected) criticalPoints.push("Direct Internet Exposure")
  if (config.connectedToIT) criticalPoints.push("IT Network Connection")
  if (config.isLegacy) criticalPoints.push("Legacy/Unsupported Device")
  config.protocols.forEach((p) => criticalPoints.push(`${p} Protocol`))

  return {
    riskScore,
    riskLevel,
    vulnerabilities,
    vulnerabilityConfidence: confidenceMap,
    recommendations: recommendations.en,
    recommendations_ar: recommendations.ar,
    attackSurface: {
      exposureLevel: riskLevel,
      criticalPoints,
    },
    baselineComparison,
  }
}
