"use client"

import * as React from "react"
import { Check, CircleX } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"

export const TRACKER_LABELS = {
  progress: "Progress",
  latest: "Latest update",
  done: "Done",
  current: "In progress",
  rejected: "Rejected",
}

export type TrackStep = {
  title: string
  /** What it means for the resident, in plain words */
  detail: string
  time?: string
  /** One thing they can do at this step, if any */
  action?: { label: string; onClick: () => void }
}

/**
 * Candidate: application status for a village letter service.
 * timeline A · vertical steps with times on the left        (Bolt Food)
 * expanded B · the current step opens with what to do next  (IKEA, Vestiaire Collective)
 * stepper  C · short progress bar on top, latest update below (Shopee)
 */
export function StatusTracker({
  variant,
  steps,
  current,
  rejected,
  labels: labelsProp,
  className,
}: {
  variant: "timeline" | "expanded" | "stepper"
  labels?: Partial<typeof TRACKER_LABELS>
  className?: string
  steps: TrackStep[]
  /** index of the step in progress */
  current: number
  /** if set, the current step failed with this reason */
  rejected?: string
}) {
  const labels = { ...TRACKER_LABELS, ...labelsProp }
  const state = (i: number) => (i < current ? "done" : i === current ? (rejected ? "rejected" : "current") : "upcoming")

  if (variant === "stepper") {
    const now = steps[current]
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <ol className="flex items-start" aria-label={labels.progress}>
          {steps.map((s, i) => {
            const st = state(i)
            return (
              <li key={s.title} className="relative flex flex-1 flex-col items-center gap-2 text-center" aria-current={st === "current" ? "step" : undefined}>
                {i > 0 && <span aria-hidden="true" className={cn("absolute top-3 right-1/2 h-0.5 w-full", i <= current ? "bg-primary" : "bg-hairline")} />}
                <Dot st={st} labels={labels} />
                <span className={cn("px-1 text-xs leading-tight", st === "upcoming" ? "text-muted-foreground" : "font-semibold text-heading")}>{s.title}</span>
              </li>
            )
          })}
        </ol>
        <div className={cn("rounded-xl p-4", rejected ? "bg-status-error-fill" : "bg-canvas")}>
          <p className="text-xs text-muted-foreground">{labels.latest}{now.time ? ` · ${now.time}` : ""}</p>
          <p className={cn("mt-1 font-semibold", rejected ? "text-status-error-text" : "text-heading")}>{rejected ?? now.detail}</p>
          {now.action && <Button size="sm" className="mt-3" onClick={now.action.onClick}>{now.action.label}</Button>}
        </div>
      </div>
    )
  }

  return (
    <ol className={cn("flex flex-col", className)} aria-label={labels.progress}>
      {steps.map((s, i) => {
        const st = state(i)
        const last = i === steps.length - 1
        const open = variant === "expanded" && (st === "current" || st === "rejected")
        return (
          <li key={s.title} className="relative flex gap-3" aria-current={st === "current" ? "step" : undefined}>
            {variant === "timeline" && <span className="w-14 shrink-0 pt-0.5 text-right text-xs text-muted-foreground tabular-nums">{s.time ?? ""}</span>}
            <div className="flex flex-col items-center">
              <Dot st={st} labels={labels} />
              {!last && <span aria-hidden="true" className={cn("w-0.5 flex-1", i < current ? "bg-primary" : "bg-hairline")} />}
            </div>
            <div className={cn("min-w-0 flex-1", last ? "pb-0" : "pb-6")}>
              {open ? (
                <div className={cn("-mt-1 rounded-xl border p-4 shadow-float", st === "rejected" ? "border-status-error bg-status-error-fill" : "border-hairline bg-white")}>
                  <p className={cn("font-semibold", st === "rejected" ? "text-status-error-text" : "text-heading")}>{s.title}</p>
                  <p className="mt-1 text-sm">{st === "rejected" ? rejected : s.detail}</p>
                  {s.action && <Button size="sm" className="mt-3" variant={st === "rejected" ? "default" : "outline"} onClick={s.action.onClick}>{s.action.label}</Button>}
                </div>
              ) : (
                <>
                  <p className={cn(st === "upcoming" ? "text-muted-foreground" : "font-semibold text-heading")}>{s.title}</p>
                  {variant === "timeline" && st !== "upcoming" && <p className="text-sm text-muted-foreground">{st === "rejected" ? rejected : s.detail}</p>}
                  {variant === "expanded" && s.time && st === "done" && <p className="text-xs text-muted-foreground">{s.time}</p>}
                </>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function Dot({ st, labels }: { st: "done" | "current" | "upcoming" | "rejected"; labels: typeof TRACKER_LABELS }) {
  return (
    <span
      className={cn(
        "relative z-10 grid size-6 shrink-0 place-items-center rounded-full",
        st === "done" && "bg-primary text-white",
        st === "current" && "border-2 border-primary bg-white",
        st === "upcoming" && "border-2 border-hairline bg-white",
        st === "rejected" && "bg-status-error-text text-white"
      )}
    >
      {st === "done" && <Check className="size-3.5" strokeWidth={3} aria-label={labels.done} />}
      {st === "current" && <span className="size-2.5 rounded-full bg-primary" aria-label={labels.current} />}
      {st === "rejected" && <CircleX className="size-4" aria-label={labels.rejected} />}
    </span>
  )
}

