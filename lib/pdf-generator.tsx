import type { RiskAssessment, SystemConfig } from "./risk-engine"
import { translations } from "./i18n/translations"

export function generatePDF(assessment: RiskAssessment, config: SystemConfig, lang: "ar" | "en" | "de" | "tr" = "ar") {
  const t = translations[lang] || translations.ar
  const isRTL = lang === 'ar'
  const dir = isRTL ? 'rtl' : 'ltr'

  // Create a comprehensive report document
  const doc = `
<!DOCTYPE html>
<html dir="${dir}" lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${t.title} - ${t.results}</title>
  <style>
    @page { 
      size: A4; 
      margin: 2cm; 
    }
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      direction: ${dir};
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #1e40af;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1e40af;
      margin: 0;
      font-size: 28px;
    }
    .header p {
      color: #666;
      margin: 5px 0;
    }
    .risk-score {
      background: ${assessment.riskLevel === "CRITICAL" || assessment.riskLevel === "HIGH" ? "#dc2626" : assessment.riskLevel === "MEDIUM" ? "#ca8a04" : "#16a34a"};
      color: white;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    }
    .risk-score h2 {
      margin: 0;
      font-size: 48px;
    }
    .risk-score p {
      margin: 10px 0 0 0;
      font-size: 20px;
    }
    .section {
      margin: 30px 0;
      page-break-inside: avoid;
    }
    .section h3 {
      color: #1e40af;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 12px;
      text-align: ${isRTL ? 'right' : 'left'};
    }
    th {
      background-color: #1e40af;
      color: white;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background-color: #f9fafb;
    }
    .severity-critical { color: #dc2626; font-weight: bold; }
    .severity-high { color: #ea580c; font-weight: bold; }
    .severity-medium { color: #ca8a04; font-weight: bold; }
    .severity-low { color: #16a34a; font-weight: bold; }
    ul {
      list-style-type: disc;
      padding-${isRTL ? 'right' : 'left'}: 25px;
    }
    li {
      margin: 8px 0;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 15px 0;
    }
    .info-item {
      padding: 10px;
      background: #f9fafb;
      border-radius: 4px;
    }
    .info-item strong {
      color: #1e40af;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${t.appTitle}</h1>
    <h2 style="margin: 10px 0;">${t.results}</h2>
    <p>${t.date}: ${new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : lang === 'tr' ? 'tr-TR' : lang === 'de' ? 'de-DE' : 'en-US', { year: "numeric", month: "long", day: "numeric" })}</p>
  </div>

  <div class="risk-score">
    <h2>${assessment.riskScore.toFixed(1)}/100</h2>
    <p>${t.riskScore}: ${assessment.riskLevel}</p>
  </div>

  <div class="section">
    <h3>${t.inputDetails}</h3>
    <div class="info-grid">
      <div class="info-item">
        <strong>${t.deviceType}:</strong> ${config.deviceType}
      </div>
      <div class="info-item">
        <strong>${t.manufacturer}:</strong> ${config.manufacturer}
      </div>
      <div class="info-item">
        <strong>${t.model}:</strong> ${config.model}
      </div>
      <div class="info-item">
        <strong>${t.internetConnected}:</strong> ${config.internetConnected ? (isRTL ? "نعم ⚠️" : "Yes ⚠️") : (isRTL ? "لا ✓" : "No ✓")}
      </div>
      <div class="info-item">
        <strong>${t.connectedToIT}:</strong> ${config.connectedToIT ? (isRTL ? "نعم" : "Yes") : (isRTL ? "لا" : "No")}
      </div>
      <div class="info-item">
        <strong>${t.legacyDevice}:</strong> ${config.isLegacy ? (isRTL ? "نعم ⚠️" : "Yes ⚠️") : (isRTL ? "لا ✓" : "No ✓")}
      </div>
    </div>
    <div class="info-item" style="margin-top: 10px;">
      <strong>${t.activeProtocols}:</strong> ${config.protocols.join(", ")}
    </div>
    <div class="info-item" style="margin-top: 10px;">
      <strong>${t.interfaces}:</strong> ${config.interfaces.join(", ")}
    </div>
  </div>

  <div class="section">
    <h3>${t.attackSurface}</h3>
    <p><strong>${t.exposureLevel}:</strong> <span class="severity-${assessment.attackSurface.exposureLevel.toLowerCase()}">${assessment.attackSurface.exposureLevel}</span></p>
    <p><strong>${t.criticalPoints}:</strong></p>
    <ul>
      ${assessment.attackSurface.criticalPoints.map((point) => `<li>${point}</li>`).join("")}
    </ul>
  </div>

  <div class="section">
    <h3>${t.vulnerabilities} (${assessment.vulnerabilities.length})</h3>
    <table>
      <thead>
        <tr>
          <th>${t.cveId}</th>
          <th>${t.description}</th>
          <th>${t.cvss}</th>
          <th>${t.severity}</th>
          <th>${t.category}</th>
        </tr>
      </thead>
      <tbody>
        ${assessment.vulnerabilities
      .map(
        (vuln) => `
          <tr>
            <td style="font-family: monospace;">${vuln.id}</td>
            <td>${lang === 'ar' ? vuln.description_ar : vuln.description}</td>
            <td><strong>${vuln.cvss}</strong></td>
            <td class="severity-${vuln.severity.toLowerCase()}">${vuln.severity}</td>
            <td>${vuln.category}</td>
          </tr>
        `,
      )
      .join("")}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h3>${t.recommendations}</h3>
    <ul>
      ${(lang === 'ar' ? assessment.recommendations_ar : assessment.recommendations).map((rec) => `<li>${rec}</li>`).join("")}
    </ul>
  </div>

  <div class="footer">
    <p><strong>${t.low}:</strong> ${t.footerText}</p>
    <p style="margin-top: 10px;">ICS Security Assessment Tool | ${t.designedBy}</p>
  </div>
</body>
</html>
  `

  // Create a blob and trigger download
  const blob = new Blob([doc], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `ICS-Security-Report-${lang.toUpperCase()}-${Date.now()}.html`
  link.click()
  URL.revokeObjectURL(url)
}
