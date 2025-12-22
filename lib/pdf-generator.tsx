import type { RiskAssessment, SystemConfig } from "./risk-engine"

export function generatePDF(assessment: RiskAssessment, config: SystemConfig) {
  // Create a comprehensive report document
  const doc = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>ICS Security Assessment Report</title>
  <style>
    @page { 
      size: A4; 
      margin: 2cm; 
    }
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      direction: rtl;
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
      text-align: right;
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
      padding-right: 25px;
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
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>تقرير تقييم أمن النظام الصناعي</h1>
    <h2 style="margin: 10px 0;">ICS Security Assessment Report</h2>
    <p>تاريخ التقرير: ${new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}</p>
  </div>

  <div class="risk-score">
    <h2>${assessment.riskScore.toFixed(1)}/10</h2>
    <p>مستوى المخاطر: ${assessment.riskLevel}</p>
  </div>

  <div class="section">
    <h3>معلومات النظام (System Information)</h3>
    <div class="info-grid">
      <div class="info-item">
        <strong>نوع الجهاز:</strong> ${config.deviceType}
      </div>
      <div class="info-item">
        <strong>الشركة المصنعة:</strong> ${config.manufacturer}
      </div>
      <div class="info-item">
        <strong>الموديل:</strong> ${config.model}
      </div>
      <div class="info-item">
        <strong>متصل بالإنترنت:</strong> ${config.internetConnected ? "نعم ⚠️" : "لا ✓"}
      </div>
      <div class="info-item">
        <strong>متصل بشبكة IT:</strong> ${config.connectedToIT ? "نعم" : "لا"}
      </div>
      <div class="info-item">
        <strong>جهاز قديم:</strong> ${config.isLegacy ? "نعم ⚠️" : "لا ✓"}
      </div>
    </div>
    <div class="info-item" style="margin-top: 10px;">
      <strong>البروتوكولات النشطة:</strong> ${config.protocols.join("، ")}
    </div>
    <div class="info-item" style="margin-top: 10px;">
      <strong>واجهات الاتصال:</strong> ${config.interfaces.join("، ")}
    </div>
  </div>

  <div class="section">
    <h3>سطح الهجوم (Attack Surface)</h3>
    <p><strong>مستوى التعرض:</strong> <span class="severity-${assessment.attackSurface.exposureLevel.toLowerCase()}">${assessment.attackSurface.exposureLevel}</span></p>
    <p><strong>النقاط الحرجة:</strong></p>
    <ul>
      ${assessment.attackSurface.criticalPoints.map((point) => `<li>${point}</li>`).join("")}
    </ul>
  </div>

  <div class="section">
    <h3>الثغرات المكتشفة (${assessment.vulnerabilities.length}) Identified Vulnerabilities</h3>
    <table>
      <thead>
        <tr>
          <th>CVE ID</th>
          <th>الوصف</th>
          <th>CVSS</th>
          <th>الخطورة</th>
          <th>التصنيف</th>
        </tr>
      </thead>
      <tbody>
        ${assessment.vulnerabilities
          .map(
            (vuln) => `
          <tr>
            <td style="font-family: monospace;">${vuln.id}</td>
            <td>${vuln.description_ar}</td>
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
    <h3>توصيات التخفيف (Mitigation Recommendations)</h3>
    <ul>
      ${assessment.recommendations_ar.map((rec) => `<li>${rec}</li>`).join("")}
    </ul>
  </div>

  <div class="section">
    <h3>التوصيات المخصصة للثغرات (Vulnerability-Specific Recommendations)</h3>
    <table>
      <thead>
        <tr>
          <th>CVE ID</th>
          <th>التوصية</th>
        </tr>
      </thead>
      <tbody>
        ${assessment.vulnerabilities
          .map(
            (vuln) => `
          <tr>
            <td style="font-family: monospace;">${vuln.id}</td>
            <td>${vuln.recommendation_ar}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p><strong>ملاحظة:</strong> هذا التقرير للتقييم الأولي فقط. يُنصح بإجراء تقييم أمني شامل من قبل متخصصين.</p>
    <p>This report is for preliminary assessment only. A comprehensive security audit by professionals is recommended.</p>
    <p style="margin-top: 10px;">تم إنشاؤه بواسطة: ICS Security Assessment Tool | جميع البيانات محلية ولا يتم إرسالها خارج الجهاز</p>
  </div>
</body>
</html>
  `

  // Create a blob and trigger download
  const blob = new Blob([doc], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `ICS-Security-Report-${Date.now()}.html`
  link.click()
  URL.revokeObjectURL(url)
}
