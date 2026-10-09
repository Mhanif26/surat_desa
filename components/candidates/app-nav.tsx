"use client"

import * as React from "react"
import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { PanelLeftClose, PanelLeftOpen, type LucideIcon } from "lucide-react"
import { cn } from "cn"

export type NavItem = {
  id: string
  label: string
  icon: LucideIcon
  href?: string
  /** Unread/attention count; 0 or undefined hides it */
  badge?: number
  /** Sidebar section heading */
  group?: string
}

export const APP_NAV_LABELS = {
  nav: "Main",
  collapse: "Collapse sidebar",
  expand: "Expand sidebar",
  badge: (n: number) => `${n} new`,
}

/** Swap in next/link (or your router’s Link) so navigation stays client-side. */
export type LinkLike = React.ComponentType<{ href: string; className?: string; children: React.ReactNode; "aria-current"?: "page"; onClick?: () => void; title?: string }>

/**
 * Candidate: the app’s main navigation.
 * sidebar A · sections, active item, counts, collapses to an icon rail   (Linear, Square, GitBook)
 * top     B · horizontal tabs under the product name                    (GitBook, Jira)
 * bottom  C · bottom tab bar for phones, 3–5 items, labels always shown  (GitHub, Truecaller)
 * Production apps usually pair A (≥1024px) with C (phones): render both, hide one with CSS.
 */
export function AppNav({
  variant,
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  LinkComponent,
  brand,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  labels: labelsProp,
  className,
}: {
  variant: "sidebar" | "top" | "bottom"
  items: NavItem[]
  /** Active item id (derive it from the current route). */
  value?: string
  defaultValue?: string
  onValueChange?: (id: string) => void
  LinkComponent?: LinkLike
  brand?: React.ReactNode
  collapsed?: boolean
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  labels?: Partial<typeof APP_NAV_LABELS>
  className?: string
}) {
  const labels = { ...APP_NAV_LABELS, ...labelsProp }
  const [active, setActive] = useControllableState({ prop: valueProp, defaultProp: defaultValue ?? items[0]?.id ?? "", onChange: onValueChange })
  const [collapsed, setCollapsed] = useControllableState({ prop: collapsedProp, defaultProp: defaultCollapsed, onChange: onCollapsedChange })

  if (variant === "sidebar") {
    const groups = [...new Set(items.map((i) => i.group ?? ""))]
    return (
      <nav aria-label={labels.nav} className={cn("flex h-full flex-col gap-4 border-r border-hairline bg-canvas p-3 transition-[width] duration-200", collapsed ? "w-[4.25rem]" : "w-64", className)}>
        <div className="flex h-10 items-center justify-between gap-2">
          {!collapsed && <div className="min-w-0 truncate px-2 font-bold text-heading">{brand}</div>}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? labels.expand : labels.collapse}
            aria-expanded={!collapsed}
            className="grid size-11 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-surface-strong focus-visible:outline-2 focus-visible:outline-ring"
          >
            {collapsed ? <PanelLeftOpen className="size-5" aria-hidden="true" /> : <PanelLeftClose className="size-5" aria-hidden="true" />}
          </button>
        </div>
        {groups.map((g) => (
          <div key={g || "main"} className="flex flex-col gap-0.5">
            {g && !collapsed && <p className="px-3 pb-1 text-xs font-semibold text-muted-foreground">{g}</p>}
            <ul className="flex flex-col gap-0.5">
              {items.filter((i) => (i.group ?? "") === g).map((item) => (
                <li key={item.id}>
                  <NavEntry
                    current={item.id === active}
                    onSelect={setActive}
                    LinkComponent={LinkComponent}
                    item={item}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "relative flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-body hover:bg-surface-strong focus-visible:outline-2 focus-visible:outline-ring",
                      item.id === active && "bg-white font-semibold text-primary shadow-float hover:bg-white"
                    )}
                  >
                    <item.icon className="size-5 shrink-0" aria-hidden="true" />
                    {collapsed ? <span className="sr-only">{item.label}</span> : <span className="truncate">{item.label}</span>}
                    <CountBadge n={item.badge} dot={collapsed} label={labels.badge} />
                  </NavEntry>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    )
  }

  if (variant === "top") {
    return (
      <header className={cn("material-bar border-b", className)}>
        <div className="flex h-14 items-center gap-6 px-4">
          {brand && <div className="shrink-0 font-bold text-heading">{brand}</div>}
          <nav aria-label={labels.nav} className="relative h-full min-w-0 flex-1 overflow-x-auto [scrollbar-width:none]">
            <ul className="flex h-full gap-5">
              {items.map((item) => (
                <li key={item.id} className="flex">
                  <NavEntry
                    current={item.id === active}
                    onSelect={setActive}
                    LinkComponent={LinkComponent}
                    item={item}
                    className={cn(
                      "relative flex items-center gap-2 whitespace-nowrap text-sm text-muted-foreground hover:text-heading focus-visible:outline-2 focus-visible:outline-ring",
                      item.id === active && "font-semibold text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary"
                    )}
                  >
                    {item.label}
                    <CountBadge n={item.badge} label={labels.badge} />
                  </NavEntry>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    )
  }

  // bottom: fixed to the viewport with the safe-area inset; pass className="absolute" to preview it in a frame.
  return (
    <nav aria-label={labels.nav} className={cn("material-bar fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)]", className)}>
      <ul className="mx-auto flex max-w-lg">
        {items.slice(0, 5).map((item) => (
          <li key={item.id} className="flex-1">
            <NavEntry
                    current={item.id === active}
                    onSelect={setActive}
                    LinkComponent={LinkComponent}
              item={item}
              className={cn(
                "relative flex h-16 w-full flex-col items-center justify-center gap-1 text-xs text-muted-foreground transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                item.id === active && "font-semibold text-primary"
              )}
            >
              <span className={cn("relative grid h-8 w-14 place-items-center rounded-full transition-colors duration-150", item.id === active && "bg-primary-soft")}>
                <item.icon className="size-5" aria-hidden="true" />
                <CountBadge n={item.badge} dot label={labels.badge} />
              </span>
              {item.label}
            </NavEntry>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function NavEntry({
  item,
  current,
  onSelect,
  LinkComponent,
  className,
  title,
  children,
}: {
  item: NavItem
  current: boolean
  onSelect: (id: string) => void
  LinkComponent?: LinkLike
  className: string
  title?: string
  children: React.ReactNode
}) {
  const props = { className, "aria-current": current ? ("page" as const) : undefined, onClick: () => onSelect(item.id), title }
  if (item.href && LinkComponent) return <LinkComponent href={item.href} {...props}>{children}</LinkComponent>
  if (item.href) return <a href={item.href} {...props}>{children}</a>
  return <button type="button" {...props}>{children}</button>
}

function CountBadge({ n, dot, label }: { n?: number; dot?: boolean; label: (n: number) => string }) {
  if (!n) return null
  if (dot) {
    return (
      <span className="absolute top-1 right-1 size-2.5 rounded-full bg-status-error-text ring-2 ring-white">
        <span className="sr-only">{label(n)}</span>
      </span>
    )
  }
  return (
    <span className="ml-auto rounded-full bg-primary-soft px-2 text-xs font-semibold text-primary tabular-nums">
      {n > 99 ? "99+" : n}
      <span className="sr-only"> {label(n)}</span>
    </span>
  )
}
