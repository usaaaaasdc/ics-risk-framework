/**
 * ICS-Risk Framework
 * Copyright (c) 2025 Osama Ali
 * Licensed under MIT License
 */

export interface NetworkNode {
  id: string
  label: string
  type: "device" | "zone" | "gateway" | "external"
  risk: number // 0-10
  manufacturer?: string
  protocol?: string
  x?: number
  y?: number
}

export interface NetworkLink {
  source: string
  target: string
  protocol?: string
  encrypted: boolean
  bidirectional: boolean
}

export interface NetworkTopology {
  nodes: NetworkNode[]
  links: NetworkLink[]
  zones: {
    id: string
    name: string
    level: number // 0=Enterprise, 1=DMZ, 2=Control, 3=Field
    nodes: string[]
  }[]
}

export class TopologyGenerator {
  static generateFromProject(projectData: any): NetworkTopology {
    const nodes: NetworkNode[] = []
    const links: NetworkLink[] = []
    const zones = [
      { id: "zone-enterprise", name: "Enterprise Network", level: 0, nodes: [] as string[] },
      { id: "zone-dmz", name: "DMZ", level: 1, nodes: [] as string[] },
      { id: "zone-control", name: "Control Network", level: 2, nodes: [] as string[] },
      { id: "zone-field", name: "Field Devices", level: 3, nodes: [] as string[] },
    ]

    // Add devices from project
    if (projectData?.config?.devices) {
      projectData.config.devices.forEach((device: any, index: number) => {
        const nodeId = `device-${index}`
        const riskScore = projectData.assessment?.riskScore || 5

        nodes.push({
          id: nodeId,
          label: device.name || `Device ${index + 1}`,
          type: "device",
          risk: riskScore,
          manufacturer: device.manufacturer,
          protocol: device.protocol,
        })

        // Assign to zone based on device type
        const zone = this.getZoneForDevice(device.deviceType)
        zones[zone].nodes.push(nodeId)
      })
    }

    // Add gateway nodes
    const gatewayId = "gateway-main"
    nodes.push({
      id: gatewayId,
      label: "Firewall/Gateway",
      type: "gateway",
      risk: 3,
    })
    zones[1].nodes.push(gatewayId)

    // Add external connection
    const externalId = "external-internet"
    nodes.push({
      id: externalId,
      label: "Internet",
      type: "external",
      risk: 10,
    })
    zones[0].nodes.push(externalId)

    // Create links
    // External to Gateway
    links.push({
      source: externalId,
      target: gatewayId,
      encrypted: true,
      bidirectional: true,
    })

    // Gateway to devices
    nodes.forEach((node) => {
      if (node.type === "device") {
        links.push({
          source: gatewayId,
          target: node.id,
          protocol: node.protocol,
          encrypted: false,
          bidirectional: true,
        })
      }
    })

    // Device to device connections (if in same zone)
    const deviceNodes = nodes.filter((n) => n.type === "device")
    for (let i = 0; i < deviceNodes.length - 1; i++) {
      for (let j = i + 1; j < deviceNodes.length; j++) {
        if (Math.random() > 0.7) {
          // 30% chance of device-to-device connection
          links.push({
            source: deviceNodes[i].id,
            target: deviceNodes[j].id,
            protocol: deviceNodes[i].protocol,
            encrypted: false,
            bidirectional: true,
          })
        }
      }
    }

    return { nodes, links, zones }
  }

  private static getZoneForDevice(deviceType: string): number {
    const type = deviceType?.toLowerCase() || ""
    if (type.includes("plc") || type.includes("controller")) return 2 // Control
    if (type.includes("hmi") || type.includes("scada")) return 1 // DMZ
    if (type.includes("sensor") || type.includes("actuator")) return 3 // Field
    return 2 // Default to Control
  }

  static calculateLayout(topology: NetworkTopology): NetworkTopology {
    const { nodes, zones } = topology
    const width = 800
    const height = 600
    const zoneHeight = height / zones.length

    nodes.forEach((node) => {
      // Find which zone this node belongs to
      const zoneIndex = zones.findIndex((z) => z.nodes.includes(node.id))
      if (zoneIndex === -1) return

      const zone = zones[zoneIndex]
      const nodesInZone = zone.nodes.length
      const nodeIndexInZone = zone.nodes.indexOf(node.id)

      // Calculate position
      const zoneY = zoneIndex * zoneHeight + zoneHeight / 2
      const nodeSpacing = width / (nodesInZone + 1)
      const nodeX = (nodeIndexInZone + 1) * nodeSpacing

      node.x = nodeX
      node.y = zoneY
    })

    return topology
  }

  static getAttackPaths(topology: NetworkTopology): string[][] {
    const paths: string[][] = []
    const externalNode = topology.nodes.find((n) => n.type === "external")
    if (!externalNode) return paths

    // Find all paths from external to high-risk devices
    const highRiskDevices = topology.nodes.filter((n) => n.type === "device" && n.risk >= 7)

    highRiskDevices.forEach((device) => {
      const path = this.findPath(topology, externalNode.id, device.id)
      if (path.length > 0) {
        paths.push(path)
      }
    })

    return paths
  }

  private static findPath(topology: NetworkTopology, startId: string, endId: string): string[] {
    const visited = new Set<string>()
    const queue: string[][] = [[startId]]

    while (queue.length > 0) {
      const path = queue.shift()!
      const node = path[path.length - 1]

      if (node === endId) return path
      if (visited.has(node)) continue
      visited.add(node)

      // Find connected nodes
      const connections = topology.links.filter((l) => l.source === node || l.target === node)

      connections.forEach((link) => {
        const nextNode = link.source === node ? link.target : link.source
        if (!visited.has(nextNode)) {
          queue.push([...path, nextNode])
        }
      })
    }

    return []
  }
}
