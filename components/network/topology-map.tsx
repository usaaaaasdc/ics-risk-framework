"use client";

import { useId, useRef, useState, type Ref } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import type { NetworkNode, NetworkTopology } from "@/lib/network-topology";

export const riskColor = (risk: number) =>
  risk >= 7 ? "#ff4855" : risk >= 4 ? "#ffb940" : "#30d9ba";
export type MapLabels = {
  inspect: string;
  zoomIn: string;
  zoomOut: string;
  reset: string;
  map: string;
  risk: string;
};
const defaultLabels: MapLabels = {
  inspect: "Inspect",
  zoomIn: "Zoom topology in",
  zoomOut: "Zoom topology out",
  reset: "Reset topology view",
  map: "Industrial network topology",
  risk: "Risk",
};

/** Local vector geometry: no textures, remote models or WebGL needed in 2D mode. */
export function IndustrialGlyph({ kind = "PLC", prefix }: { kind?: string; prefix: string }) {
  const screen = /hmi|scada|historian/i.test(kind);
  const field = /sensor|actuator|field/i.test(kind);
  return (
    <g aria-hidden="true">
      <ellipse cy="8" rx="48" ry="12" fill="#000" opacity=".65" />
      {field ? (
        <g stroke="#69818e" strokeWidth="2">
          <path d="M-48 0 H48 M-33 -10 V10 M33 -10 V10" strokeWidth="9" stroke="#233440" />
          <ellipse cx="-33" rx="5" ry="13" fill="#344954" />
          <ellipse cx="33" rx="5" ry="13" fill="#344954" />
          <path d="M-12 -8 V-28 H12 V-8" fill={`url(#${prefix}-steel)`} />
          <ellipse cy="-28" rx="12" ry="5" fill="#536a75" />
          <path d="M0 -32 V-48 M-12 -48 H12" stroke="#00c6ff" strokeWidth="3" />
        </g>
      ) : (
        <g stroke="#536b7b" strokeWidth=".8">
          <path
            d={
              screen ? "M-39 -57 L26 -65 L42 -54 L-23 -46 Z" : "M-35 -76 L21 -84 L38 -73 L-18 -65 Z"
            }
            fill="#607785"
          />
          <path
            d={screen ? "M26 -65 L42 -54 V-12 L26 -22 Z" : "M21 -84 L38 -73 V-2 L21 -12 Z"}
            fill="#142633"
          />
          <path
            d={screen ? "M-39 -57 L26 -65 V-22 L-39 -14 Z" : "M-35 -76 L21 -84 V-12 L-35 -4 Z"}
            fill={`url(#${prefix}-steel)`}
          />
          {screen ? (
            <>
              <path d="M-34 -52 L21 -59 V-28 L-34 -21 Z" fill="#042c44" stroke="#00bcff" />
              <path
                d="M-28 -32 L-21 -42 L-15 -36 L-8 -49 L0 -38 L13 -47"
                stroke="#00c9ff"
                strokeWidth="1.8"
                fill="none"
              />
              <path d="M-26 -46 V-26 M-9 -48 V-29 M9 -50 V-32" opacity=".35" />
              <path d="M-5 -16 V0 M-20 3 L15 -2 L24 4 L-12 9 Z" fill="#49616f" strokeWidth="3" />
            </>
          ) : (
            <>
              {[-26, -14, -2, 10].map((x) => (
                <g key={x}>
                  <path d={`M${x} -65 l8 -1 v48 l-8 1 Z`} fill="#101e29" />
                  {Array.from({ length: 6 }, (_, i) => (
                    <path key={i} d={`M${x + 2} ${-53 + i * 5} l4 -.5`} stroke="#6a8291" />
                  ))}
                  <circle cx={x + 4} cy="-60" r="1.5" fill="#00d8f9" stroke="none" />
                </g>
              ))}
              <path d="M-30 -10 L17 -17" stroke="#00b8fa" />
            </>
          )}
        </g>
      )}
    </g>
  );
}

export function TopologyMap({
  topology,
  selectedId,
  onSelect,
  nodeKinds = {},
  zoneNames,
  attackPaths = [],
  showAttacks = false,
  risks = true,
  network = true,
  radar = true,
  compact = false,
  query = "",
  svgRef,
  sourceLabel = "Demo data · Illustrative connections",
  labels = defaultLabels,
}: {
  topology: NetworkTopology;
  selectedId?: string | null;
  onSelect: (node: NetworkNode) => void;
  nodeKinds?: Record<string, string>;
  zoneNames?: string[];
  attackPaths?: string[][];
  showAttacks?: boolean;
  risks?: boolean;
  network?: boolean;
  radar?: boolean;
  compact?: boolean;
  query?: string;
  svgRef?: Ref<SVGSVGElement>;
  sourceLabel?: string;
  labels?: MapLabels;
}) {
  const prefix = useId().replace(/:/g, "");
  const [view, setView] = useState({ zoom: 1, x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; originX: number; originY: number } | null>(null);
  const count = Math.max(1, topology.zones.length);
  const band = 480 / count;
  const edge = (y: number) => 185 - (y - 60) * 0.29;
  const points = new Map(
    topology.nodes.map((node) => {
      const index = topology.zones.findIndex((zone) => zone.nodes.includes(node.id));
      const y = 60 + (Math.max(0, index) + 0.65) * band;
      const x = 550 + ((node.x ?? 400) - 400) * (1.08 + (y - 60) / 900);
      return [node.id, { x, y }];
    })
  );
  const attackEdges = new Set(
    attackPaths.flatMap((path) =>
      path.slice(1).flatMap((id, i) => [`${path[i]}:${id}`, `${id}:${path[i]}`])
    )
  );
  const zoom = (factor: number) =>
    setView((v) => ({ ...v, zoom: Math.max(0.6, Math.min(2.8, v.zoom * factor)) }));
  return (
    <div className={`nt-map ${compact ? "nt-map-compact" : ""}`}>
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1100 650"
        preserveAspectRatio="none"
        role="group"
        aria-label={labels.map}
        onPointerDown={(event) => {
          if ((event.target as Element).closest('[role="button"]')) return;
          drag.current = { x: event.clientX, y: event.clientY, originX: view.x, originY: view.y };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          const scale = 1100 / event.currentTarget.getBoundingClientRect().width;
          setView((v) => ({
            ...v,
            x: drag.current!.originX + (event.clientX - drag.current!.x) * scale,
            y: drag.current!.originY + (event.clientY - drag.current!.y) * scale,
          }));
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <defs>
          <linearGradient id={`${prefix}-steel`} x1="0" x2="1">
            <stop stopColor="#14232f" />
            <stop offset=".45" stopColor="#526978" />
            <stop offset=".5" stopColor="#304552" />
            <stop offset="1" stopColor="#172834" />
          </linearGradient>
          <radialGradient id={`${prefix}-floor`}>
            <stop stopColor="#102b3d" />
            <stop offset="1" stopColor="#030a10" />
          </radialGradient>
          <linearGradient id={`${prefix}-sweep`}>
            <stop stopColor="#00bfff" stopOpacity="0" />
            <stop offset="1" stopColor="#00bfff" stopOpacity=".25" />
          </linearGradient>
          <pattern id={`${prefix}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0 H0 V40" fill="none" stroke="#204456" strokeWidth=".7" />
          </pattern>
          <clipPath id={`${prefix}-floor-clip`}>
            <path d="M190 46 H910 L1090 612 H10 Z" />
          </clipPath>
        </defs>
        <rect width="1100" height="650" fill="#040b12" />
        <g
          transform={`translate(${550 + view.x} ${325 + view.y}) scale(${view.zoom}) translate(-550 -325)`}
        >
          <path d="M190 46 H910 L1090 612 H10 Z" fill={`url(#${prefix}-floor)`} stroke="#294555" />
          <g clipPath={`url(#${prefix}-floor-clip)`}>
            <g transform="translate(550 200) scale(1 .52) rotate(45)">
              <rect x="-850" y="-850" width="1700" height="1700" fill={`url(#${prefix}-grid)`} />
            </g>
            {Array.from({ length: 5 }, (_, row) =>
              Array.from({ length: 7 }, (_, col) => (
                <g
                  key={`${row}-${col}`}
                  transform={`translate(${228 + col * 100 - row * 16} ${108 + row * 92})`}
                  opacity=".42"
                >
                  <path d="M-29 0 L18 -8 L37 5 L-10 13 Z" fill="#0b1720" stroke="#375160" />
                  <path
                    d="M-24 -7 V-29 L15 -34 L28 -24 V0 L-10 7 Z"
                    fill={`url(#${prefix}-steel)`}
                    stroke="#496575"
                    strokeWidth=".7"
                  />
                  <path d="M-24 -29 L15 -34 L28 -24 L-10 -19 Z" fill="#455b68" />
                  <path
                    d="M-10 -19 V7 M-19 -17 V-6 M-15 -17 V-6 M3 -25 V-14 M7 -26 V-15"
                    stroke="#6a8391"
                  />
                  <path
                    d="M-35 8 V-14 H-24 M28 -13 H40 V7 H53"
                    fill="none"
                    stroke="#68818d"
                    strokeWidth="3"
                  />
                  <circle cx="20" cy="-13" r="1.5" fill="#00c5f7" />
                </g>
              ))
            )}
            {[200, 320, 440].map((y) => (
              <g key={y} opacity=".65">
                <path d={`M150 ${y} H950 M150 ${y + 6} H950`} stroke="#334e60" strokeWidth="2" />
                <path d={`M150 ${y + 3} H950`} stroke="#647d86" strokeWidth=".6" />
              </g>
            ))}
          </g>
          {/* Process equipment, service pipes and gantries establish industrial depth. */}
          {[0, 1].map((side) => (
            <g
              key={side}
              transform={side ? "translate(1100 0) scale(-1 1)" : undefined}
              opacity=".8"
            >
              {[0, 1, 2, 3].map((i) => (
                <g key={i} transform={`translate(${62 + i * 20} ${260 + i * 54})`}>
                  <path
                    d="M0 0 V-68 Q0 -85 18 -85 Q36 -85 36 -68 V0 Z"
                    fill={`url(#${prefix}-steel)`}
                    stroke="#4a6475"
                  />
                  <ellipse cx="18" cy="-68" rx="18" ry="7" fill="#304955" stroke="#647d89" />
                  <path
                    d="M18 -85 V-115 M-6 -45 H42 M-6 -18 H42 M6 -60 V-6 M31 -61 V-6"
                    fill="none"
                    stroke="#64808e"
                    strokeWidth="2"
                  />
                  <path
                    d="M0 -12 H-24 V22 H51 V-5 H75"
                    fill="none"
                    stroke="#273f4d"
                    strokeWidth="6"
                  />
                  <path d="M18 -96 V-103" stroke="#00baff" strokeWidth="3" />
                </g>
              ))}
              <path
                d="M72 564 L214 132 M86 564 L226 132 M92 535 H50 M114 468 H75 M138 393 H98 M162 319 H122 M186 246 H146"
                fill="none"
                stroke="#375161"
                strokeWidth="2"
              />
            </g>
          ))}
          {topology.zones.map((zone, i) => {
            const y = 60 + i * band,
              bottom = y + band;
            const color = ["#2589bd", "#00c1df", "#ffb940", "#ef5b4b"][i % 4];
            return (
              <g key={zone.id}>
                <path
                  d={`M${edge(y)} ${y} H${1100 - edge(y)} L${1100 - edge(bottom)} ${bottom} H${edge(bottom)} Z`}
                  fill={color}
                  fillOpacity=".025"
                  stroke={color}
                  strokeOpacity=".7"
                  strokeDasharray="9 6"
                  strokeWidth="1.5"
                />
                <g transform={`translate(${edge(y) + 12} ${y + 18})`}>
                  <rect
                    x="-6"
                    y="-13"
                    width="155"
                    height="34"
                    rx="3"
                    fill="#05121d"
                    stroke={color}
                    strokeOpacity=".5"
                  />
                  <text fontFamily="Arial,sans-serif" fontSize="11" fill={color} fontWeight="700">
                    {zoneNames?.[i] ?? zone.name}
                  </text>
                  <text y="14" fontSize="9" fontFamily="monospace" fill="#8ba9bd">
                    0{i + 1} / {zone.nodes.length}
                  </text>
                </g>
              </g>
            );
          })}
          <g fill="none" stroke="#109dda" strokeWidth="1" opacity=".35" pointerEvents="none">
            {[180, 300, 430, 545].map((r) => (
              <ellipse key={r} cx="550" cy="330" rx={r} ry={r * 0.53} />
            ))}
            <path d="M550 20 V625 M15 330 H1085" strokeDasharray="4 8" />
          </g>
          {radar && (
            <g className="nt-radar-sweep" pointerEvents="none">
              <path d="M550 330 L1035 172 Q1090 245 1090 330 Z" fill={`url(#${prefix}-sweep)`} />
              <path d="M550 330 L1090 330" stroke="#00bbff" opacity=".35" />
            </g>
          )}
          {network &&
            topology.links.map((link, i) => {
              const a = points.get(link.source),
                b = points.get(link.target);
              if (!a || !b) return null;
              const path = `M${a.x} ${a.y} V${(a.y + b.y) / 2 + 10} H${b.x} V${b.y}`;
              const attack = showAttacks && attackEdges.has(`${link.source}:${link.target}`);
              return (
                <g key={`${link.source}-${link.target}-${i}`} data-attack={attack || undefined}>
                  <path
                    d={path}
                    fill="none"
                    stroke={attack ? "#ff394c" : "#00bafa"}
                    strokeWidth="8"
                    opacity=".08"
                  />
                  <path
                    className={attack ? "nt-attack-line" : undefined}
                    d={path}
                    fill="none"
                    stroke={attack ? "#ff4855" : "#00bafa"}
                    strokeWidth={attack ? 2.5 : 1.7}
                    strokeDasharray={attack ? "7 6" : undefined}
                  />
                  <circle cx={b.x} cy={b.y} r="3" fill={attack ? "#ff4855" : "#2be1ff"} />
                </g>
              );
            })}
          {topology.nodes.map((node) => {
            const point = points.get(node.id)!;
            const selected = node.id === selectedId;
            const match =
              !query ||
              `${node.label} ${node.manufacturer ?? ""} ${node.protocol ?? ""}`
                .toLowerCase()
                .includes(query.toLowerCase());
            const kind =
              nodeKinds[node.id] ??
              (node.type === "external"
                ? "SCADA"
                : node.type === "gateway"
                  ? "Gateway"
                  : node.label);
            const zone = topology.zones.find((z) => z.nodes.includes(node.id));
            const scale = Math.min(1, 4 / Math.max(1, zone?.nodes.length ?? 1));
            return (
              <g
                key={node.id}
                role="button"
                tabIndex={0}
                aria-label={`${labels.inspect} ${node.label}${compact && node.manufacturer ? `, ${node.manufacturer}` : ""}`}
                aria-pressed={selected}
                data-node-id={node.id}
                className="nt-node"
                opacity={match ? 1 : 0.22}
                transform={`translate(${point.x} ${point.y})`}
                onClick={() => onSelect(node)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(node);
                  }
                }}
              >
                <title>{`${node.label} · ${node.protocol ?? node.type} · ${labels.risk} ${node.risk.toFixed(1)}/10`}</title>
                <rect x="-56" y="-95" width="112" height="130" rx="8" fill="transparent" />
                <ellipse
                  rx="49"
                  ry="15"
                  fill={selected ? "#00bbff" : risks ? riskColor(node.risk) : "#0b4c69"}
                  fillOpacity=".1"
                  stroke={selected ? "#42dcff" : risks ? riskColor(node.risk) : "#145171"}
                  strokeWidth={selected ? 2 : 0.8}
                />
                <g transform={`scale(${scale})`}>
                  <IndustrialGlyph kind={kind} prefix={prefix} />
                </g>
                <rect
                  x="-57"
                  y="15"
                  width="114"
                  height={risks ? 38 : 24}
                  rx="3"
                  fill="#05111b"
                  fillOpacity=".95"
                  stroke={selected ? "#00c9ff" : "#294354"}
                />
                <text
                  y="31"
                  textAnchor="middle"
                  fill="#d8eaf5"
                  fontFamily="Arial,sans-serif"
                  fontSize="12"
                  fontWeight="600"
                >
                  {node.label.length > 16 ? `${node.label.slice(0, 15)}…` : node.label}
                </text>
                {risks && (
                  <text
                    y="46"
                    textAnchor="middle"
                    fill={riskColor(node.risk)}
                    fontFamily="monospace"
                    fontSize="10"
                  >
                    {labels.risk} {node.risk.toFixed(1)}
                  </text>
                )}
                {risks && node.risk >= 7 && (
                  <g transform="translate(29 -50)">
                    <path
                      d="M0 -14 L13 9 H-13 Z"
                      fill="#271016"
                      stroke="#ff4855"
                      strokeWidth="1.5"
                    />
                    <text y="5" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="700">
                      !
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          <g transform="translate(1030 64)" aria-hidden="true" fill="none" stroke="#426479">
            <circle r="26" />
            <circle r="17" />
            <path d="M0 -30 V30 M-30 0 H30" />
            <path d="M0 -18 L5 0 L0 8 L-5 0 Z" fill="#00bafa" stroke="none" />
            <text x="0" y="-34" fill="#9fc1d5" textAnchor="middle" fontSize="9">
              N
            </text>
          </g>
        </g>
        <text x="22" y="637" fill="#6f91a8" fontFamily="monospace" fontSize="10">
          {sourceLabel}
        </text>
      </svg>
      <div className="nt-map-controls" role="group" aria-label={labels.map}>
        <button type="button" aria-label={labels.zoomIn} onClick={() => zoom(1.2)}>
          <Plus size={16} />
        </button>
        <button type="button" aria-label={labels.zoomOut} onClick={() => zoom(1 / 1.2)}>
          <Minus size={16} />
        </button>
        <button
          type="button"
          aria-label={labels.reset}
          onClick={() => setView({ zoom: 1, x: 0, y: 0 })}
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}
