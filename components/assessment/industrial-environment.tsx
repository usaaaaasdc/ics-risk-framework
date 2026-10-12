"use client";

import {
  Component,
  useCallback,
  useId,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { Layers, Minus, Plus, RotateCcw } from "lucide-react";
import { IndustrialGlyph } from "@/components/network/topology-map";
import { useLanguage } from "@/lib/i18n/language-context";
import { assessmentCopy } from "@/lib/assessment-ui-copy";

const Factory = dynamic(() => import("./assessment-factory"), {
  ssr: false,
  loading: () => <div className="ac-factory-loading">ICS / OT · 3D…</div>,
});
function subscribeViewport(callback: () => void) {
  if (!window.matchMedia) return () => {};
  const media = window.matchMedia("(max-width: 1000px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function mobileSnapshot() {
  return !window.matchMedia || window.matchMedia("(max-width: 1000px)").matches;
}
class FactoryBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export interface EnvironmentAsset {
  id: string;
  label: string;
  kind: string;
  manufacturer?: string;
  zone: number;
}

export function IndustrialEnvironment({
  assets,
  selectedId,
  onSelect,
  compliance = false,
  risk,
  targets,
}: {
  assets: EnvironmentAsset[];
  selectedId?: string;
  onSelect: (id: string) => void;
  compliance?: boolean;
  risk?: number;
  targets?: Record<string, number>;
}) {
  const { language } = useLanguage();
  const c = assessmentCopy(language);
  const prefix = useId().replace(/:/g, "");
  const [mode, setMode] = useState<"plant" | "network">("plant");
  const [zoom, setZoom] = useState(1);
  const [failed, setFailed] = useState(false);
  const onFailure = useCallback(() => setFailed(true), []);
  const mobile = useSyncExternalStore(subscribeViewport, mobileSnapshot, () => true);
  const show3D = mode === "plant" && !mobile && !failed;
  const [command, setCommand] = useState<{
    action: "in" | "out" | "reset";
    sequence: number;
  } | null>(null);
  const move = (action: "in" | "out" | "reset") =>
    show3D
      ? setCommand((previous) => ({ action, sequence: (previous?.sequence ?? 0) + 1 }))
      : setZoom((previous) =>
          action === "reset"
            ? 1
            : Math.min(1.5, Math.max(0.7, previous + (action === "in" ? 0.15 : -0.15)))
        );
  const zones = c.zoneNames.split("|");
  const colors = ["#2cbbff", "#23d8cd", "#ffb951", "#ff6970"];
  const positions = assets.map((asset, i) => ({
    ...asset,
    x: 260 + (i % 4) * 150 + Math.floor(i / 4) * 32,
    y: 210 + Math.floor(i / 4) * 115 + (i % 2) * 28,
  }));
  return (
    <section className="ac-panel ac-environment">
      <div className="ac-panel-heading">
        <h2>{compliance ? c.zones : c.environment}</h2>
        <div className="ac-segment" role="group" aria-label={c.environment}>
          <button aria-pressed={mode === "plant"} onClick={() => setMode("plant")}>
            {c.plant}
          </button>
          <button aria-pressed={mode === "network"} onClick={() => setMode("network")}>
            {c.network}
          </button>
        </div>
      </div>
      <div className="ac-environment-canvas" dir="ltr">
        {show3D && (
          <div className="ac-factory-3d">
            <FactoryBoundary onFailure={onFailure}>
              <Factory
                assets={assets}
                selectedId={selectedId}
                onSelect={onSelect}
                onFailure={onFailure}
                inspect={c.inspect}
                sceneLabel={c.scene3d}
                command={command}
                risk={risk}
              />
            </FactoryBoundary>
            <div className="ac-factory-zones" aria-hidden="true">
              {zones.map((zone, i) => (
                <span key={zone} style={{ borderColor: colors[i], color: colors[i] }}>
                  {zone}
                  <small>
                    ICS / OT · {compliance ? `SL-T ${targets?.[`zone-${i}`] || "—"}` : c.context}
                  </small>
                </span>
              ))}
            </div>
          </div>
        )}
        <svg
          style={{ display: show3D ? "none" : undefined }}
          viewBox="0 0 960 470"
          role="group"
          aria-label={c.environment}
        >
          <defs>
            <linearGradient id={`${prefix}-steel`} x1="0" x2="1">
              <stop stopColor="#142635" />
              <stop offset=".42" stopColor="#8da5b5" />
              <stop offset=".52" stopColor="#3d5263" />
              <stop offset="1" stopColor="#152c3c" />
            </linearGradient>
            <linearGradient id={`${prefix}-floor`} x2="0" y2="1">
              <stop stopColor="#142c3b" />
              <stop offset="1" stopColor="#06101b" />
            </linearGradient>
            <radialGradient id={`${prefix}-light`}>
              <stop stopColor="#237fac" stopOpacity=".32" />
              <stop offset="1" stopColor="#07111d" stopOpacity="0" />
            </radialGradient>
            <pattern
              id={`${prefix}-grid`}
              width="38"
              height="24"
              patternUnits="userSpaceOnUse"
              patternTransform="skewX(-24)"
            >
              <path d="M38 0 H0 V24" fill="none" stroke="#2d5266" strokeWidth=".65" />
            </pattern>
          </defs>
          <rect width="960" height="470" fill="#081420" />
          <ellipse cx="500" cy="200" rx="490" ry="300" fill={`url(#${prefix}-light)`} />
          <g transform={`translate(480 245) scale(${zoom}) translate(-480 -245)`}>
            <path
              d="M160 80 L855 80 L947 410 L28 410 Z"
              fill={`url(#${prefix}-floor)`}
              stroke="#446274"
            />
            <path d="M160 80 L855 80 L947 410 L28 410 Z" fill={`url(#${prefix}-grid)`} />
            {mode === "plant" && (
              <g aria-hidden="true">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <g
                    key={i}
                    transform={`translate(${118 + i * 106} ${125 + (i % 3) * 80})`}
                    opacity=".9"
                  >
                    <ellipse cy="52" rx="42" ry="12" fill="#030910" />
                    <rect
                      x="-18"
                      y="-55"
                      width="36"
                      height="100"
                      rx="4"
                      fill={`url(#${prefix}-steel)`}
                      stroke="#698396"
                    />
                    <ellipse cy="-55" rx="18" ry="7" fill="#78909e" stroke="#91a4af" />
                    <ellipse cy="45" rx="18" ry="7" fill="#142d40" />
                    {[-35, -10, 15].map((y) => (
                      <path key={y} d={`M-20 ${y} q20 8 40 0`} stroke="#8c9fa9" fill="none" />
                    ))}
                    <path
                      d="M0 -62 V-90 H28 V45 H65"
                      stroke="#111d28"
                      strokeWidth="9"
                      fill="none"
                    />
                    <path
                      d="M0 -62 V-90 H28 V45 H65"
                      stroke="#677e8e"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path d="M-28 50 V-25 H-35 V-46" stroke="#638196" strokeWidth="2" fill="none" />
                  </g>
                ))}
                <g transform="translate(690 360)">
                  <ellipse rx="45" ry="14" fill="#03101c" />
                  <path d="M-20 0 V-28 H20 V0 Z" fill={`url(#${prefix}-steel)`} />
                  <path
                    d="M0 -25 L-35 -65 L-5 -102 L35 -90"
                    stroke="#536a7b"
                    strokeWidth="19"
                    fill="none"
                  />
                  <path
                    d="M0 -25 L-35 -65 L-5 -102 L35 -90"
                    stroke="#a4b5bf"
                    strokeWidth="7"
                    fill="none"
                  />
                  {[
                    [0, -25],
                    [-35, -65],
                    [-5, -102],
                  ].map(([x, y]) => (
                    <circle key={y} cx={x} cy={y} r="10" fill="#203b50" stroke="#79a3b6" />
                  ))}
                  <path d="M35 -90 l10 13 m-10 -13 l14 -7" stroke="#a7bac5" strokeWidth="6" />
                </g>
                <g transform="translate(260 365)">
                  <path
                    d="M-100 -12 L135 -42 L170 -19 L-65 12 Z"
                    fill="#152a39"
                    stroke="#82929e"
                    strokeWidth="3"
                  />
                  {Array.from({ length: 16 }, (_, i) => (
                    <path
                      key={i}
                      d={`M${-90 + i * 15} ${-11 - i * 1.9} l32 22`}
                      stroke="#6d8596"
                      strokeWidth="4"
                    />
                  ))}
                  <path d="M-75 8 V40 M130 -18 V18" stroke="#344f63" strokeWidth="6" />
                </g>
              </g>
            )}
            {[0, 1, 2, 3].map((i) => (
              <g key={i} aria-hidden="true">
                <path
                  d={`M${150 - i * 28} ${95 + i * 82} H${845 + i * 20}`}
                  stroke={colors[i]}
                  opacity=".7"
                  strokeDasharray="7 5"
                />
                <rect
                  x={i % 2 ? 730 : 35}
                  y={75 + i * 83}
                  width="190"
                  height="45"
                  rx="5"
                  fill="#081924"
                  fillOpacity=".94"
                  stroke={colors[i]}
                />
                <text x={i % 2 ? 742 : 47} y={94 + i * 83} fill={colors[i]} fontSize="13">
                  {zones[i]}
                </text>
                <text x={i % 2 ? 742 : 47} y={110 + i * 83} fill="#9bb5c6" fontSize="10">
                  {compliance ? "IEC 62443 · SL-T" : "ICS / OT"}
                </text>
              </g>
            ))}
            <g aria-hidden="true" className="ac-conduits">
              {positions.slice(1).map((p) => (
                <path
                  key={p.id}
                  d={`M${positions[0].x} ${positions[0].y} V${p.y + 36} H${p.x} V${p.y}`}
                  fill="none"
                  stroke={compliance ? colors[p.zone] : "#15bfff"}
                  strokeWidth="2"
                />
              ))}
              {positions.length === 1 && (
                <path
                  d={`M150 150 H${positions[0].x} V${positions[0].y}`}
                  stroke="#15bfff"
                  fill="none"
                  strokeWidth="2"
                />
              )}
            </g>
            {positions.map((p) => (
              <g
                key={p.id}
                className="ac-scene-asset"
                role="button"
                tabIndex={0}
                aria-label={`${c.inspect} ${p.label}`}
                aria-pressed={selectedId === p.id}
                onClick={() => onSelect(p.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(p.id);
                  }
                }}
                transform={`translate(${p.x} ${p.y})`}
              >
                <rect
                  x="-64"
                  y="-86"
                  width="128"
                  height="140"
                  fill="transparent"
                  aria-hidden="true"
                />
                <ellipse
                  rx="58"
                  ry="18"
                  fill={selectedId === p.id ? "#1ccaff" : "#063046"}
                  opacity=".4"
                  stroke={selectedId === p.id ? "#9de9ff" : "#40718b"}
                />
                <IndustrialGlyph kind={p.kind} prefix={prefix} />
                <rect
                  x="-64"
                  y="18"
                  width="128"
                  height="32"
                  rx="3"
                  fill="#07121d"
                  stroke={selectedId === p.id ? "#4ed9ff" : colors[p.zone]}
                />
                <text x="0" y="38" textAnchor="middle" fill="#e6f3fc" fontSize="12">
                  {p.label.length > 18 ? p.label.slice(0, 17) + "…" : p.label}
                </text>
                {risk !== undefined && p.id === selectedId && (
                  <g>
                    <circle
                      cy="-90"
                      r="13"
                      fill={risk >= 7 ? "#a52e40" : "#204563"}
                      stroke="#ffaf83"
                    />
                    <text y="-86" textAnchor="middle" fill="white" fontSize="11">
                      {risk.toFixed(1)}
                    </text>
                  </g>
                )}
              </g>
            ))}
          </g>
          <text x="30" y="450" fill="#7297ad" fontSize="10">
            {mode === "plant" ? "ISOMETRIC / INDUSTRIAL CONTEXT" : "LOGICAL / NETWORK CONTEXT"}
          </text>
        </svg>
        <div className="ac-map-controls">
          <button
            aria-label={c.zoomIn}
            disabled={!show3D && zoom >= 1.5}
            onClick={() => move("in")}
          >
            <Plus size={17} />
          </button>
          <button
            aria-label={c.zoomOut}
            disabled={!show3D && zoom <= 0.7}
            onClick={() => move("out")}
          >
            <Minus size={17} />
          </button>
          <button aria-label={c.resetView} onClick={() => move("reset")}>
            <RotateCcw size={16} />
          </button>
          <Layers size={15} />
        </div>
      </div>
      <p className="ac-scene-note">{c.schematic}</p>
    </section>
  );
}
