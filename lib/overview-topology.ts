import { dashboardAssets } from "./dashboard-data";
import { TopologyGenerator, type NetworkTopology } from "./network-topology";

// Explicit illustrative connections, shared with the overview's demo asset records.
export const overviewTopology: NetworkTopology = TopologyGenerator.calculateLayout({
  nodes: dashboardAssets.map((asset) => ({
    id: asset.id,
    label: asset.id,
    type: "device",
    risk: asset.risk,
    manufacturer: asset.name,
    protocol: asset.protocol,
  })),
  zones: ["DMZ", "Supervisory", "Control"].map((name, level) => ({
    id: name,
    name,
    level,
    nodes: dashboardAssets.filter((a) => a.zone === name).map((a) => a.id),
  })),
  links: dashboardAssets
    .filter((a) => a.id !== "GW-02")
    .map((a) => ({
      source: "GW-02",
      target: a.id,
      protocol: a.protocol,
      encrypted: false,
      bidirectional: true,
    })),
});
