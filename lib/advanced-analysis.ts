/**
 * ICS-Risk Framework - Advanced Security Analysis Module
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 *
 * Implements STRIDE threat modeling, attack tree analysis,
 * and compliance checking for IEC 62443 and NIST standards.
 */

import type { SystemConfig, RiskAssessment } from "./risk-engine"

// STRIDE Threat Model
export interface STRIDEAnalysis {
  spoofing: ThreatItem[]
  tampering: ThreatItem[]
  repudiation: ThreatItem[]
  informationDisclosure: ThreatItem[]
  denialOfService: ThreatItem[]
  elevationOfPrivilege: ThreatItem[]
}

export interface ThreatItem {
  threat: string
  likelihood: "Low" | "Medium" | "High"
  impact: "Low" | "Medium" | "High"
  mitigation: string
}

// Attack Tree Node
export interface AttackTreeNode {
  id: string
  name: string
  type: "AND" | "OR" | "LEAF"
  likelihood: number
  impact: number
  children?: AttackTreeNode[]
}

// Compliance Check
export interface ComplianceResult {
  standard: string
  requirements: ComplianceRequirement[]
  overallScore: number
  compliant: boolean
}

export interface ComplianceRequirement {
  id: string
  description: string
  status: "Pass" | "Fail" | "Partial"
  recommendation: string
}

export function performSTRIDEAnalysis(config: SystemConfig): STRIDEAnalysis {
  const analysis: STRIDEAnalysis = {
    spoofing: [],
    tampering: [],
    repudiation: [],
    informationDisclosure: [],
    denialOfService: [],
    elevationOfPrivilege: [],
  }

  // Spoofing threats
  if (!config.protocols.includes("OPC UA") && !config.protocols.includes("DNP3")) {
    analysis.spoofing.push({
      threat: "Weak or no authentication in legacy protocols",
      likelihood: "High",
      impact: "High",
      mitigation: "Implement strong authentication mechanisms like certificate-based auth",
    })
  }

  if (config.internetConnected) {
    analysis.spoofing.push({
      threat: "Unauthorized device impersonation via internet",
      likelihood: "High",
      impact: "Critical",
      mitigation: "Use VPN with multi-factor authentication and device certificates",
    })
  }

  // Tampering threats
  if (config.protocols.some((p) => ["Modbus TCP", "Modbus RTU"].includes(p))) {
    analysis.tampering.push({
      threat: "Unencrypted Modbus communication allows data manipulation",
      likelihood: "Medium",
      impact: "High",
      mitigation: "Implement Modbus security extensions or use encrypted tunnels",
    })
  }

  if (config.connectedToIT) {
    analysis.tampering.push({
      threat: "Data tampering through IT network breach",
      likelihood: "Medium",
      impact: "High",
      mitigation: "Network segmentation with DMZ and intrusion detection systems",
    })
  }

  // Repudiation threats
  analysis.repudiation.push({
    threat: "Lack of audit logging for device commands",
    likelihood: "High",
    impact: "Medium",
    mitigation: "Implement comprehensive audit logging with tamper-proof storage",
  })

  // Information Disclosure threats
  if (config.internetConnected || config.connectedToIT) {
    analysis.informationDisclosure.push({
      threat: "Sensitive operational data exposure through network sniffing",
      likelihood: "High",
      impact: "High",
      mitigation: "Encrypt all network communications using TLS 1.3 or IPSec",
    })
  }

  if (config.protocols.includes("SNMP")) {
    analysis.informationDisclosure.push({
      threat: "SNMP community string exposure reveals system information",
      likelihood: "Medium",
      impact: "Medium",
      mitigation: "Use SNMPv3 with encryption and change default community strings",
    })
  }

  // Denial of Service threats
  if (config.internetConnected) {
    analysis.denialOfService.push({
      threat: "DDoS attacks from internet can disrupt operations",
      likelihood: "High",
      impact: "Critical",
      mitigation: "Implement DDoS protection, rate limiting, and redundant systems",
    })
  }

  analysis.denialOfService.push({
    threat: "Malformed protocol packets can crash devices",
    likelihood: "Medium",
    impact: "High",
    mitigation: "Keep firmware updated and implement input validation at network edge",
  })

  // Elevation of Privilege threats
  if (config.isLegacy) {
    analysis.elevationOfPrivilege.push({
      threat: "Unpatched vulnerabilities allow privilege escalation",
      likelihood: "High",
      impact: "Critical",
      mitigation: "Replace legacy devices or implement compensating controls like network isolation",
    })
  }

  if (config.interfaces.some((i) => i.includes("Wireless"))) {
    analysis.elevationOfPrivilege.push({
      threat: "Wireless access can be exploited for unauthorized control",
      likelihood: "Medium",
      impact: "High",
      mitigation: "Use WPA3-Enterprise with certificate authentication and regular key rotation",
    })
  }

  return analysis
}

export function generateAttackTree(config: SystemConfig): AttackTreeNode {
  const root: AttackTreeNode = {
    id: "root",
    name: "Compromise ICS System",
    type: "OR",
    likelihood: 0.8,
    impact: 10,
    children: [],
  }

  // Network attack path
  if (config.internetConnected || config.connectedToIT) {
    root.children?.push({
      id: "network",
      name: "Network-based Attack",
      type: "AND",
      likelihood: 0.7,
      impact: 9,
      children: [
        {
          id: "network-access",
          name: "Gain Network Access",
          type: "OR",
          likelihood: 0.8,
          impact: 5,
          children: [
            {
              id: "phishing",
              name: "Phishing IT Staff",
              type: "LEAF",
              likelihood: 0.6,
              impact: 5,
            },
            {
              id: "exploit-vpn",
              name: "Exploit VPN Vulnerability",
              type: "LEAF",
              likelihood: 0.4,
              impact: 7,
            },
          ],
        },
        {
          id: "lateral-movement",
          name: "Lateral Movement to ICS Network",
          type: "LEAF",
          likelihood: 0.5,
          impact: 8,
        },
        {
          id: "exploit-device",
          name: "Exploit Device Vulnerability",
          type: "LEAF",
          likelihood: 0.7,
          impact: 9,
        },
      ],
    })
  }

  // Physical access path
  root.children?.push({
    id: "physical",
    name: "Physical Access Attack",
    type: "AND",
    likelihood: 0.3,
    impact: 10,
    children: [
      {
        id: "bypass-security",
        name: "Bypass Physical Security",
        type: "LEAF",
        likelihood: 0.3,
        impact: 5,
      },
      {
        id: "connect-device",
        name: "Connect Malicious Device",
        type: "LEAF",
        likelihood: 0.9,
        impact: 10,
      },
    ],
  })

  // Protocol exploitation path
  if (config.protocols.some((p) => ["Modbus TCP", "Modbus RTU", "DNP3"].includes(p))) {
    root.children?.push({
      id: "protocol",
      name: "Protocol Exploitation",
      type: "AND",
      likelihood: 0.6,
      impact: 8,
      children: [
        {
          id: "intercept",
          name: "Intercept Protocol Traffic",
          type: "LEAF",
          likelihood: 0.8,
          impact: 5,
        },
        {
          id: "replay",
          name: "Replay or Modify Commands",
          type: "LEAF",
          likelihood: 0.7,
          impact: 8,
        },
      ],
    })
  }

  // Wireless attack path
  if (config.interfaces.some((i) => i.includes("Wireless"))) {
    root.children?.push({
      id: "wireless",
      name: "Wireless Attack",
      type: "AND",
      likelihood: 0.5,
      impact: 7,
      children: [
        {
          id: "wireless-range",
          name: "Get Within Wireless Range",
          type: "LEAF",
          likelihood: 0.9,
          impact: 3,
        },
        {
          id: "crack-wifi",
          name: "Crack Wireless Encryption",
          type: "LEAF",
          likelihood: 0.4,
          impact: 7,
        },
      ],
    })
  }

  return root
}

export function checkIEC62443Compliance(config: SystemConfig, assessment: RiskAssessment): ComplianceResult {
  const requirements: ComplianceRequirement[] = []

  // Requirement: Network Segmentation
  requirements.push({
    id: "IEC-62443-3-3-SR-3.1",
    description: "Communication Integrity - Network Segmentation",
    status: config.connectedToIT ? "Fail" : "Pass",
    recommendation: config.connectedToIT
      ? "Implement network segmentation with firewalls between IT and OT networks"
      : "Continue maintaining network isolation",
  })

  // Requirement: Use of cryptography
  const hasSecureProtocol = config.protocols.some((p) => p.includes("OPC UA") || p.includes("TLS"))
  requirements.push({
    id: "IEC-62443-3-3-SR-4.1",
    description: "Data Confidentiality - Use of Cryptography",
    status: hasSecureProtocol ? "Pass" : "Fail",
    recommendation: hasSecureProtocol
      ? "Ensure cryptographic algorithms are up to date"
      : "Implement encrypted protocols like OPC UA or use TLS/IPSec tunnels",
  })

  // Requirement: Authentication
  requirements.push({
    id: "IEC-62443-3-3-SR-1.1",
    description: "User Authentication",
    status: config.isLegacy ? "Fail" : "Partial",
    recommendation: config.isLegacy
      ? "Legacy devices often lack proper authentication - consider replacement or compensating controls"
      : "Implement multi-factor authentication where possible",
  })

  // Requirement: Wireless Security
  const hasWireless = config.interfaces.some((i) => i.includes("Wireless"))
  requirements.push({
    id: "IEC-62443-3-3-SR-3.4",
    description: "Wireless Access Management",
    status: hasWireless ? "Fail" : "Pass",
    recommendation: hasWireless
      ? "Use WPA3-Enterprise, implement 802.1X authentication, and regularly audit wireless access"
      : "No wireless interfaces detected - good security posture",
  })

  // Requirement: Security Monitoring
  requirements.push({
    id: "IEC-62443-2-4-SR-3.3",
    description: "Security Monitoring and Detection",
    status: "Partial",
    recommendation:
      "Implement continuous security monitoring with SIEM integration and anomaly detection for ICS traffic",
  })

  // Requirement: Backup and Recovery
  requirements.push({
    id: "IEC-62443-2-4-SR-7.3",
    description: "Backup and Restore",
    status: "Partial",
    recommendation: "Ensure regular automated backups of device configurations and implement disaster recovery plans",
  })

  // Requirement: Vulnerability Management
  requirements.push({
    id: "IEC-62443-2-4-SR-3.2",
    description: "Protection from Malicious Code",
    status: config.isLegacy || assessment.riskScore >= 7 ? "Fail" : "Partial",
    recommendation:
      "Implement vulnerability scanning, patch management process, and consider application whitelisting on HMI systems",
  })

  // Requirement: Physical Security
  requirements.push({
    id: "IEC-62443-3-3-SR-1.13",
    description: "Physical Access Control",
    status: "Partial",
    recommendation: "Implement physical access controls, surveillance, and tamper detection for ICS equipment",
  })

  const passCount = requirements.filter((r) => r.status === "Pass").length
  const partialCount = requirements.filter((r) => r.status === "Partial").length
  const overallScore = ((passCount + partialCount * 0.5) / requirements.length) * 100

  return {
    standard: "IEC 62443 - Industrial Automation and Control Systems Security",
    requirements,
    overallScore: Math.round(overallScore),
    compliant: overallScore >= 80,
  }
}

export function checkNISTCompliance(config: SystemConfig, assessment: RiskAssessment): ComplianceResult {
  const requirements: ComplianceRequirement[] = []

  // NIST SP 800-82r3: ICS Security

  requirements.push({
    id: "NIST-ID.AM-1",
    description: "Physical devices and systems inventory",
    status: "Pass",
    recommendation: "Maintain comprehensive asset inventory with automated discovery tools",
  })

  requirements.push({
    id: "NIST-PR.AC-1",
    description: "Identities and credentials are managed",
    status: config.isLegacy ? "Fail" : "Partial",
    recommendation: "Implement centralized identity management and regular credential audits",
  })

  requirements.push({
    id: "NIST-PR.AC-5",
    description: "Network integrity is protected",
    status: config.internetConnected ? "Fail" : "Partial",
    recommendation: config.internetConnected
      ? "Remove direct internet connectivity or implement multiple layers of protection (DMZ, firewall, IDS)"
      : "Implement network monitoring and intrusion detection systems",
  })

  requirements.push({
    id: "NIST-PR.DS-2",
    description: "Data-in-transit is protected",
    status: config.protocols.some((p) => p.includes("OPC UA")) ? "Pass" : "Fail",
    recommendation: "Encrypt all sensitive data in transit using TLS 1.3 or IPSec",
  })

  requirements.push({
    id: "NIST-PR.MA-2",
    description: "Remote maintenance is approved and logged",
    status: "Partial",
    recommendation: "Implement secure remote access with VPN, MFA, and comprehensive logging",
  })

  requirements.push({
    id: "NIST-DE.CM-1",
    description: "Network is monitored to detect potential events",
    status: "Partial",
    recommendation: "Deploy ICS-aware intrusion detection systems and security monitoring tools",
  })

  requirements.push({
    id: "NIST-RS.RP-1",
    description: "Response plan is executed during or after an incident",
    status: "Partial",
    recommendation: "Develop and test ICS-specific incident response plans with regular tabletop exercises",
  })

  requirements.push({
    id: "NIST-RC.RP-1",
    description: "Recovery plan is executed during or after an event",
    status: "Partial",
    recommendation: "Create business continuity and disaster recovery plans specific to ICS operations",
  })

  const passCount = requirements.filter((r) => r.status === "Pass").length
  const partialCount = requirements.filter((r) => r.status === "Partial").length
  const overallScore = ((passCount + partialCount * 0.5) / requirements.length) * 100

  return {
    standard: "NIST Cybersecurity Framework for ICS",
    requirements,
    overallScore: Math.round(overallScore),
    compliant: overallScore >= 70,
  }
}
