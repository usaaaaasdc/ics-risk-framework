"use client";

import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { Panel } from "./dashboard-ui";
export { IndustrialViewer as IndustrialScene } from "./industrial-viewer";

export function SecurityPosture() {
  const reducedMotion = useReducedMotion();
  return (
    <Panel
      title="Security posture"
      eyebrow="ENVIRONMENT HEALTH"
      className="cc-posture"
      action={<ShieldCheck size={17} className="cc-muted" />}
    >
      <div className="cc-posture-gauge">
        <svg viewBox="0 0 180 120" aria-hidden="true">
          <path
            d="M25 100 A70 70 0 1 1 155 100"
            fill="none"
            stroke="#252a32"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <m.path
            d="M25 100 A70 70 0 1 1 155 100"
            fill="none"
            stroke="#75a9f9"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 0.82 }}
            viewport={{ once: true }}
            transition={{ duration: reducedMotion ? 0 : 1.2, ease: "easeOut" }}
          />
          <text x="90" y="72" textAnchor="middle" fill="#edf1f8" fontSize="38" fontWeight="500">
            82
            <tspan fontSize="15" fill="#7e8999">
              {" "}
              /100
            </tspan>
          </text>
          <text x="90" y="94" textAnchor="middle" fill="#9aacc5" fontSize="10" letterSpacing="2">
            RESILIENCE SCORE
          </text>
        </svg>
      </div>
      <div className="cc-posture-caption">
        <span className="cc-signal-dot" />
        Your perimeter is holding strong
      </div>
      <div className="cc-posture-stats">
        <div>
          <span>Network segmentation</span>
          <strong>
            Healthy
            <span className="cc-green-dot" />
          </strong>
        </div>
        <div>
          <span>Asset coverage</span>
          <strong>
            98.6%
            <span className="cc-green-dot" />
          </strong>
        </div>
        <div>
          <span>Patch compliance</span>
          <strong className="cc-amber">
            Needs attention
            <span className="cc-amber-dot" />
          </strong>
        </div>
      </div>
      <Link className="cc-panel-footer-link" href="/compliance-roadmap">
        View security roadmap <ArrowUpRight size={14} />
      </Link>
    </Panel>
  );
}
