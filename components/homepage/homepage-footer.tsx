"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import Link from "next/link"

export function HomepageFooter() {
  const { language } = useLanguage()

  return (
    <footer className="border-t bg-background/50 backdrop-blur-sm mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-start">
          <div>
            <h4 className="font-semibold mb-4">
              {language === "ar" && "ابدأ الآن"}
              {language === "en" && "Get Started"}
              {language === "de" && "Loslegen"}
            </h4>
            <div className="space-y-2">
              <Link href="/assessment" className="block text-muted-foreground hover:text-foreground transition-colors">
                {language === "ar" && "تقييم كامل"}
                {language === "en" && "Full Assessment"}
                {language === "de" && "Vollständige Bewertung"}
              </Link>
              <Link href="/simple-mode" className="block text-muted-foreground hover:text-foreground transition-colors">
                {language === "ar" && "وضع مبسط"}
                {language === "en" && "Simple Mode"}
                {language === "de" && "Einfacher Modus"}
              </Link>
              <Link href="/examples" className="block text-muted-foreground hover:text-foreground transition-colors">
                {language === "ar" && "أمثلة جاهزة"}
                {language === "en" && "Examples"}
                {language === "de" && "Beispiele"}
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">
              {language === "ar" && "التوثيق"}
              {language === "en" && "Documentation"}
              {language === "de" && "Dokumentation"}
            </h4>
            <div className="space-y-2">
              <Link href="/user-guide" className="block text-muted-foreground hover:text-foreground transition-colors">
                {language === "ar" && "دليل المستخدم"}
                {language === "en" && "User Guide"}
                {language === "de" && "Benutzerhandbuch"}
              </Link>
              <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">
                {language === "ar" && "عن المشروع"}
                {language === "en" && "About"}
                {language === "de" && "Über"}
              </Link>
              <Link href="/citation" className="block text-muted-foreground hover:text-foreground transition-colors">
                {language === "ar" && "كيفية الاستشهاد"}
                {language === "en" && "How to Cite"}
                {language === "de" && "Zitieren"}
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">
              {language === "ar" && "الترخيص"}
              {language === "en" && "License"}
              {language === "de" && "Lizenz"}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              {language === "ar" && "مفتوح المصدر بترخيص MIT"}
              {language === "en" && "Open Source under MIT License"}
              {language === "de" && "Open Source unter MIT-Lizenz"}
            </p>
            <p className="text-sm text-muted-foreground">© 2025 Osama Ali</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
