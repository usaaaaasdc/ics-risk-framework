"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { translations } from "@/lib/i18n/translations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Target, Users, Database, Shield, Lock, Layers, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className="min-h-screen bg-background p-4 md:p-8" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.backToHome || "Back to Home"}
            </Button>
          </Link>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{t.title}</h1>
          <p className="text-xl text-muted-foreground">
            {language === "ar" && "حول المشروع والمنهجية الأكاديمية"}
            {language === "en" && "About the Project and Academic Methodology"}
            {language === "de" && "Über das Projekt und die akademische Methodik"}
          </p>
        </div>

        {/* Purpose and Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {language === "ar" && "الغرض والأهداف"}
              {language === "en" && "Purpose and Goals"}
              {language === "de" && "Zweck und Ziele"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                {language === "ar" && "الهدف الرئيسي"}
                {language === "en" && "Main Objective"}
                {language === "de" && "Hauptziel"}
              </h3>
              <p className="text-muted-foreground">
                {language === "ar" &&
                  "تطوير أداة مفتوحة المصدر لتقييم أمن أنظمة التحكم الصناعي (ICS/SCADA) بطريقة علمية ومنهجية. تهدف الأداة لسد الفجوة بين الأدوات التجارية الباهظة والحاجة الملحة للمؤسسات الصغيرة والجامعات في الدول النامية."}
                {language === "en" &&
                  "Develop an open-source tool for assessing Industrial Control Systems (ICS/SCADA) security in a scientific and systematic manner. The tool aims to bridge the gap between expensive commercial tools and the urgent need of small organizations and universities in developing countries."}
                {language === "de" &&
                  "Entwicklung eines Open-Source-Tools zur wissenschaftlichen und systematischen Bewertung der Sicherheit von industriellen Steuerungssystemen (ICS/SCADA). Das Tool zielt darauf ab, die Lücke zwischen teuren kommerziellen Tools und dem dringenden Bedarf kleiner Organisationen und Universitäten in Entwicklungsländern zu schließen."}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                {language === "ar" && "الفجوة في السوق"}
                {language === "en" && "Market Gap"}
                {language === "de" && "Marktlücke"}
              </h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  {language === "ar" && "الأدوات التجارية (Dragos, Claroty, Nozomi) تكلف $30K-$50K سنوياً"}
                  {language === "en" && "Commercial tools (Dragos, Claroty, Nozomi) cost $30K-$50K annually"}
                  {language === "de" && "Kommerzielle Tools (Dragos, Claroty, Nozomi) kosten $30K-$50K jährlich"}
                </li>
                <li>
                  {language === "ar" && "معظم الأدوات المفتوحة تركز على IT Security وليس OT/ICS"}
                  {language === "en" && "Most open-source tools focus on IT Security, not OT/ICS"}
                  {language === "de" &&
                    "Die meisten Open-Source-Tools konzentrieren sich auf IT-Sicherheit, nicht auf OT/ICS"}
                </li>
                <li>
                  {language === "ar" && "نقص في الأدوات التعليمية متعددة اللغات"}
                  {language === "en" && "Lack of multilingual educational tools"}
                  {language === "de" && "Mangel an mehrsprachigen Bildungstools"}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Users and Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {language === "ar" && "المستخدمون وسيناريوهات الاستخدام"}
              {language === "en" && "Users and Use Cases"}
              {language === "de" && "Benutzer und Anwendungsfälle"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                {language === "ar" && "المستخدمون المستهدفون"}
                {language === "en" && "Target Users"}
                {language === "de" && "Zielbenutzer"}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  {language === "ar" && "مهندسو الأمن الصناعي (OT Security Engineers)"}
                  {language === "en" && "OT Security Engineers"}
                  {language === "de" && "OT-Sicherheitsingenieure"}
                </li>
                <li>
                  {language === "ar" && "مستشارو ICS/SCADA Security"}
                  {language === "en" && "ICS/SCADA Security Consultants"}
                  {language === "de" && "ICS/SCADA-Sicherheitsberater"}
                </li>
                <li>
                  {language === "ar" && "طلاب وباحثون في الأمن السيبراني الصناعي"}
                  {language === "en" && "Students and researchers in industrial cybersecurity"}
                  {language === "de" && "Studenten und Forscher im Bereich industrielle Cybersicherheit"}
                </li>
                <li>
                  {language === "ar" && "مديرو المصانع والمنشآت الصناعية"}
                  {language === "en" && "Factory and plant managers"}
                  {language === "de" && "Fabrik- und Anlagenleiter"}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Technical Depth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {language === "ar" && "المنهجية التقنية"}
              {language === "en" && "Technical Methodology"}
              {language === "de" && "Technische Methodik"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                {language === "ar" && "منهجية تقييم المخاطر"}
                {language === "en" && "Risk Assessment Methodology"}
                {language === "de" && "Risikobewertungsmethodik"}
              </h3>
              <p className="text-muted-foreground mb-2">
                {language === "ar" && "يعتمد النظام على مزيج من المعايير الدولية المعتمدة:"}
                {language === "en" && "The system is based on a combination of recognized international standards:"}
                {language === "de" && "Das System basiert auf einer Kombination anerkannter internationaler Standards:"}
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  <strong>CVSS v3.1</strong>: {language === "ar" && "نظام تقييم الثغرات الأمنية"}
                  {language === "en" && "Common Vulnerability Scoring System"}
                  {language === "de" && "Common Vulnerability Scoring System"}
                </li>
                <li>
                  <strong>STRIDE</strong>: {language === "ar" && "نموذج تحليل التهديدات من Microsoft"}
                  {language === "en" && "Microsoft Threat Modeling Framework"}
                  {language === "de" && "Microsoft Threat Modeling Framework"}
                </li>
                <li>
                  <strong>IEC 62443</strong>: {language === "ar" && "معيار أمن الأتمتة الصناعية"}
                  {language === "en" && "Industrial Automation Security Standard"}
                  {language === "de" && "Industrielle Automatisierungssicherheitsstandard"}
                </li>
                <li>
                  <strong>NIST CSF</strong>: {language === "ar" && "إطار الأمن السيبراني"}
                  {language === "en" && "Cybersecurity Framework"}
                  {language === "de" && "Cybersicherheits-Framework"}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                {language === "ar" && "معادلة حساب المخاطر"}
                {language === "en" && "Risk Calculation Formula"}
                {language === "de" && "Risikoberechnungsformel"}
              </h3>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                Risk Score = (CVSS_avg × 0.6) + (Internet_Exposure × 0.3) + (Legacy_Weight × 0.1)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data and Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {language === "ar" && "البيانات والتحديثات"}
              {language === "en" && "Data and Updates"}
              {language === "de" && "Daten und Updates"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">
                  {language === "ar" && "قاعدة بيانات الثغرات"}
                  {language === "en" && "Vulnerability Database"}
                  {language === "de" && "Schwachstellendatenbank"}
                </h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    ✓ 60+ CVE {language === "ar" && "حقيقية من ICS-CERT و NVD"}
                    {language === "en" && "real CVEs from ICS-CERT & NVD"}
                    {language === "de" && "echte CVEs von ICS-CERT & NVD"}
                  </li>
                  <li>
                    ✓ {language === "ar" && "تحديثات يدوية حالياً"}
                    {language === "en" && "Manual updates currently"}
                    {language === "de" && "Derzeit manuelle Updates"}
                  </li>
                  <li>
                    ✓ {language === "ar" && "مفتوحة المصدر بالكامل"}
                    {language === "en" && "Fully open source"}
                    {language === "de" && "Vollständig Open Source"}
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {language === "ar" && "الأجهزة المدعومة"}
                  {language === "en" && "Supported Devices"}
                  {language === "de" && "Unterstützte Geräte"}
                </h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    ✓ 60+ {language === "ar" && "موديل من 20+ مصنع"}
                    {language === "en" && "models from 20+ manufacturers"}
                    {language === "de" && "Modelle von über 20 Herstellern"}
                  </li>
                  <li>
                    ✓ 24 {language === "ar" && "بروتوكول صناعي"}
                    {language === "en" && "industrial protocols"}
                    {language === "de" && "industrielle Protokolle"}
                  </li>
                  <li>
                    ✓ {language === "ar" && "قابل للتوسع عبر JSON"}
                    {language === "en" && "Expandable via JSON"}
                    {language === "de" && "Erweiterbar über JSON"}
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy and Operation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {language === "ar" && "الخصوصية والتشغيل"}
              {language === "en" && "Privacy and Operation"}
              {language === "de" && "Datenschutz und Betrieb"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-semibold">
                  {language === "ar" && "100% Offline"}
                  {language === "en" && "100% Offline"}
                  {language === "de" && "100% Offline"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" && "لا يرسل أي بيانات خارج الجهاز، كل شيء محلي في localStorage"}
                  {language === "en" && "No data sent outside the device, everything stored locally in localStorage"}
                  {language === "de" &&
                    "Keine Daten werden außerhalb des Geräts gesendet, alles wird lokal in localStorage gespeichert"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-semibold">
                  {language === "ar" && "متوافق مع المتصفحات الحديثة"}
                  {language === "en" && "Modern Browser Compatible"}
                  {language === "de" && "Kompatibel mit modernen Browsern"}
                </p>
                <p className="text-sm text-muted-foreground">Chrome, Edge, Firefox, Safari</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-semibold">
                  {language === "ar" && "خفيف على الموارد"}
                  {language === "en" && "Lightweight"}
                  {language === "de" && "Leichtgewichtig"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" && "يعمل على أجهزة الحاسوب القديمة"}
                  {language === "en" && "Works on older computers"}
                  {language === "de" && "Funktioniert auf älteren Computern"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limitations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {language === "ar" && "القيود والتحديات الحالية"}
              {language === "en" && "Current Limitations and Challenges"}
              {language === "de" && "Aktuelle Einschränkungen und Herausforderungen"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                • {language === "ar" && "لا يدعم المسح الآلي للشبكة (Network Scanning) حالياً"}
                {language === "en" && "No automated network scanning currently"}
                {language === "de" && "Derzeit kein automatisiertes Netzwerk-Scanning"}
              </li>
              <li>
                • {language === "ar" && "قاعدة البيانات تحتاج تحديثات يدوية"}
                {language === "en" && "Database requires manual updates"}
                {language === "de" && "Datenbank erfordert manuelle Updates"}
              </li>
              <li>
                • {language === "ar" && "لم يتم اختباره مع مستخدمين حقيقيين بعد"}
                {language === "en" && "Not yet tested with real users"}
                {language === "de" && "Noch nicht mit echten Benutzern getestet"}
              </li>
              <li>
                • {language === "ar" && "لا يتكامل مع SIEM أو SOC حالياً"}
                {language === "en" && "No SIEM or SOC integration currently"}
                {language === "de" && "Derzeit keine SIEM- oder SOC-Integration"}
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Future Development */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              {language === "ar" && "التطوير المستقبلي"}
              {language === "en" && "Future Development"}
              {language === "de" && "Zukünftige Entwicklung"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                ✓ {language === "ar" && "تكامل مع NVD API للتحديثات التلقائية"}
                {language === "en" && "Integration with NVD API for automatic updates"}
                {language === "de" && "Integration mit NVD API für automatische Updates"}
              </li>
              <li>
                ✓ {language === "ar" && "دعم Network Scanning (Nmap integration)"}
                {language === "en" && "Network Scanning support (Nmap integration)"}
                {language === "de" && "Netzwerk-Scanning-Unterstützung (Nmap-Integration)"}
              </li>
              <li>
                ✓ {language === "ar" && "نماذج Machine Learning للتنبؤ بالهجمات"}
                {language === "en" && "Machine Learning models for attack prediction"}
                {language === "de" && "Machine-Learning-Modelle zur Angriffsprognose"}
              </li>
              <li>
                ✓ {language === "ar" && "تكامل مع أنظمة SIEM"}
                {language === "en" && "SIEM integration"}
                {language === "de" && "SIEM-Integration"}
              </li>
              <li>
                ✓ {language === "ar" && "دراسات حالة موثقة"}
                {language === "en" && "Documented case studies"}
                {language === "de" && "Dokumentierte Fallstudien"}
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Version */}
        <Card>
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            <p className="font-semibold mb-2">
              {language === "ar" && "الإصدار الحالي: v1.0.0 (Beta)"}
              {language === "en" && "Current Version: v1.0.0 (Beta)"}
              {language === "de" && "Aktuelle Version: v1.0.0 (Beta)"}
            </p>
            <p>
              {language === "ar" && "تم تطويره بواسطة المهندس أسامة علي"}
              {language === "en" && "Developed by Engineer Osama Ali"}
              {language === "de" && "Entwickelt von Ingenieur Osama Ali"}
            </p>
            <p className="mt-2">
              {language === "ar" && "مشروع تخرج - هندسة صناعية - جامعة في تركيا"}
              {language === "en" && "Graduation Project - Industrial Engineering - University in Turkey"}
              {language === "de" && "Abschlussprojekt - Wirtschaftsingenieurwesen - Universität in der Türkei"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
