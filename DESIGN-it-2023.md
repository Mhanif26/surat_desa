---
version: 5.3
name: IT-2023-design-system
description: A calm, friendly design language and Next.js starter for content-first web apps. Navy is the primary that does the everyday work; a leaf green secondary marks the one action that matters on a screen and always stands alone on white. Pages are mostly white with cool greys mixed from the navy hue. Five semantic tones (neutral, info, warning, success, error) each carry a Lucide icon so meaning never relies on color alone. Corners follow an 8 / 14 / 20 / pill scale. Plus Jakarta Sans sets everything; Lora is a rare serif break. Type is in rem so it grows with the reader's text-size setting. Motion is short, ease-out and interruptible; it confirms what the person did and never makes them wait. 18px body, 44px+ targets, strong field borders, sentence case.
changelog:
  - v5.3 (2026-10-10): candidates made production-ready. Every candidate is controlled or uncontrolled (`value` / `defaultValue` / `onValueChange`), posts with plain forms via `name`, takes `labels` for translation and `className`, reports outcomes through callbacks instead of its own toasts, and has keyboard and screen-reader support. Logic lives in tested modules (`lib/password`, `lib/phone`, `lib/date-parts`, `lib/time`, `lib/filter`, `lib/image`; `bun run check`). Seven new candidates: app navigation, sign in, new password, phone number, stat card, filter bar, notifications. Each group on the reusable page now names a recommended option, says when to pick another, and shows usage. The date wheel uses the iconiq 3D barrel picker.
  - v5.2 (2026-10-10): iconiq restyled to the tokens by `scripts/restyle-iconiq.ts` (colors, rem type, radii, 48px fields, contrast); every iconiq demo interaction-tested and fixed. Head-to-heads gain a third option, Merge, with 11 merged components in `components/merged`. Seven domain candidates: attendance marking, quick exit, anonymity choice, case code receipt, loan row, scan field, status tracker. Floating-label overlap fixed.
  - v5.1 (2026-10-10): component batch 2. 23 more shadcn components restyled to the tokens (textarea, input group, one-time code, combobox, command, calendar, popover, hover card, toggle group, button group, kbd, empty, spinner, avatar, breadcrumb, pagination, alert dialog, sheet, separator, scroll area, context menu, carousel, collapsible). 40 more iconiq components, a full iconiq coverage page at /docs/iconiq, 30 shadcn-vs-iconiq head-to-heads and 18 keep/skip polls for iconiq-only components. Helpers ClientOnly and WhenVisible. No token changes.
  - v5 (2026-10-09): generalized. The system is no longer tied to one product; it's a reusable design language plus a Next.js 16 + shadcn/ui template. Domain statuses became five semantic tones, product patterns became general patterns (multi-step form, lookup, work queue), writing guidance and examples are product-neutral, the letter typeface was dropped. Added "Using this template", component sourcing rules (shadcn vs iconiq vs candidates), and the voting workflow. No color, radius or motion token changes.
  - v4 (2026-10-09): motion and feedback pass (Apple fluid interfaces, Emil Kowalski). Motion tokens, never-animate list, enter/exit rules, loading and upload states, toast rules, one material, hover gated to mouse, type in rem with size-specific tracking.
  - v3.1 (2026-10-09): Lora as the break font, Lucide as the only icon set, Iconography and Accessibility sections.
  - v3 (2026-10-06): friendly pass. Rounded corners, navy + leaf-green, white read-only fields, Plus Jakarta Sans, step cards.
  - v2 / v1 (2026-10-06): readability pass; first draft.

colors:
  primary: "#172146"
  primary-hover: "#222d57"
  primary-active: "#0e1530"
  primary-soft: "#e9ecf5"
  on-primary: "#ffffff"
  secondary: "#2b6032"
  secondary-hover: "#22502a"
  secondary-soft: "#eaf3eb"
  on-secondary: "#ffffff"
  heading: "#172146"
  body: "#3b4054"
  muted: "#5f6578"
  disabled-text: "#9a9fb0"
  background: "#ffffff"
  canvas: "#f6f7f9"
  surface-strong: "#eef0f4"
  input-border: "#80869a"
  hairline: "#dfe1e8"
  focus-ring: "#172146"
  tone-neutral: { fill: "#eef0f4", text: "#3b4054", icon: circle-dashed }
  tone-info: { solid: "#5aaea8", fill: "#e2f1f0", text: "#24625e", icon: info }
  tone-warning: { solid: "#c99d3f", fill: "#f6ecd8", text: "#6e4f15", icon: triangle-alert }
  tone-success: { solid: "#2b6032", fill: "#eaf3eb", text: "#2b6032", icon: circle-check }
  tone-error: { solid: "#c13515", fill: "#fdecea", text: "#c13515", icon: circle-x }

typography:
  root: "html font-size stays at the browser default (100%); every size is rem"
  primary: { family: "'Plus Jakarta Sans', system-ui, sans-serif", weights: [400, 500, 600, 700], role: everything }
  secondary: { family: "'Lora', Georgia, serif", weights: [400, 500], styles: [normal, italic], role: "break font, at most once per screen" }
  scale:
    hint: { class: text-xs, size: 0.875rem, lineHeight: 1.5, tracking: 0.005em, note: minimum }
    small: { class: text-sm, size: 1rem, lineHeight: 1.5, note: dense tools and tables }
    body: { class: text-base, size: 1.125rem, lineHeight: 1.6, note: default }
    item-title: { class: text-lg, size: 1.125rem, lineHeight: 1.4, weight: 600 }
    quote: { class: text-xl, size: 1.375rem, lineHeight: 1.5 }
    section-title: { class: text-2xl, size: 1.5rem, lineHeight: 1.3, weight: 600, tracking: -0.01em }
    page-title: { class: text-3xl, size: 2rem, lineHeight: 1.2, weight: 700, tracking: -0.015em }
    number: { class: text-4xl, size: 2.5rem, lineHeight: 1.1, weight: 700, tracking: -0.02em, tabular: true }

icons: { library: "lucide-react", stroke: 2, color: currentColor, sizes: { tag: 16, inline: 20, button: 20, standalone: 24, empty-state: 32 }, fill: never }

rounded: { sm: 4px, md: 6px, lg: 8px, xl: 14px, 2xl: 20px, full: 9999px }
shadow: { float: "0 0 0 1px rgb(0 0 0 / 0.02), 0 2px 6px rgb(0 0 0 / 0.04), 0 4px 8px rgb(0 0 0 / 0.1)" }
material: { bar: { bg: "rgb(255 255 255 / 0.82)", blur: "blur(20px) saturate(180%)", use: "sticky top bar and bottom action bar only" } }

motion:
  ease-out: "cubic-bezier(0.23, 1, 0.32, 1)"
  ease-in-out: "cubic-bezier(0.77, 0, 0.175, 1)"
  ease-drawer: "cubic-bezier(0.32, 0.72, 0, 1)"
  duration: { press: 100ms, release: 160ms, color: 150ms, tooltip: 150ms, menu: 200ms, dialog: 250ms, sheet: 300ms, reveal: 500ms }
  press-scale: 0.97
  properties: [transform, opacity]

spacing: [4, 8, 12, 16, 24, 32, 48]
section-gap: 64px–80px
max-width: { page: 1200px, form: 640px, prose: 68ch }
---

# IT-2023 Design System

**Version 5** · A design language and a Next.js starter. Tokens are in the front matter; this page explains how to use them. The live docs run at `/docs` in this repo.

**Contents:** [Using this template](#using-this-template) · [Overview](#overview) · [Principles](#principles) · [Colors](#colors) · [Typography](#typography) · [Iconography](#iconography) · [Semantic tones](#semantic-tones) · [Layout & shape](#layout--shape) · [Motion](#motion) · [Feedback & loading](#feedback--loading) · [Components](#components) · [Choosing a component source](#choosing-a-component-source) · [Patterns](#patterns) · [Writing](#writing) · [Accessibility](#accessibility) · [Keeping it from looking generated](#keeping-it-from-looking-generated) · [Iteration guide](#iteration-guide) · [Known gaps](#known-gaps) · [References](#references)

## Using this template

### Stack
Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · shadcn/ui (Radix base) · Lucide · Sonner · Vaul · Bun.

```bash
bun install
bun dev            # http://localhost:3000 → redirects to /docs
bun run lint && bunx tsc --noEmit && bun run build
```

### Where things live
| Path | What it is |
|---|---|
| `app/globals.css` | Every token: colors, radius, shadow, type scale, motion curves, the sticky-bar material, hover gating, reduced-motion / transparency / contrast handling |
| `app/layout.tsx` | Fonts (`next/font`), `<html lang>`, `TooltipProvider`, `Toaster` |
| `components/ui/*` | shadcn primitives, already restyled to these tokens. Owned code: edit freely |
| `components/*.tsx` | System components shadcn doesn't have: `StatusTag`, `FormField`, `UploadField`, `OptionTiles`, `Chips`, `FilterChip`, `StepCard`, `SummaryCard`, `SearchPill`, `ResponsiveDialog`, `SuccessBand` |
| `components/candidates/*` | Components still being voted on. Each has one `variant` prop per option |
| `components/iconiq/*` | 48 iconiq components, restyled to the tokens by `scripts/restyle-iconiq.ts` (motion untouched) |
| `components/merged/*` | Merges: shadcn structure + tokens + iconiq-style motion, competing in head-to-heads |
| `lib/isbn.ts` | ISBN-10/13 checksum for the library scan field (`bun scripts/check-isbn.ts`) |
| `components/client-only.tsx` | `<ClientOnly>`: render only in the browser (calendars, clocks) |
| `components/when-visible.tsx` | `<WhenVisible>`: mount when on screen (inline cmdk Command) |
| `app/docs/**` | The live documentation: getting started, components, iconiq, reusable + votes |
| `data/polls.json` | Votes from every poll; valid ids in `lib/polls.ts`, checked by `bun scripts/check-polls.ts` |

### Make it yours
1. **Brand.** Change `--primary`, `--secondary` and their `-hover / -soft` siblings in `app/globals.css`. Re-check contrast (see [Colors](#colors)): white on primary and on secondary must stay ≥ 4.5:1.
2. **Type.** Swap the fonts in `app/layout.tsx`; keep the CSS variable names (`--font-jakarta`, `--font-lora`) or update `--font-sans` / `--font-serif` in `globals.css`.
3. **Language.** Set `<html lang>` in `app/layout.tsx`. Component defaults are English; pass your own labels as props.
4. **Delete the docs** (`app/docs`, `components/candidates`, `components/iconiq`, `data/`, `app/api/polls`) once your product has its own pages, or keep them as an internal style guide.

### Adding a component
1. Check [Choosing a component source](#choosing-a-component-source).
2. shadcn: `bunx --bun shadcn@latest add <name>`. Then restyle it to the tokens: 48px controls, `rounded-lg`, `border-input` on anything you type in, `text-base`, `shadow-float` only if it floats, named transitions (never `transition-all`).
3. Document it on `/docs/components`: a preview, when to use / when not, props, and a copy-paste usage snippet.
4. With the shadcn MCP (`.mcp.json`, restart Claude Code once) an agent can browse and add registry items directly.

## Overview

The system should feel **friendly and trustworthy**: rounded, quiet, legible. It borrows Airbnb's single-accent discipline:

- **Mostly white.** About 68% white, 20% navy, 4% green, the rest grey hints and lines.
- **Navy is the primary.** Primary buttons, links, selected borders and headings.
- **Leaf green is the secondary.** It marks the one action a person came to do on that screen, always alone on white, with white text (7.4:1).
- **Greys come from navy**, so the page reads as one family.
- **Meaning has its own colors and icons.** Five tones, each with a fixed Lucide icon.
- **Soft shapes, quiet depth.** 8px controls, 14px cards, pills for tags and search. One shadow, only for things that float.
- **One working typeface, one break.** Plus Jakarta Sans does the work; Lora appears rarely.
- **Text grows with the reader.** Everything is in rem.
- **Motion confirms, it doesn't perform.**

## Principles

1. **Design for the least practiced user.** Large text, plain words, one question at a time. Experts lose nothing; everyone else gains a lot.
2. **Always show the next step.** Every screen ends with exactly one primary button whose label says what will happen.
3. **Never rely on color alone.** Status, errors and selection always carry a second signal: an icon, words, a border or a check.
4. **Never leave someone wondering.** Every press gets an instant response; anything slower than a moment shows that it's working. On a slow connection, silence looks like failure and people press again.
5. **Calm by default, dense on request.** Public screens use 18px body and 48px controls. Tools used all day may drop to 16px and 44px, never lower.

## Colors

### Tokens
| Token | Hex | Contrast | Use |
|---|---|---|---|
| primary | `#172146` | 15.6:1 on white | Primary button, headings, links, selected borders |
| primary-hover | `#222d57` | — | Hover on navy |
| primary-active | `#0e1530` | — | Pressed navy |
| primary-soft | `#e9ecf5` | 13.3:1 (navy on it) | Selected tile or chip fill, "New" badge |
| secondary | `#2b6032` | 7.4:1 (white on it) | The one conversion action |
| secondary-hover | `#22502a` | — | Hover on green |
| secondary-soft | `#eaf3eb` | 6.6:1 (green on it) | Success band |
| body | `#3b4054` | 10.3:1 on white | Paragraphs, table cells |
| muted | `#5f6578` | 5.8:1 on white | Hints, timestamps, secondary labels |
| disabled-text | `#9a9fb0` | 2.6:1 (exempt) | Disabled controls only |
| input-border | `#80869a` | 3.6:1 on white | Borders of anything you can type in or tick |
| hairline | `#dfe1e8` | n/a | Card outlines, dividers; never around a control |
| canvas | `#f6f7f9` | n/a | Band behind a group of white cards |
| surface-strong | `#eef0f4` | n/a | Soft buttons, disabled fill, neutral tag, skeletons |

In Tailwind: `bg-primary`, `text-heading`, `text-body`, `text-muted-foreground`, `border-input`, `border-hairline`, `bg-canvas`, `bg-surface-strong`, `bg-primary-soft`, `bg-secondary-soft`, `bg-status-{info|warning|success|error}-fill`, `text-status-…-text`.

### Where green goes
Green is a spotlight. Use it for the action the screen exists for: "Create account" at the end of sign-up, "Pay" on checkout, "Download" once a file is ready, the round search button on a lookup page.

- One green button per screen, on white or a light surface, with white text.
- Pair it with a text link or an outline button, never a navy fill. Navy and green are both dark (2.1:1 apart); side by side they fight.
- Never green on navy or navy on green.

## Typography

| Face | Role | Weights | Where |
|---|---|---|---|
| **Plus Jakarta Sans** | Primary | 400–700 | Every screen, every component |
| **Lora** | Break | 400, 500, italic | Rare editorial moments only |

### Sizes grow with the reader
Leave the root font size alone and write every size in rem. Check every screen at 200% text size: nothing clipped, nothing overlapping, no sideways scroll. Borders, radii and icon strokes may stay in px.

| Style | Class | Size / line | Tracking | Weight | Where |
|---|---|---|---|---|---|
| Page title | `text-3xl` | 2rem / 1.2 | −0.015em | 700 | One per page |
| Section title | `text-2xl` | 1.5rem / 1.3 | −0.01em | 600 | Section and dialog titles |
| Quote | `text-xl` | 1.375rem / 1.5 | 0 | 400 | Lora quotes |
| Item title | `text-lg` | 1.125rem / 1.4 | 0 | 600 | Card titles, field labels |
| Body | `text-base` | 1.125rem / 1.6 | 0 | 400 | Default |
| Small | `text-sm` | 1rem / 1.5 | 0 | 400 | Dense tools, tables |
| Hint | `text-xs` | 0.875rem / 1.5 | +0.005em | 400 | Hints, timestamps; never smaller |
| Number | `text-4xl` | 2.5rem / 1.1 | −0.02em | 700 | Dashboard counters, tabular figures |

Tracking changes with size: large type tighter, small type slightly open. Build hierarchy from size, weight and line height together; use 500 rather than bold for emphasis inside body text.

> The scale reuses Tailwind's size names on purpose. The `cn` helper resolves class conflicts and treats unknown `text-*` names as colors, so custom names like `text-item-title` would be silently dropped next to `text-heading`.

### Lora, the break font
A change of voice that says "this line is different". It works because it's rare.

- At most one Lora moment per screen: a hero line, a quote from a real person, or one italic phrase inside a heading.
- Never on anything you can press, type into or scan: buttons, links, fields, labels, tags, tables, navigation, numbers, toasts.
- Never on task screens, never for body paragraphs, never below 1.25rem.
- Test: set the line in Jakarta. If nothing is lost, keep it in Jakarta.

## Iconography

Lucide (`lucide-react`) only. Icons support words; they never replace them on public screens.

- Outline, stroke 2, `currentColor`. Never filled, duotone or 3D.
- 16px in tags and dense tables · 20px inline and in buttons · 24px standalone and in notices · 32px in empty states.
- 6px gap in tags, 8px in buttons.
- A leading icon only when it clarifies the action (`Download`, `Printer`). A trailing `ArrowRight` only on buttons that move forward. Most buttons need no icon.
- Icon-only buttons: dense tools only, with `aria-label`, a tooltip and a 44px hit area.
- `aria-hidden="true"` when the icon sits next to visible text. No decorative icons above headings.

## Semantic tones

Five tones carry meaning across the system. Each has a fill, a text color and a default icon.

| Tone | Default icon | Fill / text | Means |
|---|---|---|---|
| neutral | `circle-dashed` | `#eef0f4` / `#3b4054` | Nothing to do yet; waiting in line |
| info | `info` | `#e2f1f0` / `#24625e` (6.1:1) | Something is in progress, or worth knowing |
| warning | `triangle-alert` | `#f6ecd8` / `#6e4f15` (6.4:1) | Needs attention, or waiting on someone else |
| success | `circle-check` | `#eaf3eb` / `#2b6032` (6.6:1) | Done, approved, ready |
| error | `circle-x` | `#fdecea` / `#c13515` (4.9:1) | Failed, rejected, blocked |

**Map your domain states onto tones; don't invent new colors.** An order flow, for example:

| Domain state | Tone | Icon override |
|---|---|---|
| Draft | neutral | `pencil` |
| In review | info | `file-search` |
| Waiting for approval | warning | `hourglass` |
| Approved | success | — |
| Rejected | error | — |

```tsx
import { StatusTag } from "@/components/status"
import { Hourglass } from "lucide-react"

<StatusTag tone="warning" icon={Hourglass}>Waiting for approval</StatusTag>
```

Rules:
- The icon comes first and takes the tone's text color.
- Once a state has an icon, it keeps it everywhere.
- Notices (larger boxes) use the same tone at 24px. An error notice always says what went wrong and how to fix it.
- A status change the person is watching cross-fades in 150ms. It never slides or bounces.
- Never use tone colors for decoration or section backgrounds.

## Layout & shape

- 4px grid: 8 · 12 · 16 · 24 · 32 · 48; 64–80px between sections.
- Page max 1200px; forms max 640px; running text max 68ch.
- Radius: 4px checkbox · 8px (`rounded-lg`) buttons and fields · 14px (`rounded-xl`) cards, tiles, tables, notices, menus · 20px (`rounded-2xl`) bands, dialogs, sheet tops · full for search, chips, tags, avatars.
- One shadow (`shadow-float`), only on things above the page: the open step, a search bar, menus, dialogs, sheets, toasts. Everything else gets a 1px hairline.
- **One material** (`.material-bar`): sticky bars may be white at 82% with `blur(20px) saturate(180%)`. Nothing else is see-through. Solid with `prefers-reduced-transparency` or `prefers-contrast: more`.
- Design for 360px first. Side rails join the layout from 1024px.

## Motion

Motion has one job: confirm what the person just did, or show where something came from and went. Every value is a token; don't invent curves on a screen.

### Should it animate at all?
| How often | Examples | Decision |
|---|---|---|
| Many times a minute | Typing, shortcuts, filter chips, sorting, switching tabs in tools | **No animation** |
| Many times a day | Hover, focus, checkbox, choosing a tile | Color only, 150ms |
| A few times per visit | Menus, dialogs, sheets, toasts, opening a step | Standard motion |
| Once | A landing page, a "your file is ready" moment | Up to 500ms, still no bounce |

### Timing and easing
| What | Duration | Easing |
|---|---|---|
| Press / release | 100ms / 160ms | `ease-out`, scale 0.97 |
| Hover, color | 150ms | `ease` |
| Tooltip | 150ms, then instant for neighbours | `ease-out` |
| Menu, select, popover | 200ms in, 160ms out | `ease-out`, from the trigger |
| Dialog | 250ms in, 200ms out | `ease-out`, from center |
| Sheet (phones) | 300ms in, 240ms out | `ease-drawer` |
| Step / accordion opening | 250ms | `ease-out`, `grid-template-rows` |

- `ease-out` (`cubic-bezier(0.23, 1, 0.32, 1)`) for anything entering or answering a press. `ease-in-out` for moving between two places. Never `ease-in`.
- UI motion stays ≤ 300ms. No bounce or overshoot, except a sheet released from a drag.
- Nothing appears from nothing: enter from `opacity 0` + `scale(0.95)` or `translateY(8px)`, never `scale(0)`. Leave the way you came, ~20% faster.
- Menus grow out of their trigger (`transform-origin`); dialogs scale from center over a navy scrim. Phones get sheets instead of dialogs.
- Everything pressable responds on **press**: `scale(0.97)` in 100ms.
- Interruptible: CSS transitions (not keyframes) for anything a person triggers; never disable a control while it animates.
- Animate `transform` and `opacity` only. Never `width`, `height`, `top`, `margin`. Never `transition: all`.
- Hover lives behind `@media (hover: hover) and (pointer: fine)`. In this repo the Tailwind `hover:` variant already does that.
- `prefers-reduced-motion: reduce`: movement becomes a short fade or an instant change; color changes stay.

## Feedback & loading

| Kind | When | How |
|---|---|---|
| Status | Something is happening | Pending button, upload progress, skeleton |
| Completion | Something finished | Toast for small things; a success screen or `SuccessBand` for big ones |
| Warning | Something might go wrong | Warning notice before the person commits |
| Error | Something went wrong | Inline at the field, or an error notice with reason and fix |

- **Pending buttons:** spinner + "…ing" label ("Saving…"), same width, ignores presses but isn't greyed. After 10 seconds, a hint says the connection is slow and not to close the page. `<Button pending pendingLabel="Saving…">`.
- **Uploads** move through empty → uploading (progress + percent + Cancel) → done (check + name + Replace) → failed (reason + Try again). Uploads continue while the person fills in the rest of the form. Resize images on the device before sending.
- **Validation:** check on blur; once an error shows, re-check live; on submit, focus the first error.
- **Toasts** (Sonner, top center, 4s, 6s with an action) confirm what the person just did. Never for blocking errors, never for anything they must read later, never for something the screen already shows.
- **Skeletons** appear only after 300ms, shaped like the content, no shimmer.
- **Offline:** a warning notice with `wifi-off`; never throw away typed input.

## Components

Every component below is live, with props and copy-paste usage, on `/docs/components`.

| Component | File | Notes |
|---|---|---|
| Button | `components/ui/button.tsx` | Variants: default, secondary, outline, soft, ghost, link, destructive-outline. Sizes: default 48px, `staff` 44px, `sm`, `icon`. `pending` + `pendingLabel` |
| Input, Label, Checkbox, RadioGroup, Switch, Select, Slider | `components/ui/*` | 48px fields, `border-input`, 2px-equivalent navy focus |
| FormField | `components/form-field.tsx` | Label → hint → error → field; wires `id`, `aria-describedby`, `aria-invalid`; `optional`, `readOnlyReason` |
| UploadField | `components/form-field.tsx` | Four states, caller owns the upload |
| OptionTiles, Chips, FilterChip | `components/choice.tsx` | Three selection signals; chips include a free-text chip |
| StatusTag, SuccessBand | `components/status.tsx` | Tones + icons |
| Alert (notice) | `components/ui/alert.tsx` | Variants: neutral, info, warning, success, error |
| Card, band | `components/ui/card.tsx` | Band is just `rounded-2xl bg-canvas p-6` |
| StepCard, SummaryCard | `components/step-card.tsx` | Multi-step forms |
| Tabs, Table, Badge, Skeleton, Progress, Accordion | `components/ui/*` | Tabs default to the underline style |
| Dialog, Drawer, ResponsiveDialog | `components/ui/*`, `components/responsive-dialog.tsx` | Dialog ≥ 640px, sheet below |
| DropdownMenu, Tooltip, Toaster | `components/ui/*` | |
| SearchPill | `components/search-pill.tsx` | Lookup by id or name |
| Textarea, InputGroup, InputOTP, Combobox | `components/ui/*` | Batch 2. 48px, navy focus |
| Calendar (+ Popover = date picker), Command, Popover, HoverCard, AlertDialog, Sheet, ContextMenu | `components/ui/*` | Batch 2. Navy scrim, `shadow-float`, 14/20px radius |
| ToggleGroup, ButtonGroup, Kbd, Empty, Spinner, Avatar, Breadcrumb, Pagination, Separator, ScrollArea, Collapsible, Carousel | `components/ui/*` | Batch 2. Pressed toggles use the selection style |

### Buttons
One primary per screen, labelled with the verb that will happen ("Save changes", not "Submit"). Navy by default; green when it's the screen's conversion action.

| Variant | Use |
|---|---|
| default (navy) | The next step |
| secondary (green) | The one action the person came to do |
| outline | Back, cancel, a safe alternative |
| soft | Small inline actions ("Edit") |
| link | Leaving the task for a moment |
| destructive-outline | Delete or reject; always confirms in a dialog |

### Form fields
Label, hint, error, field. 48px, 8px corners, 1px `input-border`. Focus: navy ring; error: red ring + message under the label starting with `circle-alert`. Mark optional fields "(optional)", don't star required ones. Never use the placeholder as a label. Read-only fields stay white; the hint with a `lock` icon says why.

### Choices
Tiles for options that need a sentence each; chips for common short answers plus free text; a searchable list beyond eight options. Selection = 2px navy border + soft fill + check. Selecting changes color in 150ms; it doesn't move.

### Cards and bands
White cards with a hairline and 14px corners, grouped on a 20px `canvas` band. Never nest cards.

### Menus, dialogs, sheets
| | Menu | Dialog | Sheet |
|---|---|---|---|
| Where | Anchored to its button | Center | Bottom of a phone screen |
| Enter | scale 0.96 + fade, 200ms | scale 0.95 + fade, 250ms | translateY(100%) → 0, 300ms |
| Scrim | None | Navy 40% | Navy 40% |
| Closes on | Escape, outside press, choosing | Escape, Cancel, scrim (unless it holds input) | Escape, drag, flick, scrim |
| Focus | Back to the button | Trapped, back to trigger | Trapped, back to trigger |

## Choosing a component source

There are three places a component can come from. Decide in this order:

1. **shadcn/ui (default).** Accessible Radix primitives, plain Tailwind, easy to restyle. If shadcn has it, start here.
2. **iconiq** ([iconiqui.com](https://iconiqui.com)). shadcn-compatible registry with spring motion (via `motion`) and components shadcn lacks: async button, file upload, rating, date / wheel picker, autocomplete, setup checklist, status dot. Install with `bunx --bun shadcn@latest add https://iconiqui.com/r/<name>.json --path components/iconiq`.
3. **Candidates** (`components/candidates/*`). Our own versions modelled on patterns trending on Mobbin, built directly in these tokens, when neither library fits.

When shadcn and iconiq both have a component, the team votes on `/docs/components/reusable` between three options: shadcn, iconiq, or a **merge**, a new component in `components/merged` that keeps shadcn's Radix structure and our tokens and adds iconiq-style motion within the IT-2023 motion rules (critically damped springs, transform/opacity only, reduced-motion fades). Trade-offs to weigh:

| | shadcn | iconiq |
|---|---|---|
| Motion | CSS transitions / keyframes, tuned to our tokens | Spring physics (`motion`), richer, ~35 KB extra JS once |
| Styling | Already on our tokens | Restyled by script: colors, type, radii, field heights, contrast |
| API | Radix compound parts | Often a single component with `label` / `description` props |
| Reduced motion | Our global CSS rule | Handled inside each component |
| Upkeep | Huge community | Smaller, one maintainer |

iconiq components live in `components/iconiq/` so they never overwrite shadcn files. The full map (every iconiq component, its shadcn equivalent and what the template does with it) is on `/docs/iconiq`.

Installing iconiq, the gotchas:
- Some registry items list subpath dependencies (`@base-ui/react/button`) that bun can't resolve. Install the real packages (`@base-ui/react`, `@radix-ui/react-*`, `date-fns`, `embla-carousel-react`) and write the file from `https://iconiqui.com/r/<name>.json`.
- `input-otp`: `OTPFieldPreview` is `OTPField` in `@base-ui/react` ≥ 1.9.
- `date-picker` imports `@/components/ui/calendar`; point it at `@/components/iconiq/calendar`.
- `checkbox-group` defaulted `value = []`, a new array every render that re-fired its sync effect forever when uncontrolled. Patched locally with a stable constant.
- Calendar, date picker, week calendar and timezone read the clock while rendering: wrap them in `<ClientOnly>`.
- Pass stable props (hoisted arrays and functions) to iconiq components; some re-sync on every new reference.
- `SelectValue` shows the raw value unless given `(value) => label`; `Combobox` is controlled-only.
- After installing or updating any iconiq file, run `bun scripts/restyle-iconiq.ts` (idempotent). It also adds the missing checkbox role to `checkbox-group` rows.

### Voting and promotion
1. There are three kinds of X-style poll (one vote per browser, max four options): candidate groups (`a`–`d`), head-to-heads (`vs-<name>`: shadcn, iconiq or merge) and iconiq-only components (`iq-<name>`: keep or skip). Votes are stored in `data/polls.json` by `app/api/polls/route.ts`; valid poll ids live in `lib/polls.ts`.
2. To decide: read the tallies in `data/polls.json`.
3. To promote a **candidate**: keep the winning `variant` branch, delete the others and the `variant` prop, move the file from `components/candidates/` to `components/`, document it on `/docs/components`, remove its poll from `lib/polls.ts` and the reusable page.
4. To settle a **head-to-head**: delete the losing files. If **merge** wins, move it from `components/merged` into `components/ui` (build it first if it's only a plan). If iconiq wins, it's already token-styled; clean it up for lint and remove leftover `dark:` values before product use.
5. The JSON store works for `bun dev` and a single `next start` process. Serverless hosts have read-only disks: move votes to a database or KV before deploying the docs.

### Candidate conventions

A candidate is held to the same bar as a shipped component, so the winner can be promoted without a rewrite:

- **State:** `value` / `defaultValue` / `onValueChange` where it holds a value (Radix `useControllableState`).
- **Forms:** `name` renders hidden inputs, so a plain `<form>` or a server action receives the value. Dates submit `YYYY-MM-DD`, phones E.164.
- **Words:** every string comes from an exported `*_LABELS` object; pass `labels` to translate or reword.
- **Outcomes:** async actions are callbacks that return a promise. The component shows pending and error states; the page decides on toasts and Undo.
- **Errors:** checked on blur, written as what to do next, linked with `aria-describedby`, `aria-invalid` on the field.
- **Logic** that can be wrong (dates, phones, passwords, filtering, ISBNs) lives in `lib/` with a check in `scripts/` run by `bun run check`. Validate again on the server.
- **Recommended:** each group on the reusable page names one pick and says when another fits better. Votes can overrule it.

## Domain candidates

Patterns that specific kinds of product need, built as candidates on `/docs/components/reusable` with Mobbin references:

| Domain | Candidate | Why it matters |
|---|---|---|
| App foundations | App navigation (sidebar / top tabs / bottom bar) | One items array drives every layout |
| App foundations | Sign in (email + password / email first / magic link) | Server errors in plain words, password-manager friendly |
| App foundations | New password (checklist / meter / chips), deny-list | Rules visible before typing |
| App foundations | Phone number (split / inline / stacked), E.164 out | One format for every SMS provider |
| Data & activity | Stat card (delta / sparkline / explained) | Green means better, not up |
| Data & activity | Filter bar (toolbar / sidebar / chips), `lib/filter` | Search, facets and sort in one value |
| Data & activity | Notifications (grouped / cards / compact) | What changed since you last looked |
| School attendance | Attendance marking (inline / cycle / menu / exceptions) | 30 students every morning, one-handed |
| Anonymous reporting | Quick exit (bar / floating / link, Shift ×3, history replaced) | The page must vanish if someone walks in |
| Anonymous reporting | Anonymity choice (switch / checkbox / tiles) | Says plainly what each choice means |
| Anonymous reporting | Case code receipt (number / three words / save) | The only way back to a nameless report |
| Library | Loan row (cover row / loan card / desk table) | Due and overdue at a glance, Renew, Check in |
| Library | Scan field (scanner-ready / camera / tabs), ISBN checksum | USB scanners type + Enter; phones use the camera |
| Village letter service | Status tracker (timeline / current step open / stepper) | "Where is my letter?" without calling the office |

## Patterns

**Multi-step form** (sign-up, checkout, onboarding, any long form).
- All steps visible from the start as `StepCard`s. Done steps collapse to one line with a check, a summary and "Edit"; the open step floats; upcoming steps are muted. Opening a step expands it in 250ms.
- A `SummaryCard` beside the steps from 1024px, under them on phones.
- The final button uses the pending state. Success is a full screen, not a toast, when it carries something the person must keep (an order number, a reference).

**Lookup** (track an order, find a record by id).
- A `SearchPill` with the round green search button.
- The result shows a `StatusTag`, a short timeline (staggered 40ms), and a notice when there's something to do.
- When the thing is ready, a `SuccessBand` with the green action.

**Work queue** (admin lists, inboxes, moderation).
- Denser: 16px text, 44px buttons.
- `FilterChip`s with counts, search on the right. Unopened rows get a soft "New" badge.
- Rows: mono id, name, type, time, short status tag.
- **No motion** on filtering, sorting, searching or selecting. People do this hundreds of times a day.

## Writing

Write the way a helpful person at a front desk talks: direct, short, sentence case, real names for real things. If something went wrong, say what to do next.

| | Write | Not |
|---|---|---|
| Status | In review | PROCESSING |
| Field error | Phone number needs 10–13 digits. You've typed 8. | Invalid input. |
| Upload error | The photo is too blurry. Retake it somewhere brighter. | Upload failed (error 422). |
| Main button | Save changes | Submit |
| Pending button | Saving… | Loading… |
| Rejection | Rejected because the invoice is missing. Attach it and send again. | Request rejected. |
| Connection lost | You're offline. Your answers are safe; we'll send them when you're back. | Network error. |
| Empty state | No orders yet today. | No data. |

Localize by passing labels as props; keep the same tone in every language.

## Accessibility

- Text ≥ 4.5:1; control borders ≥ 3:1. Recompute when a color changes.
- Body 18px public, 16px dense, never below 14px, all in rem; works at 200% text size.
- Targets ≥ 44 × 44px; 48px for public buttons and fields.
- Visible focus on every interactive element (2px navy, 2px offset). Focus moves into dialogs and sheets and returns to the trigger.
- Status, errors and selection never rely on color alone.
- Decorative icons `aria-hidden`; icon-only buttons have `aria-label`.
- Errors are announced (`aria-live="polite"`) and linked with `aria-describedby`. Pending buttons set `aria-busy`. Upload progress announced at 25% steps.
- `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast: more` are handled in `globals.css`.
- Hover effects only for mouse pointers.
- `<html lang>` matches the content language.

## Keeping it from looking generated

- No eyebrow pill above every heading, no "01 / 14" counters.
- No rows of identical icon-topped cards to fill space. Show the real screen or a table.
- No gradients, glow, emoji, 3D objects or glass cards.
- No serif headings everywhere; Lora is a break.
- No bounce, wobble, confetti or animated numbers.
- No marketing CTAs inside docs or tools.
- No generic copy: avoid triads ("fast, simple, secure"), vague benefits and filler. Use real names and numbers.
- Don't center everything. Left-align and let layouts follow the content.
- Every docs example says where it would live in a product.

## Iteration guide

1. Bump `version` and add a `changelog` line: minor for docs-only changes, major when tokens or components change.
2. Change tokens in `app/globals.css` and the front matter together.
3. Recompute the contrast table when a color changes.
4. Update `/docs/components` in the same change as the component.
5. Review new motion the next day and at 4× slower (DevTools → Animations). Test press feedback and sheets on a low-end Android phone.

## Known gaps

- **Only a light theme.** `dark:` is bound to a `.dark` class so OS dark mode can't tint fields; design a real dark palette before setting it.
- **Menus and dialogs use keyframe animations** (shadcn's `tw-animate-css`), so they don't reverse smoothly when interrupted. Move them to transitions or `motion` if that matters.
- **iconiq motion is iconiq's.** The restyle covers color, type, shape and contrast; a few iconiq springs still overshoot slightly, which IT-2023 otherwise avoids. Merges follow the rules exactly.
- **19 merges are plans, not code yet.** They're built in the order the merge votes come in.
- **Votes live in a JSON file**; fine locally, not on serverless hosts.
- **No i18n layer.** Component defaults are English; pass labels as props.
- **No phone navigation for the docs sidebar** below 1024px; the page scrolls instead.
- **An inline cmdk `Command` below the fold scrolls the page on mount** (it scrolls its first item into view). Use `CommandDialog`, or wrap it in `<WhenVisible>`.
- **Batch 3 is not installed yet:** iconiq's expressive pieces (text effects, rolling digits, testimonials, logo carousel, radial button) and AI blocks (ai-input, message, streaming text, reasoning steps, thinking indicator).

## References

- Apple, *Designing Fluid Interfaces* (WWDC 2018), *The Details of UI Typography* (WWDC 2020).
- Emil Kowalski, design-engineering notes and [Sonner](https://sonner.emilkowal.ski/).
- [GOV.UK Design System](https://design-system.service.gov.uk/): optional labels, error wording, validation timing.
- [shadcn/ui](https://ui.shadcn.com) · [iconiq](https://iconiqui.com) · [Lucide](https://lucide.dev/icons/) · [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) · [Lora](https://fonts.google.com/specimen/Lora).
- Mobbin references for each candidate are linked on `/docs/components/reusable`.
