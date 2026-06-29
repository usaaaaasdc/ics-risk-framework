
"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TraficAnalyzer, Packet, DetectedThreat } from "@/lib/calculators/pcap-ingestor"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, FileCode, ShieldAlert } from "lucide-react"

export interface PacketUploadProps {
    onThreatsDetected?: (threats: DetectedThreat[]) => void;
}

export function PacketUpload({ onThreatsDetected }: PacketUploadProps) {
    const [jsonInput, setJsonInput] = useState("")
    const [threats, setThreats] = useState<DetectedThreat[]>([])
    const [error, setError] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

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
        setFileName(null)
    }

    /**
     * STEP 1 (UI): Handle file upload button click
     */
    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    /**
     * STEP 2 (LOGIC): Improved file upload handler with safe parsing
     */
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setFileName(file.name)
        setError(null)

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string

                // Safe JSON parsing with detailed error logging
                console.log("📂 Parsing file:", file.name)
                let parsedData = JSON.parse(content)
                console.log("✅ JSON parsed successfully. Type:", Array.isArray(parsedData) ? "Array" : "Object")

                // Check if it's already an array
                if (Array.isArray(parsedData)) {
                    console.log("✅ Direct array detected with", parsedData.length, "items")
                    setJsonInput(JSON.stringify(parsedData, null, 2))
                    return
                }

                // Check if it's wrapped in an object (e.g., { packets: [...] })
                if (typeof parsedData === 'object' && parsedData !== null) {
                    console.log("🔍 Object detected. Searching for array property...")

                    // Common array property names
                    const possibleKeys = ['packets', 'data', 'items', 'records', 'traffic', 'payload']

                    for (const key of possibleKeys) {
                        if (Array.isArray(parsedData[key])) {
                            console.log(`✅ Found array in property '${key}' with`, parsedData[key].length, "items")
                            setJsonInput(JSON.stringify(parsedData[key], null, 2))
                            return
                        }
                    }

                    // If no known key, try the first array property found
                    for (const key in parsedData) {
                        if (Array.isArray(parsedData[key])) {
                            console.log(`✅ Found array in property '${key}' with`, parsedData[key].length, "items")
                            setJsonInput(JSON.stringify(parsedData[key], null, 2))
                            return
                        }
                    }

                    console.error("❌ No array found in object. Keys:", Object.keys(parsedData))
                    setError("JSON object does not contain an array. Please provide a direct array or an object with a 'packets' property.")
                    return
                }

                console.error("❌ Unexpected data type:", typeof parsedData)
                setError("Invalid JSON format. Expected an array of packets or an object containing an array.")

            } catch (err) {
                console.error("❌ JSON parsing failed:", err)
                console.error("Error details:", {
                    message: err instanceof Error ? err.message : String(err),
                    fileName: file.name,
                    fileSize: file.size
                })
                setError(`Failed to parse JSON: ${err instanceof Error ? err.message : 'Unknown error'}`)
            }
        }

        reader.onerror = () => {
            console.error("❌ File reading failed")
            setError("Failed to read the file. Please try again.")
        }

        reader.readAsText(file)
    }

    const handleAnalyze = () => {
        setError(null)
        try {
            const packets = TraficAnalyzer.parseImportedFile(jsonInput)
            const results = TraficAnalyzer.analyze(packets)
            setThreats(results)




            // CALLBACK: Notify parent component (Dashboard) of detected threats
            if (onThreatsDetected) {
                console.log('📤 Sending', results.length, 'threats to dashboard');
                onThreatsDetected(results);
            }

            // Keep localStorage for persistence (optional)
            if (typeof window !== "undefined") {
                localStorage.setItem("detected-threats", JSON.stringify(results))
            }
        } catch (e) {
            console.error("❌ Analysis failed:", e)
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
                    <p className="text-sm text-muted-foreground">
                        Upload a JSON file or paste packet log data to simulate real-world traffic ingestion.
                    </p>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="hidden"
                    />

                    {/* STEP 1 (UI): Visible Upload Button with blue Tailwind styling */}
                    <Button
                        onClick={handleUploadClick}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload JSON File
                    </Button>

                    {fileName && (
                        <p className="text-sm text-green-600 font-medium">
                            ✅ Loaded: {fileName}
                        </p>
                    )}

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
