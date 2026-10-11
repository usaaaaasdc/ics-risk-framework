"use client";

import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import {
  Box,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers3,
  Maximize2,
  Minus,
  Network,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  X,
  ZoomIn,
} from "lucide-react";
import type { DashboardAsset } from "@/lib/dashboard-data";
import { sceneAssets, type CameraAction } from "@/lib/industrial-scene";

const IndustrialCanvas = dynamic(() => import("./industrial-canvas"), {
  ssr: false,
  loading: () => (
    <div className="cc-3d-loading">
      <span />
      <strong>Preparing industrial cell</strong>
      <small>Loading local 3D geometry & materials</small>
    </div>
  ),
});

const mobileQuery = "(max-width: 760px)";
function subscribeViewport(callback: () => void) {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function mobileSnapshot() {
  return window.matchMedia(mobileQuery).matches;
}

class RenderBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onFailure: () => void },
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
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function SceneFallback({
  onInspect,
  onLaunch,
  unavailable = false,
}: {
  onInspect: (asset: DashboardAsset) => void;
  onLaunch: () => void;
  unavailable?: boolean;
}) {
  return (
    <div className="cc-2d-fallback">
      <div className="cc-2d-heading">
        <Network size={18} />
        <div>
          <strong>{unavailable ? "3D renderer unavailable" : "Assembly cell / 2D topology"}</strong>
          <p>
            {unavailable
              ? "Asset inspection remains available below."
              : "A lightweight asset view. Launch 3D to orbit the industrial cell."}
          </p>
        </div>
      </div>
      <div className="cc-2d-map" aria-label="2D industrial network topology">
        <svg viewBox="0 0 500 180" preserveAspectRatio="none" aria-hidden="true">
          <path d="M250 35 V85 M80 85 H420 M80 85 V135 M250 85 V135 M420 85 V135" />
          <circle cx="250" cy="85" r="4" />
        </svg>
        <span className="cc-2d-switch">
          <Network size={15} /> OT NETWORK
        </span>
        <div className="cc-2d-devices">
          {[sceneAssets[0], sceneAssets[5], sceneAssets[4]].map((entry) => (
            <button
              key={entry.id}
              onClick={() => onInspect(entry.asset)}
              aria-label={`Inspect ${entry.id}, ${entry.asset.name}`}
            >
              <Cpu size={23} />
              <strong>{entry.id}</strong>
              <small>{entry.asset.name}</small>
              <span>{entry.asset.risk.toFixed(1)} risk</span>
            </button>
          ))}
        </div>
      </div>
      <button className="cc-button cc-button-secondary cc-launch-3d" onClick={onLaunch}>
        <Box size={14} />
        {unavailable ? "Retry 3D renderer" : "Launch interactive 3D"}
      </button>
      <p className="cc-2d-note">
        2D topology · Demo data ·{" "}
        {unavailable ? "WebGL required for 3D" : "3D loads only when requested on mobile"}
      </p>
    </div>
  );
}

export function IndustrialViewer({
  onInspect,
  suspended = false,
}: {
  onInspect: (asset: DashboardAsset) => void;
  suspended?: boolean;
}) {
  const mobile = useSyncExternalStore(subscribeViewport, mobileSnapshot, () => true);
  const reducedMotion = useReducedMotion();
  const [launched, setLaunched] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activated, setActivated] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [network, setNetwork] = useState(true);
  const [risks, setRisks] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [quality, setQuality] = useState("Adaptive · ≤1.5×");
  const [command, setCommand] = useState<{ action: CameraAction; sequence: number } | null>(null);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setActivated(true);
      },
      {
        rootMargin: "120px",
      }
    );
    observer.observe(node);
    const onVisibility = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.querySelector(".cc-dialog")) setExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [expanded]);
  const onFailure = useCallback(() => setFailed(true), []);
  const launch = () => {
    setFailed(false);
    setAttempt((value) => value + 1);
    setLaunched(true);
  };
  const send = (action: CameraAction) =>
    setCommand((current) => ({ action, sequence: (current?.sequence ?? 0) + 1 }));
  const show3d = (!mobile || launched) && !failed && (activated || launched);
  const animate = playing && !reducedMotion && visible && documentVisible && !suspended;
  const fallback = <SceneFallback onInspect={onInspect} onLaunch={launch} unavailable={failed} />;
  return (
    <div
      ref={host}
      className={`cc-industrial-viewer ${expanded ? "is-expanded" : ""}`}
      data-motion={animate ? "running" : "paused"}
      data-quality={quality}
    >
      <div className="cc-viewer-heading">
        <div>
          <span className="cc-eyebrow">OPERATIONAL DIGITAL TWIN</span>
          <h2>
            Production, under protection<span>.</span>
          </h2>
        </div>
        <span className="cc-viewer-reference">
          <span /> DEMO / ASSEMBLY CELL 01
        </span>
      </div>
      <div className="cc-viewer-stage">
        {show3d ? (
          <RenderBoundary
            onFailure={onFailure}
            key={attempt}
            fallback={<SceneFallback onInspect={onInspect} onLaunch={launch} unavailable />}
          >
            <IndustrialCanvas
              efficient={mobile}
              animate={animate}
              network={network}
              risks={risks}
              command={command}
              onInspect={onInspect}
              onQuality={setQuality}
              onFailure={onFailure}
            />
          </RenderBoundary>
        ) : (
          fallback
        )}
        {show3d && (
          <>
            <div className="cc-viewer-layers" role="group" aria-label="3D scene layers">
              <button aria-pressed={network} onClick={() => setNetwork(!network)}>
                <Network size={12} />
                Network
              </button>
              <button aria-pressed={risks} onClick={() => setRisks(!risks)}>
                <ShieldAlert size={12} />
                Risk overlay
              </button>
            </div>
            <div className="cc-viewer-legend">
              <span>
                <i /> CONTROL ZONE
              </span>
              {risks && (
                <span>
                  <i className="is-amber" /> HIGH EXPOSURE
                </span>
              )}
            </div>
            <div className="cc-viewer-gesture">
              <Layers3 size={12} />
              Drag to orbit<span>·</span>Scroll to zoom
            </div>
          </>
        )}
      </div>
      <div className="cc-viewer-controls">
        <div className="cc-viewer-location">
          <Box size={15} />
          <span>
            Assembly Line 01<small>6 INSPECTABLE ASSETS / DEMO</small>
          </span>
        </div>
        {show3d && (
          <div className="cc-camera-controls" role="group" aria-label="Camera controls">
            <button aria-label="Orbit left" onClick={() => send("left")}>
              <ChevronLeft size={15} />
            </button>
            <button aria-label="Orbit right" onClick={() => send("right")}>
              <ChevronRight size={15} />
            </button>
            <span />
            <button aria-label="Zoom in" onClick={() => send("in")}>
              <ZoomIn size={14} />
            </button>
            <button aria-label="Zoom out" onClick={() => send("out")}>
              <Minus size={14} />
            </button>
            <button aria-label="Reset camera" onClick={() => send("reset")}>
              <RotateCcw size={13} />
            </button>
            <span />
            <button
              aria-label={
                playing && !reducedMotion ? "Pause scene animation" : "Play scene animation"
              }
              disabled={!!reducedMotion}
              title={reducedMotion ? "Animations paused by reduced-motion preference" : undefined}
              onClick={() => setPlaying(!playing)}
            >
              {playing && !reducedMotion ? <Pause size={13} /> : <Play size={13} />}
            </button>
          </div>
        )}
        <button
          className="cc-viewer-expand"
          aria-label={expanded ? "Collapse 3D scene" : "Expand 3D scene"}
          aria-pressed={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <X size={16} /> : <Maximize2 size={14} />}
        </button>
      </div>
      {show3d && (
        <div className="cc-viewer-performance">
          <span className="cc-signal-dot" /> {quality}
          <span>
            {reducedMotion
              ? "REDUCED MOTION / ON-DEMAND"
              : animate
                ? "INTERACTIVE 3D / DEMO TELEMETRY"
                : "PAUSED / ON-DEMAND"}
          </span>
        </div>
      )}
    </div>
  );
}
