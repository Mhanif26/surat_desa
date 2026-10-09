"use client";

// Sections for the second batch of shadcn components. Same structure as docs.tsx:
// preview, where it lives in a product, usage with the import, do / don’t where it matters.

import * as React from "react";
import { Archive, AtSign, Bold, CalendarIcon, ChevronDown, Copy, Inbox, Italic, Reply, Search, Trash2, Underline } from "lucide-react";
import { toast } from "sonner";
import { ClientOnly } from "@/components/client-only";
import { WhenVisible } from "@/components/when-visible";

import * as AD from "@/components/ui/alert-dialog";
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import * as BC from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import * as CA from "@/components/ui/carousel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import * as CB from "@/components/ui/combobox";
import * as CM from "@/components/ui/command";
import * as CX from "@/components/ui/context-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import * as PG from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import * as SH from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FormField } from "@/components/form-field";
import { Caption, Code, DoDont, Preview, Row, Section } from "../ui";

export const MORE_NAV = {
  forms: [["textarea", "Textarea"], ["input-group", "Input group"], ["input-otp", "One-time code"], ["combobox", "Combobox"], ["date-picker", "Date picker"]],
  actions: [["button-group", "Button group"], ["toggle-group", "Toggle group"], ["kbd", "Keyboard key"]],
  feedback: [["spinner", "Spinner"], ["empty", "Empty state"]],
  layout: [["avatar", "Avatar"], ["separator", "Separator"], ["scroll-area", "Scroll area"], ["collapsible", "Collapsible"], ["carousel", "Carousel"]],
  overlays: [["alert-dialog", "Alert dialog"], ["sheet", "Sheet"], ["popover", "Popover"], ["hover-card", "Hover card"], ["context-menu", "Context menu"], ["command", "Command menu"]],
  navigation: [["breadcrumb", "Breadcrumb"], ["pagination", "Pagination"]],
} as const;

/* ───────── Forms ───────── */

export function MoreForms() {
  const [date, setDate] = React.useState<Date>();
  return (
    <>
      <Section id="textarea" title="Textarea" description="For answers longer than one line. Grows with its content; wrap it in FormField like any input.">
        <Preview className="max-w-[640px]">
          <FormField label="What happened?" hint="Steps to reproduce help us fix it faster.">
            <Textarea placeholder="" />
          </FormField>
        </Preview>
        <Code title="usage">{`import { Textarea } from "@/components/ui/textarea"

<FormField label="What happened?" hint="Steps to reproduce help us fix it faster.">
  <Textarea />
</FormField>`}</Code>
      </Section>

      <Section id="input-group" title="Input group" description="An input with attached text, icons or buttons: a prefix, a unit, a copy button. One control, one border.">
        <Preview className="flex max-w-[640px] flex-col gap-4">
          <InputGroup>
            <InputGroupAddon><Search aria-hidden="true" /></InputGroupAddon>
            <InputGroupInput placeholder="Search invoices" aria-label="Search invoices" />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon>
            <InputGroupInput defaultValue="acme.example.com" aria-label="Website" />
          </InputGroup>
          <InputGroup>
            <InputGroupAddon><AtSign aria-hidden="true" /></InputGroupAddon>
            <InputGroupInput defaultValue="invoices@acme.example.com" readOnly aria-label="Inbound email" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton aria-label="Copy" onClick={() => toast.success("Address copied")}><Copy aria-hidden="true" /></InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Preview>
        <Code title="usage">{`import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"

<InputGroup>
  <InputGroupAddon><Search /></InputGroupAddon>
  <InputGroupInput placeholder="Search invoices" aria-label="Search invoices" />
</InputGroup>`}</Code>
      </Section>

      <Section id="input-otp" title="One-time code" description="Six boxes for a verification code. Paste fills every box; the last digit submits.">
        <Preview>
          <div className="flex flex-col gap-2">
            <Label>Verification code</Label>
            <InputOTP maxLength={6} onComplete={(v) => toast(`Checking ${v}…`)}>
              <InputOTPGroup>{[0, 1, 2].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>{[3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
            </InputOTP>
            <p className="text-xs text-muted-foreground">Sent to •••• 4821. It expires in 10 minutes.</p>
          </div>
        </Preview>
        <Caption>In a product: sign-in, two-factor, confirming a phone number.</Caption>
        <Code title="usage">{`import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

<InputOTP maxLength={6} onComplete={verify}>
  <InputOTPGroup>{[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
</InputOTP>`}</Code>
      </Section>

      <Section id="combobox" title="Combobox" description="A select you can type into. Use it from about fifteen options, or whenever people know what they’re looking for.">
        <Preview className="max-w-[640px]">
          <div className="flex flex-col gap-2">
            <Label>Timezone</Label>
            <CB.Combobox items={["Asia/Jakarta", "Asia/Tokyo", "Australia/Sydney", "Europe/Amsterdam", "Europe/London", "America/New_York", "America/Los_Angeles"]}>
              <CB.ComboboxInput placeholder="Search timezones" aria-label="Timezone" />
              <CB.ComboboxContent>
                <CB.ComboboxEmpty>No timezone found.</CB.ComboboxEmpty>
                <CB.ComboboxList>
                  {(tz: string) => (
                    <CB.ComboboxItem key={tz} value={tz}>{tz.replace("_", " ")}</CB.ComboboxItem>
                  )}
                </CB.ComboboxList>
              </CB.ComboboxContent>
            </CB.Combobox>
          </div>
        </Preview>
        <Code title="usage">{`import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"

<Combobox items={timezones}>
  <ComboboxInput placeholder="Search timezones" aria-label="Timezone" />
  <ComboboxContent>
    <ComboboxEmpty>No timezone found.</ComboboxEmpty>
    <ComboboxList>{(tz) => <ComboboxItem key={tz} value={tz}>{tz}</ComboboxItem>}</ComboboxList>
  </ComboboxContent>
</Combobox>`}</Code>
      </Section>

      <Section id="date-picker" title="Date picker" description="shadcn ships the calendar; the picker is a recipe: a button that opens it in a popover. For birth dates, use the three-box field instead (see Reusable).">
        <Preview>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full max-w-xs justify-start font-normal">
                <CalendarIcon aria-hidden="true" />
                {date ? date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : <span className="text-muted-foreground">Pick a due date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <ClientOnly>
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </ClientOnly>
            </PopoverContent>
          </Popover>
        </Preview>
        <Code title="usage">{`import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

<Popover>
  <PopoverTrigger asChild><Button variant="outline">{date ? format(date) : "Pick a due date"}</Button></PopoverTrigger>
  <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} /></PopoverContent>
</Popover>`}</Code>
        <DoDont
          dos={["Wrap Calendar in <ClientOnly> on prerendered pages (it reads today’s date)", "Show the chosen date in words on the button"]}
          donts={["A month calendar for dates decades away (birth dates)", "Opening the picker on focus with no way to type"]}
        />
      </Section>
    </>
  );
}

/* ───────── Actions ───────── */

export function MoreActions() {
  return (
    <>
      <Section id="button-group" title="Button group" description="Related actions that act on the same thing, joined into one control.">
        <Preview className="flex flex-col gap-4">
          <ButtonGroup>
            <Button variant="outline"><Reply aria-hidden="true" /> Reply</Button>
            <Button variant="outline"><Archive aria-hidden="true" /> Archive</Button>
            <ButtonGroupSeparator />
            <Button variant="outline" aria-label="Delete"><Trash2 aria-hidden="true" /></Button>
          </ButtonGroup>
        </Preview>
        <Caption>In a product: message toolbars, editor actions, split buttons.</Caption>
        <Code title="usage">{`import { ButtonGroup } from "@/components/ui/button-group"

<ButtonGroup>
  <Button variant="outline">Reply</Button>
  <Button variant="outline">Archive</Button>
</ButtonGroup>`}</Code>
      </Section>

      <Section id="toggle-group" title="Toggle group" description="Buttons that stay pressed. type=&quot;single&quot; behaves like a segmented control; type=&quot;multiple&quot; like formatting buttons.">
        <Preview className="flex flex-col gap-4">
          <Row label="multiple">
            <ToggleGroup type="multiple" variant="outline" defaultValue={["bold"]} aria-label="Text formatting">
              <ToggleGroupItem value="bold" aria-label="Bold"><Bold aria-hidden="true" /></ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Italic"><Italic aria-hidden="true" /></ToggleGroupItem>
              <ToggleGroupItem value="underline" aria-label="Underline"><Underline aria-hidden="true" /></ToggleGroupItem>
            </ToggleGroup>
          </Row>
          <Row label="single">
            <ToggleGroup type="single" variant="outline" defaultValue="month" aria-label="Range">
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
              <ToggleGroupItem value="year">Year</ToggleGroupItem>
            </ToggleGroup>
          </Row>
        </Preview>
        <Code title="usage">{`import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

<ToggleGroup type="single" variant="outline" value={range} onValueChange={setRange} aria-label="Range">
  <ToggleGroupItem value="week">Week</ToggleGroupItem>
  <ToggleGroupItem value="month">Month</ToggleGroupItem>
</ToggleGroup>`}</Code>
      </Section>

      <Section id="kbd" title="Keyboard key" description="Show a shortcut next to the action it triggers. Never the only way to do something.">
        <Preview className="flex flex-wrap items-center gap-6">
          <span className="flex items-center gap-2 text-sm">Search <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup></span>
          <span className="flex items-center gap-2 text-sm">New invoice <Kbd>N</Kbd></span>
        </Preview>
        <Code title="usage">{`import { Kbd, KbdGroup } from "@/components/ui/kbd"

<KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>`}</Code>
      </Section>
    </>
  );
}

/* ───────── Feedback ───────── */

export function MoreFeedback() {
  return (
    <>
      <Section id="spinner" title="Spinner" description="For waits without a known length, inside the thing that’s waiting. Prefer the button’s pending state or a skeleton when you can.">
        <Preview className="flex items-center gap-6">
          <Spinner className="size-6" />
          <span className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner /> Syncing 3 accounts…</span>
        </Preview>
        <Code title="usage">{`import { Spinner } from "@/components/ui/spinner"

<span className="flex items-center gap-2"><Spinner /> Syncing 3 accounts…</span>`}</Code>
      </Section>

      <Section id="empty" title="Empty state" description="Say what would be here and how to get it. One action, no illustration.">
        <Preview>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><Inbox aria-hidden="true" /></EmptyMedia>
              <EmptyTitle>No invoices yet</EmptyTitle>
              <EmptyDescription>Invoices you send or import show up here.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button>Create an invoice</Button>
            </EmptyContent>
          </Empty>
        </Preview>
        <Code title="usage">{`import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon"><Inbox /></EmptyMedia>
    <EmptyTitle>No invoices yet</EmptyTitle>
    <EmptyDescription>Invoices you send or import show up here.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent><Button>Create an invoice</Button></EmptyContent>
</Empty>`}</Code>
        <DoDont dos={["Name the thing that’s missing", "One button that creates it"]} donts={["“No data”", "Illustrations, mascots, jokes"]} />
      </Section>
    </>
  );
}

/* ───────── Layout & display ───────── */

export function MoreLayout() {
  return (
    <>
      <Section id="avatar" title="Avatar" description="A person, with initials when there’s no photo. Groups show the first few and a count.">
        <Preview className="flex flex-wrap items-center gap-8">
          <Avatar size="lg">
            <AvatarFallback>AL</AvatarFallback>
            <AvatarBadge className="bg-secondary" />
          </Avatar>
          <AvatarGroup>
            {["AL", "GH", "AT"].map((i) => (
              <Avatar key={i}><AvatarFallback>{i}</AvatarFallback></Avatar>
            ))}
            <AvatarGroupCount>+4</AvatarGroupCount>
          </AvatarGroup>
        </Preview>
        <Code title="usage">{`import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from "@/components/ui/avatar"

<Avatar><AvatarImage src={user.photo} alt="" /><AvatarFallback>AL</AvatarFallback></Avatar>`}</Code>
      </Section>

      <Section id="separator" title="Separator" description="A hairline between groups. If spacing alone separates them, skip it.">
        <Preview className="flex flex-col gap-4">
          <div className="flex h-6 items-center gap-4 text-sm">
            <span>Profile</span>
            <Separator orientation="vertical" />
            <span>Billing</span>
            <Separator orientation="vertical" />
            <span>Members</span>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">Danger zone</p>
        </Preview>
        <Code title="usage">{`import { Separator } from "@/components/ui/separator"

<Separator />  <Separator orientation="vertical" />`}</Code>
      </Section>

      <Section id="scroll-area" title="Scroll area" description="A fixed-height region with a styled scrollbar, for lists inside panels. The page itself should just scroll.">
        <Preview>
          <ScrollArea className="h-48 rounded-xl border border-hairline">
            <ul className="divide-y divide-hairline">
              {Array.from({ length: 14 }, (_, i) => (
                <li key={i} className="flex justify-between px-4 py-3 text-sm">
                  <span>Invoice #{4821 - i}</span>
                  <span className="tabular-nums text-muted-foreground">${(120 + i * 37).toLocaleString("en-US")}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </Preview>
        <Code title="usage">{`import { ScrollArea } from "@/components/ui/scroll-area"

<ScrollArea className="h-48 rounded-xl border border-hairline">…</ScrollArea>`}</Code>
      </Section>

      <Section id="collapsible" title="Collapsible" description="Hide one block of optional detail behind a button. For several, use an accordion.">
        <Preview>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="group/c -ml-3">
                Advanced settings <ChevronDown className="transition-transform duration-200 group-data-[state=open]/c:rotate-180" aria-hidden="true" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 text-muted-foreground">Webhooks, API keys and the audit log.</CollapsibleContent>
          </Collapsible>
        </Preview>
        <Code title="usage">{`import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

<Collapsible>
  <CollapsibleTrigger asChild><Button variant="ghost">Advanced settings</Button></CollapsibleTrigger>
  <CollapsibleContent>…</CollapsibleContent>
</Collapsible>`}</Code>
      </Section>

      <Section id="carousel" title="Carousel" description="For a few items people browse in order: onboarding cards, image galleries. Not for content everyone must see.">
        <Preview>
          <CA.Carousel className="mx-12">
            <CA.CarouselContent>
              {["Invite your team", "Connect your data", "Ship your first report"].map((s, i) => (
                <CA.CarouselItem key={s}>
                  <div className="flex h-36 flex-col justify-end rounded-xl bg-canvas p-5">
                    <span className="text-xs text-muted-foreground">Step {i + 1} of 3</span>
                    <span className="text-lg font-semibold text-heading">{s}</span>
                  </div>
                </CA.CarouselItem>
              ))}
            </CA.CarouselContent>
            <CA.CarouselPrevious />
            <CA.CarouselNext />
          </CA.Carousel>
        </Preview>
        <Code title="usage">{`import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

<Carousel><CarouselContent><CarouselItem>…</CarouselItem></CarouselContent><CarouselPrevious /><CarouselNext /></Carousel>`}</Code>
      </Section>
    </>
  );
}

/* ───────── Overlays ───────── */

export function MoreOverlays() {
  return (
    <>
      <Section id="alert-dialog" title="Alert dialog" description="Only for irreversible actions. It can’t be dismissed by clicking outside, so people have to choose.">
        <Preview>
          <AD.AlertDialog>
            <AD.AlertDialogTrigger asChild><Button variant="destructive-outline">Delete workspace</Button></AD.AlertDialogTrigger>
            <AD.AlertDialogContent>
              <AD.AlertDialogHeader>
                <AD.AlertDialogTitle>Delete the Acme workspace?</AD.AlertDialogTitle>
                <AD.AlertDialogDescription>All 12 projects and their files are deleted for everyone. You can’t undo this.</AD.AlertDialogDescription>
              </AD.AlertDialogHeader>
              <AD.AlertDialogFooter>
                <AD.AlertDialogCancel>Keep workspace</AD.AlertDialogCancel>
                <AD.AlertDialogAction onClick={() => toast("Workspace deleted")}>Delete workspace</AD.AlertDialogAction>
              </AD.AlertDialogFooter>
            </AD.AlertDialogContent>
          </AD.AlertDialog>
        </Preview>
        <Code title="usage">{`import * as AD from "@/components/ui/alert-dialog"

<AlertDialog>
  <AlertDialogTrigger asChild><Button variant="destructive-outline">Delete workspace</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader><AlertDialogTitle>Delete the Acme workspace?</AlertDialogTitle>…</AlertDialogHeader>
    <AlertDialogFooter><AlertDialogCancel>Keep workspace</AlertDialogCancel><AlertDialogAction>Delete workspace</AlertDialogAction></AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}</Code>
        <DoDont dos={["Name exactly what is lost", "Label both buttons with verbs (“Keep workspace”)"]} donts={["Confirming reversible actions; offer Undo instead", "“Are you sure?” with OK / Cancel"]} />
      </Section>

      <Section id="sheet" title="Sheet" description="A side panel for a secondary task that keeps the page in view: filters, details, editing one record.">
        <Preview>
          <SH.Sheet>
            <SH.SheetTrigger asChild><Button variant="outline">Order details</Button></SH.SheetTrigger>
            <SH.SheetContent>
              <SH.SheetHeader>
                <SH.SheetTitle>Order #4821</SH.SheetTitle>
                <SH.SheetDescription>Placed 8 Oct 2026 by Ada Lovelace.</SH.SheetDescription>
              </SH.SheetHeader>
              <div className="px-4 text-sm">3 items · $148.00 · Ships tomorrow</div>
            </SH.SheetContent>
          </SH.Sheet>
        </Preview>
        <Code title="usage">{`import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger asChild><Button variant="outline">Order details</Button></SheetTrigger>
  <SheetContent side="right"><SheetHeader><SheetTitle>Order #4821</SheetTitle></SheetHeader>…</SheetContent>
</Sheet>`}</Code>
      </Section>

      <Section id="popover" title="Popover" description="Small, optional content tied to a button: share links, quick settings. If it holds a form with a Save button, use a dialog.">
        <Preview>
          <Popover>
            <PopoverTrigger asChild><Button variant="outline">Share</Button></PopoverTrigger>
            <PopoverContent className="w-80">
              <p className="font-semibold text-heading">Anyone with the link can view</p>
              <InputGroup>
                <InputGroupInput defaultValue="https://acme.example.com/r/4821" readOnly aria-label="Link" />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton aria-label="Copy link" onClick={() => toast.success("Link copied")}><Copy aria-hidden="true" /></InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </PopoverContent>
          </Popover>
        </Preview>
        <Code title="usage">{`import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

<Popover>
  <PopoverTrigger asChild><Button variant="outline">Share</Button></PopoverTrigger>
  <PopoverContent className="w-80">…</PopoverContent>
</Popover>`}</Code>
      </Section>

      <Section id="hover-card" title="Hover card" description="A preview of a linked thing on hover or focus. Nothing in it may be required: touch screens never see it.">
        <Preview>
          <p className="text-base">
            Assigned to{" "}
            <HoverCard>
              <HoverCardTrigger asChild><a href="#hover-card" className="font-semibold text-primary underline underline-offset-4">Ada Lovelace</a></HoverCardTrigger>
              <HoverCardContent className="flex gap-3">
                <Avatar><AvatarFallback>AL</AvatarFallback></Avatar>
                <div>
                  <p className="font-semibold text-heading">Ada Lovelace</p>
                  <p className="text-sm text-muted-foreground">Engineering · 14 open tasks</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </p>
        </Preview>
        <Code title="usage">{`import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

<HoverCard>
  <HoverCardTrigger asChild><a href="/people/ada">Ada Lovelace</a></HoverCardTrigger>
  <HoverCardContent>…</HoverCardContent>
</HoverCard>`}</Code>
      </Section>

      <Section id="context-menu" title="Context menu" description="Right-click or long-press shortcuts. Every action in it must also be reachable another way.">
        <Preview>
          <CX.ContextMenu>
            <CX.ContextMenuTrigger className="grid h-32 place-items-center rounded-xl border border-dashed border-input text-sm text-muted-foreground">
              Right-click or long-press this file
            </CX.ContextMenuTrigger>
            <CX.ContextMenuContent className="w-56">
              <CX.ContextMenuItem>Open</CX.ContextMenuItem>
              <CX.ContextMenuItem>Rename</CX.ContextMenuItem>
              <CX.ContextMenuItem>Download</CX.ContextMenuItem>
              <CX.ContextMenuSeparator />
              <CX.ContextMenuItem variant="destructive">Delete</CX.ContextMenuItem>
            </CX.ContextMenuContent>
          </CX.ContextMenu>
        </Preview>
        <Code title="usage">{`import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"

<ContextMenu>
  <ContextMenuTrigger>…the file row…</ContextMenuTrigger>
  <ContextMenuContent><ContextMenuItem>Rename</ContextMenuItem></ContextMenuContent>
</ContextMenu>`}</Code>
      </Section>

      <Section id="command" title="Command menu" description="Search across pages and actions. Embed it, or open it in a dialog on ⌘K for power users.">
        <Preview className="max-w-[640px] p-0">
          <WhenVisible minHeight={330}>
          <CM.Command className="rounded-xl">
            <CM.CommandInput placeholder="Search pages and actions…" />
            <CM.CommandList>
              <CM.CommandEmpty>Nothing found.</CM.CommandEmpty>
              <CM.CommandGroup heading="Go to">
                <CM.CommandItem>Dashboard</CM.CommandItem>
                <CM.CommandItem>Invoices</CM.CommandItem>
                <CM.CommandItem>Settings</CM.CommandItem>
              </CM.CommandGroup>
              <CM.CommandGroup heading="Actions">
                <CM.CommandItem onSelect={() => toast("New invoice")}>Create invoice <CM.CommandShortcut>N</CM.CommandShortcut></CM.CommandItem>
                <CM.CommandItem>Invite teammate</CM.CommandItem>
              </CM.CommandGroup>
            </CM.CommandList>
          </CM.Command>
          </WhenVisible>
        </Preview>
        <Code title="usage">{`import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

<CommandDialog open={open} onOpenChange={setOpen}>   {/* or <Command> inline */}
  <CommandInput placeholder="Search pages and actions…" />
  <CommandList>
    <CommandEmpty>Nothing found.</CommandEmpty>
    <CommandGroup heading="Go to"><CommandItem onSelect={go}>Invoices</CommandItem></CommandGroup>
  </CommandList>
</CommandDialog>`}</Code>
        <DoDont
          dos={["Prefer CommandDialog on ⌘K", "Inline below the fold? Mount it when visible (components/when-visible.tsx)"]}
          donts={["An inline Command far down a page: cmdk scrolls its first item into view on mount and drags the page"]}
        />
      </Section>
    </>
  );
}

/* ───────── Navigation ───────── */

export function MoreNavigation() {
  return (
    <>
      <Section id="breadcrumb" title="Breadcrumb" description="Where this page sits in a hierarchy, three levels or more. The last item is the current page and isn’t a link.">
        <Preview>
          <BC.Breadcrumb>
            <BC.BreadcrumbList>
              <BC.BreadcrumbItem><BC.BreadcrumbLink href="#breadcrumb">Acme</BC.BreadcrumbLink></BC.BreadcrumbItem>
              <BC.BreadcrumbSeparator />
              <BC.BreadcrumbItem><BC.BreadcrumbLink href="#breadcrumb">Projects</BC.BreadcrumbLink></BC.BreadcrumbItem>
              <BC.BreadcrumbSeparator />
              <BC.BreadcrumbItem><BC.BreadcrumbPage>Website redesign</BC.BreadcrumbPage></BC.BreadcrumbItem>
            </BC.BreadcrumbList>
          </BC.Breadcrumb>
        </Preview>
        <Code title="usage">{`import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

<Breadcrumb><BreadcrumbList>
  <BreadcrumbItem><BreadcrumbLink href="/projects">Projects</BreadcrumbLink></BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem><BreadcrumbPage>Website redesign</BreadcrumbPage></BreadcrumbItem>
</BreadcrumbList></Breadcrumb>`}</Code>
      </Section>

      <Section id="pagination" title="Pagination" description="For long lists people jump around in. For feeds, load more as they scroll instead.">
        <Preview>
          <PG.Pagination>
            <PG.PaginationContent>
              <PG.PaginationItem><PG.PaginationPrevious href="#pagination" /></PG.PaginationItem>
              <PG.PaginationItem><PG.PaginationLink href="#pagination">1</PG.PaginationLink></PG.PaginationItem>
              <PG.PaginationItem><PG.PaginationLink href="#pagination" isActive>2</PG.PaginationLink></PG.PaginationItem>
              <PG.PaginationItem><PG.PaginationLink href="#pagination">3</PG.PaginationLink></PG.PaginationItem>
              <PG.PaginationItem><PG.PaginationEllipsis /></PG.PaginationItem>
              <PG.PaginationItem><PG.PaginationNext href="#pagination" /></PG.PaginationItem>
            </PG.PaginationContent>
          </PG.Pagination>
        </Preview>
        <Code title="usage">{`import * as P from "@/components/ui/pagination"

<Pagination><PaginationContent>
  <PaginationItem><PaginationPrevious href="?page=1" /></PaginationItem>
  <PaginationItem><PaginationLink href="?page=2" isActive>2</PaginationLink></PaginationItem>
  <PaginationItem><PaginationNext href="?page=3" /></PaginationItem>
</PaginationContent></Pagination>`}</Code>
      </Section>
    </>
  );
}
