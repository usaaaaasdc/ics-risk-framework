import { afterEach, describe, expect, it, vi } from "vitest";
import {
  assessed,
  loadPredictor,
  parseProjects,
  portfolio,
  predictionInput,
} from "@/lib/intelligence-data";
import { AIRiskPredictor } from "@/lib/ai-risk-prediction";
import type { Project } from "@/lib/project-manager";

const project: Project = {
  id: "saved",
  name: "Saved PLC",
  description: "",
  industry: "Manufacturing",
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
  config: {
    deviceType: "PLC",
    manufacturer: "Siemens",
    model: "S7-1500",
    protocols: ["Modbus TCP"],
    internetConnected: true,
    isLegacy: false,
  },
  assessment: { riskScore: 7, vulnerabilities: [] },
};
afterEach(() => vi.unstubAllGlobals());

describe("intelligence data provenance", () => {
  it("excludes unassessed projects from average risk without changing legacy analytics", () => {
    const result = portfolio([project, { ...project, id: "draft", assessment: null }]);
    expect(result.projects).toHaveLength(2);
    expect(result.completed).toHaveLength(1);
    expect(result.average).toBe(7);
    expect(result.analytics.totalProjects).toBe(2);
    expect(result.analytics.protocolUsage[0].usage).toBe(2);
    expect(portfolio([]).average).toBeNull();
    expect(portfolio([{ ...project, assessment: null }]).average).toBeNull();
  });
  it("keeps a calculated zero distinct from missing assessment data", () => {
    const zero = { ...project, assessment: { riskScore: 0, vulnerabilities: [] } };
    expect(assessed(zero)).toBe(true);
    expect(portfolio([zero]).average).toBe(0);
    expect(predictionInput(zero)?.[0].riskScore).toBe(0);
    expect(predictionInput({ ...zero, config: { deviceType: "PLC" } })).toBeNull();
  });
  it("uses saved project fields in the existing prediction engine, without sample devices", () => {
    const inputs = predictionInput(project)!;
    expect(inputs).toEqual([
      {
        type: "PLC",
        manufacturer: "Siemens",
        protocols: ["Modbus TCP"],
        internetExposed: true,
        isLegacy: false,
        riskScore: 7,
        vulnerabilitiesFound: 0,
      },
    ]);
    expect(loadPredictor(null).predictor.predictRisk(inputs, project.industry)).toEqual(
      new AIRiskPredictor().predictRisk(inputs, project.industry)
    );
    expect(predictionInput(undefined)).toBeNull();
    expect(predictionInput({ ...project, assessment: null })).toBeNull();
  });
  it("validates project storage without dropping or mutating valid saved records", () => {
    const raw = JSON.stringify([project]);
    expect(JSON.stringify(parseProjects(raw))).toBe(raw);
    for (const raw of [
      "broken",
      "{}",
      "[null]",
      JSON.stringify([{ ...project, config: { model: {} } }]),
      JSON.stringify([{ ...project, assessment: { riskScore: 99, vulnerabilities: [] } }]),
    ]) {
      expect(() => parseProjects(raw)).toThrow();
    }
  });
  it("rejects malformed and empty-device history without invoking or rewriting the engine store", () => {
    const getItem = vi.fn();
    const setItem = vi.fn();
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", { getItem, setItem });
    for (const raw of [
      "broken",
      "{}",
      JSON.stringify([{ industry: "Manufacturing", timestamp: 1, devices: [] }]),
    ]) {
      const loaded = loadPredictor(raw);
      expect(loaded.invalidHistory).toBe(true);
      expect(loaded.statistics.totalAssessments).toBe(0);
    }
    expect(getItem).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
  });
  it("loads real history and preserves the historical industry adjustment", () => {
    const records = Array.from({ length: 6 }, (_, i) => ({
      timestamp: i + 1,
      industry: project.industry,
      devices: [{ ...predictionInput(project)![0], riskScore: i < 1 ? 3 : 7 }],
    }));
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", { getItem: () => JSON.stringify(records) });
    const loaded = loadPredictor(JSON.stringify(records));
    expect(loaded.invalidHistory).toBe(false);
    expect(loaded.statistics.totalAssessments).toBe(6);
    const original = new AIRiskPredictor();
    original.loadHistoricalData();
    expect(loaded.predictor.predictRisk(predictionInput(project)!, project.industry)).toEqual(
      original.predictRisk(predictionInput(project)!, project.industry)
    );
  });
});
