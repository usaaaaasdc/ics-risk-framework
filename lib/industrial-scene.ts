import { dashboardAssets } from "./dashboard-data";

export type ScenePoint = [number, number, number];
export type CameraAction = "left" | "right" | "in" | "out" | "reset";

// Physical positions in the illustrative assembly cell, in meters.
export const sceneAssets = [
  { id: "PLC-01", position: [-6.4, 0, 0.2], label: [-6.4, 3.05, 0.2] },
  { id: "GW-02", position: [-3.3, 0, -3.4], label: [-3.3, 2.1, -3.4] },
  { id: "HIS-01", position: [-0.8, 0, -3.6], label: [-0.8, 2.65, -3.6] },
  { id: "RTU-03", position: [6, 0, -0.3], label: [6, 1.95, -0.3] },
  { id: "PLC-07", position: [0, 0, 1.35], label: [-4.95, 1.6, 2.1] },
  { id: "HMI-04", position: [-3.7, 0, -0.15], label: [-3.7, 2.35, -0.15] },
].map((entry) => ({
  ...entry,
  position: entry.position as ScenePoint,
  label: entry.label as ScenePoint,
  asset: dashboardAssets.find((asset) => asset.id === entry.id)!,
}));

export const homeCamera: ScenePoint = [4.6, 3.2, 11.4];
export const cameraTarget: ScenePoint = [0, 1.35, 0.3];
