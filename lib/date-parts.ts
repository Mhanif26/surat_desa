// Day / month / year parts → ISO date, rejecting impossible dates (31 February) and the future.

export function partsToIso(day: number, month: number, year: number, today = new Date()): string {
  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return ""
  if (year < 1900) return ""
  const date = new Date(Date.UTC(year, month - 1, day))
  const real = date.getUTCDate() === day && date.getUTCMonth() === month - 1 && date.getUTCFullYear() === year
  if (!real) return ""
  const iso = date.toISOString().slice(0, 10)
  return iso > today.toISOString().slice(0, 10) ? "" : iso
}

/** Why a typed date is wrong, in words people can act on. Empty string when it's fine or incomplete. */
export function dateProblem(day: string, month: string, year: string, today = new Date()): string {
  if (!day || !month || year.length < 4) return ""
  const d = Number(day), m = Number(month), y = Number(year)
  if (m < 1 || m > 12) return "Month must be between 1 and 12."
  if (d < 1 || d > 31) return "Day must be between 1 and 31."
  if (y < 1900) return "Year must be 1900 or later."
  if (!partsToIso(d, m, y, new Date("9999-12-31"))) return "That day doesn’t exist in that month."
  if (!partsToIso(d, m, y, today)) return "That date is in the future."
  return ""
}
