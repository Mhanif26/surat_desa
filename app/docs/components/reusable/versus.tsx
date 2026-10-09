"use client";

import * as React from "react";
import { Archive, Bold, ChevronDown, Italic, Printer, Reply, Trash2, Underline } from "lucide-react";
import { toast } from "sonner";
import { ClientOnly } from "@/components/client-only";
import { WhenVisible } from "@/components/when-visible";
import { Poll } from "@/components/poll";
import type { PollId } from "@/lib/polls";

// ── shadcn (components/ui, restyled to IT-2023) ──
import * as S from "@/components/ui/accordion";
import * as SAD from "@/components/ui/alert-dialog";
import * as SAV from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import * as SBC from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import * as SCA from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import * as SCL from "@/components/ui/collapsible";
import * as SCB from "@/components/ui/combobox";
import * as SCM from "@/components/ui/command";
import * as SCX from "@/components/ui/context-menu";
import * as SD from "@/components/ui/dialog";
import * as SDR from "@/components/ui/drawer";
import * as SDM from "@/components/ui/dropdown-menu";
import * as SHC from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import * as SOTP from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import * as SPO from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import * as SS from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import * as ST from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import * as STT from "@/components/ui/tooltip";

// ── iconiq (components/iconiq, untouched) ──
import { Accordion as IAccordion } from "@/components/iconiq/r-accordion";
import * as IAD from "@/components/iconiq/r-alert-dialog";
import { Avatar as IAvatar } from "@/components/iconiq/r-avatar";
import { Badge as IBadge } from "@/components/iconiq/badge";
import { Breadcrumbs as IBreadcrumbs } from "@/components/iconiq/breadcrumbs";
import { Button as IGButton, ButtonGroup as IButtonGroup } from "@/components/iconiq/button-group";
import { Calendar as ICalendar } from "@/components/iconiq/calendar";
import * as ICA from "@/components/iconiq/carousel";
import { Checkbox as ICheckbox } from "@/components/iconiq/r-checkbox";
import * as ICL from "@/components/iconiq/r-collapsible";
import { Combobox as ICombobox } from "@/components/iconiq/combobox";
import { CommandPalette } from "@/components/iconiq/command-palette";
import { ContextMenu as IContextMenu } from "@/components/iconiq/context-menu";
import * as ID from "@/components/iconiq/r-dialog";
import * as IDR from "@/components/iconiq/drawer";
import * as IDM from "@/components/iconiq/r-dropdown";
import * as IHC from "@/components/iconiq/r-hover-card";
import { Input as IInput } from "@/components/iconiq/input";
import { OTP, OTPSlots } from "@/components/iconiq/input-otp";
import * as IPO from "@/components/iconiq/r-popover";
import { Progress as IProgress } from "@/components/iconiq/r-progress";
import { RadioGroup as IRadioGroup } from "@/components/iconiq/r-radio-group";
import * as IS from "@/components/iconiq/r-select";
import { Skeleton as ISkeleton } from "@/components/iconiq/skeleton";
import { Slider as ISlider } from "@/components/iconiq/r-slider";
import { Spinner as ISpinner } from "@/components/iconiq/spinner";
import { Switch as ISwitch } from "@/components/iconiq/r-switch";
import * as IT from "@/components/iconiq/r-tabs";
import { ToggleGroup as IToggleGroup, ToggleGroupItem as IToggleGroupItem } from "@/components/iconiq/r-togglegroup";
import { Tooltip as ITooltip } from "@/components/iconiq/r-tooltip";

// ── merged (components/merged: shadcn structure + IT-2023 tokens + iconiq-style motion) ──
import { Checkbox as MCheckbox, RadioGroup as MRadioGroup, Segmented as MSegmented, Slider as MSlider, Switch as MSwitch } from "@/components/merged/controls";
import { Accordion as MAccordion, Collapsible as MCollapsible, Dialog as MDialog, OneTimeCode as MOneTimeCode, Progress as MProgress, Tabs as MTabs } from "@/components/merged/disclosure";

type Pair = {
  id: PollId;
  name: string;
  shadcnNote: string;
  iconiqNote: string;
  shadcn: React.ReactNode;
  iconiq: React.ReactNode;
};

/* ───────── shared demo data ───────── */

const FAQ = [
  { id: "plans", title: "Can I change plans later?", content: "Yes. Changes apply from your next billing date." },
  { id: "data", title: "Where is my data stored?", content: "In the region you picked when creating the workspace." },
];
const COUNTRIES = [
  ["id", "Indonesia"],
  ["jp", "Japan"],
  ["nl", "Netherlands"],
  ["us", "United States"],
] as const;
const COUNTRY_LABEL: Record<string, string> = Object.fromEntries(COUNTRIES);
const FRAMEWORKS = ["Next.js", "Remix", "Astro", "SvelteKit", "Nuxt"];
const FRAMEWORK_OPTIONS = FRAMEWORKS.map((f) => ({ value: f, label: f }));
const DELIVERY = [
  { value: "standard", label: "Standard", description: "Tracked, 3–5 business days." },
  { value: "express", label: "Express", description: "Next business day where available." },
  { value: "pickup", label: "Pickup point", description: "Collect when it suits you." },
];
const SLIDES = ["Invite your team", "Connect your data", "Ship your first report"];
const FORMATS = [
  ["bold", "Bold", Bold],
  ["italic", "Italic", Italic],
  ["underline", "Underline", Underline],
] as const;
const CAL_FALLBACK = <div className="h-80 w-72 rounded-xl bg-surface-strong" aria-hidden="true" />;

/** Merged versions that exist today. Everything else shows its merge plan and can still get the vote. */
const MERGED: Partial<Record<PollId, { note: string; demo: React.ReactNode }>> = {
  "vs-switch": {
    note: "Radix switch on our 48×28 track; the thumb glides on a spring and stretches while pressed.",
    demo: (
      <Label className="flex items-center justify-between gap-3 text-base font-normal text-body">
        Email me when an order ships
        <MSwitch defaultChecked />
      </Label>
    ),
  },
  "vs-checkbox": {
    note: "Our 20px box; the check draws itself in 200ms.",
    demo: (
      <Label className="flex min-h-11 items-center gap-3 text-base font-normal text-body">
        <MCheckbox defaultChecked /> I agree to the terms of service
      </Label>
    ),
  },
  "vs-radio-group": {
    note: "Our rows and three selection signals; the highlight slides to the chosen row.",
    demo: <MRadioGroup aria-label="Delivery" options={DELIVERY} defaultValue="standard" />,
  },
  "vs-toggle-group": {
    note: "Segmented control: a soft navy pill slides under the pressed option.",
    demo: (
      <MSegmented
        aria-label="Range"
        defaultValue="month"
        options={[
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
          { value: "year", label: "Year" },
        ]}
      />
    ),
  },
  "vs-slider": {
    note: "Our track; the thumb lifts while dragged and shows its value above.",
    demo: <MSlider label="Seats" defaultValue={12} min={1} max={50} />,
  },
  "vs-tabs": {
    note: "Our underline tabs; the underline slides and the panel fades up 4px.",
    demo: (
      <MTabs
        defaultValue="open"
        tabs={[
          { value: "all", label: "All", content: <p className="text-muted-foreground">42 tickets in total.</p> },
          { value: "open", label: "Open", content: <p className="text-muted-foreground">27 open tickets.</p> },
          { value: "closed", label: "Closed", content: <p className="text-muted-foreground">15 closed this week.</p> },
        ]}
      />
    ),
  },
  "vs-accordion": {
    note: "Grid-rows expand (no height animation), rotating chevron, content lifts in.",
    demo: <MAccordion items={FAQ} />,
  },
  "vs-collapsible": {
    note: "Same expand as the accordion, behind our ghost button.",
    demo: <MCollapsible title="Advanced settings">Webhooks, API keys and audit log.</MCollapsible>,
  },
  "vs-progress": {
    note: "Spring-eased fill, bar or ring, transform only.",
    demo: <MergedProgressDemo />,
  },
  "vs-input-otp": {
    note: "Our 48px slots; digits pop in, a caret shows in the active slot.",
    demo: <MOneTimeCode label="Verification code" onComplete={(c) => toast(`Checking ${c}…`)} />,
  },
  "vs-dialog": {
    note: "Our dialog; springs in from center over the navy scrim and leaves the way it came.",
    demo: (
      <MDialog
        trigger={<Button variant="outline">Rename project</Button>}
        title="Rename project"
        description="Everyone with access sees the new name."
        footer={(close) => (
          <>
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button onClick={close}>Save</Button>
          </>
        )}
      >
        <Input defaultValue="Website redesign" aria-label="Project name" />
      </MDialog>
    ),
  },
};

/** What a merge would combine, for pairs not built yet. A "merge" vote moves it up the queue. */
const MERGE_PLAN: Partial<Record<PollId, string>> = {
  "vs-input": "Our 48px field + FormField wiring, with iconiq's spring caret.",
  "vs-combobox": "shadcn's Base UI combobox (chips, a11y), with iconiq's item descriptions and sliding highlight.",
  "vs-select": "Radix select on our trigger, with iconiq's staggered options and sliding highlight.",
  "vs-button-group": "Our 48px buttons joined, with iconiq's click ripple.",
  "vs-command": "cmdk list (fast, a11y), with iconiq's palette shell: trigger, ⌘K, recent items.",
  "vs-calendar": "react-day-picker (ranges, locales), with iconiq's animated month change.",
  "vs-popover": "Radix popover from the trigger, with a spring entrance instead of keyframes.",
  "vs-hover-card": "Radix hover card, spring entrance, instant open on keyboard focus.",
  "vs-dropdown": "Radix menu with our 44px rows, staggered row entrance and a sliding highlight.",
  "vs-context-menu": "Radix context menu, with iconiq's viewport-aware placement and row motion.",
  "vs-alert-dialog": "Our alert dialog, with the merged dialog's spring entrance.",
  "vs-drawer": "Vaul sheet with our handle, plus iconiq's header media and Action / Cancel parts.",
  "vs-tooltip": "Radix tooltip parts, with a spring scale from the trigger.",
  "vs-badge": "Our badge and tones, with iconiq's dot variant (no shimmer, per the rules).",
  "vs-avatar": "shadcn avatar groups and presence badge, with iconiq's spring load-in.",
  "vs-breadcrumb": "shadcn parts, with iconiq's auto-collapse menu and JSON-LD.",
  "vs-spinner": "Our Lucide spinner plus iconiq's dots variant for inline waits.",
  "vs-skeleton": "Ours (300ms delay, no shimmer), with iconiq's shape presets.",
  "vs-carousel": "Embla with our arrows, plus iconiq's aspect presets and responsive nav.",
};

/* ───────── pairs ───────── */

const GROUPS: { title: string; pairs: Pair[] }[] = [
  {
    title: "Inputs & forms",
    pairs: [
      {
        id: "vs-input",
        name: "Input",
        shadcnNote: "48px field on our tokens; label and hint come from FormField.",
        iconiqNote: "Spring-animated caret; label, description and error built in.",
        shadcn: (
          <div className="flex flex-col gap-2">
            <Label htmlFor="vs-email">Email</Label>
            <Input id="vs-email" type="email" placeholder="ada@example.com" />
          </div>
        ),
        iconiq: <IInput label="Email" type="email" placeholder="ada@example.com" description="We never share it." />,
      },
      {
        id: "vs-combobox",
        name: "Combobox",
        shadcnNote: "Base UI combobox: type to filter, chips for multi-select.",
        iconiqNote: "Fuzzy matching, item descriptions, clear button, springy list.",
        shadcn: (
          <SCB.Combobox items={FRAMEWORKS}>
            <SCB.ComboboxInput placeholder="Pick a framework" aria-label="Framework" />
            <SCB.ComboboxContent>
              <SCB.ComboboxEmpty>No framework found.</SCB.ComboboxEmpty>
              <SCB.ComboboxList>
                {(item: string) => (
                  <SCB.ComboboxItem key={item} value={item}>
                    {item}
                  </SCB.ComboboxItem>
                )}
              </SCB.ComboboxList>
            </SCB.ComboboxContent>
          </SCB.Combobox>
        ),
        iconiq: <IconiqComboboxDemo />,
      },
      {
        id: "vs-select",
        name: "Select",
        shadcnNote: "48px trigger; menu grows from the trigger.",
        iconiqNote: "Staggered options, sliding highlight, label in the trigger.",
        shadcn: (
          <div className="flex flex-col gap-2">
            <Label htmlFor="vs-country">Country</Label>
            <SS.Select defaultValue="id">
              <SS.SelectTrigger id="vs-country" className="w-full">
                <SS.SelectValue />
              </SS.SelectTrigger>
              <SS.SelectContent>
                {COUNTRIES.map(([v, l]) => (
                  <SS.SelectItem key={v} value={v}>{l}</SS.SelectItem>
                ))}
              </SS.SelectContent>
            </SS.Select>
          </div>
        ),
        iconiq: (
          <IS.Select defaultValue="id">
            <IS.SelectTrigger label="Country" className="w-full">
              {/* iconiq prints the raw value unless you map it to a label */}
              <IS.SelectValue>{(v?: string) => COUNTRY_LABEL[v ?? ""]}</IS.SelectValue>
            </IS.SelectTrigger>
            <IS.SelectContent>
              {COUNTRIES.map(([v, l]) => (
                <IS.SelectItem key={v} value={v}>{l}</IS.SelectItem>
              ))}
            </IS.SelectContent>
          </IS.Select>
        ),
      },
      {
        id: "vs-input-otp",
        name: "One-time code",
        shadcnNote: "48px slots, plain caret.",
        iconiqNote: "Digits pop in, pulsing caret, label and description built in.",
        shadcn: (
          <div className="flex flex-col gap-2">
            <Label>Verification code</Label>
            <SOTP.InputOTP maxLength={6}>
              <SOTP.InputOTPGroup>
                {[0, 1, 2].map((i) => <SOTP.InputOTPSlot key={i} index={i} />)}
              </SOTP.InputOTPGroup>
              <SOTP.InputOTPSeparator />
              <SOTP.InputOTPGroup>
                {[3, 4, 5].map((i) => <SOTP.InputOTPSlot key={i} index={i} />)}
              </SOTP.InputOTPGroup>
            </SOTP.InputOTP>
          </div>
        ),
        iconiq: (
          <OTP length={6} label="Verification code" description="Sent to •••• 4821.">
            <OTPSlots separatorAfter={3} />
          </OTP>
        ),
      },
      {
        id: "vs-checkbox",
        name: "Checkbox",
        shadcnNote: "Instant check, wrap it in a 44px Label row.",
        iconiqNote: "Line-drawn check; label, description and sizes built in.",
        shadcn: (
          <Label className="flex min-h-11 items-center gap-3 text-base font-normal text-body">
            <Checkbox defaultChecked /> I agree to the terms of service
          </Label>
        ),
        iconiq: <ICheckbox defaultChecked label="I agree to the terms of service" size="lg" />,
      },
      {
        id: "vs-radio-group",
        name: "Radio group",
        shadcnNote: "Compound items; you lay out rows and labels.",
        iconiqNote: "Options array, animated rows with descriptions.",
        shadcn: (
          <RadioGroup defaultValue="standard" aria-label="Delivery">
            {DELIVERY.map((d) => (
              <Label key={d.value} className="flex min-h-11 items-start gap-3 text-base font-normal text-body">
                <RadioGroupItem value={d.value} className="mt-1" />
                <span>
                  <span className="font-semibold text-heading">{d.label}</span>
                  <span className="block text-sm text-muted-foreground">{d.description}</span>
                </span>
              </Label>
            ))}
          </RadioGroup>
        ),
        iconiq: <IRadioGroup label="Delivery" options={DELIVERY} defaultValue="standard" />,
      },
      {
        id: "vs-switch",
        name: "Switch",
        shadcnNote: "CSS transition, 48×28 track.",
        iconiqNote: "Spring thumb that squashes on press; label built in.",
        shadcn: (
          <Label className="flex items-center justify-between gap-3 text-base font-normal text-body">
            Email me when an order ships
            <Switch defaultChecked />
          </Label>
        ),
        iconiq: <ISwitch defaultChecked label="Email me when an order ships" description="One email per order." />,
      },
      {
        id: "vs-slider",
        name: "Slider",
        shadcnNote: "Plain range; you render label and value.",
        iconiqNote: "Spring thumb, value readout, tick marks.",
        shadcn: <ShadcnSlider />,
        iconiq: <ISlider defaultValue={12} min={1} max={50} label="Seats" showValue marks={[{ value: 1 }, { value: 25 }, { value: 50 }]} />,
      },
    ],
  },
  {
    title: "Actions",
    pairs: [
      {
        id: "vs-button-group",
        name: "Button group",
        shadcnNote: "Joins our buttons; full 48px targets.",
        iconiqNote: "Compact toolbar buttons with a click ripple.",
        shadcn: (
          <ButtonGroup>
            <Button variant="outline"><Reply aria-hidden="true" /> Reply</Button>
            <Button variant="outline"><Archive aria-hidden="true" /> Archive</Button>
            <Button variant="outline" aria-label="Delete"><Trash2 aria-hidden="true" /></Button>
          </ButtonGroup>
        ),
        iconiq: (
          <IButtonGroup>
            <IGButton><Reply aria-hidden="true" /> Reply</IGButton>
            <IGButton><Archive aria-hidden="true" /> Archive</IGButton>
            <IGButton variant="destructive"><Trash2 aria-hidden="true" /> Delete</IGButton>
          </IButtonGroup>
        ),
      },
      {
        id: "vs-toggle-group",
        name: "Toggle group",
        shadcnNote: "Instant pressed state.",
        iconiqNote: "Fluid wipe fill and sheen when a toggle turns on.",
        shadcn: (
          <ToggleGroup type="multiple" variant="outline" defaultValue={["bold"]} aria-label="Text formatting">
            {FORMATS.map(([v, l, Icon]) => (
              <ToggleGroupItem key={v} value={v} aria-label={l}><Icon aria-hidden="true" /></ToggleGroupItem>
            ))}
          </ToggleGroup>
        ),
        iconiq: (
          <IToggleGroup type="multiple" variant="outline" defaultValue={["bold"]} aria-label="Text formatting">
            {FORMATS.map(([v, l, Icon]) => (
              <IToggleGroupItem key={v} value={v} aria-label={l}><Icon className="size-4" aria-hidden="true" /></IToggleGroupItem>
            ))}
          </IToggleGroup>
        ),
      },
      {
        id: "vs-command",
        name: "Command menu",
        shadcnNote: "cmdk list you embed or put in a dialog.",
        iconiqNote: "Full palette: trigger, ⌘K shortcut, recent items, async search.",
        shadcn: (
          <WhenVisible minHeight={260}>
          <SCM.Command className="rounded-xl border border-hairline">
            <SCM.CommandInput placeholder="Search…" />
            <SCM.CommandList>
              <SCM.CommandEmpty>No results.</SCM.CommandEmpty>
              <SCM.CommandGroup heading="Go to">
                <SCM.CommandItem>Dashboard</SCM.CommandItem>
                <SCM.CommandItem>Invoices</SCM.CommandItem>
                <SCM.CommandItem>Settings</SCM.CommandItem>
              </SCM.CommandGroup>
            </SCM.CommandList>
          </SCM.Command>
          </WhenVisible>
        ),
        iconiq: (
          <CommandPalette
            placeholder="Search…"
            enableGlobalShortcut={false}
            onSelect={(item) => toast(`Opened ${item.label}`)}
            groups={[
              { heading: "Go to", items: [{ label: "Dashboard" }, { label: "Invoices" }, { label: "Settings" }] },
              { heading: "Actions", items: [{ label: "Create invoice", shortcut: "N" }, { label: "Invite teammate" }] },
            ]}
          />
        ),
      },
    ],
  },
  {
    title: "Date",
    pairs: [
      {
        id: "vs-calendar",
        name: "Calendar",
        shadcnNote: "react-day-picker; ranges, multiple months.",
        iconiqNote: "Animated month changes, direct month/year picking.",
        shadcn: <ShadcnCalendar />,
        iconiq: (
          <ClientOnly fallback={CAL_FALLBACK}>
            <ICalendar />
          </ClientOnly>
        ),
      },
    ],
  },
  {
    title: "Overlays",
    pairs: [
      {
        id: "vs-dialog",
        name: "Dialog",
        shadcnNote: "Scale + fade over a navy scrim; sheet on phones via ResponsiveDialog.",
        iconiqNote: "Spring entrance with a blurred backdrop; Action / Cancel built in.",
        shadcn: (
          <SD.Dialog>
            <SD.DialogTrigger asChild><Button variant="outline">Rename project</Button></SD.DialogTrigger>
            <SD.DialogContent>
              <SD.DialogHeader>
                <SD.DialogTitle>Rename project</SD.DialogTitle>
                <SD.DialogDescription>Everyone with access sees the new name.</SD.DialogDescription>
              </SD.DialogHeader>
              <Input defaultValue="Website redesign" aria-label="Project name" />
              <SD.DialogFooter showCloseButton><Button>Save</Button></SD.DialogFooter>
            </SD.DialogContent>
          </SD.Dialog>
        ),
        iconiq: (
          <ID.Dialog>
            <ID.DialogTrigger asChild><Button variant="outline">Rename project</Button></ID.DialogTrigger>
            <ID.DialogContent>
              <ID.DialogHeader>
                <ID.DialogTitle>Rename project</ID.DialogTitle>
                <ID.DialogDescription>Everyone with access sees the new name.</ID.DialogDescription>
              </ID.DialogHeader>
              <ID.DialogFooter>
                <ID.DialogCancel>Cancel</ID.DialogCancel>
                <ID.DialogAction>Save</ID.DialogAction>
              </ID.DialogFooter>
            </ID.DialogContent>
          </ID.Dialog>
        ),
      },
      {
        id: "vs-alert-dialog",
        name: "Alert dialog",
        shadcnNote: "Blocking confirm; navy scrim, no outside-press close.",
        iconiqNote: "Spring entrance, optional media slot, async action support.",
        shadcn: (
          <SAD.AlertDialog>
            <SAD.AlertDialogTrigger asChild><Button variant="destructive-outline">Delete project</Button></SAD.AlertDialogTrigger>
            <SAD.AlertDialogContent>
              <SAD.AlertDialogHeader>
                <SAD.AlertDialogTitle>Delete “Website redesign”?</SAD.AlertDialogTitle>
                <SAD.AlertDialogDescription>Its 48 tasks are deleted too. You can’t undo this.</SAD.AlertDialogDescription>
              </SAD.AlertDialogHeader>
              <SAD.AlertDialogFooter>
                <SAD.AlertDialogCancel>Cancel</SAD.AlertDialogCancel>
                <SAD.AlertDialogAction>Delete project</SAD.AlertDialogAction>
              </SAD.AlertDialogFooter>
            </SAD.AlertDialogContent>
          </SAD.AlertDialog>
        ),
        iconiq: (
          <IAD.AlertDialog>
            <IAD.AlertDialogTrigger asChild><Button variant="destructive-outline">Delete project</Button></IAD.AlertDialogTrigger>
            <IAD.AlertDialogContent>
              <IAD.AlertDialogHeader>
                <IAD.AlertDialogTitle>Delete “Website redesign”?</IAD.AlertDialogTitle>
                <IAD.AlertDialogDescription>Its 48 tasks are deleted too. You can’t undo this.</IAD.AlertDialogDescription>
              </IAD.AlertDialogHeader>
              <IAD.AlertDialogFooter>
                <IAD.AlertDialogCancel>Cancel</IAD.AlertDialogCancel>
                <IAD.AlertDialogAction>Delete project</IAD.AlertDialogAction>
              </IAD.AlertDialogFooter>
            </IAD.AlertDialogContent>
          </IAD.AlertDialog>
        ),
      },
      {
        id: "vs-drawer",
        name: "Drawer",
        shadcnNote: "Vaul sheet with grab handle, navy scrim.",
        iconiqNote: "Vaul too; header media, Action / Cancel, size presets.",
        shadcn: (
          <SDR.Drawer>
            <SDR.DrawerTrigger asChild><Button variant="outline">Filters</Button></SDR.DrawerTrigger>
            <SDR.DrawerContent>
              <SDR.DrawerHeader>
                <SDR.DrawerTitle>Filters</SDR.DrawerTitle>
                <SDR.DrawerDescription>Narrow the list of orders.</SDR.DrawerDescription>
              </SDR.DrawerHeader>
              <SDR.DrawerFooter>
                <SDR.DrawerClose asChild><Button>Show 27 orders</Button></SDR.DrawerClose>
              </SDR.DrawerFooter>
            </SDR.DrawerContent>
          </SDR.Drawer>
        ),
        iconiq: (
          <IDR.Drawer>
            <IDR.DrawerTrigger asChild><Button variant="outline">Filters</Button></IDR.DrawerTrigger>
            <IDR.DrawerContent>
              <IDR.DrawerHeader>
                <IDR.DrawerTitle>Filters</IDR.DrawerTitle>
                <IDR.DrawerDescription>Narrow the list of orders.</IDR.DrawerDescription>
              </IDR.DrawerHeader>
              <IDR.DrawerFooter>
                <IDR.DrawerCancel>Cancel</IDR.DrawerCancel>
                <IDR.DrawerAction>Show 27 orders</IDR.DrawerAction>
              </IDR.DrawerFooter>
            </IDR.DrawerContent>
          </IDR.Drawer>
        ),
      },
      {
        id: "vs-popover",
        name: "Popover",
        shadcnNote: "Grows from the trigger, shadow-float.",
        iconiqNote: "Spring scale with a directional offset.",
        shadcn: (
          <SPO.Popover>
            <SPO.PopoverTrigger asChild><Button variant="outline">Share</Button></SPO.PopoverTrigger>
            <SPO.PopoverContent className="w-80">
              <p className="font-semibold text-heading">Share this report</p>
              <Input defaultValue="https://acme.example.com/r/4821" readOnly aria-label="Link" />
            </SPO.PopoverContent>
          </SPO.Popover>
        ),
        iconiq: (
          <IPO.Popover>
            <IPO.PopoverTrigger asChild><Button variant="outline">Share</Button></IPO.PopoverTrigger>
            <IPO.PopoverContent className="w-80">
              <p className="font-semibold text-heading">Share this report</p>
              <p className="mt-1 truncate text-sm text-muted-foreground">https://acme.example.com/r/4821</p>
            </IPO.PopoverContent>
          </IPO.Popover>
        ),
      },
      {
        id: "vs-hover-card",
        name: "Hover card",
        shadcnNote: "Delayed hover preview.",
        iconiqNote: "Spring callout; opens instantly on keyboard focus.",
        shadcn: (
          <SHC.HoverCard>
            <SHC.HoverCardTrigger asChild><a href="#vs-hover-card" className="font-semibold text-primary underline underline-offset-4">@ada</a></SHC.HoverCardTrigger>
            <SHC.HoverCardContent>
              <p className="font-semibold text-heading">Ada Lovelace</p>
              <p className="text-sm text-muted-foreground">Engineering · joined March 2024</p>
            </SHC.HoverCardContent>
          </SHC.HoverCard>
        ),
        iconiq: (
          <IHC.HoverCard>
            <IHC.HoverCardTrigger asChild><a href="#vs-hover-card" className="font-semibold text-primary underline underline-offset-4">@ada</a></IHC.HoverCardTrigger>
            <IHC.HoverCardContent>
              <p className="font-semibold text-heading">Ada Lovelace</p>
              <p className="text-sm text-muted-foreground">Engineering · joined March 2024</p>
            </IHC.HoverCardContent>
          </IHC.HoverCard>
        ),
      },
      {
        id: "vs-dropdown",
        name: "Dropdown",
        shadcnNote: "Radix menu, 44px rows, grows from trigger.",
        iconiqNote: "Select or action mode, staggered rows, sliding highlight.",
        shadcn: (
          <SDM.DropdownMenu>
            <SDM.DropdownMenuTrigger asChild><Button variant="outline">Team <ChevronDown aria-hidden="true" /></Button></SDM.DropdownMenuTrigger>
            <SDM.DropdownMenuContent align="start">
              <SDM.DropdownMenuItem>Design</SDM.DropdownMenuItem>
              <SDM.DropdownMenuItem>Engineering</SDM.DropdownMenuItem>
              <SDM.DropdownMenuItem>Marketing</SDM.DropdownMenuItem>
            </SDM.DropdownMenuContent>
          </SDM.DropdownMenu>
        ),
        iconiq: (
          <IDM.Dropdown variant="select" defaultValue="design">
            <IDM.DropdownTrigger><IDM.DropdownValue placeholder="Choose a team" /></IDM.DropdownTrigger>
            <IDM.DropdownContent>
              <IDM.DropdownItem value="design">Design</IDM.DropdownItem>
              <IDM.DropdownItem value="engineering">Engineering</IDM.DropdownItem>
              <IDM.DropdownItem value="marketing">Marketing</IDM.DropdownItem>
            </IDM.DropdownContent>
          </IDM.Dropdown>
        ),
      },
      {
        id: "vs-context-menu",
        name: "Context menu",
        shadcnNote: "Right-click / long-press menu, compound parts.",
        iconiqNote: "Items array, viewport-aware placement, row entrance motion.",
        shadcn: (
          <SCX.ContextMenu>
            <SCX.ContextMenuTrigger className="grid h-28 place-items-center rounded-xl border border-dashed border-input text-sm text-muted-foreground">
              Right-click or long-press here
            </SCX.ContextMenuTrigger>
            <SCX.ContextMenuContent className="w-52">
              <SCX.ContextMenuItem>Open</SCX.ContextMenuItem>
              <SCX.ContextMenuItem>Rename</SCX.ContextMenuItem>
              <SCX.ContextMenuSeparator />
              <SCX.ContextMenuItem variant="destructive">Delete</SCX.ContextMenuItem>
            </SCX.ContextMenuContent>
          </SCX.ContextMenu>
        ),
        iconiq: (
          <IContextMenu
            items={[
              { label: "Open", shortcut: "↵" },
              { label: "Rename", shortcut: "R", separatorAfter: true },
              { label: "Delete", destructive: true, onSelect: () => toast("Deleted") },
            ]}
          >
            <div className="grid h-28 place-items-center rounded-xl border border-dashed border-input text-sm text-muted-foreground">
              Right-click or long-press here
            </div>
          </IContextMenu>
        ),
      },
      {
        id: "vs-tooltip",
        name: "Tooltip",
        shadcnNote: "Compound parts, navy pill.",
        iconiqNote: "One component with a content string; spring in.",
        shadcn: (
          <STT.Tooltip>
            <STT.TooltipTrigger asChild><Button variant="outline" size="icon" aria-label="Print"><Printer aria-hidden="true" /></Button></STT.TooltipTrigger>
            <STT.TooltipContent>Print</STT.TooltipContent>
          </STT.Tooltip>
        ),
        iconiq: (
          <ITooltip content="Print">
            <Button variant="outline" size="icon" aria-label="Print"><Printer aria-hidden="true" /></Button>
          </ITooltip>
        ),
      },
    ],
  },
  {
    title: "Display & feedback",
    pairs: [
      {
        id: "vs-badge",
        name: "Badge",
        shadcnNote: "Soft navy pill; tones live in StatusTag.",
        iconiqNote: "Tinted colors, shimmer, a quieter dot variant.",
        shadcn: (
          <div className="flex flex-wrap gap-2">
            <Badge>New</Badge>
            <Badge variant="secondary">Draft</Badge>
            <Badge variant="outline">v2.4</Badge>
          </div>
        ),
        iconiq: (
          <div className="flex flex-wrap gap-2">
            <IBadge>New</IBadge>
            <IBadge variant="dot" color="success">Live</IBadge>
            <IBadge color="warning">Beta</IBadge>
          </div>
        ),
      },
      {
        id: "vs-avatar",
        name: "Avatar",
        shadcnNote: "Image + fallback, groups and a presence badge.",
        iconiqNote: "Spring load-in, initials from the name.",
        shadcn: (
          <SAV.AvatarGroup>
            {["AL", "GH", "AT"].map((i) => (
              <SAV.Avatar key={i}><SAV.AvatarFallback>{i}</SAV.AvatarFallback></SAV.Avatar>
            ))}
          </SAV.AvatarGroup>
        ),
        iconiq: (
          <div className="flex gap-2">
            <IAvatar name="Ada Lovelace" />
            <IAvatar name="Grace Hopper" />
            <IAvatar name="Alan Turing" />
          </div>
        ),
      },
      {
        id: "vs-progress",
        name: "Progress",
        shadcnNote: "8px bar, transform-only fill.",
        iconiqNote: "Bar or circular, tones, indeterminate motion.",
        shadcn: <Progress value={62} aria-label="Import progress" />,
        iconiq: (
          <div className="flex items-center gap-6">
            <IProgress value={62} className="flex-1" aria-label="Import progress" />
            <IProgress value={62} variant="circular" aria-label="Import progress" />
          </div>
        ),
      },
      {
        id: "vs-spinner",
        name: "Spinner",
        shadcnNote: "One Lucide loader icon.",
        iconiqNote: "Ring, bouncing dots or a dot-matrix sweep.",
        shadcn: <Spinner className="size-6" />,
        iconiq: (
          <div className="flex items-center gap-6">
            <ISpinner variant="ring" />
            <ISpinner variant="dots" />
            <ISpinner variant="matrix" />
          </div>
        ),
      },
      {
        id: "vs-skeleton",
        name: "Skeleton",
        shadcnNote: "Appears after 300ms, no shimmer (per the rules).",
        iconiqNote: "Shimmer or fade, shape presets.",
        shadcn: <SkeletonCard Block={Skeleton} />,
        iconiq: <SkeletonCard Block={ISkeleton} />,
      },
      {
        id: "vs-breadcrumb",
        name: "Breadcrumb",
        shadcnNote: "Compound parts you compose.",
        iconiqNote: "Items array, auto-collapse, optional JSON-LD for SEO.",
        shadcn: (
          <SBC.Breadcrumb>
            <SBC.BreadcrumbList>
              <SBC.BreadcrumbItem><SBC.BreadcrumbLink href="#vs-breadcrumb">Workspace</SBC.BreadcrumbLink></SBC.BreadcrumbItem>
              <SBC.BreadcrumbSeparator />
              <SBC.BreadcrumbItem><SBC.BreadcrumbLink href="#vs-breadcrumb">Projects</SBC.BreadcrumbLink></SBC.BreadcrumbItem>
              <SBC.BreadcrumbSeparator />
              <SBC.BreadcrumbItem><SBC.BreadcrumbPage>Website redesign</SBC.BreadcrumbPage></SBC.BreadcrumbItem>
            </SBC.BreadcrumbList>
          </SBC.Breadcrumb>
        ),
        iconiq: (
          <IBreadcrumbs
            items={[
              { label: "Workspace", href: "#vs-breadcrumb" },
              { label: "Projects", href: "#vs-breadcrumb" },
              { label: "Website redesign" },
            ]}
          />
        ),
      },
    ],
  },
  {
    title: "Layout",
    pairs: [
      {
        id: "vs-tabs",
        name: "Tabs",
        shadcnNote: "Underline, switches instantly.",
        iconiqNote: "Segmented pill that slides to the active tab.",
        shadcn: (
          <ST.Tabs defaultValue="open">
            <ST.TabsList>
              <ST.TabsTrigger value="all">All</ST.TabsTrigger>
              <ST.TabsTrigger value="open">Open</ST.TabsTrigger>
              <ST.TabsTrigger value="closed">Closed</ST.TabsTrigger>
            </ST.TabsList>
            <ST.TabsContent value="all" className="pt-4 text-muted-foreground">42 tickets in total.</ST.TabsContent>
            <ST.TabsContent value="open" className="pt-4 text-muted-foreground">27 open tickets.</ST.TabsContent>
            <ST.TabsContent value="closed" className="pt-4 text-muted-foreground">15 closed this week.</ST.TabsContent>
          </ST.Tabs>
        ),
        iconiq: (
          <IT.Tabs defaultValue="open">
            <IT.TabsList>
              <IT.TabsTrigger value="all">All</IT.TabsTrigger>
              <IT.TabsTrigger value="open">Open</IT.TabsTrigger>
              <IT.TabsTrigger value="closed">Closed</IT.TabsTrigger>
            </IT.TabsList>
            <IT.TabsContent value="all" className="pt-4 text-muted-foreground">42 tickets in total.</IT.TabsContent>
            <IT.TabsContent value="open" className="pt-4 text-muted-foreground">27 open tickets.</IT.TabsContent>
            <IT.TabsContent value="closed" className="pt-4 text-muted-foreground">15 closed this week.</IT.TabsContent>
          </IT.Tabs>
        ),
      },
      {
        id: "vs-accordion",
        name: "Accordion",
        shadcnNote: "Keyframe height animation, compound parts.",
        iconiqNote: "Spring height with staggered text; items array.",
        shadcn: (
          <S.Accordion type="single" collapsible>
            {FAQ.map((f) => (
              <S.AccordionItem key={f.id} value={f.id}>
                <S.AccordionTrigger>{f.title}</S.AccordionTrigger>
                <S.AccordionContent>{f.content}</S.AccordionContent>
              </S.AccordionItem>
            ))}
          </S.Accordion>
        ),
        iconiq: <IAccordion items={FAQ} collapsible />,
      },
      {
        id: "vs-collapsible",
        name: "Collapsible",
        shadcnNote: "Show / hide, no built-in motion.",
        iconiqNote: "Animated height and rotating icon.",
        shadcn: (
          <SCL.Collapsible>
            <SCL.CollapsibleTrigger asChild><Button variant="ghost">Advanced settings <ChevronDown aria-hidden="true" /></Button></SCL.CollapsibleTrigger>
            <SCL.CollapsibleContent className="pt-2 text-muted-foreground">Webhooks, API keys and audit log.</SCL.CollapsibleContent>
          </SCL.Collapsible>
        ),
        iconiq: (
          <ICL.Collapsible>
            <ICL.CollapsibleTrigger>Advanced settings</ICL.CollapsibleTrigger>
            <ICL.CollapsibleContent><p className="pt-2 text-muted-foreground">Webhooks, API keys and audit log.</p></ICL.CollapsibleContent>
          </ICL.Collapsible>
        ),
      },
      {
        id: "vs-carousel",
        name: "Carousel",
        shadcnNote: "Embla with arrow buttons.",
        iconiqNote: "Embla, aspect presets, responsive nav, autoplay option.",
        shadcn: (
          <SCA.Carousel className="mx-12">
            <SCA.CarouselContent>
              {SLIDES.map((s) => (
                <SCA.CarouselItem key={s}><div className="grid h-32 place-items-center rounded-xl bg-canvas text-lg font-semibold text-heading">{s}</div></SCA.CarouselItem>
              ))}
            </SCA.CarouselContent>
            <SCA.CarouselPrevious />
            <SCA.CarouselNext />
          </SCA.Carousel>
        ),
        iconiq: (
          <ICA.Carousel>
            <ICA.CarouselContent>
              {SLIDES.map((s) => (
                <ICA.CarouselItem key={s}><div className="grid h-32 place-items-center rounded-xl bg-canvas text-lg font-semibold text-heading">{s}</div></ICA.CarouselItem>
              ))}
            </ICA.CarouselContent>
            <ICA.CarouselPrevious />
            <ICA.CarouselNext />
          </ICA.Carousel>
        ),
      },
    ],
  },
];

/* ───────── helpers ───────── */

// iconiq's Combobox is controlled-only: without value + onChange it never shows a choice.
function IconiqComboboxDemo() {
  const [value, setValue] = React.useState("");
  return <ICombobox options={FRAMEWORK_OPTIONS} value={value} onChange={setValue} placeholder="Pick a framework" clearable />;
}

function MergedProgressDemo() {
  const [v, setV] = React.useState(20);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6">
        <div className="flex-1"><MProgress value={v} label="Import progress" /></div>
        <MProgress value={v} label="Import progress" variant="ring" />
      </div>
      <Button variant="outline" size="sm" className="self-start" onClick={() => setV((x) => (x >= 100 ? 20 : Math.min(100, x + 30)))}>
        {v >= 100 ? "Reset" : "Advance"}
      </Button>
    </div>
  );
}

function ShadcnSlider() {
  const [v, setV] = React.useState([12]);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <Label>Seats</Label>
        <span className="text-lg font-semibold tabular-nums text-heading">{v[0]}</span>
      </div>
      <Slider value={v} onValueChange={setV} min={1} max={50} aria-label="Seats" />
    </div>
  );
}

function ShadcnCalendar() {
  const [d, setD] = React.useState<Date>();
  return (
    <ClientOnly fallback={CAL_FALLBACK}>
      <Calendar mode="single" selected={d} onSelect={setD} className="rounded-xl border border-hairline" />
    </ClientOnly>
  );
}

function SkeletonCard({ Block }: { Block: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-center gap-3" aria-busy="true" aria-label="Loading profile">
      <Block className="size-12 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Block className="h-4 w-40" />
        <Block className="h-3 w-24" />
      </div>
    </div>
  );
}


export function Versus() {
  return (
    <>
      {GROUPS.map((g) => (
        <div key={g.title}>
          <h3 className="mt-12 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{g.title}</h3>
          {g.pairs.map((p) => (
            <section key={p.id} id={p.id} className="mt-6 scroll-mt-24">
              <h4 className="text-lg font-semibold text-heading">{p.name}</h4>
              <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {(
                  [
                    ["shadcn", "components/ui", p.shadcnNote, p.shadcn],
                    ["iconiq", "components/iconiq", p.iconiqNote, p.iconiq],
                    MERGED[p.id]
                      ? ["merge", "components/merged", MERGED[p.id]!.note, MERGED[p.id]!.demo]
                      : ["merge", "not built yet", MERGE_PLAN[p.id] ?? "", <p key="plan" className="text-sm text-muted-foreground">Vote “merge” and this is built next: shadcn’s structure and tokens, iconiq’s motion.</p>],
                  ] as [string, string, string, React.ReactNode][]
                ).map(([lib, path, note, demo]) => (
                  <article key={lib} className="flex min-w-0 flex-col rounded-xl border border-hairline bg-white">
                    <header className="border-b border-hairline p-5">
                      <p className="flex items-baseline justify-between gap-3">
                        <span className="font-semibold text-heading">{lib}</span>
                        <code className="font-mono text-xs text-muted-foreground">{path}</code>
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{note}</p>
                    </header>
                    <div className="flex min-w-0 flex-1 flex-col justify-center p-6">{demo}</div>
                  </article>
                ))}
              </div>
              <div className="mt-4 max-w-xl">
                <Poll
                  id={p.id}
                  question={`${p.name}: which version should the template keep?`}
                  options={[
                    { id: "shadcn", label: "shadcn (restyled to IT-2023)" },
                    { id: "iconiq", label: "iconiq (restyled, its own motion)" },
                    { id: "merge", label: MERGED[p.id] ? "Merge (built, try it)" : "Merge (build it next)" },
                  ]}
                />
              </div>
            </section>
          ))}
        </div>
      ))}
    </>
  );
}
