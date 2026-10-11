"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ArrowUpRight, Cpu, Info, ShieldAlert, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { assessmentCopy } from "@/lib/assessment-ui-copy";
import type { SystemConfig, RiskAssessment } from "@/lib/risk-engine";
import { performSTRIDEAnalysis } from "@/lib/advanced-analysis";
import { IndustrialEnvironment, type EnvironmentAsset } from "./industrial-environment";
import { ScoreRing } from "./command-shell";

export function AssessmentOverview({
  config,
  assessment,
}: {
  config: SystemConfig | null;
  assessment: RiskAssessment | null;
}) {
  const { language, t } = useLanguage();
  const c = assessmentCopy(language);
  const [selected, setSelected] = useState("assessed-asset");
  const [cell, setCell] = useState<string | null>(null);
  const assets: EnvironmentAsset[] = [
    { id: "context-scada", label: "SCADA · context", kind: "SCADA", zone: 1 },
    { id: "context-hmi", label: "HMI · context", kind: "HMI", zone: 1 },
    {
      id: "assessed-asset",
      label: config?.model || "PLC · context",
      kind: config?.deviceType || "PLC",
      manufacturer: config?.manufacturer,
      zone: 2,
    },
    { id: "context-field", label: "Field · context", kind: "Sensor", zone: 3 },
  ];
  const asset = assets.find((a) => a.id === selected)!;
  const isAssessedAsset = selected === "assessed-asset" && !!config;
  const score = isAssessedAsset ? (assessment?.riskScore ?? null) : null;
  const color =
    score === null ? "#36bdf4" : score >= 7 ? "#ff6574" : score >= 4 ? "#ffbd5c" : "#2ee0b4";
  const threats = useMemo(
    () => (config && assessment ? Object.values(performSTRIDEAnalysis(config)).flat() : []),
    [config, assessment]
  );
  const tiers = ["Low", "Medium", "High"];
  const shownThreats = cell
    ? threats.filter((threat) => `${threat.likelihood}:${threat.impact}` === cell)
    : threats;
  const mean = assessment?.vulnerabilities.length
    ? assessment.vulnerabilities.reduce((s, v) => s + v.cvss, 0) / assessment.vulnerabilities.length
    : 0;
  const factors = [mean, config?.internetConnected ? 10 : 0, config?.isLegacy ? 10 : 0];
  const recs = assessment
    ? language === "ar"
      ? assessment.recommendations_ar
      : assessment.recommendations
    : [];
  return (
    <>
      <div className="ac-assessment-hero">
        <IndustrialEnvironment
          assets={assets}
          selectedId={selected}
          onSelect={setSelected}
          risk={isAssessedAsset ? assessment?.riskScore : undefined}
        />
        <section className="ac-panel ac-inspector" aria-label={c.details}>
          <div className="ac-panel-heading">
            <h2>{c.details}</h2>
            <Cpu size={17} />
          </div>
          <div className="ac-inspector-body">
            <div className="ac-asset-info">
              <span className="ac-badge">{isAssessedAsset ? c.scope : c.schematic}</span>
              <h3>{isAssessedAsset ? config.model : asset.label}</h3>
              <p>
                {isAssessedAsset ? `${config.manufacturer} · ${config.deviceType}` : c.unassessed}
              </p>
              <dl>
                {[
                  [t("activeProtocols"), isAssessedAsset ? config.protocols.join(", ") : "—"],
                  [t("interfaces"), isAssessedAsset ? config.interfaces.join(", ") : "—"],
                  [t("osVersion"), isAssessedAsset ? config.osVersion || "—" : "—"],
                  [
                    t("exposureLevel"),
                    isAssessedAsset
                      ? assessment?.attackSurface.exposureLevel || c.unassessed
                      : c.unassessed,
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd dir="auto">{value || "—"}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="ac-risk-gauge">
              <h3>{c.score}</h3>
              <ScoreRing
                value={score === null ? null : Number(score.toFixed(1))}
                max={10}
                label={c.score}
                color={color}
              />
              <span className="ac-badge" style={{ color }}>
                {score === null ? c.unassessed : assessment?.riskLevel}
              </span>
              <small>{score === null ? c.pending : c.calculated}</small>
            </div>
          </div>
        </section>
      </div>
      <div className="ac-analysis-grid">
        <section className="ac-panel">
          <div className="ac-panel-heading">
            <h2>{c.factors}</h2>
            <Info size={15} />
          </div>
          <div className="ac-factors">
            {c.factorNames.split("|").map((label, i) => (
              <div key={label}>
                <ShieldAlert size={20} />
                <span>
                  {label}
                  <small>{["60%", "30%", "10%"][i]}</small>
                </span>
                <div className="ac-meter">
                  <i
                    style={{
                      width: assessment ? `${factors[i] * 10}%` : "0%",
                      background: i === 0 ? "#ff6976" : "#2ac2fb",
                    }}
                  />
                </div>
                <b dir="ltr">{assessment ? factors[i].toFixed(1) : "—"}</b>
              </div>
            ))}
          </div>
          <p className="ac-help">{c.model}</p>
        </section>
        <section className="ac-panel ac-matrix-panel">
          <div className="ac-panel-heading">
            <h2>{c.matrix}</h2>
            <button className="ac-text-button" onClick={() => setCell(null)}>
              {c.overview}
            </button>
          </div>
          <div className="ac-matrix-wrap" dir="ltr">
            <span>{c.impact} ↑</span>
            <div>
              <div className="ac-matrix">
                {[2, 1, 0].flatMap((y) =>
                  [0, 1, 2].map((x) => {
                    const id = `${tiers[x]}:${tiers[y]}`;
                    const count = threats.filter(
                      (threat) => `${threat.likelihood}:${threat.impact}` === id
                    ).length;
                    return (
                      <button
                        key={id}
                        aria-label={`${c.likelihood} ${c.levels.split("|")[x]}, ${c.impact} ${c.levels.split("|")[y]}: ${count}`}
                        aria-pressed={cell === id}
                        onClick={() => setCell(cell === id ? null : id)}
                        style={{
                          background: ["#166c65", "#627d45", "#aa8137", "#a94b35", "#a13242"][
                            x + y
                          ],
                        }}
                      >
                        <b>{count || "·"}</b>
                      </button>
                    );
                  })
                )}
              </div>
              <small>{c.likelihood} →</small>
            </div>
          </div>
          <p className="ac-help">STRIDE · {c.hypothetical}</p>
        </section>
        <section className="ac-panel ac-threats">
          <div className="ac-panel-heading">
            <h2>{c.threats}</h2>
            <span className="ac-badge">{shownThreats.length}</span>
          </div>
          <div className="ac-threat-list">
            {shownThreats.length ? (
              shownThreats.map((threat) => (
                <details key={threat.threat}>
                  <summary>
                    <AlertTriangle size={19} />
                    <span>{threat.threat}</span>
                    <b>{c.levels.split("|")[tiers.indexOf(threat.impact)]}</b>
                  </summary>
                  <p>{threat.mitigation}</p>
                </details>
              ))
            ) : (
              <p className="ac-help">{assessment ? c.hypothetical : c.pending}</p>
            )}
          </div>
        </section>
      </div>
      <div className="ac-summary-grid">
        <section className="ac-panel">
          <div className="ac-panel-heading">
            <h2>{c.summary}</h2>
            <ShieldCheck size={16} />
          </div>
          <div className="ac-summary-stats">
            <div>
              <small>{t("riskScore")}</small>
              <strong dir="ltr">
                {assessment?.riskScore.toFixed(1) ?? "—"}
                <small>/10</small>
              </strong>
            </div>
            <div>
              <small>{t("vulnerabilities")}</small>
              <strong>{assessment?.vulnerabilities.length ?? "—"}</strong>
            </div>
            <div>
              <small>{c.riskLevel}</small>
              <strong className="ac-status-value">{assessment?.riskLevel ?? c.unassessed}</strong>
            </div>
          </div>
          <p className="ac-help">{assessment ? c.calculated : c.pending}</p>
        </section>
        <section className="ac-panel">
          <div className="ac-panel-heading">
            <h2>{c.assumptions}</h2>
            <Info size={15} />
          </div>
          <ul className="ac-notes">
            <li>{c.hypothetical}</li>
            <li>{c.schematic}</li>
            <li>{c.model}</li>
          </ul>
        </section>
        <section className="ac-panel">
          <div className="ac-panel-heading">
            <h2>{c.recommendations}</h2>
            <ArrowUpRight size={15} />
          </div>
          <ol className="ac-recommendations">
            {recs.slice(0, 4).map((rec, i) => (
              <li key={rec}>
                <span>{i + 1}</span>
                {rec}
              </li>
            ))}
          </ol>
          {!recs.length && <p className="ac-help">{c.pending}</p>}
        </section>
      </div>
    </>
  );
}
