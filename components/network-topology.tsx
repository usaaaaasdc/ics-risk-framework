
"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, ShieldCheck, Laptop, Database, Activity, Wifi } from "lucide-react"

interface NetworkNode {
    id: string
    type: 'Internet' | 'Firewall' | 'Workstation' | 'HMI' | 'PLC'
    x: number
    y: number
    label: string
    status: 'Safe' | 'Compromised' | 'Warning'
}

interface NetworkTopologyProps {
    riskScore: number // Used to determine if nodes turn red
    simulationState?: 'Secure' | 'Reconnaissance' | 'Exploitation' | 'Compromised' // From Markov
}

export function NetworkTopology({ riskScore, simulationState = 'Secure' }: NetworkTopologyProps) {

    // Determine dynamic node status based on Simulation State
    const nodes: NetworkNode[] = useMemo(() => {
        const isCompromised = simulationState === 'Compromised' || riskScore > 8;
        const isUnderAttack = simulationState === 'Exploitation' || riskScore > 6;

        return [
            { id: 'cloud', type: 'Internet', x: 50, y: 50, label: 'Internet', status: 'Warning' },
            { id: 'fw', type: 'Firewall', x: 150, y: 50, label: 'Corp FW', status: 'Safe' },
            { id: 'ws', type: 'Workstation', x: 250, y: 50, label: 'Eng. Workstation', status: isUnderAttack ? 'Warning' : 'Safe' },
            { id: 'hmi', type: 'HMI', x: 350, y: 50, label: 'HMI Main', status: isCompromised ? 'Compromised' : 'Safe' },
            { id: 'plc1', type: 'PLC', x: 350, y: 150, label: 'PLC-1 (S7-1500)', status: isCompromised ? 'Compromised' : 'Safe' },
            { id: 'plc2', type: 'PLC', x: 250, y: 150, label: 'PLC-2 (Modicon)', status: 'Safe' },
        ]
    }, [riskScore, simulationState])

    const edges = [
        { from: 'cloud', to: 'fw' },
        { from: 'fw', to: 'ws' },
        { from: 'ws', to: 'hmi' },
        { from: 'hmi', to: 'plc1' }, // Critical path
        { from: 'ws', to: 'plc2' },
        { from: 'plc1', to: 'plc2' }
    ]

    const getNodeColor = (status: string) => {
        switch (status) {
            case 'Safe': return '#22c55e'; // Green
            case 'Warning': return '#eab308'; // Yellow
            case 'Compromised': return '#ef4444'; // Red
            default: return '#cbd5e1';
        }
    }

    const getNodeIcon = (type: string) => {
        switch (type) {
            case 'Internet': return Cloud;
            case 'Firewall': return ShieldCheck;
            case 'Workstation': return Laptop;
            case 'HMI': return Database;
            case 'PLC': return Activity;
            default: return Wifi;
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Live Network Topology</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full h-[300px] border rounded bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
                    <svg width="100%" height="100%" viewBox="0 0 500 250">
                        {/* Definitions for Markers */}
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                            </marker>
                        </defs>

                        {/* Edges */}
                        {edges.map((edge, idx) => {
                            const n1 = nodes.find(n => n.id === edge.from)!
                            const n2 = nodes.find(n => n.id === edge.to)!
                            // Highlight Attack Path
                            const isAttackPath = (edge.from === 'cloud' && edge.to === 'fw') ||
                                (edge.from === 'fw' && edge.to === 'ws') ||
                                (edge.from === 'ws' && edge.to === 'hmi') ||
                                (edge.from === 'hmi' && edge.to === 'plc1');

                            const strokeColor = isAttackPath && simulationState !== 'Secure' ? '#ef4444' : '#94a3b8';
                            const strokeWidth = isAttackPath && simulationState !== 'Secure' ? 2 : 1;
                            const dashArray = isAttackPath && simulationState !== 'Secure' ? "5,5" : "";

                            return (
                                <line
                                    key={idx}
                                    x1={n1.x} y1={n1.y}
                                    x2={n2.x} y2={n2.y}
                                    stroke={strokeColor}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={dashArray}
                                >
                                    {isAttackPath && simulationState !== 'Secure' && (
                                        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1s" repeatCount="indefinite" />
                                    )}
                                </line>
                            )
                        })}

                        {/* Nodes */}
                        {nodes.map((node) => {
                            const Icon = getNodeIcon(node.type)
                            return (
                                <g key={node.id} transform={`translate(${node.x - 20}, ${node.y - 20})`}>
                                    <circle
                                        cx="20" cy="20" r="25"
                                        fill="white"
                                        stroke={getNodeColor(node.status)}
                                        strokeWidth="3"
                                        className="dark:fill-slate-800 transition-colors duration-500"
                                    />
                                    <foreignObject x="5" y="5" width="30" height="30">
                                        <div className="flex items-center justify-center h-full w-full text-slate-700 dark:text-slate-200">
                                            <Icon size={18} />
                                        </div>
                                    </foreignObject>
                                    <text x="20" y="55" textAnchor="middle" fontSize="10" className="fill-slate-600 dark:fill-slate-400 font-medium">
                                        {node.label}
                                    </text>
                                </g>
                            )
                        })}
                    </svg>

                    {/* Legend / Overlay */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 text-xs bg-white/80 dark:bg-black/50 p-2 rounded">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Safe</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Warning</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Compromised</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
