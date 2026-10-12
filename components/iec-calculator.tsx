"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { useHydrated } from "@/hooks/use-hydrated";
import { iec62443Standards } from "@/lib/standards/iec62443";
import { calculateIECScore } from "@/lib/calculators/iec-score";
import { ProjectManager, type Project } from "@/lib/project-manager";
import { assessmentCopy } from "@/lib/assessment-ui-copy";
import {
  emptyIECReview,
  iecReviewKey,
  parseIECReview,
  type IECReviewState,
} from "@/lib/iec-review-state";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScoreRing } from "@/components/assessment/command-shell";
import {
  IndustrialEnvironment,
  type EnvironmentAsset,
} from "@/components/assessment/industrial-environment";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileCheck2,
  Fingerprint,
  LockKeyhole,
  Network,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";

const icons = [Fingerprint, LockKeyhole, Settings, Database, Network, Activity, ShieldCheck];
const accents = ["#24bfff", "#25ddbd", "#ffb64b", "#ff6977"];

function IECReview({ project }: { project?: Project }) {
  const { language } = useLanguage();
  const c = assessmentCopy(language);
  const [stored, setStored] = useState(() => {
    try {
      return {
        review: parseIECReview(localStorage.getItem(iecReviewKey(project?.id ?? "planning"))),
        error: false,
      };
    } catch {
      return { review: emptyIECReview(), error: true };
    }
  });
  const review = stored.review;
  const updateReview = (update: (previous: IECReviewState) => IECReviewState) => {
    const next = update(review);
    try {
      localStorage.setItem(iecReviewKey(project?.id ?? "planning"), JSON.stringify(next));
      setStored({ review: next, error: false });
    } catch {
      setStored({ review: next, error: true });
    }
  };
  const [family, setFamily] = useState("FR1");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("zone-2");
  const results = calculateIECScore(review.checked);
  const requirements = iec62443Standards.flatMap((fr) => fr.requirements);
  const confirmed = review.checked.length;
  const notAssessed = requirements.length - confirmed - review.notApplicable.length;
  const coverage = Math.round((confirmed / requirements.length) * 100);
  const missing = requirements.filter((req) => !review.checked.includes(req.id));
  const text = (obj: { nameEn: string; nameAr: string; nameDe: string }) =>
    language === "ar" ? obj.nameAr : language === "de" ? obj.nameDe : obj.nameEn;
  const description = (obj: {
    descriptionEn: string;
    descriptionAr: string;
    descriptionDe: string;
  }) =>
    language === "ar"
      ? obj.descriptionAr
      : language === "de"
        ? obj.descriptionDe
        : obj.descriptionEn;
  const zoneNames = c.zoneNames.split("|");
  const assets = useMemo<EnvironmentAsset[]>(() => {
    if (project?.config?.devices && Array.isArray(project.config.devices))
      return project.config.devices.map((device: Record<string, unknown>, i: number) => ({
        id: `asset-${i}`,
        label: String(device.name || device.model || `Asset ${i + 1}`),
        kind: String(device.deviceType || "PLC"),
        zone: /hmi|scada/i.test(String(device.deviceType))
          ? 1
          : /sensor|actuator/i.test(String(device.deviceType))
            ? 3
            : 2,
      }));
    if (project?.config?.model)
      return [
        {
          id: "project-asset",
          label: project.config.model,
          kind: project.config.deviceType,
          zone: 2,
        },
      ];
    return assessmentCopy(language)
      .zoneNames.split("|")
      .map((label, i) => ({
        id: `zone-${i}`,
        label,
        kind: ["PLC", "SCADA", "PLC", "Sensor"][i],
        zone: i,
      }));
  }, [project, language]);
  const changeLevel = (group: "targets" | "maturity", id: string, value: string) =>
    updateReview((prev) => ({ ...prev, [group]: { ...prev[group], [id]: Number(value) } }));
  const levelSelect = (group: "targets" | "maturity", id: string, label: string) => (
    <select
      aria-label={label}
      value={review[group][id] || ""}
      onChange={(e) => changeLevel(group, id, e.target.value)}
    >
      <option value="">{c.unset}</option>
      {[1, 2, 3, 4].map((n) => (
        <option value={n} key={n}>
          {group === "targets" ? "SL-T " : ""}
          {n}
        </option>
      ))}
    </select>
  );
  const openReq = (id: string) => {
    setFamily(iec62443Standards.find((fr) => fr.requirements.some((r) => r.id === id))!.id);
    document.getElementById("iec-evidence")?.scrollIntoView({ block: "start" });
  };
  return (
    <>
      <div className="ac-iec-summary" id="iec-overview">
        <section className="ac-panel">
          <ClipboardCheck size={26} />
          <div>
            <small>{c.sl}</small>
            <strong data-testid="iec-level" dir={confirmed ? "ltr" : undefined}>
              {confirmed ? `SL-${results.overallSL}` : c.unassessed}
            </strong>
          </div>
          <p>{c.subset}</p>
        </section>
        <section className="ac-panel ac-coverage">
          <ScoreRing value={coverage} label={c.coverage} />
          <div>
            <h2>{c.coverage}</h2>
            <p>
              <i className="ac-dot" /> {c.confirmed} <b data-testid="iec-confirmed">{confirmed}</b>
            </p>
            <p>
              <i className="ac-dot amber" /> {c.unassessed} <b>{notAssessed}</b>
            </p>
            <p>
              <i className="ac-dot neutral" /> N/A{" "}
              <b data-testid="iec-na">{review.notApplicable.length}</b>
            </p>
            <small>
              <bdi dir="ltr">
                {confirmed} / {requirements.length} · IEC 62443-3-3
              </bdi>
            </small>
          </div>
        </section>
      </div>
      <nav className="ac-tabs" aria-label={c.compliance}>
        {[
          ["iec-overview", c.overview],
          ["iec-zones", c.zones],
          ["iec-families", c.families],
          ["iec-gaps", c.gap],
          ["iec-maturity", c.maturity],
          ["iec-evidence", c.evidence],
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
        <Link href="/compliance-roadmap">
          {c.roadmap}
          <ArrowUpRight size={13} />
        </Link>
      </nav>
      <nav className="ac-review-steps" aria-label={c.review}>
        {c.reviewSteps.split("|").map((label, i) => (
          <a key={label} href={`#${["iec-zones", "iec-evidence", "iec-gaps"][i]}`}>
            {label}
          </a>
        ))}
      </nav>
      <div className="ac-iec-hero" id="iec-zones">
        <IndustrialEnvironment
          assets={assets}
          selectedId={selected}
          onSelect={setSelected}
          compliance
          targets={review.targets}
        />
        <div className="ac-iec-side">
          <section className="ac-panel">
            <div className="ac-panel-heading">
              <h2>{c.targets}</h2>
              <ShieldCheck size={15} />
            </div>
            <div className="ac-targets">
              {zoneNames.map((zone, i) => (
                <label key={zone} style={{ borderColor: accents[i] }}>
                  <ShieldCheck size={19} style={{ color: accents[i] }} />
                  <span>{zone}</span>
                  {levelSelect("targets", `zone-${i}`, `${c.targets}: ${zone}`)}
                </label>
              ))}
            </div>
            <p className="ac-help">{c.targetNote}</p>
          </section>
          <section className="ac-panel">
            <div className="ac-panel-heading">
              <h2>{c.conduits}</h2>
              <Network size={16} />
            </div>
            <div className="ac-conduit-list">
              {[0, 1, 2].map((i) => (
                <label key={i}>
                  <Network size={16} style={{ color: accents[i] }} />
                  <b>C{i + 1}</b>
                  <span>
                    {zoneNames[i]} ↔ {zoneNames[i + 1]}
                  </span>
                  {levelSelect("targets", `C${i + 1}`, `C${i + 1} SL-T`)}
                </label>
              ))}
            </div>
            <p className="ac-help">{c.conduitNote}</p>
            <p className="ac-selection" role="status">
              {c.inspect}: {assets.find((a) => a.id === selected)?.label ?? c.zones}
            </p>
          </section>
        </div>
      </div>
      <section className="ac-panel" id="iec-families">
        <div className="ac-panel-heading">
          <h2>{c.families}</h2>
          <small>IEC 62443-3-3</small>
        </div>
        <div className="ac-family-grid">
          {iec62443Standards.map((fr, i) => {
            const score = results.frScores[i];
            const Icon = icons[i];
            return (
              <button key={fr.id} onClick={() => openReq(fr.requirements[0].id)}>
                <Icon size={25} />
                <h3>{text(fr)}</h3>
                <span>
                  {fr.id} ·{" "}
                  {fr.requirements.some((r) => review.checked.includes(r.id))
                    ? `SL-${score.achievedSL}`
                    : c.unassessed}
                </span>
                <ScoreRing
                  value={score.percentage}
                  label={`${fr.id} ${c.coverage}`}
                  color={score.percentage === 100 ? "#26deaf" : "#36bdf4"}
                />
                <small>
                  <bdi dir="ltr">
                    {fr.requirements.length - score.missingRequirements.length} /{" "}
                    {fr.requirements.length}
                  </bdi>{" "}
                  · {c.confirmed}
                </small>
              </button>
            );
          })}
        </div>
      </section>
      <div className="ac-iec-lower">
        <section className="ac-panel" id="iec-gaps">
          <div className="ac-panel-heading">
            <h2>{c.gap}</h2>
            <FileCheck2 size={16} />
          </div>
          <div className="ac-gap-summary">
            <strong>{missing.length}</strong>
            <span>
              {c.gaps}
              <small>
                {c.scope}: {project?.name ?? c.planning}
              </small>
            </span>
          </div>
          {results.frScores.map((fr) => (
            <div className="ac-gap-bar" key={fr.frId}>
              <b>{fr.frId}</b>
              <div className="ac-meter">
                <i style={{ width: `${100 - fr.percentage}%`, background: "#ffb454" }} />
              </div>
              <span>{fr.missingRequirements.length}</span>
            </div>
          ))}
        </section>
        <section className="ac-panel" id="iec-maturity">
          <div className="ac-panel-heading">
            <h2>{c.maturity}</h2>
            <Activity size={16} />
          </div>
          <div className="ac-maturity">
            {c.maturityNames.split("|").map((name, i) => (
              <label key={i}>
                <span>{name}</span>
                <div className="ac-meter">
                  <i style={{ width: `${(review.maturity[i] || 0) * 25}%` }} />
                </div>
                {levelSelect("maturity", String(i), `${c.maturity}: ${name}`)}
              </label>
            ))}
          </div>
          <p className="ac-help">{c.maturityNote}</p>
        </section>
        <section className="ac-panel">
          <div className="ac-panel-heading">
            <h2>{c.roadmap}</h2>
            <Link className="ac-text-button" href="/compliance-roadmap">
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <ol className="ac-remediation">
            {missing.slice(0, 5).map((r, i) => (
              <li key={r.id}>
                <span>{i + 1}</span>
                <button onClick={() => openReq(r.id)}>
                  <strong>{r.id}</strong>
                  {text(r)}
                  <small>
                    {c.review} · SL-{r.requiredForSL}
                  </small>
                </button>
              </li>
            ))}
          </ol>
          {!missing.length && <p className="ac-help">{c.subset}</p>}
        </section>
      </div>
      <section className="ac-panel ac-checklist" id="iec-evidence">
        <div className="ac-panel-heading">
          <h2>{c.evidence}</h2>
          <label className="ac-evidence-search">
            <Search size={15} />
            <input
              aria-label={c.evidence}
              placeholder="SR / FR…"
              value={query}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);
                const match = iec62443Standards.find((fr) =>
                  fr.requirements.some((r) =>
                    `${fr.id} ${r.id} ${text(r)}`.toLowerCase().includes(value.toLowerCase().trim())
                  )
                );
                if (match) setFamily(match.id);
              }}
            />
          </label>
        </div>
        <p className="ac-help">{c.evidenceNote}</p>
        <p className="ac-help">{c.naNote}</p>
        <Accordion type="single" collapsible value={family} onValueChange={setFamily}>
          {iec62443Standards
            .filter((fr) =>
              fr.requirements.some((r) =>
                `${fr.id} ${r.id} ${text(r)}`.toLowerCase().includes(query.toLowerCase().trim())
              )
            )
            .map((fr) => (
              <AccordionItem value={fr.id} key={fr.id}>
                <AccordionTrigger>
                  <span>
                    {fr.id} · {text(fr)}
                  </span>
                  <span className="ac-badge">
                    {results.frScores.find((s) => s.frId === fr.id)?.percentage}%
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="ac-requirements">
                    {fr.requirements
                      .filter((r) =>
                        `${fr.id} ${r.id} ${text(r)}`
                          .toLowerCase()
                          .includes(query.toLowerCase().trim())
                      )
                      .map((req) => (
                        <div key={req.id} className="ac-requirement">
                          <Checkbox
                            id={req.id}
                            checked={review.checked.includes(req.id)}
                            onCheckedChange={() =>
                              updateReview((prev) => ({
                                ...prev,
                                checked: prev.checked.includes(req.id)
                                  ? prev.checked.filter((id) => id !== req.id)
                                  : [...prev.checked, req.id],
                                notApplicable: prev.notApplicable.filter((id) => id !== req.id),
                              }))
                            }
                          />
                          <div>
                            <label htmlFor={req.id}>
                              <b dir="ltr">{req.id}</b> {text(req)}
                            </label>
                            <span className="ac-badge">
                              SL-{req.requiredForSL} ·{" "}
                              {review.checked.includes(req.id)
                                ? c.confirmed
                                : review.notApplicable.includes(req.id)
                                  ? c.notApplicable
                                  : c.unassessed}
                            </span>
                            <button
                              type="button"
                              className="ac-na-button"
                              aria-label={`${req.id} ${c.notApplicable}`}
                              aria-pressed={review.notApplicable.includes(req.id)}
                              onClick={() =>
                                updateReview((prev) => ({
                                  ...prev,
                                  checked: prev.checked.filter((id) => id !== req.id),
                                  notApplicable: prev.notApplicable.includes(req.id)
                                    ? prev.notApplicable.filter((id) => id !== req.id)
                                    : [...prev.notApplicable, req.id],
                                }))
                              }
                            >
                              N/A
                            </button>
                            <details className="ac-evidence-details">
                              <summary aria-label={`${req.id} ${c.reviewDetails}`}>
                                {c.reviewDetails}
                                <small>
                                  {review.notes[req.id] ? c.evidenceRef : c.notProvided}
                                </small>
                              </summary>
                              <p>{description(req)}</p>
                              <label className="ac-evidence-note">
                                <span>{c.evidenceRef}</span>
                                <input
                                  aria-label={`${req.id} ${c.evidenceRef}`}
                                  maxLength={500}
                                  value={review.notes[req.id] || ""}
                                  onChange={(e) =>
                                    updateReview((prev) => ({
                                      ...prev,
                                      notes: { ...prev.notes, [req.id]: e.target.value },
                                    }))
                                  }
                                />
                              </label>
                            </details>
                          </div>
                          <CheckCircle2
                            size={17}
                            color={review.checked.includes(req.id) ? "#2adfb1" : "#466174"}
                          />
                        </div>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
        {query &&
          !iec62443Standards.some((fr) =>
            fr.requirements.some((r) =>
              `${fr.id} ${r.id} ${text(r)}`.toLowerCase().includes(query.toLowerCase().trim())
            )
          ) && (
            <p className="ac-help" role="status">
              {c.noMatches}
            </p>
          )}
      </section>
      <p className="ac-help" role="status">
        {stored.error ? c.storageError : c.saved}
      </p>
    </>
  );
}

export default function IECCalculator() {
  const { language } = useLanguage();
  const c = assessmentCopy(language);
  const hydrated = useHydrated();
  const saved = useMemo(() => {
    if (!hydrated) return { projects: [] as Project[], error: false };
    try {
      const projects = ProjectManager.getAllProjects();
      if (!Array.isArray(projects)) throw Error();
      return { projects, error: false };
    } catch {
      return { projects: [] as Project[], error: true };
    }
  }, [hydrated]);
  const storedScope = useMemo(() => {
    if (!hydrated) return "planning";
    try {
      return localStorage.getItem("ics-iec-scope") || "planning";
    } catch {
      return "planning";
    }
  }, [hydrated]);
  const [scope, setScope] = useState<string | null>(null);
  const [scopeError, setScopeError] = useState(false);
  const project = saved.projects.find((p) => p.id === (scope ?? storedScope));
  const activeScope = project?.id ?? "planning";
  return (
    <>
      <div className="ac-toolbar">
        <label className="ac-scope">
          <span>{c.scope}</span>
          <select
            aria-label={c.scope}
            value={activeScope}
            onChange={(e) => {
              setScope(e.target.value);
              try {
                localStorage.setItem("ics-iec-scope", e.target.value);
                setScopeError(false);
              } catch {
                setScopeError(true);
              }
            }}
          >
            <option value="planning">{c.planning}</option>
            {saved.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <span className="ac-badge">
          {c.local} · {c.review}
        </span>
      </div>
      {(saved.error || scopeError) && <p role="alert">{c.storageError}</p>}
      {hydrated && <IECReview key={activeScope} project={project} />}
    </>
  );
}
