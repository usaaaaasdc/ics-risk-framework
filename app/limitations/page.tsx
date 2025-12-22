"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { AlertTriangle, ArrowLeft, Info } from "lucide-react"

export default function LimitationsPage() {
  const { translations } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {translations.backToHome || "Back to Home"}
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <AlertTriangle className="w-10 h-10 text-yellow-500" />
            Limitations & Disclaimers
          </h1>
          <p className="text-slate-300 text-lg">
            Important information about the capabilities and constraints of this framework
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-slate-800/50 border-slate-700">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-blue-400 mb-3">Intended Purpose</h2>
                <p className="text-slate-300 mb-2">
                  This framework is designed as an <strong>educational and research tool</strong> for:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400 ml-4">
                  <li>Academic studies in industrial cybersecurity</li>
                  <li>Training and awareness programs</li>
                  <li>Preliminary risk assessment (not comprehensive security audit)</li>
                  <li>Understanding ICS/SCADA security concepts</li>
                </ul>
                <p className="text-yellow-400 mt-3 font-semibold">
                  ⚠️ This tool is NOT a replacement for professional security assessments or commercial security
                  platforms.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-slate-800/50 border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-red-400">Critical Limitations</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-200 mb-2">1. Limited Vulnerability Database</h3>
                <p className="text-slate-400">
                  The framework currently contains <strong>60+ CVEs</strong>, compared to <strong>thousands</strong> in
                  comprehensive databases like NVD. Coverage is incomplete and focuses primarily on common ICS vendors
                  (Siemens, Rockwell Automation, Schneider Electric).
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-200 mb-2">2. No Real-World Validation</h3>
                <p className="text-slate-400">
                  This tool has <strong>not been tested in actual industrial environments</strong>. Results are based on
                  theoretical models and may not reflect real-world security postures accurately.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-200 mb-2">3. Manual Updates Only</h3>
                <p className="text-slate-400">
                  The vulnerability database is <strong>manually maintained</strong>. Unlike commercial tools with
                  automatic updates, new CVEs may take days or weeks to be added.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-200 mb-2">4. Geographic Bias</h3>
                <p className="text-slate-400">
                  The database is <strong>biased toward Western manufacturers</strong> (80%+ coverage). Chinese, Middle
                  Eastern, and local manufacturers are underrepresented, limiting usefulness in many regions.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-200 mb-2">5. No Active Scanning</h3>
                <p className="text-slate-400">
                  This tool <strong>does not perform network scanning</strong> or active vulnerability testing. It
                  relies entirely on user-provided information about their systems.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-200 mb-2">6. Limited Threat Coverage</h3>
                <p className="text-slate-400">
                  The framework <strong>does not assess</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400 ml-4 mt-2">
                  <li>Social engineering attacks</li>
                  <li>Physical security threats</li>
                  <li>Custom malware (e.g., Stuxnet-like attacks)</li>
                  <li>Insider threats</li>
                  <li>Supply chain vulnerabilities</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-200 mb-2">7. No Version-Specific Matching</h3>
                <p className="text-slate-400">
                  The tool matches vulnerabilities by <strong>device model and protocol only</strong>, without
                  considering firmware versions or specific configurations that may mitigate vulnerabilities.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-200 mb-2">8. LocalStorage Privacy Concerns</h3>
                <p className="text-slate-400">
                  While no data is sent externally, projects stored in browser localStorage are:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-400 ml-4 mt-2">
                  <li>Visible to anyone with access to the same browser/computer</li>
                  <li>Not encrypted at rest</li>
                  <li>Not password-protected</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-slate-800/50 border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-green-400">What This Tool IS Good For</h2>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Educational purposes in university courses and training programs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Understanding ICS security concepts (STRIDE, Attack Trees, IEC 62443)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Quick preliminary assessment before professional audit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Academic research and thesis projects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Offline security assessment (no internet required)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Free alternative for budget-constrained organizations</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-red-900/20 border-red-700">
            <h2 className="text-xl font-bold mb-4 text-red-400">Disclaimer</h2>
            <p className="text-slate-300 mb-3">
              This framework is provided "AS IS" without warranty of any kind. The author makes no claims regarding:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 ml-4">
              <li>Accuracy or completeness of vulnerability data</li>
              <li>Reliability of risk assessments</li>
              <li>Suitability for production use</li>
              <li>Compliance with specific industry regulations</li>
            </ul>
            <p className="text-yellow-300 mt-4 font-semibold">
              For critical infrastructure or production systems, always consult with certified ICS security
              professionals and use established commercial security platforms.
            </p>
          </Card>

          <Card className="p-6 bg-slate-800/50 border-slate-700">
            <h2 className="text-xl font-bold mb-4">Recommended Complementary Tools</h2>
            <p className="text-slate-300 mb-3">
              For comprehensive ICS security assessment, consider using this framework alongside:
            </p>
            <ul className="space-y-2 text-slate-400">
              <li>
                <strong>GRASSMARLIN</strong> - Network discovery and passive monitoring
              </li>
              <li>
                <strong>Nmap</strong> - Active network scanning
              </li>
              <li>
                <strong>Wireshark</strong> - Protocol analysis
              </li>
              <li>
                <strong>Shodan</strong> - Internet-exposed device discovery
              </li>
              <li>
                <strong>ICS-CERT Advisories</strong> - Up-to-date vulnerability information
              </li>
              <li>
                <strong>Commercial platforms</strong> - Dragos, Claroty, Nozomi (for production use)
              </li>
            </ul>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
