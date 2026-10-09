"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "cn"
import type { PollId, PollState } from "@/lib/polls"

// One fetch shared by every poll on the page.
let state: PollState | null = null
let loading: Promise<void> | null = null
const listeners = new Set<() => void>()
const set = (next: PollState) => {
  state = next
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  loading ??= fetch("/api/polls")
    .then((r) => r.json())
    .then(set)
    .catch(() => {
      loading = null // allow a retry on the next mount
    })
  return () => listeners.delete(cb)
}

/** X-style poll: vote once, then see the split. Votes land in data/polls.json. */
export function Poll({
  id,
  question,
  options,
}: {
  id: PollId
  question: string
  options: { id: string; label: string }[]
}) {
  const s = React.useSyncExternalStore(subscribe, () => state, () => null)
  const [error, setError] = React.useState<string>()
  const mine = s?.mine[id]
  const tally = s?.tallies[id] ?? {}
  const total = options.reduce((n, o) => n + (tally[o.id] ?? 0), 0)
  const top = Math.max(0, ...options.map((o) => tally[o.id] ?? 0))

  async function vote(option: string) {
    if (!s || mine) return
    const before = s
    setError(undefined)
    // Optimistic: answer the press now, reconcile with the server after.
    set({
      tallies: { ...s.tallies, [id]: { ...tally, [option]: (tally[option] ?? 0) + 1 } },
      mine: { ...s.mine, [id]: option },
    })
    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ poll: id, option }),
      })
      if (!res.ok) throw new Error()
      set(await res.json())
    } catch {
      set(before)
      setError("Your vote didn't go through. Try again.")
    }
  }

  return (
    <div className="rounded-xl border border-hairline bg-white p-5">
      <p className="font-semibold text-heading">{question}</p>
      <ul className="mt-4 flex flex-col gap-2" aria-busy={!s}>
        {options.map((o) => {
          const count = tally[o.id] ?? 0
          const pct = total ? Math.round((count / total) * 100) : 0
          const leading = count > 0 && count === top

          return (
            <li key={o.id}>
              {mine ? (
                <div className="relative flex h-11 items-center justify-between gap-3 overflow-hidden rounded-lg px-4">
                  <span
                    aria-hidden="true"
                    className={cn(
                      // Grows from the left once, when results first show (transform only).
                      "absolute inset-0 origin-left rounded-lg transition-transform duration-500 ease-out [transform:scaleX(var(--pct))] starting:[transform:scaleX(0)]",
                      leading ? "bg-primary-soft" : "bg-surface-strong"
                    )}
                    style={{ "--pct": pct / 100 } as React.CSSProperties}
                  />
                  <span className={cn("relative flex items-center gap-2 text-sm", leading ? "font-bold text-heading" : "text-body")}>
                    {o.label}
                    {mine === o.id && <Check className="size-4 text-primary" strokeWidth={3} aria-label="(your vote)" />}
                  </span>
                  <span className={cn("relative text-sm tabular-nums", leading ? "font-bold text-heading" : "text-muted-foreground")}>
                    {pct}%
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!s}
                  onClick={() => vote(o.id)}
                  className="h-11 w-full rounded-full border border-primary px-4 text-sm font-semibold text-primary transition-[scale,background-color] duration-160 ease-out hover:bg-primary-soft active:scale-97 active:duration-100 disabled:border-hairline disabled:text-disabled"
                >
                  {o.label}
                </button>
              )}
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
        {error ?? (s ? `${total} ${total === 1 ? "vote" : "votes"}${mine ? " · You voted" : ""}` : "Loading votes…")}
      </p>
    </div>
  )
}
