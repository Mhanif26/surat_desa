"use client"

import * as React from "react"
import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { Camera, CircleAlert, CircleCheck, IdCard, ImageUp, LoaderCircle, Trash2, Upload } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { formatBytes, resizeImage } from "@/lib/image"

export const PHOTO_UPLOAD_LABELS = {
  choose: "Choose photo",
  replace: "Replace",
  remove: "Remove",
  empty: "No photo yet",
  preparing: "Preparing photo…",
  tapToChoose: "Tap to choose a photo",
  dragHere: "or drag a file here",
  frameHint: "Place the front of the card inside the frame",
  takePhoto: "Take photo",
  retake: "Retake",
  saved: "Photo saved",
  wrongType: "That file isn’t a photo. Choose a JPG or PNG.",
  tooBig: (max: string) => `That photo is over ${max}. Choose a smaller one.`,
}

type Props = {
  variant: "row" | "dropzone" | "camera"
  label: string
  hint?: string
  /** Controlled file; null when empty. */
  value?: File | null
  defaultValue?: File | null
  /** Receives the (resized) file, or null after Remove. */
  onValueChange?: (file: File | null) => void
  accept?: string
  /** Checked after resizing. */
  maxSizeMB?: number
  /** Longest side in px after on-device resizing; 0 turns resizing off. */
  maxDimension?: number
  /** The real file input carries this name, so native forms submit the resized file. */
  name?: string
  required?: boolean
  disabled?: boolean
  /** Upload/server error, e.g. “The photo is too blurry. Retake it in brighter light.” */
  error?: string
  labels?: Partial<typeof PHOTO_UPLOAD_LABELS>
  className?: string
}

/**
 * Candidate: document photo.
 * row      A · compact row: empty → done with thumbnail      (IT-2023 UploadField)
 * dropzone B · large tap/drop area with a preview           (iconiq file-upload)
 * camera   C · ID-card-shaped frame that opens the camera   (DoorDash, Wise, Klarna)
 */
export function PhotoUpload({
  variant,
  label,
  hint,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  accept = "image/jpeg,image/png,image/webp,image/heic",
  maxSizeMB = 10,
  maxDimension = 1600,
  name,
  required,
  disabled,
  error: errorProp,
  labels: labelsProp,
  className,
}: Props) {
  const labels = { ...PHOTO_UPLOAD_LABELS, ...labelsProp }
  const [file, setFile] = useControllableState<File | null>({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange })
  const [localError, setLocalError] = React.useState("")
  const [preparing, setPreparing] = React.useState(false)
  const [over, setOver] = React.useState(false)
  const input = React.useRef<HTMLInputElement>(null)
  const id = React.useId()
  const error = errorProp || localError
  const preview = usePreview(file)

  async function take(picked?: File) {
    if (!picked) return
    setLocalError("")
    if (!picked.type.startsWith("image/")) return setLocalError(labels.wrongType)
    setPreparing(true)
    const out = maxDimension ? await resizeImage(picked, maxDimension) : picked
    setPreparing(false)
    if (out.size > maxSizeMB * 1024 * 1024) return setLocalError(labels.tooBig(`${maxSizeMB} MB`))
    // Put the resized file back into the real input so a plain <form> submits it.
    if (input.current && typeof DataTransfer !== "undefined") {
      const dt = new DataTransfer()
      dt.items.add(out)
      input.current.files = dt.files
    }
    setFile(out)
  }

  function remove() {
    if (input.current) input.current.value = ""
    setFile(null)
    setLocalError("")
  }

  const pick = () => input.current?.click()
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined

  const head = (
    <>
      <label htmlFor={id} className="text-lg font-semibold text-heading">{label}</label>
      {hint && <p id={`${id}-hint`} className="-mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={`${id}-error`} aria-live="polite" className="flex items-start gap-1.5 text-xs font-semibold text-status-error-text">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {error}
        </p>
      )}
      <input
        ref={input}
        id={id}
        type="file"
        name={name}
        accept={accept}
        required={required && !file}
        disabled={disabled}
        capture={variant === "camera" ? "environment" : undefined}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className="sr-only"
        onChange={(e) => take(e.target.files?.[0])}
      />
    </>
  )

  const meta = file && (
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="flex items-center gap-1.5">
        <CircleCheck className="size-4 shrink-0 text-status-success-text" aria-hidden="true" />
        <span className="truncate">{file.name}</span>
      </span>
      <span className="text-xs text-muted-foreground tabular-nums">{formatBytes(file.size)}</span>
    </span>
  )

  const actions = file && (
    <span className="flex shrink-0 gap-1">
      <Button type="button" variant="soft" size="sm" onClick={pick} disabled={disabled}>{labels.replace}</Button>
      <Button type="button" variant="ghost" size="sm" onClick={remove} disabled={disabled} aria-label={`${labels.remove} ${file.name}`}>
        <Trash2 aria-hidden="true" />
      </Button>
    </span>
  )

  if (variant === "row") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {head}
        <div className={cn("flex min-h-20 items-center gap-4 rounded-xl border p-4", file ? "border-hairline" : "border-dashed border-input", error && "border-status-error")}>
          {preparing ? (
            <>
              <LoaderCircle className="size-6 shrink-0 animate-spin text-muted-foreground" aria-hidden="true" />
              <span className="flex-1 text-muted-foreground" role="status">{labels.preparing}</span>
            </>
          ) : file ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
              {preview && <img src={preview} alt="" className="size-12 shrink-0 rounded-lg object-cover" />}
              {meta}
              {actions}
            </>
          ) : (
            <>
              <Upload className="size-6 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="flex-1 text-muted-foreground">{labels.empty}</span>
              <Button type="button" variant="outline" size="sm" onClick={pick} disabled={disabled}>{labels.choose}</Button>
            </>
          )}
        </div>
      </div>
    )
  }

  if (variant === "dropzone") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {head}
        {file && preview ? (
          <div className="flex flex-col gap-3">
            <div className="relative overflow-hidden rounded-xl border border-hairline bg-canvas">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
              <img src={preview} alt={`Preview: ${label}`} className="mx-auto max-h-64 object-contain" />
            </div>
            <div className="flex items-center gap-3">{meta}{actions}</div>
          </div>
        ) : (
          <button
            type="button"
            onClick={pick}
            disabled={disabled}
            aria-describedby={describedBy}
            onDragOver={(e) => {
              e.preventDefault()
              setOver(true)
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setOver(false)
              take(e.dataTransfer.files[0])
            }}
            className={cn(
              "flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-[border-color,background-color,scale] duration-150 active:scale-[0.99] disabled:opacity-60",
              over ? "border-primary bg-primary-soft" : error ? "border-status-error bg-status-error-fill" : "border-input bg-canvas hover:border-primary"
            )}
          >
            <span className="grid size-14 place-items-center rounded-full bg-white text-primary shadow-float">
              {preparing ? <LoaderCircle className="size-6 animate-spin" aria-hidden="true" /> : <ImageUp className="size-6" aria-hidden="true" />}
            </span>
            <span className="text-lg font-semibold text-heading">{preparing ? labels.preparing : labels.tapToChoose}</span>
            <span className="text-sm text-muted-foreground">
              <span className="hidden [@media(pointer:fine)]:inline">{labels.dragHere} · </span>JPG, PNG · {maxSizeMB} MB
            </span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {head}
      {/* 85.6 × 54mm: the ID-1 card shape, so the frame itself says what to photograph */}
      <div className="relative aspect-[1.586] w-full max-w-md overflow-hidden rounded-2xl bg-primary">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob preview
          <img src={preview} alt={`Photo: ${label}`} className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-white/60">
            {preparing ? <LoaderCircle className="size-10 animate-spin" aria-hidden="true" /> : <IdCard className="size-16" strokeWidth={1.5} aria-hidden="true" />}
          </div>
        )}
        {["top-4 left-4 border-t-3 border-l-3 rounded-tl-xl", "top-4 right-4 border-t-3 border-r-3 rounded-tr-xl", "bottom-14 left-4 border-b-3 border-l-3 rounded-bl-xl", "bottom-14 right-4 border-b-3 border-r-3 rounded-br-xl"].map((c) => (
          <span key={c} aria-hidden="true" className={cn("absolute size-8 border-white", c)} />
        ))}
        <p className="absolute inset-x-0 bottom-0 flex h-11 items-center gap-2 bg-white px-4 text-sm font-semibold text-heading">
          {file ? (
            <>
              <CircleCheck className="size-5 text-status-success-text" aria-hidden="true" /> {labels.saved} · {formatBytes(file.size)}
            </>
          ) : (
            labels.frameHint
          )}
        </p>
      </div>
      <div className="flex max-w-md gap-2">
        <Button type="button" variant={file ? "outline" : "default"} className="flex-1" onClick={pick} disabled={disabled || preparing}>
          <Camera aria-hidden="true" /> {file ? labels.retake : labels.takePhoto}
        </Button>
        {file && (
          <Button type="button" variant="ghost" onClick={remove} disabled={disabled} aria-label={labels.remove}>
            <Trash2 aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  )
}

/** Object URL that follows the file and is revoked when it changes. */
function usePreview(file: File | null) {
  const url = React.useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file])
  React.useEffect(() => () => void (url && URL.revokeObjectURL(url)), [url])
  return url
}
