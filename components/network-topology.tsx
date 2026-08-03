"use client"

import { useMemo, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Database, Download, Laptop, Radar, ShieldCheck } from "lucide-react"
import { type AttackPathHint } from "@/lib/calculators/pcap-ingestor"

interface NetworkNode {
    id: string
    type: "Attacker" | "Firewall" | "Workstation" | "HMI" | "PLC"
    x: number
    y: number
    label: string
    role: string
    ip: string
    status: "Safe" | "Compromised" | "Warning"
}

interface NetworkEdge {
    from: string
    to: string
    attackPath?: boolean
}

interface NetworkTopologyProps {
    riskScore: number
    simulationState?: "Secure" | "Reconnaissance" | "Exploitation" | "Compromised"
    attackPaths?: AttackPathHint[]
    publicationMode?: boolean
}

function downloadTextFile(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
}

export function NetworkTopology({
    riskScore,
    simulationState = "Secure",
    attackPaths = [],
    publicationMode = false,
}: NetworkTopologyProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const primaryAttackPath = attackPaths[0]

    const nodes: NetworkNode[] = useMemo(() => {
        const isCompromised = simulationState === "Compromised" || riskScore > 8
        const isUnderAttack = simulationState === "Exploitation" || riskScore > 6 || Boolean(primaryAttackPath)
        const attackerIp = primaryAttackPath?.sourceIp ?? "External/Test"
        const targetIp = primaryAttackPath?.targetIp ?? "192.168.1.50"

        return [
            {
                id: "attacker",
                type: "Attacker",
                x: 55,
                y: 70,
                label: "Attacker Host",
                role: "Scanner / Test Host",
                ip: attackerIp,
                status: isUnderAttack ? "Warning" : "Safe",
            },
            { id: "fw", type: "Firewall", x: 175, y: 70, label: "Corp FW", role: "Boundary Control", ip: "10.0.0.1", status: "Safe" },
            {
                id: "ws",
                type: "Workstation",
                x: 300,
                y: 70,
                label: "Eng. Workstation",
                role: "Engineering Station",
                ip: "192.168.1.10",
                status: isUnderAttack ? "Warning" : "Safe",
            },
            {
                id: "target",
                type: "HMI",
                x: 445,
                y: 70,
                label: "ICS Target",
                role: "HMI / Exposed Asset",
                ip: targetIp,
                status: isCompromised ? "Compromised" : isUnderAttack ? "Warning" : "Safe",
            },
            {
                id: "plc1",
                type: "PLC",
                x: 445,
                y: 185,
                label: "PLC-1",
                role: "Controller",
                ip: "192.168.1.20",
                status: isCompromised ? "Compromised" : "Safe",
            },
            {
                id: "plc2",
                type: "PLC",
                x: 300,
                y: 185,
                label: "PLC-2",
                role: "Controller",
                ip: "192.168.1.21",
                status: "Safe",
            },
        ]
    }, [primaryAttackPath, riskScore, simulationState])

    const edges: NetworkEdge[] = useMemo(() => [
        { from: "attacker", to: "fw", attackPath: Boolean(primaryAttackPath) || simulationState !== "Secure" },
        { from: "fw", to: "ws", attackPath: Boolean(primaryAttackPath) || simulationState !== "Secure" },
        { from: "ws", to: "target", attackPath: Boolean(primaryAttackPath) || simulationState !== "Secure" },
        { from: "target", to: "plc1", attackPath: simulationState === "Exploitation" || simulationState === "Compromised" },
        { from: "ws", to: "plc2" },
        { from: "plc1", to: "plc2" },
    ], [primaryAttackPath, simulationState])

    const getNodeColor = (status: NetworkNode["status"]) => {
        switch (status) {
            case "Safe": return "#22c55e"
            case "Warning": return "#eab308"
            case "Compromised": return "#ef4444"
        }
    }

    const getNodeIcon = (type: NetworkNode["type"]) => {
        switch (type) {
            case "Attacker": return Radar
            case "Firewall": return ShieldCheck
            case "Workstation": return Laptop
            case "HMI": return Database
            case "PLC": return Activity
        }
    }

    const exportSvg = () => {
        if (!svgRef.current) return
        const serializer = new XMLSerializer()
        const svg = serializer.serializeToString(svgRef.current)
        downloadTextFile("ics-network-topology.svg", svg, "image/svg+xml;charset=utf-8")
    }

    const exportPng = () => {
        if (!svgRef.current) return
        const serializer = new XMLSerializer()
        const svg = serializer.serializeToString(svgRef.current)
        const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }))
        const image = new Image()
        image.onload = () => {
            const canvas = document.createElement("canvas")
            canvas.width = 1200
            canvas.height = 600
            const context = canvas.getContext("2d")
            if (!context) return
            context.fillStyle = "#f8fafc"
            context.fillRect(0, 0, canvas.width, canvas.height)
            context.drawImage(image, 0, 0, canvas.width, canvas.height)
            URL.revokeObjectURL(url)
            canvas.toBlob((blob) => {
                if (!blob) return
                const pngUrl = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = pngUrl
                link.download = "ics-network-topology.png"
                link.click()
                URL.revokeObjectURL(pngUrl)
            }, "image/png")
        }
        image.src = url
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardTitle>Live Network Topology</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportSvg}>
                        <Download className="mr-2 h-4 w-4" />
                        SVG
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportPng}>
                        <Download className="mr-2 h-4 w-4" />
                        PNG
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative h-[340px] w-full overflow-hidden rounded border bg-slate-50 dark:bg-slate-900">
                    <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 540 280" role="img" aria-label="ICS network topology">
                        <rect width="540" height="280" fill="currentColor" className="text-slate-50 dark:text-slate-900" />
                        <defs>
                            <marker id="attack-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                            </marker>
                        </defs>

                        {edges.map((edge) => {
                            const n1 = nodes.find((node) => node.id === edge.from)
                            const n2 = nodes.find((node) => node.id === edge.to)
                            if (!n1 || !n2) return null

                            const isAttackPath = Boolean(edge.attackPath)
                            return (
                                <line
                                    key={`${edge.from}-${edge.to}`}
                                    x1={n1.x}
                                    y1={n1.y}
                                    x2={n2.x}
                                    y2={n2.y}
                                    stroke={isAttackPath ? "#ef4444" : "#94a3b8"}
                                    strokeWidth={isAttackPath ? 2.5 : 1.5}
                                    strokeDasharray={isAttackPath ? "6,5" : ""}
                                    markerEnd={isAttackPath ? "url(#attack-arrow)" : undefined}
                                >
                                    {isAttackPath && !publicationMode && (
                                        <animate attributeName="stroke-dashoffset" from="80" to="0" dur="1s" repeatCount="indefinite" />
                                    )}
                                </line>
                            )
                        })}

                        {nodes.map((node) => {
                            const Icon = getNodeIcon(node.type)
                            return (
                                <g key={node.id} transform={`translate(${node.x - 24}, ${node.y - 24})`}>
                                    <circle
                                        cx="24"
                                        cy="24"
                                        r="24"
                                        fill="white"
                                        stroke={getNodeColor(node.status)}
                                        strokeWidth="3"
                                        className="dark:fill-slate-800"
                                    />
                                    <foreignObject x="8" y="8" width="32" height="32">
                                        <div className="flex h-full w-full items-center justify-center text-slate-700 dark:text-slate-200">
                                            <Icon size={18} />
                                        </div>
                                    </foreignObject>
                                    <text x="24" y="62" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-slate-700 dark:fill-slate-200">
                                        {node.label}
                                    </text>
                                    <text x="24" y="76" textAnchor="middle" fontSize="8.5" className="fill-slate-500 dark:fill-slate-400">
                                        {node.ip}
                                    </text>
                                    <text x="24" y="88" textAnchor="middle" fontSize="8" className="fill-slate-500 dark:fill-slate-400">
                                        {node.role}
                                    </text>
                                </g>
                            )
                        })}

                        {primaryAttackPath && (
                            <text x="270" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fill="#991b1b">
                                Attack path: {primaryAttackPath.sourceIp} {"->"} {primaryAttackPath.targetIp}
                            </text>
                        )}
                    </svg>

                    {!publicationMode && (
                        <div className="absolute right-2 top-2 flex flex-col gap-1 rounded bg-white/85 p-2 text-xs shadow-sm dark:bg-black/55">
                            <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-green-500" /> Safe</div>
                            <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-yellow-500" /> Warning</div>
                            <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-red-500" /> Compromised</div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
