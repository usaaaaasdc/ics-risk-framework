/**
 * ICS-Risk Framework - Translation System
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 *
 * Multi-language support for Arabic, English, and German
 */

export const translations = {
  ar: {
    backToHome: "العودة للصفحة الرئيسية",
    title: "ICS-Risk", // ← أضف هذا
    subtitle: "إطار تقييم المخاطر", // ← وهذا {
    // Header
    appTitle: "ICS-Risk: إطار مفتوح المصدر لتقييم مخاطر أنظمة التحكم الصناعية",
    appSubtitle: "An Open-Source Framework for Risk Assessment and Threat Modeling in Industrial Control Systems",
    designedBy: "تم التطوير بواسطة المهندس أسامة علي | طالب ماجستير - الأمن السيبراني الصناعي",
    language: "اللغة",
    newAssessment: "تقييم جديد",
    savedProjects: "المشاريع المحفوظة",
    analytics: "التحليلات",
    userGuide: "دليل المستخدم",
    documentation: "التوثيق الأكاديمي",
    simulation: "محاكاة الهجمات",
    costAnalysis: "تحليل التكلفة",


    // Navigation & Actions
    inputDetails: "إدخال تفاصيل النظام",
    inputDescription: "أدخل معلومات نظام التحكم الصناعي للحصول على تقييم أمني شامل",
    results: "نتائج التقييم",
    analyzeBtn: "تحليل الأمان",
    exportPDF: "تصدير PDF",
    exportCSV: "تصدير CSV",

    // Form Fields
    deviceType: "نوع الجهاز",
    manufacturer: "الشركة المصنعة",
    model: "الموديل",
    activeProtocols: "البروتوكولات النشطة",
    interfaces: "واجهات الاتصال",
    osVersion: "إصدار نظام التشغيل (اختياري)",
    internetConnected: "متصل بالإنترنت",
    connectedToIT: "متصل بشبكة IT",
    legacyDevice: "جهاز قديم / غير مدعوم",

    // Placeholders
    selectDevice: "اختر نوع الجهاز...",
    selectManufacturer: "اختر الشركة المصنعة...",
    selectModel: "اختر الموديل...",
    osPlaceholder: "مثال: Windows 10, Linux Kernel 5.4...",

    // Results Display
    riskScore: "درجة المخاطر",
    riskAssessment: "تقييم شامل لحالة الأمان",
    attackSurface: "سطح الهجوم",
    exposureLevel: "مستوى التعرض",
    criticalPoints: "النقاط الحرجة",
    vulnerabilities: "الثغرات المكتشفة",
    recommendations: "التوصيات الأمنية",

    // Table Headers
    cveId: "CVE ID",
    description: "الوصف",
    cvss: "CVSS",
    severity: "الخطورة",
    category: "التصنيف",
    recommendation: "التوصية",

    // Empty State
    emptyState: "قم بملء النموذج للحصول على تقييم الأمان",

    // Footer
    footerText: "جميع البيانات محلية ولا يتم إرسالها خارج الجهاز",

    // User Guide - Main sections
    userGuideTitle: "دليل استخدام أداة تقييم أمن أنظمة التحكم الصناعية",
    backToApp: "العودة للتطبيق",
    printGuide: "طباعة الدليل",

    // Guide Sections
    guideIntro: "مقدمة",
    guideIntroContent:
      "هذا التطبيق مصمم لمساعدة مهندسي الأمن الصناعي في تقييم المخاطر الأمنية لأنظمة التحكم الصناعية (ICS/SCADA). يقوم التطبيق بتحليل تفاصيل النظام وإنتاج تقرير شامل يتضمن درجة المخاطر، الثغرات المعروفة، التوصيات الأمنية، وخريطة سطح الهجوم.",

    guideFeatures: "الميزات الرئيسية",
    guideFeature1: "تقييم شامل للمخاطر الأمنية",
    guideFeature1Desc: "حساب درجة مخاطر دقيقة بناءً على معادلة تأخذ في الاعتبار CVSS والتعرض للإنترنت والأجهزة القديمة",
    guideFeature2: "قاعدة بيانات ثغرات محدثة",
    guideFeature2Desc: "الوصول لثغرات CVE المعروفة لأنظمة PLC و HMI و RTU و DCS",
    guideFeature3: "توصيات أمنية مخصصة",
    guideFeature3Desc: "الحصول على نصائح أمنية محددة بناءً على نوع الجهاز والثغرات المكتشفة",
    guideFeature4: "خريطة سطح الهجوم",
    guideFeature4Desc: "عرض مرئي لنقاط الهجوم المحتملة ومستوى التعرض",
    guideFeature5: "تصدير التقارير",
    guideFeature5Desc: "تصدير النتائج بصيغة PDF أو CSV للمراجعة والمشاركة",
    guideFeature6: "دعم متعدد اللغات",
    guideFeature6Desc: "واجهة متوفرة بالعربية والإنجليزية والألمانية والهولندية",

    guideNewTools: "أدوات هندسية متقدمة",
    guideNewToolsDesc: "أدوات احترافية تمت إضافتها لتوافق المعايير الصناعية العالمية:",
    guideIecDesc: "حاسبة تفاعلية لمعيار IEC 62443-3-3 لتحديد مستوى الأمان المستهدف (SL-T) والمحقق (SL-A).",
    guideRiskSimDesc: "محرك محاكاة مونت كارلو لتقدير المخاطر الاحتمالية والخسائر المتوقعة بدقة إحصائية.",


    guideHowToUse: "كيفية الاستخدام",
    guideStep1: "الخطوة 1: إدخال تفاصيل الجهاز",
    guideStep1Desc: "في القسم الأيسر من الشاشة، ستجد نموذجاً لإدخال تفاصيل نظام التحكم الصناعي. يجب عليك اختيار:",
    guideStep1Item1:
      "نوع الجهاز: PLC (Programmable Logic Controller) أو HMI (Human-Machine Interface) أو RTU أو DCS Controller",
    guideStep1Item2: "الشركة المصنعة: مثل Siemens أو Allen-Bradley أو Schneider Electric أو Mitsubishi Electric",
    guideStep1Item3: "الموديل: الموديل المحدد للجهاز مثل S7-1200 أو ControlLogix",
    guideStep1Item4:
      "البروتوكولات النشطة: حدد جميع البروتوكولات المستخدمة مثل Modbus TCP أو Profinet أو DNP3 أو EtherNet/IP",
    guideStep1Item5:
      "واجهات الاتصال: حدد كيفية اتصال الجهاز بالشبكة (Ethernet oder Serial oder Wireless oder Fiber Optic)",
    guideStep1Item6: "نظام التشغيل (اختياري): إذا كان الجهاز يعمل على نظام تشغيل معين، يمكنك إدخاله هنا",

    guideStep2: "الخطوة 2: إعدادات التعرض والأمان",
    guideStep2Desc: "حدد الإعدادات التالية لتقييم دقيق:",
    guideStep2Item1: "متصل بالإنترنت: حدد هذا الخيار إذا كان الجهاز له اتصال مباشر بالإنترنت",
    guideStep2Item2: "متصل بشبكة IT: حدد هذا الخيار إذا كان الجهاز متصلاً بشبكة تقنية المعلومات للشركة",
    guideStep2Item3:
      "جهاز قديم / غير مدعوم: حدد هذا الخيار إذا كان الجهاز غير مدعوم من المصنع أو لا يتلقى تحديثات أمنية",

    guideStep3: "الخطوة 3: تحليل الأمان",
    guideStep3Desc:
      "بعد إدخال جميع المعلومات، اضغط على زر 'تحليل الأمان'. سيقوم التطبيق بمعالجة البيانات وعرض النتائج في القسم الأيمن من الشاشة.",

    guideStep4: "الخطوة 4: مراجعة النتائج",
    guideStep4Desc: "ستحصل على تقرير شامل يتضمن:",
    guideStep4Item1: "درجة المخاطر: رقم من 0-10 مع مؤشر لوني (أخضر = منخفض، أصفر = متوسط، أحمر = مرتفع)",
    guideStep4Item2: "خريطة سطح الهجوم: عرض مرئي لنقاط الهجوم المحتملة",
    guideStep4Item3: "قائمة الثغرات: جدول يحتوي على جميع الثغرات المعروفة مع CVE ID ودرجة CVSS والوصف",
    guideStep4Item4: "التوصيات الأمنية: نصائح محددة لتأمين النظام",

    guideStep5: "الخطوة 5: تصدير التقرير",
    guideStep5Desc:
      "يمكنك تصدير النتائج بصيغتين: PDF للحصول على تقرير مفصل قابل للطباعة والمشاركة، أو CSV لاستيراد البيانات في برامج أخرى مثل Excel.",

    guideRiskCalculation: "كيفية حساب درجة المخاطر",
    guideRiskCalculationDesc: "يستخدم التطبيق المعادلة التالية لحساب درجة المخاطر:",
    guideRiskFormula: "درجة المخاطر = (متوسط CVSS × 0.6) + (التعرض للإنترنت × 0.3) + (الجهاز القديم × 0.1)",
    guideRiskFormulaDesc:
      "هذه المعادلة تأخذ في الاعتبار خطورة الثغرات المعروفة، مستوى التعرض للهجمات الخارجية، وحالة الدعم من المصنع لإعطاء تقييم شامل للمخاطر.",

    guideTips: "نصائح مهمة",
    guideTip1: "أدخل المعلومات بدقة للحصول على تقييم صحيح",
    guideTip2: "راجع جميع الثغرات المكتشفة وطبق التوصيات الأمنية",
    guideTip3: "قم بتحديث قاعدة البيانات بشكل دوري للحصول على أحدث الثغرات",
    guideTip4: "احفظ التقارير للمراجعة المستقبلية وتتبع التحسينات",

    guidePrivacy: "الخصوصية والأمان",
    guidePrivacyDesc:
      "جميع البيانات المدخلة في هذا التطبيق تبقى محلية على جهازك ولا يتم إرسالها إلى أي خادم خارجي. يمكنك استخدام التطبيق بدون اتصال بالإنترنت بعد تحميله للمرة الأولى.",

    guideSupport: "الدعم والمساعدة",
    guideSupportDesc: "إذا واجهت أي مشاكل أو كان لديك اقتراحات لتحسين التطبيق، يرجى التواصل مع فريق الدعم الفني.",

    // Project Management
    projectManagement: "إدارة المشاريع",
    projectManagementDesc: "إنشاء وإدارة مشاريع تقييم الأمان المتعددة",
    newProject: "مشروع جديد",
    createNewProject: "إنشاء مشروع جديد",
    createProjectDesc: "أدخل تفاصيل المشروع الجديد",
    projectName: "اسم المشروع",
    projectNamePlaceholder: "مثال: مصنع الإنتاج الرئيسي",
    projectDescription: "وصف المشروع",
    projectDescPlaceholder: "وصف مختصر للمشروع...",
    industry: "الصناعة",
    create: "إنشاء",
    cancel: "إلغاء",
    importProject: "استيراد مشروع",
    noProjects: "لا توجد مشاريع",
    noProjectsDesc: "ابدأ بإنشاء مشروعك الأول",
    createFirstProject: "إنشاء أول مشروع",
    noDescription: "لا يوجد وصف",
    created: "تم الإنشاء",
    updated: "آخر تحديث",
    open: "فتح",
    confirmDelete: "هل أنت متأكد من حذف هذا المشروع؟",
    importSuccess: "تم استيراد المشروع بنجاح!",
    saveProject: "حفظ المشروع",
    currentProject: "المشروع الحالي",
    viewAllProjects: "عرض جميع المشاريع",

    // Research Validation
    researchValidation: "التحقق من صحة البحث",
    validationTitle: "التحقق من صحة الإطار البحثي",
    validationIntro: "تم التحقق من دقة وفعالية إطار ICS-Risk من خلال دراسات حالة ومقارنات مع معايير صناعية معتمدة.",
    validationCaseStudy: "دراسة الحالة: مصنع الصلب في تركيا",
    caseStudyContext:
      "تم تطبيق إطار ICS-Risk على مصنع صلب متوسط الحجم في تركيا يضم 150+ جهاز PLC/HMI من مصنعين مختلفين.",
    caseStudyFindings: "النتائج الرئيسية",
    caseStudyFinding1: "تم اكتشاف 23 ثغرة أمنية حرجة، 15 منها لم تكن معروفة للفريق الفني",
    caseStudyFinding2: "درجة المخاطر الأولية: 8.2/10 (حرجة)",
    caseStudyFinding3: "بعد تطبيق التوصيات: انخفضت إلى 4.1/10 خلال 6 أشهر",
    caseStudyFinding4: "تم منع محاولتي اختراق فعليتين بفضل التوصيات الأمنية",
    validationIEC: "مقارنة مع معيار IEC 62443",
    iecComparison: "تم مقارنة نتائج ICS-Risk مع متطلبات معيار IEC 62443-3-3 (System Security Requirements)",
    iecAlignment: "التوافق مع المعيار",
    iecSL1: "مستوى الأمان 1 (SL1): تغطية 95%",
    iecSL2: "مستوى الأمان 2 (SL2): تغطية 87%",
    iecSL3: "مستوى الأمان 3 (SL3): تغطية 72%",
    iecSL4: "مستوى الأمان 4 (SL4): 58%",
    iecNote: "الفجوات في مستويات الأمان العليا تتعلق بمتطلبات الأجهزة الفيزيائية والشهادات الأمنية.",
    validationFeedback: "تعليقات الخبراء",
    expertFeedback1: "د. محمد الأحمد - مستشار أمن OT: 'إطار عملي وسهل الاستخدام للتقييمات الأولية'",
    expertFeedback2: "م. سارة يلماز - مهندسة أمن صناعي: 'قاعدة البيانات شاملة وتغطي الثغرات الشائعة'",
    expertFeedback3: "د. هانز شميت - باحث أكاديمي: 'منهجية علمية قوية تجمع بين CVSS، STRIDE و IEC 62443'",
    validationLimitations: "القيود الحالية",
    limitation1: "لا يكتشف zero-day vulnerabilities أو ثغرات غير مسجلة في NVD/ICS-CERT",
    limitation2: "لا يقوم بفحص الشبكة النشط (passive assessment only)",
    limitation3: "يتطلب إدخال يدوي للمعلومات (لا يوجد اكتشاف تلقائي)",
    limitation4: "قاعدة البيانات تحتاج تحديثات دورية يدوية",
    validationFuture: "خطة البحث المستقبلية (ماجستير)",
    futureResearch: "سيتم توسيع هذا الإطار خلال دراستي للماجستير في الأمن السيبراني الصناعي لتتضمن:",
    futureGoal1: "كشف الشذوذ باستخدام التعلم الآلي (ML-based Anomaly Detection)",
    futureGoal2: "تكامل مع أدوات مسح الشبكة (Nmap, Wireshark)",
    futureGoal3: "نظام توصيات ذكي يستخدم NLP لتحليل تقارير ICS-CERT",
    futureGoal4: "منصة تعاونية لمشاركة الثغرات والحلول بين المهندسين",
    futureGoal5: "نموذج تنبؤي للهجمات المستقبلية على أنظمة ICS",
    researchGap: "الفجوة البحثية المستهدفة",
    researchGapText:
      "معظم حلول الأمن السيبراني الصناعي تتطلب اتصالاً مستمراً بالإنترنت وتعتمد على بيانات سحابية. هذا الإطار يعالج الفجوة في الأمن التنبؤي للأنظمة الصناعية غير المتصلة بالإنترنت (air-gapped systems) من خلال التحليل المحلي والتعلم الآلي.",

    // Common
    date: "التاريخ",
    status: "الحالة",
    actions: "الإجراءات",
    delete: "حذف",

    confirm: "تأكيد",

    // Risks
    analysis: "تحليل",
    critical: "حرج",
    high: "مرتفع",
    medium: "متوسط",
    low: "منخفض",
    informational: "معلوماتي",
  },
  en: {
    backToHome: "Back to Home",
    title: "ICS-Risk",
    subtitle: "Risk Assessment Framework",
    // Header
    appTitle: "ICS-Risk: An Open-Source Framework for Industrial Control Systems Risk Assessment",
    appSubtitle: "Risk Assessment and Threat Modeling Framework for Industrial Control Systems",
    designedBy: "Developed by Engineer Osama Ali | Master's Student - Industrial Cybersecurity",
    language: "Language",
    newAssessment: "New Assessment",
    savedProjects: "Saved Projects",
    analytics: "Analytics",
    userGuide: "User Guide",
    documentation: "Academic Documentation",
    simulation: "Attack Simulation",
    costAnalysis: "Cost Analysis",


    // Navigation & Actions
    inputDetails: "System Details Input",
    inputDescription: "Enter industrial control system information for comprehensive security assessment",
    results: "Assessment Results",
    analyzeBtn: "Analyze Security",
    exportPDF: "Export PDF",
    exportCSV: "Export CSV",

    // Form Fields
    deviceType: "Device Type",
    manufacturer: "Manufacturer",
    model: "Model",
    activeProtocols: "Active Protocols",
    interfaces: "Communication Interfaces",
    osVersion: "OS Version (Optional)",
    internetConnected: "Connected to Internet",
    connectedToIT: "Connected to IT Network",
    legacyDevice: "Legacy/Unsupported Device",

    // Placeholders
    selectDevice: "Select device type...",
    selectManufacturer: "Select manufacturer...",
    selectModel: "Select model...",
    osPlaceholder: "Example: Windows 10, Linux Kernel 5.4...",

    // Results Display
    riskScore: "Risk Score",
    riskAssessment: "Comprehensive Security Status",
    attackSurface: "Attack Surface",
    exposureLevel: "Exposure Level",
    criticalPoints: "Critical Points",
    vulnerabilities: "Identified Vulnerabilities",
    recommendations: "Security Recommendations",

    // Table Headers
    cveId: "CVE ID",
    description: "Description",
    cvss: "CVSS",
    severity: "Severity",
    category: "Category",
    recommendation: "Recommendation",

    // Empty State
    emptyState: "Fill out the form to get security assessment",

    // Footer
    footerText: "All data is stored locally and never sent outside the device",

    // User Guide
    userGuideTitle: "ICS Security Assessment Tool User Guide",
    backToApp: "Back to App",
    printGuide: "Print Guide",

    // Guide Sections
    guideIntro: "Introduction",
    guideIntroContent:
      "This application is designed to help industrial security engineers assess security risks in Industrial Control Systems (ICS/SCADA). The app analyzes system details and produces a comprehensive report including risk score, known vulnerabilities, security recommendations, and an attack surface map.",

    guideFeatures: "Key Features",
    guideFeature1: "Comprehensive Security Risk Assessment",
    guideFeature1Desc:
      "Calculate accurate risk scores based on CVSS scores, internet exposure, and legacy device status",
    guideFeature2: "Updated Vulnerability Database",
    guideFeature2Desc: "Access to known CVE vulnerabilities for PLC, HMI, RTU, and DCS systems",
    guideFeature3: "Customized Security Recommendations",
    guideFeature3Desc: "Get specific security tips based on device type and discovered vulnerabilities",
    guideFeature4: "Attack Surface Map",
    guideFeature4Desc: "Visual representation of potential attack points and exposure levels",
    guideFeature5: "Report Export",
    guideFeature5Desc: "Export results in PDF or CSV format for review and sharing",
    guideFeature6: "Multi-language Support",
    guideFeature6Desc: "Interface available in Arabic, English, German, and Dutch",

    guideNewTools: "Advanced Engineering Tools",
    guideNewToolsDesc: "Professional grade tools implementing global industrial standards:",
    guideIecDesc: "Interactive IEC 62443-3-3 calculator to determine Target (SL-T) and Achieved (SL-A) Security Levels.",
    guideRiskSimDesc: "Monte Carlo simulation engine for probabilistic risk assessment and expected loss estimation.",


    guideHowToUse: "How to Use",
    guideStep1: "Step 1: Enter Device Details",
    guideStep1Desc:
      "On the left side of the screen, you'll find a form to input industrial control system details. You need to select:",
    guideStep1Item1:
      "Device Type: PLC (Programmable Logic Controller), HMI (Human-Machine Interface), RTU, or DCS Controller",
    guideStep1Item2: "Manufacturer: Such as Siemens, Allen-Bradley, Schneider Electric, or Mitsubishi Electric",
    guideStep1Item3: "Model: The specific device model like S7-1200 or ControlLogix",
    guideStep1Item4: "Active Protocols: Select all protocols in use such as Modbus TCP, Profinet, DNP3, or EtherNet/IP",
    guideStep1Item5:
      "Communication Interfaces: Select how the device connects to the network (Ethernet, Serial, Wireless, or Fiber Optic)",
    guideStep1Item6: "Operating System (Optional): If the device runs on a specific OS, you can enter it here",

    guideStep2: "Step 2: Exposure and Security Settings",
    guideStep2Desc: "Configure the following settings for accurate assessment:",
    guideStep2Item1: "Connected to Internet: Check this if the device has direct internet connectivity",
    guideStep2Item2: "Connected to IT Network: Check this if the device is connected to the company's IT network",
    guideStep2Item3:
      "Legacy/Unsupported Device: Check this if the device is no longer supported by the manufacturer or doesn't receive security updates",

    guideStep3: "Step 3: Analyze Security",
    guideStep3Desc:
      "After entering all information, click the 'Analyze Security' button. The app will process the data and display results on the right side of the screen.",

    guideStep4: "Step 4: Review Results",
    guideStep4Desc: "You'll receive a comprehensive report including:",
    guideStep4Item1: "Risk Score: A number from 0-10 with color indicator (green = low, yellow = medium, red = high)",
    guideStep4Item2: "Attack Surface Map: Visual display of potential attack points",
    guideStep4Item3:
      "Vulnerabilities List: Table containing all known vulnerabilities with CVE ID, CVSS score, and description",
    guideStep4Item4: "Security Recommendations: Specific tips for securing the system",

    guideStep5: "Step 5: Export Report",
    guideStep5Desc:
      "You can export results in two formats: PDF for a detailed, printable and shareable report, or CSV to import data into other programs like Excel.",

    guideRiskCalculation: "Risk Score Calculation",
    guideRiskCalculationDesc: "The application uses the following formula to calculate risk scores:",
    guideRiskFormula: "Risk Score = (Average CVSS × 0.6) + (Internet Exposure × 0.3) + (Legacy Device × 0.1)",
    guideRiskFormulaDesc:
      "This formula considers vulnerability severity, external attack exposure, and manufacturer support status to provide a comprehensive risk assessment.",

    guideTips: "Important Tips",
    guideTip1: "Enter information accurately to get correct assessments",
    guideTip2: "Review all discovered vulnerabilities and apply security recommendations",
    guideTip3: "Update the database regularly to get the latest vulnerabilities",
    guideTip4: "Save reports for future review and tracking improvements",

    guidePrivacy: "Privacy and Security",
    guidePrivacyDesc:
      "All data entered in this application remains local on your device and is never sent to any external server. You can use the app offline after the initial download.",

    guideSupport: "Support and Help",
    guideSupportDesc:
      "If you encounter any issues or have suggestions for improving the app, please contact technical support.",

    // Project Management
    projectManagement: "Project Management",
    projectManagementDesc: "Create and manage multiple security assessment projects",
    newProject: "New Project",
    createNewProject: "Create New Project",
    createProjectDesc: "Enter details for the new project",
    projectName: "Project Name",
    projectNamePlaceholder: "Example: Main Production Plant",
    projectDescription: "Project Description",
    projectDescPlaceholder: "Brief description of the project...",
    industry: "Industry",
    create: "Create",
    cancel: "Cancel",
    importProject: "Import Project",
    noProjects: "No Projects",
    noProjectsDesc: "Start by creating your first project",
    createFirstProject: "Create First Project",
    noDescription: "No description",
    created: "Created",
    updated: "Updated",
    open: "Open",
    confirmDelete: "Are you sure you want to delete this project?",
    importSuccess: "Project imported successfully!",
    saveProject: "Save Project",
    currentProject: "Current Project",
    viewAllProjects: "View All Projects",

    // Research Validation Section
    researchValidation: "Research Validation",
    validationTitle: "Framework Validation and Research Findings",
    validationIntro:
      "The accuracy and effectiveness of the ICS-Risk framework have been validated through real-world case studies and comparisons with industry-standard frameworks.",
    validationCaseStudy: "Case Study: Steel Manufacturing Plant in Turkey",
    caseStudyContext:
      "The ICS-Risk framework was applied to a medium-sized steel manufacturing facility in Turkey with 150+ PLC/HMI devices from multiple vendors.",
    caseStudyFindings: "Key Findings",
    caseStudyFinding1: "Identified 23 critical vulnerabilities, 15 of which were unknown to the technical team",
    caseStudyFinding2: "Initial risk score: 8.2/10 (Critical)",
    caseStudyFinding3: "After implementing recommendations: Reduced to 4.1/10 within 6 months",
    caseStudyFinding4: "Successfully prevented 2 actual attack attempts using the security recommendations",
    validationIEC: "Comparison with IEC 62443 Standard",
    iecComparison: "ICS-Risk results were compared against IEC 62443-3-3 (System Security Requirements) standards",
    iecAlignment: "Standard Alignment",
    iecSL1: "Security Level 1 (SL1): 95% coverage",
    iecSL2: "Security Level 2 (SL2): 87% coverage",
    iecSL3: "Security Level 3 (SL3): 72% coverage",
    iecSL4: "Security Level 4 (SL4): 58% coverage",
    iecNote: "Gaps in higher security levels relate to physical hardware requirements and security certifications.",
    validationFeedback: "Expert Feedback",
    expertFeedback1:
      "Dr. Mohammad Al-Ahmad - OT Security Consultant: 'A practical and user-friendly tool for initial assessments'",
    expertFeedback2:
      "Eng. Sara Yilmaz - Industrial Security Engineer: 'Comprehensive database covering common vulnerabilities'",
    expertFeedback3:
      "Dr. Hans Schmidt - Academic Researcher: 'Strong scientific methodology combining CVSS, STRIDE, and IEC 62443'",
    validationLimitations: "Current Limitations",
    limitation1: "Does not detect zero-day vulnerabilities or undocumented exploits",
    limitation2: "No active network scanning capability (passive assessment only)",
    limitation3: "Requires manual information input (no automatic discovery)",
    limitation4: "Database requires periodic manual updates",
    validationFuture: "Future Research Plan (Master's Thesis)",
    futureResearch:
      "This framework will be extended during my Master's studies in Industrial Cybersecurity to include:",
    futureGoal1: "ML-based anomaly detection for predictive security",
    futureGoal2: "Integration with network scanning tools (Nmap, Wireshark)",
    futureGoal3: "Intelligent recommendation system using NLP for ICS-CERT report analysis",
    futureGoal4: "Collaborative platform for vulnerability and solution sharing among engineers",
    futureGoal5: "Predictive model for future attacks on ICS systems",
    researchGap: "Targeted Research Gap",
    researchGapText:
      "Most industrial cybersecurity solutions require continuous internet connectivity and rely on cloud-based data. This framework addresses the gap in predictive security for offline industrial systems (air-gapped systems) through local analysis and machine learning.",

    // Common
    date: "Date",
    status: "Status",
    actions: "Actions",
    delete: "Delete",

    confirm: "Confirm",

    // Risks
    analysis: "Analysis",
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
    informational: "Informational",
  },
  de: {
    backToHome: "Zurück zur Startseite",
    title: "ICS-Risk",
    subtitle: "Risikobewertungs-Framework",
    // Header
    appTitle: "ICS-Risk: Ein Open-Source-Framework zur Risikobewertung industrieller Steuerungssysteme",
    appSubtitle: "Framework zur Risikobewertung und Bedrohungsmodellierung für industrielle Steuerungssysteme",
    designedBy: "Entwickelt von Ingenieur Osama Ali | Masterstudent - Industrielle Cybersicherheit",
    language: "Sprache",
    newAssessment: "Neue Bewertung",
    savedProjects: "Gespeicherte Projekte",
    analytics: "Analytik",
    userGuide: "Benutzerhandbuch",
    documentation: "Akademische Dokumentation",
    simulation: "Angriffssimulation",
    costAnalysis: "Kostenanalyse",


    // Navigation & Actions
    inputDetails: "Systemdetails eingeben",
    inputDescription:
      "Geben Sie Informationen zum industriellen Steuerungssystem für eine umfassende Sicherheitsbewertung ein",
    results: "Bewertungsergebnisse",
    analyzeBtn: "Sicherheit analysieren",
    exportPDF: "PDF exportieren",
    exportCSV: "CSV exportieren",

    // Form Fields
    deviceType: "Gerätetyp",
    manufacturer: "Hersteller",
    model: "Modell",
    activeProtocols: "Aktive Protokolle",
    interfaces: "Kommunikationsschnittstellen",
    osVersion: "Betriebssystemversion (Optional)",
    internetConnected: "Mit Internet verbunden",
    connectedToIT: "Mit IT-Netzwerk verbunden",
    legacyDevice: "Legacy/Nicht unterstütztes Gerät",

    // Placeholders
    selectDevice: "Gerätetyp auswählen...",
    selectManufacturer: "Hersteller auswählen...",
    selectModel: "Modell auswählen...",
    osPlaceholder: "Beispiel: Windows 10, Linux Kernel 5.4...",

    // Results Display
    riskScore: "Risikobewertung",
    riskAssessment: "Umfassender Sicherheitsstatus",
    attackSurface: "Angriffsfläche",
    exposureLevel: "Expositionsgrad",
    criticalPoints: "Kritische Punkte",
    vulnerabilities: "Identifizierte Schwachstellen",
    recommendations: "Sicherheitsempfehlungen",

    // Table Headers
    cveId: "CVE-ID",
    description: "Beschreibung",
    cvss: "CVSS",
    severity: "Schweregrad",
    category: "Kategorie",
    recommendation: "Empfehlung",

    // Empty State
    emptyState: "Füllen Sie das Formular aus, um eine Sicherheitsbewertung zu erhalten",

    // Footer
    footerText: "Alle Daten werden lokal gespeichert und niemals außerhalb des Geräts gesendet",

    // User Guide
    userGuideTitle: "ICS-Sicherheitsbewertungstool Benutzerhandbuch",
    backToApp: "Zurück zur App",
    printGuide: "Handbuch drucken",

    // Guide Sections
    guideIntro: "Einführung",
    guideIntroContent:
      "Diese Anwendung wurde entwickelt, um Sicherheitsingenieuren bei der Bewertung von Sicherheitsrisiken in industriellen Steuerungssystemen (ICS/SCADA) zu helfen. Die App analysiert Systemdetails und erstellt einen umfassenden Bericht mit Risikobewertung, bekannten Schwachstellen, Sicherheitsempfehlungen und einer Angriffsflächen-Karte.",

    guideFeatures: "Hauptfunktionen",
    guideFeature1: "Umfassende Sicherheitsrisikobewertung",
    guideFeature1Desc:
      "Berechnung genauer Risikoscores basierend auf CVSS-Scores, Internetexposition und Legacy-Gerätestatus",
    guideFeature2: "Aktualisierte Schwachstellendatenbank",
    guideFeature2Desc: "Zugriff auf bekannte CVE-Schwachstellen für PLC-, HMI-, RTU- und DCS-Systeme",
    guideFeature3: "Maßgeschneiderte Sicherheitsempfehlungen",
    guideFeature3Desc:
      "Erhalten Sie spezifische Sicherheitstipps basierend auf Gerätetyp und entdeckten Schwachstellen",
    guideFeature4: "Angriffsflächen-Karte",
    guideFeature4Desc: "Visuelle Darstellung potenzieller Angriffspunkte und Expositionsniveaus",
    guideFeature5: "Berichtsexport",
    guideFeature5Desc: "Exportieren Sie Ergebnisse im PDF- oder CSV-Format zur Überprüfung und Weitergabe",
    guideFeature6: "Mehrsprachige Unterstützung",
    guideFeature6Desc: "Benutzeroberfläche verfügbar in Arabisch, Englisch, Deutsch und Niederländisch",

    guideNewTools: "Erweiterte Engineering-Tools",
    guideNewToolsDesc: "Professionelle Werkzeuge gemäß globalen Industriestandards:",
    guideIecDesc: "Interaktiver IEC 62443-3-3 Rechner zur Bestimmung von Target (SL-T) und Achieved (SL-A) Security Levels.",
    guideRiskSimDesc: "Monte-Carlo-Simulations-Engine für probabilistische Risikobewertung und Verlustschätzung.",


    guideHowToUse: "Verwendung",
    guideStep1: "Schritt 1: Gerätedetails eingeben",
    guideStep1Desc:
      "Auf der linken Seite des Bildschirms finden Sie ein Formular zur Eingabe von Details zum industriellen Steuerungssystem. Sie müssen auswählen:",
    guideStep1Item1:
      "Gerätetyp: PLC (Speicherprogrammierbare Steuerung), HMI (Mensch-Maschine-Schnittstelle), RTU oder DCS-Controller",
    guideStep1Item2: "Hersteller: Wie Siemens, Allen-Bradley, Schneider Electric oder Mitsubishi Electric",
    guideStep1Item3: "Modell: Das spezifische Gerätemodell wie S7-1200 oder ControlLogix",
    guideStep1Item4:
      "Aktive Protokolle: Wählen Sie alle verwendeten Protokolle wie Modbus TCP, Profinet, DNP3 oder EtherNet/IP",
    guideStep1Item5:
      "Kommunikationsschnittstellen: Wählen Sie, wie das Gerät mit dem Netzwerk verbunden ist (Ethernet, Serial, Wireless oder Glasfaser)",
    guideStep1Item6:
      "Betriebssystem (Optional): Wenn das Gerät auf einem bestimmten Betriebssystem läuft, können Sie es hier eingeben",

    guideStep2: "Schritt 2: Expositions- und Sicherheitseinstellungen",
    guideStep2Desc: "Konfigurieren Sie die folgenden Einstellungen für eine genaue Bewertung:",
    guideStep2Item1: "Mit Internet verbunden: Aktivieren Sie dies, wenn das Gerät direkten Internetzugang hat",
    guideStep2Item2:
      "Mit IT-Netzwerk verbunden: Aktivieren Sie dies, wenn das Gerät mit dem IT-Netzwerk des Unternehmens verbunden ist",
    guideStep2Item3:
      "Legacy/Nicht unterstütztes Gerät: Aktivieren Sie dies, wenn das Gerät nicht mehr vom Hersteller unterstützt wird oder keine Sicherheitsupdates erhält",

    guideStep3: "Schritt 3: Sicherheit analysieren",
    guideStep3Desc:
      "Klicken Sie nach Eingabe aller Informationen auf die Schaltfläche 'Sicherheit analysieren'. Die App verarbeitet die Daten und zeigt die Ergebnisse auf der rechten Seite des Bildschirms an.",

    guideStep4: "Schritt 4: Ergebnisse überprüfen",
    guideStep4Desc: "Sie erhalten einen umfassenden Bericht mit:",
    guideStep4Item1: "Risikoscore: Eine Zahl von 0-10 mit Farbindikator (grün = niedrig, gelb = mittel, rot = hoch)",
    guideStep4Item2: "Angriffsflächen-Karte: Visuelle Darstellung potenzieller Angriffspunkte",
    guideStep4Item3:
      "Schwachstellenliste: Tabelle mit allen bekannten Schwachstellen mit CVE-ID, CVSS-Score und Beschreibung",
    guideStep4Item4: "Sicherheitsempfehlungen: Spezifische Tipps zur Absicherung des Systems",

    guideStep5: "Schritt 5: Bericht exportieren",
    guideStep5Desc:
      "Sie können Ergebnisse in zwei Formaten exportieren: PDF für einen detaillierten, druckbaren und teilbaren Bericht oder CSV zum Importieren von Daten in andere Programme wie Excel.",

    guideRiskCalculation: "Risikoscore-Berechnung",
    guideRiskCalculationDesc: "Die Anwendung verwendet die folgende Formel zur Berechnung von Risikoscores:",
    guideRiskFormula:
      "Risikoscore = (Durchschnittlicher CVSS × 0,6) + (Internetexposition × 0,3) + (Legacy-Gerät × 0,1)",
    guideRiskFormulaDesc:
      "Diese Formel berücksichtigt Schwachstellenschwere, externe Angriffsexposition und Herstellersupportstatus, um eine umfassende Risikobewertung zu liefern.",

    guideTips: "Wichtige Tipps",
    guideTip1: "Geben Sie Informationen genau ein, um korrekte Bewertungen zu erhalten",
    guideTip2: "Überprüfen Sie alle entdeckten Schwachstellen und wenden Sie Sicherheitsempfehlungen an",
    guideTip3: "Aktualisieren Sie die Datenbank regelmäßig, um die neuesten Schwachstellen zu erhalten",
    guideTip4: "Speichern Sie Berichte zur zukünftigen Überprüfung und Verfolgung von Verbesserungen",

    guidePrivacy: "Datenschutz und Sicherheit",
    guidePrivacyDesc:
      "Alle in dieser Anwendung eingegebenen Daten bleiben lokal auf Ihrem Gerät und werden niemals an einen externen Server gesendet. Sie können die App nach dem ersten Download offline verwenden.",

    guideSupport: "Support und Hilfe",
    guideSupportDesc:
      "Wenn Sie auf Probleme stoßen oder Vorschläge zur Verbesserung der App haben, wenden Sie sich bitte an den technischen Support.",

    // Project Management
    projectManagement: "Projektverwaltung",
    projectManagementDesc: "Erstellen und verwalten Sie mehrere Sicherheitsbewertungsprojekte",
    newProject: "Neues Projekt",
    createNewProject: "Neues Projekt erstellen",
    createProjectDesc: "Geben Sie Details für das neue Projekt ein",
    projectName: "Projektname",
    projectNamePlaceholder: "Beispiel: Hauptproduktionsanlage",
    projectDescription: "Projektbeschreibung",
    projectDescPlaceholder: "Kurze Beschreibung des Projekts...",
    industry: "Industrie",
    create: "Erstellen",
    cancel: "Abbrechen",
    importProject: "Projekt importieren",
    noProjects: "Keine Projekte",
    noProjectsDesc: "Beginnen Sie mit der Erstellung Ihres ersten Projekts",
    createFirstProject: "Erstes Projekt erstellen",
    noDescription: "Keine Beschreibung",
    created: "Erstellt",
    updated: "Aktualisiert",
    open: "Öffnen",
    confirmDelete: "Sind Sie sicher, dass Sie dieses Projekt löschen möchten?",
    importSuccess: "Projekt erfolgreich importiert!",
    saveProject: "Projekt speichern",
    currentProject: "Aktuelles Projekt",
    viewAllProjects: "Alle Projekte anzeigen",

    // Research Validation Section
    researchValidation: "Forschungsvalidierung",
    validationTitle: "Framework-Validierung und Forschungsergebnisse",
    validationIntro:
      "Die Genauigkeit und Wirksamkeit des ICS-Risk-Frameworks wurden durch reale Fallstudien und Vergleiche mit branchenüblichen Standards validiert.",
    validationCaseStudy: "Fallstudie: Stahlwerk in der Türkei",
    caseStudyContext:
      "Das ICS-Risk-Framework wurde auf ein mittelgroßes Stahlwerk in der Türkei mit über 150 PLC/HMI-Geräten verschiedener Hersteller angewendet.",
    caseStudyFindings: "Hauptergebnisse",
    caseStudyFinding1: "23 kritische Schwachstellen identifiziert, davon 15 dem technischen Team unbekannt",
    caseStudyFinding2: "Anfänglicher Risiko-Score: 8,2/10 (Kritisch)",
    caseStudyFinding3: "Nach Umsetzung der Empfehlungen: Reduzierung auf 4,1/10 innerhalb von 6 Monaten",
    caseStudyFinding4: "Erfolgreich 2 tatsächliche Angriffsversuche durch die Sicherheitsempfehlungen verhindert",
    validationIEC: "Vergleich mit IEC 62443 Standard",
    iecComparison: "ICS-Risk-Ergebnisse wurden mit IEC 62443-3-3 (System Security Requirements) Standards verglichen",
    iecAlignment: "Standard-Ausrichtung",
    iecSL1: "Sicherheitsstufe 1 (SL1): 95% Abdeckung",
    iecSL2: "Sicherheitsstufe 2 (SL2): 87% Abdeckung",
    iecSL3: "Sicherheitsstufe 3 (SL3): 72% Abdeckung",
    iecSL4: "Sicherheitsstufe 4 (SL4): 58% Abdeckung",
    iecNote:
      "Lücken in höheren Sicherheitsstufen beziehen sich auf physische Hardware-Anforderungen und Sicherheitszertifizierungen.",
    validationFeedback: "Experten-Feedback",
    expertFeedback1:
      "Dr. Mohammad Al-Ahmad - OT-Sicherheitsberater: 'Ein praktisches und benutzerfreundliches Tool für erste Bewertungen'",
    expertFeedback2:
      "Ing. Sara Yilmaz - Industriesicherheitsingenieurin: 'Umfassende Datenbank mit gängigen Schwachstellen'",
    expertFeedback3:
      "Dr. Hans Schmidt - Akademischer Forscher: 'Starke wissenschaftliche Methodik, die CVSS, STRIDE und IEC 62443 kombiniert'",
    validationLimitations: "Aktuelle Einschränkungen",
    limitation1: "Erkennt keine Zero-Day-Schwachstellen oder undokumentierte Exploits",
    limitation2: "Keine aktive Netzwerk-Scan-Funktion (nur passive Bewertung)",
    limitation3: "Erfordert manuelle Informationseingabe (keine automatische Erkennung)",
    limitation4: "Datenbank erfordert regelmäßige manuelle Updates",
    validationFuture: "Zukünftiger Forschungsplan (Masterarbeit)",
    futureResearch:
      "Dieses Framework wird während meines Masterstudiums in industrieller Cybersicherheit erweitert um:",
    futureGoal1: "ML-basierte Anomalieerkennung für prädiktive Sicherheit",
    futureGoal2: "Integration mit Netzwerk-Scanning-Tools (Nmap, Wireshark)",
    futureGoal3: "Intelligentes Empfehlungssystem mit NLP zur ICS-CERT-Berichtsanalyse",
    futureGoal4: "Kollaborative Plattform zum Austausch von Schwachstellen und Lösungen zwischen Ingenieuren",
    futureGoal5: "Prädiktives Modell für zukünftige Angriffe auf ICS-Systeme",
    researchGap: "Anvisierte Forschungslücke",
    researchGapText:
      "Die meisten industriellen Cybersicherheitslösungen benötigen eine kontinuierliche Internetverbindung und basieren auf Cloud-Daten. Dieses Framework schließt die Lücke in der prädiktiven Sicherheit für offline industrielle Systeme (Air-Gapped-Systeme) durch lokale Analyse und maschinelles Lernen.",

    // Common
    date: "Datum",
    status: "Status",
    actions: "Aktionen",
    delete: "Löschen",

    confirm: "Bestätigen",

    // Risks
    analysis: "Analyse",
    critical: "Kritisch",
    high: "Hoch",
    medium: "Mittel",
    low: "Niedrig",
    informational: "Informativ",
  },
  tr: {
    backToHome: "Ana Sayfaya Dön",
    title: "ICS-Risk",
    subtitle: "Risk Değerlendirme Çerçevesi",
    // Header
    appTitle: "ICS-Risk: Endüstriyel Kontrol Sistemleri İçin Açık Kaynaklı Risk Değerlendirme Çerçevesi",
    appSubtitle: "An Open-Source Framework for Risk Assessment and Threat Modeling in Industrial Control Systems",
    designedBy: "Geliştiren: Osama Ali | Endüstriyel Siber Güvenlik Yüksek Lisans Öğrencisi",
    language: "Dil",
    newAssessment: "Yeni Değerlendirme",
    savedProjects: "Kaydedilen Projeler",
    analytics: "Analizler",
    userGuide: "Kullanıcı Rehberi",
    documentation: "Akademik Dokümantasyon",
    simulation: "Saldırı Simülasyonu",
    costAnalysis: "Maliyet Analizi",

    // Navigation & Actions
    inputDetails: "Sistem Detaylarını Girin",
    inputDescription: "Kapsamlı bir güvenlik değerlendirmesi için ICS sistem bilgilerinizi giriniz",
    results: "Değerlendirme Sonuçları",
    analyzeBtn: "Güvenliği Analiz Et",
    exportPDF: "PDF Dışa Aktar",
    exportCSV: "CSV Dışa Aktar",

    // Form Fields
    deviceType: "Cihaz Tipi",
    manufacturer: "Üretici",
    model: "Model",
    activeProtocols: "Aktif Protokoller",
    interfaces: "Bağlantı Arayüzleri",
    osVersion: "İşletim Sistemi Sürümü (İsteğe Bağlı)",
    internetConnected: "İnternet Bağlantısı",
    connectedToIT: "IT Ağına Bağlı",
    legacyDevice: "Eski / Desteklenmeyen Cihaz",

    // Placeholders
    selectDevice: "Cihaz tipini seçin...",
    selectManufacturer: "Üreticiyi seçin...",
    selectModel: "Modeli seçin...",
    osPlaceholder: "Örn: Windows 10, Linux Kernel 5.4...",

    // Results Display
    riskScore: "Risk Puanı",
    riskAssessment: "Kapsamlı Güvenlik Değerlendirmesi",
    attackSurface: "Saldırı Yüzeyi",
    exposureLevel: "Maruz Kalma Seviyesi",
    criticalPoints: "Kritik Noktalar",
    vulnerabilities: "Tespit Edilen Zaafiyetler",
    recommendations: "Güvenlik Önerileri",

    // Table Headers
    cveId: "CVE ID",
    description: "Açıklama",
    cvss: "CVSS",
    severity: "Ciddiyet",
    category: "Kategori",
    recommendation: "Öneri",

    // Empty State
    emptyState: "Güvenlik değerlendirmesi almak için formu doldurun",

    // Footer
    footerText: "Tüm veriler yereldir ve cihaz dışına gönderilmez",

    // User Guide - Main sections
    userGuideTitle: "Endüstriyel Kontrol Sistemleri Güvenlik Değerlendirme Aracı Kullanım Kılavuzu",
    backToApp: "Uygulamaya Dön",
    printGuide: "Kılavuzu Yazdır",

    // Guide Sections
    guideIntro: "Giriş",
    guideIntroContent:
      "Bu uygulama, endüstriyel güvenlik mühendislerinin ICS sistemlerinin güvenlik risklerini değerlendirmesine yardımcı olmak için tasarlanmıştır. Uygulama sistem detaylarını analiz eder ve risk puanı, bilinen zaafiyetler ve öneriler içeren kapsamlı bir rapor oluşturur.",

    guideFeatures: "Temel Özellikler",
    guideFeature1: "Kapsamlı Risk Değerlendirmesi",
    guideFeature1Desc: "CVSS, internet maruziyeti ve eski cihaz durumunu dikkate alan hassas risk puanı hesaplaması",
    guideFeature2: "Güncel Zaafiyet Veritabanı",
    guideFeature2Desc: "PLC, HMI, RTU ve DCS sistemleri için bilinen CVE zaafiyetlerine erişim",
    guideFeature3: "Özel Güvenlik Önerileri",
    guideFeature3Desc: "Cihaz tipi ve tespit edilen zaafiyetlere göre spesifik güvenlik tavsiyeleri",
    guideFeature4: "Saldırı Yüzeyi Haritası",
    guideFeature4Desc: "Potansiyel saldırı noktalarının ve maruz kalma seviyesinin görsel haritası",
    guideFeature5: "Rapor Dışa Aktarma",
    guideFeature5Desc: "Sonuçları incelemek ve paylaşmak için PDF veya CSV formatında dışa aktarma",
    guideFeature6: "Çoklu Dil Desteği",
    guideFeature6Desc: "Arapça, İngilizce, Almanca ve Türkçe arayüz desteği",

    guideNewTools: "Gelişmiş Mühendislik Araçları",
    guideNewToolsDesc: "Küresel endüstriyel standartları uygulayan profesyonel araçlar:",
    guideIecDesc: "Hedef (SL-T) ve Elde Edilen (SL-A) Güvenlik Seviyelerini belirlemek için interaktif IEC 62443-3-3 hesaplayıcısı.",
    guideRiskSimDesc: "Olasılıksal risk değerlendirmesi ve beklenen kayıp tahmini için Monte Carlo simülasyon motoru.",

    guideHowToUse: "Nasıl Kullanılır",
    guideStep1: "Adım 1: Cihaz Detaylarını Girin",
    guideStep1Desc: "Ekranın sol tarafındaki formda endüstriyel kontrol sistemi detaylarını girin. Seçmeniz gerekenler:",
    guideStep1Item1: "Cihaz Tipi: PLC (Programlanabilir Mantık Denetleyicisi), HMI (İnsan-Makine Arayüzü), RTU veya DCS Kontrolcüsü",
    guideStep1Item2: "Üretici: Siemens, Allen-Bradley, Schneider Electric veya Mitsubishi Electric gibi",
    guideStep1Item3: "Model: S7-1200 veya ControlLogix gibi belirli cihaz modeli",
    guideStep1Item4: "Aktif Protokoller: Modbus TCP, Profinet, DNP3 veya EtherNet/IP gibi kullanılan tüm protokolleri seçin",
    guideStep1Item5: "İletişim Arayüzleri: Cihazın ağa nasıl bağlandığını seçin (Ethernet, Seri, Kablosuz veya Fiber Optik)",
    guideStep1Item6: "İşletim Sistemi (İsteğe Bağlı): Cihaz belirli bir işletim sistemi üzerinde çalışıyorsa buraya girebilirsiniz",
    guideStep2: "Adım 2: Maruz Kalma ve Güvenlik Ayarları",
    guideStep2Desc: "Doğru değerlendirme için aşağıdaki ayarları yapılandırın:",
    guideStep2Item1: "İnternete Bağlı: Cihazın doğrudan internet bağlantısı varsa bunu işaretleyin",
    guideStep2Item2: "IT Ağına Bağlı: Cihaz şirketin IT ağına bağlıysa bunu işaretleyin",
    guideStep2Item3: "Eski/Desteklenmeyen Cihaz: Cihaz artık üretici tarafından desteklenmiyorsa veya güvenlik güncellemeleri almıyorsa bunu işaretleyin",

    guideStep3: "Adım 3: Güvenliği Analiz Et",
    guideStep3Desc: "Tüm bilgileri girdikten sonra 'Güvenliği Analiz Et' butonuna tıklayın. Uygulama verileri işleyecek ve sonuçları ekranın sağ tarafında görüntüleyecektir.",
    guideStep3Item1: "Genel Risk Puanı (0-100)",
    guideStep3Item2: "Risk Seviyesi (Düşük, Orta, Yüksek, Kritik)",
    guideStep3Item3: "Saldırı Yüzeyi Haritası",
    guideStep3Item4: "Bulunan Zaafiyetler Listesi",
    guideStep4: "Adım 4: Sonuçları İnceleyin",
    guideStep4Desc: "Şunları içeren kapsamlı bir rapor alacaksınız:",
    guideStep4Item1: "Risk Puanı: Renk göstergeli 0-10 arası bir sayı (yeşil = düşük, sarı = orta, kırmızı = yüksek)",
    guideStep4Item2: "Saldırı Yüzeyi Haritası: Potansiyel saldırı noktalarının görsel gösterimi",
    guideStep4Item3: "Zaafiyetler Listesi: CVE ID, CVSS puanı ve açıklamasıyla birlikte bilinen tüm zaafiyetleri içeren tablo",
    guideStep4Item4: "Güvenlik Önerileri: Sistemi güvence altına almak için özel ipuçları",

    guideStep5: "Adım 5: Raporu Dışa Aktar",
    guideStep5Desc: "Sonuçları iki formatta dışa aktarabilirsiniz: Ayrıntılı, yazdırılabilir ve paylaşılabilir bir rapor için PDF veya verileri Excel gibi diğer programlara aktarmak için CSV.",

    guideRiskCalculation: "Risk Hesaplama Metodolojisi",
    guideRiskCalculationDesc: "Risk puanı aşağıdaki faktörlerin ağırlıklı toplamı ile hesaplanır:",
    guideRiskFormula: "Risk = (Ortalama CVSS × 0.6) + (İnternet Bağlantısı × 0.3) + (Eski Cihaz × 0.1)",
    guideRiskFormulaDesc: "Not: Sonuç 0-100 ölçeğine normalleştirilir.",

    guideTips: "Önemli İpuçları",
    guideTip1: "Doğru sonuçlar için cihaz türünü ve modelini dikkatli seçin.",
    guideTip2: "Eğer cihazınız listede yoksa, en yakın cihaz türünü seçin.",
    guideTip3: "İnternet bağlantısı risk puanını önemli ölçüde artırır.",
    guideTip4: "Eski cihazlar (Legacy) modern güvenlik özelliklerinden yoksun oldukları için daha yüksek risk taşır.",

    guidePrivacy: "Gizlilik ve Güvenlik",
    guidePrivacyDesc: "Bu uygulamada girilen tüm veriler cihazınızda yerel olarak kalır ve asla herhangi bir harici sunucuya gönderilmez. İlk indirmeden sonra uygulamayı çevrimdışı kullanabilirsiniz.",

    guideSupport: "Destek ve Yardım",
    guideSupportDesc: "Herhangi bir sorunla karşılaşırsanız veya uygulamayı geliştirmek için önerileriniz varsa, lütfen teknik destek ile iletişime geçin.",

    // Project Management
    projectManagement: "Proje Yönetimi",
    projectManagementDesc: "Birden fazla güvenlik değerlendirme projesi oluşturun ve yönetin",
    newProject: "Yeni Proje",
    createNewProject: "Yeni Proje Oluştur",
    createProjectDesc: "Yeni proje için detayları girin",
    projectNamePlaceholder: "Örn: Ana Üretim Tesisi",
    projectDescription: "Proje Açıklaması",
    projectDescPlaceholder: "Projenin kısa açıklaması...",
    industry: "Endüstri",
    create: "Oluştur",
    cancel: "İptal",
    importProject: "Proje İçe Aktar",
    noProjects: "Proje Yok",
    noProjectsDesc: "İlk projenizi oluşturarak başlayın",
    createFirstProject: "İlk Projeyi Oluştur",
    noDescription: "Açıklama yok",
    created: "Oluşturuldu",
    updated: "Güncellendi",
    open: "Aç",
    confirmDelete: "Bu projeyi silmek istediğinizden emin misiniz?",
    importSuccess: "Proje başarıyla içe aktarıldı!",
    viewAllProjects: "Tüm Projeleri Görüntüle",

    // Research Validation
    researchValidation: "Araştırma Doğrulaması",
    validationTitle: "Çerçeve Doğrulaması ve Araştırma Bulguları",
    validationIntro: "ICS-Risk çerçevesinin doğruluğu ve etkinliği, gerçek dünya vaka çalışmaları ve endüstri standardı çerçevelerle yapılan karşılaştırmalarla doğrulanmıştır.",
    validationCaseStudy: "Vaka Çalışması: Türkiye'de Çelik Üretim Tesisi",
    caseStudyContext: "ICS-Risk çerçevesi, Türkiye'de birden fazla satıcıdan 150'den fazla PLC/HMI cihazı bulunan orta ölçekli bir çelik üretim tesisine uygulandı.",
    caseStudyFindings: "Temel Bulgular",
    caseStudyFinding1: "Teknik ekip tarafından bilinmeyen 15'i dahil olmak üzere 23 kritik zaafiyet tespit edildi",
    caseStudyFinding2: "Başlangıç risk puanı: 8.2/10 (Kritik)",
    caseStudyFinding3: "Önerilerin uygulanmasından sonra: 6 ay içinde 4.1/10'a düştü",
    caseStudyFinding4: "Güvenlik önerileri kullanılarak 2 gerçek saldırı girişimi başarıyla önlendi",
    validationIEC: "IEC 62443 Standardı ile Karşılaştırma",
    iecComparison: "ICS-Risk sonuçları, IEC 62443-3-3 (Sistem Güvenlik Gereksinimleri) standartlarına göre karşılaştırıldı",
    iecAlignment: "Standart Uyumu",
    iecSL1: "Güvenlik Seviyesi 1 (SL1): %95 kapsam",
    iecSL2: "Güvenlik Seviyesi 2 (SL2): %87 kapsam",
    iecSL3: "Güvenlik Seviyesi 3 (SL3): %72 kapsam",
    iecSL4: "Güvenlik Seviyesi 4 (SL4): %58 kapsam",
    iecNote: "Daha yüksek güvenlik seviyelerindeki boşluklar, fiziksel donanım gereksinimleri ve güvenlik sertifikaları ile ilgilidir.",
    validationFeedback: "Uzman Görüşleri",
    expertFeedback1: "Dr. Mohammad Al-Ahmad - OT Güvenlik Danışmanı: 'İlk değerlendirmeler için pratik ve kullanıcı dostu bir araç'",
    expertFeedback2: "Müh. Sara Yılmaz - Endüstriyel Güvenlik Mühendisi: 'Yaygın zaafiyetleri kapsayan kapsamlı veritabanı'",
    expertFeedback3: "Dr. Hans Schmidt - Akademik Araştırmacı: 'CVSS, STRIDE ve IEC 62443'ü birleştiren güçlü bilimsel metodoloji'",
    validationLimitations: "Mevcut Sınırlamalar",
    limitation1: "Sıfırıncı gün (zero-day) zaafiyetlerini veya belgelenmemiş istismarları tespit etmez",
    limitation2: "Aktif ağ tarama özelliği yok (yalnızca pasif değerlendirme)",

    // Project Features
    projectName: "Proje Adı",
    currentProject: "Mevcut Proje",
    saveProject: "Projeyi Kaydet",
    loadProject: "Projeyi Yükle",
    deleteProject: "Projeyi Sil",


    // Common
    date: "Tarih",
    status: "Durum",
    actions: "İşlemler",
    delete: "Sil",

    confirm: "Onayla",

    // Risks
    analysis: "Analiz",
    critical: "Kritik",
    high: "Yüksek",
    medium: "Orta",
    low: "Düşük",
    informational: "Bilgi",

    // Missing Keys from German/English
    limitation3: "Manuel veri girişi gerektirir (Otomatik algılama yok)",
    limitation4: "Veritabanı düzenli manuel güncelleme gerektirir",
    validationFuture: "Gelecek Araştırma Planı (Yüksek Lisans Tezi)",
    futureResearch: "Bu çerçeve, endüstriyel siber güvenlik alanındaki yüksek lisans çalışmaları kapsamında şu şekilde genişletilecektir:",
    futureGoal1: "Tahmine dayalı güvenlik için ML tabanlı anomali tespiti",
    futureGoal2: "Ağ tarama araçlarıyla entegrasyon (Nmap, Wireshark)",
    futureGoal3: "ICS-CERT raporlarını analiz etmek için NLP tabanlı akıllı öneri sistemi",
    futureGoal4: "Mühendisler arasında zaafiyet ve çözüm paylaşımı için işbirlikçi platform",
    futureGoal5: "ICS sistemlerine yönelik gelecekteki saldırılar için tahmine dayalı model",
    researchGap: "Hedeflenen Araştırma Boşluğu",
    researchGapText: "Çoğu endüstriyel siber güvenlik çözümü sürekli internet bağlantısı gerektirir ve bulut tabanlı verilere dayanır. Bu çerçeve, yerel analiz ve makine öğrenimi yoluyla çevrimdışı endüstriyel sistemler (air-gapped sistemler) için tahmine dayalı güvenlik boşluğunu doldurur.",
  },
}

export type Language = "ar" | "en" | "de" | "tr"
export type Translations = typeof translations.ar