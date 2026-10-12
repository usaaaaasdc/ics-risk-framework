import { generateAnalytics } from "./analytics";
import { AIRiskPredictor } from "./ai-risk-prediction";
import type { Project } from "./project-manager";

const score = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 10;

export function assessed(project: Project): boolean {
  return score(project.assessment?.riskScore);
}

export function parseProjects(raw: string | null): Project[] {
  const value: unknown = JSON.parse(raw ?? "[]");
  if (
    !Array.isArray(value) ||
    value.some(
      (p) =>
        !p ||
        typeof p.id !== "string" ||
        typeof p.name !== "string" ||
        typeof p.createdAt !== "string" ||
        (p.updatedAt !== undefined && typeof p.updatedAt !== "string") ||
        (p.industry !== undefined && typeof p.industry !== "string") ||
        ["deviceType", "manufacturer", "model"].some(
          (key) => p.config?.[key] !== undefined && typeof p.config[key] !== "string"
        ) ||
        (p.config?.protocols !== undefined &&
          (!Array.isArray(p.config.protocols) ||
            p.config.protocols.some((v: unknown) => typeof v !== "string"))) ||
        (p.assessment &&
          (!score(p.assessment.riskScore) ||
            !Array.isArray(p.assessment.vulnerabilities) ||
            p.assessment.vulnerabilities.some(
              (v: { id?: unknown; cvss?: unknown; severity?: unknown } | null) =>
                !v || typeof v.id !== "string" || !score(v.cvss) || typeof v.severity !== "string"
            )))
    )
  ) {
    throw new Error("Invalid project data");
  }
  return value;
}

export function portfolio(projects: Project[]) {
  const completed = projects.filter(assessed);
  const analytics = generateAnalytics(projects);
  return {
    projects,
    completed,
    analytics,
    // Draft projects are not zero-risk assessments.
    average: completed.length
      ? completed.reduce((sum, p) => sum + p.assessment.riskScore, 0) / completed.length
      : null,
  };
}

export function predictionInput(project: Project | undefined) {
  const c = project?.config;
  if (
    !project ||
    !assessed(project) ||
    !c ||
    typeof c.deviceType !== "string" ||
    typeof c.manufacturer !== "string" ||
    !Array.isArray(c.protocols) ||
    typeof c.internetConnected !== "boolean" ||
    typeof c.isLegacy !== "boolean"
  )
    return null;
  return [
    {
      type: c.deviceType,
      manufacturer: c.manufacturer,
      protocols: c.protocols as string[],
      internetExposed: c.internetConnected,
      isLegacy: c.isLegacy,
      riskScore: project.assessment.riskScore as number,
      vulnerabilitiesFound: project.assessment.vulnerabilities.length as number,
    },
  ];
}

/** Validate persisted inputs before invoking the unchanged heuristic engine. Never rewrite storage. */
export function loadPredictor(raw: string | null) {
  const predictor = new AIRiskPredictor();
  try {
    const entries: unknown = JSON.parse(raw ?? "[]");
    if (
      !Array.isArray(entries) ||
      entries.some(
        (entry) =>
          !entry ||
          typeof entry.industry !== "string" ||
          !Number.isFinite(entry.timestamp) ||
          !Array.isArray(entry.devices) ||
          !entry.devices.length ||
          entry.devices.some(
            (d: Record<string, unknown>) =>
              !d ||
              !score(d.riskScore) ||
              typeof d.type !== "string" ||
              typeof d.manufacturer !== "string" ||
              !Array.isArray(d.protocols) ||
              d.protocols.some((p) => typeof p !== "string") ||
              typeof d.internetExposed !== "boolean" ||
              typeof d.isLegacy !== "boolean" ||
              typeof d.vulnerabilitiesFound !== "number" ||
              !Number.isFinite(d.vulnerabilitiesFound) ||
              d.vulnerabilitiesFound < 0
          )
      )
    ) {
      return { predictor, statistics: predictor.getStatistics(), invalidHistory: true };
    }
    if (raw !== null) predictor.loadHistoricalData();
    return { predictor, statistics: predictor.getStatistics(), invalidHistory: false };
  } catch {
    return { predictor, statistics: predictor.getStatistics(), invalidHistory: true };
  }
}
