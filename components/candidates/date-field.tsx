"use client"

import * as React from "react"
import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { CircleAlert } from "lucide-react"
import { cn } from "cn"
import { dateProblem, partsToIso } from "@/lib/date-parts"
import { WheelPicker, WheelPickerColumn } from "@/components/iconiq/wheel-picker"

export const DATE_FIELD_LABELS = {
  day: "Day",
  month: "Month",
  year: "Year",
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
}

// ponytail: read once at load, not per render (Next prerender rule). Stale only across New Year in a long-lived tab.
const THIS_YEAR = new Date().getFullYear()

/** yyyy-mm-dd, or "" while incomplete / invalid */
export type DateValue = string

type Props = {
  variant: "segments" | "native" | "wheel"
  label: string
  hint?: string
  /** Controlled ISO value ("1965-08-17" or ""). */
  value?: DateValue
  defaultValue?: DateValue
  onValueChange?: (value: DateValue) => void
  /** Submitted with native forms as yyyy-mm-dd. */
  name?: string
  required?: boolean
  disabled?: boolean
  /** Server-side or submit-time error; shown above the field. */
  error?: string
  labels?: Partial<typeof DATE_FIELD_LABELS>
  className?: string
}

/**
 * Candidate: date of birth.
 * segments A · three boxes DD MM YYYY, numeric keypad (Depop, Revolut, GOV.UK)
 * native   B · the browser's own date input        (platform)
 * wheel    C · iOS-style wheel                     (Gymshark, Peanut)
 */
export function DateField({ variant, label, hint, value: valueProp, defaultValue = "", onValueChange, name, required, disabled, error, labels: labelsProp, className }: Props) {
  const labels = { ...DATE_FIELD_LABELS, ...labelsProp }
  const [value, setValue] = useControllableState({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange })
  const [typedProblem, setTypedProblem] = React.useState("")
  const id = React.useId()
  const problem = error || typedProblem
  const describedBy = [hint && `${id}-hint`, problem && `${id}-error`].filter(Boolean).join(" ") || undefined

  return (
    <div role={variant === "native" ? undefined : "group"} aria-labelledby={variant === "native" ? undefined : `${id}-label`} className={cn("flex flex-col gap-2", className)}>
      {variant === "native" ? (
        <label htmlFor={id} id={`${id}-label`} className="text-lg font-semibold text-heading">{label}</label>
      ) : (
        <span id={`${id}-label`} className="text-lg font-semibold text-heading">{label}</span>
      )}
      {hint && <p id={`${id}-hint`} className="-mt-1 text-xs text-muted-foreground">{hint}</p>}
      {problem && (
        <p id={`${id}-error`} aria-live="polite" className="flex items-start gap-1.5 text-xs font-semibold text-status-error-text">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {problem}
        </p>
      )}

      {variant === "native" && (
        <input
          id={id}
          type="date"
          name={name}
          required={required}
          disabled={disabled}
          min="1900-01-01"
          max={`${THIS_YEAR}-12-31`}
          value={value}
          aria-invalid={problem ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => setValue(e.target.value)}
          className="h-12 rounded-lg border border-input bg-white px-4 text-base text-body outline-none focus-visible:outline-none focus:border-primary focus:ring-1 focus:ring-primary aria-invalid:border-status-error disabled:bg-surface-strong"
        />
      )}

      {variant === "segments" && (
        <Segments value={value} onValueChange={setValue} onProblem={setTypedProblem} labels={labels} disabled={disabled} invalid={!!problem} describedBy={describedBy} />
      )}

      {variant === "wheel" && <Wheel value={value} onValueChange={setValue} labels={labels} disabled={disabled} />}

      {/* Native forms get one yyyy-mm-dd field whatever the variant */}
      {name && variant !== "native" && <input type="hidden" name={name} value={value} required={required} />}
    </div>
  )
}

function split(value: DateValue) {
  const [y = "", m = "", d = ""] = value ? value.split("-") : []
  return [d, m, y]
}

function Segments({
  value,
  onValueChange,
  onProblem,
  labels,
  disabled,
  invalid,
  describedBy,
}: {
  value: DateValue
  onValueChange: (v: DateValue) => void
  onProblem: (p: string) => void
  labels: typeof DATE_FIELD_LABELS
  disabled?: boolean
  invalid: boolean
  describedBy?: string
}) {
  const refs = [React.useRef<HTMLInputElement>(null), React.useRef<HTMLInputElement>(null), React.useRef<HTMLInputElement>(null)]
  // Typed text stays local until it forms a real date; `value` seeds it.
  const [parts, setParts] = React.useState(() => split(value))
  const fields = [
    { label: labels.day, placeholder: "DD", max: 2, width: "w-20", auto: "bday-day" },
    { label: labels.month, placeholder: "MM", max: 2, width: "w-20", auto: "bday-month" },
    { label: labels.year, placeholder: "YYYY", max: 4, width: "w-28", auto: "bday-year" },
  ]

  const commit = (next: string[]) => {
    setParts(next)
    onValueChange(partsToIso(Number(next[0]), Number(next[1]), Number(next[2])) || "")
  }

  return (
    <div className="flex gap-3">
      {fields.map((f, i) => (
        <label
          key={f.auto}
          className={cn(
            "flex h-16 cursor-text flex-col justify-center rounded-lg border bg-white px-3 transition-[border-color,box-shadow] duration-150 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary",
            invalid ? "border-status-error" : "border-input",
            disabled && "bg-surface-strong",
            f.width
          )}
        >
          <span className="text-xs text-muted-foreground">{f.label}</span>
          <input
            ref={refs[i]}
            inputMode="numeric"
            autoComplete={f.auto}
            placeholder={f.placeholder}
            maxLength={f.max}
            disabled={disabled}
            value={parts[i]}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "")
              commit(parts.with(i, v))
              if (v.length === f.max) refs[i + 1]?.current?.focus()
            }}
            // Validate when the person leaves the field, not while typing (IT-2023 › Validation)
            onBlur={() => onProblem(dateProblem(parts[0], parts[1], parts[2]))}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !parts[i]) refs[i - 1]?.current?.focus()
            }}
            className="w-full bg-transparent text-base font-semibold text-heading tabular-nums outline-none placeholder:font-normal placeholder:text-disabled focus-visible:outline-none"
          />
        </label>
      ))}
    </div>
  )
}

/**
 * The 3D barrel from iconiq’s WheelPicker (drag + flick inertia, detents, lens), one column each
 * for day, month and year. Commits when a column settles, so flicking through years doesn’t
 * fire a change per row.
 */
function Wheel({ value, onValueChange, labels, disabled }: { value: DateValue; onValueChange: (v: DateValue) => void; labels: typeof DATE_FIELD_LABELS; disabled?: boolean }) {
  const days = React.useMemo(() => Array.from({ length: 31 }, (_, i) => String(i + 1)), [])
  const months = React.useMemo(() => labels.months.map((label, i) => ({ value: String(i + 1), label })), [labels.months])
  const years = React.useMemo(() => Array.from({ length: 100 }, (_, i) => String(THIS_YEAR - i)), [])
  const [d, m, y] = split(value)
  // Uncommitted start: 1 January, 30 years ago (a likely adult birth year).
  const day = d ? String(Number(d)) : "1"
  const month = m ? String(Number(m)) : "1"
  const year = y || String(THIS_YEAR - 30)

  const commit = (next: { day?: string; month?: string; year?: string }) => {
    const dd = Number(next.day ?? day), mm = Number(next.month ?? month), yy = Number(next.year ?? year)
    // 31 February → the last real day of that month, rather than losing the choice
    for (let candidate = dd; candidate >= 28; candidate--) {
      const iso = partsToIso(candidate, mm, yy)
      if (iso) return onValueChange(iso)
    }
    onValueChange(partsToIso(dd, mm, yy))
  }

  return (
    <div className={cn("rounded-xl border border-hairline bg-white px-2 py-1", disabled && "pointer-events-none opacity-60")}>
      <WheelPicker aria-label={`${labels.day}, ${labels.month}, ${labels.year}`} visibleCount={5}>
        <WheelPickerColumn aria-label={labels.day} options={days} value={day} disabled={disabled} onValueCommit={(v) => commit({ day: v })} className="w-16" />
        <WheelPickerColumn aria-label={labels.month} options={months} value={month} disabled={disabled} onValueCommit={(v) => commit({ month: v })} className="flex-1" />
        <WheelPickerColumn aria-label={labels.year} options={years} value={year} disabled={disabled} onValueCommit={(v) => commit({ year: v })} className="w-20" />
      </WheelPicker>
    </div>
  )
}
