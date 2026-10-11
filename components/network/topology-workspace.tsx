"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Boxes,
  Download,
  FileText,
  Globe,
  Layers,
  Menu,
  Network,
  Radar,
  Search,
  Shield,
  ShieldAlert,
  Workflow,
  X,
} from "lucide-react";
import { useLanguage, type Language } from "@/lib/i18n/language-context";
import { useHydrated } from "@/hooks/use-hydrated";
import { ProjectManager, type Project } from "@/lib/project-manager";
import { TopologyGenerator } from "@/lib/network-topology";
import { topologyCopy } from "@/lib/topology-copy";
import { IndustrialGlyph, TopologyMap, riskColor } from "./topology-map";

const demoProject = {
  config: {
    devices: [
      { name: "PLC-3A", deviceType: "PLC", manufacturer: "Siemens", protocol: "PROFINET" },
      { name: "HMI-01", deviceType: "HMI", manufacturer: "Rockwell", protocol: "EtherNet/IP" },
      { name: "Sensors", deviceType: "Sensor", manufacturer: "Phoenix", protocol: "Modbus" },
      { name: "SCADA-01", deviceType: "SCADA", manufacturer: "Schneider", protocol: "DNP3" },
      { name: "RTU-01", deviceType: "Controller", manufacturer: "Schneider", protocol: "DNP3" },
      { name: "Valves", deviceType: "Actuator", manufacturer: "Siemens", protocol: "PROFINET" },
    ],
  },
  assessment: { riskScore: 7.4 },
};

export function TopologyWorkspace() {
  const { language, setLanguage, isRTL } = useLanguage();
  const copy = topologyCopy[language];
  const hydrated = useHydrated();
  const saved = useMemo(() => {
    if (!hydrated) return { projects: [] as Project[], error: false };
    try {
      const projects = ProjectManager.getAllProjects();
      if (!Array.isArray(projects)) throw new Error("Invalid projects");
      return { projects, error: false };
    } catch {
      return { projects: [] as Project[], error: true };
    }
  }, [hydrated]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const project =
    projectId === "demo"
      ? undefined
      : (saved.projects.find((p) => p.id === projectId) ?? saved.projects.at(-1));
  const topology = useMemo(
    () =>
      hydrated
        ? TopologyGenerator.calculateLayout(
            TopologyGenerator.generateFromProject(project ?? demoProject)
          )
        : null,
    [hydrated, project]
  );
  const paths = useMemo(
    () => (topology ? TopologyGenerator.getAttackPaths(topology) : []),
    [topology]
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [selectedConduit, setSelectedConduit] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [attacks, setAttacks] = useState(true);
  const [risks, setRisks] = useState(true);
  const [radar, setRadar] = useState(true);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    if (!menu) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menu]);
  const svgRef = useRef<SVGSVGElement>(null);
  const selected =
    topology?.nodes.find((node) => node.id === selectedId) ??
    topology?.nodes.find((node) => node.type === "device") ??
    topology?.nodes[0];
  const selectedZone =
    topology?.zones.findIndex((zone) => zone.nodes.includes(selected?.id ?? "")) ?? -1;
  const activePath = paths.find((path) => path.at(-1) === selected?.id) ?? paths[0];
  const config = project?.config ?? demoProject.config;
  const kinds: Record<string, string> = Object.fromEntries(
    (config.devices ?? []).map((device: { deviceType?: string }, i: number) => [
      `device-${i}`,
      device.deviceType ?? "PLC",
    ])
  );
  const select = (id: string) => {
    setSelectedId(id);
    setInspectorOpen(true);
    setSelectedConduit(null);
  };
  const exportSVG = () => {
    if (!svgRef.current) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svgRef.current)], {
      type: "image/svg+xml",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `network-topology-${Date.now()}.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const nav = [
    { href: "/", label: copy.overview, icon: Boxes },
    { href: "/network-topology", label: copy.topology, icon: Radar },
    { href: "/assessment", label: copy.assessment, icon: ShieldAlert },
    { href: "/simulation", label: copy.simulation, icon: Workflow },
    { href: "/compliance-roadmap", label: copy.compliance, icon: Shield },
    { href: "/analytics", label: copy.reports, icon: FileText },
    { href: "/projects", label: copy.projects, icon: Layers },
  ];
  const matchingNodes =
    topology?.nodes.filter((node) =>
      `${node.label} ${node.manufacturer ?? ""} ${node.protocol ?? ""}`
        .toLowerCase()
        .includes(query.toLowerCase())
    ) ?? [];
  return (
    <div className="nt-workspace" dir={isRTL ? "rtl" : "ltr"}>
      <header className="nt-header">
        <Link href="/" className="nt-brand">
          <Radar size={34} />
          <span>
            ICS-Risk Framework<small>CYBER RESILIENCE FOR CRITICAL OPERATIONS</small>
          </span>
        </Link>
        <span className="nt-header-tab">
          <Radar size={14} />
          {copy.topology}
        </span>
        <label className="nt-search">
          <Search size={16} />
          <input
            aria-label={copy.search}
            placeholder={copy.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="nt-language">
          <Globe size={15} />
          <span className="sr-only">{copy.language}</span>
          <select
            aria-label={copy.language}
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
          >
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="tr">Türkçe</option>
            <option value="ar">العربية</option>
          </select>
        </label>
        <button
          className="nt-menu"
          aria-label={copy.openMenu}
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>
      {menu && (
        <button className="nt-scrim" aria-label={copy.openMenu} onClick={() => setMenu(false)} />
      )}
      <aside className={`nt-sidebar ${menu ? "is-open" : ""}`}>
        {menu && (
          <button
            className="nt-nav-close"
            aria-label={copy.openMenu}
            onClick={() => setMenu(false)}
          >
            <X size={20} />
          </button>
        )}
        <nav aria-label={copy.topology}>
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={href === "/network-topology" ? "page" : undefined}
              onClick={() => setMenu(false)}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="nt-source">
          <span>{copy.source}</span>
          <select
            aria-label={copy.source}
            value={project?.id ?? "demo"}
            onChange={(e) => {
              setProjectId(e.target.value);
              setSelectedId(null);
              setSelectedConduit(null);
            }}
          >
            {saved.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            <option value="demo">{copy.demo} / Assembly 01</option>
          </select>
          <small>{project ? copy.local : copy.demo}</small>
        </div>
        <div className="nt-sidebar-art" aria-hidden="true">
          {[72, 110, 56, 130, 88, 60].map((height, i) => (
            <i key={i} style={{ height }} />
          ))}
          <span>
            OT / SECURITY
            <br />
            INDUSTRIAL COMMAND CENTER
          </span>
        </div>
      </aside>
      <main className="nt-main">
        {saved.error && (
          <p role="alert" className="nt-notice">
            {copy.loadError}
          </p>
        )}
        {!topology ? (
          <p role="status">{copy.loading}</p>
        ) : (
          <>
            <div className={`nt-primary ${inspectorOpen ? "" : "inspector-closed"}`}>
              <section className="nt-radar-panel" aria-labelledby="nt-title">
                <div className="nt-map-heading">
                  <div>
                    <h1 id="nt-title">{copy.title}</h1>
                    <p>{copy.subtitle}</p>
                  </div>
                  <span className="nt-source-badge">{project ? copy.local : copy.demo}</span>
                </div>
                <div className="nt-legend">
                  <span>
                    <i style={{ background: "#30d9ba" }} />
                    {copy.normal}
                  </span>
                  <span>
                    <i style={{ background: "#ffb940" }} />
                    {copy.attention}
                  </span>
                  <span>
                    <i style={{ background: "#ff4855" }} />
                    {copy.highRisk}
                  </span>
                  <span>
                    <i className="is-conduit" />
                    {copy.linkCount}
                  </span>
                </div>
                <div className="nt-map-stage">
                  <TopologyMap
                    key={project?.id ?? "demo"}
                    topology={topology}
                    nodeKinds={kinds}
                    zoneNames={copy.zones}
                    selectedId={selected?.id}
                    onSelect={(node) => select(node.id)}
                    query={query}
                    risks={risks}
                    radar={radar}
                    showAttacks={attacks}
                    attackPaths={activePath ? [activePath] : []}
                    svgRef={svgRef}
                    sourceLabel={`${project ? copy.local : copy.demo} · ${copy.inferred}`}
                    labels={copy}
                  />
                </div>
                <div className="nt-map-toolbar">
                  <div role="group" aria-label={copy.layers}>
                    <button aria-pressed={attacks} onClick={() => setAttacks(!attacks)}>
                      <ShieldAlert size={13} />
                      {copy.attacks}
                    </button>
                    <button aria-pressed={risks} onClick={() => setRisks(!risks)}>
                      <Layers size={13} />
                      {copy.risk}
                    </button>
                    <button aria-pressed={radar} onClick={() => setRadar(!radar)}>
                      <Radar size={13} />
                      {copy.radar}
                    </button>
                  </div>
                  <button onClick={exportSVG}>
                    <Download size={13} />
                    {copy.export}
                  </button>
                </div>
                <div className="nt-summary">
                  <span>
                    <strong>{topology.nodes.length}</strong>
                    {copy.nodeCount}
                  </span>
                  <span>
                    <strong>{topology.links.length}</strong>
                    {copy.linkCount}
                  </span>
                  <span>
                    <strong>{paths.length}</strong>
                    {copy.pathCount}
                  </span>
                  <small>{copy.drag}</small>
                </div>
              </section>
              {inspectorOpen && selected && (
                <aside className="nt-inspector nt-panel" aria-label={copy.details}>
                  <div className="nt-panel-heading">
                    <h2>{copy.details}</h2>
                    <button aria-label={copy.close} onClick={() => setInspectorOpen(false)}>
                      <X size={17} />
                    </button>
                  </div>
                  <div
                    className="nt-asset-identity"
                    style={{ borderColor: riskColor(selected.risk) }}
                  >
                    <span className="nt-asset-icon" aria-hidden="true">
                      <svg width="88" height="90" viewBox="-60 -100 120 125">
                        <defs>
                          <linearGradient id="nt-inspector-steel">
                            <stop stopColor="#14232f" />
                            <stop offset=".45" stopColor="#526978" />
                            <stop offset="1" stopColor="#172834" />
                          </linearGradient>
                        </defs>
                        <IndustrialGlyph
                          kind={kinds[selected.id] ?? "Gateway"}
                          prefix="nt-inspector"
                        />
                      </svg>
                    </span>
                    <h3>{selected.label}</h3>
                    <span style={{ color: riskColor(selected.risk) }}>
                      {copy.risk} {selected.risk.toFixed(1)} / 10
                    </span>
                    <p>{selected.manufacturer ?? copy.inferred}</p>
                  </div>
                  <dl className="nt-properties">
                    {[
                      [
                        copy.type,
                        kinds[selected.id] ??
                          copy[selected.type === "zone" ? "zoneType" : selected.type],
                      ],
                      [copy.vendor, selected.manufacturer ?? copy.unknown],
                      [copy.protocol, selected.protocol ?? copy.unknown],
                      [copy.zone, copy.zones[selectedZone] ?? copy.unknown],
                      [copy.configRisk, `${selected.risk.toFixed(1)} / 10`],
                      [copy.source, project?.name ?? copy.demo],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <h3 className="nt-subheading">
                    <Activity size={13} />
                    {copy.connections}
                  </h3>
                  <div className="nt-connection-list">
                    {topology.links
                      .map((link, i) => ({ link, i }))
                      .filter(
                        ({ link }) => link.source === selected.id || link.target === selected.id
                      )
                      .map(({ link, i }) => {
                        const peer = topology.nodes.find(
                          (node) =>
                            node.id === (link.source === selected.id ? link.target : link.source)
                        );
                        return (
                          <button
                            key={i}
                            aria-pressed={selectedConduit === i}
                            onClick={() => setSelectedConduit(i)}
                          >
                            <span>
                              {peer?.label}
                              <small>{link.protocol ?? copy.gateway}</small>
                            </span>
                            <i style={{ color: link.encrypted ? "#30d9ba" : "#ffb940" }}>
                              {link.encrypted ? copy.encrypted : copy.unencrypted}
                            </i>
                          </button>
                        );
                      })}
                  </div>
                  {selectedConduit !== null && topology.links[selectedConduit] && (
                    <p role="status" className="nt-conduit-detail">
                      {topology.links[selectedConduit].bidirectional
                        ? copy.bidirectional
                        : copy.directional}{" "}
                      ·{" "}
                      {topology.links[selectedConduit].encrypted
                        ? copy.encrypted
                        : copy.unencrypted}
                    </p>
                  )}
                  <p className="nt-inspector-note">{copy.notice}</p>
                </aside>
              )}
            </div>
            <div className="nt-analytics">
              <section className="nt-panel" aria-labelledby="nt-path-title">
                <div className="nt-panel-heading">
                  <h2 id="nt-path-title">{copy.pathTitle}</h2>
                  <ShieldAlert size={15} />
                </div>
                {activePath ? (
                  <ol className="nt-path-list">
                    {activePath.map((id, i) => {
                      const node = topology.nodes.find((n) => n.id === id)!;
                      return (
                        <li key={id}>
                          <span>0{i + 1}</span>
                          <button onClick={() => select(id)}>
                            {node.label}
                            <small>
                              {node.protocol ?? copy[node.type === "zone" ? "zoneType" : node.type]}
                            </small>
                          </button>
                          <i style={{ color: riskColor(node.risk) }}>{node.risk.toFixed(1)}</i>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <p className="nt-empty">{copy.noPaths}</p>
                )}
              </section>
              <section className="nt-panel" aria-labelledby="nt-exposure-title">
                <div className="nt-panel-heading">
                  <h2 id="nt-exposure-title">{copy.alertTitle}</h2>
                  <span>{matchingNodes.length}</span>
                </div>
                <div className="nt-exposure-list">
                  {[...matchingNodes]
                    .sort((a, b) => b.risk - a.risk)
                    .map((node) => (
                      <button key={node.id} onClick={() => select(node.id)}>
                        <ShieldAlert size={15} style={{ color: riskColor(node.risk) }} />
                        <span>
                          {node.label}
                          <small>
                            {node.protocol ?? copy[node.type === "zone" ? "zoneType" : node.type]}
                          </small>
                        </span>
                        <b style={{ color: riskColor(node.risk) }}>{node.risk.toFixed(1)}</b>
                        <ArrowUpRight size={12} />
                      </button>
                    ))}
                  {matchingNodes.length === 0 && <p className="nt-empty">{copy.noResults}</p>}
                </div>
              </section>
              <section className="nt-panel" aria-labelledby="nt-zone-title">
                <div className="nt-panel-heading">
                  <h2 id="nt-zone-title">{copy.heatmap}</h2>
                  <Layers size={15} />
                </div>
                <div className="nt-zone-list">
                  {topology.zones.map((zone, i) => {
                    const nodes = topology.nodes.filter(
                      (node) => zone.nodes.includes(node.id) && node.type === "device"
                    );
                    const risk = nodes.length ? Math.max(...nodes.map((node) => node.risk)) : null;
                    return (
                      <div key={zone.id}>
                        <span>
                          {copy.zones[i]}
                          <small>
                            {nodes.length} {copy.nodeCount}
                          </small>
                        </span>
                        {risk !== null ? (
                          <>
                            <div className="nt-risk-bar">
                              <i style={{ width: `${risk * 10}%`, background: riskColor(risk) }} />
                            </div>
                            <b style={{ color: riskColor(risk) }}>{risk.toFixed(1)}</b>
                          </>
                        ) : (
                          <small>{copy.noDevices}</small>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
              <section className="nt-panel" aria-labelledby="nt-conduit-title">
                <div className="nt-panel-heading">
                  <h2 id="nt-conduit-title">{copy.conduitTitle}</h2>
                  <Network size={15} />
                </div>
                <div className="nt-conduit-stats">
                  <span>
                    <strong>{topology.links.filter((link) => link.encrypted).length}</strong>
                    {copy.encrypted}
                  </span>
                  <span>
                    <strong>{topology.links.filter((link) => !link.encrypted).length}</strong>
                    {copy.unencrypted}
                  </span>
                </div>
                <div className="nt-protocols">
                  {[...new Set(topology.links.map((link) => link.protocol).filter(Boolean))].map(
                    (protocol) => (
                      <span key={protocol}>{protocol}</span>
                    )
                  )}
                </div>
                <p className="nt-inspector-note">{copy.inferred}</p>
              </section>
            </div>
            <p className="nt-notice">
              <span>{project ? copy.local : copy.demo}</span> · {copy.notice}
            </p>
          </>
        )}
      </main>
    </div>
  );
}
