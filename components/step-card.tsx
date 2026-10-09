import type * as React from "react"
import { CircleCheck } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"

/**
 * IT-2023 › Application flow. done: one-line summary + "Edit"; open: floats;
 * upcoming: muted title. Opening expands in 250ms via grid rows (no height animation).
 */
export function StepCard({
  number,
  title,
  state,
  summary,
  onEdit,
  children,
}: {
  number: number
  title: string
  state: "done" | "open" | "upcoming"
  summary?: React.ReactNode
  onEdit?: () => void
  children?: React.ReactNode
}) {
  const open = state === "open"
  return (
    <section
      aria-current={open ? "step" : undefined}
      className={cn(
        "rounded-xl border bg-white px-6 transition-shadow duration-250 ease-out",
        open ? "border-transparent shadow-float" : "border-hairline"
      )}
    >
      <header className="flex min-h-18 items-center gap-4 py-4">
        {state === "done" ? (
          <CircleCheck className="size-6 shrink-0 text-status-success-text" aria-label="Done" />
        ) : (
          <span
            className={cn(
              "grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold",
              open ? "bg-primary text-white" : "bg-surface-strong text-muted-foreground"
            )}
          >
            {number}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className={cn("text-lg font-semibold", state === "upcoming" ? "text-muted-foreground" : "text-heading")}>
            {title}
          </h3>
          {state === "done" && summary && <p className="truncate text-sm text-muted-foreground">{summary}</p>}
        </div>
        {state === "done" && onEdit && (
          <Button variant="soft" size="sm" onClick={onEdit} aria-label={`Edit ${title}`}>
            Edit
          </Button>
        )}
      </header>
      <div
        inert={!open}
        className={cn("grid transition-[grid-template-rows] duration-250 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
      >
        <div className="overflow-hidden">
          <div className="pb-6">{children}</div>
        </div>
      </div>
    </section>
  )
}

/** Muted label left, 600 value right, hairline between rows. */
export function SummaryCard({
  title,
  rows,
  className,
}: {
  title: React.ReactNode
  rows: { label: React.ReactNode; value: React.ReactNode }[]
  className?: string
}) {
  return (
    <section className={cn("rounded-xl border border-hairline bg-white p-6", className)}>
      <h3 className="text-lg font-semibold text-heading">{title}</h3>
      <dl className="mt-2 divide-y divide-hairline">
        {rows.map((r, i) => (
          <div key={i} className="flex items-baseline justify-between gap-4 py-3">
            <dt className="text-muted-foreground">{r.label}</dt>
            <dd className="text-right font-semibold text-heading">{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
