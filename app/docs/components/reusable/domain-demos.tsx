"use client";

// Demo data and wrappers for the domain candidates. The components are stateless where it
// matters; these wrappers own the state and the toasts, the way a product page would.
import * as React from "react";
import { toast } from "sonner";
import { AttendanceRoster, type Student } from "@/components/candidates/attendance";
import { AnonymityChoice, CaseCode, QuickExit } from "@/components/candidates/reporting";
import { LoanList, ScanField, type Loan } from "@/components/candidates/library";
import { StatusTracker, type TrackStep } from "@/components/candidates/status-tracker";

const STUDENTS: Student[] = [
  { id: "1", name: "Aisyah Putri" },
  { id: "2", name: "Bima Santoso" },
  { id: "3", name: "Citra Lestari" },
  { id: "4", name: "Dimas Pratama" },
  { id: "5", name: "Eka Wulandari" },
  { id: "6", name: "Fajar Nugroho" },
];

export function AttendanceDemo({ variant }: { variant: React.ComponentProps<typeof AttendanceRoster>["variant"] }) {
  return <AttendanceRoster variant={variant} students={STUDENTS} name="attendance" />;
}

/** Quick exit inside a mock page, so “fixed” positions stay in the frame and nothing really leaves. */
export function QuickExitDemo({ variant }: { variant: React.ComponentProps<typeof QuickExit>["variant"] }) {
  const exit = React.useCallback(() => toast(`Would leave now (${variant}) and replace history, so Back can’t return`), [variant]);
  return (
    <div className="relative h-60 overflow-hidden rounded-xl border border-hairline bg-white">
      {variant === "bar" && <QuickExit variant="bar" onExit={exit} />}
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <span className="font-semibold text-heading">Speak Up</span>
        {variant === "link" && <QuickExit variant="link" onExit={exit} />}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <p className="font-semibold text-heading">Tell us what happened</p>
        <div className="h-3 w-3/4 rounded bg-surface-strong" />
        <div className="h-3 w-2/3 rounded bg-surface-strong" />
        <div className="mt-2 h-20 rounded-lg border border-input" />
      </div>
      {variant === "floating" && <QuickExit variant="floating" onExit={exit} className="absolute right-4 bottom-4" />}
    </div>
  );
}

export function AnonymityDemo({ variant }: { variant: React.ComponentProps<typeof AnonymityChoice>["variant"] }) {
  return <AnonymityChoice variant={variant} name="identity" />;
}

export function CaseCodeDemo({ variant }: { variant: React.ComponentProps<typeof CaseCode>["variant"] }) {
  return <CaseCode variant={variant} code="R-4821-7730" words={["river", "mango", "lantern"]} onCopy={() => toast.success("Case code copied")} />;
}

// Fixed “today” so the static docs page prerenders the same every time.
const TODAY = new Date("2026-10-10T09:00:00");
const LOANS: Loan[] = [
  { id: "a", title: "Laskar Pelangi", author: "Andrea Hirata", member: "Aisyah P.", dueDate: "2026-10-10", loanDays: 14 },
  { id: "b", title: "The Little Prince", author: "Antoine de Saint-Exupéry", member: "Bima S.", dueDate: "2026-10-15", loanDays: 14 },
  { id: "c", title: "A Brief History of Time", author: "Stephen Hawking", member: "Citra L.", dueDate: "2026-10-04", loanDays: 14, cannotRenew: "Someone has reserved this book." },
];
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const addDays = (iso: string, n: number) => new Date(new Date(`${iso}T00:00:00Z`).getTime() + n * 86_400_000).toISOString().slice(0, 10);

export function LoanDemo({ variant }: { variant: React.ComponentProps<typeof LoanList>["variant"] }) {
  const [loans, setLoans] = React.useState(LOANS);
  return (
    <LoanList
      variant={variant}
      loans={loans}
      today={TODAY}
      onRenew={async (id) => {
        await wait(600);
        setLoans((xs) => xs.map((l) => (l.id === id ? { ...l, dueDate: addDays(l.dueDate, 14), loanDays: l.loanDays + 14 } : l)));
        toast.success("Renewed for 14 more days");
      }}
      onCheckIn={async (id) => {
        await wait(400);
        setLoans((xs) => xs.filter((l) => l.id !== id));
        toast("Checked in", { action: { label: "Undo", onClick: () => setLoans(LOANS) }, duration: 6000 });
      }}
    />
  );
}

export function ScanDemo({ variant }: { variant: React.ComponentProps<typeof ScanField>["variant"] }) {
  return (
    <ScanField
      variant={variant}
      onScan={async (code) => {
        await wait(300);
        toast.success(`Checked out ${code}`);
      }}
    />
  );
}

const LETTER_STEPS: TrackStep[] = [
  { title: "Submitted", detail: "We have your request for a domicile letter.", time: "08:14" },
  { title: "Documents checked", detail: "A village officer checked your ID card and family card.", time: "10:02" },
  {
    title: "Waiting for signature",
    detail: "Documents are fine. The village head signs letters every afternoon.",
    time: "10:05",
    action: { label: "What happens next", onClick: () => toast("Most letters are signed the same day before 15:00") },
  },
  { title: "Ready", detail: "Download the letter or collect it at the village office." },
];

export function TrackerDemo({ variant }: { variant: React.ComponentProps<typeof StatusTracker>["variant"] }) {
  const [rejected, setRejected] = React.useState(false);
  return (
    <div className="flex flex-col gap-4">
      <StatusTracker
        variant={variant}
        steps={LETTER_STEPS}
        current={rejected ? 1 : 2}
        rejected={rejected ? "Rejected: the family card photo is too blurry. Take a new photo in good light and send it again." : undefined}
      />
      <button type="button" onClick={() => setRejected((r) => !r)} className="min-h-11 self-start text-sm font-semibold text-primary underline underline-offset-4">
        {rejected ? "Show the normal state" : "Show a rejected state"}
      </button>
    </div>
  );
}
