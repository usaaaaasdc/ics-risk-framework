export interface RiskNode {
  id: string
  type: "PLC" | "HMI" | "RTU" | "DCS" | "SCADA" | "Sensor" | "Gateway" | "External"
  vendor: string
  model: string
  protocols: string[]
  riskScore: number
  cvss?: number
  position: { x: number; y: number }
  zone: string
  internetFacing: boolean
  compromised?: boolean
  propagationLevel?: number
}

export interface RiskEdge {
  id: string
  source: string
  target: string
  protocol: string
  encrypted: boolean
  bidirectional: boolean
  bandwidth?: string
}

export interface RiskGraph {
  nodes: RiskNode[]
  edges: RiskEdge[]
  zones: string[]
}

export class RiskPropagationEngine {
  static calculatePropagation(graph: RiskGraph, startNodeId: string): RiskGraph {
    const updatedGraph: RiskGraph = JSON.parse(JSON.stringify(graph))
    const queue: string[] = [startNodeId]
    const visited = new Set<string>()
    let propagationLevel = 0

    // Mark start node as compromised
    const startNode = updatedGraph.nodes.find((n) => n.id === startNodeId)
    if (startNode) {
      startNode.compromised = true
      startNode.propagationLevel = 0
    }

    while (queue.length > 0) {
      propagationLevel++
      const currentLevelSize = queue.length

      for (let i = 0; i < currentLevelSize; i++) {
        const currentId = queue.shift()!
        if (visited.has(currentId)) continue
        visited.add(currentId)

        const currentNode = updatedGraph.nodes.find((n) => n.id === currentId)
        if (!currentNode) continue

        // Find connected nodes
        const connectedEdges = updatedGraph.edges.filter((e) => e.source === currentId || e.target === currentId)

        for (const edge of connectedEdges) {
          const targetId = edge.source === currentId ? edge.target : edge.source
          const targetNode = updatedGraph.nodes.find((n) => n.id === targetId)

          if (!targetNode || visited.has(targetId)) continue

          // Calculate propagation probability
          const propagationChance = this.calculatePropagationChance(currentNode, targetNode, edge)

          // If propagation is likely (>50%), mark as compromised
          if (propagationChance > 0.5 && !targetNode.compromised) {
            targetNode.compromised = true
            targetNode.propagationLevel = propagationLevel
            targetNode.riskScore = Math.min(10, targetNode.riskScore + currentNode.riskScore * 0.3)
            queue.push(targetId)
          }
        }
      }

      // Stop after 5 propagation levels
      if (propagationLevel >= 5) break
    }

    return updatedGraph
  }

  private static calculatePropagationChance(source: RiskNode, target: RiskNode, edge: RiskEdge): number {
    let chance = 0.3 // Base chance

    // Higher risk source = higher propagation
    chance += source.riskScore / 20

    // Same zone = easier propagation
    if (source.zone === target.zone) {
      chance += 0.2
    }

    // Unencrypted connection = easier propagation
    if (!edge.encrypted) {
      chance += 0.3
    }

    // Legacy protocols = easier
    const legacyProtocols = ["Modbus", "DNP3", "IEC 60870-5-101"]
    if (legacyProtocols.includes(edge.protocol)) {
      chance += 0.2
    }

    return Math.min(1, chance)
  }

  static findAttackPaths(graph: RiskGraph): string[][] {
    const paths: string[][] = []
    const externalNodes = graph.nodes.filter((n) => n.type === "External" || n.internetFacing)
    const criticalNodes = graph.nodes.filter((n) => ["PLC", "DCS", "SCADA"].includes(n.type) && n.riskScore >= 7)

    for (const external of externalNodes) {
      for (const critical of criticalNodes) {
        const path = this.findShortestPath(graph, external.id, critical.id)
        if (path.length > 0) {
          paths.push(path)
        }
      }
    }

    return paths
  }

  private static findShortestPath(graph: RiskGraph, startId: string, endId: string): string[] {
    const queue: string[][] = [[startId]]
    const visited = new Set<string>([startId])

    while (queue.length > 0) {
      const path = queue.shift()!
      const currentId = path[path.length - 1]

      if (currentId === endId) {
        return path
      }

      const connectedEdges = graph.edges.filter((e) => e.source === currentId || e.target === currentId)

      for (const edge of connectedEdges) {
        const nextId = edge.source === currentId ? edge.target : edge.source

        if (!visited.has(nextId)) {
          visited.add(nextId)
          queue.push([...path, nextId])
        }
      }
    }

    return []
  }

  static calculateNetworkResilience(graph: RiskGraph): number {
    let score = 100

    // Penalize internet-facing critical assets
    const internetFacingCritical = graph.nodes.filter((n) => n.internetFacing && n.riskScore >= 7).length
    score -= internetFacingCritical * 15

    // Penalize unencrypted connections
    const unencryptedLinks = graph.edges.filter((e) => !e.encrypted).length
    score -= (unencryptedLinks / graph.edges.length) * 20

    // Penalize high-risk nodes
    const avgRisk = graph.nodes.reduce((sum, n) => sum + n.riskScore, 0) / graph.nodes.length
    score -= avgRisk * 5

    // Reward zone segmentation
    const uniqueZones = new Set(graph.nodes.map((n) => n.zone)).size
    score += Math.min(20, uniqueZones * 5)

    return Math.max(0, Math.min(100, score))
  }
}
