/**
 * ICS-Risk Framework
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 *
 * Secure Baseline Configuration Database
 * Defines minimum security requirements for each device type
 */

export interface SecureBaselineRequirement {
  id: string
  category: string
  requirement: string
  requirement_ar: string
  requirement_de: string
  criticality: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  standard: string // IEC 62443, NIST, etc.
}

export interface DeviceBaseline {
  manufacturer: string
  model: string
  requirements: SecureBaselineRequirement[]
}

export interface BaselineComparisonResult {
  totalRequirements: number
  met: number
  unmet: number
  compliance: number // 0-100%
  gaps: SecureBaselineRequirement[]
  recommendations: {
    en: string[]
    ar: string[]
    de: string[]
  }
}

export const secureBaselines: DeviceBaseline[] = [
  {
    manufacturer: "Siemens",
    model: "S7-1500",
    requirements: [
      {
        id: "S7-1500-001",
        category: "Network Services",
        requirement: "Disable HTTP web server, use HTTPS only",
        requirement_ar: "تعطيل خادم الويب HTTP، استخدام HTTPS فقط",
        requirement_de: "HTTP-Webserver deaktivieren, nur HTTPS verwenden",
        criticality: "CRITICAL",
        standard: "IEC 62443-3-3",
      },
      {
        id: "S7-1500-002",
        category: "Authentication",
        requirement: "Enable password protection with minimum 8 characters",
        requirement_ar: "تفعيل حماية كلمة المرور بحد أدنى 8 أحرف",
        requirement_de: "Passwortschutz mit mindestens 8 Zeichen aktivieren",
        criticality: "CRITICAL",
        standard: "IEC 62443-4-2",
      },
      {
        id: "S7-1500-003",
        category: "Network Protocols",
        requirement: "Disable Telnet, use SSH for remote access",
        requirement_ar: "تعطيل Telnet، استخدام SSH للوصول عن بعد",
        requirement_de: "Telnet deaktivieren, SSH für Fernzugriff verwenden",
        criticality: "HIGH",
        standard: "NIST CSF",
      },
      {
        id: "S7-1500-004",
        category: "Monitoring",
        requirement: "Enable SNMP v3 with encryption, disable v1/v2",
        requirement_ar: "تفعيل SNMP v3 مع التشفير، تعطيل v1/v2",
        requirement_de: "SNMP v3 mit Verschlüsselung aktivieren, v1/v2 deaktivieren",
        criticality: "MEDIUM",
        standard: "IEC 62443-3-3",
      },
      {
        id: "S7-1500-005",
        category: "Firmware",
        requirement: "Update to firmware version V2.9 or higher",
        requirement_ar: "التحديث إلى إصدار البرنامج الثابت V2.9 أو أعلى",
        requirement_de: "Auf Firmware-Version V2.9 oder höher aktualisieren",
        criticality: "HIGH",
        standard: "Vendor Recommendation",
      },
    ],
  },
  {
    manufacturer: "Rockwell",
    model: "ControlLogix",
    requirements: [
      {
        id: "CLX-001",
        category: "Network Services",
        requirement: "Disable FTP, use SFTP or HTTPS for file transfers",
        requirement_ar: "تعطيل FTP، استخدام SFTP أو HTTPS لنقل الملفات",
        requirement_de: "FTP deaktivieren, SFTP oder HTTPS für Dateiübertragung verwenden",
        criticality: "CRITICAL",
        standard: "IEC 62443-3-3",
      },
      {
        id: "CLX-002",
        category: "Authentication",
        requirement: "Implement role-based access control (RBAC)",
        requirement_ar: "تنفيذ التحكم في الوصول القائم على الأدوار (RBAC)",
        requirement_de: "Rollenbasierte Zugriffskontrolle (RBAC) implementieren",
        criticality: "CRITICAL",
        standard: "IEC 62443-4-2",
      },
      {
        id: "CLX-003",
        category: "Network Segmentation",
        requirement: "Place controller in separate VLAN from enterprise network",
        requirement_ar: "وضع وحدة التحكم في VLAN منفصل عن شبكة المؤسسة",
        requirement_de: "Controller in separates VLAN vom Unternehmensnetzwerk platzieren",
        criticality: "HIGH",
        standard: "NIST CSF",
      },
      {
        id: "CLX-004",
        category: "Audit Logging",
        requirement: "Enable audit logging and send to centralized SIEM",
        requirement_ar: "تفعيل سجلات التدقيق وإرسالها إلى SIEM مركزي",
        requirement_de: "Audit-Protokollierung aktivieren und an zentrales SIEM senden",
        criticality: "MEDIUM",
        standard: "IEC 62443-3-3",
      },
    ],
  },
  {
    manufacturer: "Schneider",
    model: "Modicon M580",
    requirements: [
      {
        id: "M580-001",
        category: "Network Protocols",
        requirement: "Use Modbus/TCP with firewall rules, not Modbus RTU over TCP",
        requirement_ar: "استخدام Modbus/TCP مع قواعد جدار الحماية، وليس Modbus RTU عبر TCP",
        requirement_de: "Modbus/TCP mit Firewall-Regeln verwenden, nicht Modbus RTU über TCP",
        criticality: "HIGH",
        standard: "IEC 62443-3-3",
      },
      {
        id: "M580-002",
        category: "Authentication",
        requirement: "Enable application authentication and user management",
        requirement_ar: "تفعيل مصادقة التطبيق وإدارة المستخدمين",
        requirement_de: "Anwendungsauthentifizierung und Benutzerverwaltung aktivieren",
        criticality: "CRITICAL",
        standard: "IEC 62443-4-2",
      },
      {
        id: "M580-003",
        category: "Firmware",
        requirement: "Update to SV3.00 or later for security patches",
        requirement_ar: "التحديث إلى SV3.00 أو أحدث للحصول على التصحيحات الأمنية",
        requirement_de: "Auf SV3.00 oder später für Sicherheitspatches aktualisieren",
        criticality: "HIGH",
        standard: "Vendor Recommendation",
      },
    ],
  },
  {
    manufacturer: "Generic",
    model: "All",
    requirements: [
      {
        id: "GEN-001",
        category: "Network Exposure",
        requirement: "No direct internet connectivity - use VPN with MFA",
        requirement_ar: "عدم الاتصال المباشر بالإنترنت - استخدام VPN مع MFA",
        requirement_de: "Keine direkte Internetverbindung - VPN mit MFA verwenden",
        criticality: "CRITICAL",
        standard: "IEC 62443-3-3",
      },
      {
        id: "GEN-002",
        category: "Network Segmentation",
        requirement: "Implement network segmentation between IT and OT",
        requirement_ar: "تنفيذ تقسيم الشبكة بين IT و OT",
        requirement_de: "Netzwerksegmentierung zwischen IT und OT implementieren",
        criticality: "CRITICAL",
        standard: "IEC 62443-3-3",
      },
      {
        id: "GEN-003",
        category: "Access Control",
        requirement: "Implement least privilege access principle",
        requirement_ar: "تنفيذ مبدأ أقل امتيازات الوصول",
        requirement_de: "Prinzip der geringsten Rechte implementieren",
        criticality: "HIGH",
        standard: "NIST CSF",
      },
      {
        id: "GEN-004",
        category: "Monitoring",
        requirement: "Enable continuous monitoring and alerting",
        requirement_ar: "تفعيل المراقبة المستمرة والتنبيهات",
        requirement_de: "Kontinuierliche Überwachung und Alarmierung aktivieren",
        criticality: "MEDIUM",
        standard: "NIST CSF",
      },
    ],
  },
]

export function getDeviceBaseline(manufacturer: string, model: string): DeviceBaseline | null {
  // Try exact match first
  const exact = secureBaselines.find(
    (b) => b.manufacturer.toLowerCase() === manufacturer.toLowerCase() && b.model.toLowerCase() === model.toLowerCase(),
  )
  if (exact) return exact

  // Try manufacturer match
  const manufacturerMatch = secureBaselines.find((b) => b.manufacturer.toLowerCase() === manufacturer.toLowerCase())
  if (manufacturerMatch) return manufacturerMatch

  // Return generic baseline
  return secureBaselines.find((b) => b.manufacturer === "Generic") || null
}

export function compareWithBaseline(
  manufacturer: string,
  model: string,
  internetConnected: boolean,
  connectedToIT: boolean,
  protocols: string[],
  firmwareVersion?: string,
): BaselineComparisonResult {
  const baseline = getDeviceBaseline(manufacturer, model)

  if (!baseline) {
    return {
      totalRequirements: 0,
      met: 0,
      unmet: 0,
      compliance: 0,
      gaps: [],
      recommendations: { en: [], ar: [], de: [] },
    }
  }

  const gaps: SecureBaselineRequirement[] = []
  let met = 0

  baseline.requirements.forEach((req) => {
    let isMet = false

    // Check each requirement
    switch (req.id) {
      case "GEN-001":
        isMet = !internetConnected
        break
      case "GEN-002":
        isMet = !connectedToIT // Assume not met if connected to IT
        break
      case "S7-1500-003":
      case "CLX-001":
        isMet = !protocols.includes("Telnet") && !protocols.includes("FTP")
        break
      default:
        // For firmware and other checks, assume not met (needs manual verification)
        isMet = false
    }

    if (isMet) {
      met++
    } else {
      gaps.push(req)
    }
  })

  const totalRequirements = baseline.requirements.length
  const unmet = gaps.length
  const compliance = Math.round((met / totalRequirements) * 100)

  const recommendations = {
    en: gaps.map((gap) => `${gap.category}: ${gap.requirement}`),
    ar: gaps.map((gap) => `${gap.category}: ${gap.requirement_ar}`),
    de: gaps.map((gap) => `${gap.category}: ${gap.requirement_de}`),
  }

  return {
    totalRequirements,
    met,
    unmet,
    compliance,
    gaps,
    recommendations,
  }
}
