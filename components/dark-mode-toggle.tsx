"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSyncExternalStore } from "react"

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => observer.disconnect()
}

const getTheme = () => document.documentElement.classList.contains("dark")
const getServerTheme = () => false

export function DarkModeToggle() {
  const isDark = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme)

  const toggleDarkMode = () => {
    const html = document.documentElement
    const newMode = !isDark

    if (newMode) {
      html.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      html.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }

  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  )
}
