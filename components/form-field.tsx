"use client"

import * as React from "react"
import { CircleAlert, CircleCheck, Lock, RotateCcw, Upload } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

type ControlProps = {
  id?: string
  readOnly?: boolean
  "aria-invalid"?: boolean
  "aria-describedby"?: string
}

/**
 * IT-2023 › Form fields. Order is label → hint → error → field.
 * Wraps one control (Input, Textarea…) and wires id, aria-describedby and aria-invalid.
 */
export function FormField({
  label,
  hint,
  error,
  optional,
  readOnlyReason,
  className,
  children,
}: {
  label: React.ReactNode
  hint?: React.ReactNode
  /** Say what's wrong and how to fix it. */
  error?: React.ReactNode
  optional?: boolean
  /** Makes the field read-only and explains why, with a lock icon. */
  readOnlyReason?: React.ReactNode
  className?: string
  children: React.ReactElement<ControlProps>
}) {
  const id = React.useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [(hint || readOnlyReason) && hintId, error && errorId].filter(Boolean).join(" ") || undefined

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>
        {label}
        {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
      </Label>
      {(hint || readOnlyReason) && (
        <p id={hintId} className="-mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          {readOnlyReason && <Lock className="size-4 shrink-0" aria-hidden="true" />}
          {readOnlyReason ?? hint}
        </p>
      )}
      <p id={errorId} aria-live="polite" className="empty:hidden flex items-start gap-1.5 text-xs font-semibold text-status-error-text">
        {error && (
          <>
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {error}
          </>
        )}
      </p>
      {React.cloneElement(children, {
        id,
        readOnly: readOnlyReason ? true : children.props.readOnly,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}
    </div>
  )
}

export type UploadState =
  | { status: "empty" }
  | { status: "uploading"; fileName: string; progress: number }
  | { status: "done"; fileName: string; thumbnail?: string }
  | { status: "failed"; fileName: string; reason: string }

/**
 * IT-2023 › Uploads: empty → uploading → done → failed.
 * Presentational; the caller owns the upload and passes its state.
 */
export function UploadField({
  label,
  hint,
  accept = "image/*",
  state,
  onFile,
  onCancel,
  onRetry,
}: {
  label: React.ReactNode
  hint?: React.ReactNode
  accept?: string
  state: UploadState
  onFile: (file: File) => void
  onCancel?: () => void
  onRetry?: () => void
}) {
  const input = React.useRef<HTMLInputElement>(null)
  const id = React.useId()
  const pick = () => input.current?.click()

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {hint && <p className="-mt-1 text-xs text-muted-foreground">{hint}</p>}
      <input
        ref={input}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          e.target.value = ""
        }}
      />

      <div
        className={cn(
          "flex min-h-20 items-center gap-4 rounded-xl border p-4",
          state.status === "empty" ? "border-dashed border-input" : "border-hairline",
          state.status === "failed" && "border-status-error bg-status-error-fill"
        )}
      >
        {state.status === "empty" && (
          <>
            <Upload className="size-6 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="flex-1 text-muted-foreground">No file yet</span>
            <Button type="button" variant="outline" size="sm" onClick={pick}>
              Choose file
            </Button>
          </>
        )}

        {state.status === "uploading" && (
          <>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex justify-between gap-3 text-sm">
                <span className="truncate">{state.fileName}</span>
                <span className="tabular-nums text-muted-foreground">{Math.round(state.progress)}%</span>
              </div>
              <Progress value={state.progress} aria-label={`Uploading ${state.fileName}`} />
              {/* Announce at 25% steps, not every percent */}
              <span className="sr-only" aria-live="polite">
                {Math.floor(state.progress / 25) * 25}% uploaded
              </span>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          </>
        )}

        {state.status === "done" && (
          <>
            {state.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element -- local blob preview
              <img src={state.thumbnail} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
            ) : (
              <CircleCheck className="size-6 shrink-0 text-status-success-text" aria-hidden="true" />
            )}
            <span className="flex min-w-0 flex-1 items-center gap-2">
              {state.thumbnail && <CircleCheck className="size-5 shrink-0 text-status-success-text" aria-hidden="true" />}
              <span className="truncate">{state.fileName}</span>
            </span>
            <Button type="button" variant="soft" size="sm" onClick={pick}>
              Replace
            </Button>
          </>
        )}

        {state.status === "failed" && (
          <>
            <CircleAlert className="size-6 shrink-0 text-status-error-text" aria-hidden="true" />
            <div className="min-w-0 flex-1" role="alert">
              <p className="truncate text-sm">{state.fileName}</p>
              <p className="text-xs font-semibold text-status-error-text">{state.reason}</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={onRetry ?? pick}>
              <RotateCcw aria-hidden="true" />
              Try again
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
