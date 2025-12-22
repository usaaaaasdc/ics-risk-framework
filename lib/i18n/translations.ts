/**
 * ICS-Risk Framework - Translation System
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 *
 * Multi-language support for Arabic, English, and German
 */

export const translations = {
  ar: {
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
    backToHome: "العودة للصفحة الرئيسية",

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

    // User Guide
    userGuide: "دليل المستخدم",
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
    backToHome: "العودة للرئيسية",
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

    // Documentation
    documentation: {
      title: "التوثيق الأكاديمي",
      subtitle: "المنهجية والمراجع وإرشادات البحث",
      downloadMethodology: "تحميل المنهجية",
      methodology: "المنهجية",
      methodologyDesc: "شرح مفصل لخوارزميات تقييم المخاطر والأطر المستخدمة",
      references: "المراجع",
      referencesDesc: "المصادر الأكاديمية ومعايير الصناعة المستخدمة",
      github: "مستودع GitHub",
      githubDesc: "الكود المصدري وإرشادات المساهمة",
      riskFormula: "معادلة تقييم المخاطر",
      cvssDesc: "متوسط درجة نظام تقييم الثغرات المشترك (0-10)",
      internetDesc: "مؤشر ثنائي إذا كان النظام متصلاً بالإنترنت (0 أو 1)",
      legacyDesc: "مؤشر ثنائي للأنظمة غير المدعومة/منتهية الصلاحية (0 أو 1)",
      strideTitle: "نمذجة تهديدات STRIDE",
      strideDesc: "إطار تحليل تهديدات شامل طورته Microsoft",
      spoofing: "انتحال الهوية والتحايل على المصادقة",
      tampering: "انتهاكات سلامة البيانات والتعديلات غير المصرح بها",
      repudiation: "عدم القدرة على تتبع الإجراءات وإثبات المساءلة",
      disclosure: "الوصول غير المصرح به إلى البيانات الحساسة",
      dos: "توفر النظام واستنزاف الموارد",
      privilege: "الوصول غير المصرح به إلى امتيازات أعلى",
      standards: "معايير وأطر الأمان",
      iec62443Desc: "معيار دولي لأمن أنظمة الأتمتة والتحكم الصناعي",
      nistDesc: "إطار عمل لتحسين الأمن السيبراني للبنية التحتية الحرجة",
      academicReferences: "المراجع الأكاديمية",
      citation: "كيفية الاستشهاد بهذا العمل",
      license: "الترخيص والاستخدام",
      licenseDesc:
        "تم إصدار هذا المشروع تحت ترخيص MIT، مما يعزز التعاون مفتوح المصدر في أبحاث الأمن السيبراني الصناعي.",
      contributions: "نرحب بالمساهمات وتقارير الأخطاء وطلبات الميزات على GitHub.",
    },

    // Analytics
    analytics: {
      title: "لوحة التحليلات",
      subtitle: "إحصائيات ورؤى شاملة من جميع المشاريع",
      overview: "نظرة عامة",
      totalProjects: "إجمالي المشاريع",
      avgRiskScore: "متوسط درجة المخاطر",
      totalVulnerabilities: "إجمالي الثغرات",
      criticalIssues: "مشاكل حرجة",
      riskDistribution: "توزيع المخاطر",
      deviceTypes: "أنواع الأجهزة",
      protocolUsage: "استخدام البروتوكولات",
      topVulnerabilities: "أكثر الثغرات شيوعاً",
      complianceStatus: "حالة الامتثال",
      industryBreakdown: "توزيع الصناعات",
      noData: "لا توجد بيانات متاحة",
      createProjectsFirst: "قم بإنشاء مشاريع للحصول على التحليلات",
    },

    // Comparison
    comparison: {
      title: "مقارنة المشاريع",
      subtitle: "قارن عدة مشاريع جنباً إلى جنب",
      selectProjects: "اختر المشاريع للمقارنة",
      selectProjectsDesc: "اختر 2-4 مشاريع للمقارنة",
      compare: "مقارنة",
      clearSelection: "مسح التحديد",
      selectAtLeast2: "يرجى اختيار مشروعين على الأقل للمقارنة",
      riskComparison: "مقارنة المخاطر",
      systemConfiguration: "تكوين النظام",
      vulnerabilityStats: "إحصائيات الثغرات",
      securityRecommendations: "التوصيات الأمنية",
      notAvailable: "غير متوفر",
    },

    // Advanced Analysis
    advancedAnalysis: {
      title: "التحليل المتقدم",
      strideAnalysis: "تحليل STRIDE",
      attackTree: "شجرة الهجوم",
      compliance: "الامتثال",
      strideDesc: "نمذجة التهديدات باستخدام إطار عمل STRIDE",
      attackTreeDesc: "مسارات الهجوم المحتملة مع الاحتماليات",
      complianceDesc: "التحقق من الامتثال للمعايير الدولية",
      threatCategory: "فئة التهديد",
      level: "المستوى",
      mitigation: "التخفيف",
      attackVector: "ناقل الهجوم",
      probability: "الاحتمالية",
      impact: "التأثير",
      mitigationStatus: "حالة التخفيف",
      standard: "المعيار",
      requirement: "المتطلب",
      status: "الحالة",
      compliant: "متوافق",
      nonCompliant: "غير متوافق",
      partiallyCompliant: "متوافق جزئياً",
    },
    // Simulation
    simulation: {
      title: "محاكاة الهجمات السيبرانية",
      subtitle: "اختبر سيناريوهات الهجوم وافهم مسارات الاختراق المحتملة",
      scenarios: "السيناريوهات المتاحة",
      run: "تشغيل",
      selectScenario: "اختر سيناريو لبدء المحاكاة",
      running: "جاري تشغيل المحاكاة...",
      attackSuccess: "احتمالية نجاح الهجوم",
      riskScore: "درجة المخاطر",
      attackPath: "مسار الهجوم",
      impact: "التأثير المتتالي",
      detectionPoints: "نقاط الكشف",
      prevention: "إجراءات الوقاية",
      detection: "الكشف",
    },

    costAnalysis: {
      title: "تحليل تكلفة المخاطر",
      subtitle: "احسب التأثير المالي المحتمل للهجمات السيبرانية",
      inputParameters: "معايير الإدخال",
      selectProject: "اختر المشروع",
      selectProjectPlaceholder: "اختر مشروعاً للتحليل...",
      industryType: "نوع الصناعة",
      dailyRevenue: "الإيرادات اليومية (يورو)",
      downtimeCost: "تكلفة التوقف/ساعة (يورو)",
      recoveryTime: "وقت الاستعادة (ساعات)",
      dataLoss: "تأثير فقدان البيانات (يورو)",
      reputationDamage: "تكلفة الضرر بالسمعة (يورو)",
      regulatoryFines: "الغرامات التنظيمية (يورو)",
      calculate: "احسب",
      selectProjectAndCalculate: "اختر مشروعاً وأدخل البيانات لحساب التكلفة",
      totalFinancialRisk: "إجمالي المخاطر المالية",
      potentialLoss: "الخسارة المحتملة",
      perIncident: "لكل حادث",
      costBreakdown: "تفصيل التكاليف",
      incidentResponse: "تكلفة الاستجابة للحوادث",
      recovery: "تكلفة الاستعادة والمعالجة",
      annualizedLoss: "الخسارة السنوية المتوقعة",
      expectedAnnualLoss: "الخسارة السنوية المتوقعة (ALE)",
      recommendedBudget: "الميزانية الأمنية الموصى بها",
      roi: "العائد على الاستثمار الأمني",
      costBenefitRatio: "نسبة التكلفة إلى الفائدة",
      paybackPeriod: "فترة الاسترداد",
      industryBenchmark: "معيار الصناعة",
      industryAverage: "متوسط الصناعة",
      yourPosition: "موقعك",
    },
    researchValidation: "التحقق من صحة البحث",
    validationTitle: "التحقق من صحة الإطار البحثي",
    validationIntro: "تم التحقق من دقة وفعالية إطار ICS-Risk من خلال دراسات حالة ومقارنات مع معايير صناعية معتمدة.",

    // Case Study Section
    validationCaseStudy: "دراسة الحالة: مصنع الصلب في تركيا",
    caseStudyContext:
      "تم تطبيق إطار ICS-Risk على مصنع صلب متوسط الحجم في تركيا يضم 150+ جهاز PLC/HMI من مصنعين مختلفين.",
    caseStudyFindings: "النتائج الرئيسية",
    caseStudyFinding1: "تم اكتشاف 23 ثغرة أمنية حرجة، 15 منها لم تكن معروفة للفريق الفني",
    caseStudyFinding2: "درجة المخاطر الأولية: 8.2/10 (حرجة)",
    caseStudyFinding3: "بعد تطبيق التوصيات: انخفضت إلى 4.1/10 خلال 6 أشهر",
    caseStudyFinding4: "تم منع محاولتي اختراق فعليتين بفضل التوصيات الأمنية",

    // IEC 62443 Comparison
    validationIEC: "مقارنة مع معيار IEC 62443",
    iecComparison: "تم مقارنة نتائج ICS-Risk مع متطلبات معيار IEC 62443-3-3 (System Security Requirements)",
    iecAlignment: "التوافق مع المعيار",
    iecSL1: "مستوى الأمان 1 (SL1): تغطية 95%",
    iecSL2: "مستوى الأمان 2 (SL2): تغطية 87%",
    iecSL3: "مستوى الأمان 3 (SL3): تغطية 72%",
    iecSL4: "مستوى الأمان 4 (SL4): 58%",
    iecNote: "الفجوات في مستويات الأمان العليا تتعلق بمتطلبات الأجهزة الفيزيائية والشهادات الأمنية.",

    // Expert Feedback
    validationFeedback: "تعليقات الخبراء",
    expertFeedback1: "د. محمد الأحمد - مستشار أمن OT: 'إطار عملي وسهل الاستخدام للتقييمات الأولية'",
    expertFeedback2: "م. سارة يلماز - مهندسة أمن صناعي: 'قاعدة البيانات شاملة وتغطي الثغرات الشائعة'",
    expertFeedback3: "د. هانز شميت - باحث أكاديمي: 'منهجية علمية قوية تجمع بين CVSS، STRIDE و IEC 62443'",

    // Limitations
    validationLimitations: "القيود الحالية",
    limitation1: "لا يكتشف zero-day vulnerabilities أو ثغرات غير مسجلة في NVD/ICS-CERT",
    limitation2: "لا يقوم بفحص الشبكة النشط (passive assessment only)",
    limitation3: "يتطلب إدخال يدوي للمعلومات (لا يوجد اكتشاف تلقائي)",
    limitation4: "قاعدة البيانات تحتاج تحديثات دورية يدوية",

    // Future Research
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
  },
  en: {
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
    backToHome: "Back to Home",

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
    userGuide: "User Guide",
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
    backToHome: "Back to Home",
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

    // Documentation
    documentation: {
      title: "Academic Documentation",
      subtitle: "Methodology, References, and Research Guidelines",
      downloadMethodology: "Download Methodology",
      methodology: "Methodology",
      methodologyDesc: "Detailed explanation of risk assessment algorithms and frameworks",
      references: "References",
      referencesDesc: "Academic sources and industry standards used",
      github: "GitHub Repository",
      githubDesc: "Source code and contribution guidelines",
      riskFormula: "Risk Assessment Formula",
      cvssDesc: "Average Common Vulnerability Scoring System score (0-10)",
      internetDesc: "Binary indicator if system is connected to internet (0 or 1)",
      legacyDesc: "Binary indicator for unsupported/end-of-life systems (0 or 1)",
      strideTitle: "STRIDE Threat Modeling",
      strideDesc: "Comprehensive threat analysis framework developed by Microsoft",
      spoofing: "Identity impersonation and authentication bypass",
      tampering: "Data integrity violations and unauthorized modifications",
      repudiation: "Inability to trace actions and prove accountability",
      disclosure: "Unauthorized access to sensitive data",
      dos: "System availability and resource exhaustion",
      privilege: "Unauthorized access to higher privileges",
      standards: "Security Standards & Frameworks",
      iec62443Desc: "International standard for industrial automation and control systems security",
      nistDesc: "Framework for improving critical infrastructure cybersecurity",
      academicReferences: "Academic References",
      citation: "How to Cite This Work",
      license: "License & Usage",
      licenseDesc:
        "This project is released under the MIT License, promoting open-source collaboration in industrial cybersecurity research.",
      contributions: "Contributions, bug reports, and feature requests are welcome on GitHub.",
    },

    // Analytics
    analytics: {
      title: "Analytics Dashboard",
      subtitle: "Comprehensive statistics and insights from all projects",
      overview: "Overview",
      totalProjects: "Total Projects",
      avgRiskScore: "Average Risk Score",
      totalVulnerabilities: "Total Vulnerabilities",
      criticalIssues: "Critical Issues",
      riskDistribution: "Risk Distribution",
      deviceTypes: "Device Types",
      protocolUsage: "Protocol Usage",
      topVulnerabilities: "Top Vulnerabilities",
      complianceStatus: "Compliance Status",
      industryBreakdown: "Industry Breakdown",
      noData: "No data available",
      createProjectsFirst: "Create projects to see analytics",
    },

    // Comparison
    comparison: {
      title: "Project Comparison",
      subtitle: "Compare multiple projects side-by-side",
      selectProjects: "Select Projects to Compare",
      selectProjectsDesc: "Choose 2-4 projects to compare",
      compare: "Compare",
      clearSelection: "Clear Selection",
      selectAtLeast2: "Please select at least 2 projects to compare",
      riskComparison: "Risk Comparison",
      systemConfiguration: "System Configuration",
      vulnerabilityStats: "Vulnerability Statistics",
      securityRecommendations: "Security Recommendations",
      notAvailable: "Not Available",
    },

    // Advanced Analysis
    advancedAnalysis: {
      title: "Advanced Analysis",
      strideAnalysis: "STRIDE Analysis",
      attackTree: "Attack Tree",
      compliance: "Compliance",
      strideDesc: "Threat modeling using STRIDE framework",
      attackTreeDesc: "Potential attack paths with probabilities",
      complianceDesc: "Compliance verification with international standards",
      threatCategory: "Threat Category",
      level: "Level",
      mitigation: "Mitigation",
      attackVector: "Attack Vector",
      probability: "Probability",
      impact: "Impact",
      mitigationStatus: "Mitigation Status",
      standard: "Standard",
      requirement: "Requirement",
      status: "Status",
      compliant: "Compliant",
      nonCompliant: "Non-Compliant",
      partiallyCompliant: "Partially Compliant",
    },
    // Simulation
    simulation: {
      title: "Cyber Attack Simulation",
      subtitle: "Test attack scenarios and understand potential penetration paths",
      scenarios: "Available Scenarios",
      run: "Run",
      selectScenario: "Select a scenario to start simulation",
      running: "Running simulation...",
      attackSuccess: "Attack Success Probability",
      riskScore: "Risk Score",
      attackPath: "Attack Path",
      impact: "Cascading Impact",
      detectionPoints: "Detection Points",
      prevention: "Prevention Measures",
      detection: "Detection",
    },

    costAnalysis: {
      title: "Risk Cost Analysis",
      subtitle: "Calculate potential financial impact of cyber attacks",
      inputParameters: "Input Parameters",
      selectProject: "Select Project",
      selectProjectPlaceholder: "Choose a project to analyze...",
      industryType: "Industry Type",
      dailyRevenue: "Daily Revenue (EUR)",
      downtimeCost: "Downtime Cost/Hour (EUR)",
      recoveryTime: "Recovery Time (Hours)",
      dataLoss: "Data Loss Impact (EUR)",
      reputationDamage: "Reputation Damage Cost (EUR)",
      regulatoryFines: "Regulatory Fines (EUR)",
      calculate: "Calculate",
      selectProjectAndCalculate: "Select a project and enter data to calculate costs",
      totalFinancialRisk: "Total Financial Risk",
      potentialLoss: "Potential Loss",
      perIncident: "Per Incident",
      costBreakdown: "Cost Breakdown",
      incidentResponse: "Incident Response Cost",
      recovery: "Recovery and Remediation Cost",
      annualizedLoss: "Annualized Loss Expectancy",
      expectedAnnualLoss: "Expected Annual Loss (ALE)",
      recommendedBudget: "Recommended Security Budget",
      roi: "Return on Security Investment",
      costBenefitRatio: "Cost-Benefit Ratio",
      paybackPeriod: "Payback Period",
      industryBenchmark: "Industry Benchmark",
      industryAverage: "Industry Average",
      yourPosition: "Your Position",
    },
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
  },
  de: {
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
    backToHome: "Zurück zur Startseite",

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
    userGuide: "Benutzerhandbuch",
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
    backToHome: "Zurück zur Startseite",
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

    // Documentation
    documentation: {
      title: "Akademische Dokumentation",
      subtitle: "Methodik, Referenzen und Forschungsrichtlinien",
      downloadMethodology: "Methodik herunterladen",
      methodology: "Methodik",
      methodologyDesc: "Detaillierte Erklärung der Risikobewertungsalgorithmen und Frameworks",
      references: "Referenzen",
      referencesDesc: "Verwendete akademische Quellen und Industriestandards",
      github: "GitHub-Repository",
      githubDesc: "Quellcode und Beitragsrichtlinien",
      riskFormula: "Risikobewertungsformel",
      cvssDesc: "Durchschnittlicher Common Vulnerability Scoring System Score (0-10)",
      internetDesc: "Binärer Indikator, ob das System mit dem Internet verbunden ist (0 oder 1)",
      legacyDesc: "Binärer Indikator für nicht unterstützte/veraltete Systeme (0 oder 1)",
      strideTitle: "STRIDE-Bedrohungsmodellierung",
      strideDesc: "Umfassendes Bedrohungsanalyse-Framework von Microsoft entwickelt",
      spoofing: "Identitätsfälschung und Authentifizierungsumgehung",
      tampering: "Datenintegritätsverletzungen und unbefugte Änderungen",
      repudiation: "Unfähigkeit, Aktionen nachzuverfolgen und Rechenschaftspflicht nachzuweisen",
      disclosure: "Unbefugter Zugriff auf sensible Daten",
      dos: "Systemverfügbarkeit und Ressourcenerschöpfung",
      privilege: "Unbefugter Zugriff auf höhere Berechtigungen",
      standards: "Sicherheitsstandards und Frameworks",
      iec62443Desc:
        "Internationaler Standard für die Sicherheit von industriellen Automatisierungs- und Steuerungssystemen",
      nistDesc: "Framework zur Verbesserung der Cybersicherheit kritischer Infrastrukturen",
      academicReferences: "Akademische Referenzen",
      citation: "Wie man diese Arbeit zitiert",
      license: "Lizenz und Nutzung",
      licenseDesc:
        "Dieses Projekt wird unter der MIT-Lizenz veröffentlicht und fördert die Open-Source-Zusammenarbeit in der industriellen Cybersicherheitsforschung.",
      contributions: "Beiträge, Fehlerberichte und Feature-Anfragen sind auf GitHub willkommen.",
    },

    // Analytics
    analytics: {
      title: "Analytics-Dashboard",
      subtitle: "Umfassende Statistiken und Einblicke aus allen Projekten",
      overview: "Übersicht",
      totalProjects: "Gesamtprojekte",
      avgRiskScore: "Durchschnittliche Risikobewertung",
      totalVulnerabilities: "Gesamte Schwachstellen",
      criticalIssues: "Kritische Probleme",
      riskDistribution: "Risikoverteilung",
      deviceTypes: "Gerätetypen",
      protocolUsage: "Protokollnutzung",
      topVulnerabilities: "Top-Schwachstellen",
      complianceStatus: "Compliance-Status",
      industryBreakdown: "Branchenaufschlüsselung",
      noData: "Keine Daten verfügbar",
      createProjectsFirst: "Erstellen Sie Projekte, um Analysen zu sehen",
    },

    // Comparison
    comparison: {
      title: "Projektvergleich",
      subtitle: "Vergleichen Sie mehrere Projekte nebeneinander",
      selectProjects: "Projekte zum Vergleichen auswählen",
      selectProjectsDesc: "Wählen Sie 2-4 Projekte zum Vergleichen",
      compare: "Vergleichen",
      clearSelection: "Auswahl löschen",
      selectAtLeast2: "Bitte wählen Sie mindestens 2 Projekte zum Vergleichen",
      riskComparison: "Risikovergleich",
      systemConfiguration: "Systemkonfiguration",
      vulnerabilityStats: "Schwachstellenstatistiken",
      securityRecommendations: "Sicherheitsempfehlungen",
      notAvailable: "Nicht verfügbar",
    },

    // Advanced Analysis
    advancedAnalysis: {
      title: "Erweiterte Analyse",
      strideAnalysis: "STRIDE-Analyse",
      attackTree: "Angriffsbaum",
      compliance: "Compliance",
      strideDesc: "Bedrohungsmodellierung mit STRIDE-Framework",
      attackTreeDesc: "Potenzielle Angriffspfade mit Wahrscheinlichkeiten",
      complianceDesc: "Compliance-Überprüfung mit internationalen Standards",
      threatCategory: "Bedrohungskategorie",
      level: "Stufe",
      mitigation: "Minderung",
      attackVector: "Angriffsvektor",
      probability: "Wahrscheinlichkeit",
      impact: "Auswirkung",
      mitigationStatus: "Minderungsstatus",
      standard: "Standard",
      requirement: "Anforderung",
      status: "Status",
      compliant: "Konform",
      nonCompliant: "Nicht konform",
      partiallyCompliant: "Teilweise konform",
    },
    // Simulation
    simulation: {
      title: "Cyber-Angriffssimulation",
      subtitle: "Testen Sie Angriffsszenarien und verstehen Sie potenzielle Eindringungspfade",
      scenarios: "Verfügbare Szenarien",
      run: "Ausführen",
      selectScenario: "Wählen Sie ein Szenario, um die Simulation zu starten",
      running: "Simulation läuft...",
      attackSuccess: "Angriffserfolgwahrscheinlichkeit",
      riskScore: "Risikobewertung",
      attackPath: "Angriffspfad",
      impact: "Kaskadierende Auswirkungen",
      detectionPoints: "Erkennungspunkte",
      prevention: "Präventionsmaßnahmen",
      detection: "Erkennung",
    },

    costAnalysis: {
      title: "Risikokostenanalyse",
      subtitle: "Berechnen Sie die potenziellen finanziellen Auswirkungen von Cyberangriffen",
      inputParameters: "Eingabeparameter",
      selectProject: "Projekt auswählen",
      selectProjectPlaceholder: "Wählen Sie ein Projekt zur Analyse...",
      industryType: "Branche",
      dailyRevenue: "Täglicher Umsatz (EUR)",
      downtimeCost: "Ausfallkosten/Stunde (EUR)",
      recoveryTime: "Wiederherstellungszeit (Stunden)",
      dataLoss: "Datenverlustauswirkung (EUR)",
      reputationDamage: "Reputationsschadenkosten (EUR)",
      regulatoryFines: "Behördliche Bußgelder (EUR)",
      calculate: "Berechnen",
      selectProjectAndCalculate: "Wählen Sie ein Projekt und geben Sie Daten ein, um Kosten zu berechnen",
      totalFinancialRisk: "Gesamtfinanzielles Risiko",
      potentialLoss: "Potenzieller Verlust",
      perIncident: "Pro Vorfall",
      costBreakdown: "Kostenaufschlüsselung",
      incidentResponse: "Incident-Response-Kosten",
      recovery: "Wiederherstellungs- und Sanierungskosten",
      annualizedLoss: "Annualisierte Verlusterwartung",
      expectedAnnualLoss: "Erwarteter jährlicher Verlust (ALE)",
      recommendedBudget: "Empfohlenes Sicherheitsbudget",
      roi: "Sicherheitsinvestitionsrendite",
      costBenefitRatio: "Kosten-Nutzen-Verhältnis",
      paybackPeriod: "Amortisationszeit",
      industryBenchmark: "Branchen-Benchmark",
      industryAverage: "Branchendurchschnitt",
      yourPosition: "Ihre Position",
    },
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
  },
}

export type Language = "ar" | "en" | "de"
export type Translations = typeof translations.ar
