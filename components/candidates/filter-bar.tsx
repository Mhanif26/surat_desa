"use client"

import * as React from "react"
import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { Check, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveDialog } from "@/components/responsive-dialog"
import { activeFilterCount, EMPTY_FILTER, type FilterValue } from "@/lib/filter"

export type Facet = { id: string; label: string; options: { value: string; label: string; count?: number }[] }

export const FILTER_LABELS = {
  search: "Search",
  searchPlaceholder: "Search by title or author",
  sort: "Sort",
  filters: "Filters",
  clear: "Clear all",
  show: (n: number) => `Show ${n} ${n === 1 ? "result" : "results"}`,
  results: (n: number) => `${n} ${n === 1 ? "result" : "results"}`,
  remove: (label: string) => `Remove filter ${label}`,
  all: "All",
}

/**
 * Candidate: search + filter + sort above a list. Emits one value shape for every variant;
 * filter with lib/filter `applyFilters` (or send the value to your API).
 * toolbar A · search, a dropdown per facet, sort; active filters as removable chips (Miro, Sana, Jira)
 * sidebar B · checkbox groups beside the list; a Filters sheet on phones          (User Interviews)
 * chips   C · search + one row of chips with counts for the main facet           (Tabby, Luma)
 */
export function FilterBar({
  variant,
  facets,
  sorts = [],
  value: valueProp,
  defaultValue = EMPTY_FILTER,
  onValueChange,
  resultCount,
  labels: labelsProp,
  className,
  children,
}: {
  variant: "toolbar" | "sidebar" | "chips"
  facets: Facet[]
  sorts?: { value: string; label: string }[]
  value?: FilterValue
  defaultValue?: FilterValue
  onValueChange?: (v: FilterValue) => void
  /** Shown and announced after each change */
  resultCount?: number
  labels?: Partial<typeof FILTER_LABELS>
  className?: string
  /** The results; the sidebar variant lays them out beside the filters */
  children?: React.ReactNode
}) {
  const labels = { ...FILTER_LABELS, ...labelsProp }
  const [v, setV] = useControllableState({ prop: valueProp, defaultProp: defaultValue, onChange: onValueChange })
  const searchId = React.useId()
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const toggle = (facet: string, option: string) => {
    const cur = v.filters[facet] ?? []
    setV({ ...v, filters: { ...v.filters, [facet]: cur.includes(option) ? cur.filter((x) => x !== option) : [...cur, option] } })
  }
  const clear = () => setV({ ...v, filters: {} })
  const active = activeFilterCount(v)
  const optionLabel = (facet: string, option: string) => facets.find((f) => f.id === facet)?.options.find((o) => o.value === option)?.label ?? option

  const search = (
    <div className="relative min-w-0 flex-1">
      <label htmlFor={searchId} className="sr-only">{labels.search}</label>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input
        id={searchId}
        type="search"
        value={v.query}
        placeholder={labels.searchPlaceholder}
        onChange={(e) => setV({ ...v, query: e.target.value })}
        className="h-12 w-full rounded-lg border border-input bg-white pr-4 pl-11 text-base text-body outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  )

  const sortSelect = sorts.length > 0 && (
    <Select value={v.sort || sorts[0].value} onValueChange={(s) => setV({ ...v, sort: s })}>
      <SelectTrigger aria-label={labels.sort} className="w-full sm:w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sorts.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
      </SelectContent>
    </Select>
  )

  const count = resultCount !== undefined && (
    <p role="status" className="text-sm text-muted-foreground">{labels.results(resultCount)}</p>
  )

  const checkboxGroups = (
    <div className="flex flex-col gap-6">
      {facets.map((f) => (
        <fieldset key={f.id} className="flex flex-col gap-1">
          <legend className="mb-1 text-sm font-semibold text-heading">{f.label}</legend>
          {f.options.map((o) => (
            <Label key={o.value} className="flex min-h-11 cursor-pointer items-center gap-3 text-base font-normal text-body">
              <Checkbox checked={(v.filters[f.id] ?? []).includes(o.value)} onCheckedChange={() => toggle(f.id, o.value)} />
              <span className="flex-1">{o.label}</span>
              {o.count !== undefined && <span className="text-sm text-muted-foreground tabular-nums">{o.count}</span>}
            </Label>
          ))}
        </fieldset>
      ))}
    </div>
  )

  if (variant === "sidebar") {
    return (
      <div className={cn("flex flex-col gap-4 lg:flex-row lg:gap-8", className)}>
        <aside className="hidden w-60 shrink-0 lg:block" aria-label={labels.filters}>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-heading">{labels.filters}</p>
            {active > 0 && <Button variant="link" size="sm" onClick={clear}>{labels.clear}</Button>}
          </div>
          {checkboxGroups}
        </aside>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            {search}
            <div className="flex gap-2">
              <div className="lg:hidden">
                <ResponsiveDialog
                  open={sheetOpen}
                  onOpenChange={setSheetOpen}
                  trigger={
                    <Button variant="outline">
                      <SlidersHorizontal aria-hidden="true" /> {labels.filters}
                      {active > 0 && <span className="rounded-full bg-primary px-2 text-xs text-white tabular-nums">{active}</span>}
                    </Button>
                  }
                  title={labels.filters}
                  footer={
                    <>
                      <Button variant="outline" onClick={clear}>{labels.clear}</Button>
                      <Button onClick={() => setSheetOpen(false)}>{labels.show(resultCount ?? 0)}</Button>
                    </>
                  }
                >
                  {checkboxGroups}
                </ResponsiveDialog>
              </div>
              {sortSelect}
            </div>
          </div>
          {count}
          {children}
        </div>
      </div>
    )
  }

  if (variant === "chips") {
    const main = facets[0]
    const selected = v.filters[main.id] ?? []
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        <div className="flex flex-col gap-2 sm:flex-row">{search}{sortSelect}</div>
        <div role="group" aria-label={main.label} className="relative flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          <ChipButton pressed={!selected.length} onClick={() => setV({ ...v, filters: { ...v.filters, [main.id]: [] } })}>{labels.all}</ChipButton>
          {main.options.map((o) => (
            <ChipButton key={o.value} pressed={selected.includes(o.value)} onClick={() => toggle(main.id, o.value)} count={o.count}>
              {o.label}
            </ChipButton>
          ))}
        </div>
        {count}
        {children}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-2 lg:flex-row">
        {search}
        <div className="flex flex-wrap gap-2">
          {facets.map((f) => {
            const n = (v.filters[f.id] ?? []).length
            return (
              <Popover key={f.id}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn(n > 0 && "border-primary bg-primary-soft text-primary")}>
                    {f.label}
                    {n > 0 && <span className="rounded-full bg-primary px-2 text-xs text-white tabular-nums">{n}</span>}
                    <ChevronDown aria-hidden="true" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-2">
                  {f.options.map((o) => {
                    const on = (v.filters[f.id] ?? []).includes(o.value)
                    return (
                      <button
                        key={o.value}
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        onClick={() => toggle(f.id, o.value)}
                        className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-base hover:bg-canvas focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        <span className={cn("grid size-5 place-items-center rounded-sm border", on ? "border-primary bg-primary text-white" : "border-input")}>
                          {on && <Check className="size-4" strokeWidth={3} aria-hidden="true" />}
                        </span>
                        <span className="flex-1">{o.label}</span>
                        {o.count !== undefined && <span className="text-sm text-muted-foreground tabular-nums">{o.count}</span>}
                      </button>
                    )
                  })}
                </PopoverContent>
              </Popover>
            )
          })}
          {sortSelect}
        </div>
      </div>
      {active > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(v.filters).flatMap(([facet, opts]) =>
            opts.map((o) => (
              <button
                key={facet + o}
                type="button"
                onClick={() => toggle(facet, o)}
                aria-label={labels.remove(optionLabel(facet, o))}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary-soft pr-2 pl-3 text-sm font-semibold text-primary hover:bg-hairline focus-visible:outline-2 focus-visible:outline-ring"
              >
                {optionLabel(facet, o)} <X className="size-4" aria-hidden="true" />
              </button>
            ))
          )}
          <Button variant="link" size="sm" onClick={clear}>{labels.clear}</Button>
        </div>
      )}
      {count}
      {children}
    </div>
  )
}

function ChipButton({ pressed, onClick, count, children }: { pressed: boolean; onClick: () => void; count?: number; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        pressed ? "border-primary bg-primary text-white" : "border-input bg-white text-heading hover:bg-canvas"
      )}
    >
      {children}
      {count !== undefined && <span className={cn("tabular-nums", !pressed && "text-muted-foreground")}>{count}</span>}
    </button>
  )
}
