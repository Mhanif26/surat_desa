"use client"

import * as React from "react"
import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { Check, Copy, Download, LogOut, ShieldCheck, TriangleAlert } from "lucide-react"
import { cn } from "cn"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { OptionTiles } from "@/components/choice"

/* ───────── Quick exit ───────── */

export const QUICK_EXIT_LABELS = {
  bar: "Leave this site",
  barHint: "Need to leave fast? Press Shift 3 times.",
  barHintShort: "Press Shift 3 times.",
  floating: "Leave quickly",
  link: "Leave site",
  linkHint: "(Shift ×3)",
}

/** Replaces the history entry, so Back doesn’t return to the reporting site. */
function leave(href: string, onExit?: () => void) {
  if (onExit) return onExit()
  window.location.replace(href)
}

/**
 * Candidate: quick exit for a sensitive site.
 * bar      A · full-width bar at the top           (GOV.UK “Exit this page”)
 * floating B · button pinned bottom-right on phones
 * link     C · quiet link in the header
 * Shift ×3 (within a second) triggers it from anywhere unless `shortcut={false}`.
 * Render it once per page, in the layout, so it’s on every screen of the flow.
 */
export function QuickExit({
  variant,
  href = "https://www.google.com/search?q=weather",
  onExit,
  shortcut = true,
  labels: labelsProp,
  className,
}: {
  variant: "bar" | "floating" | "link"
  className?: string
  /** A neutral page to land on. */
  href?: string
  /** Override for demos/tests; production leaves it out so the page actually leaves. */
  onExit?: () => void
  shortcut?: boolean
  labels?: Partial<typeof QUICK_EXIT_LABELS>
}) {
  const labels = { ...QUICK_EXIT_LABELS, ...labelsProp }
  React.useEffect(() => {
    if (!shortcut) return
    let presses: number[] = []
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Shift" || e.repeat) return
      const now = performance.now()
      presses = [...presses.filter((t) => now - t < 1000), now]
      if (presses.length >= 3) {
        presses = []
        leave(href, onExit)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [href, onExit, shortcut])

  const red = "bg-status-error-text hover:bg-status-error-text/90 active:bg-status-error-text"
  if (variant === "bar") {
    return (
      <div className={cn("flex items-center justify-between gap-3 bg-status-error-fill px-4 py-2", className)}>
        <p className="text-xs text-status-error-text">
          <span className="hidden sm:inline">{labels.barHint}</span>
          <span className="sm:hidden">{labels.barHintShort}</span>
        </p>
        <Button size="dense" className={red} onClick={() => leave(href, onExit)}>
          <LogOut aria-hidden="true" /> {labels.bar}
        </Button>
      </div>
    )
  }
  if (variant === "floating") {
    return (
      <Button className={cn("fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 rounded-full px-5 shadow-float", red, className)} onClick={() => leave(href, onExit)}>
        <LogOut aria-hidden="true" /> {labels.floating}
      </Button>
    )
  }
  return (
    <button type="button" onClick={() => leave(href, onExit)} className={cn("inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-status-error-text", className)}>
      <LogOut className="size-4" aria-hidden="true" /> <span className="underline underline-offset-4">{labels.link}</span>
      {shortcut && <span className="font-normal text-muted-foreground">{labels.linkHint}</span>}
    </button>
  )
}

/* ───────── Anonymity choice ───────── */

export const ANONYMITY_LABELS = {
  toggle: "Keep my report anonymous",
  checkbox: "Send my report anonymously",
  anonTitle: "Stay anonymous",
  namedTitle: "Share my name",
  anonDetail: "We won’t know who you are. Save your case code to check for replies.",
  namedDetail: "A counselor can reply to you directly. Only the counseling team sees it.",
  groupLabel: "Who can see your name",
}

/**
 * Candidate: choosing to stay anonymous. Value: true = anonymous.
 * toggle    A · switch with the consequence under it   (Microsoft Outlook)
 * checkbox  B · one checkbox before Send                (GroupMe)
 * tiles     C · two tiles that spell out both choices    (Polarsteps)
 * With `name`, forms receive name=anonymous|named.
 */
export function AnonymityChoice({
  variant,
  value: valueProp,
  defaultValue = true,
  onValueChange,
  name,
  disabled,
  labels: labelsProp,
}: {
  variant: "toggle" | "checkbox" | "tiles"
  value?: boolean
  defaultValue?: boolean
  onValueChange?: (anonymous: boolean) => void
  name?: string
  disabled?: boolean
  labels?: Partial<typeof ANONYMITY_LABELS>
}) {
  const labels = { ...ANONYMITY_LABELS, ...labelsProp }
  const [anon, setAnon] = useControllableState({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange })
  const detailId = React.useId()
  const detail = anon ? labels.anonDetail : labels.namedDetail
  const hidden = name && <input type="hidden" name={name} value={anon ? "anonymous" : "named"} />

  if (variant === "toggle") {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-hairline p-4">
        <Label className="flex items-center justify-between gap-4 text-base font-semibold text-heading">
          {labels.toggle}
          <Switch checked={anon} onCheckedChange={setAnon} disabled={disabled} aria-describedby={detailId} />
        </Label>
        <p id={detailId} className="text-sm text-muted-foreground" aria-live="polite">{detail}</p>
        {hidden}
      </div>
    )
  }
  if (variant === "checkbox") {
    return (
      <div className="flex flex-col gap-1">
        <Label className="flex min-h-11 items-center gap-3 text-base font-normal text-body">
          <Checkbox checked={anon} onCheckedChange={(v) => setAnon(v === true)} disabled={disabled} aria-describedby={detailId} /> {labels.checkbox}
        </Label>
        <p id={detailId} className="pl-8 text-sm text-muted-foreground" aria-live="polite">{detail}</p>
        {hidden}
      </div>
    )
  }
  return (
    <>
      <OptionTiles
        aria-label={labels.groupLabel}
        value={anon ? "anon" : "named"}
        onValueChange={(v) => setAnon(v === "anon")}
        disabled={disabled}
        className="sm:grid-cols-1"
        options={[
          { value: "anon", title: labels.anonTitle, description: labels.anonDetail },
          { value: "named", title: labels.namedTitle, description: labels.namedDetail },
        ]}
      />
      {hidden}
    </>
  )
}

/* ───────── Case code receipt ───────── */

export const CASE_CODE_LABELS = {
  title: "Your report was received",
  detail: "Nobody can see who sent it. Use this code to check for replies.",
  codeLabel: "Your case code",
  wordsLabel: "Your three words",
  copy: "Copy",
  copied: "Copied",
  save: "Save as file",
  warningTitle: "We can’t recover this code.",
  warningBody: "Without your name we have no way to send it again. Write it down or save it now.",
  fileText: (code: string) => `Your case code: ${code}\nUse it to check for replies. It can’t be recovered if it’s lost.\n`,
}

/**
 * Candidate: the receipt after an anonymous report.
 * number A · reference number + Copy                 (LINE “Report No”)
 * words  B · three-word passphrase, easier to remember (BlaBlaCar, what3words idea)
 * save   C · code + save to file + can’t-recover warning (Vinted)
 * Generate codes on the server with a CSPRNG; this component only displays them.
 */
export function CaseCode({
  variant,
  code,
  words,
  onCopy,
  onSave,
  labels: labelsProp,
}: {
  variant: "number" | "words" | "save"
  code: string
  /** Required for the words variant. */
  words?: string[]
  onCopy?: (value: string) => void
  onSave?: (value: string) => void
  labels?: Partial<typeof CASE_CODE_LABELS>
}) {
  const labels = { ...CASE_CODE_LABELS, ...labelsProp }
  const value = variant === "words" && words?.length ? words.join("-") : code
  const [copied, setCopied] = React.useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      onCopy?.(value)
    } catch {
      // Clipboard blocked (insecure context, permissions): select the code so it can be copied by hand.
      const el = document.getElementById(`case-code-${value}`)
      if (el) window.getSelection()?.selectAllChildren(el)
    }
  }

  function save() {
    const url = URL.createObjectURL(new Blob([labels.fileText(value)], { type: "text/plain" }))
    const a = Object.assign(document.createElement("a"), { href: url, download: "case-code.txt" })
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 0)
    onSave?.(value)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 size-6 shrink-0 text-status-success-text" aria-hidden="true" />
        <div>
          <p className="text-lg font-semibold text-heading">{labels.title}</p>
          <p className="text-sm text-muted-foreground">{labels.detail}</p>
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 rounded-xl bg-canvas p-5">
        <span className="text-xs text-muted-foreground">{variant === "words" ? labels.wordsLabel : labels.codeLabel}</span>
        {variant === "words" && words?.length ? (
          <p id={`case-code-${value}`} className="flex flex-wrap gap-2">
            {words.map((w, i) => (
              <span key={w + i} className="rounded-lg bg-white px-3 py-1.5 text-2xl font-semibold text-heading shadow-float">
                <span className="mr-1 text-xs font-normal text-muted-foreground">{i + 1}</span>
                {w}
              </span>
            ))}
          </p>
        ) : (
          <p id={`case-code-${value}`} className="font-mono text-3xl font-bold tracking-wider text-heading tabular-nums select-all">{code}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={copy} aria-live="polite">
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />} {copied ? labels.copied : labels.copy}
          </Button>
          {variant === "save" && (
            <Button size="sm" variant="outline" onClick={save}>
              <Download aria-hidden="true" /> {labels.save}
            </Button>
          )}
        </div>
      </div>

      {variant === "save" && (
        <Alert variant="warning">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>{labels.warningTitle}</AlertTitle>
          <AlertDescription>{labels.warningBody}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
