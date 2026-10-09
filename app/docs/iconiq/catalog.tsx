"use client";

import * as React from "react";
import { Bell, Check, Clock, CreditCard, FileText, Globe, Home, Image as ImageIcon, Palette, Rocket, Search, Settings, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { ClientOnly } from "@/components/client-only";
import { Poll } from "@/components/poll";
import type { PollId } from "@/lib/polls";

import { Autocomplete, AutocompleteContent, AutocompleteEmpty, AutocompleteInput, AutocompleteItem, AutocompleteList } from "@/components/iconiq/b-autocomplete";
import { Banner } from "@/components/iconiq/banner";
import { CheckboxGroup } from "@/components/iconiq/checkbox-group";
import { CodeBlock } from "@/components/iconiq/code-block";
import { ColorPicker } from "@/components/iconiq/color-picker";
import { DatePicker } from "@/components/iconiq/date-picker";
import { FeedbackForm } from "@/components/iconiq/feedback";
import { FileTreeFromItems } from "@/components/iconiq/file-tree";
import { FileUpload } from "@/components/iconiq/file-upload";
import { FluxButton } from "@/components/iconiq/flux-button";
import { IconBar, IconBarItem } from "@/components/iconiq/icon-bar";
import { Rating, RatingButton } from "@/components/iconiq/rating";
import {
  SetupChecklist,
  SetupChecklistCard,
  SetupChecklistDescription,
  SetupChecklistHeader,
  SetupChecklistItem,
  SetupChecklistList,
  SetupChecklistProgress,
  SetupChecklistTitle,
} from "@/components/iconiq/setup-checklist";
import { StatusDot } from "@/components/iconiq/status-dot";
import {
  TeamInvitation,
  TeamInvitationCard,
  TeamInvitationDescription,
  TeamInvitationHeader,
  TeamInvitationInviteField,
  TeamInvitationMemberList,
  TeamInvitationPanel,
  TeamInvitationPanels,
  TeamInvitationPendingList,
  TeamInvitationTab,
  TeamInvitationTabs,
  TeamInvitationTitle,
} from "@/components/iconiq/team-invitation";
import { Timezone } from "@/components/iconiq/timezone";
import { WeekCalendar } from "@/components/iconiq/week-calendar";
import { WheelPicker, WheelPickerColumn } from "@/components/iconiq/wheel-picker";

type Entry = {
  id: PollId;
  file: string;
  name: string;
  /** what it adds over doing it with shadcn */
  why: string;
  where: string;
  usage: string;
  demo: React.ReactNode;
};

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const COUNTRIES = [
  { code: "AU", name: "Australia", region: "Oceania" },
  { code: "CA", name: "Canada", region: "North America" },
  { code: "FR", name: "France", region: "Europe" },
  { code: "ID", name: "Indonesia", region: "Asia" },
  { code: "JP", name: "Japan", region: "Asia" },
  { code: "NL", name: "Netherlands", region: "Europe" },
  { code: "US", name: "United States", region: "North America" },
];
type Country = (typeof COUNTRIES)[number];
// Hoisted: inline functions/arrays are new every render, which some of these components re-sync on.
const countryName = (c: Country) => c.name;
const PRESETS = ["#172146", "#2b6032", "#5aaea8", "#c99d3f", "#c13515"];
const NOTIFY_OPTIONS = [
  { value: "orders", label: "Order updates", description: "Shipped, delivered, returned." },
  { value: "billing", label: "Billing", description: "Invoices and failed payments." },
  { value: "product", label: "Product news", description: "At most once a month." },
];

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));
const SNIPPET = `export async function getInvoice(id: string) {
  const res = await fetch(\`/api/invoices/\${id}\`)
  if (!res.ok) throw new Error("Invoice not found")
  return res.json()
}`;
const PICKER_FALLBACK = <div className="h-12 w-full max-w-xs rounded-lg bg-surface-strong" aria-hidden="true" />;

function AutocompleteDemo() {
  const [query, setQuery] = React.useState("");
  return (
    <Autocomplete items={COUNTRIES} itemToStringValue={countryName} value={query} onValueChange={setQuery}>
      <AutocompleteInput label="Country" placeholder="Start typing, e.g. Ja" />
      <AutocompleteContent>
        <AutocompleteList>
          {(c: Country, index: number) => (
            <AutocompleteItem key={c.code} value={c} index={index} description={c.region}>
              {c.name}
            </AutocompleteItem>
          )}
        </AutocompleteList>
        <AutocompleteEmpty>No country matches that.</AutocompleteEmpty>
      </AutocompleteContent>
    </Autocomplete>
  );
}

function NotifyDemo() {
  const [value, setValue] = React.useState(["orders"]);
  return <CheckboxGroup options={NOTIFY_OPTIONS} value={value} onChange={setValue} />;
}

function WheelDemo() {
  const [h, setH] = React.useState("9");
  const [m, setM] = React.useState("30");
  const [ap, setAp] = React.useState("AM");
  return (
    <div className="flex flex-col items-center gap-3">
      <WheelPicker aria-label="Reminder time">
        <WheelPickerColumn options={HOURS} value={h} onChange={setH} aria-label="Hour" />
        <WheelPickerColumn options={MINUTES} value={m} onChange={setM} aria-label="Minute" />
        <WheelPickerColumn options={["AM", "PM"]} value={ap} onChange={setAp} aria-label="AM or PM" />
      </WheelPicker>
      <p className="text-sm text-muted-foreground tabular-nums">
        Remind me at {h}:{m} {ap}
      </p>
    </div>
  );
}

function DatePickerDemo() {
  const [value, setValue] = React.useState<Date | null>(null);
  return (
    <ClientOnly fallback={PICKER_FALLBACK}>
      <DatePicker value={value} onChange={setValue} placeholder="Pick a due date" />
    </ClientOnly>
  );
}

const ENTRIES: { title: string; items: Entry[] }[] = [
  {
    title: "Inputs & forms",
    items: [
      {
        id: "iq-autocomplete",
        file: "b-autocomplete",
        name: "Autocomplete",
        why: "Free text with suggestions. shadcn’s combobox forces a choice; this one lets people type anything.",
        where: "Search boxes, address and city fields, tags.",
        usage: `<Autocomplete items={countries} itemToStringValue={(c) => c.name} value={q} onValueChange={setQ}>
  <AutocompleteInput label="Country" placeholder="Start typing" />
  <AutocompleteContent>
    <AutocompleteList>{(c, i) => <AutocompleteItem key={c.code} value={c} index={i}>{c.name}</AutocompleteItem>}</AutocompleteList>
    <AutocompleteEmpty>No country matches that.</AutocompleteEmpty>
  </AutocompleteContent>
</Autocomplete>`,
        demo: <AutocompleteDemo />,
      },
      {
        id: "iq-file-upload",
        file: "file-upload",
        name: "File upload",
        why: "Drag-and-drop, paste, validation, a queue with progress. A complete uploader, not just a field.",
        where: "Attachments, imports, media libraries.",
        usage: `<FileUpload accept="image/*,application/pdf" maxFiles={5} maxSize={10 * 1024 * 1024} />`,
        demo: <FileUpload accept="image/*,application/pdf" maxFiles={5} maxSize={10 * 1024 * 1024} />,
      },
      {
        id: "iq-date-picker",
        file: "date-picker",
        name: "Date picker",
        why: "Field + animated calendar in one component. shadcn only ships the calendar.",
        where: "Due dates, bookings, filters.",
        usage: `<DatePicker value={date} onChange={setDate} placeholder="Pick a due date" />`,
        demo: <DatePickerDemo />,
      },
      {
        id: "iq-wheel-picker",
        file: "wheel-picker",
        name: "Wheel picker",
        why: "iOS barrel with flick inertia and detents. Natural for times and short lists on phones.",
        where: "Reminder times, durations, quantities on mobile.",
        usage: `<WheelPicker aria-label="Reminder time">
  <WheelPickerColumn options={hours} value={h} onChange={setH} />
  <WheelPickerColumn options={["AM", "PM"]} value={ap} onChange={setAp} />
</WheelPicker>`,
        demo: <WheelDemo />,
      },
      {
        id: "iq-checkbox-group",
        file: "checkbox-group",
        name: "Checkbox group",
        why: "Multi-select list with descriptions and a show-more toggle for long lists.",
        where: "Notification settings, permissions, filters.",
        usage: `<CheckboxGroup options={[{ value: "email", label: "Email", description: "…" }]} value={v} onChange={setV} />`,
        demo: (
<NotifyDemo />
        ),
      },
      {
        id: "iq-color-picker",
        file: "color-picker",
        name: "Color picker",
        why: "HSV panel, hue/alpha sliders, formats, presets, eyedropper.",
        where: "Branding settings, labels, theme editors.",
        usage: `<ColorPicker defaultValue="#172146" presets={["#172146", "#2b6032", "#c13515"]} />`,
        demo: <ColorPicker defaultValue="#172146" presets={PRESETS} />,
      },
    ],
  },
  {
    title: "Buttons & actions",
    items: [
      {
        id: "iq-flux-button",
        file: "flux-button",
        name: "Flux button",
        why: "Idle → loading → success from one promise. Our Button only has a pending state.",
        where: "Save, send, copy, anything that confirms in place.",
        usage: `<FluxButton idleLabel="Save changes" loadingLabel="Saving…" successLabel="Saved"
  successIcon={<Check />} onAction={() => save()} />`,
        demo: (
          <FluxButton idleLabel="Save changes" loadingLabel="Saving…" successLabel="Saved" successIcon={<Check className="size-4" />} onAction={() => wait(1400)} />
        ),
      },
      {
        id: "iq-icon-bar",
        file: "icon-bar",
        name: "Icon bar",
        why: "Compact icon chips that reveal their label on hover, focus or selection.",
        where: "View switchers, compact toolbars.",
        usage: `<IconBar defaultValue="home">
  <IconBarItem icon={Home} label="Home" value="home" />
  <IconBarItem icon={Search} label="Search" value="search" />
</IconBar>`,
        demo: (
          <IconBar defaultValue="home">
            <IconBarItem icon={Home} label="Home" value="home" />
            <IconBarItem icon={Search} label="Search" value="search" />
            <IconBarItem icon={Bell} label="Alerts" value="alerts" />
            <IconBarItem icon={Settings} label="Settings" value="settings" />
          </IconBar>
        ),
      },
    ],
  },
  {
    title: "Display & status",
    items: [
      {
        id: "iq-rating",
        file: "rating",
        name: "Rating",
        why: "Hover preview, arrow keys, spring stars. Compare with the rating candidates on the Reusable page.",
        where: "Reviews, post-task satisfaction.",
        usage: `<Rating defaultValue={3}>
  <RatingButton /><RatingButton /><RatingButton /><RatingButton /><RatingButton />
</Rating>`,
        demo: (
          <Rating defaultValue={3} onValueChange={(v) => toast(`Rated ${v} of 5`)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <RatingButton key={n} />
            ))}
          </Rating>
        ),
      },
      {
        id: "iq-status-dot",
        file: "status-dot",
        name: "Status dot",
        why: "Live presence / deploy state with a rippling halo. Lighter than a StatusTag in dense lists.",
        where: "Deploy lists, presence, service health.",
        usage: `<StatusDot state="READY" showLabel />
<StatusDot tone="warning" label="Degraded" showLabel />`,
        demo: (
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <StatusDot state="READY" showLabel />
            <StatusDot state="BUILDING" showLabel />
            <StatusDot state="QUEUED" showLabel />
            <StatusDot state="ERROR" showLabel />
          </div>
        ),
      },
      {
        id: "iq-week-calendar",
        file: "week-calendar",
        name: "Week calendar",
        why: "A week strip that morphs into the month with a draggable handle.",
        where: "Scheduling, habit trackers, delivery slots.",
        usage: `<WeekCalendar selected={day} onSelect={setDay} />`,
        demo: (
          <ClientOnly fallback={<div className="h-28 rounded-xl bg-surface-strong" aria-hidden="true" />}>
            <WeekCalendar />
          </ClientOnly>
        ),
      },
      {
        id: "iq-timezone",
        file: "timezone",
        name: "Timezone clock",
        why: "Live local time for a city or IANA zone, with rolling digits.",
        where: "Team pages, support hours, meeting planners.",
        usage: `<Timezone zone="Asia/Jakarta" live showZoneLabel />`,
        demo: (
          <ClientOnly fallback={<span className="text-muted-foreground">Loading clocks…</span>}>
            <ul className="flex flex-col gap-2">
              {[
                ["Jakarta", "Asia/Jakarta"],
                ["Amsterdam", "Europe/Amsterdam"],
                ["New York", "America/New_York"],
              ].map(([city, zone]) => (
                <li key={zone} className="flex items-baseline justify-between gap-4">
                  <span className="text-muted-foreground">{city}</span>
                  <Timezone zone={zone} live showZoneLabel zoneName="abbreviation" />
                </li>
              ))}
            </ul>
          </ClientOnly>
        ),
      },
      {
        id: "iq-file-tree",
        file: "file-tree",
        name: "File tree",
        why: "Keyboard-navigable tree with animated branches, search and drag.",
        where: "Docs navigation, project files, nested categories.",
        usage: `<FileTreeFromItems items={[{ id: "src", label: "src", children: [{ id: "app", label: "app.tsx" }] }]} />`,
        demo: (
          <FileTreeFromItems
            defaultExpandedIds={["docs"]}
            items={[
              {
                id: "docs",
                label: "docs",
                children: [
                  { id: "start", label: "getting-started.md", icon: <FileText className="size-4" /> },
                  { id: "tokens", label: "tokens.md", icon: <FileText className="size-4" /> },
                ],
              },
              { id: "assets", label: "assets", children: [{ id: "logo", label: "logo.svg", icon: <ImageIcon className="size-4" /> }] },
              { id: "readme", label: "README.md", icon: <FileText className="size-4" /> },
            ]}
          />
        ),
      },
    ],
  },
  {
    title: "Blocks",
    items: [
      {
        id: "iq-banner",
        file: "banner",
        name: "Banner",
        why: "Announcement bar whose action morphs it into a confirmation pill.",
        where: "Release notes, maintenance notices, trials ending.",
        usage: `<Banner variant="info" actionLabel="See what’s new" onAction={open}>Version 2.4 is out</Banner>`,
        demo: (
          <Banner variant="info" actionLabel="See what’s new" onAction={() => toast("Opening changelog")} dismissible>
            Version 2.4 is out: faster exports and SSO.
          </Banner>
        ),
      },
      {
        id: "iq-setup-checklist",
        file: "setup-checklist",
        name: "Setup checklist",
        why: "Onboarding tasks with a drawn check and a floating progress pill.",
        where: "First-run onboarding, workspace setup.",
        usage: `<SetupChecklist defaultCompletedIds={["brand"]}>
  <SetupChecklistCard>
    <SetupChecklistHeader><SetupChecklistTitle>Get set up</SetupChecklistTitle></SetupChecklistHeader>
    <SetupChecklistList><SetupChecklistItem id="brand" title="Add your logo" /></SetupChecklistList>
  </SetupChecklistCard>
  <SetupChecklistProgress />
</SetupChecklist>`,
        demo: (
          <SetupChecklist defaultCompletedIds={["brand"]}>
            <SetupChecklistCard>
              <SetupChecklistHeader>
                <SetupChecklistTitle>Set up your workspace</SetupChecklistTitle>
                <SetupChecklistDescription>Three steps left before you can invite customers.</SetupChecklistDescription>
              </SetupChecklistHeader>
              <SetupChecklistList>
                <SetupChecklistItem id="brand" icon={<Palette />} title="Add your brand" description="Logo and colors on every page." />
                <SetupChecklistItem id="team" icon={<Users />} title="Invite your team" description="Up to 20 people on Team." />
                <SetupChecklistItem id="billing" icon={<CreditCard />} title="Add billing" description="Needed before your trial ends." />
                <SetupChecklistItem id="domain" icon={<Globe />} title="Connect a domain" description="Use your own URL." />
                <SetupChecklistItem id="launch" icon={<Rocket />} title="Go live" description="Open the workspace to customers." />
              </SetupChecklistList>
            </SetupChecklistCard>
            <SetupChecklistProgress />
          </SetupChecklist>
        ),
      },
      {
        id: "iq-team-invitation",
        file: "team-invitation",
        name: "Team invitation",
        why: "Invite, manage, roles and pending invites in one morphing card.",
        where: "Workspace settings, onboarding.",
        usage: `<TeamInvitation members={members} roles={["Admin", "Member"]} onInvite={invite}>
  <TeamInvitationCard>…tabs + panels…</TeamInvitationCard>
</TeamInvitation>`,
        demo: (
          <TeamInvitation
            defaultVariant="invite"
            members={[
              { id: "ada", name: "Ada Lovelace", email: "ada@example.com", role: "Admin" },
              { id: "grace", name: "Grace Hopper", email: "grace@example.com", role: "Member" },
            ]}
            pendingInvites={[{ id: "alan", email: "alan@example.com", sentAt: "Sent 2d ago" }]}
            roles={["Admin", "Member", "Viewer"]}
            onInvite={(email) => toast(`Invite sent to ${email}`)}
          >
            <TeamInvitationCard>
              <TeamInvitationHeader icon={<Users />}>
                <TeamInvitationTitle>Invite people</TeamInvitationTitle>
                <TeamInvitationDescription>They get access to every project in Acme.</TeamInvitationDescription>
              </TeamInvitationHeader>
              <TeamInvitationTabs>
                <TeamInvitationTab icon={<UserPlus />} value="invite">Invite</TeamInvitationTab>
                <TeamInvitationTab icon={<Users />} value="manage">Team</TeamInvitationTab>
                <TeamInvitationTab icon={<Clock />} value="pending">Pending</TeamInvitationTab>
              </TeamInvitationTabs>
              <TeamInvitationPanels>
                <TeamInvitationPanel value="invite">
                  <TeamInvitationInviteField label="Email" buttonLabel="Invite" />
                  <TeamInvitationMemberList action="role" label="Members" />
                </TeamInvitationPanel>
                <TeamInvitationPanel value="manage">
                  <TeamInvitationMemberList action="remove" label="Team" emptyMessage="No members yet." />
                </TeamInvitationPanel>
                <TeamInvitationPanel value="pending">
                  <TeamInvitationPendingList label="Pending invites" emptyMessage="No pending invites." />
                </TeamInvitationPanel>
              </TeamInvitationPanels>
            </TeamInvitationCard>
          </TeamInvitation>
        ),
      },
      {
        id: "iq-feedback",
        file: "feedback",
        name: "Feedback form",
        why: "A pill that morphs into a feedback panel and back. Unobtrusive until wanted.",
        where: "Docs pages, beta features, footers.",
        usage: `<FeedbackForm label="Feedback" placeholder="What could be better?" onSubmit={send} />`,
        demo: (
          <FeedbackForm
            label="Feedback"
            placeholder="What could be better on this page?"
            onSubmit={async () => {
              await wait(800);
              toast.success("Thanks, we read every message");
            }}
          />
        ),
      },
      {
        id: "iq-code-block",
        file: "code-block",
        name: "Code block",
        why: "Filename tab, copy button, line numbers, highlighting. Our docs use a plain <pre>.",
        where: "Developer docs, API references, changelogs.",
        usage: `<CodeBlock code={snippet} filename="get-invoice.ts" language="ts" highlightLines={[3]} />`,
        demo: <CodeBlock code={SNIPPET} filename="get-invoice.ts" language="ts" highlightLines={[3]} showLineNumbers />,
      },
    ],
  },
];

export function Catalog() {
  return (
    <>
      {ENTRIES.map((g) => (
        <div key={g.title}>
          <h3 className="mt-12 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{g.title}</h3>
          {g.items.map((e) => (
            <section key={e.id} id={e.id} className="mt-6 scroll-mt-24 rounded-xl border border-hairline bg-white">
              <header className="flex flex-col gap-1 border-b border-hairline p-5">
                <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="text-lg font-semibold text-heading">{e.name}</span>
                  <code className="font-mono text-xs text-muted-foreground">components/iconiq/{e.file}.tsx</code>
                </p>
                <p className="text-sm">{e.why}</p>
                <p className="text-xs text-muted-foreground">In a product: {e.where}</p>
              </header>
              <div className="grid min-w-0 gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
                <div className="flex min-w-0 flex-col justify-center">{e.demo}</div>
                <div className="flex min-w-0 flex-col gap-3">
                  <pre className="overflow-x-auto rounded-lg bg-canvas p-3 font-mono text-xs leading-relaxed text-heading">
                    <code>{e.usage}</code>
                  </pre>
                  <code className="block overflow-x-auto rounded-lg bg-canvas px-3 py-2 font-mono text-xs whitespace-nowrap text-muted-foreground">
                    bunx --bun shadcn@latest add https://iconiqui.com/r/{e.file}.json --path components/iconiq
                  </code>
                  <Poll
                    id={e.id}
                    question={`Keep ${e.name} in the template?`}
                    options={[
                      { id: "keep", label: "Keep it" },
                      { id: "skip", label: "Leave it out" },
                    ]}
                  />
                </div>
              </div>
            </section>
          ))}
        </div>
      ))}
    </>
  );
}
