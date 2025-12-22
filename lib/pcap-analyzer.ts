/**
 * ICS-Risk Framework - PCAP File Analyzer
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 */

export interface PCAPPacket {
  timestamp: number
  srcIP: string
  dstIP: string
  protocol: string
  length: number
  flags?: string[]
  payload?: string
}

export interface PCAPAnalysisResult {
  totalPackets: number
  duration: number
  protocols: { [key: string]: number }
  topSources: { ip: string; count: number }[]
  topDestinations: { ip: string; count: number }[]
  suspiciousPatterns: SuspiciousPattern[]
  industrialProtocols: IndustrialProtocolStats[]
  recommendations: string[]
  riskScore: number
}

export interface SuspiciousPattern {
  type: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  count: number
  affectedIPs: string[]
}

export interface IndustrialProtocolStats {
  protocol: string
  packets: number
  percentage: number
  commands: string[]
  anomalies: string[]
}

export class PCAPAnalyzer {
  private packets: PCAPPacket[] = []

  // Simulate PCAP parsing (في الواقع يحتاج مكتبة متخصصة)
  parsePCAPFile(file: File): Promise<PCAPPacket[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          // محاكاة تحليل PCAP - في الواقع يحتاج parser حقيقي
          const content = e.target?.result as ArrayBuffer
          const packets = this.simulatePCAPParsing(content)
          this.packets = packets
          resolve(packets)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsArrayBuffer(file)
    })
  }

  // محاكاة تحليل PCAP (للعرض التوضيحي)
  private simulatePCAPParsing(buffer: ArrayBuffer): PCAPPacket[] {
    const packets: PCAPPacket[] = []
    const industrialProtocols = ["Modbus", "Profinet", "DNP3", "EtherNet/IP", "OPC-UA"]
    const ips = ["192.168.1.10", "192.168.1.20", "10.0.0.5", "172.16.0.100", "8.8.8.8"]

    // توليد بيانات نموذجية لتوضيح الوظيفة
    const packetCount = Math.min(Math.floor(buffer.byteLength / 100), 10000)

    for (let i = 0; i < packetCount; i++) {
      const protocol =
        Math.random() > 0.7
          ? industrialProtocols[Math.floor(Math.random() * industrialProtocols.length)]
          : Math.random() > 0.5
            ? "TCP"
            : "UDP"

      packets.push({
        timestamp: Date.now() - (packetCount - i) * 1000,
        srcIP: ips[Math.floor(Math.random() * ips.length)],
        dstIP: ips[Math.floor(Math.random() * ips.length)],
        protocol,
        length: Math.floor(Math.random() * 1500) + 60,
        flags: protocol === "TCP" ? ["SYN", "ACK"] : undefined,
        payload: protocol.includes("Modbus") ? "READ_COILS" : undefined,
      })
    }

    return packets
  }

  analyze(): PCAPAnalysisResult {
    if (this.packets.length === 0) {
      throw new Error("No packets to analyze")
    }

    const protocols = this.analyzeProtocols()
    const topSources = this.getTopIPs("src")
    const topDestinations = this.getTopIPs("dst")
    const suspiciousPatterns = this.detectSuspiciousPatterns()
    const industrialProtocols = this.analyzeIndustrialProtocols()
    const riskScore = this.calculateRiskScore(suspiciousPatterns, industrialProtocols)
    const recommendations = this.generateRecommendations(suspiciousPatterns, industrialProtocols)

    const timestamps = this.packets.map((p) => p.timestamp)
    const duration = (Math.max(...timestamps) - Math.min(...timestamps)) / 1000

    return {
      totalPackets: this.packets.length,
      duration,
      protocols,
      topSources,
      topDestinations,
      suspiciousPatterns,
      industrialProtocols,
      recommendations,
      riskScore,
    }
  }

  private analyzeProtocols(): { [key: string]: number } {
    const protocols: { [key: string]: number } = {}
    this.packets.forEach((packet) => {
      protocols[packet.protocol] = (protocols[packet.protocol] || 0) + 1
    })
    return protocols
  }

  private getTopIPs(type: "src" | "dst"): { ip: string; count: number }[] {
    const ipCounts: { [key: string]: number } = {}

    this.packets.forEach((packet) => {
      const ip = type === "src" ? packet.srcIP : packet.dstIP
      ipCounts[ip] = (ipCounts[ip] || 0) + 1
    })

    return Object.entries(ipCounts)
      .map(([ip, count]) => ({ ip, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  private detectSuspiciousPatterns(): SuspiciousPattern[] {
    const patterns: SuspiciousPattern[] = []

    // كشف Port Scanning
    const portScans = this.detectPortScanning()
    if (portScans.length > 0) {
      patterns.push({
        type: "Port Scanning",
        severity: "high",
        description: "Multiple connection attempts to different ports detected",
        count: portScans.length,
        affectedIPs: portScans,
      })
    }

    // كشف اتصالات خارجية غريبة
    const externalConnections = this.detectExternalConnections()
    if (externalConnections.length > 0) {
      patterns.push({
        type: "External Connections",
        severity: "critical",
        description: "Connections to external IPs from industrial network",
        count: externalConnections.length,
        affectedIPs: externalConnections,
      })
    }

    // كشف حجم بيانات غير طبيعي
    const largeTransfers = this.detectLargeDataTransfers()
    if (largeTransfers.length > 0) {
      patterns.push({
        type: "Large Data Transfers",
        severity: "medium",
        description: "Unusually large data transfers detected",
        count: largeTransfers.length,
        affectedIPs: largeTransfers,
      })
    }

    // كشف بروتوكولات غير آمنة
    const insecureProtocols = this.detectInsecureProtocols()
    if (insecureProtocols.length > 0) {
      patterns.push({
        type: "Insecure Protocols",
        severity: "high",
        description: "Unencrypted industrial protocols in use",
        count: insecureProtocols.length,
        affectedIPs: insecureProtocols,
      })
    }

    return patterns
  }

  private detectPortScanning(): string[] {
    const ipPortMap: { [key: string]: Set<number> } = {}

    this.packets.forEach((packet) => {
      if (!ipPortMap[packet.srcIP]) {
        ipPortMap[packet.srcIP] = new Set()
      }
      // محاكاة منافذ
      ipPortMap[packet.srcIP].add(Math.floor(Math.random() * 65535))
    })

    return Object.entries(ipPortMap)
      .filter(([_, ports]) => ports.size > 20)
      .map(([ip]) => ip)
  }

  private detectExternalConnections(): string[] {
    return this.packets
      .filter((p) => !this.isPrivateIP(p.dstIP))
      .map((p) => p.dstIP)
      .filter((ip, index, self) => self.indexOf(ip) === index)
  }

  private detectLargeDataTransfers(): string[] {
    const transfers: { [key: string]: number } = {}

    this.packets.forEach((packet) => {
      const key = `${packet.srcIP}-${packet.dstIP}`
      transfers[key] = (transfers[key] || 0) + packet.length
    })

    return Object.entries(transfers)
      .filter(([_, size]) => size > 1000000) // > 1MB
      .map(([key]) => key.split("-")[0])
      .filter((ip, index, self) => self.indexOf(ip) === index)
  }

  private detectInsecureProtocols(): string[] {
    const insecure = ["Modbus", "DNP3", "Profinet"]
    return this.packets
      .filter((p) => insecure.includes(p.protocol))
      .map((p) => p.srcIP)
      .filter((ip, index, self) => self.indexOf(ip) === index)
  }

  private analyzeIndustrialProtocols(): IndustrialProtocolStats[] {
    const industrialProtocols = ["Modbus", "Profinet", "DNP3", "EtherNet/IP", "OPC-UA"]
    const stats: IndustrialProtocolStats[] = []

    industrialProtocols.forEach((protocol) => {
      const packets = this.packets.filter((p) => p.protocol === protocol)
      if (packets.length > 0) {
        const percentage = (packets.length / this.packets.length) * 100
        const commands = packets
          .filter((p) => p.payload)
          .map((p) => p.payload!)
          .filter((cmd, index, self) => self.indexOf(cmd) === index)
          .slice(0, 5)

        const anomalies: string[] = []
        if (packets.length > 100 && percentage > 50) {
          anomalies.push("High traffic volume")
        }
        if (!this.hasEncryption(protocol)) {
          anomalies.push("No encryption detected")
        }

        stats.push({
          protocol,
          packets: packets.length,
          percentage,
          commands,
          anomalies,
        })
      }
    })

    return stats.sort((a, b) => b.packets - a.packets)
  }

  private hasEncryption(protocol: string): boolean {
    return protocol === "OPC-UA" // OPC-UA يدعم التشفير
  }

  private calculateRiskScore(patterns: SuspiciousPattern[], industrialProtocols: IndustrialProtocolStats[]): number {
    let score = 0

    // النقاط من الأنماط المشبوهة
    patterns.forEach((pattern) => {
      switch (pattern.severity) {
        case "critical":
          score += 3
          break
        case "high":
          score += 2
          break
        case "medium":
          score += 1
          break
        case "low":
          score += 0.5
          break
      }
    })

    // النقاط من البروتوكولات غير الآمنة
    industrialProtocols.forEach((proto) => {
      if (proto.anomalies.includes("No encryption detected")) {
        score += 1
      }
      if (proto.anomalies.includes("High traffic volume")) {
        score += 0.5
      }
    })

    // تطبيع النتيجة من 0-10
    return Math.min(score, 10)
  }

  private generateRecommendations(
    patterns: SuspiciousPattern[],
    industrialProtocols: IndustrialProtocolStats[],
  ): string[] {
    const recommendations: string[] = []

    patterns.forEach((pattern) => {
      switch (pattern.type) {
        case "Port Scanning":
          recommendations.push("Implement network segmentation to prevent port scanning")
          recommendations.push("Configure IDS/IPS to detect and block scanning attempts")
          break
        case "External Connections":
          recommendations.push("Block all outbound connections from industrial network")
          recommendations.push("Implement strict firewall rules for OT network")
          break
        case "Large Data Transfers":
          recommendations.push("Monitor and limit data transfer rates")
          recommendations.push("Investigate unusual data exfiltration patterns")
          break
        case "Insecure Protocols":
          recommendations.push("Upgrade to encrypted versions of industrial protocols")
          recommendations.push("Implement VPN or TLS for sensitive communications")
          break
      }
    })

    industrialProtocols.forEach((proto) => {
      if (proto.anomalies.includes("No encryption detected")) {
        recommendations.push(`Enable encryption for ${proto.protocol} communications`)
      }
      if (proto.anomalies.includes("High traffic volume")) {
        recommendations.push(`Review ${proto.protocol} traffic patterns for anomalies`)
      }
    })

    return [...new Set(recommendations)].slice(0, 8)
  }

  private isPrivateIP(ip: string): boolean {
    return (
      ip.startsWith("10.") ||
      ip.startsWith("192.168.") ||
      ip.startsWith("172.16.") ||
      ip.startsWith("172.17.") ||
      ip.startsWith("172.18.") ||
      ip.startsWith("172.19.") ||
      ip.startsWith("172.20.") ||
      ip.startsWith("172.21.") ||
      ip.startsWith("172.22.") ||
      ip.startsWith("172.23.") ||
      ip.startsWith("172.24.") ||
      ip.startsWith("172.25.") ||
      ip.startsWith("172.26.") ||
      ip.startsWith("172.27.") ||
      ip.startsWith("172.28.") ||
      ip.startsWith("172.29.") ||
      ip.startsWith("172.30.") ||
      ip.startsWith("172.31.")
    )
  }
}
