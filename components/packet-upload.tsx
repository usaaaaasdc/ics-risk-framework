
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea" // Using textarea for paste/simple input or file content
// import { detectFile } from "@/lib/utils" // Removed unused import
import { TraficAnalyzer, Packet, DetectedThreat } from "@/lib/calculators/pcap-ingestor"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, FileCode, ShieldAlert } from "lucide-react"

export function PacketUpload() {
    const [jsonInput, setJsonInput] = useState("")
    const [threats, setThreats] = useState<DetectedThreat[]>([])
    const [error, setError] = useState<string | null>(null)

    // Sample data for demo
    const loadSampleData = () => {
        const sample: Packet[] = [
            { id: 1, timestamp: new Date().toISOString(), source_ip: "192.168.1.50", dest_ip: "192.168.1.100", protocol: "Modbus", destination_port: 502, function_code: 5 },
            { id: 2, timestamp: new Date().toISOString(), source_ip: "10.0.0.5", dest_ip: "192.168.1.100", protocol: "TCP", destination_port: 80 },
            { id: 3, timestamp: new Date().toISOString(), source_ip: "10.0.0.5", dest_ip: "192.168.1.100", protocol: "TCP", destination_port: 443 },
            { id: 4, timestamp: new Date().toISOString(), source_ip: "10.0.0.5", dest_ip: "192.168.1.100", protocol: "TCP", destination_port: 22 },
            { id: 5, timestamp: new Date().toISOString(), source_ip: "10.0.0.5", dest_ip: "192.168.1.100", protocol: "TCP", destination_port: 21 },
            { id: 6, timestamp: new Date().toISOString(), source_ip: "10.0.0.5", dest_ip: "192.168.1.100", protocol: "TCP", destination_port: 8080 },
            { id: 7, timestamp: new Date().toISOString(), source_ip: "10.0.0.5", dest_ip: "192.168.1.100", protocol: "TCP", destination_port: 3389 },
            { id: 8, timestamp: new Date().toISOString(), source_ip: "10.0.0.5", dest_ip: "192.168.1.100", protocol: "TCP", destination_port: 135 },
            { id: 9, timestamp: new Date().toISOString(), source_ip: "10.0.0.5", dest_ip: "192.168.1.100", protocol: "TCP", destination_port: 445 },
            { id: 10, timestamp: new Date().toISOString(), source_ip: "10.0.0.5", dest_ip: "192.168.1.100", protocol: "TCP", destination_port: 5900 },
            { id: 11, timestamp: new Date().toISOString(), source_ip: "10.0.0.5", dest_ip: "192.168.1.100", protocol: "TCP", destination_port: 23 },
        ]
        setJsonInput(JSON.stringify(sample, null, 2))
    }

    const handleAnalyze = () => {
        setError(null)
        try {
            const packets = TraficAnalyzer.parseImportedFile(jsonInput)
            const results = TraficAnalyzer.analyze(packets)
            setThreats(results)
        } catch (e) {
            setError("Invalid JSON format. Please ensure it is an array of packets.")
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Traffic Injection
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">Paste JSON packet log here to simulate real-world data ingestion.</p>
                    <div className="relative">
                        <Textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            placeholder='[{"source_ip": "...", "protocol": "Modbus", ...}]'
                            className="font-mono text-xs h-[200px]"
                        />
                        <Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={loadSampleData}>
                            <FileCode className="w-3 h-3 mr-1" />
                            Load Sample
                        </Button>
                    </div>
                    <Button className="w-full" onClick={handleAnalyze}>Analyze Traffic</Button>
                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        Detected Threats
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {threats.length === 0 ? (
                        <div className="flex items-center justify-center h-[200px] text-muted-foreground border border-dashed rounded-lg">
                            No threats detected yet.
                        </div>
                    ) : (
                        <div className="h-[250px] overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Source IP</TableHead>
                                        <TableHead>Severity</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {threats.map((threat) => (
                                        <TableRow key={threat.id}>
                                            <TableCell className="font-medium">{threat.type}</TableCell>
                                            <TableCell>{threat.source_ip}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${threat.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                                                    threat.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {threat.severity}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
