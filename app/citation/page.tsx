"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CitationPage() {
  const { translations } = useLanguage()
  const [copied, setCopied] = useState(false)

  const bibtex = `@software{ali2025icsrisk,
  author = {Ali, Osama},
  title = {ICS-Risk: An Open-Source Framework for Risk Assessment and Threat Modeling in Industrial Control Systems},
  year = {2025},
  version = {1.0.0},
  license = {MIT},
  url = {https://github.com/usaaaaasdc/ics-risk-framework}
}`

  const apa = `Ali, O. (2025). ICS-Risk: An Open-Source Framework for Risk Assessment and Threat Modeling in Industrial Control Systems (Version 1.0.0) [Computer software]. https://github.com/usaaaaasdc/ics-risk-framework`

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCitationCff = () => {
    const content = `cff-version: 1.2.0
message: "If you use this software, please cite it as below."
authors:
  - family-names: Ali
    given-names: Osama
    affiliation: Industrial Engineering Student, Turkey
title: "ICS-Risk: An Open-Source Framework for Risk Assessment and Threat Modeling in Industrial Control Systems"
version: 1.0.0
date-released: 2025-01-15
url: "https://github.com/usaaaaasdc/ics-risk-framework"
repository-code: "https://github.com/usaaaaasdc/ics-risk-framework"
license: MIT
keywords:
  - industrial-security
  - ics-security
  - scada
  - risk-assessment
  - cybersecurity
  - threat-modeling`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "CITATION.cff"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadLicense = () => {
    const content = `MIT License

Copyright (c) 2025 Osama Ali

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "LICENSE.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadCopyright = () => {
    const content = `# Copyright and Intellectual Property

## Copyright Notice

**ICS-Risk: An Open-Source Framework for Risk Assessment and Threat Modeling in Industrial Control Systems**

Copyright (c) 2025 Osama Ali

All rights reserved under the MIT License.

## Author Information

- **Author:** Osama Ali
- **Affiliation:** Industrial Engineering Student, Turkey
- **Version:** 1.0.0
- **Release Date:** January 2025

## License

This project is licensed under the MIT License.

### What This Means

- You are free to use, modify, and distribute this software
- You must include the original copyright notice in any copies
- The software is provided "as is" without warranty
- The author (Osama Ali) retains copyright ownership

## Attribution

If you use ICS-Risk in academic work, commercial projects, or research, please provide appropriate attribution.

### Academic Citation

Ali, O. (2025). ICS-Risk: An Open-Source Framework for Risk Assessment 
and Threat Modeling in Industrial Control Systems. GitHub Repository.

### BibTeX Format

@software{ali2025icsrisk,
  author = {Ali, Osama},
  title = {ICS-Risk: An Open-Source Framework for Risk Assessment and Threat Modeling in Industrial Control Systems},
  year = {2025},
  version = {1.0.0},
  license = {MIT},
  url = {https://github.com/usaaaaasdc/ics-risk-framework}
}

## Contact

For questions about copyright, licensing, or permissions:
- GitHub: https://github.com/usaaaaasdc

---

**Last Updated:** January 2025`

    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "COPYRIGHT.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {translations.backToHome}
            </Button>
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">How to Cite</h1>
          <p className="text-muted-foreground">
            If you use ICS-Risk in your research, academic work, or projects, please cite it appropriately.
          </p>
        </div>

        {/* Copyright Notice */}
        <Card>
          <CardHeader>
            <CardTitle>Copyright & License</CardTitle>
            <CardDescription>Intellectual property information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-mono text-sm">
                <strong>ICS-Risk Framework</strong>
                <br />
                Copyright (c) 2025 Osama Ali
                <br />
                Licensed under MIT License
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              This software is provided under the MIT License, which allows free use, modification, and distribution
              with proper attribution.
            </p>
          </CardContent>
        </Card>

        {/* BibTeX Citation */}
        <Card>
          <CardHeader>
            <CardTitle>BibTeX Format</CardTitle>
            <CardDescription>For LaTeX documents and academic papers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <pre className="p-4 bg-muted rounded-lg text-sm overflow-x-auto">
                <code>{bibtex}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 bg-transparent"
                onClick={() => handleCopy(bibtex)}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* APA Citation */}
        <Card>
          <CardHeader>
            <CardTitle>APA Format</CardTitle>
            <CardDescription>For general academic writing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <div className="p-4 bg-muted rounded-lg text-sm">
                <p>{apa}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 bg-transparent"
                onClick={() => handleCopy(apa)}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Plain Text Citation */}
        <Card>
          <CardHeader>
            <CardTitle>Plain Text</CardTitle>
            <CardDescription>For presentations and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg text-sm">
              <p>
                Ali, O. (2025). ICS-Risk: An Open-Source Framework for Risk Assessment and Threat Modeling in Industrial
                Control Systems. GitHub Repository.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Author Information */}
        <Card>
          <CardHeader>
            <CardTitle>Author Information</CardTitle>
            <CardDescription>About the developer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Author:</span>
                <span className="font-medium">Osama Ali</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Affiliation:</span>
                <span className="font-medium">Industrial Engineering Student, Turkey</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version:</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Release Date:</span>
                <span className="font-medium">January 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">License:</span>
                <span className="font-medium">MIT</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Files */}
        <Card>
          <CardHeader>
            <CardTitle>Download Citation Files</CardTitle>
            <CardDescription>Machine-readable citation formats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start bg-transparent" onClick={downloadCitationCff}>
                <Download className="h-4 w-4 mr-2" />
                Download CITATION.cff
              </Button>
              <Button variant="outline" className="justify-start bg-transparent" onClick={downloadLicense}>
                <Download className="h-4 w-4 mr-2" />
                Download LICENSE
              </Button>
              <Button variant="outline" className="justify-start bg-transparent" onClick={downloadCopyright}>
                <Download className="h-4 w-4 mr-2" />
                Download COPYRIGHT.md
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
