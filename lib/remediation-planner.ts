/**
 * ICS-Risk Framework
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 */

export interface RemediationTask {
  id: string
  title: string
  description: string
  priority: "critical" | "high" | "medium" | "low"
  category: "patch" | "config" | "network" | "access" | "monitoring" | "training"
  estimatedCost: number
  estimatedDays: number
  dependencies: string[]
  resources: string[]
  kpi: string
  status: "pending" | "in-progress" | "completed"
}

export interface RemediationPlan {
  projectName: string
  totalCost: number
  totalDuration: number
  phases: RemediationPhase[]
  tasks: RemediationTask[]
  timeline: TimelineEvent[]
  riskReduction: number
}

export interface RemediationPhase {
  phase: number
  name: string
  duration: number
  cost: number
  tasks: string[]
  startDate?: Date
  endDate?: Date
}

export interface TimelineEvent {
  taskId: string
  startDay: number
  endDay: number
  row: number
}

export function generateRemediationPlan(
  riskScore: number,
  vulnerabilities: any[],
  devices: any[],
  language: "ar" | "en" | "de" = "en",
): RemediationPlan {
  const tasks: RemediationTask[] = []

  // Generate tasks based on risk score and vulnerabilities
  if (riskScore >= 7) {
    tasks.push({
      id: "task-1",
      title:
        language === "ar"
          ? "عزل الشبكة الفوري"
          : language === "de"
            ? "Sofortige Netzwerkisolierung"
            : "Immediate Network Segmentation",
      description:
        language === "ar"
          ? "فصل شبكة OT عن شبكة IT وإنشاء DMZ"
          : language === "de"
            ? "OT-Netzwerk von IT-Netzwerk trennen und DMZ erstellen"
            : "Separate OT network from IT network and create DMZ",
      priority: "critical",
      category: "network",
      estimatedCost: 15000,
      estimatedDays: 7,
      dependencies: [],
      resources: ["Network Engineer", "Firewall"],
      kpi:
        language === "ar"
          ? "تقليل سطح الهجوم بنسبة 60%"
          : language === "de"
            ? "Angriffsfläche um 60% reduzieren"
            : "Reduce attack surface by 60%",
      status: "pending",
    })

    tasks.push({
      id: "task-2",
      title:
        language === "ar"
          ? "تطبيق التصحيحات الحرجة"
          : language === "de"
            ? "Kritische Patches anwenden"
            : "Apply Critical Patches",
      description:
        language === "ar"
          ? "تحديث جميع الأجهزة الحرجة بآخر التصحيحات الأمنية"
          : language === "de"
            ? "Alle kritischen Geräte mit den neuesten Sicherheitspatches aktualisieren"
            : "Update all critical devices with latest security patches",
      priority: "critical",
      category: "patch",
      estimatedCost: 5000,
      estimatedDays: 3,
      dependencies: ["task-1"],
      resources: ["System Administrator", "Maintenance Window"],
      kpi:
        language === "ar"
          ? "إصلاح 90% من الثغرات الحرجة"
          : language === "de"
            ? "90% kritische Schwachstellen beheben"
            : "Fix 90% of critical vulnerabilities",
      status: "pending",
    })
  }

  if (riskScore >= 5) {
    tasks.push({
      id: "task-3",
      title:
        language === "ar"
          ? "تفعيل المصادقة الثنائية"
          : language === "de"
            ? "Zwei-Faktor-Authentifizierung aktivieren"
            : "Enable Two-Factor Authentication",
      description:
        language === "ar"
          ? "تفعيل 2FA لجميع الحسابات الإدارية"
          : language === "de"
            ? "2FA für alle Administratorkonten aktivieren"
            : "Enable 2FA for all administrative accounts",
      priority: "high",
      category: "access",
      estimatedCost: 2000,
      estimatedDays: 2,
      dependencies: [],
      resources: ["IT Security Team", "Authentication System"],
      kpi:
        language === "ar"
          ? "تأمين 100% من الحسابات الإدارية"
          : language === "de"
            ? "100% Admin-Konten absichern"
            : "Secure 100% of admin accounts",
      status: "pending",
    })

    tasks.push({
      id: "task-4",
      title:
        language === "ar"
          ? "نشر نظام رصد الأحداث"
          : language === "de"
            ? "SIEM-System bereitstellen"
            : "Deploy SIEM System",
      description:
        language === "ar"
          ? "تثبيت وتكوين نظام SIEM للمراقبة المستمرة"
          : language === "de"
            ? "SIEM-System für kontinuierliche Überwachung installieren und konfigurieren"
            : "Install and configure SIEM for continuous monitoring",
      priority: "high",
      category: "monitoring",
      estimatedCost: 20000,
      estimatedDays: 14,
      dependencies: ["task-1"],
      resources: ["Security Analyst", "SIEM Software", "Log Collectors"],
      kpi:
        language === "ar"
          ? "رصد 95% من الأحداث الأمنية"
          : language === "de"
            ? "95% Sicherheitsereignisse überwachen"
            : "Monitor 95% of security events",
      status: "pending",
    })
  }

  tasks.push({
    id: "task-5",
    title:
      language === "ar"
        ? "تعطيل الخدمات غير المستخدمة"
        : language === "de"
          ? "Nicht verwendete Dienste deaktivieren"
          : "Disable Unused Services",
    description:
      language === "ar"
        ? "إيقاف جميع البروتوكولات والخدمات غير الضرورية"
        : language === "de"
          ? "Alle unnötigen Protokolle und Dienste stoppen"
          : "Stop all unnecessary protocols and services",
    priority: "medium",
    category: "config",
    estimatedCost: 1000,
    estimatedDays: 1,
    dependencies: ["task-2"],
    resources: ["System Administrator"],
    kpi:
      language === "ar"
        ? "تقليل سطح الهجوم بنسبة 30%"
        : language === "de"
          ? "Angriffsfläche um 30% reduzieren"
          : "Reduce attack surface by 30%",
    status: "pending",
  })

  tasks.push({
    id: "task-6",
    title: language === "ar" ? "تدريب الموظفين" : language === "de" ? "Mitarbeiterschulung" : "Employee Training",
    description:
      language === "ar"
        ? "برنامج تدريب شامل للتوعية الأمنية"
        : language === "de"
          ? "Umfassendes Schulungsprogramm für Sicherheitsbewusstsein"
          : "Comprehensive security awareness training program",
    priority: "medium",
    category: "training",
    estimatedCost: 3000,
    estimatedDays: 5,
    dependencies: [],
    resources: ["Security Trainer", "Training Materials"],
    kpi:
      language === "ar"
        ? "تدريب 100% من الموظفين"
        : language === "de"
          ? "100% Mitarbeiter schulen"
          : "Train 100% of employees",
    status: "pending",
  })

  tasks.push({
    id: "task-7",
    title:
      language === "ar"
        ? "تحديث سياسات الأمان"
        : language === "de"
          ? "Sicherheitsrichtlinien aktualisieren"
          : "Update Security Policies",
    description:
      language === "ar"
        ? "مراجعة وتحديث جميع السياسات الأمنية"
        : language === "de"
          ? "Alle Sicherheitsrichtlinien überprüfen und aktualisieren"
          : "Review and update all security policies",
    priority: "low",
    category: "config",
    estimatedCost: 500,
    estimatedDays: 3,
    dependencies: ["task-6"],
    resources: ["Security Officer", "Legal Team"],
    kpi:
      language === "ar"
        ? "امتثال 100% للمعايير"
        : language === "de"
          ? "100% Konformität mit Standards"
          : "100% compliance with standards",
    status: "pending",
  })

  tasks.push({
    id: "task-8",
    title:
      language === "ar"
        ? "النسخ الاحتياطي والاسترداد"
        : language === "de"
          ? "Backup und Wiederherstellung"
          : "Backup and Recovery",
    description:
      language === "ar"
        ? "إنشاء نظام نسخ احتياطي شامل وخطة استرداد"
        : language === "de"
          ? "Umfassendes Backup-System und Wiederherstellungsplan erstellen"
          : "Establish comprehensive backup system and recovery plan",
    priority: "high",
    category: "config",
    estimatedCost: 8000,
    estimatedDays: 7,
    dependencies: ["task-1"],
    resources: ["System Administrator", "Backup Storage"],
    kpi: language === "ar" ? "RTO < 4 ساعات" : language === "de" ? "RTO < 4 Stunden" : "RTO < 4 hours",
    status: "pending",
  })

  // Calculate phases
  const phases = calculatePhases(tasks, language)

  // Calculate timeline
  const timeline = calculateTimeline(tasks)

  // Calculate totals
  const totalCost = tasks.reduce((sum, task) => sum + task.estimatedCost, 0)
  const totalDuration = Math.max(...timeline.map((t) => t.endDay))

  // Calculate risk reduction
  const riskReduction = calculateRiskReduction(tasks)

  return {
    projectName: "ICS Security Remediation",
    totalCost,
    totalDuration,
    phases,
    tasks,
    timeline,
    riskReduction,
  }
}

function calculatePhases(tasks: RemediationTask[], language: "ar" | "en" | "de"): RemediationPhase[] {
  const criticalTasks = tasks.filter((t) => t.priority === "critical")
  const highTasks = tasks.filter((t) => t.priority === "high")
  const mediumTasks = tasks.filter((t) => t.priority === "medium")
  const lowTasks = tasks.filter((t) => t.priority === "low")

  return [
    {
      phase: 1,
      name: language === "ar" ? "الاستجابة الفورية" : language === "de" ? "Sofortmaßnahmen" : "Immediate Response",
      duration: Math.max(...criticalTasks.map((t) => t.estimatedDays), 0),
      cost: criticalTasks.reduce((sum, t) => sum + t.estimatedCost, 0),
      tasks: criticalTasks.map((t) => t.id),
    },
    {
      phase: 2,
      name:
        language === "ar"
          ? "التحسينات الأساسية"
          : language === "de"
            ? "Grundlegende Verbesserungen"
            : "Core Improvements",
      duration: Math.max(...highTasks.map((t) => t.estimatedDays), 0),
      cost: highTasks.reduce((sum, t) => sum + t.estimatedCost, 0),
      tasks: highTasks.map((t) => t.id),
    },
    {
      phase: 3,
      name:
        language === "ar" ? "التعزيز والتحسين" : language === "de" ? "Verstärkung und Verbesserung" : "Strengthening",
      duration: Math.max(...mediumTasks.map((t) => t.estimatedDays), 0),
      cost: mediumTasks.reduce((sum, t) => sum + t.estimatedCost, 0),
      tasks: mediumTasks.map((t) => t.id),
    },
    {
      phase: 4,
      name:
        language === "ar"
          ? "التحسين المستمر"
          : language === "de"
            ? "Kontinuierliche Verbesserung"
            : "Continuous Improvement",
      duration: Math.max(...lowTasks.map((t) => t.estimatedDays), 0),
      cost: lowTasks.reduce((sum, t) => sum + t.estimatedCost, 0),
      tasks: lowTasks.map((t) => t.id),
    },
  ]
}

function calculateTimeline(tasks: RemediationTask[]): TimelineEvent[] {
  const timeline: TimelineEvent[] = []
  const taskStartDays = new Map<string, number>()

  let currentDay = 0
  let rowCounter = 0

  // Sort by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  for (const task of sortedTasks) {
    // Check dependencies
    let startDay = currentDay
    for (const depId of task.dependencies) {
      const depEndDay = timeline.find((t) => t.taskId === depId)?.endDay || 0
      startDay = Math.max(startDay, depEndDay)
    }

    taskStartDays.set(task.id, startDay)

    timeline.push({
      taskId: task.id,
      startDay,
      endDay: startDay + task.estimatedDays,
      row: rowCounter,
    })

    rowCounter++

    // Tasks without dependencies can run in parallel
    if (task.dependencies.length === 0) {
      currentDay = 0
    } else {
      currentDay = startDay + task.estimatedDays
    }
  }

  return timeline
}

function calculateRiskReduction(tasks: RemediationTask[]): number {
  let reduction = 0

  for (const task of tasks) {
    switch (task.priority) {
      case "critical":
        reduction += 25
        break
      case "high":
        reduction += 15
        break
      case "medium":
        reduction += 8
        break
      case "low":
        reduction += 2
        break
    }
  }

  return Math.min(reduction, 85) // Max 85% reduction
}
