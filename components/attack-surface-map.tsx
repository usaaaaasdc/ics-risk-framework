"use client"

import { Card } from "@/components/ui/card"
import { AlertTriangle, Globe, Network, Shield, Wifi } from "lucide-react"
import type { SystemConfig } from "@/lib/risk-engine"

interface AttackSurfaceMapProps {
  config: SystemConfig
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
}

export function AttackSurfaceMap({ config, riskLevel }: AttackSurfaceMapProps) {
  const getRiskColor = () => {
    switch (riskLevel) {
      case "LOW":
        return "text-green-500"
      case "MEDIUM":
        return "text-yellow-500"
      case "HIGH":
        return "text-orange-500"
      case "CRITICAL":
        return "text-red-500"
    }
  }

  const criticalPoints = []

  if (config.internetConnected) {
    criticalPoints.push({
      icon: Globe,
      label: "Internet Exposure",
      label_ar: "التعرض للإنترنت",
      severity: "CRITICAL",
      color: "text-red-500",
    })
  }

  if (config.connectedToIT) {
    criticalPoints.push({
      icon: Network,
      label: "IT Network Connection",
      label_ar: "الاتصال بشبكة IT",
      severity: "HIGH",
      color: "text-orange-500",
    })
  }

  if (config.isLegacy) {
    criticalPoints.push({
      icon: AlertTriangle,
      label: "Legacy Device",
      label_ar: "جهاز قديم",
      severity: "HIGH",
      color: "text-orange-500",
    })
  }

  if (config.interfaces.some((i) => i.includes("Wireless"))) {
    criticalPoints.push({
      icon: Wifi,
      label: "Wireless Interface",
      label_ar: "واجهة لاسلكية",
      severity: "MEDIUM",
      color: "text-yellow-500",
    })
  }

  config.protocols.forEach((protocol) => {
    criticalPoints.push({
      icon: Shield,
      label: `${protocol} Protocol`,
      label_ar: `بروتوكول ${protocol}`,
      severity: "MEDIUM",
      color: "text-blue-500",
    })
  })

  return (
    <Card className="p-6 border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">خريطة سطح الهجوم (Attack Surface Map)</h3>
          <div className={`text-sm font-semibold ${getRiskColor()}`}>Exposure: {riskLevel}</div>
        </div>

        <div className="relative">
          {/* Central Device */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-lg bg-primary/20 border-2 border-primary flex flex-col items-center justify-center">
                <Shield className="w-12 h-12 text-primary mb-2" />
                <div className="text-xs font-semibold text-center">{config.deviceType}</div>
                <div className="text-xs text-muted-foreground text-center">{config.model}</div>
              </div>
              {/* Risk indicator ring */}
              <div
                className={`absolute -inset-2 rounded-lg border-4 ${
                  riskLevel === "CRITICAL"
                    ? "border-red-500 animate-pulse"
                    : riskLevel === "HIGH"
                      ? "border-orange-500"
                      : riskLevel === "MEDIUM"
                        ? "border-yellow-500"
                        : "border-green-500"
                }`}
              />
            </div>
          </div>

          {/* Attack Vectors */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {criticalPoints.map((point, idx) => (
              <div
                key={idx}
                className="relative p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <point.icon className={`w-5 h-5 mt-1 ${point.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{point.label}</div>
                    <div className="text-xs text-muted-foreground truncate">{point.label_ar}</div>
                    <div className={`text-xs font-semibold mt-1 ${point.color}`}>{point.severity}</div>
                  </div>
                </div>
                {/* Connection line visualization */}
                <div className="absolute bottom-0 left-1/2 w-px h-2 bg-border" />
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{criticalPoints.length}</div>
                <div className="text-xs text-muted-foreground">Attack Vectors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{config.protocols.length}</div>
                <div className="text-xs text-muted-foreground">Active Protocols</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{config.interfaces.length}</div>
                <div className="text-xs text-muted-foreground">Interfaces</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
