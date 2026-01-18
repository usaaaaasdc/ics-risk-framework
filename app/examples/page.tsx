/**
 * ICS-Risk Framework
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 */

"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const examples = [
  {
    id: "industry-4-0",
    name: {
      en: "Industry 4.0 Smart Factory",
      ar: "مصنع ذكي (الجيل الرابع)",
      de: "Industrie 4.0 Smart Factory",
    },
    config: {
      deviceType: "IoT Gateway",
      manufacturer: "Siemens",
      model: "SIMATIC IOT2050",
      protocols: ["OPC-UA", "MQTT", "REST API", "AMQP"],
      connectionType: "Ethernet/Cloud",
      internetExposed: true,
      osVersion: "Industrial OS 2.0",
      isLegacy: false,
    },
  },
  {
    id: "steel-mill",
    name: {
      en: "Steel Mill SCADA System",
      ar: "نظام SCADA لمصنع صلب",
      de: "Stahlwerk-SCADA-System",
    },
    config: {
      deviceType: "SCADA System",
      manufacturer: "Siemens",
      model: "SIMATIC S7-1500",
      protocols: ["Profinet", "Modbus TCP", "OPC-UA"],
      connectionType: "Ethernet",
      internetExposed: false,
      osVersion: "TIA Portal V16",
      isLegacy: false,
    },
  },
  {
    id: "water-treatment",
    name: {
      en: "Water Treatment Plant PLC",
      ar: "متحكم منشأة معالجة مياه",
      de: "Wasseraufbereitungsanlage-SPS",
    },
    config: {
      deviceType: "PLC",
      manufacturer: "Allen-Bradley",
      model: "ControlLogix 5580",
      protocols: ["EtherNet/IP", "Modbus TCP"],
      connectionType: "Ethernet",
      internetExposed: false,
      osVersion: "v32.011",
      isLegacy: false,
    },
  },
  {
    id: "power-grid",
    name: {
      en: "Power Grid RTU",
      ar: "وحدة تحكم عن بعد لشبكة الطاقة",
      de: "Stromnetz-RTU",
    },
    config: {
      deviceType: "RTU",
      manufacturer: "Schneider Electric",
      model: "Easergy T300",
      protocols: ["DNP3", "IEC 61850", "Modbus"],
      connectionType: "Serial",
      internetExposed: false,
      osVersion: "v2.9",
      isLegacy: false,
    },
  },
  {
    id: "legacy-factory",
    name: {
      en: "Legacy Factory Controller",
      ar: "متحكم مصنع قديم",
      de: "Legacy-Fabriksteuerung",
    },
    config: {
      deviceType: "PLC",
      manufacturer: "Siemens",
      model: "S7-300",
      protocols: ["Profibus", "MPI"],
      connectionType: "Serial",
      internetExposed: false,
      osVersion: "STEP 7 V5.5",
      isLegacy: true,
    },
  },
  {
    id: "chinese-manufacturer",
    name: {
      en: "Chinese HMI System",
      ar: "نظام واجهة صيني",
      de: "Chinesisches HMI-System",
    },
    config: {
      deviceType: "HMI",
      manufacturer: "HollySys",
      model: "LM3107",
      protocols: ["Modbus RTU", "Ethernet/IP"],
      connectionType: "Ethernet",
      internetExposed: false,
      osVersion: "v3.2",
      isLegacy: false,
    },
  },
]

export default function ExamplesPage() {
  const { language, translations } = useLanguage()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (config: any, id: string) => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/">
          <Button variant="outline" size="sm" className="mb-6 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {translations.backToHome || "Back to Home"}
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {language === "ar"
              ? "أمثلة ونماذج جاهزة"
              : language === "de"
                ? "Beispiele und Vorlagen"
                : "Examples & Templates"}
          </h1>
          <p className="text-muted-foreground">
            {language === "ar"
              ? "استخدم هذه الأمثلة الجاهزة لتقييم سريع أو كنقطة بداية لتكوينك الخاص"
              : language === "de"
                ? "Verwenden Sie diese vorgefertigten Beispiele für eine schnelle Bewertung oder als Ausgangspunkt"
                : "Use these pre-configured examples for quick assessment or as a starting point"}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {examples.map((example) => (
            <Card key={example.id}>
              <CardHeader>
                <CardTitle>{example.name[language as 'en' | 'ar' | 'de'] || example.name.en}</CardTitle>
                <CardDescription>
                  {example.config.manufacturer} {example.config.model}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>{language === "ar" ? "النوع:" : language === "de" ? "Typ:" : "Type:"}</strong>{" "}
                    {example.config.deviceType}
                  </div>
                  <div>
                    <strong>
                      {language === "ar" ? "البروتوكولات:" : language === "de" ? "Protokolle:" : "Protocols:"}
                    </strong>{" "}
                    {example.config.protocols.join(", ")}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        localStorage.setItem("quick-config", JSON.stringify(example.config))
                        window.location.href = "/"
                      }}
                    >
                      {language === "ar"
                        ? "استخدم هذا المثال"
                        : language === "de"
                          ? "Beispiel verwenden"
                          : "Use This Example"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(example.config, example.id)}>
                      {copiedId === example.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
