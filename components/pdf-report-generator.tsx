"use client"

import { useState } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { ProjectManager } from "@/lib/project-manager"
import { DetectedThreat } from "@/lib/calculators/pcap-ingestor"

export function PdfReportGenerator() {
    const [isGenerating, setIsGenerating] = useState(false)

    const generateReport = () => {
        setIsGenerating(true)
        try {
            const doc = new jsPDF()
            const pageWidth = doc.internal.pageSize.width
            const today = new Date().toLocaleDateString()

            // --- Header ---
            doc.setFontSize(22)
            doc.setTextColor(30, 64, 175) // Blue-800
            doc.text("ICS Security Risk Assessment Report", pageWidth / 2, 20, { align: "center" })

            doc.setFontSize(10)
            doc.setTextColor(100)
            doc.text(`Generated on: ${today}`, pageWidth / 2, 30, { align: "center" })

            doc.setLineWidth(0.5)
            doc.setDrawColor(200)
            doc.line(10, 35, pageWidth - 10, 35)

            // --- Data Retrieval ---
            const projects = ProjectManager.getAllProjects()
            const detectedThreats: DetectedThreat[] = typeof window !== "undefined"
                ? JSON.parse(localStorage.getItem("detected-threats") || "[]")
                : []

            // Calculate Overall Risk
            const avgRisk = projects.length > 0
                ? projects.reduce((sum, p) => sum + (p.assessment?.riskScore || 0), 0) / projects.length
                : 0

            const riskLevel = avgRisk >= 9 ? "CRITICAL" : avgRisk >= 7 ? "HIGH" : avgRisk >= 4 ? "MEDIUM" : "LOW"

            // --- Section 1: Executive Summary ---
            doc.setFontSize(16)
            doc.setTextColor(0)
            doc.text("1. Executive Summary", 14, 50)

            doc.setFontSize(11)
            doc.setTextColor(50)
            const summaryText = `This report provides a comprehensive security audit of the Industrial Control Systems (ICS) environment. The assessment evaluates configuration compliance, vulnerability exposure, and real-time threat detection.`
            doc.text(doc.splitTextToSize(summaryText, pageWidth - 28), 14, 60)

            doc.setFillColor(245, 247, 250)
            doc.rect(14, 75, pageWidth - 28, 30, "F")

            doc.setFontSize(12)
            doc.setTextColor(30, 64, 175)
            doc.text("Overall Security Status", 20, 85)

            doc.setFontSize(14)
            doc.setTextColor(riskLevel === "CRITICAL" || riskLevel === "HIGH" ? 220 : 0, 0, 0)
            if (riskLevel === "MEDIUM") doc.setTextColor(202, 138, 4)
            if (riskLevel === "LOW") doc.setTextColor(22, 163, 74)

            doc.text(`Current Risk Score: ${avgRisk.toFixed(1)} / 10 - ${riskLevel}`, 20, 95)

            // --- Section 2: Critical Assets ---
            let yPos = 120
            doc.setFontSize(16)
            doc.setTextColor(0)
            doc.text("2. Critical Assets Status", 14, yPos)
            yPos += 10

            // Sort projects by risk
            const topRisks = [...projects].sort((a, b) => (b.assessment?.riskScore || 0) - (a.assessment?.riskScore || 0)).slice(0, 5)

            autoTable(doc, {
                startY: yPos,
                head: [['Asset / Project', 'Device Type', 'Risk Score', 'Compliance']],
                body: topRisks.length > 0 ? topRisks.map(p => [
                    p.name,
                    p.config?.deviceType || "N/A",
                    p.assessment?.riskScore.toFixed(1) || "N/A",
                    p.assessment?.baselineComparison ? `${p.assessment.baselineComparison.compliance}%` : "N/A"
                ]) : [['No assets assessed', '-', '-', '-']],
                theme: 'grid',
                headStyles: { fillColor: [30, 64, 175] },
                styles: { fontSize: 10 },
            })

            // Update Y Position based on table
            // @ts-ignore
            yPos = doc.lastAutoTable.finalY + 20

            // --- Section 3: Detected Threats ---
            doc.setFontSize(16)
            doc.setTextColor(0)
            doc.text("3. Detected Network Threats", 14, yPos)
            yPos += 10

            autoTable(doc, {
                startY: yPos,
                head: [['Timestamp', 'Type', 'Source IP', 'Severity', 'Description']],
                body: detectedThreats.length > 0 ? detectedThreats.map(t => [
                    new Date(t.timestamp).toLocaleTimeString(),
                    t.type,
                    t.source_ip,
                    t.severity,
                    t.description
                ]) : [['No active threats detected in Traffic Analyzer logs', '-', '-', '-', '-']],
                theme: 'grid',
                headStyles: { fillColor: [185, 28, 28] }, // Red for threats
                styles: { fontSize: 9 },
            })

            // --- Footer ---
            const pageCount = doc.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i)
                doc.setFontSize(8)
                doc.setTextColor(150)
                doc.line(10, doc.internal.pageSize.height - 20, pageWidth - 10, doc.internal.pageSize.height - 20)
                doc.text("Generated by Stochastic ICS Risk Framework - Author: Osama Ali", pageWidth / 2, doc.internal.pageSize.height - 10, { align: "center" })
            }

            doc.save(`ICS_Security_Audit_Report_${new Date().toISOString().split('T')[0]}.pdf`)

        } catch (error) {
            console.error("PDF Generation Error", error)
            alert("Failed to generate PDF report")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className="gap-2 hidden md:flex border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-blue-950/30"
            onClick={generateReport}
            disabled={isGenerating}
        >
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{isGenerating ? "Exporting..." : "Export Report"}</span>
        </Button>
    )
}
