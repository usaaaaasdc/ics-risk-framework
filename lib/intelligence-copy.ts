import type { Language } from "./i18n/language-context";

// Page-specific UI copy; technical identifiers and saved user content remain unchanged.
const phrases = {
  scoringRules: [
    "Existing scoring rules: internet exposure adds 1.5; legacy status adds 1; each vulnerability match adds 0.2 (maximum 2). The legacy engine substitutes 5 for a zero input score. Historical industry adjustment is applied when available; the final index is bounded to 0–10. These rules are preserved, not statistically calibrated.",
    "قواعد الحساب الحالية: التعرض للإنترنت يضيف 1.5، وتقادم النظام يضيف 1، وكل تطابق ثغرة يضيف 0.2 (بحد أقصى 2). يستبدل المحرك الحالي درجة الصفر بالقيمة 5. يُطبّق تعديل تاريخ القطاع عند توفره؛ والمؤشر النهائي محصور بين 0 و10. هذه القواعد محفوظة وليست معايرة إحصائياً.",
    "Bestehende Regeln: Internetexposition +1,5; Altgeräte +1; jeder Schwachstellen-Treffer +0,2 (maximal 2). Die bisherige Engine ersetzt einen Eingabescore von 0 durch 5. Falls vorhanden, folgt eine Branchenhistorien-Anpassung; der Index ist auf 0–10 begrenzt. Die Regeln bleiben unverändert und sind nicht statistisch kalibriert.",
    "Mevcut kurallar: internet maruziyeti +1,5; eski sistem +1; her zafiyet eşleşmesi +0,2 (en fazla 2). Mevcut motor sıfır girdi puanını 5 ile değiştirir. Varsa sektör geçmişi düzeltmesi uygulanır; son endeks 0–10 ile sınırlıdır. Kurallar korunmuştur, istatistiksel olarak kalibre edilmemiştir.",
  ],
  analytics: [
    "Security analytics",
    "التحليلات الأمنية",
    "Sicherheitsanalysen",
    "Güvenlik analitiği",
  ],
  ai: [
    "AI risk analysis",
    "تحليل المخاطر بالذكاء الاصطناعي",
    "KI-Risikoanalyse",
    "YZ risk analizi",
  ],
  analyticsIntro: [
    "A clear view of your saved industrial security assessments.",
    "رؤية واضحة لتقييمات الأمن الصناعي المحفوظة.",
    "Ein klarer Überblick über gespeicherte industrielle Sicherheitsbewertungen.",
    "Kayıtlı endüstriyel güvenlik değerlendirmelerine açık bir bakış.",
  ],
  aiIntro: [
    "Explore risk drivers with the existing rule-based analysis engine.",
    "استكشف عوامل المخاطر باستخدام محرك التحليل القائم على القواعد.",
    "Risikotreiber mit der bestehenden regelbasierten Analyse untersuchen.",
    "Mevcut kural tabanlı motorla risk etkenlerini inceleyin.",
  ],
  provenance: [
    "LOCAL PROJECT DATA",
    "بيانات المشاريع المحلية",
    "LOKALE PROJEKTDATEN",
    "YEREL PROJE VERİLERİ",
  ],
  disclaimer: [
    "Saved inputs and assessment outputs only. No live telemetry. Heuristic results are not validated forecasts or evidence of compliance.",
    "مدخلات محفوظة ونتائج تقييم فقط. لا توجد قياسات مباشرة. النتائج الاستدلالية ليست توقعات مثبتة أو دليلاً على الامتثال.",
    "Nur gespeicherte Eingaben und Bewertungsergebnisse. Keine Live-Telemetrie. Heuristiken sind keine validierten Prognosen oder Konformitätsnachweise.",
    "Yalnızca kayıtlı girdiler ve değerlendirme çıktıları. Canlı telemetri yok. Sezgisel sonuçlar doğrulanmış tahmin veya uygunluk kanıtı değildir.",
  ],
  scope: ["Project scope", "نطاق المشروع", "Projektauswahl", "Proje kapsamı"],
  all: ["All projects", "جميع المشاريع", "Alle Projekte", "Tüm projeler"],
  refresh: [
    "Refresh saved data",
    "تحديث البيانات المحفوظة",
    "Gespeicherte Daten aktualisieren",
    "Kayıtlı verileri yenile",
  ],
  projects: ["Saved projects", "المشاريع المحفوظة", "Gespeicherte Projekte", "Kayıtlı projeler"],
  completed: [
    "Assessed projects",
    "المشاريع المقيّمة",
    "Bewertete Projekte",
    "Değerlendirilen projeler",
  ],
  matches: [
    "Vulnerability matches",
    "تطابقات الثغرات",
    "Schwachstellen-Treffer",
    "Zafiyet eşleşmeleri",
  ],
  average: [
    "Average assessed risk",
    "متوسط المخاطر المقيّمة",
    "Mittleres bewertetes Risiko",
    "Ortalama değerlendirilen risk",
  ],
  noData: [
    "No saved assessments yet",
    "لا توجد تقييمات محفوظة بعد",
    "Noch keine gespeicherten Bewertungen",
    "Henüz kayıtlı değerlendirme yok",
  ],
  noDataHelp: [
    "Create and save an assessment to see your project data here. No sample results are inserted.",
    "أنشئ تقييماً واحفظه لعرض بيانات مشروعك هنا. لا تتم إضافة نتائج تجريبية.",
    "Eine Bewertung erstellen und speichern, um Projektdaten zu sehen. Es werden keine Beispieldaten eingefügt.",
    "Proje verilerini görmek için bir değerlendirme oluşturup kaydedin. Örnek sonuç eklenmez.",
  ],
  start: ["Start assessment", "بدء التقييم", "Bewertung starten", "Değerlendirmeye başla"],
  manage: ["Manage projects", "إدارة المشاريع", "Projekte verwalten", "Projeleri yönet"],
  loading: [
    "Loading saved data…",
    "جارٍ تحميل البيانات المحفوظة…",
    "Gespeicherte Daten werden geladen…",
    "Kayıtlı veriler yükleniyor…",
  ],
  error: [
    "Saved data could not be read. Review your projects; nothing has been overwritten.",
    "تعذّر قراءة البيانات المحفوظة. راجع مشاريعك؛ لم تتم الكتابة فوق أي بيانات.",
    "Gespeicherte Daten konnten nicht gelesen werden. Projekte prüfen; nichts wurde überschrieben.",
    "Kayıtlı veriler okunamadı. Projelerinizi inceleyin; hiçbir veri üzerine yazılmadı.",
  ],
  map: ["Assessment landscape", "مشهد التقييمات", "Bewertungsübersicht", "Değerlendirme görünümü"],
  mapHelp: [
    "Select a saved system to inspect its assessment. Placement is schematic, not a discovered network.",
    "اختر نظاماً محفوظاً لفحص تقييمه. التوزيع تخطيطي وليس شبكة مكتشفة.",
    "Gespeichertes System zur Prüfung auswählen. Schematische Anordnung, kein erkanntes Netzwerk.",
    "Değerlendirmesini incelemek için kayıtlı sistem seçin. Yerleşim şematiktir, keşfedilmiş ağ değildir.",
  ],
  distribution: ["Risk distribution", "توزيع المخاطر", "Risikoverteilung", "Risk dağılımı"],
  critical: ["Critical", "حرج", "Kritisch", "Kritik"],
  high: ["High", "عالٍ", "Hoch", "Yüksek"],
  medium: ["Medium", "متوسط", "Mittel", "Orta"],
  low: ["Low", "منخفض", "Niedrig", "Düşük"],
  notAssessed: ["Not assessed", "لم يُقيّم", "Nicht bewertet", "Değerlendirilmedi"],
  inspector: [
    "Assessment details",
    "تفاصيل التقييم",
    "Bewertungsdetails",
    "Değerlendirme ayrıntıları",
  ],
  device: ["Device type", "نوع الجهاز", "Gerätetyp", "Cihaz türü"],
  manufacturer: ["Manufacturer", "الشركة المصنعة", "Hersteller", "Üretici"],
  model: ["Model", "الطراز", "Modell", "Model"],
  updated: ["Saved update", "آخر تحديث محفوظ", "Gespeicherte Aktualisierung", "Kayıtlı güncelleme"],
  review: ["Review assessment", "مراجعة التقييم", "Bewertung prüfen", "Değerlendirmeyi incele"],
  protocols: ["Protocol usage", "استخدام البروتوكولات", "Protokollnutzung", "Protokol kullanımı"],
  protocolHelp: [
    "Saved configurations · protocol risk categories are engine heuristics.",
    "الإعدادات المحفوظة · فئات مخاطر البروتوكولات استدلالية.",
    "Gespeicherte Konfigurationen · Protokollrisikokategorien sind Heuristiken.",
    "Kayıtlı yapılandırmalar · protokol risk sınıfları sezgiseldir.",
  ],
  vulnerabilities: [
    "Recorded vulnerability matches",
    "تطابقات الثغرات المسجلة",
    "Erfasste Schwachstellen-Treffer",
    "Kayıtlı zafiyet eşleşmeleri",
  ],
  vulnHelp: [
    "Matches from saved assessments; verify applicability and vendor advisories before action.",
    "تطابقات من التقييمات المحفوظة؛ تحقق من الانطباق وإرشادات المورّد قبل الإجراء.",
    "Treffer aus gespeicherten Bewertungen; Anwendbarkeit und Herstellerhinweise vor Maßnahmen prüfen.",
    "Kayıtlı değerlendirme eşleşmeleri; işlem öncesi uygulanabilirliği ve üretici duyurularını doğrulayın.",
  ],
  none: [
    "No records in this scope",
    "لا توجد سجلات في هذا النطاق",
    "Keine Einträge in dieser Auswahl",
    "Bu kapsamda kayıt yok",
  ],
  occurrences: ["Matches", "التطابقات", "Treffer", "Eşleşmeler"],
  severity: ["Severity", "الخطورة", "Schweregrad", "Önem derecesi"],
  compliance: ["Compliance evidence", "أدلة الامتثال", "Konformitätsnachweise", "Uygunluk kanıtı"],
  complianceHelp: [
    "No verified conformity evidence is available in project analytics. Configuration indicators do not establish certification.",
    "لا تتوفر أدلة امتثال متحققة في تحليلات المشاريع. مؤشرات الإعداد لا تثبت الاعتماد.",
    "Keine verifizierten Konformitätsnachweise in der Projektanalyse. Konfigurationsindikatoren begründen keine Zertifizierung.",
    "Proje analitiğinde doğrulanmış uygunluk kanıtı bulunmuyor. Yapılandırma göstergeleri sertifikasyon oluşturmaz.",
  ],
  iec: [
    "Open IEC 62443 review",
    "فتح مراجعة IEC 62443",
    "IEC-62443-Prüfung öffnen",
    "IEC 62443 incelemesini aç",
  ],
  types: [
    "Saved device types",
    "أنواع الأجهزة المحفوظة",
    "Gespeicherte Gerätetypen",
    "Kayıtlı cihaz türleri",
  ],
  industries: ["Industry breakdown", "توزيع القطاعات", "Branchenübersicht", "Sektör dağılımı"],
  history: [
    "Historical assessments",
    "التقييمات التاريخية",
    "Historische Bewertungen",
    "Geçmiş değerlendirmeler",
  ],
  historyAverage: [
    "Historical average risk",
    "متوسط المخاطر التاريخي",
    "Historischer Risikomittelwert",
    "Geçmiş ortalama risk",
  ],
  heuristic: [
    "HEURISTIC · NOT A FORECAST",
    "استدلالي · ليس توقعاً",
    "HEURISTIK · KEINE PROGNOSE",
    "SEZGİSEL · TAHMİN DEĞİL",
  ],
  method: [
    "Analysis method & limitations",
    "منهج التحليل والقيود",
    "Analysemethode und Grenzen",
    "Analiz yöntemi ve sınırlamalar",
  ],
  methodHelp: [
    "The existing engine combines assessed risk, exposure, legacy status and vulnerability count, with an industry-history adjustment where available. It is rule-based, not a trained or calibrated AI model. Its fixed confidence and future-risk probabilities are unvalidated and are not displayed.",
    "يجمع المحرك الحالي المخاطر المقيّمة والتعرض وتقادم النظام وعدد الثغرات، مع تعديل وفق تاريخ القطاع عند توفره. هو قائم على القواعد وليس نموذج ذكاء اصطناعي مدرّباً أو معايراً. درجات الثقة واحتمالات المخاطر المستقبلية الثابتة غير مثبتة ولا تُعرض.",
    "Die bestehende Engine kombiniert bewertetes Risiko, Exposition, Altgeräte und Schwachstellenzahl, ggf. mit Branchenhistorie. Sie ist regelbasiert, kein trainiertes oder kalibriertes KI-Modell. Feste Konfidenz- und Zukunftswahrscheinlichkeiten sind unvalidiert und werden nicht angezeigt.",
    "Mevcut motor değerlendirilen risk, maruziyet, eski sistem durumu ve zafiyet sayısını; varsa sektör geçmişi düzeltmesiyle birleştirir. Kural tabanlıdır, eğitilmiş veya kalibre edilmiş YZ modeli değildir. Sabit güven ve gelecek risk olasılıkları doğrulanmamıştır ve gösterilmez.",
  ],
  choose: [
    "Select a saved project",
    "اختر مشروعاً محفوظاً",
    "Gespeichertes Projekt auswählen",
    "Kayıtlı proje seçin",
  ],
  inputs: ["Analysis inputs", "مدخلات التحليل", "Analyseeingaben", "Analiz girdileri"],
  exposure: ["Internet exposure", "التعرض للإنترنت", "Internetexposition", "İnternet maruziyeti"],
  legacy: ["Legacy system", "نظام متقادم", "Altsystem", "Eski sistem"],
  yes: ["Yes", "نعم", "Ja", "Evet"],
  no: ["No", "لا", "Nein", "Hayır"],
  run: [
    "Run heuristic analysis",
    "تشغيل التحليل الاستدلالي",
    "Heuristische Analyse starten",
    "Sezgisel analizi çalıştır",
  ],
  result: [
    "Heuristic risk index",
    "مؤشر المخاطر الاستدلالي",
    "Heuristischer Risikoindex",
    "Sezgisel risk endeksi",
  ],
  ready: [
    "Ready to analyze saved inputs",
    "جاهز لتحليل المدخلات المحفوظة",
    "Gespeicherte Eingaben bereit zur Analyse",
    "Kayıtlı girdiler analize hazır",
  ],
  insufficient: [
    "An assessed project with complete device inputs is required. Missing data is not interpreted as low risk.",
    "يلزم مشروع مقيّم بمدخلات جهاز مكتملة. لا تُفسّر البيانات الناقصة كمخاطر منخفضة.",
    "Ein bewertetes Projekt mit vollständigen Geräteeingaben ist erforderlich. Fehlende Daten bedeuten kein geringes Risiko.",
    "Eksiksiz cihaz girdileri olan değerlendirilmiş proje gerekir. Eksik veri düşük risk olarak yorumlanmaz.",
  ],
  guidance: ["Engine recommendations", "توصيات المحرك", "Engine-Empfehlungen", "Motor önerileri"],
  guidanceHelp: [
    "Generic guidance derived from saved inputs; review feasibility and safety before applying changes.",
    "إرشادات عامة مستمدة من المدخلات المحفوظة؛ راجع الجدوى والسلامة قبل التطبيق.",
    "Allgemeine Hinweise aus gespeicherten Eingaben; Umsetzbarkeit und Sicherheit vor Änderungen prüfen.",
    "Kayıtlı girdilerden genel rehberlik; değişiklik öncesi uygulanabilirliği ve güvenliği inceleyin.",
  ],
  historyHelp: [
    "History is loaded only from saved assessment records. A validated forecast and calibrated confidence are unavailable.",
    "يُحمّل التاريخ من سجلات التقييم المحفوظة فقط. لا تتوفر توقعات مثبتة أو درجات ثقة معايرة.",
    "Historie nur aus gespeicherten Bewertungsdaten. Validierte Prognosen und kalibrierte Konfidenz sind nicht verfügbar.",
    "Geçmiş yalnızca kayıtlı değerlendirmelerden yüklenir. Doğrulanmış tahmin ve kalibre edilmiş güven mevcut değildir.",
  ],
  invalidHistory: [
    "Historical records are unreadable or incomplete and were excluded. Saved data is unchanged.",
    "السجلات التاريخية غير مقروءة أو غير مكتملة وتم استبعادها. البيانات المحفوظة لم تتغير.",
    "Historische Daten sind unlesbar oder unvollständig und wurden ausgeschlossen. Gespeicherte Daten unverändert.",
    "Geçmiş kayıtlar okunamıyor veya eksik; hariç tutuldu. Kayıtlı veriler değişmedi.",
  ],
  hypothetical: [
    "Hypothetical decision support · not a predicted incident likelihood",
    "دعم قرار افتراضي · ليس احتمال حادث متوقعاً",
    "Hypothetische Entscheidungshilfe · keine vorhergesagte Vorfallwahrscheinlichkeit",
    "Varsayımsal karar desteği · öngörülen olay olasılığı değildir",
  ],
} satisfies Record<string, [string, string, string, string]>;

export function intelligenceCopy(language: Language) {
  const index = { en: 0, ar: 1, de: 2, tr: 3 }[language];
  return Object.fromEntries(
    Object.entries(phrases).map(([key, values]) => [key, values[index]])
  ) as Record<keyof typeof phrases, string>;
}

const recommendations: Record<string, [string, string, string]> = {
  "URGENT: Immediate security audit recommended within 30 days": [
    "عاجل: يوصى بتدقيق أمني خلال 30 يوماً",
    "DRINGEND: Sicherheitsprüfung innerhalb von 30 Tagen empfohlen",
    "ACİL: 30 gün içinde güvenlik denetimi önerilir",
  ],
  "Consider engaging external ICS security consultants": [
    "فكّر في الاستعانة بمستشارين خارجيين لأمن الأنظمة الصناعية",
    "Externe ICS-Sicherheitsberatung erwägen",
    "Harici ICS güvenlik danışmanlarıyla çalışmayı değerlendirin",
  ],
  "Implement network segmentation and DMZ for internet-facing devices": [
    "طبّق تقسيم الشبكة ومنطقة DMZ للأجهزة المعرضة للإنترنت",
    "Netzsegmentierung und DMZ für internetexponierte Geräte einrichten",
    "İnternete açık cihazlar için ağ segmentasyonu ve DMZ uygulayın",
  ],
  "Deploy industrial firewall with deep packet inspection": [
    "استخدم جدار حماية صناعياً مع فحص عميق للحزم",
    "Industrielle Firewall mit tiefgehender Paketprüfung einsetzen",
    "Derin paket incelemeli endüstriyel güvenlik duvarı kullanın",
  ],
  "Create a legacy system replacement roadmap (12-24 months)": [
    "ضع خارطة لاستبدال الأنظمة المتقادمة (12–24 شهراً)",
    "Ablöseplan für Altsysteme erstellen (12–24 Monate)",
    "Eski sistem değiştirme yol haritası oluşturun (12–24 ay)",
  ],
  "Implement compensating controls for legacy devices": [
    "طبّق ضوابط تعويضية للأجهزة المتقادمة",
    "Kompensierende Maßnahmen für Altgeräte umsetzen",
    "Eski cihazlar için telafi edici kontroller uygulayın",
  ],
  "Establish a regular patch management cycle": [
    "أنشئ دورة منتظمة لإدارة التصحيحات",
    "Regelmäßigen Patch-Management-Zyklus etablieren",
    "Düzenli yama yönetimi döngüsü oluşturun",
  ],
  "Subscribe to ICS-CERT advisories for your vendors": [
    "تابع تنبيهات ICS-CERT الخاصة بالمورّدين",
    "ICS-CERT-Hinweise für eingesetzte Hersteller abonnieren",
    "Üreticileriniz için ICS-CERT duyurularını takip edin",
  ],
  "Continue current security practices": [
    "واصل ممارسات الأمن الحالية",
    "Bestehende Sicherheitspraktiken fortsetzen",
    "Mevcut güvenlik uygulamalarını sürdürün",
  ],
  "Schedule next assessment in 6 months": [
    "حدّد التقييم التالي خلال 6 أشهر",
    "Nächste Bewertung in 6 Monaten planen",
    "Sonraki değerlendirmeyi 6 ay içinde planlayın",
  ],
};

export function recommendationCopy(text: string, language: Language) {
  return language === "en"
    ? text
    : (recommendations[text]?.[{ ar: 0, de: 1, tr: 2 }[language]] ?? text);
}
