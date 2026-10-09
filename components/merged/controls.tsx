"use client"

// Merged form controls: shadcn/Radix structure + IT-2023 tokens + iconiq-style motion.
import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { Checkbox as CheckboxPrimitive, RadioGroup as RadioGroupPrimitive, Slider as SliderPrimitive, Switch as SwitchPrimitive, ToggleGroup as ToggleGroupPrimitive } from "radix-ui"
import { cn } from "cn"
import { INSTANT, SPRING } from "./motion"

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = React.useState(defaultValue)
  const current = value ?? inner
  const set = (v: T) => {
    if (value === undefined) setInner(v)
    onChange?.(v)
  }
  return [current, set] as const
}

/* ───────── Switch: thumb glides on a spring and stretches while pressed ───────── */

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  className,
  ...props
}: Omit<React.ComponentProps<typeof SwitchPrimitive.Root>, "asChild">) {
  const [on, setOn] = useControllable(checked, defaultChecked, onCheckedChange)
  const [pressed, setPressed] = React.useState(false)
  const reduce = useReducedMotion()

  return (
    <SwitchPrimitive.Root
      checked={on}
      onCheckedChange={setOn}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors duration-150 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb asChild>
        <motion.span
          className="block size-6 rounded-full bg-white shadow-sm"
          // pressed: the thumb stretches away from its edge, like iconiq's squash (transform only)
          style={{ originX: on ? 1 : 0 }}
          animate={{ x: on ? 20 : 0, scaleX: pressed ? 1.18 : 1 }}
          transition={reduce ? INSTANT : SPRING}
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

/* ───────── Checkbox: the check draws itself ───────── */

export function Checkbox({
  checked,
  defaultChecked = false,
  onCheckedChange,
  className,
  ...props
}: Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, "checked" | "defaultChecked" | "onCheckedChange"> & {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  const [on, setOn] = useControllable(checked, defaultChecked, onCheckedChange)
  const reduce = useReducedMotion()

  return (
    <CheckboxPrimitive.Root
      checked={on}
      onCheckedChange={(v) => setOn(v === true)}
      className={cn(
        "peer grid size-5 shrink-0 place-items-center rounded-sm border border-input bg-white text-white transition-[background-color,border-color,scale] duration-150 active:scale-90 data-[state=checked]:border-primary data-[state=checked]:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
      {...props}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <motion.path
          d="M20 6 9 17l-5-5"
          initial={false}
          animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
          transition={reduce ? INSTANT : { duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        />
      </svg>
    </CheckboxPrimitive.Root>
  )
}

/* ───────── Radio group: one highlight slides to the chosen row ───────── */

export function RadioGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  "aria-label": ariaLabel,
}: {
  options: { value: string; label: string; description?: string }[]
  value?: string
  defaultValue?: string
  onValueChange?: (v: string) => void
  "aria-label": string
}) {
  const [current, setCurrent] = useControllable(value, defaultValue ?? options[0]?.value ?? "", onValueChange)
  const id = React.useId()
  const reduce = useReducedMotion()

  return (
    <RadioGroupPrimitive.Root value={current} onValueChange={setCurrent} aria-label={ariaLabel} className="flex flex-col gap-1">
      {options.map((o) => {
        const selected = o.value === current
        return (
          <RadioGroupPrimitive.Item
            key={o.value}
            value={o.value}
            className="group relative flex min-h-11 items-start gap-3 rounded-xl px-3 py-3 text-left transition-[scale] duration-160 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {selected && (
              <motion.span
                layoutId={`${id}-highlight`}
                className="absolute inset-0 rounded-xl border-2 border-primary bg-primary-soft"
                transition={reduce ? INSTANT : SPRING}
              />
            )}
            <span className={cn("relative mt-1 grid size-5 shrink-0 place-items-center rounded-full border", selected ? "border-primary" : "border-input bg-white")}>
              <motion.span className="size-2.5 rounded-full bg-primary" initial={false} animate={{ scale: selected ? 1 : 0 }} transition={reduce ? INSTANT : SPRING} />
            </span>
            <span className="relative">
              <span className="block font-semibold text-heading">{o.label}</span>
              {o.description && <span className="block text-sm text-muted-foreground">{o.description}</span>}
            </span>
          </RadioGroupPrimitive.Item>
        )
      })}
    </RadioGroupPrimitive.Root>
  )
}

/* ───────── Segmented control: a soft pill slides under the pressed option ───────── */

export function Segmented({
  options,
  value,
  defaultValue,
  onValueChange,
  "aria-label": ariaLabel,
}: {
  options: { value: string; label: React.ReactNode }[]
  value?: string
  defaultValue?: string
  onValueChange?: (v: string) => void
  "aria-label": string
}) {
  const [current, setCurrent] = useControllable(value, defaultValue ?? options[0]?.value ?? "", onValueChange)
  const id = React.useId()
  const reduce = useReducedMotion()

  return (
    <ToggleGroupPrimitive.Root
      type="single"
      value={current}
      onValueChange={(v) => v && setCurrent(v)} // single-select never empties
      aria-label={ariaLabel}
      className="inline-flex rounded-xl border border-input bg-white p-1"
    >
      {options.map((o) => (
        <ToggleGroupPrimitive.Item
          key={o.value}
          value={o.value}
          className="relative inline-flex h-10 min-w-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-muted-foreground transition-colors duration-150 data-[state=on]:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {o.value === current && (
            <motion.span layoutId={`${id}-pill`} className="absolute inset-0 rounded-lg bg-primary-soft ring-1 ring-primary" transition={reduce ? INSTANT : SPRING} />
          )}
          <span className="relative inline-flex items-center gap-2">{o.label}</span>
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  )
}

/* ───────── Slider: the thumb lifts while dragged and shows the value ───────── */

export function Slider({
  label,
  value,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
}: {
  label: string
  value?: number
  defaultValue?: number
  onValueChange?: (v: number) => void
  min?: number
  max?: number
  step?: number
}) {
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange)
  const [dragging, setDragging] = React.useState(false)
  const reduce = useReducedMotion()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="text-lg font-semibold text-heading">{label}</span>
        <span className="text-lg font-semibold tabular-nums text-heading">{current}</span>
      </div>
      <SliderPrimitive.Root
        value={[current]}
        onValueChange={([v]) => setCurrent(v)}
        onPointerDown={() => setDragging(true)}
        onPointerUp={() => setDragging(false)}
        onLostPointerCapture={() => setDragging(false)}
        min={min}
        max={max}
        step={step}
        aria-label={label}
        className="relative flex h-6 w-full touch-none items-center select-none"
      >
        <SliderPrimitive.Track className="relative h-2 grow overflow-hidden rounded-full bg-surface-strong">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb aria-label={label} className="block focus-visible:outline-none focus-visible:[&>span]:ring-4 focus-visible:[&>span]:ring-primary/20">
          <motion.span
            className="relative block size-6 rounded-full border-2 border-primary bg-white shadow-float"
            animate={{ scale: dragging ? 1.15 : 1 }}
            transition={reduce ? INSTANT : SPRING}
          >
            <motion.span
              aria-hidden="true"
              className="absolute -top-9 left-1/2 rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-white tabular-nums"
              initial={false}
              animate={{ opacity: dragging ? 1 : 0, y: dragging ? 0 : 4, x: "-50%" }}
              transition={reduce ? INSTANT : SPRING}
            >
              {current}
            </motion.span>
          </motion.span>
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    </div>
  )
}
