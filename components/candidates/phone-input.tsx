"use client"

import * as React from "react"
import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { CircleAlert } from "lucide-react"
import { cn } from "cn"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COUNTRIES, countryByIso, groupDigits, normalizePhone, type Country } from "@/lib/phone"

export const PHONE_LABELS = {
  label: "Phone number",
  country: "Country",
  errors: {
    empty: "Enter your phone number.",
    "too-short": "That number is too short. Check you have all the digits.",
    "too-long": "That number is too long. Check for an extra digit.",
    "wrong-country": "That number starts with another country’s code. Choose that country first.",
  } as Record<string, string>,
  example: (ex: string) => `For example ${ex}`,
}

/**
 * Candidate: phone number with country. Value is E.164 (“+6281234567890”) or "" while invalid.
 * split   A · country select beside the number              (Artsy, Alan)
 * inline  B · one field, country code as a prefix button
 * stacked C · full-width country select above the number    (Kraken, Monese)
 * Accepts how people actually type: 0812-…, +62 812…, 0062…, spaces, dashes.
 * Validates on blur, then live while fixing. `name` submits the E.164 value.
 */
export function PhoneInput({
  variant,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  country: countryProp,
  defaultCountry = "ID",
  onCountryChange,
  countries = COUNTRIES,
  name,
  required,
  disabled,
  hint,
  error: errorProp,
  labels: labelsProp,
  className,
}: {
  variant: "split" | "inline" | "stacked"
  value?: string
  defaultValue?: string
  onValueChange?: (e164: string) => void
  country?: string
  defaultCountry?: string
  onCountryChange?: (iso: string) => void
  countries?: Country[]
  name?: string
  required?: boolean
  disabled?: boolean
  hint?: string
  error?: string
  labels?: Partial<typeof PHONE_LABELS>
  className?: string
}) {
  const labels = { ...PHONE_LABELS, ...labelsProp }
  const [iso, setIso] = useControllableState({ prop: countryProp, defaultProp: defaultCountry, onChange: onCountryChange })
  const [e164, setE164] = useControllableState({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange })
  const c = countryByIso(iso)
  const [text, setText] = React.useState(() => (defaultValue.startsWith(`+${c.dial}`) ? groupDigits(defaultValue.slice(c.dial.length + 1)) : ""))
  const [problem, setProblem] = React.useState("")
  const [blurred, setBlurred] = React.useState(false)
  const id = React.useId()
  const shownError = errorProp || problem
  const describedBy = [`${id}-hint`, shownError && `${id}-err`].filter(Boolean).join(" ")

  const evaluate = (raw: string, countryIso = iso, show = blurred) => {
    const r = normalizePhone(raw, countryIso)
    if ("e164" in r) {
      setE164(r.e164)
      setProblem("")
    } else {
      setE164("")
      if (show && !(r.error === "empty" && !required)) setProblem(labels.errors[r.error])
    }
  }

  const countrySelect = (trigger: "full" | "compact") => (
    <Select
      value={iso}
      disabled={disabled}
      onValueChange={(v) => {
        setIso(v)
        evaluate(text, v)
      }}
    >
      <SelectTrigger
        aria-label={labels.country}
        className={cn(trigger === "compact" ? "w-28 shrink-0" : "w-full", variant === "inline" && "h-auto min-h-0 border-0 bg-transparent px-2 shadow-none focus-visible:ring-0")}
      >
        <SelectValue>{trigger === "compact" ? `${c.iso} +${c.dial}` : `${c.name} (+${c.dial})`}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {countries.map((x) => (
          <SelectItem key={x.iso} value={x.iso}>
            <span className="w-8 font-mono text-xs text-muted-foreground">{x.iso}</span> {x.name} <span className="text-muted-foreground">+{x.dial}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  const numberInput = (extra?: string) => (
    <Input
      id={id}
      type="tel"
      inputMode="tel"
      autoComplete="tel-national"
      disabled={disabled}
      required={required}
      placeholder={c.example}
      value={text}
      aria-invalid={shownError ? true : undefined}
      aria-describedby={describedBy}
      onChange={(e) => {
        setText(e.target.value)
        evaluate(e.target.value)
      }}
      onBlur={() => {
        setBlurred(true)
        evaluate(text, iso, true)
        const r = normalizePhone(text, iso)
        if ("national" in r) setText(groupDigits(r.national)) // tidy the display once it’s valid
      }}
      className={extra}
    />
  )

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>{labels.label}</Label>
      <p id={`${id}-hint`} className="-mt-1 text-xs text-muted-foreground">{hint ?? labels.example(c.example)}</p>
      {shownError && (
        <p id={`${id}-err`} aria-live="polite" className="flex items-start gap-1.5 text-xs font-semibold text-status-error-text">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {shownError}
        </p>
      )}

      {variant === "split" && (
        <div className="flex gap-2">
          {countrySelect("compact")}
          {numberInput()}
        </div>
      )}

      {variant === "inline" && (
        <div
          className={cn(
            "flex h-12 items-center rounded-lg border bg-white transition-[border-color,box-shadow] duration-150 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary",
            shownError ? "border-status-error" : "border-input"
          )}
        >
          {countrySelect("compact")}
          <span aria-hidden="true" className="h-6 w-px bg-hairline" />
          {numberInput("h-full border-0 bg-transparent focus-visible:ring-0 aria-invalid:ring-0")}
        </div>
      )}

      {variant === "stacked" && (
        <div className="flex flex-col gap-2">
          {countrySelect("full")}
          {numberInput()}
        </div>
      )}

      {name && <input type="hidden" name={name} value={e164} />}
    </div>
  )
}
