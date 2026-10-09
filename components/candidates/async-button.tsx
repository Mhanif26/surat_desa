"use client"

import * as React from "react"
import { Check, CircleAlert, LoaderCircle, RotateCcw } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"

export type AsyncPhase = "idle" | "pending" | "done" | "error"

export const ASYNC_BUTTON_LABELS = {
  pending: "Sending…",
  done: "Sent",
  error: "Couldn’t send. Try again",
  slow: "This is taking longer than usual. Keep this page open.",
}

type Variant = "label" | "spinner" | "morph" | "progress"

/**
 * Candidate: async submit button. Give it `onAction` and it runs the whole cycle:
 * idle → pending → done (or error with retry) → idle. Pass `phase` to drive it yourself.
 *
 * label    A · spinner + “Sending…”                 (Partiful, Replit)
 * spinner  B · spinner only, label hidden            (Assembly, Base, Perplexity)
 * morph    C · turns green with “Sent”               (iconiq flux-button)
 * progress D · fills with real progress + percent   (Me+)
 *
 * Every variant keeps its width, sets aria-busy, ignores presses while pending,
 * announces the result, and shows a slow-network hint after `slowAfterMs`.
 */
export function AsyncButton({
  variant,
  onAction,
  phase: phaseProp,
  progress: progressProp,
  labels: labelsProp,
  doneHoldMs = 1600,
  slowAfterMs = 10_000,
  children,
  className,
  disabled,
  type = "button",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "variant" | "onClick"> & {
  variant: Variant
  /** Runs on press. Call `report(0–100)` for the progress variant. Throw/reject to show the error state. */
  onAction?: (report: (progress: number) => void) => Promise<unknown>
  /** Controlled phase; leave out to let `onAction` drive it. */
  phase?: AsyncPhase
  progress?: number
  labels?: Partial<typeof ASYNC_BUTTON_LABELS>
  doneHoldMs?: number
  slowAfterMs?: number
}) {
  const labels = { ...ASYNC_BUTTON_LABELS, ...labelsProp }
  const [innerPhase, setInnerPhase] = React.useState<AsyncPhase>("idle")
  const [innerProgress, setInnerProgress] = React.useState(0)
  const [slow, setSlow] = React.useState(false)
  const mounted = React.useRef(true)
  React.useEffect(() => {
    mounted.current = true
    return () => void (mounted.current = false)
  }, [])

  const phase = phaseProp ?? innerPhase
  const progress = progressProp ?? innerProgress
  const pending = phase === "pending"
  const showsDone = phase === "done" && (variant === "morph" || variant === "progress")

  React.useEffect(() => {
    if (!pending) return
    const t = setTimeout(() => setSlow(true), slowAfterMs)
    return () => {
      clearTimeout(t)
      setSlow(false)
    }
  }, [pending, slowAfterMs])

  async function run() {
    if (!onAction || pending) return
    setInnerPhase("pending")
    setInnerProgress(0)
    try {
      await onAction((p) => mounted.current && setInnerProgress(Math.max(0, Math.min(100, p))))
      if (!mounted.current) return
      setInnerPhase("done")
      setTimeout(() => mounted.current && setInnerPhase((p) => (p === "done" ? "idle" : p)), doneHoldMs)
    } catch {
      if (mounted.current) setInnerPhase("error")
    }
  }

  const layer = "col-start-1 row-start-1 inline-flex items-center justify-center gap-2 transition-opacity duration-150"
  const status = phase === "done" ? labels.done : phase === "error" ? labels.error : pending ? labels.pending : ""

  return (
    <div className={cn("inline-flex flex-col items-start gap-2", className)}>
      <Button
        type={type}
        variant={phase === "error" ? "outline" : "secondary"}
        disabled={disabled}
        aria-busy={pending || undefined}
        onClick={pending ? undefined : run}
        className={cn(
          "relative overflow-hidden",
          showsDone && "bg-status-success-text hover:bg-status-success-text",
          variant === "progress" && pending && "bg-[#183b1d]" // unfilled track: darker green, never navy beside green
        )}
        {...props}
      >
        {variant === "progress" && (
          <span aria-hidden="true" className="absolute inset-0 origin-left bg-secondary transition-transform duration-300 ease-out" style={{ transform: `scaleX(${pending ? progress / 100 : 1})` }} />
        )}
        <span className="relative grid">
          <span className={cn(layer, phase !== "idle" && "opacity-0")} aria-hidden={phase !== "idle"}>{children}</span>
          <span className={cn(layer, !pending && "opacity-0")} aria-hidden="true">
            {variant !== "progress" && <LoaderCircle className="animate-spin [animation-duration:800ms]" />}
            {(variant === "label" || variant === "progress") && labels.pending}
            {variant === "progress" && <span className="tabular-nums">{Math.round(progress)}%</span>}
          </span>
          <span className={cn(layer, !showsDone && "opacity-0")} aria-hidden="true">
            <Check className="size-5" strokeWidth={3} /> {labels.done}
          </span>
          <span className={cn(layer, phase !== "error" && "opacity-0")} aria-hidden="true">
            <RotateCcw /> {labels.error}
          </span>
        </span>
      </Button>
      {/* One polite region for every phase change, so screen readers hear the outcome */}
      <span role="status" className="sr-only">{status}</span>
      {slow && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CircleAlert className="size-4" aria-hidden="true" /> {labels.slow}
        </p>
      )}
    </div>
  )
}
