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
import { TopologyMap } from "@/components/network/topology-map";
import { overviewTopology } from "@/lib/overview-topology";
import "@/app/network-map.css";

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
  selectedId,
  risks = true,
  network = true,
}: {
  onInspect: (asset: DashboardAsset) => void;
  onLaunch: () => void;
  unavailable?: boolean;
  selectedId?: string | null;
  risks?: boolean;
  network?: boolean;
}) {
  return (
    <div className="cc-topology-fallback">
      <div className="cc-2d-heading">
        <Network size={15} />
        <strong>{unavailable ? "3D renderer unavailable" : "Assembly cell / 2D topology"}</strong>
      </div>
      <TopologyMap
        topology={overviewTopology}
        selectedId={selectedId}
        compact
        risks={risks}
        network={network}
        onSelect={(node) => onInspect(sceneAssets.find((entry) => entry.id === node.id)!.asset)}
      />
      <div className="cc-topology-caption">
        <span>2D topology · Demo data · Illustrative connections</span>
        <button className="cc-button cc-button-secondary" onClick={onLaunch}>
          <Box size={12} />
          {unavailable ? "Retry 3D renderer" : "Launch interactive 3D"}
        </button>
      </div>
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
  const [mode, setMode] = useState<"2d" | "3d" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
  const onFailure = useCallback(() => {
    setFailed(true);
    setMode("2d");
  }, []);
  const inspect = (asset: DashboardAsset) => {
    setSelectedId(asset.id);
    onInspect(asset);
  };
  const launch = () => {
    setFailed(false);
    setAttempt((value) => value + 1);
    setLaunched(true);
    setMode("3d");
  };
  const send = (action: CameraAction) =>
    setCommand((current) => ({ action, sequence: (current?.sequence ?? 0) + 1 }));
  const activeMode = mode ?? (mobile ? "2d" : "3d");
  const show3d = activeMode === "3d" && !failed;
  const mount3d = ((!mobile && activated) || launched) && !failed;
  const animate = show3d && playing && !reducedMotion && visible && documentVisible && !suspended;
  const fallback = (
    <SceneFallback
      onInspect={inspect}
      onLaunch={launch}
      unavailable={failed}
      selectedId={selectedId}
      risks={risks}
      network={network}
    />
  );
  return (
    <div
      ref={host}
      className={`cc-industrial-viewer ${expanded ? "is-expanded" : ""}`}
      data-mode={show3d ? "3d" : "2d"}
      data-selected-asset={selectedId ?? ""}
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
        <div className="cc-mode-switch" role="group" aria-label="Factory view">
          <button
            aria-label="Show 2D topology"
            aria-pressed={!show3d}
            onClick={() => setMode("2d")}
          >
            2D
          </button>
          <button
            aria-label="Show interactive 3D"
            aria-pressed={show3d}
            onClick={() => {
              if (failed || !mount3d) launch();
              else setMode("3d");
            }}
          >
            3D
          </button>
        </div>
      </div>
      <div className="cc-viewer-stage">
        {mount3d && (
          <div className="cc-mode-canvas" hidden={!show3d}>
            <RenderBoundary onFailure={onFailure} key={attempt} fallback={fallback}>
              <IndustrialCanvas
                efficient={mobile}
                animate={animate}
                network={network}
                risks={risks}
                command={command}
                selectedId={selectedId}
                onInspect={inspect}
                onQuality={setQuality}
                onFailure={onFailure}
              />
            </RenderBoundary>
          </div>
        )}
        {!show3d && fallback}
        <>
          <div className="cc-viewer-layers" role="group" aria-label="Factory scene layers">
            <button aria-pressed={network} onClick={() => setNetwork(!network)}>
              <Network size={12} />
              Network
            </button>
            <button aria-pressed={risks} onClick={() => setRisks(!risks)}>
              <ShieldAlert size={12} />
              Risk overlay
            </button>
          </div>
          {show3d && (
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
          )}
          {show3d && (
            <div className="cc-viewer-gesture">
              <Layers3 size={12} />
              Drag to orbit<span>·</span>Scroll to zoom
            </div>
          )}
        </>
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
