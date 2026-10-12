"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Bell,
  BookOpen,
  BrainCircuit,
  ChevronDown,
  Command,
  Cpu,
  Crosshair,
  FileBarChart2,
  LayoutGrid,
  Menu,
  Network,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { dashboardAssets, type DashboardAsset } from "@/lib/dashboard-data";

export type DashboardView = "overview" | "assets" | "threats";
const tools = [
  { label: "Risk assessment", href: "/assessment", icon: Crosshair },
  { label: "Risk simulation", href: "/risk-simulation", icon: Activity },
  { label: "Compliance", href: "/compliance-roadmap", icon: ShieldCheck },
  { label: "Reports & analytics", href: "/analytics", icon: FileBarChart2 },
  { label: "AI risk analysis", href: "/ai-prediction", icon: BrainCircuit },
];

export function DashboardShell({
  children,
  view,
  onViewChange,
  onInspect,
  onNotifications,
  alertCount,
  headerActions,
}: {
  children: ReactNode;
  view: DashboardView;
  onViewChange: (view: DashboardView) => void;
  onInspect: (asset: DashboardAsset) => void;
  onNotifications: () => void;
  alertCount: number;
  headerActions: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
  const matches = dashboardAssets
    .filter((asset) =>
      `${asset.id} ${asset.name} ${asset.model} ${asset.ip}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    .slice(0, 4);
  const navigate = (next: DashboardView) => {
    onViewChange(next);
    setMenuOpen(false);
  };
  return (
    <div className="command-center" data-menu-open={menuOpen}>
      <a className="cc-skip-link" href="#command-content">
        Skip to dashboard
      </a>
      {menuOpen && (
        <button
          className="cc-sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside className="cc-sidebar" aria-label="Main navigation">
        <div className="cc-workspace-switch">
          <span className="cc-workspace-icon">
            <Network size={17} />
          </span>
          <div>
            North plant<small>Manufacturing environment</small>
          </div>
          <ChevronDown size={14} />
        </div>
        <nav>
          <p className="cc-nav-label">WORKSPACE</p>
          <button
            className={`cc-nav-item ${view === "overview" ? "is-active" : ""}`}
            aria-current={view === "overview" ? "page" : undefined}
            onClick={() => navigate("overview")}
          >
            <LayoutGrid size={17} />
            <span>Overview</span>
            <span className="cc-nav-active-dot" />
          </button>
          <Link className="cc-nav-item" href="/network-topology">
            <Network size={17} />
            <span>Network topology</span>
          </Link>
          <button
            className={`cc-nav-item ${view === "assets" ? "is-active" : ""}`}
            onClick={() => navigate("assets")}
          >
            <Cpu size={17} />
            <span>Asset inventory</span>
            <span className="cc-nav-count">148</span>
          </button>
          <button
            className={`cc-nav-item ${view === "threats" ? "is-active" : ""}`}
            onClick={() => navigate("threats")}
          >
            <Bell size={17} />
            <span>Threat activity</span>
            {alertCount > 0 && <span className="cc-nav-alert-count">{alertCount}</span>}
          </button>
          <p className="cc-nav-label cc-nav-label-second">INTELLIGENCE</p>
          {tools.map(({ label, href, icon: Icon }) => (
            <Link key={href} className="cc-nav-item" href={href}>
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          ))}
          <Link className="cc-nav-item" href="/projects">
            <SlidersHorizontal size={17} />
            <span>Projects</span>
          </Link>
        </nav>
        <div className="cc-sidebar-bottom">
          <div className="cc-demo-note">
            <span className="cc-signal-dot" />
            <div>
              Reference environment<small>Demo telemetry · no live connection</small>
            </div>
          </div>
          <Link className="cc-nav-item" href="/simple-mode">
            <BookOpen size={17} />
            <span>Quick Start Guide</span>
            <ArrowUpRight size={14} />
          </Link>
          <Link className="cc-nav-item" href="/documentation">
            <Settings2 size={17} />
            <span>Documentation</span>
          </Link>
          <div className="cc-profile">
            <span className="cc-avatar">OS</span>
            <div>
              Plant operator<small>Demo workspace</small>
            </div>
            <ShieldCheck size={16} />
          </div>
        </div>
      </aside>
      <div className="cc-workspace">
        <header className="cc-topbar">
          <div className="cc-breadcrumb">
            <button
              className="cc-icon-button cc-menu-button"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/" className="cc-reference-brand" aria-label="ICS Risk Framework home">
              <ShieldCheck size={37} strokeWidth={1.5} />
              <span>
                ICS-Risk Framework<small>Industrial Command Center</small>
              </span>
            </Link>
          </div>
          <div className="cc-topbar-actions">
            <div
              className="cc-search"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setSearchOpen(false);
              }}
            >
              <Search size={15} />
              <input
                ref={searchRef}
                aria-label="Search assets"
                placeholder="Search assets, IP addresses..."
                value={query}
                onFocus={() => setSearchOpen(true)}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSearchOpen(true);
                }}
              />
              <kbd>
                <Command size={10} /> K
              </kbd>
              {searchOpen && query && (
                <div className="cc-search-results" role="region" aria-label="Search results">
                  <p className="cc-eyebrow">ASSET INTELLIGENCE</p>
                  {matches.length ? (
                    matches.map((asset) => (
                      <button
                        key={asset.id}
                        onClick={() => {
                          onInspect(asset);
                          setSearchOpen(false);
                          setQuery("");
                        }}
                      >
                        <span className="cc-search-icon">
                          <Cpu size={17} />
                        </span>
                        <span>
                          <strong>
                            {asset.id} <span>{asset.name}</span>
                          </strong>
                          <small>
                            {asset.ip} · {asset.model}
                          </small>
                        </span>
                        <ArrowUpRight size={14} />
                      </button>
                    ))
                  ) : (
                    <p className="cc-search-empty">
                      No assets match “{query}”. Try PLC or an IP address.
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="cc-header-command-actions">{headerActions}</div>
            <span className="cc-demo-badge">DEMO</span>
            <button
              className="cc-icon-button cc-notification-button"
              aria-label={`Notifications, ${alertCount} active alerts`}
              onClick={onNotifications}
            >
              <Bell size={18} />
              {alertCount > 0 && <span />}
            </button>
            <span className="cc-topbar-divider" />
            <span className="cc-avatar cc-topbar-avatar">OS</span>
          </div>
        </header>
        <main id="command-content" className="cc-main" tabIndex={-1}>
          {children}
        </main>
        <footer className="cc-footer">
          <span>
            <ShieldCheck size={13} /> ICS-Risk Framework{" "}
            <span className="cc-footer-separator">/</span> Industrial security, in focus.
          </span>
          <span>
            REFERENCE DATA <span className="cc-signal-dot" /> LOCAL WORKSPACE
          </span>
        </footer>
      </div>
    </div>
  );
}
