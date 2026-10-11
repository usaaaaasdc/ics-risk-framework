// Reference telemetry for the frontend demo. These records are not live plant data.
export interface DashboardAsset {
  id: string;
  name: string;
  model: string;
  ip: string;
  zone: "Control" | "Supervisory" | "DMZ";
  protocol: string;
  risk: number;
  status: "Critical" | "High" | "Moderate";
  finding: string;
}

export const dashboardAssets: DashboardAsset[] = [
  {
    id: "PLC-01",
    name: "Assembly controller",
    model: "Siemens S7-1500",
    ip: "10.20.1.12",
    zone: "Control",
    protocol: "PROFINET",
    risk: 9.2,
    status: "Critical",
    finding:
      "Controller firmware is outside the approved baseline. Restrict engineering access and validate the patch plan during the next maintenance window.",
  },
  {
    id: "HMI-04",
    name: "Operator workstation",
    model: "SIMATIC HMI Comfort",
    ip: "10.20.2.24",
    zone: "Supervisory",
    protocol: "S7 / TCP",
    risk: 8.4,
    status: "High",
    finding:
      "An outdated operating system and a shared operator account increase exposure. Review account separation and endpoint hardening.",
  },
  {
    id: "GW-02",
    name: "Industrial edge gateway",
    model: "Moxa EDR-G9010",
    ip: "10.20.0.8",
    zone: "DMZ",
    protocol: "MODBUS TCP",
    risk: 7.8,
    status: "High",
    finding:
      "The gateway permits a broader source range than the approved zone policy. Review access rules between supervisory and control networks.",
  },
  {
    id: "RTU-03",
    name: "Remote telemetry unit",
    model: "Schneider SCADAPack",
    ip: "10.20.1.31",
    zone: "Control",
    protocol: "DNP3",
    risk: 6.6,
    status: "Moderate",
    finding:
      "Unauthenticated telemetry is enabled. Evaluate secure authentication support before the next configuration change.",
  },
  {
    id: "PLC-07",
    name: "Conveyor controller",
    model: "Allen-Bradley ControlLogix",
    ip: "10.20.1.47",
    zone: "Control",
    protocol: "ETHERNET/IP",
    risk: 6.1,
    status: "Moderate",
    finding:
      "The device configuration backup is overdue. Verify recovery procedures and refresh the signed baseline.",
  },
  {
    id: "HIS-01",
    name: "Process historian",
    model: "Industrial historian server",
    ip: "10.20.2.10",
    zone: "Supervisory",
    protocol: "OPC UA",
    risk: 5.7,
    status: "Moderate",
    finding:
      "A service certificate expires within 30 days. Schedule certificate rotation and confirm trust-chain continuity.",
  },
];

export const dashboardAlerts = [
  {
    id: "AL-001",
    asset: "PLC-01",
    title: "Unauthorized engineering access",
    detail: "An unapproved engineering station attempted a controller connection.",
    severity: "Critical",
    time: "2 min ago",
    icon: "access",
  },
  {
    id: "AL-002",
    asset: "HMI-04",
    title: "Firmware baseline deviation",
    detail: "The operator station no longer matches the approved software baseline.",
    severity: "High",
    time: "8 min ago",
    icon: "firmware",
  },
  {
    id: "AL-003",
    asset: "GW-02",
    title: "Unusual protocol activity",
    detail: "Modbus request volume exceeded the reference environment threshold.",
    severity: "High",
    time: "14 min ago",
    icon: "network",
  },
  {
    id: "AL-004",
    asset: "RTU-03",
    title: "Unexpected configuration read",
    detail: "A configuration query originated outside the maintenance subnet.",
    severity: "Moderate",
    time: "22 min ago",
    icon: "access",
  },
  {
    id: "AL-005",
    asset: "PLC-07",
    title: "Controller backup overdue",
    detail: "The most recent configuration backup is older than the policy interval.",
    severity: "Moderate",
    time: "36 min ago",
    icon: "firmware",
  },
  {
    id: "AL-006",
    asset: "HIS-01",
    title: "Certificate renewal approaching",
    detail: "The OPC UA service certificate is approaching its renewal window.",
    severity: "Moderate",
    time: "48 min ago",
    icon: "network",
  },
] as const;

export const trendSeries = {
  "24H": [7.1, 7.3, 6.8, 6.9, 7.1, 6.7, 6.8, 6.5, 6.7, 6.3, 6.5, 6.4],
  "7D": [7.6, 7.8, 7.5, 7.7, 7.2, 7.4, 7.1, 7.3, 6.8, 7.0, 6.7, 6.9, 6.5, 6.4],
  "30D": [
    8.2, 8.1, 8.4, 7.9, 8.0, 7.6, 7.9, 7.5, 7.7, 7.4, 7.6, 7.2, 7.3, 7.0, 7.2, 6.8, 7.0, 6.7, 6.9,
    6.6, 6.8, 6.4,
  ],
};

export const complianceStandards = [
  {
    name: "IEC 62443",
    subtitle: "Industrial automation security",
    progress: 94,
    href: "/iec-calculator",
  },
  {
    name: "NIST CSF",
    subtitle: "Cybersecurity framework",
    progress: 88,
    href: "/compliance-roadmap",
  },
  {
    name: "ISO 27001",
    subtitle: "Information security",
    progress: 91,
    href: "/compliance-roadmap",
  },
];
