/**
 * ICS-Risk Framework
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 *
 * Custom Export Templates
 * Multiple report formats for different audiences
 */

interface ExportTemplate {
  name: string
  description: string
  includeExecutiveSummary: boolean
  includeTechnicalDetails: boolean
  includeCompliance: boolean
  includeRecommendations: boolean
  includeCharts: boolean
  language: "simple" | "technical"
}

export const exportTemplates: Record<string, ExportTemplate> = {
  executive: {
    name: "Executive Report",
    description: "High-level summary for management",
    includeExecutiveSummary: true,
    includeTechnicalDetails: false,
    includeCompliance: true,
    includeRecommendations: true,
    includeCharts: true,
    language: "simple",
  },
  technical: {
    name: "Technical Report",
    description: "Detailed analysis for security engineers",
    includeExecutiveSummary: true,
    includeTechnicalDetails: true,
    includeCompliance: true,
    includeRecommendations: true,
    includeCharts: true,
    language: "technical",
  },
  compliance: {
    name: "Compliance Report",
    description: "Focus on regulatory requirements",
    includeExecutiveSummary: false,
    includeTechnicalDetails: false,
    includeCompliance: true,
    includeRecommendations: true,
    includeCharts: false,
    language: "technical",
  },
  quick: {
    name: "Quick Summary",
    description: "Brief overview of findings",
    includeExecutiveSummary: true,
    includeTechnicalDetails: false,
    includeCompliance: false,
    includeRecommendations: true,
    includeCharts: false,
    language: "simple",
  },
}

export function generateCustomReport(data: any, template: ExportTemplate, language: string): string {
  let html = `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <title>${template.name}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; }
    .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    .section { margin: 30px 0; }
    .risk-high { color: #dc2626; font-weight: bold; }
    .risk-medium { color: #ea580c; font-weight: bold; }
    .risk-low { color: #16a34a; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background: #f3f4f6; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${template.name}</h1>
    <p>${template.description}</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
  </div>
`

  // Add sections based on template configuration
  if (template.includeExecutiveSummary) {
    html += `<div class="section">
      <h2>Executive Summary</h2>
      <p>System assessed: ${data.deviceType} - ${data.model}</p>
      <p>Overall Risk Score: <span class="risk-${data.riskLevel}">${data.riskScore}/10</span></p>
    </div>`
  }

  if (template.includeTechnicalDetails) {
    html += `<div class="section">
      <h2>Technical Details</h2>
      <table>
        <tr><th>Parameter</th><th>Value</th></tr>
        <tr><td>Device Type</td><td>${data.deviceType}</td></tr>
        <tr><td>Manufacturer</td><td>${data.manufacturer}</td></tr>
        <tr><td>Model</td><td>${data.model}</td></tr>
        <tr><td>Protocols</td><td>${data.protocols.join(", ")}</td></tr>
      </table>
    </div>`
  }

  if (template.includeRecommendations) {
    html += `<div class="section">
      <h2>Recommendations</h2>
      <ol>`
    data.recommendations?.forEach((rec: string) => {
      html += `<li>${rec}</li>`
    })
    html += `</ol></div>`
  }

  html += `</body></html>`
  return html
}
