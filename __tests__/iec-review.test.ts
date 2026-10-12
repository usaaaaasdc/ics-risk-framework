import { describe, expect, it } from "vitest";
import { emptyIECReview, iecReviewKey, parseIECReview } from "@/lib/iec-review-state";
import { calculateIECScore } from "@/lib/calculators/iec-score";
import { iec62443Standards } from "@/lib/standards/iec62443";

describe("IEC review integrity", () => {
  it("recovers invalid storage without manufacturing completed requirements", () => {
    for (const raw of [null, "{", "null", "42", "[]"])
      expect(parseIECReview(raw)).toEqual(emptyIECReview());
    expect(calculateIECScore(parseIECReview("{").checked).overallSL).toBe(0);
  });
  it("accepts only known unique requirements and bounded planning inputs", () => {
    const state = parseIECReview(
      JSON.stringify({
        checked: ["SR 1.1", "SR 1.1", "certified", false],
        notApplicable: ["SR 1.1", "SR 2.1", "SR 2.1", "fake"],
        notes: { "SR 1.1": "a".repeat(700), fake: "verified" },
        targets: { "zone-0": 3, C1: 4, C2: 5, C3: "2", unknown: 2 },
        maturity: { "0": 2, "1": 2.5, "2": 0, "5": 4 },
      })
    );
    expect(state.checked).toEqual(["SR 1.1"]);
    expect(state.notApplicable).toEqual(["SR 2.1"]);
    expect(state.notes).toEqual({ "SR 1.1": "a".repeat(500) });
    expect(state.targets).toEqual({ "zone-0": 3, C1: 4 });
    expect(state.maturity).toEqual({ "0": 2 });
    expect(iecReviewKey("project-A")).not.toBe(iecReviewKey("planning"));
  });
  it("never treats N/A or missing evidence as a satisfied requirement", () => {
    const all = iec62443Standards.flatMap((fr) => fr.requirements.map((r) => r.id));
    const state = parseIECReview(
      JSON.stringify({ notApplicable: all, notes: { "SR 1.1": "Scope assumption only" } })
    );
    expect(state.checked).toEqual([]);
    expect(calculateIECScore(state.checked).overallSL).toBe(0);
    expect(calculateIECScore(state.checked).frScores.every((fr) => fr.percentage === 0)).toBe(true);
  });
  it("preserves the existing weakest-link calculator and its SL-2 ceiling", () => {
    const all = iec62443Standards.flatMap((fr) => fr.requirements.map((r) => r.id));
    expect(calculateIECScore(all).overallSL).toBe(2);
    const first = iec62443Standards[0].requirements.find((r) => r.requiredForSL === 1)!;
    const result = calculateIECScore(all.filter((id) => id !== first.id));
    expect(result.overallSL).toBe(0);
    expect(result.frScores[0].missingRequirements).toContain(first.id);
    expect(result.frScores.slice(1).every((fr) => fr.achievedSL === 2)).toBe(true);
  });
});
