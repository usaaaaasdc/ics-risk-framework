import { iec62443Standards } from "@/lib/standards/iec62443";

export interface IECReviewState {
  checked: string[];
  notApplicable: string[];
  notes: Record<string, string>;
  targets: Record<string, number>;
  maturity: Record<string, number>;
}
export const emptyIECReview = (): IECReviewState => ({
  checked: [],
  notApplicable: [],
  notes: {},
  targets: {},
  maturity: {},
});
export const iecReviewKey = (scope: string) => `ics-iec-review:${scope}`;

/** Untrusted local notes must never become confirmed requirements or SL claims. */
export function parseIECReview(raw: string | null): IECReviewState {
  if (!raw) return emptyIECReview();
  try {
    const input: unknown = JSON.parse(raw);
    if (!input || typeof input !== "object") return emptyIECReview();
    const data = input as Record<string, unknown>;
    const ids = new Set(iec62443Standards.flatMap((fr) => fr.requirements.map((r) => r.id)));
    const checked = Array.isArray(data.checked)
      ? [
          ...new Set(
            data.checked.filter((id): id is string => typeof id === "string" && ids.has(id))
          ),
        ]
      : [];
    const notes: Record<string, string> = {};
    if (data.notes && typeof data.notes === "object")
      for (const [id, note] of Object.entries(data.notes)) {
        if (ids.has(id) && typeof note === "string") notes[id] = note.slice(0, 500);
      }
    const levels = (value: unknown, keys: Set<string>) => {
      const result: Record<string, number> = {};
      if (value && typeof value === "object")
        for (const [id, level] of Object.entries(value)) {
          if (
            keys.has(id) &&
            typeof level === "number" &&
            Number.isInteger(level) &&
            level >= 1 &&
            level <= 4
          )
            result[id] = level;
        }
      return result;
    };
    const notApplicable = Array.isArray(data.notApplicable)
      ? [
          ...new Set(
            data.notApplicable.filter(
              (id): id is string => typeof id === "string" && ids.has(id) && !checked.includes(id)
            )
          ),
        ]
      : [];
    return {
      checked,
      notApplicable,
      notes,
      targets: levels(
        data.targets,
        new Set(["zone-0", "zone-1", "zone-2", "zone-3", "C1", "C2", "C3"])
      ),
      maturity: levels(data.maturity, new Set(["0", "1", "2", "3", "4"])),
    };
  } catch {
    return emptyIECReview();
  }
}
