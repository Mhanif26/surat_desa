"use client"

import * as React from "react"
import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { Angry, Frown, Laugh, Meh, Smile, Star } from "lucide-react"
import { cn } from "cn"

export const RATING_LABELS = {
  words: ["Very bad", "Bad", "Okay", "Good", "Very good"] as string[],
  prompt: "Tap a star to rate",
}
const FACES = [Angry, Frown, Meh, Smile, Laugh]

/**
 * Candidate: service rating (1–5). A radio group underneath, so arrow keys move between
 * values and native forms receive `name=value`.
 * stars   A · five stars + the chosen word   (Instacart, Lyft, Zomato)
 * numbers B · 1–5 segmented, end labels      (Craft)
 * faces   C · five faces with words          (government satisfaction surveys)
 * bar     D · segments fill up to the choice (Urban Company)
 */
export function Rating({
  variant,
  label,
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  name,
  required,
  disabled,
  readOnly,
  labels: labelsProp,
  className,
}: {
  variant: "stars" | "numbers" | "faces" | "bar"
  label: string
  /** 0 = not rated yet */
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  name?: string
  required?: boolean
  disabled?: boolean
  /** Show a score without letting people change it (e.g. in a list of reviews). */
  readOnly?: boolean
  labels?: Partial<typeof RATING_LABELS>
  className?: string
}) {
  const labels = { ...RATING_LABELS, ...labelsProp }
  const [value, setValue] = useControllableState({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange })
  const [hover, setHover] = React.useState(0)
  const shown = (!readOnly && hover) || value
  const id = React.useId()
  const press = "transition-[scale,background-color,border-color,color] duration-160 ease-out active:scale-90 active:duration-100 disabled:active:scale-100"

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <span id={`${id}-label`} className="text-lg font-semibold text-heading">{label}</span>
      <RadioGroupPrimitive.Root
        aria-labelledby={`${id}-label`}
        orientation="horizontal"
        name={name}
        required={required}
        disabled={disabled || readOnly}
        value={value ? String(value) : ""}
        onValueChange={(v) => setValue(Number(v))}
        onPointerLeave={() => setHover(0)}
        className={cn("flex", variant === "bar" ? "gap-1.5" : "gap-2", readOnly && "pointer-events-none")}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const on = n <= shown
          const Face = FACES[n - 1]
          return (
            <RadioGroupPrimitive.Item
              key={n}
              value={String(n)}
              aria-label={`${n}, ${labels.words[n - 1]}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHover(n)}
              className={cn(
                press,
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                variant === "stars" && "grid size-12 place-items-center rounded-lg",
                variant === "numbers" && "grid h-12 flex-1 place-items-center rounded-lg bg-surface-strong text-lg font-semibold text-body data-[state=checked]:bg-primary data-[state=checked]:text-white",
                variant === "faces" &&
                  "flex flex-1 flex-col items-center gap-1 rounded-xl border border-hairline px-1 py-3 text-center text-xs text-muted-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary-soft data-[state=checked]:font-semibold data-[state=checked]:text-primary data-[state=checked]:ring-1 data-[state=checked]:ring-primary",
                variant === "bar" && cn("h-10 flex-1 rounded-md first:rounded-l-full last:rounded-r-full", on ? "bg-secondary" : "bg-surface-strong")
              )}
            >
              {variant === "stars" && (
                // Filled star breaks IT-2023's "icons never filled"; it's the universal rating signal.
                <Star className={cn("size-9 transition-colors duration-150", on ? "fill-status-warning text-status-warning" : "text-input")} strokeWidth={1.5} aria-hidden="true" />
              )}
              {variant === "numbers" && n}
              {variant === "faces" && (
                <>
                  <Face className="size-8" strokeWidth={1.75} aria-hidden="true" />
                  {labels.words[n - 1]}
                </>
              )}
            </RadioGroupPrimitive.Item>
          )
        })}
      </RadioGroupPrimitive.Root>
      {variant !== "faces" && (
        <p className={cn("flex text-sm", variant === "stars" ? "font-semibold text-heading" : "justify-between text-muted-foreground")} aria-live={variant === "stars" ? "polite" : undefined}>
          {variant === "stars" ? (
            shown ? labels.words[shown - 1] : labels.prompt
          ) : (
            <>
              <span>{labels.words[0]}</span>
              <span>{labels.words[4]}</span>
            </>
          )}
        </p>
      )}
    </div>
  )
}
