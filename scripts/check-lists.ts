// Run: bun scripts/check-lists.ts — feed grouping/relative time and list filtering.
import assert from "node:assert/strict"
import { dayGroup, relativeTime } from "../lib/time"
import { activeFilterCount, applyFilters, facetCounts, type FilterValue } from "../lib/filter"

const now = new Date("2026-10-10T15:00:00")
assert.equal(dayGroup("2026-10-10T08:00:00", now), "today")
assert.equal(dayGroup("2026-10-09T23:59:00", now), "yesterday")
assert.equal(dayGroup("2026-10-01T10:00:00", now), "earlier")
assert.equal(relativeTime("2026-10-10T14:59:40", now), "now")
assert.equal(relativeTime("2026-10-10T14:55:00", now), "5 min. ago")
assert.equal(relativeTime("2026-10-10T12:00:00", now), "3 hr. ago")
assert.equal(relativeTime("2026-10-09T09:00:00", now), "yesterday")
assert.equal(relativeTime("2026-10-01T10:00:00", now), "Oct 1")

type Book = { title: string; author: string; genre: string; available: boolean; year: number }
const books: Book[] = [
  { title: "Laskar Pelangi", author: "Andrea Hirata", genre: "Fiction", available: true, year: 2005 },
  { title: "Bumi Manusia", author: "Pramoedya Ananta Toer", genre: "Fiction", available: false, year: 1980 },
  { title: "Cosmos", author: "Carl Sagan", genre: "Science", available: true, year: 1980 },
  { title: "Café Society", author: "Émile Zola", genre: "History", available: true, year: 1990 },
]
const opts = {
  search: (b: Book) => `${b.title} ${b.author}`,
  facet: (b: Book, f: string) => (f === "genre" ? b.genre : b.available ? "available" : "on-loan"),
  sorters: { newest: (a: Book, b: Book) => b.year - a.year },
}
const v = (p: Partial<FilterValue>): FilterValue => ({ query: "", filters: {}, sort: "", ...p })
assert.equal(applyFilters(books, v({ query: "cafe" }), opts).length, 1) // accent-folded
assert.equal(applyFilters(books, v({ query: "carl cosmos" }), opts).length, 1) // all words
assert.equal(applyFilters(books, v({ filters: { genre: ["Fiction", "Science"] } }), opts).length, 3) // OR within
assert.equal(applyFilters(books, v({ filters: { genre: ["Fiction"], availability: ["available"] } }), opts).length, 1) // AND across
assert.equal(applyFilters(books, v({ sort: "newest" }), opts)[0].title, "Laskar Pelangi")
assert.deepEqual(facetCounts(books, v({ filters: { genre: ["Fiction"] } }), "genre", opts), { Fiction: 2, Science: 1, History: 1 })
assert.equal(activeFilterCount(v({ filters: { genre: ["Fiction"], availability: ["available", "on-loan"] } })), 3)
console.log("lists: ok")
