"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { SystemConfig } from "@/lib/risk-engine"
import { useLanguage } from "@/lib/i18n/language-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"
import { TooltipHelper } from "@/components/tooltip-helper"
import { SmartTip } from "@/components/smart-tip"
import devicesData from "@/lib/data/devices.json"

interface DeviceInputFormProps {
  onSubmit: (config: SystemConfig) => void
  initialConfig?: SystemConfig | null
}

export function DeviceInputForm({ onSubmit, initialConfig }: DeviceInputFormProps) {
  const { t, language } = useLanguage()
  const [deviceType, setDeviceType] = useState(initialConfig?.deviceType || "")
  const [manufacturer, setManufacturer] = useState(initialConfig?.manufacturer || "")
  const [model, setModel] = useState(initialConfig?.model || "")
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>(initialConfig?.protocols || [])
  const [selectedInterfaces, setSelectedInterfaces] = useState<string[]>(initialConfig?.interfaces || [])
  const [internetConnected, setInternetConnected] = useState(initialConfig?.internetConnected || false)
  const [connectedToIT, setConnectedToIT] = useState(initialConfig?.connectedToIT || false)
  const [isLegacy, setIsLegacy] = useState(initialConfig?.isLegacy || false)
  const [osVersion, setOsVersion] = useState(initialConfig?.osVersion || "")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const quickConfig = localStorage.getItem("quick-config")
      if (quickConfig) {
        try {
          const config = JSON.parse(quickConfig)
          setDeviceType(config.deviceType || "")
          setManufacturer(config.manufacturer || "")
          setModel(config.model || "")
          setSelectedProtocols(config.protocols || [])
          setSelectedInterfaces(config.interfaces || [])
          setInternetConnected(config.internetConnected || false)
          setConnectedToIT(config.connectedToIT || false)
          setIsLegacy(config.isLegacy || false)
          setOsVersion(config.osVersion || "")
          localStorage.removeItem("quick-config")
        } catch (e) {
          console.error("Failed to load quick config:", e)
        }
      }
    }

    if (initialConfig) {
      setDeviceType(initialConfig.deviceType || "")
      setManufacturer(initialConfig.manufacturer || "")
      setModel(initialConfig.model || "")
      setSelectedProtocols(initialConfig.protocols || [])
      setSelectedInterfaces(initialConfig.interfaces || [])
      setInternetConnected(initialConfig.internetConnected || false)
      setConnectedToIT(initialConfig.connectedToIT || false)
      setIsLegacy(initialConfig.isLegacy || false)
      setOsVersion(initialConfig.osVersion || "")
    }
  }, [initialConfig])

  const deviceTypes = [...new Set(devicesData.devices.map((d) => d.type))]
  const manufacturers = deviceType
    ? [...new Set(devicesData.devices.filter((d) => d.type === deviceType).map((d) => d.manufacturer))]
    : []
  const models = manufacturer ? devicesData.devices.find((d) => d.manufacturer === manufacturer)?.models || [] : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!deviceType || !manufacturer || !model) {
      setError(
        language === "ar"
          ? "الرجاء إكمال جميع الحقول المطلوبة"
          : language === "de"
            ? "Bitte füllen Sie alle erforderlichen Felder aus"
            : "Please complete all required fields",
      )
      return
    }

    if (selectedProtocols.length === 0) {
      setError(
        language === "ar"
          ? "الرجاء اختيار بروتوكول واحد على الأقل"
          : language === "de"
            ? "Bitte wählen Sie mindestens ein Protokoll"
            : "Please select at least one protocol",
      )
      return
    }

    setIsLoading(true)

    try {
      const config: SystemConfig = {
        deviceType,
        manufacturer,
        model,
        protocols: selectedProtocols,
        interfaces: selectedInterfaces,
        internetConnected,
        connectedToIT,
        osVersion,
        isLegacy,
      }

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 500))
      onSubmit(config)
    } catch (err) {
      setError(
        language === "ar"
          ? "حدث خطأ أثناء التحليل"
          : language === "de"
            ? "Fehler bei der Analyse"
            : "An error occurred during analysis",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const toggleProtocol = (protocol: string) => {
    setSelectedProtocols((prev) => (prev.includes(protocol) ? prev.filter((p) => p !== protocol) : [...prev, protocol]))
  }

  const toggleInterface = (iface: string) => {
    setSelectedInterfaces((prev) => (prev.includes(iface) ? prev.filter((i) => i !== iface) : [...prev, iface]))
  }

  const getSmartTip = () => {
    if (manufacturer === "Siemens") {
      return language === "ar"
        ? "💡 هل تعلم؟ 70% من ثغرات Siemens S7 تأتي عبر واجهة HTTP. ننصح بتعطيلها إذا لم تكن مستخدمة."
        : language === "de"
          ? "💡 Wussten Sie? 70% der Siemens S7-Schwachstellen kommen über die HTTP-Schnittstelle. Deaktivieren Sie diese, wenn sie nicht verwendet wird."
          : "💡 Did you know? 70% of Siemens S7 vulnerabilities come through the HTTP interface. Disable it if not in use."
    }

    if (deviceType === "HMI") {
      return language === "ar"
        ? "💡 أجهزة HMI غالباً ما تكون نقطة الدخول الأولى للمهاجمين. تأكد من تحديث البرامج الثابتة بانتظام."
        : language === "de"
          ? "💡 HMI-Geräte sind oft der erste Einstiegspunkt für Angreifer. Stellen Sie sicher, dass die Firmware regelmäßig aktualisiert wird."
          : "💡 HMI devices are often the first entry point for attackers. Ensure firmware is regularly updated."
    }

    if (internetConnected) {
      return language === "ar"
        ? "⚠️ تحذير: الأجهزة المتصلة بالإنترنت معرضة لخطر أكبر بـ 5 مرات. استخدم VPN أو جدار ناري صناعي."
        : language === "de"
          ? "⚠️ Warnung: Internetverbundene Geräte haben ein 5-fach höheres Risiko. Verwenden Sie VPN oder eine industrielle Firewall."
          : "⚠️ Warning: Internet-connected devices have 5x higher risk. Use VPN or industrial firewall."
    }

    return language === "ar"
      ? "💡 نصيحة: ابدأ باختيار نوع الجهاز والشركة المصنعة للحصول على تقييم دقيق."
      : language === "de"
        ? "💡 Tipp: Beginnen Sie mit der Auswahl des Gerätetyps und des Herstellers für eine genaue Bewertung."
        : "💡 Tip: Start by selecting the device type and manufacturer for an accurate assessment."
  }

  if (isLoading) {
    return (
      <Card className="p-6 border-primary/20">
        <LoadingSpinner
          message={
            language === "ar"
              ? "جارٍ تحليل النظام..."
              : language === "de"
                ? "System wird analysiert..."
                : "Analyzing system..."
          }
        />
      </Card>
    )
  }

  return (
    <Card className="p-6 border-primary/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <ErrorMessage message={error} type="warning" onRetry={() => setError(null)} />}

        <SmartTip tip={getSmartTip()} variant={internetConnected ? "warning" : "info"} />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="deviceType" className="text-lg font-semibold">
              {t("deviceType")}
            </Label>
            <TooltipHelper
              content={
                language === "ar"
                  ? "نوع جهاز التحكم الصناعي (PLC، HMI، RTU، أو DCS)"
                  : language === "de"
                    ? "Typ des industriellen Steuergeräts (PLC, HMI, RTU oder DCS)"
                    : "Type of industrial control device (PLC, HMI, RTU, or DCS)"
              }
            />
          </div>
          <Select value={deviceType} onValueChange={setDeviceType}>
            <SelectTrigger id="deviceType">
              <SelectValue placeholder={t("selectDevice")} />
            </SelectTrigger>
            <SelectContent>
              {deviceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="manufacturer" className="text-lg font-semibold">
            {t("manufacturer")}
          </Label>
          <Select value={manufacturer} onValueChange={setManufacturer} disabled={!deviceType}>
            <SelectTrigger id="manufacturer">
              <SelectValue placeholder={t("selectManufacturer")} />
            </SelectTrigger>
            <SelectContent>
              {manufacturers.map((mfg) => (
                <SelectItem key={mfg} value={mfg}>
                  {mfg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model" className="text-lg font-semibold">
            {t("model")}
          </Label>
          <Select value={model} onValueChange={setModel} disabled={!manufacturer}>
            <SelectTrigger id="model">
              <SelectValue placeholder={t("selectModel")} />
            </SelectTrigger>
            <SelectContent>
              {models.map((mdl) => (
                <SelectItem key={mdl} value={mdl}>
                  {mdl}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-lg font-semibold">{t("activeProtocols")}</Label>
            <TooltipHelper
              content={
                language === "ar"
                  ? "البروتوكولات الصناعية النشطة على الجهاز"
                  : language === "de"
                    ? "Aktive industrielle Protokolle auf dem Gerät"
                    : "Active industrial protocols on the device"
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {devicesData.protocols.map((protocol) => (
              <div key={protocol} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={`protocol-${protocol}`}
                  checked={selectedProtocols.includes(protocol)}
                  onCheckedChange={() => toggleProtocol(protocol)}
                />
                <Label htmlFor={`protocol-${protocol}`} className="text-sm cursor-pointer">
                  {protocol}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-lg font-semibold">{t("interfaces")}</Label>
          <div className="grid grid-cols-2 gap-3">
            {devicesData.interfaces.map((iface) => (
              <div key={iface} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={`interface-${iface}`}
                  checked={selectedInterfaces.includes(iface)}
                  onCheckedChange={() => toggleInterface(iface)}
                />
                <Label htmlFor={`interface-${iface}`} className="text-sm cursor-pointer">
                  {iface}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="osVersion" className="text-lg font-semibold">
              {t("osVersion")}
            </Label>
            <TooltipHelper
              content={
                language === "ar"
                  ? "إصدار نظام التشغيل أو البرنامج الثابت (اختياري)"
                  : language === "de"
                    ? "Betriebssystem- oder Firmware-Version (optional)"
                    : "Operating system or firmware version (optional)"
              }
            />
          </div>
          <Input
            id="osVersion"
            value={osVersion}
            onChange={(e) => setOsVersion(e.target.value)}
            placeholder={t("osPlaceholder")}
          />
        </div>

        <div className="space-y-4 border-t border-border pt-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Checkbox
              id="internetConnected"
              checked={internetConnected}
              onCheckedChange={(checked) => setInternetConnected(checked as boolean)}
            />
            <Label htmlFor="internetConnected" className="cursor-pointer flex items-center gap-2">
              {t("internetConnected")}
              <TooltipHelper
                content={
                  language === "ar"
                    ? "هل الجهاز متصل مباشرة بالإنترنت؟"
                    : language === "de"
                      ? "Ist das Gerät direkt mit dem Internet verbunden?"
                      : "Is the device directly connected to the internet?"
                }
              />
            </Label>
          </div>

          <div className="flex items-center space-x-3 space-x-reverse">
            <Checkbox
              id="connectedToIT"
              checked={connectedToIT}
              onCheckedChange={(checked) => setConnectedToIT(checked as boolean)}
            />
            <Label htmlFor="connectedToIT" className="cursor-pointer flex items-center gap-2">
              {t("connectedToIT")}
              <TooltipHelper
                content={
                  language === "ar"
                    ? "هل الجهاز متصل بشبكة IT الخاصة بالشركة؟"
                    : language === "de"
                      ? "Ist das Gerät mit dem Unternehmens-IT-Netzwerk verbunden?"
                      : "Is the device connected to the corporate IT network?"
                }
              />
            </Label>
          </div>

          <div className="flex items-center space-x-3 space-x-reverse">
            <Checkbox id="isLegacy" checked={isLegacy} onCheckedChange={(checked) => setIsLegacy(checked as boolean)} />
            <Label htmlFor="isLegacy" className="cursor-pointer flex items-center gap-2">
              {t("legacyDevice")}
              <TooltipHelper
                content={
                  language === "ar"
                    ? "جهاز قديم لم يعد مدعومًا من الشركة المصنعة"
                    : language === "de"
                      ? "Legacy-Gerät, das vom Hersteller nicht mehr unterstützt wird"
                      : "Legacy device no longer supported by manufacturer"
                }
              />
            </Label>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full text-lg"
          disabled={!deviceType || !manufacturer || !model || isLoading}
        >
          {t("analyzeBtn")}
        </Button>
      </form>
    </Card>
  )
}
