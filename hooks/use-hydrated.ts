"use client"

import { useSyncExternalStore } from "react"

const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

// Keep the server and first client render identical before reading browser data.
export function useHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
