export interface Project {
  id: string
  name: string
  description: string
  industry: string
  createdAt: string
  updatedAt: string
  config: any
  assessment: any
}

export class ProjectManager {
  private static STORAGE_KEY = "ics-security-projects"

  static getAllProjects(): Project[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(this.STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  static getProject(id: string): Project | null {
    const projects = this.getAllProjects()
    return projects.find((p) => p.id === id) || null
  }

  static saveProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
    const projects = this.getAllProjects()
    const now = new Date().toISOString()

    const newProject: Project = {
      ...project,
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    }

    projects.push(newProject)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects))
    return newProject
  }

  static updateProject(id: string, updates: Partial<Omit<Project, "id" | "createdAt">>): Project | null {
    const projects = this.getAllProjects()
    const index = projects.findIndex((p) => p.id === id)

    if (index === -1) return null

    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects))
    return projects[index]
  }

  static deleteProject(id: string): boolean {
    const projects = this.getAllProjects()
    const filtered = projects.filter((p) => p.id !== id)

    if (filtered.length === projects.length) return false

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
    return true
  }

  static exportProject(project: Project): void {
    const dataStr = JSON.stringify(project, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${project.name.replace(/\s+/g, "-")}-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  static importProject(file: File): Promise<Project> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          const project = this.saveProject({
            name: data.name + " (Imported)",
            description: data.description,
            industry: data.industry,
            config: data.config,
            assessment: data.assessment,
          })
          resolve(project)
        } catch (error) {
          reject(new Error("Invalid project file"))
        }
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }
}

export function loadProjects(): Project[] {
  return ProjectManager.getAllProjects()
}

export function getProject(id: string): Project | null {
  return ProjectManager.getProject(id)
}

export function saveProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
  return ProjectManager.saveProject(project)
}

export function updateProject(id: string, updates: Partial<Omit<Project, "id" | "createdAt">>): Project | null {
  return ProjectManager.updateProject(id, updates)
}

export function deleteProject(id: string): boolean {
  return ProjectManager.deleteProject(id)
}
