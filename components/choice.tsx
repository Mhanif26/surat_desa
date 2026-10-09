"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { Check, Pencil } from "lucide-react"
import { cn } from "cn"
import { Input } from "@/components/ui/input"

// IT-2023 › Choices. A selected option always gets three signals:
// 2px navy border, soft navy fill and a check. Color changes in 150ms; nothing moves.
const selected =
  "transition-[background-color,border-color,box-shadow] duration-150 data-[state=checked]:border-primary data-[state=checked]:bg-primary-soft data-[state=checked]:ring-1 data-[state=checked]:ring-primary"

type Option = { value: string; title: string; description?: string }

/** Tiles: options that need a sentence each (plans, account types). Up to eight. */
export function OptionTiles({
  options,
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & { options: Option[] }) {
  return (
    <RadioGroupPrimitive.Root className={cn("grid gap-3 sm:grid-cols-2", className)} {...props}>
      {options.map((o) => (
        <RadioGroupPrimitive.Item
          key={o.value}
          value={o.value}
          className={cn(
            "group/tile relative flex flex-col gap-1 rounded-xl border border-input bg-white p-4 pr-12 text-left hover:border-primary",
            selected
          )}
        >
          <span className="text-lg font-semibold text-heading">{o.title}</span>
          {o.description && <span className="text-sm text-muted-foreground">{o.description}</span>}
          <span
            aria-hidden="true"
            className="absolute top-4 right-4 grid size-6 place-items-center rounded-full border border-input bg-white text-white transition-colors duration-150 group-data-[state=checked]/tile:border-primary group-data-[state=checked]/tile:bg-primary"
          >
            <Check className="size-4" strokeWidth={3} />
          </span>
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  )
}

const CUSTOM = "__custom__"

/** Chips: common answers that can also be typed freely (a reason, a category). */
export function Chips({
  options,
  value,
  onValueChange,
  customLabel = "Something else…",
  "aria-label": ariaLabel,
}: {
  options: string[]
  value: string
  onValueChange: (value: string) => void
  /** Pass null to hide the free-text chip. */
  customLabel?: string | null
  "aria-label": string
}) {
  const [custom, setCustom] = React.useState(false)
  const chip = cn(
    "group/chip inline-flex min-h-11 items-center gap-2 rounded-full border border-input bg-white px-4 text-base hover:border-primary",
    selected
  )

  return (
    <div className="flex flex-col gap-3">
      <RadioGroupPrimitive.Root
        aria-label={ariaLabel}
        className="flex flex-wrap gap-2"
        value={custom ? CUSTOM : value}
        onValueChange={(v) => {
          setCustom(v === CUSTOM)
          onValueChange(v === CUSTOM ? "" : v)
        }}
      >
        {options.map((o) => (
          <RadioGroupPrimitive.Item key={o} value={o} className={chip}>
            <Check className="hidden size-4 text-primary group-data-[state=checked]/chip:block" strokeWidth={3} aria-hidden="true" />
            {o}
          </RadioGroupPrimitive.Item>
        ))}
        {customLabel && (
          <RadioGroupPrimitive.Item value={CUSTOM} className={cn(chip, "border-dashed data-[state=checked]:border-solid")}>
            <Pencil className="size-4" aria-hidden="true" />
            {customLabel}
          </RadioGroupPrimitive.Item>
        )}
      </RadioGroupPrimitive.Root>
      {custom && (
        <Input autoFocus aria-label={customLabel ?? undefined} value={value} onChange={(e) => onValueChange(e.target.value)} />
      )}
    </div>
  )
}

/** Staff filter chip: 40px, shows a count, navy when active. No motion. */
export function FilterChip({
  active,
  count,
  children,
  ...props
}: React.ComponentProps<"button"> & { active?: boolean; count?: number }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold",
        active ? "border-primary bg-primary text-white" : "border-input bg-white text-heading hover:bg-canvas"
      )}
      {...props}
    >
      {children}
      {count !== undefined && <span className={cn("tabular-nums", !active && "text-muted-foreground")}>{count}</span>}
    </button>
  )
}
