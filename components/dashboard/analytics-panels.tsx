"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowDownWideNarrow,
  ArrowUpRight,
  Check,
  ChevronRight,
  Cpu,
  Fingerprint,
  Network,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import {
  complianceStandards,
  dashboardAlerts,
  dashboardAssets,
  trendSeries,
  type DashboardAsset,
} from "@/lib/dashboard-data";
import { Panel, StatusBadge } from "./dashboard-ui";

export function RiskTrend() {
  const reducedMotion = useReducedMotion();
  const [period, setPeriod] = useState<keyof typeof trendSeries>("7D");
  const gradientId = useId();
  const values = trendSeries[period];
  const points = values.map((value, index) => [
    (index * 560) / (values.length - 1),
    150 - (value - 4) * 25,
  ]);
  const line = points.map(([x, y], index) => `${index ? "L" : "M"}${x},${y}`).join(" ");
  const labels =
    period === "24H"
      ? ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"]
      : period === "7D"
        ? ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
        : ["SEP 12", "SEP 17", "SEP 22", "SEP 27", "OCT 02", "OCT 07", "OCT 11"];
  return (
    <Panel
      title="Risk trend"
      eyebrow="EXPOSURE OVER TIME"
      className="cc-trend"
      action={
        <div className="cc-segmented" role="group" aria-label="Risk trend period">
          {(["24H", "7D", "30D"] as const).map((item) => (
            <button key={item} aria-pressed={period === item} onClick={() => setPeriod(item)}>
              {item}
            </button>
          ))}
        </div>
      }
    >
      <div className="cc-trend-summary">
        <strong>
          6.4<span> / 10</span>
        </strong>
        <span className="cc-positive">
          <ArrowDownRight size={14} />
          {(values[0] - values[values.length - 1]).toFixed(1)} pts{" "}
          <span>over {period === "24H" ? "24 hours" : period === "7D" ? "7 days" : "30 days"}</span>
        </span>
        <span className="cc-chart-legend">
          <i /> Overall risk
        </span>
      </div>
      <div className="cc-chart">
        <div className="cc-chart-scale">
          <span>10</span>
          <span>8</span>
          <span>6</span>
          <span>4</span>
        </div>
        <div className="cc-chart-plot">
          <svg
            viewBox="0 0 560 160"
            preserveAspectRatio="none"
            role="img"
            aria-label={`Overall risk trend over ${period}: ${values[0]} to ${values[values.length - 1]} out of 10`}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#77a8ef" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#77a8ef" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 50, 100, 150].map((y) => (
              <line key={y} x1="0" y1={y} x2="560" y2={y} stroke="#252c36" strokeDasharray="3 5" />
            ))}
            <path d={`${line} L560,160 L0,160 Z`} fill={`url(#${gradientId})`} />
            <m.path
              key={period}
              d={line}
              fill="none"
              stroke="#8bb8fc"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeOut" }}
            />
            <circle
              cx={560}
              cy={points[points.length - 1][1]}
              r="4"
              fill="#99c3ff"
              stroke="#172c47"
              strokeWidth="5"
            />
          </svg>
          <div className="cc-chart-labels">
            {labels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="cc-trend-note">
        <ShieldCheck size={13} />
        <span>Exposure is trending down across the reference environment.</span>
      </div>
    </Panel>
  );
}

export function AlertsPanel({
  acknowledged,
  onAcknowledge,
  onViewAll,
  expanded = false,
}: {
  acknowledged: Set<string>;
  onAcknowledge: (id: string) => void;
  onViewAll: () => void;
  expanded?: boolean;
}) {
  const active = dashboardAlerts.filter((alert) => !acknowledged.has(alert.id));
  const visible = expanded ? active : active.slice(0, 3);
  return (
    <Panel
      title={expanded ? "Threat activity" : "Recent alerts"}
      eyebrow="REQUIRES ATTENTION"
      className="cc-alerts"
      action={<span className="cc-count-badge">{active.length} active</span>}
    >
      <div className="cc-alert-list">
        {visible.length ? (
          visible.map((alert) => {
            const Icon =
              alert.icon === "access" ? Fingerprint : alert.icon === "firmware" ? Cpu : Network;
            return (
              <div className="cc-alert" key={alert.id}>
                <span
                  className={`cc-alert-icon ${alert.severity === "Critical" ? "is-critical" : ""}`}
                >
                  <Icon size={17} />
                </span>
                <div className="cc-alert-copy">
                  <h3>{alert.title}</h3>
                  <p>
                    {alert.asset}
                    <span>·</span>
                    {alert.time}
                  </p>
                  {expanded && <p className="cc-alert-description">{alert.detail}</p>}
                  <StatusBadge status={alert.severity} />
                </div>
                <button
                  className="cc-acknowledge cc-icon-button"
                  onClick={() => onAcknowledge(alert.id)}
                  aria-label={`Acknowledge ${alert.id}`}
                  title="Acknowledge in this session"
                >
                  <Check size={16} />
                </button>
              </div>
            );
          })
        ) : (
          <div className="cc-alert-empty">
            <ShieldCheck size={28} />
            <h3>All caught up.</h3>
            <p>All demo alerts have been acknowledged for this session.</p>
          </div>
        )}
      </div>
      {!expanded ? (
        <button className="cc-panel-footer-link" onClick={onViewAll}>
          View all activity <ArrowUpRight size={14} />
        </button>
      ) : (
        <p className="cc-panel-footnote">Acknowledgements apply to this demo session only.</p>
      )}
    </Panel>
  );
}

export function AssetsPanel({
  onInspect,
  expanded = false,
  onViewAll,
}: {
  onInspect: (asset: DashboardAsset) => void;
  expanded?: boolean;
  onViewAll: () => void;
}) {
  const [zone, setZone] = useState("All zones");
  const [descending, setDescending] = useState(true);
  const filtered = dashboardAssets
    .filter((asset) => zone === "All zones" || asset.zone === zone)
    .sort((a, b) => (descending ? b.risk - a.risk : a.risk - b.risk));
  const visible = expanded ? filtered : filtered.slice(0, 4);
  return (
    <Panel
      title={expanded ? "Asset intelligence" : "Highest-risk assets"}
      eyebrow="PRIORITIZE YOUR PERIMETER"
      className="cc-assets"
      action={
        <div className="cc-assets-actions">
          <button
            className="cc-mobile-sort"
            onClick={() => setDescending(!descending)}
            aria-label={`Sort risk ${descending ? "ascending" : "descending"}`}
          >
            Risk <ArrowDownWideNarrow size={13} />
          </button>
          <label className="cc-zone-filter">
            <Network size={13} />
            <span className="cc-sr-only">Filter assets by zone</span>
            <select
              aria-label="Filter assets by zone"
              value={zone}
              onChange={(event) => setZone(event.target.value)}
            >
              {["All zones", "Control", "Supervisory", "DMZ"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
      }
    >
      <div className="cc-table-scroll">
        <table>
          <caption className="cc-sr-only">
            Priority assets in the demo environment. Select an asset to inspect its security
            finding.
          </caption>
          <thead>
            <tr>
              <th>ASSET / DEVICE</th>
              <th>ZONE</th>
              <th>
                <button
                  onClick={() => setDescending(!descending)}
                  aria-label={`Sort risk ${descending ? "ascending" : "descending"}`}
                >
                  RISK SCORE
                  <ArrowDownWideNarrow size={12} />
                </button>
              </th>
              <th>STATUS</th>
              <th>
                <span className="cc-sr-only">Inspect</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((asset) => (
              <tr key={asset.id}>
                <td>
                  <button className="cc-asset-name" onClick={() => onInspect(asset)}>
                    <span className="cc-device-icon">
                      <Cpu size={16} />
                    </span>
                    <span>
                      <strong>
                        {asset.id}
                        <small>{asset.name}</small>
                      </strong>
                      <span>{asset.model}</span>
                    </span>
                  </button>
                </td>
                <td data-label="Zone">
                  <span className="cc-zone">{asset.zone}</span>
                </td>
                <td data-label="Risk score">
                  <span className={`cc-risk-number ${asset.risk >= 8 ? "cc-amber" : ""}`}>
                    {asset.risk.toFixed(1)}
                    <span>/10</span>
                  </span>
                  <span className="cc-risk-bar">
                    <i
                      style={{
                        width: `${asset.risk * 10}%`,
                        background: asset.risk >= 8 ? "#d9a36b" : "#8aa7cd",
                      }}
                    />
                  </span>
                </td>
                <td data-label="Status">
                  <StatusBadge status={asset.status} />
                </td>
                <td>
                  <button
                    className="cc-icon-button"
                    aria-label={`Inspect ${asset.id}`}
                    onClick={() => onInspect(asset)}
                  >
                    <ArrowUpRight size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="cc-table-footer">
        <span>{visible.length} priority assets · Reference inventory: 148</span>
        {!expanded && (
          <button onClick={onViewAll}>
            View asset inventory <ArrowUpRight size={13} />
          </button>
        )}
      </div>
    </Panel>
  );
}

export function CompliancePanel() {
  const reducedMotion = useReducedMotion();
  return (
    <Panel
      title="Compliance overview"
      eyebrow="BUILT FOR ASSURANCE"
      className="cc-compliance"
      action={<ShieldCheck size={17} className="cc-muted" />}
    >
      <div className="cc-compliance-list">
        {complianceStandards.map((standard) => (
          <Link key={standard.name} href={standard.href}>
            <div className="cc-compliance-heading">
              <span>{standard.name}</span>
              <strong>
                {standard.progress}
                <small>%</small>
                <ChevronRight size={13} />
              </strong>
            </div>
            <div className="cc-progress-track">
              <m.div
                initial={{ width: 0 }}
                whileInView={{ width: `${standard.progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: reducedMotion ? 0 : 0.9, ease: "easeOut" }}
              />
            </div>
            <p>{standard.subtitle}</p>
          </Link>
        ))}
      </div>
      <div className="cc-compliance-note">
        <TriangleAlert size={13} />
        <span>Illustrative scores. Run an assessment to evaluate your environment.</span>
      </div>
      <Link href="/compliance-roadmap" className="cc-panel-footer-link">
        Open compliance roadmap <ArrowUpRight size={14} />
      </Link>
    </Panel>
  );
}
