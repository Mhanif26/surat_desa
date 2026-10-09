import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Caption, Code, Section, Sub } from "./ui";

export const metadata: Metadata = {
  title: "Getting started",
  description: "Install, theme and extend the IT-2023 design system.",
};

const TOC = [
  ["install", "Install & run"],
  ["map", "Project map"],
  ["tokens", "Using tokens"],
  ["theme", "Make it yours"],
  ["add", "Adding a component"],
  ["vote", "Voting & promoting"],
  ["checklist", "Before you ship a screen"],
] as const;

export default function Page() {
  return (
    <div className="mx-auto flex max-w-[1200px] gap-12 px-4 sm:px-6">
      <nav aria-label="On this page" className="sticky top-16 hidden h-fit w-56 shrink-0 py-10 lg:block">
        <p className="mb-1 px-3 text-xs font-semibold text-muted-foreground">On this page</p>
        <ul>
          {TOC.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="block rounded-lg px-3 py-1.5 text-sm text-body hover:bg-canvas">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="min-w-0 flex-1 py-10 pb-32">
        <h1 className="text-3xl font-bold">Getting started</h1>
        <p className="mt-3 max-w-[68ch] text-muted-foreground">
          IT-2023 is a design language and a Next.js starter: calm, legible, mostly white, with one navy primary and one green
          accent. It sits on shadcn/ui, so every component is code you own. This page takes you from clone to your first
          screen.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/docs/components">
              Browse components <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs/components/reusable">Vote on candidates</Link>
          </Button>
        </div>

        <Section id="install" title="Install & run" description="Bun is the package manager. Node 20+ works too.">
          <Code title="terminal">{`bun install
bun dev                      # http://localhost:3000 → /docs
bun run lint && bunx tsc --noEmit && bun run build`}</Code>
          <Sub>MCP for agents</Sub>
          <p className="max-w-[68ch]">
            <code className="font-mono text-sm">.mcp.json</code> registers the shadcn MCP server. Restart Claude Code once and
            an agent can search the registry and add components directly.
          </p>
          <Code title="already done in this repo">{`bunx --bun shadcn@latest mcp init --client claude`}</Code>
        </Section>

        <Section id="map" title="Project map" description="Everything a screen needs is in four places.">
          <div className="overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-hairline">
                {[
                  ["app/globals.css", "All tokens: colors, radius, shadow, type scale, motion curves, the sticky-bar material, hover gating, reduced motion / transparency / contrast."],
                  ["app/layout.tsx", "Fonts, <html lang>, TooltipProvider, Toaster."],
                  ["components/ui/*", "shadcn primitives restyled to the tokens. You own them; edit freely."],
                  ["components/*.tsx", "System components shadcn doesn’t have: StatusTag, FormField, UploadField, OptionTiles, Chips, FilterChip, StepCard, SummaryCard, SearchPill, ResponsiveDialog, SuccessBand."],
                  ["components/candidates/*", "Components still being voted on. One variant prop per option."],
                  ["components/iconiq/*", "48 iconiq components, untouched. Mapped and demoed on the iconiq page."],
                  ["components/merged/*", "Merges: shadcn structure + tokens + iconiq-style motion (switch, checkbox, radio, segmented, slider, tabs, accordion, collapsible, progress, one-time code, dialog)."],
                  ["scripts/restyle-iconiq.ts", "Re-themes components/iconiq to the tokens. Run it after adding or updating an iconiq file."],
                  ["components/client-only.tsx · when-visible.tsx", "Render only in the browser (calendars, clocks) · mount only when on screen (inline cmdk Command)."],
                  ["app/docs/**", "This documentation."],
                  ["data/polls.json · app/api/polls", "Votes and the route that stores them. Valid poll ids in lib/polls.ts; bun scripts/check-polls.ts tests the validation."],
                  ["DESIGN-it-2023.md", "The written rules. Tokens in the front matter."],
                ].map(([path, what]) => (
                  <tr key={path} className="align-top">
                    <td className="px-4 py-3 font-mono text-xs font-semibold whitespace-nowrap text-heading">{path}</td>
                    <td className="px-4 py-3">{what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="tokens" title="Using tokens" description="Tokens are Tailwind classes. Reach for these before any raw value.">
          <Code title="a typical screen">{`<main className="mx-auto max-w-[640px] px-4 py-10">
  <h1 className="text-3xl font-bold">Billing details</h1>          {/* headings are navy by default */}
  <p className="mt-2 text-muted-foreground">Used on every invoice.</p>

  <div className="mt-8 rounded-2xl bg-canvas p-6">                  {/* band */}
    <div className="rounded-xl border border-hairline bg-white p-6">  {/* card */}
      …
    </div>
  </div>
</main>`}</Code>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            {[
              ["Text", "text-heading · text-body · text-muted-foreground"],
              ["Type scale", "text-xs (hint) · text-sm · text-base (body) · text-lg (item) · text-2xl (section) · text-3xl (page) · text-4xl (number)"],
              ["Surfaces", "bg-white · bg-canvas · bg-surface-strong · bg-primary-soft · bg-secondary-soft"],
              ["Lines", "border-input (controls) · border-hairline (cards, dividers)"],
              ["Tones", "bg-status-{info|warning|success|error}-fill · text-status-…-text"],
              ["Shape & depth", "rounded-lg (8) · rounded-xl (14) · rounded-2xl (20) · shadow-float · .material-bar"],
              ["Motion", "ease-out · duration-150 / 200 / 250 / 300 · active:scale-97"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-hairline p-4">
                <p className="text-xs font-semibold text-muted-foreground">{k}</p>
                <p className="mt-1 font-mono text-xs text-heading">{v}</p>
              </div>
            ))}
          </div>
          <Caption>
            The type scale reuses Tailwind’s names on purpose: the cn() helper drops unknown text-* names that sit next to a
            color class.
          </Caption>
        </Section>

        <Section id="theme" title="Make it yours" description="Three edits rebrand the whole system.">
          <Code title="app/globals.css">{`:root {
  --primary: #172146;      /* your primary; white on it must be ≥ 4.5:1 */
  --secondary: #2b6032;    /* your one accent; white on it ≥ 4.5:1 */
  --ring: #172146;         /* focus ring = primary */
}
@theme inline {
  --color-primary-hover: #222d57;
  --color-primary-active: #0e1530;
  --color-primary-soft: #e9ecf5;   /* selected fill */
  --color-secondary-hover: #22502a;
  --color-secondary-soft: #eaf3eb; /* success band */
}`}</Code>
          <Code title="app/layout.tsx">{`const sans = Inter({ variable: "--font-jakarta", subsets: ["latin"] })  // keep the variable name
<html lang="en">                                                         // your content language`}</Code>
          <p className="mt-4 max-w-[68ch]">
            Component defaults are English (“Cancel”, “Replace”, “Try again”). Pass your own labels as props to localize.
          </p>
        </Section>

        <Section id="add" title="Adding a component" description="Decide the source in this order. Stop at the first that fits.">
          <ol className="flex flex-col gap-3">
            {[
              ["1 · shadcn/ui", "Default. Accessible Radix primitives in plain Tailwind.", "bunx --bun shadcn@latest add switch"],
              ["2 · iconiq", "When shadcn lacks it (async button, upload, rating, date wheel, autocomplete…) or the team voted iconiq’s version. Install under components/iconiq so it never overwrites shadcn.", "bunx --bun shadcn@latest add https://iconiqui.com/r/r-switch.json --path components/iconiq"],
              ["3 · Candidate", "Neither fits: build 2–4 variants in components/candidates, modelled on trending Mobbin patterns, and put them to a vote.", "components/candidates/<name>.tsx  →  variant prop per option"],
            ].map(([title, body, cmd]) => (
              <li key={title} className="rounded-xl border border-hairline p-5">
                <p className="font-semibold text-heading">{title}</p>
                <p className="mt-1 text-sm">{body}</p>
                <code className="mt-3 block overflow-x-auto rounded-lg bg-canvas px-3 py-2 font-mono text-xs whitespace-nowrap text-heading">{cmd}</code>
              </li>
            ))}
          </ol>
          <Sub>Then restyle it to the tokens</Sub>
          <ul className="flex max-w-[68ch] list-disc flex-col gap-1.5 pl-5">
            <li>48px controls (h-12), rounded-lg, border-input on anything you type in or tick, white background.</li>
            <li>text-base for content, text-xs is the floor. Sizes in rem.</li>
            <li>Focus: a visible navy ring. Errors: status-error ring + message.</li>
            <li>Name transitions (transition-[scale,background-color]); never transition-all. Press = active:scale-97.</li>
            <li>shadow-float only if it floats. Popovers grow from their trigger.</li>
          </ul>
          <Sub>Then document it</Sub>
          <p className="max-w-[68ch]">
            Add a section to <code className="font-mono text-sm">app/docs/components/docs.tsx</code>: a live preview, a caption
            saying where it lives in a product, a usage snippet with the import, a props table and do / don’t.
          </p>
        </Section>

        <Section id="vote" title="Voting & promoting" description="How a candidate or a shadcn-vs-iconiq pair becomes the component.">
          <ol className="flex max-w-[68ch] list-decimal flex-col gap-2 pl-5">
            <li>
              Vote on <Link href="/docs/components/reusable" className="font-semibold text-primary underline underline-offset-4">Reusable · vote</Link> (candidates by domain, and shadcn / iconiq / merge head-to-heads) and on <Link href="/docs/iconiq" className="font-semibold text-primary underline underline-offset-4">iconiq</Link> (keep or skip each iconiq-only component). One vote per browser per poll.
            </li>
            <li>Read the result in data/polls.json (tallies per poll and option).</li>
            <li>
              Each group also shows <strong className="font-semibold text-heading">Our pick</strong> with the reason and when another option fits better. Without a clear vote, promote the pick.
            </li>
            <li>
              <strong className="font-semibold text-heading">Candidate won:</strong> keep the winning variant branch, delete the rest and the variant prop, move the file to components/, document it, remove its id from lib/polls.ts and its group from the reusable page.
            </li>
            <li>
              <strong className="font-semibold text-heading">iconiq-only, “skip” won:</strong> delete the file from components/iconiq and its id from ICONIQ_ONLY in lib/polls.ts.
            </li>
            <li>
              <strong className="font-semibold text-heading">Head-to-head, merge won:</strong> move the file from components/merged into components/ui (replacing the shadcn one), delete the iconiq file. If the merge isn’t built yet, build it there first.
            </li>
            <li>
              <strong className="font-semibold text-heading">Head-to-head:</strong> delete the losing file (components/ui/&lt;name&gt;.tsx or components/iconiq/r-&lt;name&gt;.tsx). If iconiq won, restyle it to the tokens before product use.
            </li>
          </ol>
          <p className="mt-6 max-w-[68ch]">
            Candidates are built to ship: <code className="font-mono text-sm">value</code> / <code className="font-mono text-sm">defaultValue</code> / <code className="font-mono text-sm">onValueChange</code>, <code className="font-mono text-sm">name</code> for plain form posts, <code className="font-mono text-sm">labels</code> for every string, and callbacks for outcomes instead of built-in toasts. Logic lives in lib/ (password, phone, date-parts, time, filter, image) and is checked by <code className="font-mono text-sm">bun run check</code>.
          </p>
          <Code title="data/polls.json">{`{
  "tallies": { "async-button": { "a": 3, "d": 5 }, "vs-switch": { "iconiq": 4, "shadcn": 2 } },
  "voters":  { "<browser id>": { "async-button": "d" } }
}`}</Code>
          <Caption>The JSON store is for local / single-server use. Move votes to a database before deploying the docs to a serverless host.</Caption>
        </Section>

        <Section id="checklist" title="Before you ship a screen" description="The review every screen passes. Details in DESIGN-it-2023.md.">
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
              "Exactly one primary button, labelled with its verb",
              "At most one green button, alone on white",
              "Text ≥ 4.5:1, control borders ≥ 3:1",
              "Works at 360px and at 200% text size",
              "Targets ≥ 44px; public buttons and fields 48px",
              "Visible focus on every control",
              "Status, errors and selection never color-only",
              "Errors say what’s wrong and how to fix it",
              "Slow actions show a pending state",
              "Motion ≤ 300ms, transform/opacity only",
              "Nothing animates on actions repeated all day",
              "At most one Lora line, never on controls",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 rounded-lg border border-hairline px-4 py-3 text-sm">
                <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </Section>
      </main>
    </div>
  );
}
