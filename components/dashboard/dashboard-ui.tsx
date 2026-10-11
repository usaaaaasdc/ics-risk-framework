"use client";

import { useEffect, type ReactNode } from "react";
import { animate, m, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, TriangleAlert, type LucideIcon } from "lucide-react";

export function Panel({
  title,
  eyebrow,
  action,
  children,
  className = "",
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`cc-panel ${className}`}>
      <div className="cc-panel-header">
        <div>
          {eyebrow && <p className="cc-eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`cc-status cc-status-${status.toLowerCase()}`}>
      <span />
      {status}
    </span>
  );
}

function AnimatedNumber({ value, decimals }: { value: number; decimals: number }) {
  const reducedMotion = useReducedMotion();
  const count = useMotionValue(value);
  const formatted = useTransform(count, (latest) => latest.toFixed(decimals));
  useEffect(() => {
    if (reducedMotion) return;
    count.set(0);
    const controls = animate(count, value, { duration: 1.15, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [count, value, reducedMotion]);
  return (
    <>
      <span className="cc-sr-only">{value.toFixed(decimals)}</span>
      <m.span aria-hidden="true">{formatted}</m.span>
    </>
  );
}

export function MetricCard({
  label,
  value,
  decimals = 0,
  suffix,
  change,
  note,
  icon: Icon,
  tone = "blue",
  sparkline,
  visual = "risk",
  details,
}: {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  change: string;
  note: string;
  icon: LucideIcon;
  tone?: "blue" | "amber" | "green";
  sparkline: number[];
  visual?: "risk" | "assets" | "alerts" | "compliance";
  details?: { label: string; value: number }[];
}) {
  const reducedMotion = useReducedMotion();
  const progress = visual === "risk" ? value / 10 : visual === "compliance" ? value / 100 : 0.986;
  const improved = tone !== "amber";
  const TrendIcon =
    tone === "amber" ? TriangleAlert : change.startsWith("+") ? ArrowUpRight : ArrowDownRight;
  return (
    <m.article
      className={`cc-metric cc-tone-${tone} cc-metric-${visual}`}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <div className="cc-metric-label">
        <Icon size={17} strokeWidth={1.6} />
        <span>{label}</span>
      </div>
      <div className="cc-metric-body">
        <div className={visual === "alerts" ? "cc-alert-value" : "cc-metric-ring"}>
          {visual !== "alerts" && (
            <svg viewBox="0 0 108 108" aria-hidden="true">
              <circle cx="54" cy="54" r="44" fill="none" stroke="#303b47" strokeWidth="7" />
              <m.circle
                cx="54"
                cy="54"
                r="44"
                fill="none"
                stroke={visual === "risk" ? "#e7c38d" : visual === "assets" ? "#85c5a2" : "#6cb8f2"}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={276.46}
                transform="rotate(-90 54 54)"
                initial={{ strokeDashoffset: 276.46 }}
                animate={{ strokeDashoffset: 276.46 * (1 - progress) }}
                transition={{ duration: reducedMotion ? 0 : 1.2 }}
              />
            </svg>
          )}
          <div className="cc-metric-value">
            <AnimatedNumber value={value} decimals={decimals} />
            <span>{suffix}</span>
          </div>
          <small>
            {visual === "assets"
              ? "Total assets"
              : visual === "alerts"
                ? "Active alerts"
                : visual === "compliance"
                  ? "Demo assurance"
                  : "Risk score"}
          </small>
        </div>
        <div className="cc-metric-detail">
          {details ? (
            details.map((item) => (
              <div key={item.label}>
                <i />
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))
          ) : (
            <>
              <strong className="cc-positive">{change}</strong>
              <span>{note}</span>
              <span className="cc-metric-risk-label">
                {visual === "risk"
                  ? "Moderate exposure"
                  : visual === "assets"
                    ? "6 priority assets"
                    : "3 frameworks"}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="cc-metric-footer">
        <span className={improved ? "cc-positive" : "cc-amber"}>
          <TrendIcon size={13} />
          {change}
        </span>
        <span>{note}</span>
      </div>
      <svg className="cc-sparkline" viewBox="0 0 112 36" fill="none" aria-hidden="true">
        <path
          d={sparkline
            .map((n, i) => `${i ? "L" : "M"}${(i * 112) / (sparkline.length - 1)},${36 - n * 3}`)
            .join(" ")}
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </m.article>
  );
}
