"use client";

// Demo wrappers for the foundation and data candidates (navigation, sign-in, password, phone,
// stats, filtering, notifications). They own the state and toasts, like a product page would.
import * as React from "react";
import { BookOpen, Building2, CalendarCheck, FileText, Home, Inbox, Search, Settings, Users } from "lucide-react";
import { toast } from "sonner";
import { AppNav, type NavItem } from "@/components/candidates/app-nav";
import { SignIn } from "@/components/candidates/sign-in";
import { PasswordField } from "@/components/candidates/password-field";
import { PhoneInput } from "@/components/candidates/phone-input";
import { StatCard } from "@/components/candidates/stat-card";
import { FilterBar, type Facet } from "@/components/candidates/filter-bar";
import { NotificationList, type Notice } from "@/components/candidates/notifications";
import { StatusTag } from "@/components/status";
import { applyFilters, EMPTY_FILTER, facetCounts, type FilterValue } from "@/lib/filter";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/* ── navigation ── */
const NAV: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "requests", label: "Requests", icon: Inbox, badge: 7 },
  { id: "letters", label: "Letters", icon: FileText },
  { id: "residents", label: "Residents", icon: Users, group: "Village" },
  { id: "offices", label: "Offices", icon: Building2, group: "Village" },
  { id: "settings", label: "Settings", icon: Settings, group: "Village" },
];
const NAV_BOTTOM: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "search", label: "Search", icon: Search },
  { id: "requests", label: "Requests", icon: Inbox, badge: 3 },
  { id: "attendance", label: "Attendance", icon: CalendarCheck },
];

export function AppNavDemo({ variant }: { variant: React.ComponentProps<typeof AppNav>["variant"] }) {
  const [active, setActive] = React.useState("requests");
  const page = <p className="p-4 text-sm text-muted-foreground">Current page: <span className="font-semibold text-heading">{active}</span></p>;
  if (variant === "sidebar") {
    return (
      <div className="flex h-[26rem] overflow-hidden rounded-xl border border-hairline">
        <AppNav variant="sidebar" items={NAV} value={active} onValueChange={setActive} brand="Sukamaju" />
        <div className="flex-1 bg-white">{page}</div>
      </div>
    );
  }
  if (variant === "top") {
    return (
      <div className="overflow-hidden rounded-xl border border-hairline">
        <AppNav variant="top" items={NAV} value={active} onValueChange={setActive} brand="Sukamaju" />
        <div className="h-40 bg-white">{page}</div>
      </div>
    );
  }
  return (
    <div className="relative mx-auto h-80 w-full max-w-sm overflow-hidden rounded-[1.75rem] border-4 border-surface-strong bg-white">
      {page}
      <AppNav variant="bottom" items={NAV_BOTTOM} value={active === "requests" ? "requests" : active} onValueChange={setActive} className="absolute" />
    </div>
  );
}

/* ── sign in ── */
export function SignInDemo({ variant }: { variant: React.ComponentProps<typeof SignIn>["variant"] }) {
  return (
    <div className="mx-auto w-full max-w-sm">
      <SignIn
        variant={variant}
        providers={variant === "email-first" ? [] : [{ id: "google", label: "Continue with Google" }, { id: "sso", label: "Continue with SSO" }]}
        signUpHref="#sign-in"
        onProvider={(id) => toast(`Would redirect to ${id}`)}
        onPassword={async ({ password }) => {
          await wait(900);
          if (password !== "Correct1!") throw new Error("Wrong email or password. Try again, or reset your password.");
          toast.success("Signed in");
        }}
        onMagicLink={async () => {
          await wait(800);
        }}
      />
      {variant !== "magic-link" && <p className="mt-3 text-xs text-muted-foreground">Demo: any email, password “Correct1!”.</p>}
    </div>
  );
}

/* ── password, phone ── */
export function PasswordDemo({ variant }: { variant: React.ComponentProps<typeof PasswordField>["variant"] }) {
  const [valid, setValid] = React.useState(false);
  return (
    <div className="flex flex-col gap-3">
      <PasswordField variant={variant} onValidityChange={setValid} />
      <p className="text-xs text-muted-foreground" aria-live="polite">Create account button: {valid ? "enabled" : "disabled until every rule is met"}</p>
    </div>
  );
}

export function PhoneDemo({ variant }: { variant: React.ComponentProps<typeof PhoneInput>["variant"] }) {
  const [value, setValue] = React.useState("");
  return (
    <div className="flex flex-col gap-3">
      <PhoneInput variant={variant} name="phone" onValueChange={setValue} />
      <p className="text-xs text-muted-foreground">Submitted value: <code className="font-mono text-heading">{value || "—"}</code></p>
    </div>
  );
}

/* ── stats ── */
const ATTENDANCE_TREND = [88, 90, 87, 91, 89, 92, 90, 93, 91, 94, 92, 94];
const WEEKS = ATTENDANCE_TREND.map((_, i) => `Week ${i + 1}`);

export function StatDemo({ variant }: { variant: React.ComponentProps<typeof StatCard>["variant"] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <StatCard
        variant={variant}
        label="Attendance this week"
        value={0.94}
        format={{ style: "percent", maximumFractionDigits: 0 }}
        delta={{ value: 0.02, period: "vs last week", goodWhen: "up", absolute: false }}
        trend={ATTENDANCE_TREND.map((n) => n / 100)}
        trendLabels={WEEKS}
        definition="Students marked present or late, divided by students enrolled, for school days this week."
      />
      <StatCard
        variant={variant}
        label="Overdue loans"
        value={23}
        format={{ maximumFractionDigits: 0 }}
        delta={{ value: 5, period: "vs last week", goodWhen: "down", absolute: true }}
        trend={[12, 14, 13, 15, 17, 16, 18, 17, 19, 20, 18, 23]}
        definition="Books past their due date that haven’t been returned or renewed."
      />
    </div>
  );
}

/* ── filtering ── */
type Book = { id: string; title: string; author: string; genre: string; available: boolean; year: number };
const BOOKS: Book[] = [
  { id: "1", title: "Laskar Pelangi", author: "Andrea Hirata", genre: "Fiction", available: true, year: 2005 },
  { id: "2", title: "Bumi Manusia", author: "Pramoedya Ananta Toer", genre: "Fiction", available: false, year: 1980 },
  { id: "3", title: "Cosmos", author: "Carl Sagan", genre: "Science", available: true, year: 1980 },
  { id: "4", title: "Sapiens", author: "Yuval Noah Harari", genre: "History", available: false, year: 2011 },
  { id: "5", title: "Ronggeng Dukuh Paruk", author: "Ahmad Tohari", genre: "Fiction", available: true, year: 1982 },
  { id: "6", title: "A Brief History of Time", author: "Stephen Hawking", genre: "Science", available: true, year: 1988 },
];
const OPTS = {
  search: (b: Book) => `${b.title} ${b.author}`,
  facet: (b: Book, f: string) => (f === "genre" ? b.genre : b.available ? "available" : "on-loan"),
  sorters: { title: (a: Book, b: Book) => a.title.localeCompare(b.title), newest: (a: Book, b: Book) => b.year - a.year },
};
const SORTS = [
  { value: "title", label: "Title A–Z" },
  { value: "newest", label: "Newest first" },
];

export function FilterDemo({ variant }: { variant: React.ComponentProps<typeof FilterBar>["variant"] }) {
  const [v, setV] = React.useState<FilterValue>({ ...EMPTY_FILTER, sort: "title" });
  const results = applyFilters(BOOKS, v, OPTS);
  const genre = facetCounts(BOOKS, v, "genre", OPTS);
  const avail = facetCounts(BOOKS, v, "availability", OPTS);
  const facets: Facet[] = [
    { id: "genre", label: "Genre", options: ["Fiction", "Science", "History"].map((g) => ({ value: g, label: g, count: genre[g] ?? 0 })) },
    { id: "availability", label: "Availability", options: [{ value: "available", label: "On the shelf", count: avail.available ?? 0 }, { value: "on-loan", label: "On loan", count: avail["on-loan"] ?? 0 }] },
  ];
  return (
    <FilterBar variant={variant} facets={facets} sorts={SORTS} value={v} onValueChange={setV} resultCount={results.length}>
      <ul className="divide-y divide-hairline rounded-xl border border-hairline">
        {results.map((b) => (
          <li key={b.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="min-w-0">
              <span className="block truncate font-semibold text-heading">{b.title}</span>
              <span className="block truncate text-sm text-muted-foreground">{b.author} · {b.year}</span>
            </span>
            <StatusTag tone={b.available ? "success" : "neutral"} icon={BookOpen}>{b.available ? "On the shelf" : "On loan"}</StatusTag>
          </li>
        ))}
        {!results.length && <li className="px-4 py-6 text-muted-foreground">No books match. Try fewer filters.</li>}
      </ul>
    </FilterBar>
  );
}

/* ── notifications ── */
const NOW = new Date("2026-10-10T15:00:00");
const NOTICES: Notice[] = [
  { id: "n1", title: "Your domicile letter is ready", body: "Signed by the village head at 14:20.", time: "2026-10-10T14:20:00", read: false, category: "Letters", actor: "Village Office", action: "Download letter" },
  { id: "n2", title: "Documents checked", body: "An officer checked your ID card and family card.", time: "2026-10-10T10:02:00", read: false, category: "Letters", actor: "Rina Officer" },
  { id: "n3", title: "“Laskar Pelangi” is due today", body: "Renew it or bring it back to the library.", time: "2026-10-09T08:00:00", read: true, category: "Library", actor: "Library", action: "Renew" },
  { id: "n4", title: "Attendance: Bima was marked late", body: "Class 7B, first period.", time: "2026-10-06T07:40:00", read: true, category: "School", actor: "Ibu Sari" },
];

export function NotificationsDemo({ variant }: { variant: React.ComponentProps<typeof NotificationList>["variant"] }) {
  const [items, setItems] = React.useState(NOTICES);
  return (
    <NotificationList
      variant={variant}
      items={items}
      now={NOW}
      onOpen={(id) => setItems((xs) => xs.map((n) => (n.id === id ? { ...n, read: true } : n)))}
      onMarkAllRead={() => {
        const before = items;
        setItems((xs) => xs.map((n) => ({ ...n, read: true })));
        toast("All marked as read", { action: { label: "Undo", onClick: () => setItems(before) }, duration: 6000 });
      }}
      onAction={(id) => toast(`${NOTICES.find((n) => n.id === id)?.action}…`)}
    />
  );
}
