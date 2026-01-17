/**
 * ICS-Risk Framework
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 *
 * MITRE ATT&CK for ICS Integration
 * Maps threats to MITRE tactics and techniques specific to Industrial Control Systems
 */

export interface MITRETactic {
  id: string
  name: string
  description: string
}

export interface MITRETechnique {
  id: string
  name: string
  tacticId: string
  description: string
  mitigation: string
  detection: string
  examples: string[]
}

// MITRE ATT&CK for ICS Tactics
export const MITRE_TACTICS: MITRETactic[] = [
  {
    id: "TA0108",
    name: "Initial Access",
    description: "Techniques used to gain initial foothold in ICS environment",
  },
  {
    id: "TA0109",
    name: "Execution",
    description: "Techniques resulting in adversary-controlled code running on ICS systems",
  },
  {
    id: "TA0110",
    name: "Persistence",
    description: "Techniques used to maintain presence in ICS environment",
  },
  {
    id: "TA0111",
    name: "Privilege Escalation",
    description: "Techniques used to gain higher-level permissions in ICS",
  },
  {
    id: "TA0103",
    name: "Evasion",
    description: "Techniques used to avoid detection in ICS",
  },
  {
    id: "TA0104",
    name: "Discovery",
    description: "Techniques used to gain knowledge about ICS environment",
  },
  {
    id: "TA0105",
    name: "Lateral Movement",
    description: "Techniques used to move through ICS network",
  },
  {
    id: "TA0102",
    name: "Collection",
    description: "Techniques used to gather ICS data",
  },
  {
    id: "TA0101",
    name: "Command and Control",
    description: "Techniques used to communicate with compromised ICS systems",
  },
  {
    id: "TA0106",
    name: "Inhibit Response Function",
    description: "Techniques to prevent safety/protection mechanisms",
  },
  {
    id: "TA0107",
    name: "Impair Process Control",
    description: "Techniques to manipulate ICS processes",
  },
  {
    id: "TA0100",
    name: "Impact",
    description: "Techniques used to disrupt, degrade, or destroy ICS operations",
  },
]

// Selected MITRE ATT&CK for ICS Techniques (most relevant)
export const MITRE_TECHNIQUES: MITRETechnique[] = [
  // Initial Access
  {
    id: "T0817",
    name: "Drive-by Compromise",
    tacticId: "TA0108",
    description: "Adversary gains access when user visits malicious website",
    mitigation: "Web filtering, browser sandboxing, user training",
    detection: "Monitor web proxy logs for suspicious connections",
    examples: ["Dragonfly campaign targeting energy sector"],
  },
  {
    id: "T0866",
    name: "Exploitation of Remote Services",
    tacticId: "TA0108",
    description: "Exploiting vulnerabilities in remote services like RDP, VNC",
    mitigation: "Patch management, disable unnecessary services, MFA",
    detection: "Monitor failed authentication attempts, unusual remote access",
    examples: ["Exploitation of HMI vulnerabilities"],
  },
  {
    id: "T0883",
    name: "Internet Accessible Device",
    tacticId: "TA0108",
    description: "Exploiting ICS devices directly exposed to Internet",
    mitigation: "Network segmentation, firewall rules, remove Internet exposure",
    detection: "Regular scanning for Internet-exposed devices",
    examples: ["Shodan searches revealing exposed PLCs"],
  },
  // Execution
  {
    id: "T0871",
    name: "Execution through API",
    tacticId: "TA0109",
    description: "Using legitimate APIs to execute malicious code",
    mitigation: "API authentication, input validation, monitoring",
    detection: "Monitor API calls for unusual patterns",
    examples: ["Abuse of OPC-UA or Modbus APIs"],
  },
  {
    id: "T0873",
    name: "Project File Infection",
    tacticId: "TA0109",
    description: "Injecting malicious code into PLC project files",
    mitigation: "Code signing, file integrity monitoring",
    detection: "Hash verification of project files",
    examples: ["Stuxnet modifying Step 7 project files"],
  },
  // Persistence
  {
    id: "T0839",
    name: "Module Firmware",
    tacticId: "TA0110",
    description: "Modifying firmware to maintain persistence",
    mitigation: "Firmware integrity checks, secure boot",
    detection: "Regular firmware verification",
    examples: ["Firmware rootkits in PLCs"],
  },
  {
    id: "T0889",
    name: "Modify Program",
    tacticId: "TA0110",
    description: "Altering control logic in PLCs",
    mitigation: "Change control procedures, logic monitoring",
    detection: "Compare current logic with baseline",
    examples: ["Stuxnet modifying PLC logic"],
  },
  // Discovery
  {
    id: "T0840",
    name: "Network Connection Enumeration",
    tacticId: "TA0104",
    description: "Discovering network topology and connections",
    mitigation: "Network segmentation, access controls",
    detection: "Monitor network scanning activity",
    examples: ["Reconnaissance in industrial networks"],
  },
  {
    id: "T0846",
    name: "Remote System Discovery",
    tacticId: "TA0104",
    description: "Identifying remote systems on the network",
    mitigation: "Limit network visibility, segment networks",
    detection: "Monitor ping sweeps and port scans",
    examples: ["Discovery of SCADA systems"],
  },
  // Lateral Movement
  {
    id: "T0867",
    name: "Lateral Tool Transfer",
    tacticId: "TA0105",
    description: "Transferring tools between systems",
    mitigation: "Application whitelisting, file transfer monitoring",
    detection: "Monitor unusual file transfers",
    examples: ["Moving attack tools to ICS network"],
  },
  {
    id: "T0886",
    name: "Remote Services",
    tacticId: "TA0105",
    description: "Using legitimate remote services to move laterally",
    mitigation: "MFA, access logging, least privilege",
    detection: "Monitor remote access patterns",
    examples: ["Using RDP to access HMI stations"],
  },
  // Inhibit Response Function
  {
    id: "T0800",
    name: "Activate Firmware Update Mode",
    tacticId: "TA0106",
    description: "Putting devices in update mode to disable protections",
    mitigation: "Physical security, authentication requirements",
    detection: "Monitor device state changes",
    examples: ["Disabling safety systems via firmware mode"],
  },
  {
    id: "T0878",
    name: "Alarm Suppression",
    tacticId: "TA0106",
    description: "Suppressing alarms to hide malicious activity",
    mitigation: "Redundant alarm systems, alarm integrity checks",
    detection: "Monitor alarm configuration changes",
    examples: ["Disabling critical alarms before attack"],
  },
  {
    id: "T0803",
    name: "Block Command Message",
    tacticId: "TA0106",
    description: "Blocking commands to prevent operator response",
    mitigation: "Redundant communication paths, backup controls",
    detection: "Monitor command delivery failures",
    examples: ["Blocking emergency shutdown commands"],
  },
  // Impair Process Control
  {
    id: "T0836",
    name: "Modify Parameter",
    tacticId: "TA0107",
    description: "Changing process parameters to unsafe values",
    mitigation: "Parameter range validation, change detection",
    detection: "Monitor parameter changes",
    examples: ["Stuxnet modifying centrifuge speeds"],
  },
  {
    id: "T0855",
    name: "Unauthorized Command Message",
    tacticId: "TA0107",
    description: "Sending unauthorized commands to ICS devices",
    mitigation: "Command authentication, whitelisting",
    detection: "Monitor for unexpected commands",
    examples: ["Sending malicious Modbus commands"],
  },
  // Impact
  {
    id: "T0809",
    name: "Data Destruction",
    tacticId: "TA0100",
    description: "Destroying critical ICS data",
    mitigation: "Backups, access controls, monitoring",
    detection: "Monitor file deletion events",
    examples: ["Wiping HMI historian data"],
  },
  {
    id: "T0831",
    name: "Manipulation of Control",
    tacticId: "TA0100",
    description: "Directly manipulating ICS processes",
    mitigation: "Safety systems, physical interlocks",
    detection: "Anomaly detection in process behavior",
    examples: ["Manipulating valve positions"],
  },
  {
    id: "T0826",
    name: "Loss of Availability",
    tacticId: "TA0100",
    description: "Causing ICS systems to become unavailable",
    mitigation: "Redundancy, backup systems, incident response",
    detection: "Monitor system availability",
    examples: ["DoS attacks on SCADA systems"],
  },
  {
    id: "T0879",
    name: "Damage to Property",
    tacticId: "TA0100",
    description: "Causing physical damage to equipment",
    mitigation: "Safety systems, physical protections",
    detection: "Monitor for abnormal physical conditions",
    examples: ["Destroying centrifuges (Stuxnet)"],
  },
]

export function getTechniquesByTactic(tacticId: string): MITRETechnique[] {
  return MITRE_TECHNIQUES.filter((t) => t.tacticId === tacticId)
}

import { Vulnerability } from "./risk-engine"

export function mapVulnerabilityToMITRE(vulnerability: Vulnerability): MITRETechnique[] {
  const mapped: MITRETechnique[] = []

  // Map based on vulnerability category/description
  if (vulnerability.category?.includes("Authentication") || vulnerability.description.toLowerCase().includes("authentication")) {
    mapped.push(...MITRE_TECHNIQUES.filter((t) => t.id === "T0866"))
  }

  if (vulnerability.category?.includes("Injection") || vulnerability.description.toLowerCase().includes("injection")) {
    mapped.push(...MITRE_TECHNIQUES.filter((t) => t.id === "T0871"))
  }

  if (vulnerability.description?.toLowerCase().includes("firmware")) {
    mapped.push(...MITRE_TECHNIQUES.filter((t) => t.id === "T0839"))
  }

  if (vulnerability.description?.toLowerCase().includes("command")) {
    mapped.push(...MITRE_TECHNIQUES.filter((t) => t.id === "T0855"))
  }

  return mapped
}

export function generateMITREReport(devices: any[]): {
  tactics: { tactic: MITRETactic; techniques: MITRETechnique[]; riskLevel: string }[]
  overallCoverage: number
} {
  const tacticMap = new Map<string, MITRETechnique[]>()

  // Map all potential techniques based on devices
  MITRE_TECHNIQUES.forEach((technique) => {
    const techniques = tacticMap.get(technique.tacticId) || []
    techniques.push(technique)
    tacticMap.set(technique.tacticId, techniques)
  })

  const tactics = MITRE_TACTICS.map((tactic) => {
    const techniques = tacticMap.get(tactic.id) || []
    const riskLevel = techniques.length > 3 ? "High" : techniques.length > 1 ? "Medium" : "Low"

    return { tactic, techniques, riskLevel }
  })

  const overallCoverage = (tacticMap.size / MITRE_TACTICS.length) * 100

  return { tactics, overallCoverage }
}
