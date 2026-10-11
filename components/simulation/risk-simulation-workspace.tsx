"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Boxes,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText,
  Fingerprint,
  Globe,
  HardDrive,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Network,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Skull,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useLanguage, type Language } from "@/lib/i18n/language-context";
import { useHydrated } from "@/hooks/use-hydrated";
import { ProjectManager, type Project } from "@/lib/project-manager";
import { runMonteCarloSimulation, type SimulationParams } from "@/lib/calculators/risk-engine";
import { MarkovEngine } from "@/lib/calculators/markov-engine";
import { getSimulationAssets, scenarioPresets, type ScenarioId } from "@/lib/risk-simulation-ui";
import { riskSimulationCopy, type RiskSimulationCopy } from "@/lib/risk-simulation-copy";
import { SimulationAttackMap } from "./simulation-attack-map";

const AdvancedModels = dynamic(() => import("@/components/risk-simulation-chart"), { ssr: false });
const ids: ScenarioId[] = ["ransomware", "access", "plc", "exfiltration", "dos"];
const icons = [Skull, LockKeyhole, Fingerprint, Database, HardDrive];
const accents = ["#ff725f", "#36bfff", "#22cebd", "#39b5ff", "#f3b94c"];

function Gauge({
  value,
  max = 100,
  label,
  color,
  suffix = "%",
}: {
  value: number;
  max?: number;
  label: string;
  color: string;
  suffix?: string;
}) {
  const ratio = Math.max(0, Math.min(1, value / max));
  return (
    <div
      className="rs-gauge"
      role="img"
      aria-label={`${label}: ${value.toFixed(1)}${suffix}`}
      style={{ color }}
    >
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="48" fill="none" stroke="#294257" strokeWidth="9" />
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${ratio * 100} 100`}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <span>
        {Number.isInteger(value) ? value : value.toFixed(1)}
        <small>{suffix}</small>
      </span>
    </div>
  );
}

function ScenarioDashboard({
  id,
  project,
  copy,
}: {
  id: ScenarioId;
  project?: Project;
  copy: RiskSimulationCopy;
}) {
  const index = ids.indexOf(id);
  const Icon = icons[index];
  const [params, setParams] = useState<SimulationParams>({ ...scenarioPresets[id] });
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [modelStep, setModelStep] = useState(24);
  const [recommendation, setRecommendation] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  const [documentVisible, setDocumentVisible] = useState(true);
  useEffect(() => {
    const listener = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", listener);
    return () => document.removeEventListener("visibilitychange", listener);
  }, []);
  const activePlaying = playing && stage < 5 && !reducedMotion;
  useEffect(() => {
    if (!activePlaying || !documentVisible) return;
    const timer = window.setTimeout(() => setStage(stage + 1), 1400);
    return () => window.clearTimeout(timer);
  }, [activePlaying, documentVisible, stage]);
  // Keep the existing Monte Carlo calculation and the existing risk-to-Markov
  // seed used by RiskSimulationChart. No engine or transition constants changed.
  const stats = useMemo(() => runMonteCarloSimulation(params), [params]);
  const history = useMemo(
    () =>
      MarkovEngine.simulateAttackProgression(
        params.baseImpact * params.baseLikelihood * (1 - params.mitigationFactor) * 10,
        24
      ),
    [params]
  );
  const assets = useMemo(() => getSimulationAssets(project), [project]);
  const stageAssets = [
    undefined,
    assets.find((a) => /workstation|engineering/i.test(a.deviceType)),
    undefined,
    assets.find((a) => /scada|historian/i.test(a.deviceType)),
    assets.find((a) => /hmi/i.test(a.deviceType)),
    assets.find((a) => /plc|controller/i.test(a.deviceType)) ?? assets[0],
  ];
  const targets = stageAssets.map(
    (asset, i) =>
      asset?.name ?? [copy.phases[0], "Engineering WS", "Firewall", "SCADA", "HMI", "PLC"][i]
  );
  const selectedAsset = stageAssets[stage];
  const severity = stats.mean >= 70 ? copy.high : stats.mean >= 40 ? copy.medium : copy.low;
  const color = stats.mean >= 70 ? accents[0] : stats.mean >= 40 ? accents[4] : accents[2];
  const weight = history[modelStep].probabilities.Compromised * 100;
  const line = history
    .map((item, i) => `${36 + i * 12},${155 - item.probabilities.Compromised * 130}`)
    .join(" ");
  const setSelectedStage = (value: number) => {
    setStage(value);
    setPlaying(false);
  };
  return (
    <>
      <div className="rs-main-grid" data-scenario={id}>
        <section className="rs-panel rs-path-panel" aria-labelledby="rs-path-heading">
          <div className="rs-panel-heading">
            <h2 id="rs-path-heading">
              {copy.path}
              <small>ICS / OT · {copy.hypothetical}</small>
            </h2>
            <button
              className="rs-play"
              aria-label={activePlaying ? copy.pause : copy.play}
              disabled={!!reducedMotion}
              title={reducedMotion ? copy.order : undefined}
              onClick={() => {
                if (stage === 5) setStage(0);
                setPlaying(!activePlaying);
              }}
            >
              {activePlaying ? <Pause size={16} /> : <Play size={16} />}
              {activePlaying ? copy.pause : copy.play}
            </button>
          </div>
          <SimulationAttackMap
            stage={stage}
            onStage={setSelectedStage}
            targets={targets}
            copy={copy}
          />
          <div className="rs-stage-inspector" aria-label={copy.phaseDetails}>
            <div>
              <span>
                {copy.stage} {String(stage + 1).padStart(2, "0")} / 06
              </span>
              <strong aria-live="polite">{copy.actions[index][stage]}</strong>
              <small>
                {targets[stage]} · {selectedAsset?.manufacturer ?? copy.modeled} ·{" "}
                {selectedAsset?.protocol ?? copy.unknown}
              </small>
            </div>
            <div className="rs-stage-controls">
              <button
                aria-label={copy.previous}
                disabled={stage === 0}
                onClick={() => setSelectedStage(stage - 1)}
              >
                <ChevronLeft size={17} />
              </button>
              <button
                aria-label={copy.next}
                disabled={stage === 5}
                onClick={() => setSelectedStage(stage + 1)}
              >
                <ChevronRight size={17} />
              </button>
              <button aria-label={copy.resetPath} onClick={() => setSelectedStage(0)}>
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
          <p className="rs-map-note">{copy.mapNote}</p>
        </section>
        <section className="rs-panel rs-selected" aria-labelledby="rs-selected-heading">
          <div className="rs-panel-heading">
            <h2 id="rs-selected-heading">{copy.selected}</h2>
            <span className="rs-badge">{copy.hypothetical}</span>
          </div>
          <div className="rs-scenario-identity">
            <span style={{ color: accents[index] }}>
              <Icon size={32} />
            </span>
            <h3>{copy.scenarios[index]}</h3>
            <b style={{ color, borderColor: color }}>
              {severity}
              <small>{copy.risk}</small>
            </b>
          </div>
          <p className="rs-scenario-description">{copy.descriptions[index]}</p>
          <div className="rs-metrics">
            <div>
              <h4>{copy.risk}</h4>
              <Gauge
                value={Number(stats.mean.toFixed(1))}
                label={copy.risk}
                color={color}
                suffix="/100"
              />
              <small>MONTE CARLO</small>
            </div>
            <div>
              <h4>{copy.scopeAssets}</h4>
              <Boxes size={27} />
              <strong>{assets.length}</strong>
              <small>{project ? copy.local : copy.demo}</small>
            </div>
            <div>
              <h4>{copy.impact}</h4>
              <Activity size={27} />
              <strong>
                {params.baseImpact}
                <small>/ 10</small>
              </strong>
              <small>{copy.hypothetical}</small>
            </div>
            <div>
              <h4>{copy.mitigation}</h4>
              <ShieldCheck size={27} />
              <strong>
                {Math.round(params.mitigationFactor * 100)}
                <small>%</small>
              </strong>
              <small>{copy.hypothetical}</small>
            </div>
          </div>
          <div className="rs-baseline">
            <Shield size={14} />
            <span>{copy.baseline}</span>
            <strong>
              {typeof project?.assessment?.riskScore === "number"
                ? `${project.assessment.riskScore.toFixed(1)} / 10`
                : copy.noBaseline}
            </strong>
          </div>
          <details className="rs-assumptions">
            <summary>
              <SlidersHorizontal size={15} />
              {copy.assumptions}
              <ChevronDown size={14} />
            </summary>
            <div className="rs-inputs">
              {(
                [
                  ["baseImpact", copy.impact, 1, 10, 0.5, 1],
                  ["baseLikelihood", copy.likelihood, 0.1, 1, 0.05, 100],
                  ["mitigationFactor", copy.mitigation, 0, 0.95, 0.05, 100],
                  ["uncertainty", copy.uncertainty, 0.05, 0.5, 0.05, 100],
                ] as const
              ).map(([key, label, min, max, step, factor]) => (
                <label key={key}>
                  <span>
                    {label}
                    <output>
                      {Number((params[key] * factor).toFixed(1))}
                      {factor === 100 ? "%" : " / 10"}
                    </output>
                  </span>
                  <input
                    type="range"
                    aria-label={label}
                    min={min}
                    max={max}
                    step={step}
                    value={params[key]}
                    onChange={(event) =>
                      setParams((p) => ({ ...p, [key]: Number(event.target.value) }))
                    }
                  />
                </label>
              ))}
              <div>
                <button onClick={() => setParams((p) => ({ ...p }))}>
                  <RotateCcw size={13} />
                  {copy.recalculate}
                </button>
                <button onClick={() => setParams({ ...scenarioPresets[id] })}>{copy.reset}</button>
              </div>
            </div>
          </details>
        </section>
      </div>
      <div className="rs-analysis-grid">
        <section className="rs-panel rs-timeline" aria-labelledby="rs-timeline-heading">
          <div className="rs-panel-heading">
            <h2 id="rs-timeline-heading">
              {copy.timeline}
              <small>{copy.order}</small>
            </h2>
          </div>
          <ol>
            {copy.actions[index].map((action, i) => (
              <li key={action}>
                <button aria-pressed={stage === i} onClick={() => setSelectedStage(i)}>
                  <i
                    style={{
                      background: i <= stage ? accents[0] : i === 2 ? accents[4] : "#54a5cb",
                    }}
                  />
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <span>
                    {action}
                    <small>{copy.phases[i]}</small>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </section>
        <section className="rs-panel rs-input-summary" aria-labelledby="rs-input-heading">
          <div className="rs-panel-heading">
            <h2 id="rs-input-heading">{copy.probabilityImpact}</h2>
          </div>
          <div className="rs-input-gauges">
            <div>
              <h3>{copy.likelihood}</h3>
              <Gauge
                value={Math.round(params.baseLikelihood * 100)}
                label={copy.likelihood}
                color="#efbc53"
              />
              <small>{copy.hypothetical}</small>
            </div>
            <div>
              <h3>{copy.impact}</h3>
              <Gauge
                value={params.baseImpact}
                max={10}
                label={copy.impact}
                color="#ff6f62"
                suffix="/10"
              />
              <small>{copy.hypothetical}</small>
            </div>
          </div>
          <p>
            {copy.percentiles}:{" "}
            <strong data-testid="risk-percentiles">
              {stats.p10.toFixed(1)} / {stats.p90.toFixed(1)}
            </strong>
          </p>
        </section>
        <section className="rs-panel rs-trend" aria-labelledby="rs-trend-heading">
          <div className="rs-panel-heading">
            <h2 id="rs-trend-heading">
              {copy.trend}
              <small>{copy.weight}</small>
            </h2>
            <output aria-live="polite">{weight.toFixed(1)}%</output>
          </div>
          <svg
            viewBox="0 0 350 200"
            role="group"
            aria-label={copy.trend}
            style={{ direction: "ltr" }}
          >
            <defs>
              <linearGradient id="rs-trend-area" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#e56757" stopOpacity=".25" />
                <stop offset="1" stopColor="#e56757" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="rs-trend-line">
                <stop stopColor="#22d2cf" />
                <stop offset=".55" stopColor="#eec357" />
                <stop offset="1" stopColor="#fa685d" />
              </linearGradient>
            </defs>
            {[0, 25, 50, 75, 100].map((tick) => (
              <g key={tick}>
                <path d={`M36 ${155 - tick * 1.3} H324`} stroke="#3c5369" strokeWidth=".6" />
                <text x="28" y={159 - tick * 1.3} textAnchor="end" fill="#a0b5c9" fontSize="10">
                  {tick}
                </text>
              </g>
            ))}
            <polygon points={`36,155 ${line} 324,155`} fill="url(#rs-trend-area)" />
            <polyline points={line} stroke="url(#rs-trend-line)" strokeWidth="2.3" fill="none" />
            {history
              .filter((_, i) => i % 4 === 0)
              .map((item) => (
                <g
                  key={item.step}
                  role="button"
                  tabIndex={0}
                  aria-label={`${copy.step} ${item.step}`}
                  aria-pressed={modelStep === item.step}
                  onClick={() => setModelStep(item.step)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setModelStep(item.step);
                    }
                  }}
                >
                  <rect x={20 + item.step * 12} y="18" width="32" height="168" fill="transparent" />
                  <circle
                    cx={36 + item.step * 12}
                    cy={155 - item.probabilities.Compromised * 130}
                    r={modelStep === item.step ? 5 : 3}
                    fill={modelStep === item.step ? "#ff7263" : "#9ce4ed"}
                    stroke="#b6f5f2"
                  />
                  <text
                    x={36 + item.step * 12}
                    y="178"
                    textAnchor="middle"
                    fill="#a8bed1"
                    fontSize="10"
                  >
                    {item.step}
                  </text>
                </g>
              ))}
          </svg>
          <p>
            {copy.step} {modelStep} · {copy.modelNote}
          </p>
        </section>
        <section
          className="rs-panel rs-recommendations"
          aria-labelledby="rs-recommendations-heading"
        >
          <div className="rs-panel-heading">
            <h2 id="rs-recommendations-heading">{copy.recommendations}</h2>
          </div>
          {copy.recommendationTitles.map((title, i) => (
            <div key={title}>
              <button
                aria-expanded={recommendation === i}
                onClick={() => setRecommendation(recommendation === i ? null : i)}
              >
                <span>
                  {i === 0 ? (
                    <Network size={19} />
                  ) : i === 1 ? (
                    <Activity size={19} />
                  ) : i === 2 ? (
                    <LockKeyhole size={19} />
                  ) : i === 3 ? (
                    <Database size={19} />
                  ) : (
                    <ShieldCheck size={19} />
                  )}
                </span>
                {title}
                <ChevronRight size={14} />
              </button>
              {recommendation === i && (
                <p>
                  {copy.recommendationDetails[i]}{" "}
                  {
                    <Link href="/remediation-planner">
                      {copy.treatment} <ArrowRight size={12} />
                    </Link>
                  }
                </p>
              )}
            </div>
          ))}
        </section>
      </div>
      <p className="rs-disclaimer" role="note">
        <ShieldAlert size={16} />
        <span>{copy.disclaimer}</span>
      </p>
    </>
  );
}

export function RiskSimulationWorkspace() {
  const { language, setLanguage, isRTL } = useLanguage();
  const copy = riskSimulationCopy[language];
  const hydrated = useHydrated();
  const saved = useMemo(() => {
    if (!hydrated) return { projects: [] as Project[], error: false };
    try {
      const projects = ProjectManager.getAllProjects();
      if (!Array.isArray(projects)) throw new Error();
      return { projects, error: false };
    } catch {
      return { projects: [] as Project[], error: true };
    }
  }, [hydrated]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const project =
    projectId === "demo"
      ? undefined
      : (saved.projects.find((p) => p.id === projectId) ?? saved.projects.at(-1));
  const [scenario, setScenario] = useState<ScenarioId>("ransomware");
  const [menu, setMenu] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const navigationRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!menu) return;
    const previous = document.activeElement;
    const first = navigationRef.current?.querySelector<HTMLButtonElement>("button");
    first?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
      if (event.key !== "Tab") return;
      const controls =
        navigationRef.current?.querySelectorAll<HTMLElement>("button, a[href], select");
      if (!controls?.length) return;
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 761px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenu(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", onKey);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("keydown", onKey);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [menu]);
  const nav = [
    { href: "/", label: copy.dashboard, icon: LayoutDashboard },
    { href: "/network-topology", label: copy.topology, icon: Network },
    { href: "/assessment", label: copy.assessment, icon: ShieldAlert },
    { href: "/risk-simulation", label: copy.title, icon: Shield },
    { href: "/remediation-planner", label: copy.treatment, icon: ShieldCheck },
    { href: "/analytics", label: copy.reports, icon: FileText },
    { href: "/simulation", label: copy.lab, icon: Activity },
    { href: "/projects", label: copy.projects, icon: Settings2 },
  ];
  return (
    <div className="rs-workspace" dir={isRTL ? "rtl" : "ltr"}>
      <a className="rs-skip" href="#rs-content">
        {copy.title}
      </a>
      <header className="rs-header">
        <Link className="rs-brand" href="/">
          <ShieldCheck size={42} />
          <span>
            ICS-Risk Framework<small>{copy.eyebrow}</small>
          </span>
        </Link>
        <nav aria-label={copy.dashboard}>
          {nav
            .filter((_, i) => [0, 2, 3, 4, 5].includes(i))
            .map(({ href, label, icon: NavIcon }) => (
              <Link
                href={href}
                key={href}
                aria-current={href === "/risk-simulation" ? "page" : undefined}
              >
                <NavIcon size={19} />
                <span>{label}</span>
              </Link>
            ))}
        </nav>
        <label className="rs-project-selector">
          <Boxes size={22} />
          <span>
            <small>{copy.source}</small>
            <select
              aria-label={copy.source}
              value={project?.id ?? "demo"}
              onChange={(event) => setProjectId(event.target.value)}
            >
              {saved.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
              <option value="demo">{copy.demo}</option>
            </select>
          </span>
        </label>
        <button
          className="rs-menu"
          aria-label={copy.closeMenu}
          aria-expanded={menu}
          aria-controls="rs-navigation"
          onClick={() => setMenu(!menu)}
        >
          <Menu size={22} />
        </button>
      </header>
      {menu && (
        <button className="rs-scrim" aria-label={copy.closeMenu} onClick={() => setMenu(false)} />
      )}
      <aside
        id="rs-navigation"
        ref={navigationRef}
        className={`rs-sidebar ${menu ? "is-open" : ""}`}
      >
        {menu && (
          <button
            className="rs-menu-close"
            aria-label={copy.closeMenu}
            onClick={() => setMenu(false)}
          >
            <X size={20} />
          </button>
        )}
        <nav aria-label={copy.title}>
          {nav.map(({ href, label, icon: NavIcon }) => (
            <Link
              href={href}
              key={href}
              aria-current={href === "/risk-simulation" ? "page" : undefined}
              onClick={() => setMenu(false)}
            >
              <NavIcon size={23} />
              <span>
                {label}
                {language !== "en" && href === "/risk-simulation" && <small>Risk Simulation</small>}
              </span>
            </Link>
          ))}
        </nav>
        <label className="rs-language">
          <Globe size={17} />
          <span className="sr-only">{copy.language}</span>
          <select
            aria-label={copy.language}
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="de">Deutsch</option>
            <option value="tr">Türkçe</option>
          </select>
        </label>
        <div className="rs-sidebar-footer">
          <Shield size={25} />
          <span>
            ICS / OT<small>{copy.hypothetical}</small>
          </span>
        </div>
      </aside>
      <main id="rs-content" className="rs-content" inert={menu}>
        <div className="rs-page-heading">
          <div>
            <h1>{copy.title}</h1>
            {language !== "en" && <span>Risk Simulation</span>}
          </div>
          <p>
            {copy.subtitle}
            <small>
              {project ? `${copy.local} / ${project.name}` : copy.demo} · {copy.hypothetical}
            </small>
          </p>
        </div>
        {saved.error && <p role="alert">{copy.readError}</p>}
        <div className="rs-scenarios" role="group" aria-label={copy.selected}>
          {ids.map((id, i) => {
            const Icon = icons[i];
            return (
              <button
                key={id}
                aria-pressed={scenario === id}
                onClick={() => setScenario(id)}
                style={{ "--scenario-color": accents[i] } as React.CSSProperties}
              >
                <span className="rs-scenario-icon">
                  <Icon size={29} />
                </span>
                <span>
                  <strong>{copy.scenarios[i]}</strong>
                  <small>{copy.briefs[i]}</small>
                </span>
                <ChevronRight size={19} />
              </button>
            );
          })}
        </div>
        {hydrated ? (
          <ScenarioDashboard
            key={`${scenario}-${project?.id ?? "demo"}`}
            id={scenario}
            project={project}
            copy={copy}
          />
        ) : (
          <p role="status">{copy.loading}</p>
        )}
        <details
          className="rs-advanced"
          onToggle={(event) => {
            if (event.currentTarget.open) setAdvanced(true);
          }}
        >
          <summary>
            <SlidersHorizontal size={18} />
            <span>
              {copy.advanced}
              <small>{copy.advancedDesc}</small>
            </span>
            <ChevronDown size={19} />
          </summary>
          {advanced && (
            <div className="rs-advanced-content">
              <p className="rs-disclaimer">{copy.disclaimer}</p>
              <AdvancedModels />
            </div>
          )}
        </details>
      </main>
    </div>
  );
}
