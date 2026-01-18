"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ProjectManager } from "@/lib/project-manager"
import { RiskPropagationEngine, type RiskGraph, type RiskNode, type RiskEdge } from "@/lib/risk-propagation"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, RotateCcw, Zap, Shield } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function DigitalTwinPage() {
  const { language } = useLanguage()
  const [graph, setGraph] = useState<RiskGraph | null>(null)
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [selectedNode, setSelectedNode] = useState<RiskNode | null>(null)
  const [attackPaths, setAttackPaths] = useState<string[][]>([])
  const [resilience, setResilience] = useState(0)

  useEffect(() => {
    loadGraphFromProject()
  }, [])

  const loadGraphFromProject = () => {
    const projects = ProjectManager.getAllProjects()
    const latestProject = projects[projects.length - 1]

    if (latestProject && latestProject.config.devices) {
      const riskGraph = convertProjectToGraph(latestProject)
      setGraph(riskGraph)

      const paths = RiskPropagationEngine.findAttackPaths(riskGraph)
      setAttackPaths(paths)

      const res = RiskPropagationEngine.calculateNetworkResilience(riskGraph)
      setResilience(res)
    } else {
      setGraph(createDemoGraph())
      const paths = RiskPropagationEngine.findAttackPaths(createDemoGraph())
      setAttackPaths(paths)
      setResilience(65)
    }
  }

  const convertProjectToGraph = (project: any): RiskGraph => {
    const nodes: RiskNode[] = []
    const edges: RiskEdge[] = []
    const zones = ["Enterprise", "DMZ", "Control", "Field"]

    // Add external node
    nodes.push({
      id: "external",
      type: "External",
      vendor: "Internet",
      model: "External Network",
      protocols: [],
      riskScore: 10,
      position: { x: 100, y: 300 },
      zone: "External",
      internetFacing: true,
    })

    // Convert project devices to nodes
    project.config.devices.forEach((device: any, index: number) => {
      const zoneIndex = index % 4
      nodes.push({
        id: `device-${index}`,
        type: device.deviceType as any,
        vendor: device.manufacturer,
        model: device.model || device.deviceType,
        protocols: [device.protocol],
        riskScore: (project.assessment?.riskScore || 5) + (Math.random() * 2 - 1),
        position: {
          x: 250 + zoneIndex * 150,
          y: 150 + ((index * 80) % 400),
        },
        zone: zones[zoneIndex],
        internetFacing: zoneIndex <= 1,
      })

      // Create edges
      if (index > 0) {
        edges.push({
          id: `edge-${index}`,
          source: nodes[index].id,
          target: nodes[index - 1].id,
          protocol: device.protocol,
          encrypted: Math.random() > 0.5,
          bidirectional: true,
        })
      }
    })

    // Connect external to first device
    if (nodes.length > 1) {
      edges.push({
        id: "edge-external",
        source: "external",
        target: nodes[1].id,
        protocol: "TCP/IP",
        encrypted: false,
        bidirectional: true,
      })
    }

    return { nodes, edges, zones }
  }

  const createDemoGraph = (): RiskGraph => {
    return {
      nodes: [
        {
          id: "external",
          type: "External",
          vendor: "Internet",
          model: "External Network",
          protocols: [],
          riskScore: 10,
          position: { x: 100, y: 300 },
          zone: "External",
          internetFacing: true,
        },
        {
          id: "firewall",
          type: "Gateway",
          vendor: "Cisco",
          model: "ASA 5516",
          protocols: ["TCP/IP"],
          riskScore: 3.5,
          position: { x: 250, y: 300 },
          zone: "DMZ",
          internetFacing: true,
        },
        {
          id: "hmi",
          type: "HMI",
          vendor: "Siemens",
          model: "WinCC",
          protocols: ["Profinet", "OPC-UA"],
          riskScore: 6.8,
          position: { x: 400, y: 200 },
          zone: "Control",
          internetFacing: false,
        },
        {
          id: "plc1",
          type: "PLC",
          vendor: "Siemens",
          model: "S7-1500",
          protocols: ["Profinet"],
          riskScore: 7.2,
          position: { x: 550, y: 150 },
          zone: "Control",
          internetFacing: false,
        },
        {
          id: "plc2",
          type: "PLC",
          vendor: "Rockwell",
          model: "ControlLogix",
          protocols: ["EtherNet/IP"],
          riskScore: 6.5,
          position: { x: 550, y: 350 },
          zone: "Field",
          internetFacing: false,
        },
        {
          id: "sensor",
          type: "Sensor",
          vendor: "Phoenix",
          model: "ILC 150",
          protocols: ["Modbus"],
          riskScore: 5.0,
          position: { x: 700, y: 250 },
          zone: "Field",
          internetFacing: false,
        },
      ],
      edges: [
        { id: "e1", source: "external", target: "firewall", protocol: "TCP/IP", encrypted: true, bidirectional: true },
        { id: "e2", source: "firewall", target: "hmi", protocol: "OPC-UA", encrypted: false, bidirectional: true },
        { id: "e3", source: "hmi", target: "plc1", protocol: "Profinet", encrypted: false, bidirectional: true },
        { id: "e4", source: "hmi", target: "plc2", protocol: "EtherNet/IP", encrypted: false, bidirectional: true },
        { id: "e5", source: "plc2", target: "sensor", protocol: "Modbus", encrypted: false, bidirectional: true },
      ],
      zones: ["External", "DMZ", "Control", "Field"],
    }
  }

  const simulateAttack = () => {
    if (!graph) return

    setSimulationRunning(true)

    // Find external node
    const externalNode = graph.nodes.find((n) => n.type === "External")
    if (!externalNode) return

    // Run propagation simulation
    const propagatedGraph = RiskPropagationEngine.calculatePropagation(graph, externalNode.id)
    setGraph(propagatedGraph)

    setTimeout(() => {
      setSimulationRunning(false)
    }, 2000)
  }

  const resetSimulation = () => {
    loadGraphFromProject()
  }

  const getRiskColor = (risk: number) => {
    if (risk >= 7) return "#ef4444"
    if (risk >= 4) return "#f59e0b"
    return "#22c55e"
  }

  const getResilienceColor = (res: number) => {
    if (res >= 70) return "text-green-600"
    if (res >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const translations = {
    ar: {
      title: "التوأم الرقمي للمخاطر",
      subtitle: "محاكاة حية لانتشار التهديدات عبر الشبكة الصناعية",
      simulate: "محاكاة هجوم",
      reset: "إعادة تعيين",
      resilience: "مرونة الشبكة",
      attackPaths: "مسارات الهجوم المكتشفة",
      compromised: "تم اختراقه",
      safe: "آمن",
      nodeDetails: "تفاصيل العقدة",
      propagationLevel: "مستوى الانتشار",
      riskScore: "درجة المخاطر",
      protocols: "البروتوكولات",
      zone: "المنطقة",
      running: "جاري المحاكاة...",
      criticalAssets: "الأصول الحرجة المعرضة",
    },
    en: {
      title: "Digital Twin of Risk",
      subtitle: "Live simulation of threat propagation across industrial network",
      simulate: "Simulate Attack",
      reset: "Reset",
      resilience: "Network Resilience",
      attackPaths: "Discovered Attack Paths",
      compromised: "Compromised",
      safe: "Safe",
      nodeDetails: "Node Details",
      propagationLevel: "Propagation Level",
      riskScore: "Risk Score",
      protocols: "Protocols",
      zone: "Zone",
      running: "Simulation running...",
      criticalAssets: "Critical Assets at Risk",
    },
    de: {
      title: "Digitaler Zwilling des Risikos",
      subtitle: "Live-Simulation der Bedrohungsausbreitung im industriellen Netzwerk",
      simulate: "Angriff simulieren",
      reset: "Zurücksetzen",
      resilience: "Netzwerkresilienz",
      attackPaths: "Entdeckte Angriffspfade",
      compromised: "Kompromittiert",
      safe: "Sicher",
      nodeDetails: "Knotendetails",
      propagationLevel: "Ausbreitungsebene",
      riskScore: "Risikobewertung",
      protocols: "Protokolle",
      zone: "Zone",
      running: "Simulation läuft...",
      criticalAssets: "Kritische Assets gefährdet",
    },
  }

  const t = translations[language as 'ar' | 'en' | 'de'] || translations.en

  if (!graph) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  const compromisedCount = graph.nodes.filter((n) => n.compromised).length
  const criticalCompromised = graph.nodes.filter((n) => n.compromised && n.riskScore >= 7).length

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Zap className="w-8 h-8 text-primary" />
                {t.title}
              </h1>
              <p className="text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Canvas */}
          <Card className="lg:col-span-3 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button onClick={simulateAttack} disabled={simulationRunning} className="gap-2">
                  <Play className="w-4 h-4" />
                  {simulationRunning ? t.running : t.simulate}
                </Button>
                <Button variant="outline" onClick={resetSimulation}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t.reset}
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">{t.resilience}: </span>
                  <span className={`font-bold ${getResilienceColor(resilience)}`}>{resilience.toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* SVG Canvas */}
            <div className="border rounded-lg bg-slate-950 overflow-hidden relative" style={{ height: "600px" }}>
              <svg width="100%" height="100%" viewBox="0 0 800 600">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                  </marker>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Zone backgrounds */}
                {graph.zones.map((zone, index) => (
                  <rect
                    key={zone}
                    x="0"
                    y={index * (600 / graph.zones.length)}
                    width="800"
                    height={600 / graph.zones.length}
                    fill={index % 2 === 0 ? "#0f172a" : "#1e293b"}
                    opacity="0.5"
                  />
                ))}

                {/* Zone labels */}
                {graph.zones.map((zone, index) => (
                  <text
                    key={`label-${zone}`}
                    x="20"
                    y={index * (600 / graph.zones.length) + 30}
                    fontSize="14"
                    fill="#94a3b8"
                    fontWeight="600"
                  >
                    {zone}
                  </text>
                ))}

                {/* Edges */}
                {graph.edges.map((edge) => {
                  const sourceNode = graph.nodes.find((n) => n.id === edge.source)
                  const targetNode = graph.nodes.find((n) => n.id === edge.target)
                  if (!sourceNode || !targetNode) return null

                  const bothCompromised = sourceNode.compromised && targetNode.compromised

                  return (
                    <g key={edge.id}>
                      <line
                        x1={sourceNode.position.x}
                        y1={sourceNode.position.y}
                        x2={targetNode.position.x}
                        y2={targetNode.position.y}
                        stroke={bothCompromised ? "#ef4444" : edge.encrypted ? "#22c55e" : "#64748b"}
                        strokeWidth={bothCompromised ? "3" : "2"}
                        strokeDasharray={edge.encrypted ? "5,5" : "none"}
                        markerEnd="url(#arrowhead)"
                        opacity={bothCompromised ? 1 : 0.6}
                        filter={bothCompromised ? "url(#glow)" : "none"}
                      >
                        {bothCompromised && (
                          <animate
                            attributeName="stroke-dasharray"
                            values="0 10;10 0"
                            dur="1s"
                            repeatCount="indefinite"
                          />
                        )}
                      </line>
                      <text
                        x={(sourceNode.position.x + targetNode.position.x) / 2}
                        y={(sourceNode.position.y + targetNode.position.y) / 2 - 10}
                        fontSize="10"
                        fill="#94a3b8"
                        textAnchor="middle"
                      >
                        {edge.protocol}
                      </text>
                    </g>
                  )
                })}

                {/* Nodes */}
                {graph.nodes.map((node) => {
                  const isCompromised = node.compromised
                  const color = isCompromised ? "#ef4444" : getRiskColor(node.riskScore)

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.position.x}, ${node.position.y})`}
                      onClick={() => setSelectedNode(node)}
                      className="cursor-pointer"
                    >
                      <circle
                        r={node.type === "External" ? 30 : node.type === "Gateway" ? 25 : 20}
                        fill={color}
                        stroke={selectedNode?.id === node.id ? "#3b82f6" : "#fff"}
                        strokeWidth={selectedNode?.id === node.id ? "3" : "2"}
                        opacity={isCompromised ? 1 : 0.8}
                        filter={isCompromised ? "url(#glow)" : "none"}
                      >
                        {isCompromised && (
                          <animate
                            attributeName="r"
                            values={`${node.type === "External" ? 30 : 20};${node.type === "External" ? 35 : 25};${node.type === "External" ? 30 : 20}`}
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        )}
                      </circle>

                      {isCompromised && (
                        <text y="-5" fontSize="20" textAnchor="middle">
                          ⚠️
                        </text>
                      )}

                      <text y="40" fontSize="12" fill="#e2e8f0" textAnchor="middle" fontWeight="600">
                        {node.model}
                      </text>
                      <text y="55" fontSize="10" fill="#94a3b8" textAnchor="middle">
                        {node.vendor}
                      </text>
                    </g>
                  )
                })}
              </svg>

              {/* Simulation overlay */}
              {simulationRunning && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4" />
                    <p className="text-white font-semibold">{t.running}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#ef4444]" />
                <span className="text-muted-foreground">{t.compromised}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#22c55e]" />
                <span className="text-muted-foreground">{t.safe}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-[#22c55e]" style={{ borderStyle: "dashed" }} />
                <span className="text-muted-foreground">Encrypted</span>
              </div>
            </div>
          </Card>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Statistics
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">{t.resilience}</div>
                  <Progress value={resilience} className="h-2" />
                  <div className={`text-2xl font-bold mt-1 ${getResilienceColor(resilience)}`}>
                    {resilience.toFixed(0)}%
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.compromised}</span>
                    <span className="font-semibold text-red-600">
                      {compromisedCount}/{graph.nodes.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.criticalAssets}</span>
                    <span className="font-semibold text-orange-600">{criticalCompromised}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.attackPaths}</span>
                    <span className="font-semibold">{attackPaths.length}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Node Details */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">{t.nodeDetails}</h3>

              {selectedNode ? (
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Node</div>
                    <div className="font-semibold">{selectedNode.model}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge variant={selectedNode.compromised ? "destructive" : "default"}>
                      {selectedNode.compromised ? t.compromised : t.safe}
                    </Badge>
                  </div>

                  {selectedNode.compromised && selectedNode.propagationLevel !== undefined && (
                    <div>
                      <div className="text-sm text-muted-foreground">{t.propagationLevel}</div>
                      <div className="font-semibold">Level {selectedNode.propagationLevel}</div>
                    </div>
                  )}

                  <div>
                    <div className="text-sm text-muted-foreground">{t.riskScore}</div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getRiskColor(selectedNode.riskScore) }}
                      />
                      <span className="font-semibold">{selectedNode.riskScore.toFixed(1)}/10</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">{t.zone}</div>
                    <div>{selectedNode.zone}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">{t.protocols}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedNode.protocols.map((p) => (
                        <Badge key={p} variant="outline" className="text-xs">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Click on a node to view details</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
