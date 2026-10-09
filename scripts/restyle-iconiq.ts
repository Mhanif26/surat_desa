// Run: bun scripts/restyle-iconiq.ts
// Re-themes components/iconiq/* to the IT-2023 tokens. Idempotent: it only rewrites iconiq's
// original values, so it's safe to run again after re-installing a component from the registry.
// It changes colors, type sizes, radii and shadows. Motion stays iconiq's.
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

const DIR = path.join(process.cwd(), "components", "iconiq") // run from the repo root

const T = {
  navy: "#172146", // primary, heading
  body: "#3b4054",
  muted: "#5f6578",
  inputBorder: "#80869a",
  hairline: "#dfe1e8",
  canvas: "#f6f7f9",
  surfaceStrong: "#eef0f4",
  primarySoft: "#e9ecf5",
  green: "#2b6032",
  ochre: "#c99d3f",
  teal: "#5aaea8",
  red: "#c13515",
  disabled: "#9a9fb0",
  ring: "rgba(23,33,70,0.28)",
  float: "0_0_0_1px_rgb(0_0_0/0.02),0_2px_6px_rgb(0_0_0/0.04),0_4px_8px_rgb(0_0_0/0.1)",
}

// iconiq light value → token. Applied only inside `[--name:value]` definitions that are not `dark:`.
function mapValue(name: string, value: string): string {
  const v = value.toLowerCase()
  if (v === "#e3e7ec") return /input/.test(name) ? T.inputBorder : T.hairline
  if (v === "#111111") return T.navy
  if (v === "rgba(17,17,17,0.16)") return T.ring
  const table: Record<string, string> = {
    "#6d7480": T.muted,
    "#646b75": T.muted,
    "#f5f7fa": T.canvas,
    "#f3f5f8": T.primarySoft,
    "#eceff3": T.surfaceStrong,
    "#e9edf2": T.hairline,
    "#d5dae0": T.inputBorder,
    "#fcfcfd": "#ffffff",
    "#dc2626": T.red,
    "#0ea5e9": T.navy,
    "#bae6fd": T.primarySoft,
    "#14b8a6": T.green,
    "#10b981": T.green,
    "#f59e0b": T.ochre,
    "#d1d5db": T.hairline,
    "#9ca3af": T.disabled,
    "0_18px_38px_-24px_rgba(15,23,42,0.35)": T.float,
    "0_12px_28px_-24px_rgba(15,23,42,0.18)": T.float,
  }
  // Whole value first, then colors embedded in a larger value (color-mix, gradients).
  return table[v] ?? value.replace(/#[0-9a-f]{6}(?![0-9a-f])/gi, (hex) => table[hex.toLowerCase()] ?? EMBEDDED[hex.toLowerCase()] ?? hex)
}

const EMBEDDED: Record<string, string> = { "#111111": T.navy, "#e3e7ec": T.hairline }

const CLASS_SWAPS: [RegExp, string][] = [
  // Type: everything in rem on the IT-2023 scale; 14px is the floor.
  [/\btext-\[(10|11|12|12\.5|13|14)px\]/g, "text-xs"],
  [/\btext-\[(15|16|17)px\]/g, "text-sm"],
  // Radius: 8 / 14 / 20 scale.
  [/\brounded-\[(11|12|14)px\]/g, "rounded-xl"],
  [/\brounded-\[6px\]/g, "rounded-md"],
  // Stray hard-coded palette colors.
  [/\b(bg|text|border|ring)-emerald-(500|600)\b/g, "$1-status-success-text"],
  [/\btext-neutral-900\b/g, "text-heading"],
  [/\btext-zinc-400\b/g, "text-muted-foreground"],
  // Hard-coded tone in a TS string (progress "success").
  [/#10b981/g, T.green],
]

// Targeted fixes the token swap can't reach: contrast (IT-2023: text ≥ 4.5:1, nothing faded to
// mean "not selected"), field heights (48px) and option label sizes. Exact strings, so re-runs are no-ops.
const FILE_SWAPS: Record<string, [string, string][]> = {
  "r-tabs.tsx": [
    ['"color-mix(in oklab, var(--color-foreground) 75%, transparent)"', '"var(--color-foreground)"'],
    ['"color-mix(in oklab, var(--color-foreground) 40%, transparent)"', '"var(--color-muted-foreground)"'],
  ],
  "r-radio-group.tsx": [
    ["animate={{ opacity: isSelected ? 0.85 : 0.5 }}", "animate={{ opacity: 1 }}"],
    ['className="text-muted-foreground/60 text-xs leading-snug"', 'className="text-muted-foreground text-xs leading-snug"'],
    ['className="text-xs leading-tight"\n        id={labelId}', 'className="text-base leading-tight"\n        id={labelId}'],
  ],
  "r-accordion.tsx": [
    ["opacity: isOpen ? 1 : 0.72", "opacity: 1"],
    ["text-muted-foreground/60", "text-muted-foreground"],
  ],
  "button-group.tsx": [["opacity: isSelected ? 1 : 0.72", "opacity: 1"]],
  "input.tsx": [
    ['default: "h-11",', 'default: "h-12",'],
    ["text-sm text-foreground outline-none placeholder:text-muted-foreground sm:text-sm", "text-base text-foreground outline-none placeholder:text-muted-foreground"],
    ["text-muted-foreground/70", "text-muted-foreground"],
  ],
  "combobox.tsx": [["group flex h-11 w-full items-center gap-2 border border-input bg-background px-3.5 text-base shadow-sm transition-[border-color,box-shadow] sm:text-sm", "group flex h-12 w-full items-center gap-2 border border-input bg-background px-3.5 text-base shadow-sm transition-[border-color,box-shadow]"]],
  "b-autocomplete.tsx": [
    ["group flex h-11 w-full items-center gap-1 border border-input bg-background pl-3 pr-2 text-base transition-[border-color,box-shadow] sm:text-sm", "group flex h-12 w-full items-center gap-1 border border-input bg-background pl-3 pr-2 text-base transition-[border-color,box-shadow]"],
    ["text-muted-foreground/70", "text-muted-foreground"],
  ],
  "r-select.tsx": [["flex min-h-11 w-full touch-manipulation items-center justify-between", "flex min-h-12 w-full touch-manipulation items-center justify-between"]],
  "r-dropdown.tsx": [["flex min-h-11 w-full touch-manipulation items-center justify-between", "flex min-h-12 w-full touch-manipulation items-center justify-between"]],
  "date-picker.tsx": [
    ["h-10 pr-2 pl-4", "h-12 pr-2 pl-4"],
    ["text-muted-foreground/60", "text-muted-foreground"],
  ],
  "file-upload.tsx": [["text-foreground/70", "text-muted-foreground"]],
  "checkbox-group.tsx": [
    // a11y: rows were plain buttons; screen readers couldn't tell what's ticked.
    ["disabled={disabled}\n                key={option.value}\n                onClick={() => toggle(option.value)}", "aria-checked={checked}\n                disabled={disabled}\n                key={option.value}\n                onClick={() => toggle(option.value)}\n                role=\"checkbox\""],
    ["active:bg-neutral-100", "active:bg-surface-strong"],
    ["text-muted-foreground/80 uppercase tracking-[0.16em]", "text-muted-foreground"],
  ],
}

let changed = 0
for (const file of readdirSync(DIR).filter((f) => f.endsWith(".tsx"))) {
  const p = path.join(DIR, file)
  const before = readFileSync(p, "utf8")
  let s = before.replace(/(dark:)?\[(--[a-z0-9-]+):([^\]\s]+)\]/g, (m, dark, name, value) =>
    dark ? m : `[${name}:${mapValue(name, value)}]`
  )
  for (const [re, to] of CLASS_SWAPS) s = s.replace(re, to)
  // Skip when already applied: some replacements contain their own search text.
  for (const [from, to] of FILE_SWAPS[file] ?? []) if (!s.includes(to)) s = s.split(from).join(to)
  if (s !== before) {
    writeFileSync(p, s)
    changed++
  }
}
console.log(`restyle-iconiq: ${changed} files updated`)
