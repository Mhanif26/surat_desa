"use client"

import * as React from "react"
import { Barcode, BookOpen, Camera, Check, CircleAlert, Keyboard, LoaderCircle, RotateCcw } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatusTag, type Tone } from "@/components/status"
import { isValidIsbn, normalizeIsbn } from "@/lib/isbn"

/* ───────── Loans ───────── */

export type Loan = {
  id: string
  title: string
  author: string
  member?: string
  /** ISO date the item is due back */
  dueDate: string
  /** Length of a loan in days, for the loan-period bar */
  loanDays: number
  /** Set when renewing isn’t allowed, with the reason shown to the member */
  cannotRenew?: string
}

export const LOAN_LABELS = {
  overdue: (n: number) => `${n} ${n === 1 ? "day" : "days"} overdue`,
  dueToday: "Due today",
  dueIn: (n: number) => `Due in ${n} ${n === 1 ? "day" : "days"}`,
  renew: "Renew",
  checkIn: "Check in",
  empty: "Nothing borrowed right now.",
  item: "Item",
  member: "Member",
  due: "Due",
  periodUsed: "Loan period used",
}

const DAY = 86_400_000
const daysBetween = (from: Date, to: string) => Math.round((new Date(`${to}T00:00:00`).getTime() - new Date(from.toDateString()).getTime()) / DAY)
const dueTone = (d: number): Tone => (d < 0 ? "error" : d <= 3 ? "warning" : "neutral")

// A cover stand-in from the title; pass `cover` URLs in your own row if you have them.
function Cover({ title, className }: { title: string; className?: string }) {
  const hues = ["bg-primary", "bg-secondary", "bg-status-info-text", "bg-status-warning-text"]
  const hue = hues[[...title].reduce((a, c) => a + c.charCodeAt(0), 0) % hues.length]
  return (
    <span aria-hidden="true" className={cn("grid shrink-0 place-items-end rounded-md p-1.5 text-left text-[0.625rem] leading-tight font-semibold text-white", hue, className)}>
      {title.split(" ").slice(0, 3).join(" ")}
    </span>
  )
}

/** Runs an async row action and tracks which row is busy, so its button shows a spinner. */
function useRowAction() {
  const [busy, setBusy] = React.useState<string>()
  const run = async (id: string, fn?: (id: string) => unknown) => {
    if (!fn || busy) return
    setBusy(id)
    try {
      await fn(id)
    } finally {
      setBusy(undefined)
    }
  }
  return [busy, run] as const
}

/**
 * Candidate: borrowed items. Stateless: pass `loans`, handle `onRenew` / `onCheckIn`
 * (sync or async; the row shows a spinner until they settle).
 * row  A · cover, due chip, Renew                     (Blinkist, ElevenReader)
 * card B · loan period as a bar                        (Amazon Kindle loans)
 * desk C · dense rows for the librarian, Check in       (Attio)
 */
export function LoanList({
  variant,
  loans,
  onRenew,
  onCheckIn,
  today,
  locale = "en-GB",
  labels: labelsProp,
  className,
}: {
  variant: "row" | "card" | "desk"
  loans: Loan[]
  onRenew?: (id: string) => unknown
  onCheckIn?: (id: string) => unknown
  /** Defaults to now; pass it when rendering on the server or in tests. */
  today?: Date
  locale?: string
  labels?: Partial<typeof LOAN_LABELS>
  className?: string
}) {
  const labels = { ...LOAN_LABELS, ...labelsProp }
  const [busy, run] = useRowAction()
  const now = today ?? new Date()
  const fmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" })
  const rows = loans.map((l) => {
    const left = daysBetween(now, l.dueDate)
    const text = left < 0 ? labels.overdue(-left) : left === 0 ? labels.dueToday : labels.dueIn(left)
    const used = Math.min(1, Math.max(0, (l.loanDays - left) / l.loanDays))
    return { ...l, left, text, used, dueText: fmt.format(new Date(`${l.dueDate}T00:00:00`)) }
  })

  if (!rows.length) {
    return (
      <p className={cn("flex items-center gap-3 rounded-xl border border-dashed border-input p-6 text-muted-foreground", className)}>
        <BookOpen className="size-6" aria-hidden="true" /> {labels.empty}
      </p>
    )
  }

  const action = (l: (typeof rows)[number], kind: "renew" | "checkIn", variantBtn: "soft" | "outline") => {
    const fn = kind === "renew" ? onRenew : onCheckIn
    const label = kind === "renew" ? labels.renew : labels.checkIn
    if (!fn) return null
    const pending = busy === l.id
    return (
      <Button
        size="sm"
        variant={variantBtn}
        disabled={(kind === "renew" && !!l.cannotRenew) || (!!busy && !pending)}
        aria-busy={pending || undefined}
        title={kind === "renew" ? l.cannotRenew : undefined}
        onClick={() => run(l.id, fn)}
      >
        {pending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : kind === "renew" && <RotateCcw aria-hidden="true" />} {label}
      </Button>
    )
  }

  if (variant === "desk") {
    return (
      <div className={cn("relative overflow-x-auto rounded-xl border border-hairline", className)}>
        <table className="w-full text-left text-sm">
          <thead className="bg-canvas text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="h-10 px-3 font-semibold">{labels.item}</th>
              <th scope="col" className="h-10 px-3 font-semibold">{labels.member}</th>
              <th scope="col" className="h-10 px-3 font-semibold">{labels.due}</th>
              <th scope="col" className="h-10 px-3"><span className="sr-only">Status</span></th>
              <th scope="col" className="h-10 px-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {rows.map((l) => (
              <tr key={l.id}>
                <th scope="row" className="px-3 py-2 font-semibold text-heading"><span className="block max-w-56 truncate">{l.title}</span></th>
                <td className="px-3 py-2 whitespace-nowrap">{l.member}</td>
                <td className="px-3 py-2 whitespace-nowrap tabular-nums text-muted-foreground">{l.dueText}</td>
                <td className="px-3 py-2"><StatusTag tone={dueTone(l.left)}>{l.text}</StatusTag></td>
                <td className="px-3 py-2 text-right">{action(l, "checkIn", "outline")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <ul className={cn("flex flex-col", variant === "row" ? "divide-y divide-hairline rounded-xl border border-hairline" : "gap-3", className)}>
      {rows.map((l) =>
        variant === "row" ? (
          <li key={l.id} className="flex items-center gap-3 p-3">
            <Cover title={l.title} className="h-16 w-11" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-heading">{l.title}</p>
              <p className="truncate text-sm text-muted-foreground">{l.author}</p>
              <StatusTag tone={dueTone(l.left)} className="mt-1">{l.text}</StatusTag>
              {l.cannotRenew && <p className="mt-1 text-xs text-muted-foreground">{l.cannotRenew}</p>}
            </div>
            {action(l, "renew", "soft")}
          </li>
        ) : (
          <li key={l.id} className="flex gap-4 rounded-xl border border-hairline p-4">
            <Cover title={l.title} className="h-24 w-16" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div>
                <p className="truncate text-lg font-semibold text-heading">{l.title}</p>
                <p className="truncate text-sm text-muted-foreground">{l.author}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={cn("font-semibold", l.left < 0 ? "text-status-error-text" : l.left <= 3 ? "text-status-warning-text" : "text-heading")}>{l.text}</span>
                <span className="text-muted-foreground tabular-nums">{l.dueText}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-strong" role="progressbar" aria-label={labels.periodUsed} aria-valuenow={Math.round(l.used * 100)} aria-valuemin={0} aria-valuemax={100}>
                <div className={cn("h-full origin-left rounded-full transition-transform duration-300 ease-out", l.left < 0 ? "bg-status-error-text" : l.left <= 3 ? "bg-status-warning" : "bg-primary")} style={{ transform: `scaleX(${l.used})` }} />
              </div>
              {l.cannotRenew && <p className="text-xs text-muted-foreground">{l.cannotRenew}</p>}
              <div className="flex gap-2">{action(l, "renew", "outline")}</div>
            </div>
          </li>
        )
      )}
    </ul>
  )
}

/* ───────── Scan field ───────── */

export const SCAN_LABELS = {
  field: "ISBN or barcode",
  hint: "Scan with a USB scanner, or type it and press Enter.",
  submit: "Check out",
  invalid: "That isn’t a valid ISBN. Check the last digit, or scan again.",
  rejected: "That item can’t be checked out. See the message above.",
  camera: "Camera",
  keyboard: "Keyboard",
  scanWith: "Scan with",
  enterManually: "Enter the code manually",
  startCamera: "Start camera",
  pointCamera: "Point the camera at the barcode on the back cover.",
  unsupported: "This browser can’t read barcodes. Enter the code manually.",
  denied: "Camera is blocked. Allow it in the browser, or enter the code manually.",
  recent: "Just scanned",
}

type BarcodeDetectorLike = { detect: (src: CanvasImageSource) => Promise<{ rawValue: string }[]> }
declare global {
  interface Window {
    BarcodeDetector?: new (opts?: { formats: string[] }) => BarcodeDetectorLike
  }
}

/**
 * Candidate: scanning an item at the desk.
 * input  A · one field; USB scanners type the code and press Enter for you  (MyFitnessPal)
 * camera B · camera viewfinder, “Enter manually” underneath               (Yazio, Bevel)
 * tabs   C · Camera | Keyboard switch at the top                          (ZARA)
 * `onScan` receives a validated, normalized code; return false (or a rejected promise) to refuse it.
 * Camera scanning uses the browser’s BarcodeDetector (Chromium); elsewhere it falls back to typing.
 */
export function ScanField({
  variant,
  onScan,
  validate = isValidIsbn,
  normalize = normalizeIsbn,
  showRecent = true,
  labels: labelsProp,
  className,
}: {
  variant: "input" | "camera" | "tabs"
  onScan: (code: string) => boolean | void | Promise<boolean | void>
  validate?: (code: string) => boolean
  normalize?: (raw: string) => string
  showRecent?: boolean
  labels?: Partial<typeof SCAN_LABELS>
  className?: string
}) {
  const labels = { ...SCAN_LABELS, ...labelsProp }
  const [recent, setRecent] = React.useState<string[]>([])
  const [mode, setMode] = React.useState<"camera" | "keyboard">(variant === "input" ? "keyboard" : "camera")
  const [manual, setManual] = React.useState(variant === "input")

  /** Returns an error message, or "" when accepted. */
  const accept = async (raw: string): Promise<string> => {
    const code = normalize(raw)
    if (!validate(code)) return labels.invalid
    const ok = await Promise.resolve(onScan(code)).catch(() => false)
    if (ok === false) return labels.rejected
    setRecent((r) => [code, ...r.filter((x) => x !== code)].slice(0, 3))
    return ""
  }

  const keyboard = <ManualEntry onSubmit={accept} labels={labels} />
  const camera = <CameraScan onDetect={async (raw) => !(await accept(raw))} labels={labels} />

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {variant === "tabs" && (
        <div role="tablist" aria-label={labels.scanWith} className="grid grid-cols-2 rounded-xl border border-input p-1">
          {(["camera", "keyboard"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              type="button"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={cn("inline-flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", mode === m ? "bg-primary-soft text-primary ring-1 ring-primary" : "text-muted-foreground")}
            >
              {m === "camera" ? <Camera className="size-4" aria-hidden="true" /> : <Keyboard className="size-4" aria-hidden="true" />}
              {m === "camera" ? labels.camera : labels.keyboard}
            </button>
          ))}
        </div>
      )}

      {variant === "input" && keyboard}
      {variant === "tabs" && (mode === "camera" ? camera : keyboard)}
      {variant === "camera" && (
        <>
          {camera}
          {manual ? keyboard : (
            <button type="button" onClick={() => setManual(true)} className="min-h-11 self-center text-sm font-semibold text-primary underline underline-offset-4">
              {labels.enterManually}
            </button>
          )}
        </>
      )}

      {showRecent && recent.length > 0 && (
        <div aria-live="polite">
          <p className="text-xs text-muted-foreground">{labels.recent}</p>
          <ul className="flex flex-col gap-1 text-sm">
            {recent.map((c) => (
              <li key={c} className="flex items-center gap-2 font-mono text-muted-foreground">
                <Check className="size-4 text-status-success-text" aria-hidden="true" /> {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function ManualEntry({ onSubmit, labels }: { onSubmit: (raw: string) => Promise<string>; labels: typeof SCAN_LABELS }) {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const id = React.useId()
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={async (e) => {
        e.preventDefault()
        if (busy || !value.trim()) return
        setBusy(true)
        const problem = await onSubmit(value)
        setBusy(false)
        setError(problem)
        if (!problem) setValue("") // ready for the next scan
      }}
    >
      <Label htmlFor={id}>{labels.field}</Label>
      <p id={`${id}-hint`} className="-mt-1 text-xs text-muted-foreground">{labels.hint}</p>
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-xs font-semibold text-status-error-text" aria-live="polite">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {error}
        </p>
      )}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Barcode className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id={id}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError("")
            }}
            inputMode="numeric"
            autoComplete="off"
            enterKeyHint="go"
            className="pl-10 font-mono"
            aria-invalid={error ? true : undefined}
            aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
          />
        </div>
        <Button type="submit" pending={busy} pendingLabel="…">{labels.submit}</Button>
      </div>
    </form>
  )
}

function CameraScan({ onDetect, labels }: { onDetect: (raw: string) => Promise<boolean>; labels: typeof SCAN_LABELS }) {
  const video = React.useRef<HTMLVideoElement>(null)
  const [state, setState] = React.useState<"idle" | "on" | "unsupported" | "denied">("idle")
  // Latest callback without restarting the camera every time the parent re-renders.
  const detect = React.useRef(onDetect)
  React.useEffect(() => {
    detect.current = onDetect
  })

  React.useEffect(() => {
    if (state !== "on") return
    let stream: MediaStream | undefined
    let raf = 0
    let stopped = false
    ;(async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        if (stopped) return stream.getTracks().forEach((t) => t.stop())
        if (video.current) {
          video.current.srcObject = stream
          await video.current.play()
        }
        const detector = new window.BarcodeDetector!({ formats: ["ean_13", "ean_8", "upc_a", "code_128"] })
        const tick = async () => {
          if (stopped || !video.current) return
          const codes = await detector.detect(video.current).catch(() => [])
          if (codes[0] && (await detect.current(codes[0].rawValue))) await new Promise((r) => setTimeout(r, 1200)) // pause between scans
          raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      } catch {
        setState("denied")
      }
    })()
    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [state])

  return (
    <div className="relative grid aspect-[4/3] w-full max-w-md place-items-center overflow-hidden rounded-2xl bg-primary text-center text-white">
      {state === "on" && <video ref={video} muted playsInline className="absolute inset-0 size-full object-cover" />}
      {["top-4 left-4 border-t-3 border-l-3 rounded-tl-xl", "top-4 right-4 border-t-3 border-r-3 rounded-tr-xl", "bottom-4 left-4 border-b-3 border-l-3 rounded-bl-xl", "bottom-4 right-4 border-b-3 border-r-3 rounded-br-xl"].map((c) => (
        <span key={c} aria-hidden="true" className={cn("absolute size-8 border-white", c)} />
      ))}
      {state !== "on" && (
        <div className="relative flex flex-col items-center gap-3 p-6">
          <Barcode className="size-10 opacity-70" aria-hidden="true" />
          <p className="text-sm" role={state === "idle" ? undefined : "alert"}>
            {state === "unsupported" ? labels.unsupported : state === "denied" ? labels.denied : labels.pointCamera}
          </p>
          {state === "idle" && (
            <Button variant="outline" size="sm" onClick={() => setState(typeof window !== "undefined" && window.BarcodeDetector ? "on" : "unsupported")}>
              <Camera aria-hidden="true" /> {labels.startCamera}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
