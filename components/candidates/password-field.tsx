"use client"

import * as React from "react"
import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { Check, Circle, X } from "lucide-react"
import { cn } from "cn"
import { Label } from "@/components/ui/label"
import { checkPassword, DEFAULT_RULES, STRENGTH_LABELS, type PasswordRule } from "@/lib/password"
import { PasswordInput } from "./sign-in"

export const PASSWORD_FIELD_LABELS = {
  label: "Create a password",
  show: "Show password",
  hide: "Hide password",
  met: "done",
  notMet: "not yet",
  strength: "Strength",
  strengthNames: [...STRENGTH_LABELS] as string[],
  common: "That password is too common. Pick something only you would use.",
  rulesTitle: "Your password needs",
}

/**
 * Candidate: creating a password. Rules come from lib/password (swap them per product).
 * checklist A · every rule listed, ticks as it’s met       (Acorns, Binance)
 * meter     B · four-step strength bar + one hint          (foodpanda)
 * chips     C · compact chips that turn green              (Origin)
 * All: show/hide toggle, autocomplete="new-password", rules announced politely,
 * `onValidityChange` so the submit button knows when to enable.
 */
export function PasswordField({
  variant,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onValidityChange,
  rules = DEFAULT_RULES,
  name = "new-password",
  labels: labelsProp,
  className,
}: {
  variant: "checklist" | "meter" | "chips"
  value?: string
  defaultValue?: string
  onValueChange?: (v: string) => void
  onValidityChange?: (valid: boolean) => void
  rules?: PasswordRule[]
  name?: string
  labels?: Partial<typeof PASSWORD_FIELD_LABELS>
  className?: string
}) {
  const labels = { ...PASSWORD_FIELD_LABELS, ...labelsProp }
  const [value, setValue] = useControllableState({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange })
  const result = checkPassword(value, rules)
  const id = React.useId()
  const touched = value.length > 0

  const validity = React.useRef<boolean>(undefined)
  React.useEffect(() => {
    if (validity.current !== result.valid) onValidityChange?.(result.valid)
    validity.current = result.valid
  }, [result.valid, onValidityChange])

  const meterColor = ["bg-status-error-text", "bg-status-error-text", "bg-status-warning", "bg-secondary", "bg-secondary"][result.strength]
  const nextRule = rules.find((r) => !result.passed.includes(r.id))

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>{labels.label}</Label>
      <PasswordInput id={id} name={name} value={value} onChange={setValue} labels={labels} autoComplete="new-password" describedBy={`${id}-rules`} invalid={touched && result.common} />

      <div id={`${id}-rules`} aria-live="polite">
        {result.common && <p className="mb-2 text-xs font-semibold text-status-error-text">{labels.common}</p>}

        {variant === "checklist" && (
          <>
            <p className="sr-only">{labels.rulesTitle}</p>
            <ul className="flex flex-col gap-1">
              {rules.map((r) => {
                const ok = result.passed.includes(r.id)
                const Icon = ok ? Check : touched ? X : Circle
                return (
                  <li key={r.id} className={cn("flex items-center gap-2 text-sm", ok ? "text-status-success-text" : "text-muted-foreground")}>
                    <Icon className="size-4 shrink-0" strokeWidth={ok ? 3 : 2} aria-hidden="true" />
                    {r.label}
                    <span className="sr-only">: {ok ? labels.met : labels.notMet}</span>
                  </li>
                )
              })}
            </ul>
          </>
        )}

        {variant === "meter" && (
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1" aria-hidden="true">
              {[1, 2, 3, 4].map((i) => (
                <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-150", i <= result.strength ? meterColor : "bg-surface-strong")} />
              ))}
            </div>
            <p className="flex justify-between gap-3 text-sm">
              <span className="text-muted-foreground">{touched && nextRule ? nextRule.label : ""}</span>
              <span className="font-semibold text-heading">
                <span className="sr-only">{labels.strength}: </span>
                {touched ? labels.strengthNames[result.strength] : ""}
              </span>
            </p>
          </div>
        )}

        {variant === "chips" && (
          <ul className="flex flex-wrap gap-1.5">
            {rules.map((r) => {
              const ok = result.passed.includes(r.id)
              return (
                <li key={r.id} className={cn("inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-xs font-semibold transition-colors duration-150", ok ? "bg-status-success-fill text-status-success-text" : "bg-surface-strong text-muted-foreground")}>
                  {ok && <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />}
                  {r.label}
                  <span className="sr-only">: {ok ? labels.met : labels.notMet}</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
