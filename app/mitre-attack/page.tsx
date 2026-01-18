"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Target, AlertTriangle, ChevronRight, Download, Search, Filter } from "lucide-react"
import { MITRE_TACTICS, MITRE_TECHNIQUES, getTechniquesByTactic } from "@/lib/mitre-attack-ics"

export default function MITREAttackPage() {
  // const { t } = useLanguage() // Not used in this component
  const [selectedTactic, setSelectedTactic] = useState(MITRE_TACTICS[0].id)
  const [searchQuery, setSearchQuery] = useState("")

  const selectedTacticData = MITRE_TACTICS.find((t) => t.id === selectedTactic)
  const techniques = getTechniquesByTactic(selectedTactic).filter(
    (tech) =>
      searchQuery === "" ||
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleExport = () => {
    const report = {
      framework: "MITRE ATT&CK for ICS",
      generatedAt: new Date().toISOString(),
      tactics: MITRE_TACTICS.map((tactic) => ({
        ...tactic,
        techniques: getTechniquesByTactic(tactic.id),
      })),
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mitre-attack-ics-${Date.now()}.json`
    a.click()
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <Target className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">MITRE ATT&CK for ICS</h1>
            <p className="text-muted-foreground">
              Threat tactics and techniques framework for Industrial Control Systems
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <Badge variant="outline" className="text-sm">
            <Shield className="h-3 w-3 mr-1" />
            {MITRE_TACTICS.length} Tactics
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Target className="h-3 w-3 mr-1" />
            {MITRE_TECHNIQUES.length} Techniques
          </Badge>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Framework
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search techniques..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tactics Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Tactics
              </CardTitle>
              <CardDescription>Select a tactic to view techniques</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {MITRE_TACTICS.map((tactic) => {
                  const techniqueCount = getTechniquesByTactic(tactic.id).length
                  const isSelected = selectedTactic === tactic.id

                  return (
                    <button
                      key={tactic.id}
                      onClick={() => setSelectedTactic(tactic.id)}
                      className={`w-full p-4 text-left hover:bg-accent transition-colors ${isSelected ? "bg-accent" : ""
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium mb-1">{tactic.name}</div>
                          <div className="text-xs text-muted-foreground">{tactic.id}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {techniqueCount}
                          </Badge>
                          <ChevronRight className={`h-4 w-4 transition-transform ${isSelected ? "rotate-90" : ""}`} />
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Techniques Detail */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedTacticData?.name}</CardTitle>
                  <CardDescription>{selectedTacticData?.description}</CardDescription>
                </div>
                <Badge variant="outline">{selectedTacticData?.id}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {techniques.map((technique) => (
                  <Card key={technique.id} className="border-l-4 border-l-red-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{technique.name}</CardTitle>
                          <CardDescription className="mt-1">{technique.id}</CardDescription>
                        </div>
                        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 ml-2" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Description */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">{technique.description}</p>
                      </div>

                      {/* Mitigation */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-green-600">Mitigation</h4>
                        <p className="text-sm text-muted-foreground">{technique.mitigation}</p>
                      </div>

                      {/* Detection */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-blue-600">Detection</h4>
                        <p className="text-sm text-muted-foreground">{technique.detection}</p>
                      </div>

                      {/* Examples */}
                      {technique.examples.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Real-World Examples</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {technique.examples.map((example, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground">
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {techniques.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No techniques found matching your search.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
