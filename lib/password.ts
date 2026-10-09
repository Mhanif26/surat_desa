// Password rules and strength, shared by every password-field variant.
// Rules are data so a product can swap them (and their labels) without touching the component.

export type PasswordRule = { id: string; label: string; test: (password: string) => boolean }

export const DEFAULT_RULES: PasswordRule[] = [
  { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { id: "case", label: "Upper and lower case letters", test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { id: "number", label: "At least one number", test: (p) => /\d/.test(p) },
  { id: "symbol", label: "At least one symbol", test: (p) => /[^A-Za-z0-9\s]/.test(p) },
]

// ponytail: tiny deny-list; swap for a breach check (e.g. HIBP k-anonymity API) on the server
const COMMON = new Set(["password", "password1", "12345678", "123456789", "qwerty123", "iloveyou", "admin123", "letmein1"])

export type Strength = 0 | 1 | 2 | 3 | 4
export const STRENGTH_LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"] as const

export function checkPassword(password: string, rules: PasswordRule[] = DEFAULT_RULES) {
  const passed = rules.filter((r) => r.test(password)).map((r) => r.id)
  const common = COMMON.has(password.toLowerCase())
  let score = common || !password ? 0 : passed.length
  if (!common && password.length >= 14 && score >= 3) score += 1 // length beats symbol soup
  const strength = Math.max(0, Math.min(4, score)) as Strength
  return { passed, valid: !common && passed.length === rules.length, strength, common }
}
