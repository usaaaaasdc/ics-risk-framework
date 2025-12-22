export interface ComplianceRequirement {
  id: string
  category: string
  title: string
  description: string
  priority: "Critical" | "High" | "Medium" | "Low"
  estimatedDays: number
  dependencies: string[]
  tasks: string[]
  cost: {
    min: number
    max: number
  }
}

export interface CompliancePhase {
  phase: string
  duration: number
  requirements: ComplianceRequirement[]
  totalCost: { min: number; max: number }
}

export const IEC62443_REQUIREMENTS: ComplianceRequirement[] = [
  {
    id: "IAC",
    category: "Identification and Authentication Control",
    title: "User Identity Management",
    description: "Implement unique identification and authentication for all users and devices",
    priority: "Critical",
    estimatedDays: 30,
    dependencies: [],
    tasks: [
      "Implement unique user accounts for all personnel",
      "Deploy multi-factor authentication (MFA)",
      "Configure password policies (complexity, expiration)",
      "Implement device authentication certificates",
      "Set up centralized identity management system",
    ],
    cost: { min: 5000, max: 15000 },
  },
  {
    id: "UC",
    category: "Use Control",
    title: "Authorization and Access Control",
    description: "Enforce least privilege and role-based access control (RBAC)",
    priority: "Critical",
    estimatedDays: 45,
    dependencies: ["IAC"],
    tasks: [
      "Define user roles and responsibilities",
      "Implement role-based access control (RBAC)",
      "Configure permission matrices",
      "Set up access logging and monitoring",
      "Implement session management and timeout policies",
    ],
    cost: { min: 8000, max: 20000 },
  },
  {
    id: "SI",
    category: "System Integrity",
    title: "Software and Configuration Management",
    description: "Ensure integrity of software, firmware, and configuration data",
    priority: "High",
    estimatedDays: 60,
    dependencies: ["IAC"],
    tasks: [
      "Implement secure boot mechanisms",
      "Deploy code signing for all software updates",
      "Configure integrity checking mechanisms",
      "Establish change management procedures",
      "Implement version control for configurations",
    ],
    cost: { min: 10000, max: 25000 },
  },
  {
    id: "DC",
    category: "Data Confidentiality",
    title: "Encryption Implementation",
    description: "Protect sensitive data at rest and in transit using encryption",
    priority: "Critical",
    estimatedDays: 40,
    dependencies: [],
    tasks: [
      "Implement TLS/SSL for all network communications",
      "Deploy VPN for remote access",
      "Configure encryption for data at rest",
      "Implement secure key management system",
      "Encrypt backup data",
    ],
    cost: { min: 12000, max: 30000 },
  },
  {
    id: "RDF",
    category: "Restricted Data Flow",
    title: "Network Segmentation",
    description: "Segment network to limit lateral movement and contain breaches",
    priority: "Critical",
    estimatedDays: 50,
    dependencies: [],
    tasks: [
      "Design network segmentation architecture",
      "Deploy industrial firewalls between zones",
      "Configure VLANs for logical separation",
      "Implement unidirectional gateways for critical zones",
      "Set up demilitarized zones (DMZ)",
    ],
    cost: { min: 15000, max: 40000 },
  },
  {
    id: "TRE",
    category: "Timely Response to Events",
    title: "Security Monitoring and Incident Response",
    description: "Detect, respond to, and recover from security events",
    priority: "High",
    estimatedDays: 55,
    dependencies: ["UC", "RDF"],
    tasks: [
      "Deploy SIEM solution for log aggregation",
      "Configure security event alerting",
      "Develop incident response procedures",
      "Establish security operations center (SOC)",
      "Conduct incident response tabletop exercises",
    ],
    cost: { min: 20000, max: 50000 },
  },
  {
    id: "RA",
    category: "Resource Availability",
    title: "Business Continuity and Disaster Recovery",
    description: "Ensure availability of critical systems and data",
    priority: "High",
    estimatedDays: 45,
    dependencies: ["SI"],
    tasks: [
      "Develop business continuity plan (BCP)",
      "Implement redundant systems for critical components",
      "Configure automated backup systems",
      "Establish disaster recovery site",
      "Conduct regular DR testing",
    ],
    cost: { min: 18000, max: 45000 },
  },
  {
    id: "SVA",
    category: "Security Vulnerability Assessment",
    title: "Continuous Vulnerability Management",
    description: "Identify and remediate security vulnerabilities",
    priority: "Medium",
    estimatedDays: 35,
    dependencies: ["UC"],
    tasks: [
      "Deploy vulnerability scanning tools",
      "Establish regular scanning schedule",
      "Implement patch management process",
      "Conduct annual penetration testing",
      "Create vulnerability remediation workflow",
    ],
    cost: { min: 8000, max: 20000 },
  },
  {
    id: "SAT",
    category: "Security Awareness Training",
    title: "Personnel Security Training",
    description: "Train all personnel on security policies and procedures",
    priority: "Medium",
    estimatedDays: 20,
    dependencies: [],
    tasks: [
      "Develop security awareness training program",
      "Conduct initial security training for all personnel",
      "Implement quarterly security refresher courses",
      "Create security policy documentation",
      "Establish security incident reporting procedures",
    ],
    cost: { min: 3000, max: 10000 },
  },
  {
    id: "PM",
    category: "Physical Security",
    title: "Physical Access Control",
    description: "Protect physical access to critical systems and facilities",
    priority: "Medium",
    estimatedDays: 30,
    dependencies: [],
    tasks: [
      "Install access control systems for critical areas",
      "Deploy surveillance cameras",
      "Implement visitor management procedures",
      "Secure cable and equipment rooms",
      "Establish physical security monitoring",
    ],
    cost: { min: 10000, max: 25000 },
  },
]

export function generateComplianceRoadmap(currentCompliance: {
  [key: string]: boolean
}): CompliancePhase[] {
  const pendingRequirements = IEC62443_REQUIREMENTS.filter((req) => !currentCompliance[req.id])

  // Sort by dependencies and priority
  const sortedRequirements = [...pendingRequirements].sort((a, b) => {
    if (a.dependencies.length !== b.dependencies.length) {
      return a.dependencies.length - b.dependencies.length
    }
    const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const phases: CompliancePhase[] = [
    { phase: "Phase 1: Foundation", duration: 0, requirements: [], totalCost: { min: 0, max: 0 } },
    { phase: "Phase 2: Implementation", duration: 0, requirements: [], totalCost: { min: 0, max: 0 } },
    { phase: "Phase 3: Integration", duration: 0, requirements: [], totalCost: { min: 0, max: 0 } },
    { phase: "Phase 4: Optimization", duration: 0, requirements: [], totalCost: { min: 0, max: 0 } },
  ]

  sortedRequirements.forEach((req) => {
    let phaseIndex = 0

    if (req.priority === "Critical" && req.dependencies.length === 0) {
      phaseIndex = 0
    } else if (req.priority === "Critical" || req.priority === "High") {
      phaseIndex = 1
    } else if (req.priority === "Medium") {
      phaseIndex = 2
    } else {
      phaseIndex = 3
    }

    phases[phaseIndex].requirements.push(req)
    phases[phaseIndex].duration += req.estimatedDays
    phases[phaseIndex].totalCost.min += req.cost.min
    phases[phaseIndex].totalCost.max += req.cost.max
  })

  return phases.filter((phase) => phase.requirements.length > 0)
}

export function calculateComplianceProgress(currentCompliance: {
  [key: string]: boolean
}): {
  percentage: number
  completed: number
  total: number
  remainingDays: number
  remainingCost: { min: number; max: number }
} {
  const total = IEC62443_REQUIREMENTS.length
  const completed = Object.values(currentCompliance).filter(Boolean).length
  const percentage = (completed / total) * 100

  const pendingRequirements = IEC62443_REQUIREMENTS.filter((req) => !currentCompliance[req.id])
  const remainingDays = pendingRequirements.reduce((sum, req) => sum + req.estimatedDays, 0)
  const remainingCost = pendingRequirements.reduce(
    (sum, req) => ({
      min: sum.min + req.cost.min,
      max: sum.max + req.cost.max,
    }),
    { min: 0, max: 0 },
  )

  return {
    percentage,
    completed,
    total,
    remainingDays,
    remainingCost,
  }
}
