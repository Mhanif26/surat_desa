"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  CircleHelp,
  Download,
  FileSearch,
  FileText,
  Hash,
  Hourglass,
  Info,
  Lock,
  MoreHorizontal,
  Pencil,
  Printer,
  Search,
  SlidersHorizontal,
  TriangleAlert,
  Upload,
  User,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Chips, FilterChip, OptionTiles } from "@/components/choice";
import { FormField, UploadField, type UploadState } from "@/components/form-field";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { SearchPill } from "@/components/search-pill";
import { StatusTag, SuccessBand, TONES, type Tone } from "@/components/status";
import { StepCard, SummaryCard } from "@/components/step-card";
import { Caption, Code, DoDont, Preview, Props, Row, Section } from "../ui";
import { MORE_NAV, MoreActions, MoreFeedback, MoreForms, MoreLayout, MoreNavigation, MoreOverlays } from "./more";

const NAV = [
  { group: "Foundations", items: [["colors", "Colors"], ["typography", "Typography"], ["icons", "Icons"], ["shape", "Shape & depth"], ["motion", "Motion"], ["tones", "Semantic tones"]] },
  { group: "Actions", items: [["button", "Button"], ...MORE_NAV.actions] },
  { group: "Forms", items: [["form-field", "Form field"], ["select", "Select"], ["checkbox", "Checkbox & switch"], ["slider", "Slider"], ["upload", "Upload"], ["option-tiles", "Option tiles"], ["chips", "Chips"], ...MORE_NAV.forms] },
  { group: "Feedback", items: [["status-tag", "Status tag"], ["notice", "Notice"], ["success-band", "Success band"], ["toast", "Toast"], ["loading", "Skeleton & progress"], ...MORE_NAV.feedback] },
  { group: "Layout", items: [["card", "Card & band"], ["step-card", "Step card"], ["summary-card", "Summary card"], ["tabs", "Tabs"], ["accordion", "Accordion"], ...MORE_NAV.layout] },
  { group: "Overlays", items: [["dialog", "Dialog & sheet"], ["menu", "Menu"], ["tooltip", "Tooltip"], ...MORE_NAV.overlays] },
  { group: "Navigation", items: [...MORE_NAV.navigation] },
  { group: "Patterns", items: [["lookup", "Lookup"], ["work-queue", "Work queue"]] },
] as const;

export function Docs() {
  const active = useActiveSection();

  return (
    <div className="mx-auto flex max-w-[1200px] gap-12 px-4 sm:px-6">
      <nav aria-label="Components" className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-56 shrink-0 overflow-y-auto py-10 lg:block">
        {NAV.map(({ group, items }) => (
          <div key={group} className="mb-6">
            <p className="mb-1 px-3 text-xs font-semibold text-muted-foreground">{group}</p>
            <ul>
              {items.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={active === id ? "true" : undefined}
                    className={cn(
                      "block rounded-lg px-3 py-1.5 text-sm text-body hover:bg-canvas",
                      active === id && "bg-primary-soft font-semibold text-primary hover:bg-primary-soft"
                    )}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <main className="min-w-0 flex-1 py-10 pb-32">
        <h1 className="text-3xl font-bold">Components</h1>
        <p className="mt-3 max-w-[68ch] text-muted-foreground">
          Every component in the template, live. Each section shows what it looks like, where it belongs in a product, how to
          import and use it, its props, and when not to use it. Rules and tokens are in{" "}
          <code className="font-mono text-sm">DESIGN-it-2023.md</code>.
        </p>

        <Foundations />
        <Actions />
        <MoreActions />
        <Forms />
        <MoreForms />
        <Feedback />
        <MoreFeedback />
        <Layout />
        <MoreLayout />
        <Overlays />
        <MoreOverlays />
        <MoreNavigation />
        <Patterns />
      </main>
    </div>
  );
}

/* ───────────────────────── Foundations ───────────────────────── */

const COLORS = [
  ["Primary", "#172146", "bg-primary", "Buttons, headings, links, selected borders"],
  ["Secondary", "#2b6032", "bg-secondary", "The one conversion action per screen"],
  ["Body", "#3b4054", "text-body", "Paragraphs, table cells"],
  ["Muted", "#5f6578", "text-muted-foreground", "Hints, timestamps"],
  ["Input border", "#80869a", "border-input", "Anything you type in or tick"],
  ["Hairline", "#dfe1e8", "border-hairline", "Card outlines, dividers"],
  ["Surface strong", "#eef0f4", "bg-surface-strong", "Soft buttons, skeletons"],
  ["Canvas", "#f6f7f9", "bg-canvas", "Band behind white cards"],
  ["Primary soft", "#e9ecf5", "bg-primary-soft", "Selected fill, “New” badge"],
  ["Secondary soft", "#eaf3eb", "bg-secondary-soft", "Success band"],
] as const;

function Foundations() {
  return (
    <>
      <Section id="colors" title="Colors" description="Mostly white. Navy does the everyday work; leaf green marks the one action that matters, alone on white.">
        <Preview className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {COLORS.map(([name, hex, cls, use]) => (
            <div key={hex}>
              <div className="h-16 rounded-lg border border-hairline" style={{ background: hex }} />
              <p className="mt-2 text-sm font-semibold text-heading">{name}</p>
              <p className="font-mono text-xs text-muted-foreground">{cls}</p>
              <p className="text-xs text-muted-foreground">{use}</p>
            </div>
          ))}
        </Preview>
        <Caption>Change the brand in app/globals.css (--primary, --secondary and their -hover / -soft siblings). Keep white on both at ≥ 4.5:1.</Caption>
      </Section>

      <Section id="typography" title="Typography" description="Plus Jakarta Sans for everything, in rem so it grows with the reader’s text size. Lora is a rare break, at most once per screen.">
        <Preview className="divide-y divide-hairline p-0">
          {[
            ["text-3xl · page title", "text-3xl font-bold text-heading", "Billing details"],
            ["text-2xl · section title", "text-2xl font-semibold text-heading", "Payment method"],
            ["text-lg · item title", "text-lg font-semibold text-heading", "Pro plan, billed yearly"],
            ["text-base · body", "text-base", "We’ll email a receipt to the address on your account."],
            ["text-sm · dense", "text-sm", "Updated 9 Oct 2026, 08:14"],
            ["text-xs · hint (minimum)", "text-xs text-muted-foreground", "Shown on every invoice."],
            ["text-4xl · number", "text-4xl font-bold tabular-nums text-heading", "1,284"],
            ["font-serif · Lora break", "font-serif text-[2rem] leading-tight font-medium text-heading", "Software that stays out of your way."],
          ].map(([meta, cls, sample]) => (
            <div key={meta} className="grid gap-1 px-6 py-5 sm:grid-cols-[13rem_1fr] sm:items-baseline sm:gap-6">
              <span className="font-mono text-xs text-muted-foreground">{meta}</span>
              <span className={cls}>{sample}</span>
            </div>
          ))}
        </Preview>
        <DoDont
          dos={["One text-3xl per page", "Emphasis with font-medium inside body text", "Check every screen at 200% text size"]}
          donts={["Anything below text-xs", "Lora on buttons, labels, tables or task screens", "Custom names like text-title (cn drops them next to a color)"]}
        />
      </Section>

      <Section id="icons" title="Icons" description="Lucide only: outline, stroke 2, currentColor. 16px in tags, 20px in buttons and text, 24px standalone. Icons support words; they don’t replace them.">
        <Preview className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {(
            [
              [Search, "search"], [Download, "download"], [Printer, "printer"], [Pencil, "pencil"], [Upload, "upload"], [FileText, "file-text"],
              [User, "user"], [Hash, "hash"], [SlidersHorizontal, "sliders-horizontal"], [Lock, "lock"], [CircleHelp, "circle-help"], [WifiOff, "wifi-off"],
            ] as const
          ).map(([Icon, name]) => (
            <div key={name} className="flex flex-col items-center gap-2 rounded-lg py-4 text-heading">
              <Icon className="size-6" aria-hidden="true" />
              <span className="font-mono text-xs text-muted-foreground">{name}</span>
            </div>
          ))}
        </Preview>
        <Code title="usage">{`import { Download } from "lucide-react"

<Button><Download aria-hidden="true" /> Download invoice</Button>   {/* 20px via the button */}
<Download className="size-6" aria-hidden="true" />                 {/* standalone */}`}</Code>
      </Section>

      <Section id="shape" title="Shape & depth" description="8px controls, 14px cards, 20px bands and dialogs, full pills. One shadow, only for things that float. One material, only for sticky bars.">
        <Preview className="flex flex-wrap items-end gap-6">
          {[
            ["rounded-sm · 4", "rounded-sm size-12"],
            ["rounded-lg · 8", "rounded-lg size-16"],
            ["rounded-xl · 14", "rounded-xl size-20"],
            ["rounded-2xl · 20", "rounded-2xl size-24"],
            ["rounded-full", "rounded-full h-12 w-24"],
          ].map(([label, cls]) => (
            <div key={label} className="flex flex-col items-start gap-2">
              <div className={cn("border border-input bg-white", cls)} />
              <span className="font-mono text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
          <div className="flex flex-col items-start gap-2">
            <div className="size-24 rounded-xl bg-white shadow-float" />
            <span className="font-mono text-xs text-muted-foreground">shadow-float</span>
          </div>
        </Preview>
        <Code title="sticky bar">{`<header className="material-bar sticky top-0 z-40 border-b">…</header>   {/* solid when reduced transparency */}`}</Code>
      </Section>

      <Section id="motion" title="Motion" description="Motion confirms what the person did. Ease-out, at most 300ms, interruptible, transform and opacity only. Actions repeated all day don’t animate.">
        <Preview className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">What</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="pr-6">Classes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["Press / release", "100 / 160ms", "transition-[scale] duration-160 active:scale-97 active:duration-100"],
                ["Hover, color, selection", "150ms", "transition-colors duration-150"],
                ["Menu, popover", "200 in · 160 out", "origin-(--radix-…-transform-origin) zoom-in-96"],
                ["Dialog", "250 in · 200 out", "zoom-in-95 duration-200 data-open:duration-250"],
                ["Sheet (phones)", "300ms", "Vaul drawer, ease-drawer"],
                ["Expand", "250ms", "grid transition-[grid-template-rows] grid-rows-[0fr] → [1fr]"],
              ].map(([a, b, c]) => (
                <TableRow key={a} className="hover:bg-transparent">
                  <TableCell className="pl-6 font-semibold text-heading">{a}</TableCell>
                  <TableCell className="tabular-nums">{b}</TableCell>
                  <TableCell className="pr-6 font-mono text-xs text-muted-foreground">{c}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Preview>
        <DoDont
          dos={["Name the properties you transition", "Grow menus from their trigger", "Keep reduced-motion users in mind (globals.css handles the defaults)"]}
          donts={["transition-all, ease-in, bounce", "Animating width, height, top or margin", "Animating filters, sorting or tabs in tools"]}
        />
      </Section>

      <Section id="tones" title="Semantic tones" description="Five tones carry meaning. Map your domain states onto them; never invent new status colors.">
        <Preview className="flex flex-wrap gap-3">
          {(Object.keys(TONES) as Tone[]).map((t) => (
            <StatusTag key={t} tone={t}>
              {t}
            </StatusTag>
          ))}
        </Preview>
        <Code title="mapping domain states">{`// lib/order-status.ts — give each state a tone, and an icon if the default isn't specific enough
export const ORDER_STATUS = {
  draft:     { tone: "neutral", label: "Draft",                icon: Pencil },
  review:    { tone: "info",    label: "In review",            icon: FileSearch },
  waiting:   { tone: "warning", label: "Waiting for approval", icon: Hourglass },
  approved:  { tone: "success", label: "Approved" },
  rejected:  { tone: "error",   label: "Rejected" },
} as const`}</Code>
      </Section>
    </>
  );
}

/* ───────────────────────── Actions ───────────────────────── */

function Actions() {
  const [saving, setSaving] = React.useState(false);

  return (
    <Section id="button" title="Button" description="One primary button per screen, labelled with the verb that will happen. Every button answers on press with scale 0.97.">
      <Preview className="flex flex-col gap-6">
        <Row label="Variants">
          <Button>Continue <ArrowRight aria-hidden="true" /></Button>
          <Button variant="outline"><ArrowLeft aria-hidden="true" /> Back</Button>
          <Button variant="soft" size="sm">Edit</Button>
          <Button variant="ghost">Skip</Button>
          <Button variant="link">See an example</Button>
        </Row>
        <Row label="secondary · conversion">
          <Button variant="secondary"><Download aria-hidden="true" /> Download invoice</Button>
          <Button variant="link">View online</Button>
        </Row>
        <Row label="pending · disabled">
          <Button
            pending={saving}
            pendingLabel="Saving…"
            onClick={() => {
              setSaving(true);
              setTimeout(() => setSaving(false), 2500);
            }}
          >
            Save changes
          </Button>
          <Button disabled>Continue</Button>
        </Row>
        <Row label="size=&quot;dense&quot; · 44px">
          <Button size="dense">Approve</Button>
          <Button size="dense" variant="destructive-outline">Reject</Button>
          <Button size="dense" variant="outline"><Printer aria-hidden="true" /> Print</Button>
        </Row>
      </Preview>
      <Caption>In a product: Continue / Back close every step of a form; the green button is the action the screen exists for (Pay, Create account, Download).</Caption>
      <Code title="usage">{`import { Button } from "@/components/ui/button"

<Button>Continue <ArrowRight aria-hidden="true" /></Button>
<Button variant="secondary" pending={saving} pendingLabel="Paying…">Pay $48</Button>
<Button asChild variant="link"><Link href="/help">How refunds work</Link></Button>`}</Code>
      <Props
        rows={[
          ["variant", "\"default\" | \"secondary\" | \"outline\" | \"soft\" | \"ghost\" | \"link\" | \"destructive-outline\"", "\"default\"", "default = navy next step; secondary = green conversion; outline = back/cancel; soft = small inline action."],
          ["size", "\"default\" | \"dense\" | \"sm\" | \"icon\"", "\"default\"", "48px; dense 44px for tools; sm for inline row actions; icon 44px square (needs aria-label)."],
          ["pending", "boolean", "false", "Shows a spinner + pendingLabel, ignores presses, sets aria-busy."],
          ["pendingLabel", "ReactNode", "—", "Required for the pending swap (“Saving…”). The button keeps the wider of the two widths."],
          ["asChild", "boolean", "false", "Render the child (e.g. a Link) with button styles."],
        ]}
      />
      <DoDont
        dos={["Label with the verb that will happen", "One green button per screen, alone on white", "Pending state for anything slower than ~300ms"]}
        donts={["Navy and green buttons side by side", "Greying a button out while it works", "Icons on every button"]}
      />
    </Section>
  );
}

/* ───────────────────────── Forms ───────────────────────── */

function Forms() {
  const [phone, setPhone] = React.useState("0812345");
  const [touched, setTouched] = React.useState(true);
  const digits = phone.replace(/\D/g, "").length;
  const phoneError = touched && (digits < 10 || digits > 13) ? `Phone number needs 10–13 digits. You’ve typed ${digits}.` : undefined;

  const [upload, setUpload] = React.useState<UploadState>({ status: "empty" });
  const timer = React.useRef<ReturnType<typeof setInterval>>(undefined);
  React.useEffect(() => () => clearInterval(timer.current), []);
  const startUpload = (file: File) => {
    clearInterval(timer.current);
    let progress = 0;
    setUpload({ status: "uploading", fileName: file.name, progress });
    // ponytail: fake progress for the demo; real uploads report XHR / fetch progress
    timer.current = setInterval(() => {
      progress += 12;
      if (progress >= 100) {
        clearInterval(timer.current);
        setUpload({ status: "done", fileName: file.name, thumbnail: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined });
      } else setUpload({ status: "uploading", fileName: file.name, progress });
    }, 250);
  };

  const [agree, setAgree] = React.useState(false);
  const [notify, setNotify] = React.useState(true);
  const [seats, setSeats] = React.useState([5]);
  const [plan, setPlan] = React.useState("team");
  const [reason, setReason] = React.useState("Too expensive");

  return (
    <>
      <Section id="form-field" title="Form field" description="Label, hint, error, then the field. Validate on blur, then live while fixing. Fields are always white, read-only included.">
        <Preview className="grid max-w-[640px] gap-6">
          <FormField label="Full name" hint="As it should appear on invoices.">
            <Input defaultValue="Ada Lovelace" autoComplete="name" />
          </FormField>
          <FormField label="Phone number" hint="We text you when your order ships." error={phoneError}>
            <Input type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => setTouched(true)} />
          </FormField>
          <FormField label="Company" optional>
            <Input autoComplete="organization" />
          </FormField>
          <FormField label="Workspace URL" readOnlyReason="Set when the workspace was created.">
            <Input defaultValue="acme.example.com" />
          </FormField>
        </Preview>
        <Caption>In a product: account settings, checkout, sign-up.</Caption>
        <Code title="usage">{`import { FormField } from "@/components/form-field"
import { Input } from "@/components/ui/input"

<FormField label="Phone number" hint="We text you when your order ships." error={error}>
  <Input type="tel" inputMode="tel" onBlur={validate} />
</FormField>`}</Code>
        <Props
          rows={[
            ["label", "ReactNode", "—", "Always visible. Never use a placeholder instead."],
            ["hint", "ReactNode", "—", "Shown under the label, before the error and the field."],
            ["error", "ReactNode", "—", "What’s wrong and how to fix it. Sets aria-invalid and is announced."],
            ["optional", "boolean", "false", "Adds “(optional)”. Don’t star required fields."],
            ["readOnlyReason", "ReactNode", "—", "Makes the control read-only and explains why, with a lock icon."],
            ["children", "ReactElement", "—", "Exactly one control. FormField wires id, aria-describedby, aria-invalid."],
          ]}
        />
      </Section>

      <Section id="select" title="Select" description="For choosing one of five to fifteen known options. Fewer than five: option tiles or radios. More than fifteen: a searchable list.">
        <Preview className="max-w-[640px]">
          <div className="flex flex-col gap-2">
            <Label htmlFor="country">Country</Label>
            <Select defaultValue="id">
              <SelectTrigger id="country" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="id">Indonesia</SelectItem>
                <SelectItem value="jp">Japan</SelectItem>
                <SelectItem value="nl">Netherlands</SelectItem>
                <SelectItem value="us">United States</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Preview>
        <Code title="usage">{`import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select value={country} onValueChange={setCountry}>
  <SelectTrigger id="country" className="w-full"><SelectValue placeholder="Choose a country" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="id">Indonesia</SelectItem>
  </SelectContent>
</Select>`}</Code>
      </Section>

      <Section id="checkbox" title="Checkbox & switch" description="Checkbox for a choice that’s submitted with a form; switch for a setting that applies the moment it flips.">
        <Preview className="flex flex-col gap-2">
          <Label className="flex min-h-11 cursor-pointer items-center gap-3 text-base font-normal text-body">
            <Checkbox checked={agree} onCheckedChange={(v) => setAgree(v === true)} />
            I agree to the terms of service
          </Label>
          <Label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 text-base font-normal text-body sm:max-w-sm">
            Email me when an order ships
            <Switch checked={notify} onCheckedChange={setNotify} />
          </Label>
        </Preview>
        <Code title="usage">{`import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

<Label className="flex min-h-11 items-center gap-3"><Checkbox checked={v} onCheckedChange={(c) => setV(c === true)} /> I agree…</Label>
<Switch checked={on} onCheckedChange={save} size="default" />   {/* size: "default" | "sm" */}`}</Code>
        <DoDont dos={["Wrap control + text in one Label (44px row)", "Switch only when the change applies immediately"]} donts={["A switch inside a form that has a Save button", "Checkbox without visible text"]} />
      </Section>

      <Section id="slider" title="Slider" description="For a rough value on a known range, where the exact number matters less than the feel. Show the value next to it.">
        <Preview className="flex max-w-[640px] flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <Label>Seats</Label>
            <span className="text-lg font-semibold tabular-nums text-heading">{seats[0]}</span>
          </div>
          <Slider value={seats} onValueChange={setSeats} min={1} max={50} step={1} aria-label="Seats" />
        </Preview>
        <Code title="usage">{`import { Slider } from "@/components/ui/slider"

<Slider value={[seats]} onValueChange={([v]) => setSeats(v)} min={1} max={50} aria-label="Seats" />`}</Code>
      </Section>

      <Section id="upload" title="Upload" description="Empty, uploading, done, failed. Uploads keep going while the person fills in the rest of the form.">
        <Preview className="grid max-w-[640px] gap-6">
          <UploadField
            label="Receipt"
            hint="A photo or PDF, up to 10 MB."
            accept="image/*,application/pdf"
            state={upload}
            onFile={startUpload}
            onCancel={() => {
              clearInterval(timer.current);
              setUpload({ status: "empty" });
            }}
          />
          <UploadField label="Logo" state={{ status: "failed", fileName: "logo-final.png", reason: "The connection dropped." }} onFile={() => {}} />
        </Preview>
        <Caption>In a product: expense claims, profile photos, document verification. Pick a file to see the progress state.</Caption>
        <Code title="usage">{`import { UploadField, type UploadState } from "@/components/form-field"

const [state, setState] = useState<UploadState>({ status: "empty" })
<UploadField label="Receipt" state={state} onFile={upload} onCancel={abort} onRetry={retry} />`}</Code>
        <Props
          rows={[
            ["state", "{ status: \"empty\" } | { status: \"uploading\", fileName, progress } | { status: \"done\", fileName, thumbnail? } | { status: \"failed\", fileName, reason }", "—", "You own the upload; the field only renders its state."],
            ["onFile", "(file: File) => void", "—", "Called when a file is picked."],
            ["onCancel / onRetry", "() => void", "—", "Uploading → Cancel; failed → Try again (defaults to picking again)."],
            ["accept", "string", "\"image/*\"", "Native file-type filter."],
          ]}
        />
      </Section>

      <Section id="option-tiles" title="Option tiles" description="For two to eight options that need a sentence each. Selected gets three signals: navy border, soft fill and a check.">
        <Preview>
          <OptionTiles
            aria-label="Plan"
            value={plan}
            onValueChange={setPlan}
            options={[
              { value: "starter", title: "Starter", description: "One person, up to 3 projects." },
              { value: "team", title: "Team", description: "Up to 20 people, shared billing." },
              { value: "business", title: "Business", description: "SSO, audit log and priority support." },
              { value: "enterprise", title: "Enterprise", description: "Custom contract and data residency." },
            ]}
          />
        </Preview>
        <Caption>In a product: choosing a plan, an account type, a shipping speed.</Caption>
        <Code title="usage">{`import { OptionTiles } from "@/components/choice"

<OptionTiles aria-label="Plan" value={plan} onValueChange={setPlan}
  options={[{ value: "team", title: "Team", description: "Up to 20 people, shared billing." }]} />`}</Code>
      </Section>

      <Section id="chips" title="Chips" description="Common short answers that can also be typed. The dashed chip opens a free-text field.">
        <Preview className="flex flex-col gap-3">
          <Chips aria-label="Reason for cancelling" options={["Too expensive", "Missing a feature", "Switching tools", "Just testing"]} value={reason} onValueChange={setReason} />
          <p className="text-xs text-muted-foreground">Value: {reason || "—"}</p>
        </Preview>
        <Caption>In a product: a cancellation reason, a support topic, tags.</Caption>
        <Code title="usage">{`import { Chips } from "@/components/choice"

<Chips aria-label="Reason" options={["Too expensive", "Missing a feature"]} value={v} onValueChange={setV}
  customLabel="Something else…" />   {/* customLabel={null} hides the free-text chip */}`}</Code>
      </Section>
    </>
  );
}

/* ───────────────────────── Feedback ───────────────────────── */

function Feedback() {
  const [loading, setLoading] = React.useState(false);

  return (
    <>
      <Section id="status-tag" title="Status tag" description="A tone, its icon and words. Short labels in tables. Give a domain state its own icon once, then keep it everywhere.">
        <Preview className="flex flex-wrap gap-3">
          <StatusTag tone="neutral" icon={Pencil}>Draft</StatusTag>
          <StatusTag tone="info" icon={FileSearch}>In review</StatusTag>
          <StatusTag tone="warning" icon={Hourglass}>Waiting for approval</StatusTag>
          <StatusTag tone="success">Approved</StatusTag>
          <StatusTag tone="error">Rejected</StatusTag>
        </Preview>
        <Caption>In a product: order and ticket status, row status in admin tables.</Caption>
        <Code title="usage">{`import { StatusTag } from "@/components/status"

<StatusTag tone="warning" icon={Hourglass}>Waiting for approval</StatusTag>
<StatusTag tone="success">Approved</StatusTag>`}</Code>
        <Props
          rows={[
            ["tone", "\"neutral\" | \"info\" | \"warning\" | \"success\" | \"error\"", "—", "Sets fill, text color and the default icon."],
            ["icon", "LucideIcon", "tone default", "Override for a specific domain state."],
            ["children", "ReactNode", "—", "The words. Never an icon alone."],
          ]}
        />
      </Section>

      <Section id="notice" title="Notice" description="A larger message box in a tone, with a 24px icon. An error notice always says what went wrong and how to fix it.">
        <Preview className="grid gap-3">
          <Alert variant="error">
            <TONES.error.icon aria-hidden="true" />
            <AlertTitle>Payment declined because the card has expired.</AlertTitle>
            <AlertDescription>Update the card, then try again.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <WifiOff aria-hidden="true" />
            <AlertTitle>You’re offline.</AlertTitle>
            <AlertDescription>Your answers are safe; we’ll send them when you’re back.</AlertDescription>
          </Alert>
          <Alert variant="info">
            <Info aria-hidden="true" />
            <AlertTitle>Exports usually take about two minutes.</AlertTitle>
          </Alert>
          <Alert variant="warning">
            <TriangleAlert aria-hidden="true" />
            <AlertDescription>Changing the plan now ends your trial today.</AlertDescription>
          </Alert>
        </Preview>
        <Code title="usage">{`import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

<Alert variant="error">                      {/* neutral | info | warning | success | error */}
  <CircleX aria-hidden="true" />
  <AlertTitle>Payment declined because the card has expired.</AlertTitle>
  <AlertDescription>Update the card, then try again.</AlertDescription>
</Alert>`}</Code>
      </Section>

      <Section id="success-band" title="Success band" description="The once-per-task “it’s ready” moment. Soft green, with the green action.">
        <Preview>
          <SuccessBand
            title="Your export is ready"
            description="orders-2026-10.csv · 1,284 rows"
            action={<Button variant="secondary"><Download aria-hidden="true" /> Download</Button>}
          />
        </Preview>
        <Code title="usage">{`import { SuccessBand } from "@/components/status"

<SuccessBand title="Your export is ready" description="1,284 rows" action={<Button variant="secondary">Download</Button>} />`}</Code>
      </Section>

      <Section id="toast" title="Toast" description="Top center, 4 seconds. Only to confirm something the person just did.">
        <Preview>
          <Row label="Try">
            <Button variant="outline" onClick={() => toast.success("Link copied")}>Copy link</Button>
            <Button variant="outline" onClick={() => toast("Draft saved")}>Save draft</Button>
            <Button variant="outline" onClick={() => toast("Item archived", { duration: 6000, action: { label: "Undo", onClick: () => toast("Restored") } })}>
              Archive
            </Button>
          </Row>
        </Preview>
        <Code title="usage">{`import { toast } from "sonner"   // <Toaster /> is already in app/layout.tsx

toast.success("Link copied")
toast("Item archived", { duration: 6000, action: { label: "Undo", onClick: restore } })`}</Code>
        <DoDont dos={["Confirm small actions: copied, saved, archived", "6s and an Undo action for reversible deletes"]} donts={["Errors that block the task", "Anything the person must read later (a reference number)"]} />
      </Section>

      <Section id="loading" title="Skeleton & progress" description="Skeletons appear only after 300ms, shaped like the content, no shimmer. Progress for anything with a known length.">
        <Preview className="flex flex-col gap-4">
          <Button variant="outline" className="self-start" onClick={() => setLoading((l) => !l)}>
            {loading ? "Show result" : "Reload"}
          </Button>
          <div className="flex flex-col gap-3 rounded-xl border border-hairline p-6">
            {loading ? (
              <>
                <Skeleton className="h-7 w-32 rounded-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </>
            ) : (
              <>
                <StatusTag tone="info" icon={FileSearch}>In review</StatusTag>
                <p className="text-lg font-semibold text-heading">Order #4821</p>
                <p className="text-muted-foreground">Placed 8 Oct 2026</p>
              </>
            )}
          </div>
          <Progress value={62} aria-label="Import progress" />
        </Preview>
        <Code title="usage">{`import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

<Skeleton className="h-6 w-1/2" />
<Progress value={62} aria-label="Import progress" />`}</Code>
      </Section>
    </>
  );
}

/* ───────────────────────── Layout ───────────────────────── */

function Layout() {
  const [step, setStep] = React.useState(1);
  const steps = [
    { title: "Workspace", summary: "Acme · acme.example.com" },
    { title: "Plan", summary: "Team, billed yearly" },
    { title: "Invite people", summary: "3 invites" },
    { title: "Review and create", summary: "" },
  ];

  return (
    <>
      <Section id="card" title="Card & band" description="White cards with a hairline and 14px corners, grouped on a grey canvas band. Never nest cards.">
        <div className="rounded-2xl bg-canvas p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly revenue</CardTitle>
                <CardDescription>Updated 5 minutes ago</CardDescription>
              </CardHeader>
              <CardContent className="text-4xl font-bold tabular-nums text-heading">$48,210</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Open tickets</CardTitle>
                <CardDescription>3 waiting longer than a day</CardDescription>
              </CardHeader>
              <CardContent className="text-4xl font-bold tabular-nums text-heading">27</CardContent>
            </Card>
          </div>
        </div>
        <Caption>In a product: dashboard summaries, settings groups.</Caption>
        <Code title="usage">{`import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

<div className="rounded-2xl bg-canvas p-6">      {/* band: just classes */}
  <Card><CardHeader><CardTitle>Open tickets</CardTitle></CardHeader><CardContent>27</CardContent></Card>
</div>`}</Code>
      </Section>

      <Section id="step-card" title="Step card" description="Every step visible from the start. Done steps collapse to one line with Edit; the open step floats; upcoming steps are muted.">
        <div className="flex flex-col gap-3 rounded-2xl bg-canvas p-4 sm:p-6">
          {steps.map((s, i) => (
            <StepCard key={s.title} number={i + 1} title={s.title} state={i < step ? "done" : i === step ? "open" : "upcoming"} summary={s.summary} onEdit={() => setStep(i)}>
              <p className="text-muted-foreground">The “{s.title}” fields go here.</p>
              <div className="mt-6 flex gap-3">
                {i > 0 && (
                  <Button variant="outline" onClick={() => setStep(i - 1)}>
                    Back
                  </Button>
                )}
                {i < steps.length - 1 ? (
                  <Button onClick={() => setStep(i + 1)}>
                    Continue <ArrowRight aria-hidden="true" />
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={() => toast.success("Workspace created")}>
                    Create workspace
                  </Button>
                )}
              </div>
            </StepCard>
          ))}
        </div>
        <Caption>In a product: onboarding, checkout, any form longer than one screen.</Caption>
        <Code title="usage">{`import { StepCard } from "@/components/step-card"

<StepCard number={1} title="Workspace" state="done" summary="Acme · acme.example.com" onEdit={() => setStep(0)} />
<StepCard number={2} title="Plan" state="open">…fields, Back / Continue…</StepCard>
<StepCard number={3} title="Invite people" state="upcoming" />`}</Code>
        <Props
          rows={[
            ["state", "\"done\" | \"open\" | \"upcoming\"", "—", "Only the open step shows its children (expands in 250ms)."],
            ["number · title", "number · string", "—", "Step number and name."],
            ["summary", "ReactNode", "—", "One line shown when done."],
            ["onEdit", "() => void", "—", "Shows Edit on a done step."],
          ]}
        />
      </Section>

      <Section id="summary-card" title="Summary card" description="Muted label left, value right, hairline between. Beside the steps from 1024px, under them on phones.">
        <Preview className="bg-canvas">
          <SummaryCard
            className="max-w-sm"
            title="Summary"
            rows={[
              { label: "Plan", value: "Team" },
              { label: "Seats", value: "12" },
              { label: "Billed", value: "Yearly" },
              { label: "Total", value: "$1,152" },
            ]}
          />
        </Preview>
        <Code title="usage">{`import { SummaryCard } from "@/components/step-card"

<SummaryCard title="Summary" rows={[{ label: "Plan", value: "Team" }, { label: "Total", value: "$1,152" }]} />`}</Code>
      </Section>

      <Section id="tabs" title="Tabs" description="Underline style by default: 2px navy line, 600 navy text. Switches instantly.">
        <Preview>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="pt-4 text-muted-foreground">42 tickets.</TabsContent>
            <TabsContent value="open" className="pt-4 text-muted-foreground">27 open tickets.</TabsContent>
            <TabsContent value="closed" className="pt-4 text-muted-foreground">No tickets closed today.</TabsContent>
          </Tabs>
        </Preview>
        <Code title="usage">{`import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="open">
  <TabsList>                {/* variant="default" gives the segmented look */}
    <TabsTrigger value="open">Open</TabsTrigger>
  </TabsList>
  <TabsContent value="open">…</TabsContent>
</Tabs>`}</Code>
      </Section>

      <Section id="accordion" title="Accordion" description="For secondary detail people may skip: FAQs, advanced settings. Not for content everyone needs.">
        <Preview>
          <Accordion type="single" collapsible>
            {[
              ["Can I change plans later?", "Yes. Changes apply from your next billing date, and unused time is credited."],
              ["Where is my data stored?", "In the region you picked when creating the workspace. Business plans can choose per project."],
              ["How do I cancel?", "Settings → Billing → Cancel plan. Your data stays available for 30 days."],
            ].map(([q, a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger>{q}</AccordionTrigger>
                <AccordionContent>{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Preview>
        <Code title="usage">{`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

<Accordion type="single" collapsible>
  <AccordionItem value="cancel"><AccordionTrigger>How do I cancel?</AccordionTrigger><AccordionContent>…</AccordionContent></AccordionItem>
</Accordion>`}</Code>
      </Section>
    </>
  );
}

/* ───────────────────────── Overlays ───────────────────────── */

function Overlays() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Section id="dialog" title="Dialog & sheet" description="Centered dialog from 640px, a bottom sheet with a grab handle on phones. Navy scrim at 40%. Focus is trapped and returns to the trigger.">
        <Preview>
          <ResponsiveDialog
            open={open}
            onOpenChange={setOpen}
            trigger={<Button size="dense" variant="destructive-outline">Reject request</Button>}
            title="Why is this request rejected?"
            description="The requester reads this. Say what they need to change."
            footer={
              <>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => setOpen(false)}>Send reason</Button>
              </>
            }
          >
            <FormField label="Reason">
              <Input defaultValue="The invoice is missing." />
            </FormField>
          </ResponsiveDialog>
        </Preview>
        <Caption>Resize below 640px to get the sheet.</Caption>
        <Code title="usage">{`import { ResponsiveDialog } from "@/components/responsive-dialog"

<ResponsiveDialog open={open} onOpenChange={setOpen} trigger={<Button>Reject</Button>}
  title="Why is this request rejected?" footer={<><Button variant="outline">Cancel</Button><Button>Send</Button></>}>
  …
</ResponsiveDialog>`}</Code>
        <Props
          rows={[
            ["title · description", "ReactNode", "—", "Title is required (announced to screen readers)."],
            ["trigger", "ReactNode", "—", "Rendered asChild; omit for fully controlled use."],
            ["footer", "ReactNode", "—", "Cancel (outline) then the action."],
            ["open · onOpenChange", "boolean · (open) => void", "—", "Controlled state."],
          ]}
        />
      </Section>

      <Section id="menu" title="Menu" description="Grows out of its button. Closes on Escape, an outside press or choosing an item.">
        <Preview>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="dense">
                <MoreHorizontal aria-hidden="true" /> More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem><Printer aria-hidden="true" /> Print</DropdownMenuItem>
              <DropdownMenuItem><Download aria-hidden="true" /> Download PDF</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast.success("ID copied")}><Hash aria-hidden="true" /> Copy ID</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Preview>
        <Code title="usage">{`import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger asChild><Button variant="outline">More</Button></DropdownMenuTrigger>
  <DropdownMenuContent align="start"><DropdownMenuItem onSelect={copy}>Copy ID</DropdownMenuItem></DropdownMenuContent>
</DropdownMenu>`}</Code>
      </Section>

      <Section id="tooltip" title="Tooltip" description="For icon-only buttons in dense tools, which always carry an aria-label too. On public screens, show the word instead.">
        <Preview>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Print">
                <Printer aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Print</TooltipContent>
          </Tooltip>
        </Preview>
        <Code title="usage">{`import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"   // provider is in app/layout.tsx

<Tooltip>
  <TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label="Print"><Printer /></Button></TooltipTrigger>
  <TooltipContent>Print</TooltipContent>
</Tooltip>`}</Code>
      </Section>
    </>
  );
}

/* ───────────────────────── Patterns ───────────────────────── */

const QUEUE = [
  { id: "REQ-0412", name: "Ada Lovelace", type: "Refund", time: "08:14", tone: "neutral", status: "New", icon: Pencil, fresh: true },
  { id: "REQ-0411", name: "Grace Hopper", type: "Invoice change", time: "07:52", tone: "info", status: "In review", icon: FileSearch, fresh: false },
  { id: "REQ-0409", name: "Alan Turing", type: "Plan upgrade", time: "Yesterday", tone: "warning", status: "Waiting", icon: Hourglass, fresh: false },
  { id: "REQ-0405", name: "Katherine Johnson", type: "Refund", time: "Yesterday", tone: "error", status: "Rejected", icon: undefined, fresh: false },
] as const;

function Patterns() {
  const [filter, setFilter] = React.useState("all");

  return (
    <>
      <Section id="lookup" title="Lookup" description="Find one record by id or name: a search pill with the round green button, then a status, a short timeline and what to do next.">
        <Preview className="py-10">
          <div className="mx-auto max-w-xl">
            <SearchPill label="Order number" placeholder="Order number, e.g. 4821" onSearch={(v) => v && toast(`Searching for ${v}`)} />
          </div>
        </Preview>
        <Caption>In a product: order tracking, ticket lookup, certificate verification.</Caption>
        <Code title="usage">{`import { SearchPill } from "@/components/search-pill"

<SearchPill label="Order number" placeholder="Order number, e.g. 4821" onSearch={(q) => router.push(\`/orders/\${q}\`)} />`}</Code>
      </Section>

      <Section id="work-queue" title="Work queue" description="Denser: 16px text, 44px buttons. Filter chips with counts; new rows get a soft “New” badge. Filtering, sorting and selecting never animate.">
        <Preview className="flex flex-col gap-4 p-0">
          <div className="flex flex-wrap gap-2 px-6 pt-6">
            {(
              [
                ["all", "All", 18],
                ["review", "To review", 7],
                ["waiting", "Waiting", 3],
                ["rejected", "Rejected", 1],
              ] as const
            ).map(([key, label, count]) => (
              <FilterChip key={key} active={filter === key} count={count} onClick={() => setFilter(key)}>
                {label}
              </FilterChip>
            ))}
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">ID</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead className="pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {QUEUE.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="pl-6 font-mono text-sm">{r.id}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2 font-semibold text-heading">
                        {r.name}
                        {r.fresh && <Badge>New</Badge>}
                      </span>
                    </TableCell>
                    <TableCell>{r.type}</TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{r.time}</TableCell>
                    <TableCell className="pr-6">
                      <StatusTag tone={r.tone} icon={r.icon}>{r.status}</StatusTag>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Preview>
        <Caption>In a product: support inbox, approvals, moderation, admin lists.</Caption>
        <Code title="usage">{`import { FilterChip } from "@/components/choice"
import { Badge } from "@/components/ui/badge"

<FilterChip active={filter === "review"} count={7} onClick={() => setFilter("review")}>To review</FilterChip>
<Badge>New</Badge>   {/* variant: "default" (soft navy) | "secondary" | "outline" | … */}`}</Code>
      </Section>
    </>
  );
}

function useActiveSection() {
  const [active, setActive] = React.useState<string>("colors");
  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return active;
}
