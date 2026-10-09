"use client"

import * as React from "react"
import { CircleAlert } from "lucide-react"
import { cn } from "cn"

/**
 * Candidate: text field label styles.
 * stacked   A · label above, hint, then field   (current IT-2023, Truecaller, GOV.UK)
 * notched   B · label cut into the border       (Freenow, Origin)
 * floating  C · label inside, floats up on focus (GoHenry, Jomo)
 * underline D · bottom line only                 (Quo)
 */
export function TextField({
  variant,
  label,
  hint,
  error,
  optional,
  optionalLabel = "(optional)",
  className,
  ...props
}: React.ComponentProps<"input"> & {
  /** Adds “(optional)” after the label. Don’t star required fields. */
  optional?: boolean
  optionalLabel?: string
  variant: "stacked" | "notched" | "floating" | "underline"
  label: string
  hint?: string
  error?: string
}) {
  const id = React.useId()
  const shownLabel = optional ? `${label} ${optionalLabel}` : label
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined
  const input = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    ...props,
  }
  const ring =
    "outline-none transition-[border-color,box-shadow] duration-150 focus-visible:outline-none focus:border-primary focus:ring-1 focus:ring-primary aria-invalid:border-status-error aria-invalid:ring-1 aria-invalid:ring-status-error"

  const hintEl = hint && (
    <p id={`${id}-hint`} className="text-xs text-muted-foreground">
      {hint}
    </p>
  )
  const errorEl = error && (
    <p id={`${id}-error`} aria-live="polite" className="flex items-start gap-1.5 text-xs font-semibold text-status-error-text">
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {error}
    </p>
  )

  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <label htmlFor={id} className="text-lg font-semibold text-heading">
          {shownLabel}
        </label>
        {hintEl}
        {errorEl}
        <input {...input} className={cn("h-12 rounded-lg border border-input bg-white px-4 text-base text-body", ring)} />
      </div>
    )
  }

  if (variant === "notched") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <div className="relative">
          <input {...input} className={cn("peer h-14 w-full rounded-lg border border-input bg-white px-4 text-base text-body", ring)} />
          <label
            htmlFor={id}
            className="absolute top-0 left-3 -translate-y-1/2 bg-white px-1 text-xs font-semibold text-muted-foreground transition-colors duration-150 peer-focus:text-primary peer-aria-invalid:text-status-error-text"
          >
            {shownLabel}
          </label>
        </div>
        {errorEl}
        {hintEl}
      </div>
    )
  }

  if (variant === "floating") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <div className="relative">
          {/* placeholder=" " lets CSS know when the field is empty */}
          <input
            {...input}
            placeholder=" "
            className={cn("peer h-16 w-full rounded-lg border border-input bg-white px-4 pt-7 pb-2 text-base leading-tight text-body", ring)}
          />
          {/* 64px field. Empty: label centred (23px down). Filled or focused: label shrinks to 14px
              in the 11–25px band, the value sits from 29px, so the two never overlap. */}
          <label
            htmlFor={id}
            className="pointer-events-none absolute top-0 left-4 origin-top-left translate-y-[0.6875rem] scale-[0.78] text-base leading-none font-medium text-muted-foreground transition-[translate,scale,color] duration-150 ease-out peer-placeholder-shown:translate-y-[1.4375rem] peer-placeholder-shown:scale-100 peer-focus:translate-y-[0.6875rem] peer-focus:scale-[0.78] peer-focus:text-primary peer-aria-invalid:text-status-error-text"
          >
            {shownLabel}
          </label>
        </div>
        {errorEl}
        {hintEl}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={id} className="text-xs font-semibold text-muted-foreground">
        {shownLabel}
      </label>
      <input
        {...input}
        className="h-12 border-0 border-b-2 border-input bg-transparent px-0 text-base text-body outline-none transition-colors duration-150 focus-visible:outline-none focus:border-primary aria-invalid:border-status-error"
      />
      {errorEl}
      {hintEl}
    </div>
  )
}
