import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "cn";
import { Code, Section, Sub } from "../ui";
import { Catalog } from "./catalog";

export const metadata: Metadata = {
  title: "iconiq",
  description: "Every iconiq component compared with shadcn, with live demos of the ones shadcn doesn’t have.",
};

type Status = "Head-to-head" | "iconiq only" | "Keep ours" | "Batch 3" | "Skip";

/** Every iconiq registry component (r-/b- duplicates folded), against shadcn. */
const COVERAGE: { group: string; rows: [name: string, shadcn: string, status: Status, anchor?: string][] }[] = [
  {
    group: "Inputs & forms",
    rows: [
      ["input", "input", "Head-to-head", "vs-input"],
      ["combobox", "combobox", "Head-to-head", "vs-combobox"],
      ["autocomplete", "—", "iconiq only", "iq-autocomplete"],
      ["select", "select", "Head-to-head", "vs-select"],
      ["input-otp", "input-otp", "Head-to-head", "vs-input-otp"],
      ["checkbox", "checkbox", "Head-to-head", "vs-checkbox"],
      ["checkbox-group", "—", "iconiq only", "iq-checkbox-group"],
      ["radio-group", "radio-group", "Head-to-head", "vs-radio-group"],
      ["switch", "switch", "Head-to-head", "vs-switch"],
      ["slider", "slider", "Head-to-head", "vs-slider"],
      ["file-upload", "—", "iconiq only", "iq-file-upload"],
      ["date-picker", "calendar + popover recipe", "iconiq only", "iq-date-picker"],
      ["wheel-picker", "—", "iconiq only", "iq-wheel-picker"],
      ["color-picker", "—", "iconiq only", "iq-color-picker"],
      ["alert", "alert", "Keep ours"],
      ["theme-toggle", "—", "Skip"],
    ],
  },
  {
    group: "Buttons & actions",
    rows: [
      ["button", "button", "Keep ours"],
      ["flux-button", "—", "iconiq only", "iq-flux-button"],
      ["button-group", "button-group", "Head-to-head", "vs-button-group"],
      ["toggle-group", "toggle-group", "Head-to-head", "vs-toggle-group"],
      ["toggle", "toggle", "Batch 3"],
      ["icon-bar", "—", "iconiq only", "iq-icon-bar"],
      ["radial-button", "—", "Batch 3"],
    ],
  },
  {
    group: "Display & content",
    rows: [
      ["badge", "badge", "Head-to-head", "vs-badge"],
      ["avatar", "avatar", "Head-to-head", "vs-avatar"],
      ["calendar", "calendar", "Head-to-head", "vs-calendar"],
      ["week-calendar", "—", "iconiq only", "iq-week-calendar"],
      ["carousel", "carousel", "Head-to-head", "vs-carousel"],
      ["progress", "progress", "Head-to-head", "vs-progress"],
      ["spinner", "spinner", "Head-to-head", "vs-spinner"],
      ["skeleton", "skeleton", "Head-to-head", "vs-skeleton"],
      ["rating", "—", "iconiq only", "iq-rating"],
      ["status-dot", "—", "iconiq only", "iq-status-dot"],
      ["timezone", "—", "iconiq only", "iq-timezone"],
      ["card", "card", "Keep ours"],
      ["table", "table", "Batch 3"],
      ["charts", "chart", "Batch 3"],
      ["favicon-badge", "—", "Batch 3"],
      ["verified-badge", "—", "Batch 3"],
      ["rolling-digits", "—", "Batch 3"],
      ["marker", "marker", "Batch 3"],
    ],
  },
  {
    group: "Navigation & layout",
    rows: [
      ["tabs", "tabs", "Head-to-head", "vs-tabs"],
      ["accordion", "accordion", "Head-to-head", "vs-accordion"],
      ["collapsible", "collapsible", "Head-to-head", "vs-collapsible"],
      ["breadcrumbs", "breadcrumb", "Head-to-head", "vs-breadcrumb"],
      ["command-palette", "command", "Head-to-head", "vs-command"],
      ["file-tree", "—", "iconiq only", "iq-file-tree"],
      ["faq-pro", "accordion recipe", "Batch 3"],
      ["separator", "separator", "Batch 3"],
      ["selection-toolbar", "—", "Batch 3"],
      ["scroll-progress", "—", "Batch 3"],
    ],
  },
  {
    group: "Overlays",
    rows: [
      ["dialog", "dialog", "Head-to-head", "vs-dialog"],
      ["alert-dialog", "alert-dialog", "Head-to-head", "vs-alert-dialog"],
      ["drawer", "drawer", "Head-to-head", "vs-drawer"],
      ["popover", "popover", "Head-to-head", "vs-popover"],
      ["hover-card", "hover-card", "Head-to-head", "vs-hover-card"],
      ["dropdown", "dropdown-menu", "Head-to-head", "vs-dropdown"],
      ["context-menu", "context-menu", "Head-to-head", "vs-context-menu"],
      ["tooltip", "tooltip", "Head-to-head", "vs-tooltip"],
    ],
  },
  {
    group: "Blocks",
    rows: [
      ["banner", "—", "iconiq only", "iq-banner"],
      ["setup-checklist", "—", "iconiq only", "iq-setup-checklist"],
      ["team-invitation", "—", "iconiq only", "iq-team-invitation"],
      ["feedback", "—", "iconiq only", "iq-feedback"],
      ["code-block", "—", "iconiq only", "iq-code-block"],
      ["testimonials", "—", "Batch 3"],
      ["logo-carousel", "—", "Batch 3"],
      ["contribution-graph", "—", "Batch 3"],
      ["bento-builder", "—", "Skip"],
    ],
  },
  {
    group: "AI",
    rows: [
      ["ai-input", "—", "Batch 3"],
      ["message", "message", "Batch 3"],
      ["streaming-text", "—", "Batch 3"],
      ["reasoning-steps", "—", "Batch 3"],
      ["thinking-indicator", "—", "Batch 3"],
    ],
  },
  {
    group: "Text effects",
    rows: [
      ["text-loop · reveal-text · shimmer-text", "—", "Batch 3"],
      ["morph-texts · typewriter · dia-text · text-inertia", "—", "Batch 3"],
      ["infinite-ribbon", "—", "Batch 3"],
    ],
  },
];

const BADGE: Record<Status, string> = {
  "Head-to-head": "bg-primary text-white",
  "iconiq only": "bg-secondary text-white",
  "Keep ours": "bg-primary-soft text-primary",
  "Batch 3": "bg-surface-strong text-body",
  Skip: "bg-surface-strong text-muted-foreground",
};

export default function Page() {
  const all = COVERAGE.flatMap((g) => g.rows);
  const count = (s: Status) => all.filter((r) => r[2] === s).length;

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-10 pb-32 sm:px-6">
      <h1 className="text-3xl font-bold">iconiq</h1>
      <p className="mt-3 max-w-[68ch] text-muted-foreground">
        <a href="https://iconiqui.com" className="font-semibold text-primary underline underline-offset-4">iconiq</a> is a
        shadcn-compatible registry with spring motion (via <code className="font-mono text-sm">motion</code>). This page maps
        all of it against shadcn and shows, live, everything iconiq has that shadcn doesn’t. Every iconiq file here is restyled to
        the IT-2023 tokens by a script; the motion is iconiq’s own. Same-name components are compared
        side by side on{" "}
        <Link href="/docs/components/reusable#versus" className="font-semibold text-primary underline underline-offset-4">Reusable · vote</Link>.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["iconiq only", "Head-to-head", "Keep ours", "Batch 3", "Skip"] as Status[]).map((s) => (
          <span key={s} className={cn("inline-flex h-8 items-center gap-2 rounded-full px-3 text-xs font-semibold", BADGE[s])}>
            {s} <span className="tabular-nums opacity-80">{count(s)}</span>
          </span>
        ))}
      </div>

      <Section id="setup" title="How it’s installed here" description="Everything iconiq lives in components/iconiq, untouched, so it never overwrites shadcn files.">
        <Code title="add one component">{`bunx --bun shadcn@latest add https://iconiqui.com/r/<name>.json --path components/iconiq`}</Code>
        <Sub>Gotchas we hit, so you don’t</Sub>
        <ul className="flex max-w-[68ch] list-disc flex-col gap-1.5 pl-5">
          <li>
            Some items list subpath dependencies (<code className="font-mono text-sm">@base-ui/react/button</code>) that bun can’t
            install. Install the real packages first (<code className="font-mono text-sm">@base-ui/react</code>, the
            <code className="font-mono text-sm"> @radix-ui/react-*</code> ones, <code className="font-mono text-sm">date-fns</code>,
            <code className="font-mono text-sm"> embla-carousel-react</code>), then write the file from the registry JSON.
          </li>
          <li>
            <code className="font-mono text-sm">input-otp</code> imports <code className="font-mono text-sm">OTPFieldPreview</code>;
            in <code className="font-mono text-sm">@base-ui/react</code> 1.9 it’s <code className="font-mono text-sm">OTPField</code>.
          </li>
          <li>
            <code className="font-mono text-sm">date-picker</code> imports <code className="font-mono text-sm">@/components/ui/calendar</code>;
            point it at <code className="font-mono text-sm">@/components/iconiq/calendar</code> (iconiq’s, not shadcn’s).
          </li>
          <li>
            Calendar, date picker, week calendar and timezone read the clock while rendering. Wrap them in{" "}
            <code className="font-mono text-sm">&lt;ClientOnly&gt;</code> (components/client-only.tsx) or Next refuses to prerender the page.
          </li>
          <li>The folder is excluded from ESLint: the files trip React Compiler rules. Whatever you promote, clean up then.</li>
          <li>
            Run <code className="font-mono text-sm">bun scripts/restyle-iconiq.ts</code> after installing or updating any iconiq file. It
            maps iconiq’s colors to the tokens, puts type in rem on our scale, moves radii to 8/14/20, raises fields to 48px and
            removes faded “unselected” text. It’s idempotent; motion is left alone.
          </li>
          <li>
            Usage traps: <code className="font-mono text-sm">SelectValue</code> prints the raw value unless you pass a function that
            returns the label; <code className="font-mono text-sm">Combobox</code> is controlled-only (pass value and onChange);
            <code className="font-mono text-sm"> checkbox-group</code> rows had no checkbox role (patched by the restyle script).
          </li>
        </ul>
      </Section>

      <Section id="coverage" title="Coverage" description="Every iconiq component (Radix / Base UI duplicates folded) and what the template does with it.">
        <div className="grid gap-4 md:grid-cols-2">
          {COVERAGE.map((g) => (
            <div key={g.group} className="overflow-hidden rounded-xl border border-hairline">
              <p className="bg-canvas px-4 py-2 text-xs font-semibold text-muted-foreground">{g.group}</p>
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-hairline">
                  {g.rows.map(([name, shadcn, status, anchor]) => {
                    const href = anchor?.startsWith("vs-") ? `/docs/components/reusable#${anchor}` : anchor ? `#${anchor}` : undefined;
                    return (
                      <tr key={name}>
                        <td className="px-4 py-2.5 font-mono text-xs font-semibold text-heading">
                          {href ? (
                            <Link href={href} className="underline-offset-4 hover:underline">{name}</Link>
                          ) : (
                            name
                          )}
                        </td>
                        <td className={cn("px-2 py-2.5 font-mono text-xs", shadcn === "—" ? "text-muted-foreground" : "text-body")}>{shadcn}</td>
                        <td className="px-4 py-2.5 text-right">
                          <span className={cn("inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold whitespace-nowrap", BADGE[status])}>{status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
        <p className="mt-3 max-w-[68ch] text-xs text-muted-foreground">
          Keep ours: our restyled shadcn version already covers it (Button has variants and pending; Alert is the notice).
          Batch 3: expressive and AI pieces, next. Skip: needs something the template doesn’t have yet (a dark theme) or is a tool, not a component.
        </p>
      </Section>

      <Section id="catalog" title="iconiq only" description="Live and interactive. Vote on whether each one belongs in the template.">
        <Catalog />
      </Section>
    </main>
  );
}
