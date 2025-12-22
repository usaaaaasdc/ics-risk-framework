"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ProjectManager } from "@/lib/project-manager"
import { TopologyGenerator, type NetworkTopology, type NetworkNode, type NetworkLink } from "@/lib/network-topology"
import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, ZoomIn, ZoomOut, Maximize2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function NetworkTopologyPage() {
  const { language } = useLanguage()
  const [topology, setTopology] = useState<NetworkTopology | null>(null)
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)
  const [zoom, setZoom] = useState(1)
  const [attackPaths, setAttackPaths] = useState<string[][]>([])
  const [showAttackPaths, setShowAttackPaths] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Load latest project or create demo
    const projects = ProjectManager.getAllProjects()
    const latestProject = projects[projects.length - 1]

    if (latestProject) {
      const topo = TopologyGenerator.generateFromProject(latestProject)
      const layoutTopo = TopologyGenerator.calculateLayout(topo)
      setTopology(layoutTopo)

      const paths = TopologyGenerator.getAttackPaths(layoutTopo)
      setAttackPaths(paths)
    } else {
      // Create demo topology
      const demoProject = {
        config: {
          devices: [
            { name: "PLC-1", deviceType: "PLC", manufacturer: "Siemens", protocol: "Profinet" },
            { name: "HMI-1", deviceType: "HMI", manufacturer: "Rockwell", protocol: "EtherNet/IP" },
            { name: "Sensor-1", deviceType: "Sensor", manufacturer: "Phoenix", protocol: "Modbus" },
            { name: "SCADA Server", deviceType: "SCADA", manufacturer: "Schneider", protocol: "DNP3" },
          ],
        },
        assessment: {
          riskScore: 6.5,
        },
      }
      const topo = TopologyGenerator.generateFromProject(demoProject)
      const layoutTopo = TopologyGenerator.calculateLayout(topo)
      setTopology(layoutTopo)

      const paths = TopologyGenerator.getAttackPaths(layoutTopo)
      setAttackPaths(paths)
    }
  }, [])

  const getRiskColor = (risk: number) => {
    if (risk >= 7) return "#ef4444" // red
    if (risk >= 4) return "#f59e0b" // orange
    return "#22c55e" // green
  }

  const getNodeColor = (node: NetworkNode) => {
    if (node.type === "external") return "#dc2626"
    if (node.type === "gateway") return "#3b82f6"
    if (node.type === "zone") return "#8b5cf6"
    return getRiskColor(node.risk)
  }

  const handleNodeClick = (node: NetworkNode) => {
    setSelectedNode(node)
  }

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.2, 3))
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.2, 0.5))
  const handleReset = () => setZoom(1)

  const exportSVG = () => {
    if (!svgRef.current) return
    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const blob = new Blob([svgData], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `network-topology-${Date.now()}.svg`
    link.click()
    URL.revokeObjectURL(url)
  }

  const isNodeInAttackPath = (nodeId: string) => {
    if (!showAttackPaths) return false
    return attackPaths.some((path) => path.includes(nodeId))
  }

  const isLinkInAttackPath = (link: NetworkLink) => {
    if (!showAttackPaths) return false
    return attackPaths.some((path) => {
      for (let i = 0; i < path.length - 1; i++) {
        if (
          (path[i] === link.source && path[i + 1] === link.target) ||
          (path[i] === link.target && path[i + 1] === link.source)
        ) {
          return true
        }
      }
      return false
    })
  }

  if (!topology) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            {language === "ar" && "جاري تحميل خريطة الشبكة..."}
            {language === "en" && "Loading network topology..."}
            {language === "de" && "Netzwerktopologie wird geladen..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">
                {language === "ar" && "خريطة طبولوجيا الشبكة"}
                {language === "en" && "Network Topology Map"}
                {language === "de" && "Netzwerktopologie-Karte"}
              </h1>
              <p className="text-muted-foreground">
                {language === "ar" && "تصور تفاعلي لبنية الشبكة ومسارات الهجوم المحتملة"}
                {language === "en" && "Interactive visualization of network architecture and potential attack paths"}
                {language === "de" &&
                  "Interaktive Visualisierung der Netzwerkarchitektur und potenzieller Angriffspfade"}
              </p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Topology Visualization */}
          <Card className="lg:col-span-3 p-6">
            {/* Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant={showAttackPaths ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowAttackPaths(!showAttackPaths)}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {language === "ar" && "مسارات الهجوم"}
                  {language === "en" && "Attack Paths"}
                  {language === "de" && "Angriffspfade"}
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={exportSVG}>
                <Download className="w-4 h-4 mr-2" />
                {language === "ar" && "تصدير SVG"}
                {language === "en" && "Export SVG"}
                {language === "de" && "SVG exportieren"}
              </Button>
            </div>

            {/* SVG Canvas */}
            <div className="border rounded-lg bg-muted/20 overflow-hidden" style={{ height: "600px" }}>
              <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox="0 0 800 600"
                className="cursor-move"
                style={{ transform: `scale(${zoom})`, transformOrigin: "center", transition: "transform 0.2s" }}
              >
                {/* Zone backgrounds */}
                {topology.zones.map((zone, index) => (
                  <rect
                    key={zone.id}
                    x="0"
                    y={index * (600 / topology.zones.length)}
                    width="800"
                    height={600 / topology.zones.length}
                    fill={index % 2 === 0 ? "#f8fafc" : "#f1f5f9"}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                ))}

                {/* Zone labels */}
                {topology.zones.map((zone, index) => (
                  <text
                    key={`label-${zone.id}`}
                    x="10"
                    y={index * (600 / topology.zones.length) + 20}
                    fontSize="12"
                    fill="#64748b"
                    fontWeight="600"
                  >
                    {zone.name}
                  </text>
                ))}

                {/* Links */}
                {topology.links.map((link, index) => {
                  const sourceNode = topology.nodes.find((n) => n.id === link.source)
                  const targetNode = topology.nodes.find((n) => n.id === link.target)
                  if (!sourceNode || !targetNode) return null

                  const inAttackPath = isLinkInAttackPath(link)

                  return (
                    <g key={`link-${index}`}>
                      <line
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={inAttackPath ? "#ef4444" : link.encrypted ? "#22c55e" : "#cbd5e1"}
                        strokeWidth={inAttackPath ? "3" : "2"}
                        strokeDasharray={link.encrypted ? "5,5" : "none"}
                        opacity={inAttackPath ? 1 : 0.6}
                      />
                      {link.protocol && (
                        <text
                          x={(sourceNode.x! + targetNode.x!) / 2}
                          y={(sourceNode.y! + targetNode.y!) / 2 - 5}
                          fontSize="10"
                          fill="#64748b"
                          textAnchor="middle"
                        >
                          {link.protocol}
                        </text>
                      )}
                    </g>
                  )
                })}

                {/* Nodes */}
                {topology.nodes.map((node) => {
                  const inAttackPath = isNodeInAttackPath(node.id)
                  const nodeColor = getNodeColor(node)

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={() => handleNodeClick(node)}
                      className="cursor-pointer"
                    >
                      <circle
                        r={node.type === "external" ? 25 : node.type === "gateway" ? 20 : 15}
                        fill={nodeColor}
                        stroke={inAttackPath ? "#ef4444" : selectedNode?.id === node.id ? "#3b82f6" : "#fff"}
                        strokeWidth={inAttackPath ? "4" : selectedNode?.id === node.id ? "3" : "2"}
                        opacity={node.type === "external" ? 0.8 : 1}
                      />
                      <text y="35" fontSize="11" fill="#1e293b" textAnchor="middle" fontWeight="500">
                        {node.label}
                      </text>
                      {node.type === "device" && (
                        <text y="48" fontSize="9" fill="#64748b" textAnchor="middle">
                          {node.manufacturer}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#dc2626]" />
                <span className="text-muted-foreground">
                  {language === "ar" && "خارجي"}
                  {language === "en" && "External"}
                  {language === "de" && "Extern"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#3b82f6]" />
                <span className="text-muted-foreground">
                  {language === "ar" && "بوابة"}
                  {language === "en" && "Gateway"}
                  {language === "de" && "Gateway"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#22c55e]" />
                <span className="text-muted-foreground">
                  {language === "ar" && "مخاطر منخفضة"}
                  {language === "en" && "Low Risk"}
                  {language === "de" && "Geringes Risiko"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#f59e0b]" />
                <span className="text-muted-foreground">
                  {language === "ar" && "مخاطر متوسطة"}
                  {language === "en" && "Medium Risk"}
                  {language === "de" && "Mittleres Risiko"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#ef4444]" />
                <span className="text-muted-foreground">
                  {language === "ar" && "مخاطر عالية"}
                  {language === "en" && "High Risk"}
                  {language === "de" && "Hohes Risiko"}
                </span>
              </div>
            </div>
          </Card>

          {/* Info Panel */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">
              {language === "ar" && "معلومات"}
              {language === "en" && "Information"}
              {language === "de" && "Informationen"}
            </h3>

            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {language === "ar" && "العقدة"}
                    {language === "en" && "Node"}
                    {language === "de" && "Knoten"}
                  </div>
                  <div className="font-semibold">{selectedNode.label}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {language === "ar" && "النوع"}
                    {language === "en" && "Type"}
                    {language === "de" && "Typ"}
                  </div>
                  <Badge variant="outline">{selectedNode.type}</Badge>
                </div>

                {selectedNode.manufacturer && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {language === "ar" && "المصنع"}
                      {language === "en" && "Manufacturer"}
                      {language === "de" && "Hersteller"}
                    </div>
                    <div>{selectedNode.manufacturer}</div>
                  </div>
                )}

                {selectedNode.protocol && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {language === "ar" && "البروتوكول"}
                      {language === "en" && "Protocol"}
                      {language === "de" && "Protokoll"}
                    </div>
                    <div>{selectedNode.protocol}</div>
                  </div>
                )}

                {selectedNode.type === "device" && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {language === "ar" && "درجة المخاطر"}
                      {language === "en" && "Risk Score"}
                      {language === "de" && "Risikobewertung"}
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getRiskColor(selectedNode.risk) }}
                      />
                      <span className="font-semibold">{selectedNode.risk.toFixed(1)}/10</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                {language === "ar" && "انقر على أي عقدة لعرض التفاصيل"}
                {language === "en" && "Click on any node to view details"}
                {language === "de" && "Klicken Sie auf einen Knoten, um Details anzuzeigen"}
              </div>
            )}

            {/* Statistics */}
            <div className="mt-6 pt-6 border-t space-y-3">
              <h4 className="font-semibold text-sm">
                {language === "ar" && "إحصائيات"}
                {language === "en" && "Statistics"}
                {language === "de" && "Statistik"}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === "ar" && "عدد الأجهزة"}
                    {language === "en" && "Total Devices"}
                    {language === "de" && "Gesamtgeräte"}
                  </span>
                  <span className="font-semibold">{topology.nodes.filter((n) => n.type === "device").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === "ar" && "عدد الروابط"}
                    {language === "en" && "Total Links"}
                    {language === "de" && "Gesamtverbindungen"}
                  </span>
                  <span className="font-semibold">{topology.links.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === "ar" && "مسارات الهجوم"}
                    {language === "en" && "Attack Paths"}
                    {language === "de" && "Angriffspfade"}
                  </span>
                  <span className="font-semibold text-destructive">{attackPaths.length}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
