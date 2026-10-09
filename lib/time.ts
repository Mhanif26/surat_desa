// Relative times and day groups for feeds (notifications, activity, status updates).

const DAY = 86_400_000
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

/** "today" | "yesterday" | "earlier" relative to `now`, by calendar day. */
export function dayGroup(iso: string, now: Date): "today" | "yesterday" | "earlier" {
  const diff = Math.round((startOfDay(now) - startOfDay(new Date(iso))) / DAY)
  return diff <= 0 ? "today" : diff === 1 ? "yesterday" : "earlier"
}

/** "just now", "5 min ago", "3 h ago", "yesterday", then a short date. Locale-aware. */
export function relativeTime(iso: string, now: Date, locale = "en") {
  const t = new Date(iso).getTime()
  const sec = Math.round((now.getTime() - t) / 1000)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "short" })
  if (sec < 45) return rtf.format(0, "second")
  if (sec < 3600) return rtf.format(-Math.round(sec / 60), "minute")
  if (sec < 6 * 3600 || dayGroup(iso, now) === "today") return rtf.format(-Math.round(sec / 3600), "hour")
  if (dayGroup(iso, now) === "yesterday") return rtf.format(-1, "day")
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(t)
}
