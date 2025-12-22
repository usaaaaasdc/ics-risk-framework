/**
 * ICS-Risk Framework
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 *
 * Improved Vulnerability Matching Engine
 * Includes firmware version and date filtering
 */

interface DeviceConfig {
  deviceType: string
  manufacturer: string
  model: string
  firmwareVersion?: string
  protocols: string[]
  osVersion?: string
  installationDate?: string
}

interface Vulnerability {
  id: string
  cveId: string
  affectedDevices: string[]
  affectedProtocols?: string[]
  publishedDate: string
  affectedVersions?: string[]
  patchedVersions?: string[]
}

export class ImprovedMatcher {
  // Compare semantic versions (e.g., "1.2.3" vs "1.2.5")
  compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split(".").map(Number)
    const parts2 = v2.split(".").map(Number)

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0
      const part2 = parts2[i] || 0

      if (part1 > part2) return 1
      if (part1 < part2) return -1
    }

    return 0
  }

  // Check if device version is affected
  isVersionAffected(
    deviceVersion: string | undefined,
    affectedVersions: string[] | undefined,
    patchedVersions: string[] | undefined,
  ): boolean {
    if (!deviceVersion) return true // Unknown version = assume vulnerable

    // If no version info in CVE, assume all versions affected
    if (!affectedVersions && !patchedVersions) return true

    // Check if version is explicitly listed as affected
    if (affectedVersions && affectedVersions.includes(deviceVersion)) {
      return true
    }

    // Check if version is patched
    if (patchedVersions) {
      for (const patched of patchedVersions) {
        if (this.compareVersions(deviceVersion, patched) >= 0) {
          return false // Device version is patched
        }
      }
    }

    return true // Assume vulnerable if not patched
  }

  // Check if CVE is relevant based on installation date
  isDateRelevant(installationDate: string | undefined, cvePublishedDate: string): boolean {
    if (!installationDate) return true // Unknown date = include all CVEs

    const installation = new Date(installationDate)
    const published = new Date(cvePublishedDate)

    // Only include CVEs published after installation
    return published >= installation
  }

  // Enhanced matching algorithm
  matchVulnerabilities(config: DeviceConfig, vulnerabilities: Vulnerability[]): Vulnerability[] {
    return vulnerabilities.filter((vuln) => {
      // 1. Check device type/model match
      const deviceMatch = vuln.affectedDevices.some(
        (device) =>
          device.toLowerCase().includes(config.model.toLowerCase()) ||
          device.toLowerCase().includes(config.manufacturer.toLowerCase()),
      )

      if (!deviceMatch) return false

      // 2. Check protocol match (if specified in CVE)
      if (vuln.affectedProtocols && vuln.affectedProtocols.length > 0) {
        const protocolMatch = config.protocols.some((protocol) => vuln.affectedProtocols!.includes(protocol))
        if (!protocolMatch) return false
      }

      // 3. Check firmware version
      if (!this.isVersionAffected(config.firmwareVersion, vuln.affectedVersions, vuln.patchedVersions)) {
        return false
      }

      // 4. Check installation date relevance
      if (!this.isDateRelevant(config.installationDate, vuln.publishedDate)) {
        return false
      }

      return true
    })
  }

  // Calculate matching confidence score (0-100)
  getMatchConfidence(config: DeviceConfig, vuln: Vulnerability): number {
    let confidence = 0

    // Base match (device/model) = 40 points
    const deviceMatch = vuln.affectedDevices.some((device) => device.toLowerCase().includes(config.model.toLowerCase()))
    if (deviceMatch) confidence += 40

    // Firmware version known = +20 points
    if (config.firmwareVersion) confidence += 20

    // Protocol match = +20 points
    if (vuln.affectedProtocols && config.protocols.some((p) => vuln.affectedProtocols!.includes(p))) {
      confidence += 20
    }

    // Installation date known = +20 points
    if (config.installationDate) confidence += 20

    return confidence
  }
}

export const improvedMatcher = new ImprovedMatcher()
