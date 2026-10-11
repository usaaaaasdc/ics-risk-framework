"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import type { RiskSimulationCopy } from "@/lib/risk-simulation-copy";

function Cabinet({
  x,
  y,
  screen = false,
  scale = 1,
  steel,
}: {
  x: number;
  y: number;
  screen?: boolean;
  scale?: number;
  steel: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} aria-hidden="true">
      <ellipse cy="6" rx="35" ry="11" fill="#020810" opacity=".6" />
      <path
        d="M-27 -60 L9 -74 L29 -61 L-7 -47 Z"
        fill="#6e91ac"
        stroke="#91abc0"
        strokeWidth=".7"
      />
      <path d="M9 -74 L29 -61 V1 L9 -10 Z" fill="#193347" stroke="#52748e" />
      <path
        d="M-27 -60 L9 -74 V-10 L-27 4 Z"
        fill={`url(#${steel})`}
        stroke="#7592a7"
        strokeWidth=".8"
      />
      {screen ? (
        <>
          <path d="M-23 -54 L5 -65 V-27 L-23 -16 Z" fill="#08354b" stroke="#29c9eb" />
          <path
            d="M-19 -29 L-15 -41 L-9 -36 L-2 -52 L2 -45"
            stroke="#36dfdf"
            fill="none"
            strokeWidth="1.5"
          />
          <path d="M-18 -48 L-3 -54 M-18 -44 L-8 -48" stroke="#2e789f" />
          <path
            d="M-10 -3 V12 M-24 16 L1 6 L12 12 L-13 22 Z"
            fill="#426177"
            stroke="#7e9daf"
            strokeWidth="2"
          />
        </>
      ) : (
        <>
          {[-20, -12, -4].map((x) => (
            <g key={x}>
              <path d={`M${x} -53 l5 -2 v42 l-5 2 Z`} fill="#091826" />
              {Array.from({ length: 7 }, (_, i) => (
                <path
                  key={i}
                  d={`M${x + 1} ${-45 + i * 5} l3 -1`}
                  stroke="#6c8596"
                  strokeWidth=".7"
                />
              ))}
              <circle cx={x + 2} cy="-49" r="1" fill="#2be5ed" />
            </g>
          ))}
          <path
            d="M12 -52 L24 -45 M12 -47 L24 -40 M12 -42 L24 -35 M12 -37 L24 -30"
            stroke="#365469"
          />
          <circle cx="1" cy="-19" r="1.5" fill="#52d7eb" />
        </>
      )}
      <path d="M-26 4 V10 L10 -3 L29 7 V1" fill="#112333" stroke="#425e73" />
    </g>
  );
}

function Tank({ x, y, steel }: { x: number; y: number; steel: string }) {
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <ellipse cy="10" rx="27" ry="12" fill="#020911" opacity=".7" />
      <path d="M-21 -64 V0 Q0 18 21 0 V-64 Z" fill={`url(#${steel})`} stroke="#8ba5b7" />
      <ellipse cy="-64" rx="21" ry="9" fill="#59758b" stroke="#9cb2c1" />
      <path
        d="M-5 -72 V-91 H22 V-26 H42 M-23 -39 Q0 -23 23 -39 M-23 -18 Q0 -2 23 -18"
        fill="none"
        stroke="#94a7b5"
        strokeWidth="2"
      />
      <path
        d="M-10 8 V23 M13 8 V23 M-26 -39 V-15 M-26 -30 H-36 V18 H-9"
        fill="none"
        stroke="#6c8498"
        strokeWidth="3"
      />
      <path d="M-5 -85 H9" stroke="#48c2ee" strokeWidth="3" />
    </g>
  );
}

function Robot({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} aria-hidden="true">
      <ellipse cy="10" rx="26" ry="10" fill="#060c13" opacity=".65" />
      <path d="M-17 0 L0 -8 L19 1 V9 L0 18 L-17 10 Z" fill="#b28a24" stroke="#efbc48" />
      <path
        d="M0 0 L-7 -32 L13 -61 L40 -47 L48 -29"
        fill="none"
        stroke="#4c3715"
        strokeWidth="15"
      />
      <path
        d="M0 0 L-7 -32 L13 -61 L40 -47 L48 -29"
        fill="none"
        stroke="#e5a92c"
        strokeWidth="10"
        strokeLinejoin="round"
      />
      <path d="M-4 -33 L14 -61 L40 -47" fill="none" stroke="#ffe088" strokeWidth="2" />
      {[
        [-7, -32],
        [13, -61],
        [40, -47],
      ].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r="6" fill="#354657" stroke="#deac46" strokeWidth="2" />
      ))}
      <path
        d="M44 -29 L53 -29 M48 -29 V-17 M44 -17 H53"
        stroke="#a1b1bc"
        strokeWidth="3"
        fill="none"
      />
    </g>
  );
}

export function SimulationAttackMap({
  stage,
  onStage,
  targets,
  copy,
}: {
  stage: number;
  onStage: (stage: number) => void;
  targets: string[];
  copy: RiskSimulationCopy;
}) {
  const id = useId().replace(/:/g, "");
  const steel = `${id}-metal`;
  const [zoom, setZoom] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = scrollRef.current;
    const node = container?.querySelectorAll(".rs-map-node")[stage];
    if (!container || !node || container.scrollWidth <= container.clientWidth) return;
    const bounds = container.getBoundingClientRect();
    const asset = node.getBoundingClientRect();
    container.scrollLeft += asset.left + asset.width / 2 - bounds.left - bounds.width / 2;
  }, [stage, zoom]);
  const points = [
    [63, 213],
    [205, 260],
    [430, 215],
    [610, 285],
    [745, 325],
    [910, 360],
  ];
  return (
    <div className="rs-attack-map">
      <div className="rs-zones">
        {copy.zones.map((zone) => (
          <span key={zone}>{zone}</span>
        ))}
      </div>
      <div className="rs-map-scroll" ref={scrollRef} dir="ltr" tabIndex={0} aria-label={copy.path}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 25 1100 410"
          role="group"
          aria-label={copy.path}
          style={{
            direction: "ltr",
            width: `${zoom * 100}%`,
            minWidth: `${700 * zoom}px`,
            height: `calc(var(--rs-map-height) * ${zoom})`,
          }}
        >
          <defs>
            <linearGradient id={steel}>
              <stop stopColor="#263f54" />
              <stop offset=".35" stopColor="#90a6b5" />
              <stop offset=".5" stopColor="#5a7285" />
              <stop offset="1" stopColor="#21384c" />
            </linearGradient>
            <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#263d51" />
              <stop offset="1" stopColor="#0c2030" />
            </linearGradient>
            <pattern id={`${id}-grid`} width="36" height="36" patternUnits="userSpaceOnUse">
              <path
                d="M36 0 H0 V36"
                fill="none"
                stroke="#4a697f"
                strokeOpacity=".25"
                strokeWidth=".8"
              />
            </pattern>
            <marker
              id={`${id}-arrow`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 L3 5 Z" fill="#ff7064" />
            </marker>
            <filter id={`${id}-glow`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
          <rect width="1100" height="460" fill="#0b1b29" />
          <g>
            <g transform="translate(550 220) scale(1 .48) rotate(45)">
              <rect x="-650" y="-650" width="1300" height="1300" fill={`url(#${id}-grid)`} />
            </g>
            {[
              {
                p: "20,270 260,160 470,270 230,410",
                e: "20,270 230,410 470,270 470,286 230,426 20,286",
                c: "#168aca",
              },
              {
                p: "260,160 430,95 630,208 470,270",
                e: "470,270 630,208 630,224 470,286",
                c: "#cb8445",
              },
              {
                p: "470,270 630,208 830,315 670,410",
                e: "470,270 670,410 830,315 830,330 670,426 470,286",
                c: "#20b7b6",
              },
              {
                p: "630,208 865,95 1080,225 830,365",
                e: "830,365 1080,225 1080,241 830,381",
                c: "#56a0bc",
              },
            ].map(({ p, e, c }) => (
              <g key={c}>
                <polygon points={e} fill="#142b3e" stroke={c} strokeOpacity=".5" />
                <polygon points={p} fill={`url(#${id}-floor)`} stroke={c} strokeWidth="1.5" />
                <polygon points={p} fill={c} fillOpacity=".12" />
              </g>
            ))}
            {/* Industrial geometry: raised equipment islands, service pipework, PLCs,
              workstations, process vessels, conveyor rollers and robot joints. */}
            {[
              [180, 230],
              [260, 200],
              [310, 253],
              [175, 327],
              [285, 325],
              [390, 196],
              [475, 175],
              [650, 232],
              [690, 268],
              [810, 171],
            ].map(([x, y], i) => (
              <Cabinet
                key={i}
                x={x}
                y={y}
                screen={i === 3 || i === 7}
                steel={steel}
                scale={i === 9 ? 1.6 : 0.8}
              />
            ))}
            <g stroke="#92a8b8" fill="none" strokeWidth="3" opacity=".85">
              <path d="M821 120 V65 L881 34 L936 65 V151 M847 154 V95 L905 66 L962 101 V178 M930 195 V102 L1007 147 V242 M821 120 L865 147 L936 112 M847 154 L899 184 L962 146" />
              <path d="M805 214 L918 149 L1047 225 M813 220 L923 158 L1055 234" />
            </g>
            <Tank x={875} y={190} steel={steel} />
            <Tank x={957} y={220} steel={steel} />
            <Tank x={1015} y={252} steel={steel} />
            <g transform="translate(940 292) rotate(-29)">
              <path
                d="M-115 -12 H125 V13 H-115 Z"
                fill="#172b3b"
                stroke="#738b9e"
                strokeWidth="3"
              />
              {Array.from({ length: 19 }, (_, i) => (
                <g key={i}>
                  <path d={`M${-108 + i * 12} -11 V12`} stroke="#a6b4bd" strokeWidth="5" />
                  <path d={`M${-108 + i * 12} -11 V12`} stroke="#d4dce1" strokeWidth="1" />
                </g>
              ))}
              <path
                d="M-118 -15 H128 M-118 17 H128 M-85 19 V40 M80 19 V40"
                stroke="#657e93"
                strokeWidth="3"
              />
            </g>
            <Robot x={1014} y={299} flip />
            <Robot x={953} y={345} />
            <g stroke="#ffc44e" strokeWidth="2" fill="none">
              <path d="M794 201 V176 L1002 297 V321 M794 183 L1002 304 M830 197 V223 M867 218 V244 M906 241 V266 M943 263 V286 M981 285 V309" />
            </g>
            <Cabinet x={205} y={260} screen steel={steel} scale={1.1} />
            <Cabinet x={430} y={215} steel={steel} />
            <Cabinet x={610} y={285} screen steel={steel} />
            <Cabinet x={745} y={325} screen steel={steel} />
            <Cabinet x={910} y={360} steel={steel} scale={1.2} />
            {points.slice(1).map(([x, y], i) => {
              const [ax, ay] = points[i];
              const d = `M${ax + 20} ${ay - 5} C${ax + 55} ${ay - 40} ${x - 65} ${y - 40} ${x - 18} ${y - 8}`;
              return (
                <g key={i} pointerEvents="none">
                  <path
                    d={d}
                    fill="none"
                    stroke={i < stage ? "#ff4b3b" : "#4b7e9b"}
                    strokeWidth="10"
                    opacity={i < stage ? 0.4 : 0.1}
                    filter={`url(#${id}-glow)`}
                  />
                  <path
                    className={i < stage ? "rs-threat-line" : undefined}
                    data-active-path={i < stage || undefined}
                    d={d}
                    fill="none"
                    stroke={i < stage ? "#ff7767" : "#5790ad"}
                    strokeWidth={i < stage ? 2.6 : 1.3}
                    strokeDasharray="5 5"
                    markerEnd={i < stage ? `url(#${id}-arrow)` : undefined}
                  />
                </g>
              );
            })}
            {points.map(([x, y], i) => (
              <g
                key={i}
                role="button"
                tabIndex={0}
                aria-label={`${copy.inspect} ${i + 1}: ${targets[i]}`}
                aria-pressed={stage === i}
                className="rs-map-node"
                transform={`translate(${x} ${y})`}
                onClick={() => onStage(i)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onStage(i);
                  }
                }}
              >
                <title>{`${copy.stage} ${i + 1}: ${targets[i]}`}</title>
                <rect x="-48" y="-88" width="96" height="133" rx="5" fill="transparent" />
                <ellipse
                  cy="4"
                  rx="37"
                  ry="13"
                  fill={stage === i ? "#ff5b49" : "#21bfec"}
                  fillOpacity=".1"
                  stroke={stage === i ? "#ff8b75" : "#6ca0b6"}
                  strokeWidth={stage === i ? 2 : 0.6}
                />
                {i === 0 ? (
                  <g>
                    <circle cy="-34" r="23" fill="#c9353d" fillOpacity=".22" stroke="#ed5a5e" />
                    <path d="M-12 -23 Q-14 -45 0 -48 Q14 -45 12 -23 Z" fill="#ef7876" />
                    <path
                      d="M-8 -32 L-3 -30 M8 -32 L3 -30 M-5 -23 H5"
                      stroke="#612c37"
                      strokeWidth="3"
                    />
                  </g>
                ) : (
                  stage === i && (
                    <g transform="translate(27 -39)">
                      <path
                        d="M0 -16 L14 10 H-14 Z"
                        fill="#572a2b"
                        stroke="#ff7a65"
                        strokeWidth="1.5"
                      />
                      <text y="5" textAnchor="middle" fill="#ffddd5" fontSize="18" fontWeight="700">
                        !
                      </text>
                    </g>
                  )
                )}
                <rect
                  x="-57"
                  y="19"
                  width="114"
                  height="25"
                  rx="3"
                  fill="#0a1a28"
                  stroke={stage === i ? "#ff7965" : "#37566b"}
                />
                <text
                  y="36"
                  textAnchor="middle"
                  fontFamily="Arial,sans-serif"
                  fontSize="12"
                  fill="#d8e8f5"
                >
                  {targets[i].length > 17 ? `${targets[i].slice(0, 16)}…` : targets[i]}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
      <div className="rs-map-zoom">
        <button aria-label={copy.zoomIn} onClick={() => setZoom((v) => Math.min(1.7, v + 0.15))}>
          <Plus size={15} />
        </button>
        <button aria-label={copy.zoomOut} onClick={() => setZoom((v) => Math.max(0.7, v - 0.15))}>
          <Minus size={15} />
        </button>
        <button aria-label={copy.resetView} onClick={() => setZoom(1)}>
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}
