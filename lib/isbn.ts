// ISBN-10 / ISBN-13 checksum, for the library scan field. Hyphens and spaces are ignored.
export function normalizeIsbn(raw: string) {
  return raw.replace(/[\s-]/g, "").toUpperCase()
}

export function isValidIsbn(raw: string): boolean {
  const s = normalizeIsbn(raw)
  if (/^\d{13}$/.test(s)) {
    const sum = [...s].reduce((acc, d, i) => acc + Number(d) * (i % 2 ? 3 : 1), 0)
    return sum % 10 === 0
  }
  if (/^\d{9}[\dX]$/.test(s)) {
    const sum = [...s].reduce((acc, d, i) => acc + (d === "X" ? 10 : Number(d)) * (10 - i), 0)
    return sum % 11 === 0
  }
  return false
}
