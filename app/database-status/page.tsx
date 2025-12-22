"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, AlertCircle, Database, Globe, Factory, Calendar } from "lucide-react"
import Link from "next/link"
import databaseMetadata from "@/lib/data/database-metadata.json"

export default function DatabaseStatusPage() {
  const { language, translations } = useLanguage()
  const isRTL = language === "ar"

  const downloadMetadata = () => {
    const dataStr = JSON.stringify(databaseMetadata, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "database-metadata.json"
    link.click()
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-8 ${isRTL ? "rtl" : "ltr"}`}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              {translations.backToHome || "Back to Home"}
            </Button>
          </Link>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Database Status & Verification
          </h1>
          <p className="text-xl text-slate-400">Complete transparency about our vulnerability database</p>
        </div>

        {/* Version Info */}
        <Card className="p-6 bg-slate-800/50 border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold">Database Version</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <p className="text-sm text-slate-400">Version</p>
              <p className="text-2xl font-bold text-blue-400">{databaseMetadata.version}</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <p className="text-sm text-slate-400">Last Updated</p>
              <p className="text-2xl font-bold text-green-400">{databaseMetadata.last_updated}</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-lg">
              <p className="text-sm text-slate-400">Total CVEs</p>
              <p className="text-2xl font-bold text-cyan-400">{databaseMetadata.total_cves}</p>
            </div>
          </div>
        </Card>

        {/* Data Quality */}
        <Card className="p-6 bg-slate-800/50 border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold">Data Quality Assurance</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(databaseMetadata.data_quality).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                {value ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                )}
                <span className="capitalize">{key.replace(/_/g, " ")}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Coverage by Vendor */}
        <Card className="p-6 bg-slate-800/50 border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Factory className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold">Vendor Coverage</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {Object.entries(databaseMetadata.coverage.vendors).map(([vendor, count]) => (
              <div key={vendor} className="flex justify-between p-3 bg-slate-900/50 rounded-lg">
                <span>{vendor}</span>
                <span className="font-bold text-blue-400">{count} CVEs</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Regional Coverage */}
        <Card className="p-6 bg-slate-800/50 border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold">Regional Coverage</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(databaseMetadata.coverage.regions).map(([region, count]) => (
              <div key={region} className="p-4 bg-slate-900/50 rounded-lg text-center">
                <p className="text-3xl font-bold text-cyan-400">{count}</p>
                <p className="text-slate-400">{region} Manufacturers</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Data Sources */}
        <Card className="p-6 bg-slate-800/50 border-slate-700">
          <h2 className="text-2xl font-bold mb-4">Verified Data Sources</h2>
          <ul className="space-y-2">
            {databaseMetadata.sources.map((source, index) => (
              <li key={index} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span>{source}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Changelog */}
        <Card className="p-6 bg-slate-800/50 border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-bold">Changelog</h2>
          </div>
          <div className="space-y-4">
            {databaseMetadata.changelog.map((entry, index) => (
              <div key={index} className="p-4 bg-slate-900/50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-blue-400">{entry.version}</span>
                  <span className="text-slate-400">{entry.date}</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {entry.changes.map((change, i) => (
                    <li key={i}>{change}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        {/* Verification Status */}
        <Card className="p-6 bg-slate-800/50 border-slate-700">
          <h2 className="text-2xl font-bold mb-4">Verification Status</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-950/30 border border-green-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-400">{databaseMetadata.verification_status.fully_verified}</p>
              <p className="text-slate-400">Fully Verified</p>
            </div>
            <div className="p-4 bg-yellow-950/30 border border-yellow-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-yellow-400">
                {databaseMetadata.verification_status.pending_verification}
              </p>
              <p className="text-slate-400">Pending Verification</p>
            </div>
            <div className="p-4 bg-red-950/30 border border-red-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-red-400">{databaseMetadata.verification_status.deprecated}</p>
              <p className="text-slate-400">Deprecated</p>
            </div>
          </div>
        </Card>

        {/* Download */}
        <div className="text-center">
          <Button onClick={downloadMetadata} size="lg" className="gap-2">
            <Database className="w-5 h-5" />
            Download Complete Metadata
          </Button>
        </div>
      </div>
    </div>
  )
}
