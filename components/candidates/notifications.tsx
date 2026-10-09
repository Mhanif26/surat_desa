"use client"

import * as React from "react"
import { BellOff, CheckCheck } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { dayGroup, relativeTime } from "@/lib/time"

export type Notice = {
  id: string
  title: string
  body?: string
  /** ISO timestamp */
  time: string
  read: boolean
  category?: string
  /** Who did it, for the avatar initials */
  actor?: string
  /** One inline action, e.g. “Download letter” */
  action?: string
}

export const NOTIFICATION_LABELS = {
  title: "Notifications",
  markAll: "Mark all as read",
  today: "Today",
  yesterday: "Yesterday",
  earlier: "Earlier",
  all: "All",
  unread: "Unread",
  empty: "You’re all caught up.",
  emptyCategory: "Nothing here yet.",
  unreadCount: (n: number) => `${n} unread`,
}

/**
 * Candidate: notifications / activity feed. Stateless: pass items, handle the callbacks.
 * grouped A · Today / Yesterday / Earlier, unread dot, mark all as read  (Beli, Luma)
 * cards   B · category chips on top, one card per notification         (Tabby)
 * compact C · dense inbox rows with an avatar and one inline action     (Canva)
 * Opening an item marks it read (call onOpen); unread is shown with a dot AND bold title.
 */
export function NotificationList({
  variant,
  items,
  onOpen,
  onMarkAllRead,
  onAction,
  categories,
  now,
  locale = "en",
  labels: labelsProp,
  className,
}: {
  variant: "grouped" | "cards" | "compact"
  items: Notice[]
  onOpen?: (id: string) => void
  onMarkAllRead?: () => void
  onAction?: (id: string) => void
  /** For the cards variant’s chips; defaults to the categories found in items */
  categories?: string[]
  /** Pass on the server/in tests; defaults to now */
  now?: Date
  locale?: string
  labels?: Partial<typeof NOTIFICATION_LABELS>
  className?: string
}) {
  const labels = { ...NOTIFICATION_LABELS, ...labelsProp }
  const [category, setCategory] = React.useState("")
  const at = now ?? new Date()
  const unread = items.filter((i) => !i.read).length
  const cats = categories ?? [...new Set(items.map((i) => i.category).filter(Boolean) as string[])]
  const shown = variant === "cards" && category ? items.filter((i) => (category === "__unread" ? !i.read : i.category === category)) : items

  const header = (
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-lg font-semibold text-heading">
        {labels.title}
        {unread > 0 && <span className="ml-2 rounded-full bg-primary-soft px-2 py-0.5 text-xs text-primary tabular-nums">{labels.unreadCount(unread)}</span>}
      </h3>
      {onMarkAllRead && unread > 0 && (
        <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
          <CheckCheck aria-hidden="true" /> {labels.markAll}
        </Button>
      )}
    </div>
  )

  const empty = (text: string) => (
    <p className="flex items-center gap-3 rounded-xl border border-dashed border-input p-6 text-muted-foreground">
      <BellOff className="size-6" aria-hidden="true" /> {text}
    </p>
  )

  const row = (n: Notice, dense = false) => (
    <li key={n.id} className="relative">
      <button
        type="button"
        onClick={() => onOpen?.(n.id)}
        className={cn(
          "flex w-full items-start gap-3 rounded-xl text-left transition-colors duration-150 hover:bg-canvas focus-visible:outline-2 focus-visible:outline-ring",
          dense ? "px-3 py-2.5" : "p-3",
          !n.read && variant === "grouped" && "bg-primary-soft/60 hover:bg-primary-soft"
        )}
      >
        {variant === "compact" && (
          <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-strong text-sm font-semibold text-heading">
            {(n.actor ?? n.title).split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className={cn("block", n.read ? "text-body" : "font-semibold text-heading")}>
            {!n.read && <span className="sr-only">Unread: </span>}
            {n.title}
          </span>
          {n.body && <span className={cn("block text-sm text-muted-foreground", dense && "truncate")}>{n.body}</span>}
          <time dateTime={n.time} className="mt-0.5 block text-xs text-muted-foreground">{relativeTime(n.time, at, locale)}</time>
        </span>
        {!n.read && <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 rounded-full bg-primary" />}
      </button>
      {n.action && onAction && variant === "compact" && (
        <div className="pb-2 pl-16">
          <Button size="sm" variant="outline" onClick={() => onAction(n.id)}>{n.action}</Button>
        </div>
      )}
    </li>
  )

  if (variant === "grouped") {
    const groups = (["today", "yesterday", "earlier"] as const).map((g) => [g, items.filter((i) => dayGroup(i.time, at) === g)] as const).filter(([, xs]) => xs.length)
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        {header}
        {!items.length && empty(labels.empty)}
        {groups.map(([g, xs]) => (
          <section key={g} aria-label={labels[g]}>
            <h4 className="px-3 pb-1 text-xs font-semibold text-muted-foreground">{labels[g]}</h4>
            <ul className="flex flex-col gap-1">{xs.map((n) => row(n))}</ul>
          </section>
        ))}
      </div>
    )
  }

  if (variant === "cards") {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        {header}
        <div role="group" aria-label={labels.title} className="relative flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {[["", labels.all], ["__unread", labels.unread], ...cats.map((c) => [c, c])].map(([id, label]) => (
            <button
              key={id || "all"}
              type="button"
              aria-pressed={category === id}
              onClick={() => setCategory(id)}
              className={cn("inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-ring", category === id ? "border-primary bg-primary text-white" : "border-input bg-white text-heading hover:bg-canvas")}
            >
              {label}
            </button>
          ))}
        </div>
        {!shown.length && empty(category ? labels.emptyCategory : labels.empty)}
        <ul className="flex flex-col gap-2">
          {shown.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => onOpen?.(n.id)}
                className="flex w-full flex-col gap-1 rounded-xl border border-hairline bg-white p-4 text-left hover:bg-canvas focus-visible:outline-2 focus-visible:outline-ring"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className={cn(n.read ? "text-body" : "font-semibold text-heading")}>
                    {!n.read && <span className="sr-only">Unread: </span>}
                    {n.title}
                  </span>
                  <time dateTime={n.time} className="shrink-0 text-xs text-muted-foreground">{relativeTime(n.time, at, locale)}</time>
                </span>
                {n.body && <span className="text-sm text-muted-foreground">{n.body}</span>}
                {n.category && <span className="mt-1 w-fit rounded-full bg-surface-strong px-2.5 py-0.5 text-xs font-semibold text-body">{n.category}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {header}
      {!items.length && empty(labels.empty)}
      <ul className="flex flex-col divide-y divide-hairline">{items.map((n) => row(n, true))}</ul>
    </div>
  )
}
