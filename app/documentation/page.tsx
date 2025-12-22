"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, GraduationCap, Download, Code, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DocumentationPage() {
  const { language, t: translations } = useLanguage()
  const isRTL = language === "ar"

  const t = translations.documentation || {}

  const downloadMethodology = () => {
    const content = generateMethodologyDocument()
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ICS-Security-Methodology.md"
    a.click()
  }

  const generateMethodologyDocument = () => {
    return `# Industrial Control Systems Security Assessment Tool - Methodology

## Abstract

This document presents a comprehensive methodology for assessing security risks in Industrial Control Systems (ICS) and Supervisory Control and Data Analysis (SCADA) environments. The tool implements multiple security frameworks including STRIDE threat modeling, IEC 62443 compliance checking, and CVSS-based vulnerability assessment.

## 1. Introduction

### 1.1 Background
Industrial Control Systems are critical infrastructure components that control physical processes in manufacturing, energy, water treatment, and other vital sectors. These systems face increasing cyber threats as they become more connected to enterprise networks and the internet.

### 1.2 Objectives
- Provide systematic security assessment for ICS/SCADA systems
- Identify known vulnerabilities (CVEs) affecting specific devices
- Calculate risk scores based on multiple security factors
- Generate actionable security recommendations
- Support compliance with international standards

## 2. Methodology

### 2.1 Risk Calculation Formula

The core risk assessment uses a weighted scoring system:

**Risk Score = (CVSS_avg × 0.6) + (Internet_Exposure × 0.3) + (Legacy_Weight × 0.1)**

Where:
- **CVSS_avg**: Average CVSS score of all identified vulnerabilities (0-10)
- **Internet_Exposure**: Binary indicator (0 or 1) of internet connectivity
- **Legacy_Weight**: Binary indicator (0 or 1) for unsupported/end-of-life systems

### 2.2 STRIDE Threat Modeling

The tool implements Microsoft's STRIDE methodology for comprehensive threat analysis:

- **Spoofing**: Identity impersonation risks
- **Tampering**: Data integrity threats
- **Repudiation**: Accountability and logging issues
- **Information Disclosure**: Confidentiality breaches
- **Denial of Service**: Availability impacts
- **Elevation of Privilege**: Authorization bypass risks

Each threat category is analyzed based on:
- System configuration (protocols, connectivity, authentication)
- Known vulnerabilities
- Industry best practices

### 2.3 Attack Tree Analysis

Attack trees visualize potential attack paths with:
- **Attack Vectors**: Entry points (Network, Physical, Wireless, Supply Chain)
- **Probability Scores**: Likelihood assessment (0.1-0.9)
- **Impact Ratings**: Consequence severity (Low, Medium, High, Critical)
- **Mitigation Status**: Current security controls

### 2.4 Compliance Assessment

The tool checks compliance with two major standards:

#### IEC 62443 (Industrial Automation and Control Systems Security)
- Network Segmentation (Requirement 3.3.5.1)
- Access Control (Requirement 3.3.4.1)
- Security Updates (Requirement 3.3.8.1)
- Audit Logging (Requirement 3.3.10.1)
- Cryptographic Functions (Requirement 3.3.11.1)

#### NIST Cybersecurity Framework
- Identify (ID.AM-1, ID.RA-1)
- Protect (PR.AC-1, PR.DS-1)
- Detect (DE.CM-1, DE.AE-1)
- Respond (RS.RP-1, RS.AN-1)
- Recover (RC.RP-1, RC.CO-1)

### 2.5 Vulnerability Database

The tool maintains a comprehensive database of CVEs affecting ICS devices:
- 60+ real-world vulnerabilities from NVD and ICS-CERT
- Coverage of major vendors (Siemens, Rockwell, Schneider, Honeywell, etc.)
- CVSS scores and exploit availability
- Mitigation recommendations in 4 languages

## 3. System Architecture

### 3.1 Components
- **Frontend**: React/Next.js web application
- **Data Layer**: JSON-based local database (privacy-preserving)
- **Analysis Engine**: TypeScript-based risk calculation
- **Export Module**: PDF and CSV report generation

### 3.2 Privacy & Security
- Fully offline operation (no data transmission)
- Client-side processing only
- Local storage for project persistence
- No external API dependencies

## 4. Use Cases

### 4.1 Pre-deployment Assessment
Security engineers can evaluate new ICS equipment before deployment to identify risks early.

### 4.2 Security Audits
Conduct periodic security assessments of existing industrial infrastructure.

### 4.3 Incident Response
Quick vulnerability lookup during security incidents.

### 4.4 Compliance Reporting
Generate compliance reports for IEC 62443 and NIST framework requirements.

## 5. Limitations

- Relies on publicly available CVE data (may not include zero-days)
- Risk scoring is heuristic-based (requires expert validation)
- Does not replace penetration testing or detailed security audits
- Limited to devices in the included database

## 6. Future Enhancements

- Integration with live CVE feeds (NVD API)
- Machine learning for risk prediction
- Network topology visualization
- Automated report generation
- Support for additional compliance frameworks (ISO 27001, NERC CIP)

## 7. References

1. IEC 62443-3-3:2013 - Security for industrial automation and control systems
2. NIST Special Publication 800-82 Rev. 2 - Guide to ICS Security
3. MITRE ATT&CK for ICS - https://attack.mitre.org/tactics/ics/
4. ICS-CERT Advisories - https://www.cisa.gov/uscert/ics/advisories
5. Common Vulnerabilities and Exposures (CVE) - https://cve.mitre.org/
6. National Vulnerability Database (NVD) - https://nvd.nist.gov/
7. Shodan ICS Radar - https://www.shodan.io/
8. STRIDE Threat Modeling - Microsoft Security Development Lifecycle

## 8. Author Information

Developed by: Osama Ali
Institution: Istanbul Technical University, Turkey
Field: Industrial Engineering with focus on Industrial Cybersecurity
Contact: osama.ali@itu.edu.tr
GitHub: https://github.com/osamaali/ics-security-assessment-tool

## 9. Citation

If you use this tool in your research, please cite as:

\`\`\`
Osama Ali (2025). Industrial Control Systems Security Assessment Tool. 
Open-source security assessment platform for ICS/SCADA environments.
Developed as part of Master’s application research.
Available at: https://github.com/osamaali/ics-security-assessment-tool
\`\`\`

## 10. License

This project is released under the MIT License, promoting open-source collaboration in industrial cybersecurity research.

---

**Last Updated**: January 2025
**Version**: 1.0.0
`
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8 ${isRTL ? "rtl" : "ltr"}`}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
              >
                <ArrowLeft className="w-5 h-5" />
                {t.backToHome || "Back to Home"}
              </Button>
            </Link>
            <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <GraduationCap className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{t.title || "Academic Documentation"}</h1>
              <p className="text-slate-300">{t.subtitle || "Methodology, References, and Research Guidelines"}</p>
            </div>
          </div>
          <Button onClick={downloadMethodology} className="gap-2 bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4" />
            {t.downloadMethodology || "Download Methodology"}
          </Button>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/80 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <BookOpen className="w-5 h-5 text-blue-400" />
                {t.methodology || "Methodology"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">
                {t.methodologyDesc || "Detailed explanation of risk assessment algorithms and frameworks"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <FileText className="w-5 h-5 text-green-400" />
                {t.references || "References"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">
                {t.referencesDesc || "Academic sources and industry standards used"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Code className="w-5 h-5 text-purple-400" />
                {t.github || "GitHub Repository"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">{t.githubDesc || "Source code and contribution guidelines"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Methodology Section */}
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">{t.riskFormula || "Risk Assessment Formula"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-lg font-mono text-sm text-cyan-300 border border-cyan-900">
              Risk Score = (CVSS_avg × 0.6) + (Internet_Exposure × 0.3) + (Legacy_Weight × 0.1)
            </div>
            <div className="space-y-2 text-slate-200">
              <p>
                <strong className="text-white">CVSS_avg:</strong>{" "}
                {t.cvssDesc || "Average Common Vulnerability Scoring System score (0-10)"}
              </p>
              <p>
                <strong className="text-white">Internet_Exposure:</strong>{" "}
                {t.internetDesc || "Binary indicator if system is connected to internet (0 or 1)"}
              </p>
              <p>
                <strong className="text-white">Legacy_Weight:</strong>{" "}
                {t.legacyDesc || "Binary indicator for unsupported/end-of-life systems (0 or 1)"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* STRIDE Framework */}
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">{t.strideTitle || "STRIDE Threat Modeling"}</CardTitle>
            <CardDescription className="text-slate-300">
              {t.strideDesc || "Comprehensive threat analysis framework developed by Microsoft"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "Spoofing",
                  desc: t.spoofing || "Identity impersonation and authentication bypass",
                },
                {
                  name: "Tampering",
                  desc: t.tampering || "Data integrity violations and unauthorized modifications",
                },
                {
                  name: "Repudiation",
                  desc: t.repudiation || "Inability to trace actions and prove accountability",
                },
                {
                  name: "Information Disclosure",
                  desc: t.disclosure || "Unauthorized access to sensitive data",
                },
                {
                  name: "Denial of Service",
                  desc: t.dos || "System availability and resource exhaustion",
                },
                {
                  name: "Elevation of Privilege",
                  desc: t.privilege || "Unauthorized access to higher privileges",
                },
              ].map((threat, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <h4 className="font-semibold text-white mb-1">{threat.name}</h4>
                  <p className="text-sm text-slate-300">{threat.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Standards & Compliance */}
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">{t.standards || "Security Standards & Frameworks"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-2">IEC 62443</h4>
              <p className="text-sm text-slate-300 mb-2">
                {t.iec62443Desc || "International standard for industrial automation and control systems security"}
              </p>
              <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                <li>Network Segmentation (SR 3.3.5.1)</li>
                <li>Access Control (SR 3.3.4.1)</li>
                <li>Security Updates (SR 3.3.8.1)</li>
                <li>Audit Logging (SR 3.3.10.1)</li>
                <li>Cryptographic Functions (SR 3.3.11.1)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">NIST Cybersecurity Framework</h4>
              <p className="text-sm text-slate-300 mb-2">
                {t.nistDesc || "Framework for improving critical infrastructure cybersecurity"}
              </p>
              <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                <li>Identify: Asset management and risk assessment</li>
                <li>Protect: Access control and data security</li>
                <li>Detect: Anomaly detection and continuous monitoring</li>
                <li>Respond: Response planning and analysis</li>
                <li>Recover: Recovery planning and communications</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* References */}
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">{t.academicReferences || "Academic References"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-200">
              <li>IEC 62443-3-3:2013 - Security for industrial automation and control systems</li>
              <li>NIST Special Publication 800-82 Rev. 2 - Guide to Industrial Control Systems (ICS) Security</li>
              <li>
                MITRE ATT&CK for ICS - Industrial Control Systems Adversarial Tactics, Techniques, and Common Knowledge
              </li>
              <li>ICS-CERT Advisories - Cybersecurity and Infrastructure Security Agency (CISA)</li>
              <li>Common Vulnerabilities and Exposures (CVE) Database - MITRE Corporation</li>
              <li>National Vulnerability Database (NVD) - NIST</li>
              <li>Shodan ICS Radar - Internet-connected Industrial Control Systems</li>
              <li>Microsoft STRIDE Threat Modeling - Security Development Lifecycle</li>
              <li>ISA/IEC 62443 Standards - International Society of Automation</li>
              <li>NERC CIP Standards - North American Electric Reliability Corporation</li>
            </ol>
          </CardContent>
        </Card>

        {/* Citation */}
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">{t.citation || "How to Cite This Work"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <p className="text-sm font-mono text-slate-200">
                Osama Ali (2025). Industrial Control Systems Security Assessment Tool.
                <br />
                Open-source security assessment platform for ICS/SCADA environments.
                <br />
                Developed as part of Master’s application research.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">BibTeX Format:</h4>
              <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-200 border border-slate-800">
                @software&#123;ics_security_tool_2025,
                <br />
                &nbsp;&nbsp;author = &#123;Osama Ali&#125;,
                <br />
                &nbsp;&nbsp;title = &#123;Industrial Control Systems Security Assessment Tool&#125;,
                <br />
                &nbsp;&nbsp;year = &#123;2025&#125;,
                <br />
                &nbsp;&nbsp;note = &#123;Industrial Engineering & Cybersecurity Research&#125;,
                <br />
                &nbsp;&nbsp;url = &#123;https://github.com/osamaali/ics-security-assessment-tool&#125;
                <br />
                &#125;
              </div>
            </div>
          </CardContent>
        </Card>

        {/* License */}
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">{t.license || "License & Usage"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-slate-200">
            <p>
              {t.licenseDesc ||
                "This project is released under the MIT License, promoting open-source collaboration in industrial cybersecurity research."}
            </p>
            <p className="text-sm text-slate-300">
              {t.contributions || "Contributions, bug reports, and feature requests are welcome on GitHub."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
