"use client"

import * as React from "react"
import { ArrowDownRight, ArrowUpRight, Info, Minus } from "lucide-react"
import { cn } from "cn"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type Delta = {
  /** Change vs the comparison period, as a fraction (0.12 = +12%) or absolute when `absolute` */
  value: number
  /** Named period, e.g. “vs last week” */
  period: string
  /** Which direction is good news; colors follow it, not the sign */
  goodWhen: "up" | "down"
  absolute?: boolean
}

export const STAT_LABELS = {
  noChange: "No change",
  trend: (from: string, to: string, n: number) => `Trend over the last ${n} periods: from ${from} to ${to}.`,
  about: (label: string) => `About ${label}`,
}

/**
 * Candidate: a headline number (dashboard tile). Follows the stat-tile contract:
 * label · compact value · signed delta vs a named period · optional 12-point trend.
 * delta     A · value + delta chip                          (Obvious, Mintlify)
 * spark     B · value + sparkline, hover/focus to read points (Whop, Navattic)
 * explained C · value + comparison line + “what is this?”     (Xero)
 * The delta is never color-only: arrow + sign + words.
 */
export function StatCard({
  variant,
  label,
  value,
  format,
  delta,
  trend,
  trendLabels,
  definition,
  locale = "en",
  labels: labelsProp,
  className,
}: {
  variant: "delta" | "spark" | "explained"
  label: string
  value: number
  /** Intl options; defaults to compact (1,284 / 12.9K) */
  format?: Intl.NumberFormatOptions
  delta?: Delta
  /** Up to 12 points, oldest first; the last one is the current value */
  trend?: number[]
  /** Names for the trend points (e.g. week labels) used in the hover readout */
  trendLabels?: string[]
  /** One or two sentences: what the number means and how it’s calculated */
  definition?: React.ReactNode
  locale?: string
  labels?: Partial<typeof STAT_LABELS>
  className?: string
}) {
  const labels = { ...STAT_LABELS, ...labelsProp }
  const fmt = new Intl.NumberFormat(locale, format ?? { notation: "compact", maximumFractionDigits: 1 })
  const pct = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1, signDisplay: "exceptZero" })
  const abs = new Intl.NumberFormat(locale, { maximumFractionDigits: 1, signDisplay: "exceptZero" })

  const d = delta && (() => {
    const dir = delta.value > 0 ? "up" : delta.value < 0 ? "down" : "flat"
    const good = dir === "flat" ? null : dir === delta.goodWhen
    const Icon = dir === "up" ? ArrowUpRight : dir === "down" ? ArrowDownRight : Minus
    const text = dir === "flat" ? labels.noChange : delta.absolute ? abs.format(delta.value) : pct.format(delta.value)
    const tone = good === null ? "bg-surface-strong text-body" : good ? "bg-status-success-fill text-status-success-text" : "bg-status-error-fill text-status-error-text"
    return { Icon, text, tone, good, period: delta.period }
  })()

  return (
    <section className={cn("flex flex-col gap-2 rounded-xl border border-hairline bg-white p-5", className)} aria-label={label}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm text-muted-foreground">{label}</h3>
        {variant === "explained" && definition && (
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" aria-label={labels.about(label)} className="-mt-2 -mr-2 grid size-11 place-items-center rounded-lg text-muted-foreground hover:text-heading focus-visible:outline-2 focus-visible:outline-ring">
                <Info className="size-4" aria-hidden="true" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 text-sm">{definition}</PopoverContent>
          </Popover>
        )}
      </div>

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-4xl font-bold tabular-nums text-heading">{fmt.format(value)}</p>
        {d && variant !== "explained" && (
          <span className={cn("inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-xs font-semibold tabular-nums", d.tone)}>
            <d.Icon className="size-4" aria-hidden="true" /> {d.text}
            <span className="sr-only"> {d.period}</span>
          </span>
        )}
      </div>

      {d && variant === "delta" && <p className="text-xs text-muted-foreground">{d.period}</p>}
      {d && variant === "explained" && (
        <p className="flex items-center gap-1.5 text-sm">
          <d.Icon className={cn("size-4", d.good === null ? "text-muted-foreground" : d.good ? "text-status-success-text" : "text-status-error-text")} aria-hidden="true" />
          <span className="font-semibold text-heading tabular-nums">{d.text}</span>
          <span className="text-muted-foreground">{d.period}</span>
        </p>
      )}
      {variant === "spark" && trend && trend.length > 1 && <Sparkline points={trend} names={trendLabels} format={(n) => fmt.format(n)} summary={labels.trend(fmt.format(trend[0]), fmt.format(trend[trend.length - 1]), trend.length)} />}
    </section>
  )
}

/** Single-series sparkline: muted line, current point in navy, crosshair + readout on hover/focus. */
function Sparkline({ points, names, format, summary }: { points: number[]; names?: string[]; format: (n: number) => string; summary: string }) {
  const [hover, setHover] = React.useState<number>()
  const W = 100, H = 32, pad = 3
  const min = Math.min(...points), max = Math.max(...points)
  const x = (i: number) => (i / (points.length - 1)) * W
  const y = (v: number) => H - pad - ((v - min) / (max - min || 1)) * (H - pad * 2)
  const d = points.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(" ")
  const last = points.length - 1
  const active = hover ?? last

  const pick = (clientX: number, el: Element) => {
    const r = el.getBoundingClientRect()
    setHover(Math.max(0, Math.min(last, Math.round(((clientX - r.left) / r.width) * last))))
  }

  return (
    <div className="flex flex-col gap-1">
      <div
        className="relative h-12 touch-none"
        tabIndex={0}
        role="img"
        aria-label={summary}
        onPointerMove={(e) => pick(e.clientX, e.currentTarget)}
        onPointerLeave={() => setHover(undefined)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setHover(Math.max(0, active - 1))
          else if (e.key === "ArrowRight") setHover(Math.min(last, active + 1))
          else return
          e.preventDefault()
        }}
        onBlur={() => setHover(undefined)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
          {hover !== undefined && <line x1={x(hover)} x2={x(hover)} y1={0} y2={H} className="stroke-hairline" strokeWidth={1} vectorEffect="non-scaling-stroke" />}
          <path d={d} fill="none" className="stroke-input" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* Points drawn in HTML so they stay round when the SVG stretches */}
        <span
          aria-hidden="true"
          className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-white"
          style={{ left: `${(x(active) / W) * 100}%`, top: `${(y(points[active]) / H) * 100}%` }}
        />
      </div>
      <p className="flex justify-between text-xs text-muted-foreground tabular-nums" aria-hidden="true">
        <span>{names?.[active] ?? (hover === undefined ? "Now" : `Point ${active + 1}`)}</span>
        <span className="font-semibold text-heading">{format(points[active])}</span>
      </p>
    </div>
  )
}
