"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

interface SmartTipProps {
  tip: string
  variant?: "info" | "warning" | "success"
}

export function SmartTip({ tip, variant = "info" }: SmartTipProps) {
  const colors = {
    info: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
    warning: "from-yellow-500/10 to-orange-500/10 border-yellow-500/20",
    success: "from-green-500/10 to-emerald-500/10 border-green-500/20",
  }

  return (
    <Card className={`bg-gradient-to-r ${colors[variant]} border`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-300 leading-relaxed">{tip}</p>
        </div>
      </CardContent>
    </Card>
  )
}
