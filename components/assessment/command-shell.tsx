"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  Boxes,
  Calendar,
  BarChart3,
  BrainCircuit,
  FileCheck2,
  Globe,
  LayoutDashboard,
  Menu,
  Network,
  Search,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { useLanguage, type Language } from "@/lib/i18n/language-context";
import { assessmentCopy } from "@/lib/assessment-ui-copy";
import { intelligenceCopy } from "@/lib/intelligence-copy";
import "./command-center.css";

export function CommandShell({
  section,
  title,
  subtitle,
  children,
  disclaimer,
}: {
  section: "assessment" | "simple" | "iec" | "roadmap" | "analytics" | "ai";
  title: string;
  subtitle?: string;
  children: ReactNode;
  disclaimer?: string;
}) {
  const { language, setLanguage, isRTL } = useLanguage();
  const c = assessmentCopy(language);
  const intelligence = intelligenceCopy(language);
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const links = [
    { href: "/", label: c.dashboard, icon: LayoutDashboard, id: "home" },
    { href: "/assessment", label: c.assessment, icon: ShieldAlert, id: "assessment" },
    { href: "/simple-mode", label: c.simple, icon: Boxes, id: "simple" },
    { href: "/iec-calculator", label: "IEC 62443", icon: FileCheck2, id: "iec" },
    { href: "/compliance-roadmap", label: c.roadmap, icon: Calendar, id: "roadmap" },
    { href: "/network-topology", label: c.topology, icon: Network, id: "topology" },
    { href: "/analytics", label: intelligence.analytics, icon: BarChart3, id: "analytics" },
    { href: "/ai-prediction", label: intelligence.ai, icon: BrainCircuit, id: "ai" },
    { href: "/projects", label: c.projects, icon: Boxes, id: "projects" },
  ];
  return (
    <div className="ac-workspace dark" dir={isRTL ? "rtl" : "ltr"}>
      <a className="ac-skip" href="#ac-content">
        {title}
      </a>
      <header className="ac-header">
        <Link href="/" className="ac-brand">
          <ShieldCheck size={36} />
          <span>
            ICS-Risk Framework<small>{c.command}</small>
          </span>
        </Link>
        <nav aria-label={c.command}>
          {links
            .filter((l) => ["home", "assessment", "iec", "roadmap"].includes(l.id))
            .map((l) => (
              <Link key={l.id} href={l.href} aria-current={l.id === section ? "page" : undefined}>
                <l.icon size={18} />
                {l.label}
              </Link>
            ))}
        </nav>
        <div className="ac-search">
          <Search size={16} />
          <input
            aria-label={c.search}
            placeholder={c.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setQuery("");
            }}
          />
          {query && (
            <div className="ac-search-results" role="region" aria-label={c.search}>
              {links
                .filter((l) => l.label.toLowerCase().includes(query.toLowerCase()))
                .map((l) => (
                  <Link key={l.id} href={l.href} onClick={() => setQuery("")}>
                    {l.label}
                  </Link>
                ))}
            </div>
          )}
        </div>
        <label className="ac-language">
          <Globe size={16} />
          <select
            aria-label={c.language}
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
          >
            <option value="en">EN</option>
            <option value="ar">العربية</option>
            <option value="de">DE</option>
            <option value="tr">TR</option>
          </select>
        </label>
        <button
          className="ac-menu"
          aria-label={c.menu}
          aria-expanded={menu}
          aria-controls="ac-sidebar"
          onClick={() => setMenu(!menu)}
        >
          <Menu size={22} />
        </button>
      </header>
      <aside id="ac-sidebar" className={`ac-sidebar ${menu ? "is-open" : ""}`}>
        <nav aria-label={c.menu}>
          {links.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              aria-current={l.id === section ? "page" : undefined}
              onClick={() => setMenu(false)}
            >
              <l.icon size={21} />
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ac-sidebar-art" aria-hidden="true">
          <svg viewBox="0 0 200 210">
            <defs>
              <linearGradient id="ac-tower" x2="1">
                <stop stopColor="#07121e" />
                <stop offset=".4" stopColor="#40566a" />
                <stop offset=".6" stopColor="#102431" />
                <stop offset="1" stopColor="#07121e" />
              </linearGradient>
            </defs>
            {[20, 55, 88, 130, 164].map((x, i) => (
              <g key={x} fill="url(#ac-tower)" stroke="#557187" strokeWidth=".8">
                <rect x={x} y={90 - (i % 3) * 26} width="17" height={120 + (i % 3) * 26} />
                <ellipse cx={x + 8.5} cy={90 - (i % 3) * 26} rx="8.5" ry="4" />
                {[0, 1, 2, 3, 4].map((n) => (
                  <path key={n} d={`M${x - 3} ${110 + n * 18 - (i % 3) * 10} h23`} />
                ))}
                <path d={`M${x + 8} ${90 - (i % 3) * 26} v-40 h5 v-8`} fill="none" />
              </g>
            ))}
            <path d="M0 195 H200 M0 172 H200" stroke="#00b4ee" opacity=".45" />
          </svg>
        </div>
        <p className="ac-local">
          <span />
          {c.local}
          <small>ICS / OT · IEC 62443</small>
        </p>
      </aside>
      <main id="ac-content" className="ac-content">
        <div className="ac-page-heading">
          <div>
            <span className="ac-eyebrow">ICS / OT SECURITY</span>
            <h1>{title}</h1>
            <p>{subtitle ?? disclaimer ?? c.disclaimer}</p>
          </div>
        </div>
        {children}
        <footer className="ac-disclaimer">
          <ShieldCheck size={17} />
          <span>{disclaimer ?? c.disclaimer}</span>
        </footer>
      </main>
    </div>
  );
}

export function ModeSwitch({
  projectId,
  simple = false,
}: {
  projectId?: string;
  simple?: boolean;
}) {
  const { language } = useLanguage();
  const c = assessmentCopy(language);
  return (
    <nav className="ac-mode-switch" aria-label={c.assessment}>
      <Link
        href={projectId ? `/assessment?projectId=${encodeURIComponent(projectId)}` : "/assessment"}
        aria-current={!simple ? "page" : undefined}
      >
        <ShieldAlert size={16} />
        {c.advanced}
      </Link>
      <Link href="/simple-mode" aria-current={simple ? "page" : undefined}>
        <Boxes size={16} />
        {c.simple}
      </Link>
    </nav>
  );
}

export function ScoreRing({
  value,
  max = 100,
  label,
  color = "#20c6ff",
}: {
  value: number | null;
  max?: number;
  label: string;
  color?: string;
}) {
  const fraction = Math.min(1, Math.max(0, (value ?? 0) / max));
  return (
    <div
      className="ac-score-ring"
      role="img"
      aria-label={`${label}: ${value === null ? "—" : value} / ${max}`}
    >
      <svg viewBox="0 0 160 160" aria-hidden="true">
        <circle cx="80" cy="80" r="65" fill="none" stroke="#243849" strokeWidth="11" />
        <circle
          cx="80"
          cy="80"
          r="65"
          fill="none"
          stroke={color}
          strokeWidth="11"
          strokeDasharray={`${fraction * 408.4} 408.4`}
          transform="rotate(-90 80 80)"
          strokeLinecap="round"
        />
      </svg>
      <div dir="ltr">
        <strong>{value === null ? "—" : value}</strong>
        <small>/ {max}</small>
      </div>
    </div>
  );
}
