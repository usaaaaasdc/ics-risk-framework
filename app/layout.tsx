import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { LanguageProvider } from "@/lib/i18n/language-context"

// Font variables are imported but not currently used in className
// const geist = Geist({ subsets: ["latin"] })
// const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ICS-Risk Framework | Open-Source Industrial Security Assessment",
  description:
    "An open-source framework for risk assessment and threat modeling in industrial control systems. Employs multi-layered vulnerability mapping aligned with NVD and ICS-CERT advisories to identify attack vectors in legacy ICS environments.",
  authors: [{ name: "Osama Ali", url: "https://github.com/usaaaaasdc" }],
  creator: "Osama Ali",
  publisher: "ICS-Risk Framework",
  keywords: [
    "ICS Security",
    "SCADA Security",
    "Industrial Control Systems",
    "Risk Assessment",
    "Vulnerability Assessment",
    "OT Security",
    "IEC 62443",
    "NIST CSF",
    "CVSS",
    "STRIDE",
    "MITRE ATT&CK",
    "Cybersecurity",
    "Critical Infrastructure",
  ],
  applicationName: "ICS-Risk Framework",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_SA", "de_DE"],
    url: "https://ics-risk-framework.vercel.app",
    siteName: "ICS-Risk Framework",
    title: "ICS-Risk Framework | Industrial Security Assessment",
    description:
      "Open-source framework for ICS/SCADA security risk assessment with CVSS, STRIDE, IEC 62443, and MITRE ATT&CK integration.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ICS-Risk Framework",
    description: "Open-source ICS/SCADA security risk assessment framework",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`font-sans antialiased bg-background`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
