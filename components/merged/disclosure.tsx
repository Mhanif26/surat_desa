"use client"

// Merged tabs, accordion, collapsible, progress, one-time code and dialog:
// shadcn/Radix structure + IT-2023 tokens + iconiq-style motion (transform/opacity only).
import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Accordion as AccordionPrimitive, Collapsible as CollapsiblePrimitive, Dialog as DialogPrimitive, Tabs as TabsPrimitive } from "radix-ui"
import { ChevronDown, XIcon } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { FADE, INSTANT, SPRING, SPRING_ENTER } from "./motion"

/* ───────── Tabs: the underline slides, the panel fades up ───────── */

export function Tabs({
  tabs,
  defaultValue,
}: {
  tabs: { value: string; label: string; content: React.ReactNode }[]
  defaultValue?: string
}) {
  const [value, setValue] = React.useState(defaultValue ?? tabs[0]?.value)
  const id = React.useId()
  const reduce = useReducedMotion()

  return (
    <TabsPrimitive.Root value={value} onValueChange={setValue}>
      <TabsPrimitive.List className="flex h-12 gap-6 overflow-x-auto border-b border-hairline [scrollbar-width:none]">
        {tabs.map((t) => (
          <TabsPrimitive.Trigger
            key={t.value}
            value={t.value}
            className="relative px-0.5 text-base whitespace-nowrap text-muted-foreground transition-colors duration-150 hover:text-heading data-[state=active]:font-semibold data-[state=active]:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {t.label}
            {value === t.value && (
              <motion.span layoutId={`${id}-underline`} className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" transition={reduce ? INSTANT : SPRING} />
            )}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map((t) => (
        <TabsPrimitive.Content key={t.value} value={t.value} className="pt-4 outline-none">
          <motion.div initial={reduce ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={reduce ? INSTANT : FADE}>
            {t.content}
          </motion.div>
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
}

/* ───────── Accordion & collapsible: grid-rows expand + chevron + content lift ───────── */

// Height via grid-template-rows (IT-2023: never animate height directly). Content is force-mounted
// so the close can animate too; `inert` keeps it out of the tab order while closed.
function Expand({ open, children }: { open: boolean; children: React.ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <div
      inert={!open}
      className={cn("grid transition-[grid-template-rows] duration-250 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
    >
      <div className="overflow-hidden">
        <motion.div initial={false} animate={{ opacity: open ? 1 : 0, y: open ? 0 : -4 }} transition={reduce ? INSTANT : FADE}>
          {children}
        </motion.div>
      </div>
    </div>
  )
}

function Chevron({ open }: { open: boolean }) {
  const reduce = useReducedMotion()
  return (
    <motion.span animate={{ rotate: open ? 180 : 0 }} transition={reduce ? INSTANT : SPRING} className="text-muted-foreground">
      <ChevronDown className="size-5" aria-hidden="true" />
    </motion.span>
  )
}

export function Accordion({ items }: { items: { id: string; title: string; content: React.ReactNode }[] }) {
  const [open, setOpen] = React.useState("")
  return (
    <AccordionPrimitive.Root type="single" collapsible value={open} onValueChange={setOpen} className="divide-y divide-hairline">
      {items.map((it) => (
        <AccordionPrimitive.Item key={it.id} value={it.id}>
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-lg font-semibold text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              {it.title}
              <Chevron open={open === it.id} />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content forceMount>
            <Expand open={open === it.id}>
              <div className="pb-4 text-body">{it.content}</div>
            </Expand>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
}

export function Collapsible({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <CollapsiblePrimitive.Root open={open} onOpenChange={setOpen}>
      <CollapsiblePrimitive.Trigger asChild>
        <Button variant="ghost" className="-ml-3">
          {title} <Chevron open={open} />
        </Button>
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content forceMount>
        <Expand open={open}>
          <div className="pt-2 text-muted-foreground">{children}</div>
        </Expand>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  )
}

/* ───────── Progress: spring-eased fill, bar or ring ───────── */

export function Progress({ value, label, variant = "bar" }: { value: number; label: string; variant?: "bar" | "ring" }) {
  const reduce = useReducedMotion()
  const t = reduce ? INSTANT : SPRING_ENTER
  const a11y = { role: "progressbar", "aria-label": label, "aria-valuenow": Math.round(value), "aria-valuemin": 0, "aria-valuemax": 100 } as const

  if (variant === "ring") {
    return (
      <svg viewBox="0 0 36 36" className="size-12 -rotate-90" {...a11y}>
        <circle cx="18" cy="18" r="15" fill="none" strokeWidth="4" className="stroke-surface-strong" />
        <motion.circle cx="18" cy="18" r="15" fill="none" strokeWidth="4" strokeLinecap="round" className="stroke-primary" initial={false} animate={{ pathLength: value / 100 }} transition={t} />
      </svg>
    )
  }
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-strong" {...a11y}>
      <motion.div className="h-full origin-left rounded-full bg-primary" initial={false} animate={{ scaleX: value / 100 }} transition={t} />
    </div>
  )
}

/* ───────── One-time code: digits pop in, the empty active slot shows a caret ───────── */

export function OneTimeCode({ length = 6, label, onComplete }: { length?: number; label: string; onComplete?: (code: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-lg font-semibold text-heading">{label}</span>
      <OTPInput maxLength={length} onComplete={onComplete} aria-label={label} containerClassName="flex items-center gap-2">
        {Array.from({ length }, (_, i) => (
          <React.Fragment key={i}>
            {i === length / 2 && <span aria-hidden="true" className="h-0.5 w-3 rounded-full bg-input" />}
            <Slot index={i} />
          </React.Fragment>
        ))}
      </OTPInput>
    </div>
  )
}

function Slot({ index }: { index: number }) {
  const ctx = React.useContext(OTPInputContext)
  const { char, isActive, hasFakeCaret } = ctx.slots[index]
  const reduce = useReducedMotion()
  return (
    <div
      className={cn(
        "relative grid size-12 place-items-center rounded-lg border bg-white text-lg font-semibold text-heading tabular-nums transition-[border-color,box-shadow] duration-150",
        isActive ? "border-primary ring-1 ring-primary" : "border-input"
      )}
    >
      <AnimatePresence initial={false}>
        {char && (
          <motion.span key={char} initial={reduce ? false : { scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={reduce ? INSTANT : SPRING}>
            {char}
          </motion.span>
        )}
      </AnimatePresence>
      {hasFakeCaret && <span aria-hidden="true" className="absolute h-6 w-0.5 animate-pulse rounded-full bg-primary" />}
    </div>
  )
}

/* ───────── Dialog: spring in from center over the navy scrim, back out the same way ───────── */

export function Dialog({
  trigger,
  title,
  description,
  children,
  footer,
}: {
  trigger: React.ReactNode
  title: string
  description?: string
  children?: React.ReactNode
  footer?: (close: () => void) => React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const reduce = useReducedMotion()

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div className="fixed inset-0 z-50 bg-primary/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={FADE} />
            </DialogPrimitive.Overlay>
            <div className="fixed inset-0 z-50 grid place-items-center p-4">
              <DialogPrimitive.Content asChild forceMount>
                <motion.div
                  className="relative grid w-full max-w-lg gap-6 rounded-2xl bg-white p-6 shadow-float outline-none"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                  transition={reduce ? FADE : SPRING_ENTER}
                >
                  <div className="flex flex-col gap-2 pr-10">
                    <DialogPrimitive.Title className="text-2xl font-semibold text-heading">{title}</DialogPrimitive.Title>
                    {description && <DialogPrimitive.Description className="text-muted-foreground">{description}</DialogPrimitive.Description>}
                  </div>
                  {children}
                  {footer && <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{footer(() => setOpen(false))}</div>}
                  <DialogPrimitive.Close asChild>
                    <Button variant="ghost" size="icon" className="absolute top-3 right-3" aria-label="Close">
                      <XIcon aria-hidden="true" />
                    </Button>
                  </DialogPrimitive.Close>
                </motion.div>
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}
