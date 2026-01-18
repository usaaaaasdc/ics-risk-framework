"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { SystemConfig, RiskAssessment } from "@/lib/risk-engine"
import {
  performSTRIDEAnalysis,
  generateAttackTree,
  checkIEC62443Compliance,
  checkNISTCompliance,
  type AttackTreeNode,
} from "@/lib/advanced-analysis"
import { AlertTriangle, Shield, CheckCircle2, XCircle, ChevronRight, ChevronDown } from "lucide-react"

interface AdvancedAnalysisTabsProps {
  config: SystemConfig
  assessment: RiskAssessment
}

export function AdvancedAnalysisTabs({ config, assessment }: AdvancedAnalysisTabsProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["root"]))

  const strideAnalysis = performSTRIDEAnalysis(config)
  const attackTree = generateAttackTree(config)
  const iec62443 = checkIEC62443Compliance(config, assessment)
  const nist = checkNISTCompliance(config, assessment)

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }

  const renderAttackTreeNode = (node: AttackTreeNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children && node.children.length > 0
    const riskColor =
      node.likelihood * node.impact >= 50
        ? "text-red-500"
        : node.likelihood * node.impact >= 25
          ? "text-yellow-500"
          : "text-green-500"

    return (
      <div key={node.id} className={`${depth > 0 ? "ml-6 mt-2" : ""}`}>
        <div className="flex items-start gap-2 p-3 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors">
          {hasChildren && (
            <button onClick={() => toggleNode(node.id)} className="mt-1">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          {!hasChildren && <div className="w-4 h-4 mt-1" />}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{node.name}</span>
              <Badge variant="outline" className="text-xs">
                {node.type}
              </Badge>
              <span className={`text-xs font-medium ${riskColor}`}>
                Risk: {Math.round(node.likelihood * node.impact)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Likelihood: {Math.round(node.likelihood * 100)}% | Impact: {node.impact}/10
            </div>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1">{node.children?.map((child) => renderAttackTreeNode(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  const getLikelihoodColor = (level: string) => {
    switch (level) {
      case "High":
        return "text-red-500"
      case "Medium":
        return "text-yellow-500"
      case "Low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case "Pass":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "Fail":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "Partial":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return null
    }
  }

  return (
    <Card className="p-6">
      <Tabs defaultValue="stride" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stride">STRIDE</TabsTrigger>
          <TabsTrigger value="attack-tree">Attack Tree</TabsTrigger>
          <TabsTrigger value="iec62443">IEC 62443</TabsTrigger>
          <TabsTrigger value="nist">NIST CSF</TabsTrigger>
        </TabsList>

        <TabsContent value="stride" className="space-y-4 mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold">STRIDE Threat Model Analysis</h3>
          </div>

          {Object.entries(strideAnalysis).map(([category, threats]) => (
            <div key={category} className="space-y-2">
              <h4 className="font-semibold text-lg capitalize flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {category.replace(/([A-Z])/g, " $1").trim()} ({threats.length})
              </h4>
              {threats.length === 0 ? (
                <p className="text-sm text-muted-foreground ml-7">No significant threats identified</p>
              ) : (
                <div className="space-y-3 ml-7">
                  {threats.map((threat: any, idx: number) => (
                    <Card key={idx} className="p-4 border-l-4 border-l-destructive">
                      <div className="space-y-2">
                        <p className="font-medium">{threat.threat}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            Likelihood:{" "}
                            <span className={`font-medium ${getLikelihoodColor(threat.likelihood)}`}>
                              {threat.likelihood}
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            Impact:{" "}
                            <span className={`font-medium ${getLikelihoodColor(threat.impact)}`}>{threat.impact}</span>
                          </span>
                        </div>
                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm">
                            <span className="font-medium">Mitigation:</span> {threat.mitigation}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="attack-tree" className="mt-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold">Attack Tree Analysis</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Visualization of potential attack paths and their likelihood/impact combinations
          </p>
          <div className="space-y-2">{renderAttackTreeNode(attackTree)}</div>
        </TabsContent>

        <TabsContent value="iec62443" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-xl font-bold">{iec62443.standard}</h3>
                <p className="text-sm text-muted-foreground">Industrial Automation Security Standard</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{iec62443.overallScore}%</div>
              <div className={`text-sm ${iec62443.compliant ? "text-green-500" : "text-red-500"}`}>
                {iec62443.compliant ? "Compliant" : "Non-Compliant"}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {iec62443.requirements.map((req) => (
              <Card key={req.id} className="p-4">
                <div className="flex items-start gap-3">
                  {getComplianceIcon(req.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{req.id}</span>
                      <Badge
                        variant={
                          req.status === "Pass" ? "default" : req.status === "Fail" ? "destructive" : "secondary"
                        }
                      >
                        {req.status}
                      </Badge>
                    </div>
                    <p className="text-sm mb-2">{req.description}</p>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs">
                        <span className="font-medium">Recommendation:</span> {req.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nist" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-xl font-bold">{nist.standard}</h3>
                <p className="text-sm text-muted-foreground">NIST SP 800-82r3 Guidelines</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{nist.overallScore}%</div>
              <div className={`text-sm ${nist.compliant ? "text-green-500" : "text-red-500"}`}>
                {nist.compliant ? "Compliant" : "Needs Improvement"}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {nist.requirements.map((req) => (
              <Card key={req.id} className="p-4">
                <div className="flex items-start gap-3">
                  {getComplianceIcon(req.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{req.id}</span>
                      <Badge
                        variant={
                          req.status === "Pass" ? "default" : req.status === "Fail" ? "destructive" : "secondary"
                        }
                      >
                        {req.status}
                      </Badge>
                    </div>
                    <p className="text-sm mb-2">{req.description}</p>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-xs">
                        <span className="font-medium">Recommendation:</span> {req.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
