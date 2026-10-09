"use client"

import * as React from "react"

/**
 * Mounts children only once they're near the viewport.
 * Needed for an inline cmdk <Command>: on mount it selects the first item and calls
 * scrollIntoView, which drags the whole page down if the menu is below the fold.
 * `minHeight` reserves the space so nothing jumps when it mounts.
 */
export function WhenVisible({ children, minHeight }: { children: React.ReactNode; minHeight: number | string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true)
        io.disconnect()
      }
    }, { rootMargin: "-10% 0px" }) // fully on screen before mounting, so the scroll has nowhere to go
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ minHeight }}>
      {visible && children}
    </div>
  )
}
