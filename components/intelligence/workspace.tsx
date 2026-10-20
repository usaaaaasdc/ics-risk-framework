"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  Cpu,
  Database,
  FileCheck2,
  Info,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { CommandShell, ScoreRing } from "@/components/assessment/command-shell";
import { useHydrated } from "@/hooks/use-hydrated";
import { useLanguage } from "@/lib/i18n/language-context";
import { intelligenceCopy, recommendationCopy } from "@/lib/intelligence-copy";
import {
  assessed,
  loadPredictor,
  parseProjects,
  portfolio,
  predictionInput,
} from "@/lib/intelligence-data";
import type { Project } from "@/lib/project-manager";
import "./workspace.css";

type Copy = ReturnType<typeof intelligenceCopy>;
type Prediction = ReturnType<ReturnType<typeof loadPredictor>["predictor"]["predictRisk"]>;

function Panel({
  title,
  note,
  children,
  className = "",
}: {
  title: string;
  note?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`in-panel ${className}`} aria-label={title}>
      <header>
        <h2>{title}</h2>
        {note && <p>{note}</p>}
      </header>
      {children}
    </section>
  );
}

function Metric({
  label,
  value,
  icon,
  attention = false,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  attention?: boolean;
}) {
  return (
    <div className={`in-metric ${attention ? "is-attention" : ""}`}>
      <span className="in-metric-icon" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p>{label}</p>
        <strong dir="ltr">{value}</strong>
      </div>
    </div>
  );
}

function risk(score: number) {
  return score >= 9 ? "critical" : score >= 7 ? "high" : score >= 4 ? "medium" : "low";
}
const colors = { critical: "#ff4f66", high: "#ff9452", medium: "#f5c452", low: "#3dd3b0" };

function SystemGlyph({ type }: { type?: string }) {
  return (
    <svg viewBox="0 0 120 110" className="in-system" aria-hidden="true">
      <path d="M8 87 61 102 113 83 60 68Z" fill="#0d2637" stroke="#245c7b" />
      <path d="M32 22 72 12 92 26 52 38Z" fill="#7795a8" stroke="#9eb4c3" />
      <path d="M32 22V78L52 92V38Z" fill="#273f50" stroke="#5e7d91" />
      <path d="M52 38 92 26V80L52 92Z" fill="#142d3e" stroke="#7695a9" />
      <path d="M57 43 87 34V53L57 62Z" fill="#091a26" stroke="#4d7994" />
      <path d="M61 48 82 42M61 53 76 49" stroke="#30ceff" strokeWidth="2" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M58 ${69 + i * 4} 76 ${64 + i * 4}`} stroke="#789aaa" />
      ))}
      <path d="M84 61V72" stroke="#29dab2" strokeWidth="3" />
      <path d="M26 84 13 89M97 83 109 88" stroke="#20bcf1" strokeWidth="2" />
      <text x="37" y="66" fontSize="8" fill="#c9dfea" transform="rotate(34 37 66)">
        {type?.slice(0, 5) || "ICS"}
      </text>
    </svg>
  );
}

function Empty({ c }: { c: Copy }) {
  return (
    <div className="in-empty">
      <Database size={38} aria-hidden="true" />
      <h2>{c.noData}</h2>
      <p>{c.noDataHelp}</p>
      <Link className="in-button" href="/assessment">
        {c.start}
        <ArrowUpRight size={16} />
      </Link>
      <Link href="/projects">{c.manage}</Link>
    </div>
  );
}

export function IntelligenceWorkspace({ mode }: { mode: "analytics" | "ai" }) {
  const { language } = useLanguage();
  const c = intelligenceCopy(language);
  const hydrated = useHydrated();
  const [revision, setRevision] = useState(0);
  const [scope, setScope] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [analysis, setAnalysis] = useState<{
    id: string;
    revision: number;
    result: Prediction;
  } | null>(null);
  const data = useMemo(() => {
    if (!hydrated) return null;
    try {
      return {
        projects: parseProjects(localStorage.getItem("ics-security-projects")),
        history: loadPredictor(localStorage.getItem("ics-risk-history")),
        error: false,
        revision,
      };
    } catch {
      return { projects: [], history: loadPredictor(null), error: true, revision };
    }
  }, [hydrated, revision]);
  const projects = useMemo(() => data?.projects ?? [], [data]);
  const filtered = useMemo(
    () => (scope ? projects.filter((p) => p.id === scope) : projects),
    [projects, scope]
  );
  const stats = useMemo(() => portfolio(filtered), [filtered]);
  const selected = filtered.find((p) => p.id === selectedId) ?? filtered[0];
  const aiProject = projects.find((p) => p.id === scope);
  const inputs = predictionInput(aiProject);
  const prediction =
    analysis?.id === aiProject?.id && analysis?.revision === revision ? analysis.result : null;
  const title = mode === "analytics" ? c.analytics : c.ai;
  return (
    <div className="in-workspace">
      <CommandShell
        section={mode}
        title={title}
        subtitle={mode === "analytics" ? c.analyticsIntro : c.aiIntro}
        disclaimer={c.disclaimer}
      >
        <div className="in-toolbar">
          <span className="in-source">
            <span />
            {c.provenance}
          </span>
          <label>
            {c.scope}
            <select
              value={scope}
              onChange={(e) => {
                setScope(e.target.value);
                setAnalysis(null);
              }}
            >
              <option value="">{mode === "analytics" ? c.all : c.choose}</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <button
            className="in-icon-button"
            aria-label={c.refresh}
            onClick={() => {
              setRevision((r) => r + 1);
              setAnalysis(null);
            }}
          >
            <RefreshCw size={18} />
          </button>
        </div>
        {!data ? (
          <p role="status" className="in-notice">
            {c.loading}
          </p>
        ) : data.error ? (
          <div className="in-notice" role="alert">
            <Info size={20} />
            {c.error}
            <Link href="/projects">{c.manage}</Link>
          </div>
        ) : mode === "analytics" ? (
          <>
            <div className="in-metrics">
              <Metric label={c.projects} value={filtered.length} icon={<Database size={25} />} />
              <Metric
                label={c.completed}
                value={stats.completed.length}
                icon={<ShieldCheck size={25} />}
              />
              <Metric
                label={c.matches}
                attention
                value={stats.completed.length ? stats.analytics.totalVulnerabilities : "—"}
                icon={<ShieldAlert size={25} />}
              />
              <Metric
                label={c.average}
                value={stats.average === null ? "—" : `${stats.average.toFixed(1)} / 10`}
                icon={<BarChart3 size={25} />}
              />
            </div>
            {!filtered.length ? (
              <Empty c={c} />
            ) : (
              <>
                <div className="in-main-grid">
                  <Panel title={c.map} note={c.mapHelp} className="in-landscape">
                    <div className="in-map-grid">
                      {filtered.map((p) => (
                        <button
                          key={p.id}
                          className={`in-node ${selected?.id === p.id ? "is-selected" : ""}`}
                          aria-pressed={selected?.id === p.id}
                          onClick={() => setSelectedId(p.id)}
                        >
                          <span className="in-node-top">
                            <span>{p.config?.deviceType || "ICS"}</span>
                            <span
                              style={{
                                color: assessed(p)
                                  ? colors[risk(p.assessment.riskScore)]
                                  : "#a8bdce",
                              }}
                            >
                              {assessed(p) ? p.assessment.riskScore.toFixed(1) : "—"}
                            </span>
                          </span>
                          <SystemGlyph type={p.config?.deviceType} />
                          <strong>{p.name}</strong>
                          <small>{p.config?.model || c.notAssessed}</small>
                          <span className="in-node-status">
                            {assessed(p) ? c[risk(p.assessment.riskScore)] : c.notAssessed}
                          </span>
                        </button>
                      ))}
                    </div>
                  </Panel>
                  <div className="in-side-stack">
                    <Panel title={c.distribution}>
                      <div className="in-distribution">
                        {(["critical", "high", "medium", "low"] as const).map((level) => {
                          const count = stats.completed.filter(
                            (p) => risk(p.assessment.riskScore) === level
                          ).length;
                          return (
                            <div key={level}>
                              <span>
                                <i style={{ background: colors[level] }} />
                                {c[level]}
                              </span>
                              <strong>{count}</strong>
                              <div className="in-bar">
                                <span
                                  style={{
                                    width: `${stats.completed.length ? (count / stats.completed.length) * 100 : 0}%`,
                                    background: colors[level],
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                        <p>
                          {c.notAssessed}
                          <strong>{filtered.length - stats.completed.length}</strong>
                        </p>
                      </div>
                    </Panel>
                    <Panel title={c.inspector}>
                      {selected && <Inspector project={selected} c={c} />}
                    </Panel>
                  </div>
                </div>
                <div className="in-lower-grid">
                  <Panel title={c.protocols} note={c.protocolHelp}>
                    {stats.analytics.protocolUsage.length ? (
                      <div className="in-protocols">
                        {[...stats.analytics.protocolUsage]
                          .sort((a, b) => b.usage - a.usage)
                          .map((p) => (
                            <div key={p.protocol}>
                              <span>
                                {p.protocol}
                                <small>
                                  {c[p.riskLevel.toLowerCase() as "high" | "medium" | "low"]}
                                </small>
                              </span>
                              <strong>{p.usage}</strong>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="in-muted">{c.none}</p>
                    )}
                  </Panel>
                  <Panel title={c.vulnerabilities} note={c.vulnHelp}>
                    {stats.analytics.topVulnerabilities.length ? (
                      <div className="in-table-wrap">
                        <table>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>{c.occurrences}</th>
                              <th>CVSS</th>
                              <th>{c.severity}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.analytics.topVulnerabilities.map((v) => (
                              <tr key={v.cveId}>
                                <td dir="ltr">{v.cveId}</td>
                                <td>{v.occurrences}</td>
                                <td>{v.averageCVSS.toFixed(1)}</td>
                                <td>
                                  {c[
                                    v.severity.toLowerCase() as
                                      | "critical"
                                      | "high"
                                      | "medium"
                                      | "low"
                                  ] ?? v.severity}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="in-muted">{c.none}</p>
                    )}
                  </Panel>
                </div>
                <details className="in-panel in-extra">
                  <summary>
                    {c.types} / {c.industries}
                  </summary>
                  <div className="in-breakdowns">
                    {[
                      stats.analytics.deviceTypeDistribution.map((d) => ({
                        name: d.type,
                        count: d.count,
                      })),
                      stats.analytics.industryDistribution.map((d) => ({
                        name: d.industry,
                        count: d.projectCount,
                      })),
                    ].map((group, i) => (
                      <ul key={i}>
                        {group.map((d) => (
                          <li key={d.name}>
                            <span>{d.name}</span>
                            <strong>{d.count}</strong>
                          </li>
                        ))}
                      </ul>
                    ))}
                  </div>
                </details>
              </>
            )}
            <div className="in-evidence">
              <FileCheck2 size={28} />
              <div>
                <h2>
                  {c.compliance} · {c.notAssessed}
                </h2>
                <p>{c.complianceHelp}</p>
              </div>
              <Link className="in-button is-secondary" href="/iec-calculator">
                {c.iec}
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="in-metrics">
              <Metric
                label={c.completed}
                value={projects.filter(assessed).length}
                icon={<ShieldCheck size={25} />}
              />
              <Metric
                label={c.history}
                value={data.history.statistics.totalAssessments}
                icon={<Database size={25} />}
              />
              <Metric
                label={c.historyAverage}
                value={
                  data.history.statistics.totalAssessments
                    ? `${data.history.statistics.averageRisk} / 10`
                    : "—"
                }
                icon={<BarChart3 size={25} />}
              />
            </div>
            {data.history.invalidHistory && (
              <p className="in-notice" role="status">
                {c.invalidHistory}
              </p>
            )}
            <div className="in-ai-grid">
              <Panel title={c.inputs} note={aiProject?.name ?? c.choose}>
                {aiProject ? (
                  <>
                    <Inspector project={aiProject} c={c} />
                    <dl className="in-facts">
                      <div>
                        <dt>{c.exposure}</dt>
                        <dd>
                          {typeof aiProject.config?.internetConnected === "boolean"
                            ? aiProject.config.internetConnected
                              ? c.yes
                              : c.no
                            : "—"}
                        </dd>
                      </div>
                      <div>
                        <dt>{c.legacy}</dt>
                        <dd>
                          {typeof aiProject.config?.isLegacy === "boolean"
                            ? aiProject.config.isLegacy
                              ? c.yes
                              : c.no
                            : "—"}
                        </dd>
                      </div>
                      <div>
                        <dt>{c.matches}</dt>
                        <dd>
                          {assessed(aiProject) ? aiProject.assessment.vulnerabilities.length : "—"}
                        </dd>
                      </div>
                    </dl>
                  </>
                ) : (
                  <p className="in-muted">{c.insufficient}</p>
                )}
                <button
                  className="in-button"
                  disabled={!inputs}
                  onClick={() => {
                    if (inputs && aiProject)
                      setAnalysis({
                        id: aiProject.id,
                        revision,
                        result: data.history.predictor.predictRisk(
                          inputs,
                          aiProject.industry || "Unknown"
                        ),
                      });
                  }}
                >
                  <BrainCircuit size={18} />
                  {c.run}
                </button>
              </Panel>
              <Panel title={c.result} className="in-analysis-result">
                <span className="in-pill">{c.heuristic}</span>
                <div className="in-result-body">
                  <ScoreRing
                    value={prediction ? Number(prediction.predictedRiskScore.toFixed(1)) : null}
                    max={10}
                    label={c.result}
                    color={prediction ? colors[risk(prediction.predictedRiskScore)] : "#698699"}
                  />
                  <div>
                    <h3>
                      {prediction
                        ? c[risk(prediction.predictedRiskScore)]
                        : inputs
                          ? c.ready
                          : c.notAssessed}
                    </h3>
                    <p>{prediction ? c.hypothetical : c.insufficient}</p>
                  </div>
                </div>
                <p className="in-result-note">
                  <Info size={17} />
                  {c.historyHelp}
                </p>
              </Panel>
            </div>
            {prediction && (
              <Panel title={c.guidance} note={c.guidanceHelp}>
                <ol className="in-recommendations">
                  {prediction.recommendations.map((r) => (
                    <li key={r}>{recommendationCopy(r, language)}</li>
                  ))}
                </ol>
              </Panel>
            )}
            {!projects.length && <Empty c={c} />}
            <details className="in-panel in-method" open>
              <summary>{c.method}</summary>
              <p>{c.methodHelp}</p>
              <p>{c.scoringRules}</p>
            </details>
          </>
        )}
      </CommandShell>
    </div>
  );
}

function Inspector({ project: p, c }: { project: Project; c: Copy }) {
  return (
    <div className="in-inspector">
      <div className="in-inspector-title">
        <Cpu size={25} />
        <strong>{p.name}</strong>
        <span dir={assessed(p) ? "ltr" : undefined}>
          {assessed(p) ? `${p.assessment.riskScore.toFixed(1)} / 10` : c.notAssessed}
        </span>
      </div>
      <dl className="in-facts">
        {[
          [c.device, p.config?.deviceType],
          [c.manufacturer, p.config?.manufacturer],
          [c.model, p.config?.model],
          [c.updated, p.updatedAt?.split("T")[0]],
        ].map(([name, value]) => (
          <div key={name}>
            <dt>{name}</dt>
            <dd>{value || "—"}</dd>
          </div>
        ))}
      </dl>
      <Link className="in-text-link" href={`/assessment?projectId=${encodeURIComponent(p.id)}`}>
        {c.review}
        <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}
