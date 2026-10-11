"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, domAnimation, LazyMotion, m, MotionConfig } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Bell,
  ChevronRight,
  Cpu,
  Crosshair,
  ShieldCheck,
  Target,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dashboardAlerts, dashboardAssets, type DashboardAsset } from "@/lib/dashboard-data";
import { DashboardShell, type DashboardView } from "./dashboard-shell";
import { MetricCard, StatusBadge } from "./dashboard-ui";
import { IndustrialScene, SecurityPosture } from "./industrial-scene";
import { AlertsPanel, AssetsPanel, CompliancePanel, RiskTrend } from "./analytics-panels";

function exportAssets() {
  const columns = ["Asset ID", "Name", "Model", "IP", "Zone", "Protocol", "Risk", "Status"];
  const rows = dashboardAssets.map((asset) => [
    asset.id,
    asset.name,
    asset.model,
    asset.ip,
    asset.zone,
    asset.protocol,
    asset.risk,
    asset.status,
  ]);
  const csv = [columns, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "ics-risk-demo-assets.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function CommandCenter() {
  const [view, setView] = useState<DashboardView>("overview");
  const [selectedAsset, setSelectedAsset] = useState<DashboardAsset | null>(null);
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState("");
  const returnFocus = useRef<HTMLElement | null>(null);
  const alertCount = dashboardAlerts.length - acknowledged.size;
  const actions = (
    <div className="cc-heading-actions">
      <button className="cc-button cc-button-secondary" onClick={exportAssets}>
        <ArrowDownToLine size={14} />
        Export snapshot
      </button>
      <Link href="/assessment" className="cc-button cc-button-primary">
        <Crosshair size={15} />
        New assessment
        <ArrowUpRight size={14} />
      </Link>
    </div>
  );
  const inspect = (asset: DashboardAsset) => {
    returnFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelectedAsset(asset);
  };
  const acknowledge = (id: string) => {
    setAcknowledged((current) => new Set([...current, id]));
    setNotice(`${id} acknowledged in this demo session.`);
  };
  const changeView = (next: DashboardView) => {
    setView(next);
    setNotice("");
  };
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <DashboardShell
          view={view}
          onViewChange={changeView}
          onInspect={inspect}
          onNotifications={() => changeView("threats")}
          alertCount={alertCount}
          headerActions={actions}
        >
          <div className="cc-page-heading">
            <div>
              <p className="cc-eyebrow">
                <span className="cc-heading-line" /> YOUR INDUSTRIAL PERIMETER. IN FOCUS.
              </p>
              <h1>
                Industrial Command Center<span>.</span>
              </h1>
              <p className="cc-page-subtitle">
                Clarity across your operations. Confidence in every decision.
              </p>
            </div>
            {actions}
          </div>
          <div className="cc-context-bar">
            <div className="cc-view-tabs" role="group" aria-label="Dashboard view">
              {[
                { id: "overview", label: "Overview" },
                { id: "assets", label: "Asset intelligence" },
                { id: "threats", label: "Threat activity" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  aria-pressed={view === tab.id}
                  onClick={() => changeView(tab.id as DashboardView)}
                >
                  {tab.label}
                  {tab.id === "threats" && alertCount > 0 && <span>{alertCount}</span>}
                </button>
              ))}
            </div>
            <span className="cc-snapshot-label">
              <span className="cc-signal-dot" /> DEMO SNAPSHOT
              <span className="cc-context-date"> / OCT 11, 2026</span>
            </span>
          </div>
          <div className="cc-metrics">
            <MetricCard
              label="Monitored assets"
              visual="assets"
              value={148}
              change="+12"
              note="vs. previous snapshot"
              icon={Cpu}
              tone="green"
              sparkline={[2, 3, 2.5, 5, 4, 6, 5, 8, 7, 10]}
            />
            <MetricCard
              label="Overall risk score"
              value={6.4}
              decimals={1}
              suffix="/ 10"
              change="−1.2"
              note="vs. previous snapshot"
              icon={Target}
              sparkline={[10, 9, 10, 8, 9, 6, 7, 5, 6, 4]}
            />
            <MetricCard
              label="Active alerts"
              visual="alerts"
              details={["Critical", "High", "Moderate"].map((severity) => ({
                label: severity,
                value: dashboardAlerts.filter(
                  (alert) => alert.severity === severity && !acknowledged.has(alert.id)
                ).length,
              }))}
              value={alertCount}
              change={`${dashboardAlerts.filter((alert) => alert.severity === "Critical" && !acknowledged.has(alert.id)).length} critical`}
              note="requires attention"
              icon={Bell}
              tone="amber"
              sparkline={[4, 5, 3, 4, 7, 5, 8, 6, 7, 6]}
            />
            <MetricCard
              label="Compliance score"
              visual="compliance"
              value={91}
              suffix="%"
              change="+4%"
              note="vs. previous snapshot"
              icon={ShieldCheck}
              tone="green"
              sparkline={[3, 3, 4, 3, 5, 5, 7, 6, 8, 9]}
            />
          </div>
          <div role="status" className={notice ? "cc-session-notice" : "cc-sr-only"}>
            {notice}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="cc-view-content"
            >
              {view === "overview" ? (
                <>
                  <div className="cc-hero-grid">
                    <IndustrialScene onInspect={inspect} suspended={selectedAsset !== null} />
                  </div>
                  <div className="cc-reference-analytics">
                    <AlertsPanel
                      acknowledged={acknowledged}
                      onAcknowledge={acknowledge}
                      onViewAll={() => changeView("threats")}
                    />
                    <RiskTrend />
                    <AssetsPanel onInspect={inspect} onViewAll={() => changeView("assets")} />
                  </div>
                  <div className="cc-bottom-grid">
                    <CompliancePanel />
                    <SecurityPosture />
                  </div>
                </>
              ) : view === "assets" ? (
                <>
                  <div className="cc-section-intro">
                    <Cpu size={18} />
                    <p>
                      Inspect the six priority assets in this reference environment. Filter by zone
                      to focus your review.
                    </p>
                  </div>
                  <AssetsPanel
                    expanded
                    onInspect={inspect}
                    onViewAll={() => changeView("assets")}
                  />
                  <div className="cc-analytics-grid">
                    <RiskTrend />
                    <CompliancePanel />
                  </div>
                </>
              ) : (
                <>
                  <div className="cc-section-intro">
                    <Bell size={18} />
                    <p>
                      Review reference alerts and acknowledge findings in this session. No live
                      monitoring is connected.
                    </p>
                  </div>
                  <div className="cc-threat-grid">
                    <AlertsPanel
                      expanded
                      acknowledged={acknowledged}
                      onAcknowledge={acknowledge}
                      onViewAll={() => changeView("threats")}
                    />
                    <div>
                      <SecurityPosture />
                      <Link className="cc-investigate-link" href="/mitre-attack">
                        <span>
                          Understand the path to your critical assets.
                          <strong>
                            Explore attack paths <ArrowUpRight size={14} />
                          </strong>
                        </span>
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </m.div>
          </AnimatePresence>
        </DashboardShell>
        <Dialog
          open={selectedAsset !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedAsset(null);
          }}
        >
          <DialogContent
            className="cc-dialog"
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              if (returnFocus.current?.isConnected) returnFocus.current.focus();
              else
                document
                  .querySelector<HTMLInputElement>('input[aria-label="Search assets"]')
                  ?.focus();
            }}
          >
            {selectedAsset && (
              <>
                <DialogHeader>
                  <p className="cc-eyebrow">
                    REFERENCE ASSET / {selectedAsset.zone.toUpperCase()} ZONE
                  </p>
                  <DialogTitle>
                    <Cpu size={21} />
                    {selectedAsset.id} <span>{selectedAsset.name}</span>
                  </DialogTitle>
                  <DialogDescription>
                    {selectedAsset.model} · {selectedAsset.ip}
                  </DialogDescription>
                </DialogHeader>
                <div className="cc-detail-risk">
                  <span>
                    Assessed risk
                    <strong>
                      {selectedAsset.risk.toFixed(1)}
                      <small> / 10</small>
                    </strong>
                  </span>
                  <StatusBadge status={selectedAsset.status} />
                </div>
                <dl className="cc-detail-properties">
                  <div>
                    <dt>Protocol</dt>
                    <dd>{selectedAsset.protocol}</dd>
                  </div>
                  <div>
                    <dt>Network zone</dt>
                    <dd>{selectedAsset.zone}</dd>
                  </div>
                </dl>
                <div className="cc-detail-finding">
                  <p className="cc-eyebrow">PRIORITY FINDING</p>
                  <p>{selectedAsset.finding}</p>
                </div>
                <p className="cc-detail-note">
                  Illustrative asset record. Start an assessment to evaluate your own equipment.
                </p>
                <Link href="/assessment" className="cc-button cc-button-primary">
                  Start risk assessment <ArrowUpRight size={15} />
                </Link>
              </>
            )}
          </DialogContent>
        </Dialog>
      </MotionConfig>
    </LazyMotion>
  );
}
