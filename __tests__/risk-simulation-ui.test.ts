import { describe, expect, it } from "vitest";
import { getSimulationAssets } from "@/lib/risk-simulation-ui";
import type { Project } from "@/lib/project-manager";

function project(config: Project["config"]): Project {
  return {
    id: "plant",
    name: "Plant",
    description: "",
    industry: "Manufacturing",
    createdAt: "2026-10-11",
    updatedAt: "2026-10-11",
    config,
    assessment: { riskScore: 6.2 },
  };
}

describe("simulation project scope", () => {
  it("reads the single-device configuration saved by assessments without changing it", () => {
    const saved = project({
      deviceType: "PLC",
      manufacturer: "Siemens",
      model: "S7-1500",
      protocols: ["PROFINET", "Modbus TCP"],
      interfaces: ["Ethernet"],
      internetConnected: false,
    });
    const before = JSON.stringify(saved);
    expect(getSimulationAssets(saved)).toEqual([
      {
        name: "S7-1500",
        deviceType: "PLC",
        manufacturer: "Siemens",
        protocol: "PROFINET / Modbus TCP",
      },
    ]);
    expect(JSON.stringify(saved)).toBe(before);
  });
  it("keeps imported device names and protocols without inventing additional assets", () => {
    const saved = project({
      devices: [
        { name: "Packaging HMI", deviceType: "HMI", protocol: "OPC UA" },
        { deviceType: "PLC", model: "Line 2", protocols: ["S7"] },
      ],
    });
    expect(getSimulationAssets(saved)).toEqual([
      { name: "Packaging HMI", deviceType: "HMI", manufacturer: undefined, protocol: "OPC UA" },
      { name: "Line 2", deviceType: "PLC", manufacturer: undefined, protocol: "S7" },
    ]);
  });
  it.each([{}, { devices: [] }, null])(
    "does not substitute demo devices for an empty project (%j)",
    (config) => {
      expect(getSimulationAssets(project(config))).toEqual([]);
    }
  );
  it("provides explicitly identified demo assets only when no project is selected", () => {
    expect(getSimulationAssets()).toHaveLength(4);
    expect(getSimulationAssets().every((a) => a.manufacturer?.startsWith("Demo"))).toBe(true);
  });
});
