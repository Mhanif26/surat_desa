import type * as React from "react"
import { CircleCheck, CircleDashed, CircleX, Info, TriangleAlert, type LucideIcon } from "lucide-react"
import { cn } from "cn"

// IT-2023 › Semantic tones. Map your domain states onto these five; don't add colors.
export const TONES = {
  neutral: { icon: CircleDashed, className: "bg-surface-strong text-body" },
  info: { icon: Info, className: "bg-status-info-fill text-status-info-text" },
  warning: { icon: TriangleAlert, className: "bg-status-warning-fill text-status-warning-text" },
  success: { icon: CircleCheck, className: "bg-status-success-fill text-status-success-text" },
  error: { icon: CircleX, className: "bg-status-error-fill text-status-error-text" },
} as const satisfies Record<string, { icon: LucideIcon; className: string }>

export type Tone = keyof typeof TONES

/**
 * Pill, 28px: tone icon + words. Pass `icon` to give a domain state its own icon
 * (e.g. Hourglass for "Waiting for approval"), then keep that icon everywhere.
 */
export function StatusTag({
  tone,
  icon,
  className,
  children,
}: {
  tone: Tone
  icon?: LucideIcon
  className?: string
  children: React.ReactNode
}) {
  const Icon = icon ?? TONES[tone].icon
  return (
    <span
      // re-mounts when the tone changes, so a status the person is watching cross-fades in 150ms
      key={tone}
      className={cn(
        "inline-flex h-7 w-fit shrink-0 animate-in items-center gap-1.5 rounded-full pr-3 pl-2 text-xs font-semibold whitespace-nowrap fade-in-0 duration-150",
        TONES[tone].className,
        className
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {children}
    </span>
  )
}

/** The "it's ready" moment. Pair with one green button. */
export function SuccessBand({
  title,
  description,
  action,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-secondary-soft p-6 text-secondary sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <CircleCheck className="mt-0.5 size-6 shrink-0" aria-hidden="true" />
        <div>
          <h3 className="text-lg font-semibold text-secondary">{title}</h3>
          {description && <p className="text-body">{description}</p>}
        </div>
      </div>
      {action}
    </section>
  )
}
