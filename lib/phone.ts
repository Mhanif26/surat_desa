// Phone numbers: country list, normalization to E.164, display grouping.
// ponytail: covers the countries below with simple length rules. For full global validation
// (number types, carriers) switch to libphonenumber-js; the API here stays the same.

export type Country = {
  iso: string
  name: string
  dial: string
  /** national number length range, without the trunk 0 */
  min: number
  max: number
  /** countries where people write a leading 0 that isn't part of the international number */
  trunk0: boolean
  example: string
}

export const COUNTRIES: Country[] = [
  { iso: "ID", name: "Indonesia", dial: "62", min: 9, max: 12, trunk0: true, example: "0812 3456 7890" },
  { iso: "MY", name: "Malaysia", dial: "60", min: 9, max: 10, trunk0: true, example: "012 345 6789" },
  { iso: "SG", name: "Singapore", dial: "65", min: 8, max: 8, trunk0: false, example: "8123 4567" },
  { iso: "PH", name: "Philippines", dial: "63", min: 10, max: 10, trunk0: true, example: "0917 123 4567" },
  { iso: "TH", name: "Thailand", dial: "66", min: 9, max: 9, trunk0: true, example: "081 234 5678" },
  { iso: "VN", name: "Vietnam", dial: "84", min: 9, max: 10, trunk0: true, example: "091 234 5678" },
  { iso: "AU", name: "Australia", dial: "61", min: 9, max: 9, trunk0: true, example: "0412 345 678" },
  { iso: "JP", name: "Japan", dial: "81", min: 10, max: 10, trunk0: true, example: "090 1234 5678" },
  { iso: "IN", name: "India", dial: "91", min: 10, max: 10, trunk0: true, example: "098765 43210" },
  { iso: "NL", name: "Netherlands", dial: "31", min: 9, max: 9, trunk0: true, example: "06 1234 5678" },
  { iso: "GB", name: "United Kingdom", dial: "44", min: 10, max: 10, trunk0: true, example: "07700 900123" },
  { iso: "US", name: "United States", dial: "1", min: 10, max: 10, trunk0: false, example: "(201) 555-0123" },
]

export const countryByIso = (iso: string) => COUNTRIES.find((c) => c.iso === iso) ?? COUNTRIES[0]

export type PhoneResult = { e164: string; national: string } | { error: "empty" | "too-short" | "too-long" | "wrong-country" }

/** Accepts "0812-3456-7890", "812 3456 7890", "+62 812…" or "62812…". */
export function normalizePhone(raw: string, iso: string): PhoneResult {
  const c = countryByIso(iso)
  let digits = raw.replace(/[^\d+]/g, "")
  if (!digits) return { error: "empty" }
  if (digits.startsWith("+")) {
    if (!digits.startsWith(`+${c.dial}`)) return { error: "wrong-country" }
    digits = digits.slice(c.dial.length + 1)
  } else if (digits.startsWith(`00${c.dial}`)) {
    digits = digits.slice(c.dial.length + 2)
  } else if (digits.length > c.max && digits.startsWith(c.dial)) {
    digits = digits.slice(c.dial.length)
  }
  digits = digits.replace(/\D/g, "")
  if (c.trunk0 && digits.startsWith("0")) digits = digits.slice(1)
  if (digits.length < c.min) return { error: "too-short" }
  if (digits.length > c.max) return { error: "too-long" }
  return { e164: `+${c.dial}${digits}`, national: digits }
}

/** "81234567890" → "812 3456 7890": groups of 3-4-4…, easy to read back. */
export function groupDigits(national: string) {
  const d = national.replace(/\D/g, "")
  return [d.slice(0, 3), d.slice(3, 7), d.slice(7, 11), d.slice(11)].filter(Boolean).join(" ")
}
