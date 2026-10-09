// Client-side list filtering for the filter-bar candidate. Every variant emits the same value,
// so the same function (or the same server query) serves all of them.

export type FilterValue = {
  query: string
  /** facet id → selected option values (OR within a facet, AND across facets) */
  filters: Record<string, string[]>
  sort: string
}

export const EMPTY_FILTER: FilterValue = { query: "", filters: {}, sort: "" }

export function activeFilterCount(v: FilterValue) {
  return Object.values(v.filters).reduce((n, xs) => n + xs.length, 0)
}

/** Lower-case, strip accents, so "Café" matches "cafe". */
export const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

export function applyFilters<T>(
  items: T[],
  v: FilterValue,
  opts: {
    search: (item: T) => string
    facet: (item: T, facetId: string) => string | string[]
    sorters?: Record<string, (a: T, b: T) => number>
  }
): T[] {
  const words = fold(v.query).split(/\s+/).filter(Boolean)
  const out = items.filter((item) => {
    const hay = fold(opts.search(item))
    if (!words.every((w) => hay.includes(w))) return false
    return Object.entries(v.filters).every(([facet, selected]) => {
      if (!selected.length) return true
      const values = [opts.facet(item, facet)].flat()
      return values.some((x) => selected.includes(x))
    })
  })
  const sorter = opts.sorters?.[v.sort]
  return sorter ? [...out].sort(sorter) : out
}

/** Count per option given the other facets’ selections, so chips can show “Fiction 12”. */
export function facetCounts<T>(items: T[], v: FilterValue, facetId: string, opts: Parameters<typeof applyFilters<T>>[2]) {
  const without = { ...v, filters: { ...v.filters, [facetId]: [] } }
  const counts: Record<string, number> = {}
  for (const item of applyFilters(items, without, opts)) for (const x of [opts.facet(item, facetId)].flat()) counts[x] = (counts[x] ?? 0) + 1
  return counts
}
