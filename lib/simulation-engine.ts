export interface SimulationScenario {
  id: string
  name: {
    en: string
    ar: string
    de: string
  }
  description: {
    en: string
    ar: string
    de: string
  }
  targetDevice: string
  attackVector: {
    en: string
    ar: string
    de: string
  }
  vulnerabilityCVE: string
  steps: SimulationStep[]
  impact: {
    financial: number
    operational: {
      en: string
      ar: string
      de: string
    }
    safety: {
      en: string
      ar: string
      de: string
    }
  }
  detectionPoints: {
    en: string[]
    ar: string[]
    de: string[]
  }
  preventionMeasures: {
    en: string[]
    ar: string[]
    de: string[]
  }
}

export interface SimulationStep {
  id: number
  phase: {
    en: string
    ar: string
    de: string
  }
  action: {
    en: string
    ar: string
    de: string
  }
  description: {
    en: string
    ar: string
    de: string
  }
  success_probability: number
  impact_level: "low" | "medium" | "high" | "critical"
  detectable: boolean
  detection_method?: {
    en: string
    ar: string
    de: string
  }
}

export const simulationScenarios: SimulationScenario[] = [
  {
    id: "scenario-1",
    name: {
      en: "Modbus TCP Exploitation",
      ar: "استغلال بروتوكول Modbus TCP",
      de: "Modbus TCP-Ausnutzung",
    },
    description: {
      en: "Attacker exploits unencrypted Modbus TCP protocol to manipulate PLC values",
      ar: "يستغل المهاجم بروتوكول Modbus TCP غير المشفر للتلاعب بقيم PLC",
      de: "Angreifer nutzt unverschlüsseltes Modbus TCP-Protokoll zur Manipulation von SPS-Werten",
    },
    targetDevice: "Siemens S7-1200",
    attackVector: {
      en: "Network - Internet Exposure",
      ar: "الشبكة - التعرض للإنترنت",
      de: "Netzwerk - Internetexposition",
    },
    vulnerabilityCVE: "CVE-2019-6568",
    steps: [
      {
        id: 1,
        phase: {
          en: "Reconnaissance",
          ar: "الاستطلاع",
          de: "Aufklärung",
        },
        action: {
          en: "Port Scanning",
          ar: "فحص المنافذ",
          de: "Port-Scanning",
        },
        description: {
          en: "Attacker scans network for open Modbus TCP port (502)",
          ar: "يفحص المهاجم الشبكة بحثاً عن منفذ Modbus TCP المفتوح (502)",
          de: "Angreifer scannt das Netzwerk nach offenem Modbus TCP-Port (502)",
        },
        success_probability: 0.95,
        impact_level: "low",
        detectable: true,
        detection_method: {
          en: "IDS/IPS - Unusual port scanning activity",
          ar: "IDS/IPS - نشاط فحص منافذ غير عادي",
          de: "IDS/IPS - Ungewöhnliche Port-Scanning-Aktivität",
        },
      },
      {
        id: 2,
        phase: {
          en: "Initial Access",
          ar: "الوصول الأولي",
          de: "Erstzugang",
        },
        action: {
          en: "Protocol Exploitation",
          ar: "استغلال البروتوكول",
          de: "Protokoll-Ausnutzung",
        },
        description: {
          en: "Attacker connects to Modbus TCP without authentication",
          ar: "يتصل المهاجم بـ Modbus TCP بدون مصادقة",
          de: "Angreifer verbindet sich mit Modbus TCP ohne Authentifizierung",
        },
        success_probability: 0.85,
        impact_level: "medium",
        detectable: true,
        detection_method: {
          en: "Network monitoring - Unauthorized Modbus connections",
          ar: "مراقبة الشبكة - اتصالات Modbus غير مصرح بها",
          de: "Netzwerküberwachung - Unautorisierte Modbus-Verbindungen",
        },
      },
      {
        id: 3,
        phase: {
          en: "Execution",
          ar: "التنفيذ",
          de: "Ausführung",
        },
        action: {
          en: "Register Manipulation",
          ar: "التلاعب بالسجلات",
          de: "Register-Manipulation",
        },
        description: {
          en: "Attacker modifies holding registers to change PLC behavior",
          ar: "يعدل المهاجم سجلات الاحتفاظ لتغيير سلوك PLC",
          de: "Angreifer modifiziert Halteregister, um SPS-Verhalten zu ändern",
        },
        success_probability: 0.75,
        impact_level: "high",
        detectable: true,
        detection_method: {
          en: "Anomaly detection - Unexpected register changes",
          ar: "كشف الشذوذ - تغييرات غير متوقعة في السجلات",
          de: "Anomalie-Erkennung - Unerwartete Registeränderungen",
        },
      },
      {
        id: 4,
        phase: {
          en: "Impact",
          ar: "التأثير",
          de: "Auswirkung",
        },
        action: {
          en: "Process Disruption",
          ar: "تعطيل العملية",
          de: "Prozessunterbrechung",
        },
        description: {
          en: "Modified values cause production line to stop or malfunction",
          ar: "القيم المعدلة تتسبب في توقف خط الإنتاج أو خلل",
          de: "Modifizierte Werte führen zum Stopp oder zur Fehlfunktion der Produktionslinie",
        },
        success_probability: 0.9,
        impact_level: "critical",
        detectable: true,
        detection_method: {
          en: "SCADA alarms - Process parameter deviations",
          ar: "إنذارات SCADA - انحرافات معاملات العملية",
          de: "SCADA-Alarme - Prozessparameterabweichungen",
        },
      },
    ],
    impact: {
      financial: 180000,
      operational: {
        en: "Production line shutdown for 12-24 hours",
        ar: "إيقاف خط الإنتاج لمدة 12-24 ساعة",
        de: "Stillstand der Produktionslinie für 12-24 Stunden",
      },
      safety: {
        en: "Potential equipment damage, low risk to personnel",
        ar: "ضرر محتمل للمعدات، خطر منخفض على الموظفين",
        de: "Potenzielle Geräteschäden, geringes Risiko für Personal",
      },
    },
    detectionPoints: {
      en: [
        "Network firewall logs - Unusual traffic to port 502",
        "IDS alerts - Modbus function code anomalies",
        "PLC logs - Unauthorized write operations",
        "SCADA system - Process value deviations",
      ],
      ar: [
        "سجلات جدار الحماية - حركة مرور غير عادية إلى المنفذ 502",
        "تنبيهات IDS - شذوذ في رموز وظائف Modbus",
        "سجلات PLC - عمليات كتابة غير مصرح بها",
        "نظام SCADA - انحرافات قيم العملية",
      ],
      de: [
        "Netzwerk-Firewall-Protokolle - Ungewöhnlicher Verkehr zu Port 502",
        "IDS-Alarme - Modbus-Funktionscode-Anomalien",
        "SPS-Protokolle - Unautorisierte Schreibvorgänge",
        "SCADA-System - Prozesswertabweichungen",
      ],
    },
    preventionMeasures: {
      en: [
        "Implement network segmentation (IT/OT separation)",
        "Deploy industrial firewall with Modbus DPI",
        "Enable Modbus authentication and encryption",
        "Implement whitelist-based access control",
        "Deploy ICS-specific IDS (e.g., Nozomi, Claroty)",
      ],
      ar: [
        "تنفيذ تقسيم الشبكة (فصل IT/OT)",
        "نشر جدار حماية صناعي مع Modbus DPI",
        "تفعيل المصادقة والتشفير لـ Modbus",
        "تنفيذ التحكم بالوصول القائم على القائمة البيضاء",
        "نشر IDS متخصص في ICS (مثل Nozomi، Claroty)",
      ],
      de: [
        "Netzwerksegmentierung implementieren (IT/OT-Trennung)",
        "Industrielle Firewall mit Modbus DPI einsetzen",
        "Modbus-Authentifizierung und Verschlüsselung aktivieren",
        "Whitelist-basierte Zugriffskontrolle implementieren",
        "ICS-spezifisches IDS einsetzen (z.B. Nozomi, Claroty)",
      ],
    },
  },
  {
    id: "scenario-2",
    name: {
      en: "HMI Remote Access Attack",
      ar: "هجوم الوصول عن بعد إلى HMI",
      de: "HMI-Zugriff von Ferne",
    },
    description: {
      en: "Attacker gains unauthorized access through exposed VNC/RDP on HMI",
      ar: "يحقق المهاجم الوصول غير المصرح به عبر خدمات VNC/RDP المعرضة على HMI",
      de: "Angreifer gewinnt unautorisierten Zugriff über offene VNC/RDP-Dienste auf der HMI",
    },
    targetDevice: "Rockwell FactoryTalk HMI",
    attackVector: {
      en: "Remote Access - Weak Credentials",
      ar: "وصول عن بعد - بيانات دخول ضعيفة",
      de: "Fernzugriff - Schwache Anmeldeinformationen",
    },
    vulnerabilityCVE: "CVE-2020-12033",
    steps: [
      {
        id: 1,
        phase: {
          en: "Reconnaissance",
          ar: "الاستطلاع",
          de: "Aufklärung",
        },
        action: {
          en: "Service Discovery",
          ar: "اكتشاف الخدمات",
          de: "Dienstentdeckung",
        },
        description: {
          en: "Attacker identifies exposed VNC/RDP services on HMI",
          ar: "يحدد المهاجم الخدمات المعرضة على HMI",
          de: "Angreifer identifiziert offene VNC/RDP-Dienste auf der HMI",
        },
        success_probability: 0.9,
        impact_level: "low",
        detectable: true,
        detection_method: {
          en: "SIEM - External service enumeration attempts",
          ar: "SIEM - محاولات تعداد الخدمات الخارجية",
          de: "SIEM - Versuche der Aufzählung externer Dienste",
        },
      },
      {
        id: 2,
        phase: {
          en: "Initial Access",
          ar: "الوصول الأولي",
          de: "Erstzugang",
        },
        action: {
          en: "Credential Brute Force",
          ar: "الإجهاض عن طريق الإملاء المتكرر",
          de: "Anmeldeinformationen-Bruteforce",
        },
        description: {
          en: "Attacker attempts default/weak password combinations",
          ar: "يحاول المهاجم مجموعة من كلمات المرور الافتراضية أو القوية",
          de: "Angreifer versucht Standard-/schwache Passwörter",
        },
        success_probability: 0.6,
        impact_level: "medium",
        detectable: true,
        detection_method: {
          en: "Failed authentication logs - Multiple login attempts",
          ar: "سجلات المصادقة الفشل - محاولات تسجيل الدخول المتعددة",
          de: "Fehlgeschlagene Authentifizierungsprotokolle - Viel Login-Versuche",
        },
      },
      {
        id: 3,
        phase: {
          en: "Privilege Escalation",
          ar: "ترقية الصلاحيات",
          de: "Berechtigungssteigerung",
        },
        action: {
          en: "Admin Access",
          ar: "وصول المسؤول",
          de: "Admin-Zugriff",
        },
        description: {
          en: "Attacker gains full HMI control with operator credentials",
          ar: "يحقق المهاجم السيطرة الكاملة على HMI باستخدام بيانات الم作员",
          de: "Angreifer gewinnt vollständigen HMI-Zugriff mit Operator-Anmeldeinformationen",
        },
        success_probability: 0.8,
        impact_level: "high",
        detectable: false,
      },
      {
        id: 4,
        phase: {
          en: "Impact",
          ar: "التأثير",
          de: "Auswirkung",
        },
        action: {
          en: "Process Manipulation",
          ar: "تعديل العملية",
          de: "Prozessmanipulation",
        },
        description: {
          en: "Attacker modifies setpoints and disables safety interlocks",
          ar: "يعدل المهاجم نقاط التحكم ويتعطيل الصلبات الأمان",
          de: "Angreifer ändert Setpoints und deaktiviert Sicherheitssperren",
        },
        success_probability: 0.85,
        impact_level: "critical",
        detectable: true,
        detection_method: {
          en: "SCADA audit logs - Unauthorized configuration changes",
          ar: "سجلات المراجعة في SCADA - تغييرات التكوين غير المصرح بها",
          de: "SCADA-Auditprotokolle - Unautorisierte Konfigurationsänderungen",
        },
      },
    ],
    impact: {
      financial: 350000,
      operational: {
        en: "Complete production halt for 2-3 days, data integrity issues",
        ar: "إيقاف إنتاج كامل لمدة 2-3 أيام، مشاكل في سلامة البيانات",
        de: "Vollständiger Stillstand der Produktion für 2-3 Tage, Probleme mit Datenintegrität",
      },
      safety: {
        en: "High risk - Safety systems compromised",
        ar: "خطر عالي - أنظمة الأمان م.COMPROMISED",
        de: "Hohes Risiko - Sicherheitssysteme kompromittiert",
      },
    },
    detectionPoints: {
      en: [
        "VPN/Remote access logs - Unusual connection sources",
        "Windows Event Logs - Suspicious login patterns",
        "SCADA audit trail - Unauthorized configuration changes",
        "Network behavior analysis - Abnormal HMI traffic",
      ],
      ar: [
        "سجلات الوصول عن بعد / VPN - مصادر اتصال غير عادية",
        "سجلات أحداث Windows - أنماط تسجيل الدخول المشبوهة",
        "سجل مراجعة SCADA - تغييرات تكوين غير مصرح بها",
        "تحليل سلوك الشبكة - حركة HMI غير عادية",
      ],
      de: [
        "VPN/Fernzugriff-Protokolle - Ungewöhnliche Verbindungsquellen",
        "Windows-Ereignisprotokolle - Verdächtige Anmeldemustermuster",
        "SCADA-Auditverfolgung - Unautorisierte Konfigurationsänderungen",
        "Netzwerkbetriebsanalyse - Abnormale HMI-Datenverkehr",
      ],
    },
    preventionMeasures: {
      en: [
        "Disable all remote access services when not needed",
        "Implement multi-factor authentication (MFA)",
        "Use VPN with certificate-based authentication",
        "Deploy jump servers for remote access",
        "Enforce strong password policies",
        "Implement session monitoring and recording",
      ],
      ar: [
        "تعطيل جميع خدمات الوصول عن بعد عند عدم الحاجة إليها",
        "تنفيذ المصادقة متعددة العوامل (MFA)",
        "استخدام VPN مع المصادقة القائمة على الشهادات",
        "نشر خوادم الانتقال للوصول عن بعد",
        "فرض سياسات كلمات مرور قوية",
        "تنفيذ مراقبة الجلسة والتسجيل",
      ],
      de: [
        "Alle Fernzugriffsdienste deaktivieren, wenn nicht erforderlich",
        "Multi-Faktor-Authentifizierung implementieren (MFA)",
        "VPN mit Zertifikat-basierter Authentifizierung verwenden",
        "Jump-Servers für Fernzugriff einsetzen",
        "Starke Passworteinsatzrichtlinien erlassen",
        "Sitzungsüberwachung und -aufzeichnung implementieren",
      ],
    },
  },
  {
    id: "scenario-3",
    name: {
      en: "Profinet Protocol Attack",
      ar: "هجوم بروتوكول Profinet",
      de: "Profinet-Protokollangriff",
    },
    description: {
      en: "Man-in-the-Middle attack on unencrypted Profinet communication",
      ar: "هجوم من وسط في اتصالات Profinet غير المشفرة",
      de: "Man-in-the-Middle-Angriff auf unverschlüsselte Profinet-Kommunikation",
    },
    targetDevice: "Siemens S7-1500 PLC",
    attackVector: {
      en: "Network - Internal Lateral Movement",
      ar: "الشبكة - حركة جانبية داخلية",
      de: "Netzwerk - Interner Lateralbewegung",
    },
    vulnerabilityCVE: "CVE-2019-13945",
    steps: [
      {
        id: 1,
        phase: {
          en: "Initial Access",
          ar: "الوصول الأولي",
          de: "Erstzugang",
        },
        action: {
          en: "Network Compromise",
          ar: "تسلل الشبكة",
          de: "Netzwerk-Kompromiss",
        },
        description: {
          en: "Attacker gains access to OT network via compromised workstation",
          ar: "يحقق المهاجم الوصول إلى الشبكة الصناعية عبر محطة عمل م.COMPROMISED",
          de: "Angreifer gewinnt Zugriff auf die OT-Netzwerk über eine kompromittierte Arbeitsstation",
        },
        success_probability: 0.7,
        impact_level: "medium",
        detectable: true,
        detection_method: {
          en: "EDR - Malicious activity on workstation",
          ar: "EDR - نشاط ضار على محطة العمل",
          de: "EDR - Böswillige Aktivitäten auf der Arbeitsstation",
        },
      },
      {
        id: 2,
        phase: {
          en: "Lateral Movement",
          ar: "الحركة الجانبية",
          de: "Lateralbewegung",
        },
        action: {
          en: "ARP Spoofing",
          ar: "الإيثرنيت الاحتيال",
          de: "ARP-Spoofing",
        },
        description: {
          en: "Attacker positions between PLC and HMI using ARP poisoning",
          ar: "يضع المهاجم بين PLC و HMI باستخدام هجمة ARP",
          de: "Angreifer positioniert sich zwischen PLC und HMI durch ARP-Poisoning",
        },
        success_probability: 0.85,
        impact_level: "medium",
        detectable: true,
        detection_method: {
          en: "Network monitoring - ARP anomalies",
          ar: "مراقبة الشبكة - الشذوذ في ARP",
          de: "Netzwerküberwachung - ARP-Anomalien",
        },
      },
      {
        id: 3,
        phase: {
          en: "Execution",
          ar: "التنفيذ",
          de: "Ausführung",
        },
        action: {
          en: "Traffic Interception",
          ar: "التقاط المرور",
          de: "Verkehrsaufnahme",
        },
        description: {
          en: "Attacker captures and modifies Profinet packets in real-time",
          ar: "يقاطع المهاجم ويعدل حزم Profinet بشكل مباشر",
          de: "Angreifer fängt und modifiziert Profinet-Pakete in Echtzeit",
        },
        success_probability: 0.8,
        impact_level: "high",
        detectable: false,
      },
      {
        id: 4,
        phase: {
          en: "Impact",
          ar: "التأثير",
          de: "Auswirkung",
        },
        action: {
          en: "Control Logic Manipulation",
          ar: "تعديل منطق التحكم",
          de: "Steuerungslogik-Manipulation",
        },
        description: {
          en: "Attacker injects malicious commands into PLC control flow",
          ar: "يحقق المهاجم الأوامر الضارة في تدفق التحكم في PLC",
          de: "Angreifer injiziert bösartige Befehle in den Steuerungsfluss des PLC",
        },
        success_probability: 0.75,
        impact_level: "critical",
        detectable: true,
        detection_method: {
          en: "PLC monitoring - Logic state inconsistencies",
          ar: "مراقبة PLC - عدم تطابق حالة المنطق",
          de: "PLC-Monitoring - Logikzustandsinkonsistenzen",
        },
      },
    ],
    impact: {
      financial: 280000,
      operational: {
        en: "Production quality issues, equipment calibration required",
        ar: "مشاكل في جودة الإنتاج، ضروري تعديل المعدات",
        de: "Produktionsqualitätsprobleme, Kalibrierung der Geräte erforderlich",
      },
      safety: {
        en: "Medium risk - Potential for unsafe process states",
        ar: "مخاطر متوسطة - خطر وجود حالات عملية غير آمنة",
        de: "Mittleres Risiko - Potenzielle Gefahr für unsichere Prozesszustände",
      },
    },
    detectionPoints: {
      en: [
        "Network TAP - Duplicate MAC addresses (ARP spoofing)",
        "ICS protocol analyzer - Malformed Profinet frames",
        "PLC diagnostics - Communication errors and retries",
        "Process monitoring - Unexpected behavior patterns",
      ],
      ar: [
        "Network TAP - عناوين MAC المكررة (ARP spoofing)",
        "ICS protocol analyzer - حزم Profinet غير صحيحة",
        "PLC diagnostics - أخطاء الاتصال والمحاولات المتكررة",
        "مراقبة العملية - أنماط سلوك غير متوقعة",
      ],
      de: [
        "Netzwerk-TAP - Doppelte MAC-Adressen (ARP-Spoofing)",
        "ICS-Protokollanalyse - Verformte Profinet-Frames",
        "PLC-Diagnose - Kommunikationsfehler und Wiederholungen",
        "Prozessüberwachung - Unerwartete Verhaltensmuster",
      ],
    },
    preventionMeasures: {
      en: [
        "Enable Profinet security features (PROFIsafe)",
        "Implement network segmentation with VLANs",
        "Deploy industrial switches with port security",
        "Use encrypted communication protocols where possible",
        "Implement continuous network monitoring",
        "Deploy endpoint protection on engineering workstations",
      ],
      ar: [
        "تمكين ميزات الأمان لـ Profinet (PROFIsafe)",
        "تنفيذ تقسيم الشبكة باستخدام VLANs",
        "نشر مفاتيح اتصال صناعي مع ميزات الأمان للمنافذ",
        "استخدام بروتوكولات الاتصال المشفرة حيثما أمكن",
        "تنفيذ مراقبة الشبكة المستمرة",
        "نشر حماية نقاط النهاية على محطات العمل الهندسية",
      ],
      de: [
        "Profinet-Sicherheitsfeatures aktivieren (PROFIsafe)",
        "Netzwerksegmentierung mit VLANs implementieren",
        "Industrielle Switches mit Port-Sicherheit einsetzen",
        "Verschlüsselte Kommunikationsprotokolle verwenden, wo möglich",
        "Ständige Netzwerküberwachung implementieren",
        "Endpunktschutz auf Ingenieurarbeitsstationen einsetzen",
      ],
    },
  },
]

export function runSimulation(
  scenarioId: string,
  language: "en" | "ar" | "de" = "en",
): {
  scenario: any
  totalRisk: number
  cascadingImpact: string[]
  recommendations: string[]
} {
  const scenario = simulationScenarios.find((s) => s.id === scenarioId)
  if (!scenario) {
    throw new Error("Scenario not found")
  }

  const localizedScenario = {
    ...scenario,
    name: scenario.name[language],
    description: scenario.description[language],
    attackVector: scenario.attackVector[language],
    steps: scenario.steps.map((step) => ({
      ...step,
      phase: step.phase[language],
      action: step.action[language],
      description: step.description[language],
      detection_method: step.detection_method ? step.detection_method[language] : undefined,
    })),
    impact: {
      financial: scenario.impact.financial,
      operational: scenario.impact.operational[language],
      safety: scenario.impact.safety[language],
    },
    detectionPoints: scenario.detectionPoints[language],
    preventionMeasures: scenario.preventionMeasures[language],
  }

  // Calculate total attack success probability
  const attackSuccessProbability = scenario.steps.reduce((acc, step) => acc * step.success_probability, 1)

  // Calculate risk score (0-100)
  const impactWeight =
    scenario.steps.filter((s) => s.impact_level === "critical").length * 40 +
    scenario.steps.filter((s) => s.impact_level === "high").length * 25 +
    scenario.steps.filter((s) => s.impact_level === "medium").length * 15 +
    scenario.steps.filter((s) => s.impact_level === "low").length * 5

  const totalRisk = Math.min(100, attackSuccessProbability * impactWeight)

  const cascadingImpactTemplates = {
    en: {
      financial: (amount: number) => `Financial Loss: €${amount.toLocaleString()}`,
      operational: (text: string) => `Operational Impact: ${text}`,
      safety: (text: string) => `Safety Concerns: ${text}`,
      reputation: "Reputation damage and regulatory scrutiny",
      trust: "Potential loss of customer trust",
    },
    ar: {
      financial: (amount: number) => `الخسارة المالية: €${amount.toLocaleString()}`,
      operational: (text: string) => `التأثير التشغيلي: ${text}`,
      safety: (text: string) => `المخاوف الأمنية: ${text}`,
      reputation: "أضرار بالسمعة والرقابة التنظيمية",
      trust: "فقدان محتمل لثقة العملاء",
    },
    de: {
      financial: (amount: number) => `Finanzieller Verlust: €${amount.toLocaleString()}`,
      operational: (text: string) => `Betriebliche Auswirkungen: ${text}`,
      safety: (text: string) => `Sicherheitsbedenken: ${text}`,
      reputation: "Reputationsschäden und behördliche Prüfung",
      trust: "Potenzieller Vertrauensverlust bei Kunden",
    },
  }

  const templates = cascadingImpactTemplates[language]
  const cascadingImpact = [
    templates.financial(localizedScenario.impact.financial),
    templates.operational(localizedScenario.impact.operational),
    templates.safety(localizedScenario.impact.safety),
    templates.reputation,
    templates.trust,
  ]

  return {
    scenario: localizedScenario,
    totalRisk,
    cascadingImpact,
    recommendations: localizedScenario.preventionMeasures,
  }
}
