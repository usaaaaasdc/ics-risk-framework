export type SecurityLevel = 0 | 1 | 2 | 3 | 4

export interface SystemRequirement {
    id: string
    nameEn: string
    nameAr: string
    nameDe: string
    descriptionEn: string
    descriptionAr: string
    descriptionDe: string
    requiredForSL: SecurityLevel
}

export interface FoundationalRequirement {
    id: string
    nameEn: string
    nameAr: string
    nameDe: string
    requirements: SystemRequirement[]
}

export const iec62443Standards: FoundationalRequirement[] = [
    {
        id: "FR1",
        nameEn: "Identification and Authentication Control (IAC)",
        nameAr: "التحكم في التعريف والمصادقة",
        nameDe: "Identifizierungs- und Authentifizierungskontrolle",
        requirements: [
            {
                id: "SR 1.1",
                nameEn: "Human User Identification and Authentication",
                nameAr: "تعريف ومصادقة المستخدم البشري",
                nameDe: "Identifizierung und Authentifizierung menschlicher Benutzer",
                descriptionEn: "The system shall identify and authenticate all human users.",
                descriptionAr: "يجب أن يحدد النظام ويصادق جميع المستخدمين البشريين.",
                descriptionDe: "Das System muss alle menschlichen Benutzer identifizieren und authentifizieren.",
                requiredForSL: 1,
            },
            {
                id: "SR 1.2",
                nameEn: "Software Process and Device Identification and Authentication",
                nameAr: "تعريف ومصادقة العمليات البرمجية والأجهزة",
                nameDe: "Identifizierung und Authentifizierung von Softwareprozessen und Geräten",
                descriptionEn: "The system shall identify and authenticate all software processes and devices.",
                descriptionAr: "يجب أن يحدد النظام ويصادق جميع العمليات البرمجية والأجهزة.",
                descriptionDe: "Das System muss alle Softwareprozesse und Geräte identifizieren und authentifizieren.",
                requiredForSL: 2,
            },
            {
                id: "SR 1.3",
                nameEn: "Account Management",
                nameAr: "إدارة الحسابات",
                nameDe: "Kontoverwaltung",
                descriptionEn: "The system shall provide the capability to manage all accounts.",
                descriptionAr: "يجب أن يوفر النظام القدرة على إدارة جميع الحسابات.",
                descriptionDe: "Das System muss die Möglichkeit bieten, alle Konten zu verwalten.",
                requiredForSL: 1,
            },
            {
                id: "SR 1.5",
                nameEn: "Authenticator Management",
                nameAr: "إدارة المصادقات",
                nameDe: "Authentifikator-Management",
                descriptionEn: "The system shall provide the capability to manage authenticators.",
                descriptionAr: "يجب أن يوفر النظام القدرة على إدارة وسائل المصادقة.",
                descriptionDe: "Das System muss die Möglichkeit bieten, Authentifikatoren zu verwalten.",
                requiredForSL: 2,
            },
        ],
    },
    {
        id: "FR2",
        nameEn: "Use Control (UC)",
        nameAr: "التحكم في الاستخدام",
        nameDe: "Nutzungskontrolle",
        requirements: [
            {
                id: "SR 2.1",
                nameEn: "Authorization Enforcement",
                nameAr: "فرض التفويض",
                nameDe: "Durchsetzung der Autorisierung",
                descriptionEn: "The system shall enforce assigned authorizations for all human users.",
                descriptionAr: "يجب أن يفرض النظام التفويضات المخصصة لجميع المستخدمين البشريين.",
                descriptionDe: "Das System muss die zugewiesenen Autorisierungen für alle menschlichen Benutzer durchsetzen.",
                requiredForSL: 1,
            },
            {
                id: "SR 2.8",
                nameEn: "Auditable Events",
                nameAr: "الأحداث القابلة للتدقيق",
                nameDe: "Auditierbare Ereignisse",
                descriptionEn: "The system shall generate audit records for security-relevant events.",
                descriptionAr: "يجب أن ينشئ النظام سجلات تدقيق للأحداث المتعلقة بالأمن.",
                descriptionDe: "Das System muss Audit-Datensätze für sicherheitsrelevante Ereignisse generieren.",
                requiredForSL: 2,
            },
            {
                id: "SR 2.11",
                nameEn: "Timestamps",
                nameAr: "الطوابع الزمنية",
                nameDe: "Zeitstempel",
                descriptionEn: "The system shall create timestamps for use in audit records.",
                descriptionAr: "يجب أن ينشئ النظام طوابع زمنية للاستخدام في سجلات التدقيق.",
                descriptionDe: "Das System muss Zeitstempel für die Verwendung in Audit-Datensätzen erstellen.",
                requiredForSL: 2,
            },
        ],
    },
    {
        id: "FR3",
        nameEn: "System Integrity (SI)",
        nameAr: "سلامة النظام",
        nameDe: "Systemintegrität",
        requirements: [
            {
                id: "SR 3.1",
                nameEn: "Communication Integrity",
                nameAr: "سلامة الاتصالات",
                nameDe: "Kommunikationsintegrität",
                descriptionEn: "The system shall protect the integrity of transmitted information.",
                descriptionAr: "يجب أن يحمي النظام سلامة المعلومات المرسلة.",
                descriptionDe: "Das System muss die Integrität der übertragenen Informationen schützen.",
                requiredForSL: 1,
            },
            {
                id: "SR 3.2",
                nameEn: "Malicious Code Protection",
                nameAr: "الحماية من البرمجيات الخبيثة",
                nameDe: "Schutz vor schädlichem Code",
                descriptionEn: "The system shall provide protection against malicious code.",
                descriptionAr: "يجب أن يوفر النظام حماية ضد البرمجيات الخبيثة.",
                descriptionDe: "Das System muss Schutz vor schädlichem Code bieten.",
                requiredForSL: 1,
            },
        ],
    },
    {
        id: "FR4",
        nameEn: "Data Confidentiality (DC)",
        nameAr: "سرية البيانات",
        nameDe: "Datenvertraulichkeit",
        requirements: [
            {
                id: "SR 4.1",
                nameEn: "Information Confidentiality",
                nameAr: "سرية المعلومات",
                nameDe: "Informationsvertraulichkeit",
                descriptionEn: "The system shall ensure the confidentiality of information.",
                descriptionAr: "يجب أن يضمن النظام سرية المعلومات.",
                descriptionDe: "Das System muss die Vertraulichkeit von Informationen gewährleisten.",
                requiredForSL: 1,
            },
        ],
    },
    {
        id: "FR5",
        nameEn: "Restricted Data Flow (RDF)",
        nameAr: "تدفق البيانات المقيد",
        nameDe: "Eingeschränkter Datenfluss",
        requirements: [
            {
                id: "SR 5.1",
                nameEn: "Network Segmentation",
                nameAr: "تقسيم الشبكة",
                nameDe: "Netzwerksegmentierung",
                descriptionEn: "The system shall logically segment control networks from non-control networks.",
                descriptionAr: "يجب أن يقسم النظام شبكات التحكم منطقياً عن الشبكات غير التحكمية.",
                descriptionDe: "Das System muss Steuerungsnetzwerke logisch von Nicht-Steuerungsnetzwerken segmentieren.",
                requiredForSL: 1,
            },
            {
                id: "SR 5.2",
                nameEn: "Zone Boundary Protection",
                nameAr: "حماية حدود المنطقة",
                nameDe: "Zonenrandschutz",
                descriptionEn: "The system shall prevent unauthorized data flow across zone boundaries.",
                descriptionAr: "يجب أن يمنع النظام تدفق البيانات غير المصرح به عبر حدود المنطقة.",
                descriptionDe: "Das System muss unbefugten Datenfluss über Zonengrenzen hinweg verhindern.",
                requiredForSL: 2,
            },
        ],
    },
    {
        id: "FR6",
        nameEn: "Timely Response to Events (TRE)",
        nameAr: "الاستجابة في الوقت المناسب للأحداث",
        nameDe: "Rechtzeitige Reaktion auf Ereignisse",
        requirements: [
            {
                id: "SR 6.1",
                nameEn: "Audit Log Accessibility",
                nameAr: "إمكانية الوصول لسجلات التدقيق",
                nameDe: "Zugänglichkeit von Audit-Protokollen",
                descriptionEn: "The system shall provide the capability for authorized users to access audit logs.",
                descriptionAr: "يجب أن يوفر النظام القدرة للمستخدمين المصرح لهم للوصول إلى سجلات التدقيق.",
                descriptionDe: "Das System muss autorisierten Benutzern den Zugriff auf Audit-Protokolle ermöglichen.",
                requiredForSL: 1,
            },
        ],
    },
    {
        id: "FR7",
        nameEn: "Resource Availability (RA)",
        nameAr: "توافر الموارد",
        nameDe: "Ressourcenverfügbarkeit",
        requirements: [
            {
                id: "SR 7.1",
                nameEn: "Denial of Service Protection",
                nameAr: "الحماية من حجب الخدمة",
                nameDe: "Schutz vor Denial-of-Service",
                descriptionEn: "The system shall provide the capability to maintain essential functions during a DoS attack.",
                descriptionAr: "يجب أن يوفر النظام القدرة على الحفاظ على الوظائف الأساسية أثناء هجوم DoS.",
                descriptionDe: "Das System muss die Fähigkeit bieten, wesentliche Funktionen während eines DoS-Angriffs aufrechtzuerhalten.",
                requiredForSL: 1,
            },
            {
                id: "SR 7.2",
                nameEn: "Resource Management",
                nameAr: "إدارة الموارد",
                nameDe: "Ressourcenmanagement",
                descriptionEn: "The system shall limit the usage of resources by non-critical functions.",
                descriptionAr: "يجب أن يحد النظام من استخدام الموارد من قبل الوظائف غير الحرجة.",
                descriptionDe: "Das System muss die Nutzung von Ressourcen durch nicht kritische Funktionen begrenzen.",
                requiredForSL: 2,
            },
        ],
    },
]
