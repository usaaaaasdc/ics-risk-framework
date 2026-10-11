"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/lib/i18n/language-context";
import { CommandShell, ModeSwitch } from "@/components/assessment/command-shell";
import { assessmentCopy } from "@/lib/assessment-ui-copy";
import { Shield, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SimpleModePage() {
  const { language } = useLanguage();
  const copy = assessmentCopy(language);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    systemAge: "",
    internetAccess: "",
    lastUpdate: "",
    externalConnections: "",
    securityTools: "",
  });
  const [result, setResult] = useState<string | null>(null);

  const questions = {
    tr: {
      systemAge: {
        question: "Endüstriyel kontrol sisteminiz kaç yaşında?",
        options: [
          { value: "new", label: "2 yıldan az", risk: 1 },
          { value: "medium", label: "2–5 yıl", risk: 2 },
          { value: "old", label: "5–10 yıl", risk: 3 },
          { value: "legacy", label: "10 yıldan fazla", risk: 4 },
        ],
      },
      internetAccess: {
        question: "Sisteminiz internete bağlı mı?",
        options: [
          { value: "no", label: "Hayır, tamamen izole", risk: 1 },
          { value: "indirect", label: "Yalnızca güvenli ağ geçidi üzerinden", risk: 2 },
          { value: "yes", label: "Evet, doğrudan bağlı", risk: 4 },
        ],
      },
      lastUpdate: {
        question: "Son güvenlik güncellemesi ne zaman uygulandı?",
        options: [
          { value: "recent", label: "Son 3 ay içinde", risk: 1 },
          { value: "moderate", label: "3–12 ay önce", risk: 2 },
          { value: "old", label: "1 yıldan fazla", risk: 3 },
          { value: "never", label: "Hiç güncellenmedi", risk: 4 },
        ],
      },
      externalConnections: {
        question: "Harici tedarikçilerin uzaktan erişimi var mı?",
        options: [
          { value: "no", label: "Harici erişim yok", risk: 1 },
          { value: "controlled", label: "Evet, sıkı denetim altında", risk: 2 },
          { value: "uncontrolled", label: "Evet, sınırlı gözetimle", risk: 4 },
        ],
      },
      securityTools: {
        question: "Güvenlik izleme araçlarınız var mı?",
        options: [
          { value: "comprehensive", label: "Evet, kapsamlı izleme", risk: 1 },
          { value: "basic", label: "Yalnızca temel güvenlik duvarı", risk: 2 },
          { value: "none", label: "Güvenlik aracı yok", risk: 4 },
        ],
      },
    },
    en: {
      systemAge: {
        question: "How old is your industrial control system?",
        options: [
          { value: "new", label: "Less than 2 years", risk: 1 },
          { value: "medium", label: "2-5 years", risk: 2 },
          { value: "old", label: "5-10 years", risk: 3 },
          { value: "legacy", label: "More than 10 years", risk: 4 },
        ],
      },
      internetAccess: {
        question: "Is your system connected to the internet?",
        options: [
          { value: "no", label: "No, completely isolated", risk: 1 },
          { value: "indirect", label: "Only through secure gateway", risk: 2 },
          { value: "yes", label: "Yes, directly connected", risk: 4 },
        ],
      },
      lastUpdate: {
        question: "When was the last security update applied?",
        options: [
          { value: "recent", label: "Within last 3 months", risk: 1 },
          { value: "moderate", label: "3-12 months ago", risk: 2 },
          { value: "old", label: "More than 1 year ago", risk: 3 },
          { value: "never", label: "Never updated", risk: 4 },
        ],
      },
      externalConnections: {
        question: "Do external vendors have remote access?",
        options: [
          { value: "no", label: "No external access", risk: 1 },
          { value: "controlled", label: "Yes, but strictly controlled", risk: 2 },
          { value: "uncontrolled", label: "Yes, with minimal oversight", risk: 4 },
        ],
      },
      securityTools: {
        question: "Do you have security monitoring tools in place?",
        options: [
          { value: "comprehensive", label: "Yes, comprehensive monitoring", risk: 1 },
          { value: "basic", label: "Basic firewall only", risk: 2 },
          { value: "none", label: "No security tools", risk: 4 },
        ],
      },
    },
    ar: {
      systemAge: {
        question: "ما عمر نظام التحكم الصناعي الخاص بك؟",
        options: [
          { value: "new", label: "أقل من سنتين", risk: 1 },
          { value: "medium", label: "2-5 سنوات", risk: 2 },
          { value: "old", label: "5-10 سنوات", risk: 3 },
          { value: "legacy", label: "أكثر من 10 سنوات", risk: 4 },
        ],
      },
      internetAccess: {
        question: "هل النظام متصل بالإنترنت؟",
        options: [
          { value: "no", label: "لا، معزول تماماً", risk: 1 },
          { value: "indirect", label: "فقط من خلال بوابة آمنة", risk: 2 },
          { value: "yes", label: "نعم، متصل مباشرة", risk: 4 },
        ],
      },
      lastUpdate: {
        question: "متى تم تطبيق آخر تحديث أمني؟",
        options: [
          { value: "recent", label: "خلال 3 أشهر الماضية", risk: 1 },
          { value: "moderate", label: "منذ 3-12 شهراً", risk: 2 },
          { value: "old", label: "أكثر من سنة", risk: 3 },
          { value: "never", label: "لم يتم التحديث أبداً", risk: 4 },
        ],
      },
      externalConnections: {
        question: "هل للموردين الخارجيين وصول عن بُعد؟",
        options: [
          { value: "no", label: "لا يوجد وصول خارجي", risk: 1 },
          { value: "controlled", label: "نعم، لكن مراقب بصرامة", risk: 2 },
          { value: "uncontrolled", label: "نعم، مع رقابة محدودة", risk: 4 },
        ],
      },
      securityTools: {
        question: "هل لديك أدوات مراقبة أمنية؟",
        options: [
          { value: "comprehensive", label: "نعم، مراقبة شاملة", risk: 1 },
          { value: "basic", label: "جدار حماية أساسي فقط", risk: 2 },
          { value: "none", label: "لا توجد أدوات أمنية", risk: 4 },
        ],
      },
    },
    de: {
      systemAge: {
        question: "Wie alt ist Ihr industrielles Steuerungssystem?",
        options: [
          { value: "new", label: "Weniger als 2 Jahre", risk: 1 },
          { value: "medium", label: "2-5 Jahre", risk: 2 },
          { value: "old", label: "5-10 Jahre", risk: 3 },
          { value: "legacy", label: "Mehr als 10 Jahre", risk: 4 },
        ],
      },
      internetAccess: {
        question: "Ist Ihr System mit dem Internet verbunden?",
        options: [
          { value: "no", label: "Nein, vollständig isoliert", risk: 1 },
          { value: "indirect", label: "Nur über sicheres Gateway", risk: 2 },
          { value: "yes", label: "Ja, direkt verbunden", risk: 4 },
        ],
      },
      lastUpdate: {
        question: "Wann wurde das letzte Sicherheitsupdate angewendet?",
        options: [
          { value: "recent", label: "Innerhalb der letzten 3 Monate", risk: 1 },
          { value: "moderate", label: "Vor 3-12 Monaten", risk: 2 },
          { value: "old", label: "Vor mehr als 1 Jahr", risk: 3 },
          { value: "never", label: "Nie aktualisiert", risk: 4 },
        ],
      },
      externalConnections: {
        question: "Haben externe Anbieter Fernzugriff?",
        options: [
          { value: "no", label: "Kein externer Zugriff", risk: 1 },
          { value: "controlled", label: "Ja, aber streng kontrolliert", risk: 2 },
          { value: "uncontrolled", label: "Ja, mit minimaler Aufsicht", risk: 4 },
        ],
      },
      securityTools: {
        question: "Haben Sie Sicherheitsüberwachungstools?",
        options: [
          { value: "comprehensive", label: "Ja, umfassende Überwachung", risk: 1 },
          { value: "basic", label: "Nur grundlegende Firewall", risk: 2 },
          { value: "none", label: "Keine Sicherheitstools", risk: 4 },
        ],
      },
    },
  };

  const currentQuestions = questions[language as keyof typeof questions] || questions.en;

  const calculateRisk = () => {
    const riskScores = Object.entries(answers).map(([key, value]) => {
      const question = currentQuestions[key as keyof typeof currentQuestions];
      const option = question.options.find((o) => o.value === value);
      return option?.risk || 0;
    });

    const totalRisk = riskScores.reduce((sum, score) => sum + score, 0);
    const avgRisk = totalRisk / riskScores.length;

    if (avgRisk <= 1.5) return "low";
    if (avgRisk <= 2.5) return "medium";
    return "high";
  };

  const handleNext = () => {
    const currentKey = Object.keys(currentQuestions)[step - 1];
    if (answers[currentKey as keyof typeof answers]) {
      if (step === 5) {
        const riskLevel = calculateRisk();
        setResult(riskLevel);
      } else {
        setStep(step + 1);
      }
    }
  };

  const resultContent = {
    tr: {
      low: {
        title: "İyi Güvenlik Duruşu",
        icon: CheckCircle,
        color: "text-green-500",
        message: "Yanıtlarınız temel güvenlik uygulamalarına işaret ediyor.",
        recommendations: [
          "Düzenli güvenlik güncellemelerini sürdürün",
          "Mevcut izleme uygulamalarını koruyun",
          "Güvenlik politikalarını yıllık gözden geçirin",
        ],
        action: "Güvenlik uygulamalarınızı üç ayda bir gözden geçirin.",
      },
      medium: {
        title: "Orta Risk Seviyesi",
        icon: AlertCircle,
        color: "text-yellow-500",
        message: "Yanıtlarınız incelenmesi gereken güvenlik boşluklarına işaret ediyor.",
        recommendations: [
          "Düzenli güncelleme planı uygulayın",
          "Ağ bölümlemesi ekleyin",
          "Temel izleme araçları kullanın",
        ],
        action: "Operasyon ve güvenlik ekibiyle iyileştirme planı hazırlayın.",
      },
      high: {
        title: "Yüksek Risk — İnceleme Gerekli",
        icon: AlertCircle,
        color: "text-red-500",
        message: "Yanıtlarınız öncelikli teknik inceleme ihtiyacına işaret ediyor.",
        recommendations: [
          "Kritik sistemlerin erişimini inceleyin",
          "Güvenlik izlemesini geliştirin",
          "Güvenlik denetimi planlayın",
          "Güncellemeleri güvenli bakım pencerelerinde değerlendirin",
        ],
        action: "Nitel sonucu bir siber güvenlik uzmanıyla doğrulayın.",
      },
    },
    en: {
      low: {
        title: "Good Security Posture",
        icon: CheckCircle,
        color: "text-green-500",
        message: "Your system appears to have good security practices in place.",
        recommendations: [
          "Continue regular security updates",
          "Maintain current monitoring practices",
          "Review security policies annually",
        ],
        action: "Schedule quarterly security reviews to maintain your good standing.",
      },
      medium: {
        title: "Moderate Risk Level",
        icon: AlertCircle,
        color: "text-yellow-500",
        message: "Your system has some security gaps that should be addressed.",
        recommendations: [
          "Implement regular update schedule",
          "Add network segmentation",
          "Deploy basic monitoring tools",
        ],
        action: "Invest in security improvements within the next 3-6 months.",
      },
      high: {
        title: "High Risk - Action Required",
        icon: AlertCircle,
        color: "text-red-500",
        message:
          "Your system has significant security vulnerabilities that require immediate attention.",
        recommendations: [
          "Isolate critical systems immediately",
          "Deploy comprehensive security monitoring",
          "Schedule immediate security audit",
          "Update all systems urgently",
        ],
        action: "Contact a cybersecurity professional within 2 weeks for emergency assessment.",
      },
    },
    ar: {
      low: {
        title: "وضع أمني جيد",
        icon: CheckCircle,
        color: "text-green-500",
        message: "يبدو أن نظامك يطبق ممارسات أمنية جيدة.",
        recommendations: [
          "استمر في التحديثات الأمنية المنتظمة",
          "حافظ على ممارسات المراقبة الحالية",
          "راجع السياسات الأمنية سنوياً",
        ],
        action: "جدول مراجعات أمنية ربع سنوية للحفاظ على وضعك الجيد.",
      },
      medium: {
        title: "مستوى خطر متوسط",
        icon: AlertCircle,
        color: "text-yellow-500",
        message: "نظامك يحتوي على بعض الثغرات الأمنية التي يجب معالجتها.",
        recommendations: [
          "تنفيذ جدول تحديثات منتظم",
          "إضافة تقسيم للشبكة",
          "نشر أدوات مراقبة أساسية",
        ],
        action: "استثمر في تحسينات أمنية خلال 3-6 أشهر القادمة.",
      },
      high: {
        title: "خطر عالي - مطلوب إجراء",
        icon: AlertCircle,
        color: "text-red-500",
        message: "نظامك يحتوي على ثغرات أمنية كبيرة تتطلب اهتماماً فورياً.",
        recommendations: [
          "عزل الأنظمة الحرجة فوراً",
          "نشر مراقبة أمنية شاملة",
          "جدولة تدقيق أمني فوري",
          "تحديث جميع الأنظمة بشكل عاجل",
        ],
        action: "اتصل بمتخصص أمن سيبراني خلال أسبوعين لتقييم طارئ.",
      },
    },
    de: {
      low: {
        title: "Gute Sicherheitslage",
        icon: CheckCircle,
        color: "text-green-500",
        message: "Ihr System scheint gute Sicherheitspraktiken zu haben.",
        recommendations: [
          "Regelmäßige Sicherheitsupdates fortsetzen",
          "Aktuelle Überwachungspraktiken beibehalten",
          "Sicherheitsrichtlinien jährlich überprüfen",
        ],
        action: "Planen Sie vierteljährliche Sicherheitsüberprüfungen.",
      },
      medium: {
        title: "Mittleres Risikoniveau",
        icon: AlertCircle,
        color: "text-yellow-500",
        message: "Ihr System hat einige Sicherheitslücken, die behoben werden sollten.",
        recommendations: [
          "Regelmäßigen Update-Zeitplan implementieren",
          "Netzwerksegmentierung hinzufügen",
          "Grundlegende Überwachungstools bereitstellen",
        ],
        action: "Investieren Sie in Sicherheitsverbesserungen innerhalb von 3-6 Monaten.",
      },
      high: {
        title: "Hohes Risiko - Maßnahmen erforderlich",
        icon: AlertCircle,
        color: "text-red-500",
        message:
          "Ihr System hat erhebliche Sicherheitslücken, die sofortige Aufmerksamkeit erfordern.",
        recommendations: [
          "Kritische Systeme sofort isolieren",
          "Umfassende Sicherheitsüberwachung bereitstellen",
          "Sofortiges Sicherheitsaudit planen",
          "Alle Systeme dringend aktualisieren",
        ],
        action: "Kontaktieren Sie innerhalb von 2 Wochen einen Cybersecurity-Experten.",
      },
    },
  };

  return (
    <CommandShell
      section="simple"
      title={
        language === "ar"
          ? "الوضع المبسط للمديرين"
          : language === "de"
            ? "Einfacher Modus für Manager"
            : language === "tr"
              ? "Yöneticiler için Basit Mod"
              : "Simple Mode for Managers"
      }
      subtitle={copy.simpleNote}
    >
      <div className="ac-toolbar">
        <ModeSwitch simple />
        <span className="ac-badge">
          {copy.complete}: {Object.values(answers).filter(Boolean).length} / 5
        </span>
      </div>
      <div className="ac-simple-grid">
        <aside className="ac-panel ac-simple-context">
          <Shield size={38} />
          <h2>{copy.assessment}</h2>
          <p>{copy.simpleNote}</p>
          <ol>
            {Object.keys(currentQuestions).map((key, i) => (
              <li key={key} data-complete={!!answers[key as keyof typeof answers]}>
                <span>
                  {answers[key as keyof typeof answers] ? <CheckCircle size={15} /> : i + 1}
                </span>
                {currentQuestions[key as keyof typeof currentQuestions].question}
              </li>
            ))}
          </ol>
          <Link className="ac-text-button" href="/assessment">
            {copy.advanced}
          </Link>
        </aside>
        <div>
          {!result ? (
            <Card className="ac-simple-card p-8">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">
                    {language === "ar" && `السؤال ${step} من 5`}
                    {language === "en" && `Question ${step} of 5`}
                    {language === "de" && `Frage ${step} von 5`}
                    {language === "tr" && `Soru ${step} / 5`}
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    {Math.round((step / 5) * 100)}%
                  </div>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(step / 5) * 100}%` }}
                  />
                </div>
              </div>

              {Object.entries(currentQuestions).map(([key, question], index) => {
                if (index + 1 !== step) return null;

                return (
                  <div key={key} className="space-y-6">
                    <h3 className="text-lg font-medium">{question.question}</h3>
                    <RadioGroup
                      dir={language === "ar" ? "rtl" : "ltr"}
                      value={answers[key as keyof typeof answers]}
                      onValueChange={(value) => setAnswers({ ...answers, [key]: value })}
                    >
                      {question.options.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-3 space-x-reverse p-4 border border-border rounded-lg hover:bg-accent cursor-pointer"
                        >
                          <RadioGroupItem value={option.value} id={`${key}-${option.value}`} />
                          <Label
                            htmlFor={`${key}-${option.value}`}
                            className="flex-1 cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <div className="flex gap-4">
                      {step > 1 && (
                        <Button
                          variant="outline"
                          onClick={() => setStep(step - 1)}
                          className="flex-1"
                        >
                          {language === "ar" && "السابق"}
                          {language === "en" && "Previous"}
                          {language === "tr" && "Önceki"}
                          {language === "de" && "Zurück"}
                        </Button>
                      )}
                      <Button
                        onClick={handleNext}
                        disabled={!answers[key as keyof typeof answers]}
                        className="flex-1"
                      >
                        {step === 5
                          ? language === "ar"
                            ? "عرض النتيجة"
                            : language === "de"
                              ? "Ergebnis anzeigen"
                              : language === "tr"
                                ? "Sonucu Göster"
                                : "Show Result"
                          : language === "ar"
                            ? "التالي"
                            : language === "de"
                              ? "Weiter"
                              : language === "tr"
                                ? "Sonraki"
                                : "Next"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </Card>
          ) : (
            <div className="ac-simple-results space-y-6">
              {(() => {
                const content =
                  resultContent[language as keyof typeof resultContent]?.[
                    result as keyof typeof resultContent.en
                  ] || resultContent.en[result as keyof typeof resultContent.en];
                const Icon = content.icon;

                return (
                  <>
                    <Card className="p-8 text-center">
                      <Icon className={`w-20 h-20 mx-auto mb-4 ${content.color}`} />
                      <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
                      <p className="text-lg text-muted-foreground mb-6">{content.message}</p>
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${result === "low" ? "bg-green-500/10 text-green-500" : result === "medium" ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"}`}
                      >
                        {result === "low" && <TrendingUp className="w-5 h-5" />}
                        {result === "medium" && <AlertCircle className="w-5 h-5" />}
                        {result === "high" && <TrendingDown className="w-5 h-5" />}
                        <span className="font-semibold">
                          {result === "low" &&
                            (language === "ar"
                              ? "خطر منخفض"
                              : language === "de"
                                ? "Niedriges Risiko"
                                : "Low Risk")}
                          {result === "medium" &&
                            (language === "ar"
                              ? "خطر متوسط"
                              : language === "de"
                                ? "Mittleres Risiko"
                                : "Medium Risk")}
                          {result === "high" &&
                            (language === "ar"
                              ? "خطر عالي"
                              : language === "de"
                                ? "Hohes Risiko"
                                : "High Risk")}
                        </span>
                      </div>
                    </Card>

                    <Card className="p-8">
                      <h3 className="text-xl font-bold mb-4">
                        {language === "ar" && "التوصيات"}
                        {language === "en" && "Recommendations"}
                        {language === "tr" && "Öneriler"}
                        {language === "de" && "Empfehlungen"}
                      </h3>
                      <ul className="space-y-3">
                        {content.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    <Card className="p-8 bg-primary/5 border-primary/20">
                      <h3 className="text-xl font-bold mb-4">
                        {language === "ar" && "الخطوة التالية"}
                        {language === "en" && "Next Step"}
                        {language === "tr" && "Sonraki Adım"}
                        {language === "de" && "Nächster Schritt"}
                      </h3>
                      <p className="text-lg mb-6">{content.action}</p>
                      <div className="flex gap-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setResult(null);
                            setStep(1);
                            setAnswers({
                              systemAge: "",
                              internetAccess: "",
                              lastUpdate: "",
                              externalConnections: "",
                              securityTools: "",
                            });
                          }}
                        >
                          {language === "ar" && "إعادة التقييم"}
                          {language === "en" && "Retake Assessment"}
                          {language === "tr" && "Yeniden Değerlendir"}
                          {language === "de" && "Erneut bewerten"}
                        </Button>
                        <Link href="/assessment">
                          <Button>
                            {language === "ar" && "الوضع المتقدم"}
                            {language === "en" && "Advanced Mode"}
                            {language === "tr" && "Gelişmiş Mod"}
                            {language === "de" && "Erweiterter Modus"}
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </CommandShell>
  );
}
