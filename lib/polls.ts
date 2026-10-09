// Every poll on /docs. The API only accepts ids and options listed here.
// X-style: max 4 options, one vote per browser.

/** Candidate groups on /docs/components/reusable (our own variants). */
const CANDIDATES = {
  "async-button": ["a", "b", "c", "d"],
  "text-field": ["a", "b", "c", "d"],
  "date-field": ["a", "b", "c"],
  "photo-upload": ["a", "b", "c"],
  rating: ["a", "b", "c", "d"],
  // Domain candidates
  "attendance-mark": ["a", "b", "c", "d"],
  "quick-exit": ["a", "b", "c"],
  "anonymity-choice": ["a", "b", "c"],
  "case-code": ["a", "b", "c"],
  "loan-row": ["a", "b", "c"],
  "scan-field": ["a", "b", "c"],
  "status-tracker": ["a", "b", "c"],
  // App foundations and data
  "app-nav": ["a", "b", "c"],
  "sign-in": ["a", "b", "c"],
  "password-field": ["a", "b", "c"],
  "phone-input": ["a", "b", "c"],
  "stat-card": ["a", "b", "c"],
  "filter-bar": ["a", "b", "c"],
  notifications: ["a", "b", "c"],
} as const satisfies Record<string, readonly string[]>

/** Head-to-heads: shadcn, iconiq, or a merge of both (shadcn structure + iconiq motion). Poll id `vs-<name>`. */
export const VERSUS = [
  "switch", "checkbox", "tabs", "select", "slider", "tooltip", "accordion", "dialog",
  "input", "combobox", "command", "input-otp", "radio-group", "toggle-group", "button-group",
  "calendar", "popover", "hover-card", "dropdown", "context-menu", "alert-dialog", "drawer",
  "badge", "avatar", "breadcrumb", "progress", "spinner", "skeleton", "collapsible", "carousel",
] as const

/** iconiq components shadcn doesn't have. Poll id `iq-<name>`: keep it in the template or not. */
export const ICONIQ_ONLY = [
  "autocomplete", "file-upload", "flux-button", "rating", "date-picker", "wheel-picker",
  "week-calendar", "setup-checklist", "status-dot", "feedback", "banner", "code-block",
  "checkbox-group", "color-picker", "timezone", "file-tree", "icon-bar", "team-invitation",
] as const

export type PollId =
  | keyof typeof CANDIDATES
  | `vs-${(typeof VERSUS)[number]}`
  | `iq-${(typeof ICONIQ_ONLY)[number]}`

export function optionsFor(poll: string): readonly string[] | undefined {
  if (Object.hasOwn(CANDIDATES, poll)) return CANDIDATES[poll as keyof typeof CANDIDATES]
  if (poll.startsWith("vs-") && (VERSUS as readonly string[]).includes(poll.slice(3))) return ["shadcn", "iconiq", "merge"]
  if (poll.startsWith("iq-") && (ICONIQ_ONLY as readonly string[]).includes(poll.slice(3))) return ["keep", "skip"]
}

/** Shape of data/polls.json */
export type PollStore = {
  tallies: Record<string, Record<string, number>>
  voters: Record<string, Record<string, string>>
}

/** What GET/POST return: counts plus this browser's own votes. */
export type PollState = {
  tallies: PollStore["tallies"]
  mine: Record<string, string>
}

export const isVote = (poll: unknown, option: unknown): poll is PollId =>
  typeof poll === "string" && typeof option === "string" && (optionsFor(poll)?.includes(option) ?? false)
