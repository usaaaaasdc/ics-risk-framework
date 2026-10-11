import type { SimulationParams } from "./calculators/risk-engine";
import type { Project } from "./project-manager";

export type ScenarioId = "ransomware" | "access" | "plc" | "exfiltration" | "dos";
// Editable what-if assumptions, not calibrated attack likelihoods or predictions.
export const scenarioPresets: Record<ScenarioId, SimulationParams> = {
  ransomware: {
    baseImpact: 9.5,
    baseLikelihood: 0.95,
    mitigationFactor: 0.05,
    uncertainty: 0.2,
    iterations: 2000,
  },
  access: {
    baseImpact: 6.5,
    baseLikelihood: 0.6,
    mitigationFactor: 0.35,
    uncertainty: 0.2,
    iterations: 2000,
  },
  plc: {
    baseImpact: 9,
    baseLikelihood: 0.75,
    mitigationFactor: 0.25,
    uncertainty: 0.2,
    iterations: 2000,
  },
  exfiltration: {
    baseImpact: 7,
    baseLikelihood: 0.55,
    mitigationFactor: 0.4,
    uncertainty: 0.2,
    iterations: 2000,
  },
  dos: {
    baseImpact: 8,
    baseLikelihood: 0.7,
    mitigationFactor: 0.2,
    uncertainty: 0.2,
    iterations: 2000,
  },
};

export interface SimulationAsset {
  name: string;
  deviceType: string;
  manufacturer?: string;
  protocol?: string;
}
export function getSimulationAssets(project?: Project): SimulationAsset[] {
  const config = project?.config;
  if (!project)
    return [
      {
        name: "ENG-WS-01",
        deviceType: "Workstation",
        manufacturer: "Demo engineering station",
        protocol: "RDP",
      },
      {
        name: "SCADA-01",
        deviceType: "SCADA",
        manufacturer: "Demo supervisory server",
        protocol: "OPC UA",
      },
      {
        name: "HMI-01",
        deviceType: "HMI",
        manufacturer: "Demo operator panel",
        protocol: "S7 / TCP",
      },
      {
        name: "PLC-01",
        deviceType: "PLC",
        manufacturer: "Demo process controller",
        protocol: "PROFINET",
      },
    ];
  // Projects saved by assessment use a single SystemConfig; imported projects can
  // contain a device array. Read both without changing stored project data.
  if (!config) return [];
  const devices = Array.isArray(config.devices)
    ? config.devices
    : config.deviceType
      ? [config]
      : [];
  return devices.map(
    (
      device: {
        name?: string;
        deviceType?: string;
        model?: string;
        manufacturer?: string;
        protocol?: string;
        protocols?: string[];
      },
      i: number
    ) => ({
      name: device.name || device.model || `${device.deviceType || "Device"} ${i + 1}`,
      deviceType: device.deviceType || "Device",
      manufacturer: device.manufacturer,
      protocol: device.protocol || device.protocols?.join(" / "),
    })
  );
}
