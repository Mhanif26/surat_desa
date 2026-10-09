"use client"

import * as React from "react"

const noop = () => () => {}

/**
 * Renders children only in the browser. For components that read the clock or
 * locale while rendering (calendars, live clocks), which Next can't prerender.
 * `fallback` should match the final size so nothing jumps.
 */
export function ClientOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const client = React.useSyncExternalStore(noop, () => true, () => false)
  return client ? children : fallback
}
