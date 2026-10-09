"use client"

import { Search } from "lucide-react"

/** IT-2023 › Lookup pattern. Pill with the round green search button. */
export function SearchPill({
  label,
  placeholder,
  name = "q",
  onSearch,
}: {
  /** Visually hidden, read by screen readers. Never rely on the placeholder. */
  label: string
  placeholder?: string
  name?: string
  onSearch: (value: string) => void
}) {
  return (
    <form
      role="search"
      className="flex h-16 w-full items-center gap-2 rounded-full border border-hairline bg-white py-2 pr-2 pl-6 shadow-float focus-within:ring-2 focus-within:ring-primary"
      onSubmit={(e) => {
        e.preventDefault()
        onSearch(String(new FormData(e.currentTarget).get(name) ?? "").trim())
      }}
    >
      <input
        name={name}
        aria-label={label}
        placeholder={placeholder}
        autoComplete="off"
        className="h-full min-w-0 flex-1 bg-transparent text-base text-heading outline-none placeholder:text-muted-foreground focus-visible:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-white transition-[scale,background-color] duration-160 ease-out hover:bg-secondary-hover active:scale-97 active:duration-100"
      >
        <Search className="size-5" aria-hidden="true" />
      </button>
    </form>
  )
}
