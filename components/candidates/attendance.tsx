"use client"

import * as React from "react"
import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { Check, CheckCheck, MoreHorizontal } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type Mark = "present" | "late" | "absent" | "excused"
export type Student = { id: string; name: string }
export type Marks = Partial<Record<string, Mark>>

export const ATTENDANCE_LABELS = {
  marks: { present: "Present", late: "Late", absent: "Absent", excused: "Excused" } as Record<Mark, string>,
  short: { present: "P", late: "L", absent: "A", excused: "E" } as Record<Mark, string>,
  details: { absent: "No reason given", excused: "Sick note or permission" } as Partial<Record<Mark, string>>,
  markAllPresent: "Mark all present",
  nobodyMarked: "Nobody marked yet",
  toMark: (n: number) => `${n} to mark`,
  tapToMark: "Tap to mark",
  clear: "Clear",
  moreFor: (name: string) => `More options for ${name}`,
  rowLabel: (name: string) => `Attendance for ${name}`,
}

// Every mark has its word as well as its tone, so it's never color-only.
const TONE: Record<Mark, { fill: string; ring: string }> = {
  present: { fill: "bg-status-success-fill text-status-success-text", ring: "border-status-success-text" },
  late: { fill: "bg-status-warning-fill text-status-warning-text", ring: "border-status-warning-text" },
  absent: { fill: "bg-status-error-fill text-status-error-text", ring: "border-status-error-text" },
  excused: { fill: "bg-status-info-fill text-status-info-text", ring: "border-status-info-text" },
}
const ORDER: Mark[] = ["present", "late", "absent", "excused"]
const initials = (name: string) => name.split(" ").map((w) => w[0]).slice(0, 2).join("")

/**
 * Candidate: taking attendance for a class. Value is `{ [studentId]: mark }`.
 * segmented  A · four inline options per student (radio group, arrow keys)  (Attio)
 * cycle      B · tap the status chip to cycle                              (Luma)
 * menu       C · Present button + menu for the rest                         (Meetup)
 * exceptions D · everyone starts present; tap who isn’t                    (roll-call habit)
 * With `name`, native forms receive `name[studentId]=mark` for every marked student.
 */
export function AttendanceRoster({
  variant,
  students,
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  disabled,
  labels: labelsProp,
  className,
}: {
  variant: "segmented" | "cycle" | "menu" | "exceptions"
  students: Student[]
  value?: Marks
  defaultValue?: Marks
  onValueChange?: (marks: Marks) => void
  name?: string
  disabled?: boolean
  labels?: Partial<typeof ATTENDANCE_LABELS>
  className?: string
}) {
  const labels = { ...ATTENDANCE_LABELS, ...labelsProp }
  const initial = React.useMemo<Marks>(
    () => defaultValue ?? (variant === "exceptions" ? Object.fromEntries(students.map((s) => [s.id, "present" as Mark])) : {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial value only
    []
  )
  const [marks, setMarks] = useControllableState<Marks>({ prop: valueProp, defaultProp: initial, onChange: onValueChange })
  const set = (id: string, m: Mark | undefined) => setMarks({ ...marks, [id]: m })
  const counts = ORDER.map((m) => [m, students.filter((s) => marks[s.id] === m).length] as const)
  const unmarked = students.filter((s) => !marks[s.id]).length
  const summary = counts.filter(([, n]) => n).map(([m, n]) => `${n} ${labels.marks[m].toLowerCase()}`).join(" · ")

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm" role="status">
          {summary || labels.nobodyMarked}
          {unmarked > 0 && <span className="text-muted-foreground"> · {labels.toMark(unmarked)}</span>}
        </p>
        {variant !== "exceptions" && (
          <Button size="sm" variant="soft" disabled={disabled} onClick={() => setMarks(Object.fromEntries(students.map((s) => [s.id, "present" as Mark])))}>
            <CheckCheck aria-hidden="true" /> {labels.markAllPresent}
          </Button>
        )}
      </div>

      {variant === "exceptions" ? (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {students.map((s) => {
            const m = marks[s.id] ?? "present"
            const next: Mark = m === "present" ? "absent" : m === "absent" ? "late" : "present"
            return (
              <li key={s.id}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => set(s.id, next)}
                  aria-label={`${s.name}: ${labels.marks[m]}. ${labels.marks[next]} next.`}
                  className={cn(
                    "flex w-full flex-col items-center gap-1 rounded-xl border-2 p-2 text-center transition-[background-color,border-color,scale] duration-150 active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    m === "present" ? "border-transparent bg-canvas" : cn(TONE[m].fill, TONE[m].ring)
                  )}
                >
                  <span className="grid size-10 place-items-center rounded-full bg-white text-sm font-semibold text-heading">{initials(s.name)}</span>
                  <span className="w-full truncate text-xs text-heading">{s.name.split(" ")[0]}</span>
                  <span className={cn("text-xs font-semibold", m === "present" && "text-muted-foreground")}>{labels.marks[m]}</span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <ul className="divide-y divide-hairline rounded-xl border border-hairline">
          {students.map((s) => {
            const m = marks[s.id]
            return (
              <li key={s.id} className="flex min-h-16 items-center gap-3 px-3 py-2">
                <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-strong text-xs font-semibold text-heading">{initials(s.name)}</span>
                <span className="min-w-0 flex-1 truncate font-semibold text-heading">{s.name}</span>

                {variant === "segmented" && (
                  <RadioGroupPrimitive.Root
                    aria-label={labels.rowLabel(s.name)}
                    orientation="horizontal"
                    disabled={disabled}
                    value={m ?? ""}
                    onValueChange={(v) => set(s.id, v as Mark)}
                    className="flex gap-1"
                  >
                    {ORDER.map((o) => (
                      <RadioGroupPrimitive.Item
                        key={o}
                        value={o}
                        aria-label={labels.marks[o]}
                        className={cn(
                          "grid size-11 place-items-center rounded-lg border text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                          m === o ? cn(TONE[o].fill, TONE[o].ring, "border-2") : "border-input bg-white text-muted-foreground hover:bg-canvas"
                        )}
                      >
                        {labels.short[o]}
                      </RadioGroupPrimitive.Item>
                    ))}
                  </RadioGroupPrimitive.Root>
                )}

                {variant === "cycle" && (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => set(s.id, m ? ORDER[(ORDER.indexOf(m) + 1) % ORDER.length] : "present")}
                    aria-label={`${s.name}: ${m ? labels.marks[m] : labels.tapToMark}`}
                    className={cn(
                      "h-11 min-w-28 rounded-full px-4 text-sm font-semibold transition-[background-color,scale] duration-150 active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      m ? TONE[m].fill : "border border-dashed border-input text-muted-foreground"
                    )}
                  >
                    {m ? labels.marks[m] : labels.tapToMark}
                  </button>
                )}

                {variant === "menu" && (
                  <div className="flex items-center gap-1">
                    {m && m !== "present" ? (
                      <span className={cn("inline-flex h-9 items-center rounded-full px-3 text-xs font-semibold", TONE[m].fill)}>{labels.marks[m]}</span>
                    ) : (
                      <Button size="sm" disabled={disabled} variant={m === "present" ? "soft" : "outline"} aria-pressed={m === "present"} onClick={() => set(s.id, m === "present" ? undefined : "present")}>
                        {m === "present" && <Check aria-hidden="true" />} {labels.marks.present}
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={disabled} aria-label={labels.moreFor(s.name)}>
                          <MoreHorizontal aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-60">
                        {(["late", "absent", "excused"] as Mark[]).map((o) => (
                          <DropdownMenuItem key={o} onSelect={() => set(s.id, o)}>
                            <span className="flex flex-col">
                              {labels.marks[o]}
                              {labels.details[o] && <span className="text-xs text-muted-foreground">{labels.details[o]}</span>}
                            </span>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => set(s.id, undefined)}>{labels.clear}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {name && students.map((s) => marks[s.id] && <input key={s.id} type="hidden" name={`${name}[${s.id}]`} value={marks[s.id]} />)}
    </div>
  )
}
