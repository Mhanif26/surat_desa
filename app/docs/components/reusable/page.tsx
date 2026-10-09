import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { cn } from "cn";
import { DateField } from "@/components/candidates/date-field";
import { PhotoUpload } from "@/components/candidates/photo-upload";
import { TextField } from "@/components/candidates/text-field";
import { Poll } from "@/components/poll";
import type { PollId } from "@/lib/polls";
import Link from "next/link";
import { AsyncButtonDemo, RatingDemo } from "./demos";
import { Versus } from "./versus";
import { AnonymityDemo, AttendanceDemo, CaseCodeDemo, LoanDemo, QuickExitDemo, ScanDemo, TrackerDemo } from "./domain-demos";
import { AppNavDemo, FilterDemo, NotificationsDemo, PasswordDemo, PhoneDemo, SignInDemo, StatDemo } from "./general-demos";
import { Code } from "../../ui";

export const metadata: Metadata = {
  title: "Reusable · vote",
  description: "Candidate components and shadcn-vs-iconiq head-to-heads, with a vote per group.",
};

const mobbin = (id: string) => `https://mobbin.com/screens/${id}`;

export default function Page() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-10 pb-32 sm:px-6">
      <h1 className="text-3xl font-bold">Reusable components</h1>
      <p className="mt-3 max-w-[68ch] text-muted-foreground">
        Where the template decides which component to keep. Two kinds of vote: <strong className="font-semibold text-heading">head-to-heads</strong>{" "}
        between shadcn and{" "}
        <a href="https://iconiqui.com/" className="font-semibold text-primary underline underline-offset-4">
          iconiq
        </a>{" "}
        for components both libraries have, and <strong className="font-semibold text-heading">candidates</strong> for what shadcn lacks,
        modelled on patterns trending on Mobbin and built in the IT-2023 tokens.
      </p>
      <ol className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["1 · Try", "Use both sides of each pair, on desktop and on a phone."],
          ["2 · Vote", "One vote per group per browser. Results show right after."],
          ["3 · Promote", "Tallies land in data/polls.json. The winner stays; the rest are deleted."],
        ].map(([t, d]) => (
          <li key={t} className="rounded-xl border border-hairline p-4">
            <p className="font-semibold text-heading">{t}</p>
            <p className="mt-1 text-sm">{d}</p>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-muted-foreground">
        How to promote a winner:{" "}
        <Link href="/docs#vote" className="font-semibold text-primary underline underline-offset-4">
          Getting started → Voting & promoting
        </Link>
      </p>

      <nav aria-label="Groups" className="mt-8 flex flex-wrap gap-2">
        {[{ id: "versus", title: "shadcn vs iconiq" }, ...DOMAINS.map(([d, name]) => ({ id: `d-${d}`, title: name }))].map((g) => (
          <a key={g.id} href={`#${g.id}`} className="rounded-full border border-hairline px-4 py-2 text-sm font-semibold text-heading hover:bg-canvas">
            {g.title}
          </a>
        ))}
      </nav>

      <Link
        href="/docs/iconiq"
        className="mt-8 flex flex-col gap-1 rounded-xl border border-hairline p-5 transition-colors hover:bg-canvas sm:flex-row sm:items-center sm:justify-between"
      >
        <span>
          <span className="block font-semibold text-heading">Full shadcn vs iconiq coverage</span>
          <span className="text-sm text-muted-foreground">Every iconiq component mapped against shadcn, plus live demos of the 18 iconiq-only ones.</span>
        </span>
        <span className="text-sm font-semibold text-primary">Open iconiq →</span>
      </Link>

      <section id="versus" className="mt-16 scroll-mt-24 border-t border-hairline pt-12">
        <h2 className="text-2xl font-semibold">shadcn vs iconiq</h2>
        <p className="mt-2 max-w-[68ch] text-muted-foreground">
          Thirty components exist in both libraries, and each gets three options. <strong className="font-semibold text-heading">shadcn</strong>:
          our restyled version with CSS transitions. <strong className="font-semibold text-heading">iconiq</strong>: restyled to the same
          tokens, keeping its own spring motion. <strong className="font-semibold text-heading">Merge</strong>: a new component with
          shadcn’s structure and our tokens plus iconiq-style motion, held to the IT-2023 motion rules. Eleven merges are built
          (components/merged); for the rest, a “merge” vote decides what gets built next.
        </p>
        <Versus />
      </section>

      <h2 className="mt-16 border-t border-hairline pt-12 text-2xl font-semibold">Candidates</h2>
      <p className="mt-2 max-w-[68ch] text-muted-foreground">
        What shadcn doesn’t have, grouped by the kind of product that needs it. Each option cites the product it’s modelled on,
        with a link to the Mobbin screen.
      </p>

      {DOMAINS.map(([domain, name, why]) => (
        <div key={domain} id={`d-${domain}`} className="scroll-mt-24">
          <h3 className="mt-16 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{name}</h3>
          <p className="mt-1 max-w-[68ch] text-sm text-muted-foreground">{why}</p>
      {GROUPS.filter((g) => g.domain === domain).map((g) => (
        <section key={g.id} id={g.id} className="mt-10 scroll-mt-24 border-t border-hairline pt-10">
          <h2 className="text-2xl font-semibold">{g.title}</h2>
          <p className="mt-2 max-w-[68ch] text-muted-foreground">{g.description}</p>
          <p className="mt-4 mb-6 max-w-[80ch] rounded-xl bg-primary-soft p-4 text-body">
            <strong className="font-semibold text-heading">Our pick: {"ABCD"[g.pick]} · {g.variants[g.pick].name}.</strong> {g.verdict}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {g.variants.map((v, i) => (
              <article key={v.name} className={cn("flex min-w-0 flex-col rounded-xl border bg-white", i === g.pick ? "border-primary" : "border-hairline")}>
                <header className="flex items-start gap-3 border-b border-hairline p-5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                    {"ABCD"[i]}
                  </span>
                  <div className="min-w-0">
                    <h3 className="flex flex-wrap items-center gap-2 text-lg font-semibold">
                      {v.name}
                      {i === g.pick && <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">Recommended</span>}
                    </h3>
                    <p className="text-sm text-muted-foreground">{v.note}</p>
                    <p className="mt-1 flex flex-wrap gap-x-3 text-xs">
                      {v.refs.map(([app, url]) => (
                        <a key={app} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 font-semibold text-primary hover:underline">
                          {app}
                          <ArrowUpRight className="size-3.5" aria-hidden="true" />
                        </a>
                      ))}
                    </p>
                  </div>
                </header>
                <div className={cn("flex min-w-0 flex-1 flex-col justify-center gap-6 p-4 sm:p-6", g.id === "async-button" && "items-start")}>{v.demo}</div>
              </article>
            ))}
          </div>
          <details className="group mt-4 rounded-xl border border-hairline">
            <summary className="flex min-h-12 cursor-pointer items-center px-4 font-semibold text-heading">Use it</summary>
            <div className="px-4 pb-4">
              <Code title={`components/candidates/${g.file}.tsx`}>{g.usage}</Code>
              <p className="mt-3 text-sm text-muted-foreground">
                Every candidate takes <code className="font-mono">value</code>/<code className="font-mono">defaultValue</code>/<code className="font-mono">onValueChange</code> where it holds a value,{" "}
                <code className="font-mono">name</code> for plain form posts, <code className="font-mono">labels</code> to translate every string, and <code className="font-mono">className</code>.
              </p>
            </div>
          </details>
          <div className="mt-4 max-w-xl">
            <Poll id={g.id} question={g.question} options={g.variants.map((v, i) => ({ id: "abcd"[i], label: `${"ABCD"[i]} · ${v.name}` }))} />
          </div>
        </section>
      ))}
        </div>
      ))}
    </main>
  );
}

const DOMAINS = [
  ["general", "General", "Patterns every product needs."],
  ["foundations", "App foundations", "Navigation and sign-in: what every product ships first."],
  ["data", "Data & activity", "Dashboards, long lists and inboxes: reading numbers, narrowing results, catching up."],
  ["school", "School attendance", "Teachers mark a class of 30 in under a minute, often on a phone, often standing."],
  ["reporting", "Anonymous reporting", "A student reporting bullying must feel safe: leave fast, stay anonymous, follow up without a name."],
  ["library", "Library", "A librarian checks books in and out at the desk, and members see what’s due."],
  ["village", "Village letter service", "Residents request letters from the village office and need to know where their request is."],
] as const;
type Domain = (typeof DOMAINS)[number][0];

type Group = {
  domain: Domain;
  id: PollId;
  title: string;
  description: string;
  question: string;
  /** Index of the recommended variant */
  pick: number;
  /** Why it wins, and when to pick another */
  verdict: string;
  /** File name under components/candidates */
  file: string;
  usage: string;
  variants: { name: string; note: string; refs: [string, string][]; demo: React.ReactNode }[];
};

const GROUPS: Group[] = [
  {
    domain: "general",
    id: "async-button",
    title: "Buttons · sending",
    description:
      "What a submit button does between the press and the result. On a slow connection this takes seconds, and silence makes people press again.",
    question: "Which sending button should the template use?",
    pick: 0,
    verdict: "Words beat a lone spinner on a slow connection, and it fits every action. Use Progress fill only for uploads where you know the real percent; Morph to check when the result has no page of its own.",
    file: "async-button",
    usage: `import { AsyncButton } from "@/components/candidates/async-button"

<AsyncButton variant="label" onAction={async () => { await save(form) }}>
  Send request
</AsyncButton>

// Throw inside onAction to show “Couldn’t send. Try again”.
// Uploads: variant="progress" and call report(percent) as bytes go out.`,
    variants: [
      {
        name: "Label swap",
        note: "Spinner plus “Sending…”. Says what’s happening in words.",
        refs: [["Partiful", mobbin("b8e85545-e2be-436b-9c87-f8b3114c4bdd")], ["Replit", mobbin("8cb8204c-9180-4960-94d4-a63d93b82a6e")]],
        demo: <AsyncButtonDemo variant="label" />,
      },
      {
        name: "Spinner only",
        note: "Quietest. Relies on the spinner alone, no words.",
        refs: [["Assembly", mobbin("1b2791e8-8b91-435d-a0e2-6855b4aec9f7")], ["Perplexity", mobbin("c15e844d-264e-425f-a46a-e0c449dc0d6b")]],
        demo: <AsyncButtonDemo variant="spinner" />,
      },
      {
        name: "Morph to check",
        note: "Spinner, then turns green with “Sent”. Confirms in place.",
        refs: [["iconiq flux-button", "https://iconiqui.com/"]],
        demo: <AsyncButtonDemo variant="morph" />,
      },
      {
        name: "Progress fill",
        note: "Fills with real progress and a percent. Honest on slow uploads.",
        refs: [["Me+", mobbin("659c75c1-16e3-42c3-9b38-2e70b03aa761")]],
        demo: <AsyncButtonDemo variant="progress" />,
      },
    ],
  },
  {
    domain: "general",
    id: "text-field",
    title: "Inputs · text field",
    description: "Where the label sits. Each candidate shows an empty field with a hint, and a filled field with an error.",
    question: "Which text field style should the template use?",
    pick: 0,
    verdict: "Label above stays readable while typing, survives autofill, and wraps when translated. Floating labels shrink to 12px once filled and collide with browser autofill.",
    file: "text-field",
    usage: `import { TextField } from "@/components/candidates/text-field"

<TextField variant="stacked" label="Email" name="email" type="email"
  autoComplete="email" hint="We send the receipt here." error={errors.email} />
<TextField variant="stacked" label="Company" name="company" optional />`,
    variants: (
      [
        ["stacked", "Label above", "Current IT-2023. Label never moves; hint and error read before the field.", [["Truecaller", mobbin("198059e0-89a9-4eaf-8a00-5aa7521b6ad0")]]],
        ["notched", "Notched label", "Label cut into the border. Compact, label always visible.", [["Freenow", mobbin("8b078f92-31f9-4954-968f-fb3590f689c9")], ["Origin", mobbin("c1edb193-07a4-47c2-892c-30cd15308ada")]]],
        ["floating", "Floating label", "Label inside, floats up on focus. Saves height; small label once filled.", [["GoHenry", mobbin("732774d9-e979-4af2-adf4-ba64da10023c")], ["Jomo", mobbin("038d8f03-06de-4217-a0b5-298967ad3f5b")]]],
        ["underline", "Underline", "Line only, no box. Lightest look, weakest “type here” signal.", [["Quo", mobbin("5294eca7-3402-4669-bb94-b5d84aa6b5fc")]]],
      ] as const
    ).map(([variant, name, note, refs]) => ({
      name,
      note,
      refs: refs.map((r) => [...r]) as [string, string][],
      demo: (
        <>
          <TextField variant={variant} label="Phone number" hint="We text you when your order ships." type="tel" inputMode="tel" />
          <TextField variant={variant} label="Email" type="email" defaultValue="ada@example" error="Add the end of the address, like ada@example.com." />
        </>
      ),
    })),
  },
  {
    domain: "general",
    id: "date-field",
    title: "Inputs · date of birth",
    description: "Typing a date decades back, like a birth date. Scrolling a month calendar back to 1958 is the wrong tool.",
    question: "Which date of birth input should the template use?",
    pick: 0,
    verdict: "Eight keystrokes on the number pad, with plain-words errors for impossible dates. The barrel wheel is pleasant for dates near today, slow for 1965. Native looks different on every phone.",
    file: "date-field",
    usage: `import { DateField } from "@/components/candidates/date-field"

<DateField variant="segments" label="Date of birth" name="dob" required
  onValueChange={(iso) => setDob(iso)} />   // "1965-08-17", or "" while incomplete`,
    variants: [
      {
        name: "Three boxes",
        note: "Type day, month, year on the number pad. Jumps to the next box by itself.",
        refs: [["Depop", mobbin("b4736c8e-c19a-4909-a795-ede528d401c9")], ["Revolut", mobbin("62715d83-4d65-4f58-a0ab-233c5cde30af")]],
        demo: <DateField variant="segments" label="Date of birth" hint="For example: 17 08 1965" />,
      },
      {
        name: "Native picker",
        note: "The phone’s own date picker. Familiar, but looks different on every device.",
        refs: [["Platform", "https://developer.mozilla.org/docs/Web/HTML/Element/input/date"]],
        demo: <DateField variant="native" label="Date of birth" />,
      },
      {
        name: "Wheel",
        note: "iOS-style wheel with native momentum and snap. Fun to flick, slow for far years.",
        refs: [["Gymshark", mobbin("628f262c-1109-42e5-aec2-7b26fbf953ba")], ["Peanut", mobbin("6ee111a7-c3a9-40af-8d89-a9027cc5e29e")]],
        demo: <DateField variant="wheel" label="Date of birth" />,
      },
    ],
  },
  {
    domain: "general",
    id: "photo-upload",
    title: "Upload · document photo",
    description: "ID and document photos are the slowest, most error-prone step of any verification flow. Pick a photo in each to see the done state.",
    question: "Which document photo upload should the template use?",
    pick: 2,
    verdict: "For ID cards the frame shows exactly what to photograph, so fewer photos get rejected. Use the compact row when a step asks for several documents; the dropzone on computer-first tools.",
    file: "photo-upload",
    usage: `import { PhotoUpload } from "@/components/candidates/photo-upload"

<PhotoUpload variant="camera" label="ID card (front)" name="id_front" required
  maxSizeMB={10} maxDimension={1600}               // resized in the browser before upload
  onValueChange={(file) => setIdFront(file)} />`,
    variants: [
      {
        name: "Compact row",
        note: "Current IT-2023 UploadField. Small, fits many documents on one step.",
        refs: [["IT-2023", "/docs/components#upload"]],
        demo: <PhotoUpload variant="row" label="ID card (front)" hint="In good light, with every word readable." />,
      },
      {
        name: "Dropzone",
        note: "Big target with a preview. Drag and drop on computers, tap on phones.",
        refs: [["iconiq file-upload", "https://iconiqui.com/"]],
        demo: <PhotoUpload variant="dropzone" label="ID card (front)" hint="In good light, with every word readable." />,
      },
      {
        name: "Camera frame",
        note: "Card-shaped frame that opens the camera. Shows exactly what to photograph.",
        refs: [["DoorDash", mobbin("4a30c1bb-1b94-4595-a3ad-9e7672a3cd9b")], ["Wise", mobbin("1aa66a67-7fdf-4bcc-9ded-0a1ddbb826f0")], ["Klarna", mobbin("92bc7f37-fd7b-46d9-9f20-c2fd84669c59")]],
        demo: <PhotoUpload variant="camera" label="ID card (front)" />,
      },
    ],
  },
  {
    domain: "general",
    id: "rating",
    title: "Feedback · service rating",
    description: "Asked once, after a task is done. It has to be answerable in one tap by someone who has never rated an app.",
    question: "Which rating should the template use?",
    pick: 2,
    verdict: "A face with a word under it is answerable by anyone, in any language, without knowing what 4 of 5 means. Stars if your audience already rates apps every day.",
    file: "rating",
    usage: `import { Rating } from "@/components/candidates/rating"

<Rating variant="faces" label="How was your experience?" name="rating" required
  onValueChange={(n) => send({ rating: n })} />     // 1–5`,
    variants: [
      {
        name: "Stars",
        note: "Universal. Shows the chosen word. Breaks the no-filled-icons rule.",
        refs: [["Instacart", mobbin("7f62e535-6640-44b1-b063-8cb2b6d2ce68")], ["Lyft", mobbin("77be3246-695c-4dd5-b318-920fc81d08b5")], ["Zomato", mobbin("4c953dc8-8d50-4734-b338-58bfe8318b16")]],
        demo: <RatingDemo variant="stars" />,
      },
      {
        name: "Numbers 1–5",
        note: "Plain and precise, with end labels. Feels like a survey.",
        refs: [["Craft", mobbin("41a2b5a4-abcb-4c80-abdc-8bf39ff5f7b4")]],
        demo: <RatingDemo variant="numbers" />,
      },
      {
        name: "Faces",
        note: "Face plus a word under each. Readable without numbers.",
        refs: [["Gov satisfaction surveys", "https://design-system.service.gov.uk/patterns/"]],
        demo: <RatingDemo variant="faces" />,
      },
      {
        name: "Fill bar",
        note: "Segments fill up to the choice. Compact; the level is easy to see.",
        refs: [["Urban Company", mobbin("23644ce7-e1fd-4f7f-a67e-6a83a5598535")]],
        demo: <RatingDemo variant="bar" />,
      },
    ],
  },
  {
    domain: "school",
    id: "attendance-mark",
    title: "Attendance · marking a student",
    description: "The one task a teacher repeats 30 times every morning. Fast, one-handed, and never ambiguous about who is missing.",
    question: "Which attendance marking should the template use?",
    pick: 3,
    verdict: "Most of a class is present, so start everyone present and tap only the few who aren’t: three taps instead of thirty. Use inline buttons when late and excused are common.",
    file: "attendance",
    usage: `import { AttendanceRoster } from "@/components/candidates/attendance"

<AttendanceRoster variant="exceptions" students={students} name="marks"
  value={marks} onValueChange={setMarks} />
// marks: { [studentId]: "present" | "late" | "absent" | "excused" }
// name posts hidden inputs marks[<studentId>] with a plain <form>.`,
    variants: [
      { name: "Inline buttons", note: "P / L / A / E on every row. One tap, every option visible, wide on small phones.", refs: [["Attio", mobbin("294bb80d-1bc4-4cf7-b0b0-396cccad7bc7")]], demo: <AttendanceDemo variant="segmented" /> },
      { name: "Tap to cycle", note: "One chip per student cycles Present → Late → Absent → Excused. Fastest, but hides the options.", refs: [["Luma", mobbin("9dd54074-60d0-4ca4-8723-fc41ad08b5ef")]], demo: <AttendanceDemo variant="cycle" /> },
      { name: "Present + menu", note: "Present is one tap; late, absent (no reason) and excused (with reason) live in a menu.", refs: [["Meetup", mobbin("8694a5dc-5a53-4188-a8a3-d51d8b461c9a")], ["Partiful", mobbin("3a1ef7f0-69df-4db5-9d2e-110182ca106b")]], demo: <AttendanceDemo variant="menu" /> },
      { name: "Mark exceptions", note: "Everyone starts present; tap the faces who aren’t. Matches how a roll call actually goes.", refs: [["Meetup “Not checked in”", mobbin("8694a5dc-5a53-4188-a8a3-d51d8b461c9a")]], demo: <AttendanceDemo variant="exceptions" /> },
    ],
  },
  {
    domain: "reporting",
    id: "quick-exit",
    title: "Safety · quick exit",
    description: "If someone walks in, the page must vanish. Exit replaces history so Back can’t return, and Shift ×3 works from anywhere. Try it here; the demo only shows a message.",
    question: "Which quick exit should the template use?",
    pick: 0,
    verdict: "Always visible and impossible to miss in a panic, which is what GOV.UK’s research found matters. Keep the Shift ×3 shortcut on in every variant.",
    file: "reporting",
    usage: `import { QuickExit } from "@/components/candidates/reporting"

<QuickExit variant="bar" href="https://www.google.com" />
// Replaces history so Back can’t return. Shift pressed 3 times also exits.`,
    variants: [
      { name: "Top bar", note: "Always visible, impossible to miss. Costs a strip of screen.", refs: [["GOV.UK Exit this page", "https://design-system.service.gov.uk/components/exit-this-page/"]], demo: <QuickExitDemo variant="bar" /> },
      { name: "Floating button", note: "Pinned under the thumb on phones. Can cover content at the bottom.", refs: [["GOV.UK pattern, mobile", "https://design-system.service.gov.uk/components/exit-this-page/"]], demo: <QuickExitDemo variant="floating" /> },
      { name: "Header link", note: "Quiet, relies more on the Shift shortcut. Easy to miss when panicking.", refs: [["GOV.UK shortcut", "https://design-system.service.gov.uk/components/exit-this-page/"]], demo: <QuickExitDemo variant="link" /> },
    ],
  },
  {
    domain: "reporting",
    id: "anonymity-choice",
    title: "Safety · staying anonymous",
    description: "The choice that decides whether a student reports at all. It must say plainly what each choice means.",
    question: "Which anonymity choice should the template use?",
    pick: 2,
    verdict: "Both choices spelled out, so nobody sends a report thinking they’re anonymous when they aren’t. The checkbox is too easy to miss for a choice this important.",
    file: "reporting",
    usage: `import { AnonymityChoice } from "@/components/candidates/reporting"

<AnonymityChoice variant="tiles" name="anonymous" defaultValue={true}
  onValueChange={(anon) => setAnonymous(anon)} />`,
    variants: [
      { name: "Switch", note: "One switch, the consequence written under it and updated live.", refs: [["Microsoft Outlook", mobbin("1f1f2635-6fa4-40f1-9a27-c7439db80837")]], demo: <AnonymityDemo variant="toggle" /> },
      { name: "Checkbox", note: "Smallest. Easy to overlook before sending.", refs: [["GroupMe", mobbin("a8953f93-1170-4c01-9ed7-c1a9b5c8409c")]], demo: <AnonymityDemo variant="checkbox" /> },
      { name: "Two tiles", note: "Both choices spelled out side by side. Takes more room, leaves no doubt.", refs: [["Polarsteps", mobbin("4b0e89f1-08a9-4ef2-96b9-f7ac17680508")]], demo: <AnonymityDemo variant="tiles" /> },
    ],
  },
  {
    domain: "reporting",
    id: "case-code",
    title: "Safety · case code receipt",
    description: "Without a name, the code is the only way back to a report. It has to survive being copied, remembered or written on paper.",
    question: "Which case code receipt should the template use?",
    pick: 2,
    verdict: "The code is the only way back to an anonymous report. Saving it as a file and saying it can’t be recovered prevents the worst outcome: a lost report.",
    file: "reporting",
    usage: `import { CaseCode } from "@/components/candidates/reporting"

<CaseCode variant="save" code={report.code} words={report.words}
  onCopy={() => toast.success("Copied")} />`,
    variants: [
      { name: "Reference number", note: "Familiar, compact, hard to remember without copying.", refs: [["LINE", mobbin("87cd99e7-a924-48e0-846f-c3bad50a18d1")]], demo: <CaseCodeDemo variant="number" /> },
      { name: "Three words", note: "Easy to remember and to say aloud to a counselor.", refs: [["BlaBlaCar", mobbin("a09b8eeb-c4b8-494e-bc79-765155b6b3fc")], ["what3words idea", "https://what3words.com"]], demo: <CaseCodeDemo variant="words" /> },
      { name: "Code + save", note: "Adds Save as file and says plainly the code can’t be recovered.", refs: [["Vinted", mobbin("7dd2cd75-11e9-49f7-ad13-2c8b092cbb7f")]], demo: <CaseCodeDemo variant="save" /> },
    ],
  },
  {
    domain: "library",
    id: "loan-row",
    title: "Loans · what’s borrowed and due",
    description: "Members check what’s due; librarians check what’s late. Overdue must stand out without shouting. Try Renew and Check in.",
    question: "Which loan row should the template use?",
    pick: 0,
    verdict: "Members scan a list of covers fastest, and the due chip carries the urgency. Librarians get the desk table: same data, denser, with Check in and Undo.",
    file: "library",
    usage: `import { LoanList } from "@/components/candidates/library"

<LoanList variant="row" loans={loans}
  onRenew={async (id) => { await api.renew(id); toast.success("Renewed") }}
  onCheckIn={async (id) => { await api.checkIn(id) }} />
// Loan: { id, title, author, member?, dueDate: "2026-10-15", loanDays, cannotRenew? }`,
    variants: [
      { name: "Cover row", note: "Cover, title, due chip, Renew. Scans well in a long list.", refs: [["Blinkist", mobbin("fe848152-6a9f-4645-8463-5a1b700084c7")], ["ElevenReader", mobbin("76fcfa64-8f74-4ccf-bce4-f63c1191080f")]], demo: <LoanDemo variant="row" /> },
      { name: "Loan card", note: "The loan period as a bar; time left is obvious at a glance.", refs: [["Amazon Kindle loans", mobbin("8c34ed78-d20b-4fcc-837f-85c2793b6c6a")]], demo: <LoanDemo variant="card" /> },
      { name: "Desk table", note: "Dense rows for the librarian: member, due, status, Check in with Undo.", refs: [["Attio", mobbin("294bb80d-1bc4-4cf7-b0b0-396cccad7bc7")]], demo: <LoanDemo variant="desk" /> },
    ],
  },
  {
    domain: "library",
    id: "scan-field",
    title: "Desk · scan to check out",
    description: "Most desks have a USB scanner that types the code and presses Enter. Phones use the camera. ISBNs are checksum-validated. Try 978-0-306-40615-7.",
    question: "Which scan field should the template use?",
    pick: 0,
    verdict: "Desk scanners type the code and press Enter, so a focused field is all a desk needs. Add the camera only where staff work from phones.",
    file: "library",
    usage: `import { ScanField } from "@/components/candidates/library"

<ScanField variant="input" onScan={async (isbn) => {
  const ok = await api.checkOut(isbn)
  return ok          // return false to keep the code in the field and show an error
}} />`,
    variants: [
      { name: "Scanner-ready field", note: "One field that a USB scanner fills; typing works the same way.", refs: [["MyFitnessPal", mobbin("dd409eb7-a207-44ec-9dd9-1d8fa92fb4db")]], demo: <ScanDemo variant="input" /> },
      { name: "Camera first", note: "Viewfinder with corner guides, manual entry underneath.", refs: [["Yazio", mobbin("81bbabd5-b98d-436e-a667-8be716aa70e0")], ["Bevel", mobbin("1b521d2a-eaea-46b0-a66f-72c0b7f36329")]], demo: <ScanDemo variant="camera" /> },
      { name: "Camera | Keyboard", note: "A switch at the top; each mode gets the whole space.", refs: [["ZARA", mobbin("64331b78-bda0-4508-9612-e2cecebde8c3")]], demo: <ScanDemo variant="tabs" /> },
    ],
  },
  {
    domain: "village",
    id: "status-tracker",
    title: "Requests · where is my letter",
    description: "The question residents call the office about. Say where the letter is, what it waits on, and what they can do. Try the rejected state.",
    question: "Which status tracker should the template use?",
    pick: 1,
    verdict: "Residents call to ask what happens next, not what already happened. Opening only the current step answers that, with one action and no wall of history.",
    file: "status-tracker",
    usage: `import { StatusTracker } from "@/components/candidates/status-tracker"

<StatusTracker variant="expanded" steps={steps} current={2}
  rejected={request.rejectedReason} />   // plain words: what’s wrong and what to do`,
    variants: [
      { name: "Timeline", note: "Every step with its time. Complete history, nothing hidden.", refs: [["Bolt Food", mobbin("9509b853-f44c-425e-81c0-c6e96efffe2c")]], demo: <TrackerDemo variant="timeline" /> },
      { name: "Current step open", note: "Only the current step expands, with what happens next and one action.", refs: [["IKEA", mobbin("423d9b74-1ffb-486f-b8ea-ca5c2ddc4481")], ["Vestiaire Collective", mobbin("984bf280-8384-4125-8136-360fc80eddf2")]], demo: <TrackerDemo variant="expanded" /> },
      { name: "Stepper + update", note: "Compact progress on top, the latest update in words below.", refs: [["Shopee", mobbin("5bd9141f-8c16-4f6b-b743-5ca9b64fe0ce")]], demo: <TrackerDemo variant="stepper" /> },
    ],
  },
  {
    domain: "foundations",
    id: "app-nav",
    title: "Navigation · moving around the app",
    description: "The frame every screen sits in. One items array drives all three variants, so a product can use a sidebar on computers and a bottom bar on phones.",
    question: "Which app navigation should the template use?",
    pick: 0,
    verdict: "Grouped sections with counts and a collapsible icon rail hold up as the product grows past five sections. Pair it with the bottom bar below 768px; use the top bar only for small sites with five or fewer sections.",
    file: "app-nav",
    usage: `import { AppNav } from "@/components/candidates/app-nav"
import Link from "next/link"

const items = [
  { id: "inbox", label: "Requests", icon: Inbox, href: "/requests", badge: 7 },
  { id: "residents", label: "Residents", icon: Users, href: "/residents", group: "Village" },
]

<AppNav variant="sidebar" items={items} value={activeId} LinkComponent={Link} brand="Sukamaju" />
<AppNav variant="bottom" items={items.slice(0, 5)} value={activeId} LinkComponent={Link} />  // fixed to the bottom`,
    variants: [
      { name: "Sidebar", note: "Sections, active item, counts; collapses to an icon rail.", refs: [["Linear", mobbin("46088879-314c-405c-88b5-eb7820c05efb")], ["Square", mobbin("886e2593-684e-4167-ae7f-46141a76b360")], ["GitBook", mobbin("5e25f82f-e668-4a52-8a81-eab81441a987")]], demo: <AppNavDemo variant="sidebar" /> },
      { name: "Top tabs", note: "Horizontal tabs under the product name; a menu on phones.", refs: [["GitBook", mobbin("5e25f82f-e668-4a52-8a81-eab81441a987")], ["Jira", mobbin("c3c48f78-98fd-4f17-bb06-7bd3bbf48064")]], demo: <AppNavDemo variant="top" /> },
      { name: "Bottom bar", note: "Three to five tabs in thumb reach, labels always shown.", refs: [["GitHub", mobbin("65ea599a-0c4d-434c-8e8f-6cd881ecf8f8")], ["Truecaller", mobbin("5ac800ad-606f-4f54-b0eb-f02d54904cf4")]], demo: <AppNavDemo variant="bottom" /> },
    ],
  },
  {
    domain: "foundations",
    id: "sign-in",
    title: "Account · sign in",
    description: "The first screen most people see. Errors from your server show in plain words; buttons stay pending while the request runs.",
    question: "Which sign in should the template use?",
    pick: 0,
    verdict: "One screen, and password managers fill both fields at once. Choose email first when you plan SSO or magic links for some accounts; magic link only when nobody should have a password at all.",
    file: "sign-in",
    usage: `import { SignIn } from "@/components/candidates/sign-in"

<SignIn variant="password"
  providers={[{ id: "google", label: "Continue with Google" }]}
  forgotHref="/forgot" signUpHref="/sign-up"
  onProvider={(id) => signIn(id)}
  onPassword={async ({ email, password }) => {
    const res = await signIn("credentials", { email, password, redirect: false })
    if (res?.error) throw new Error("Wrong email or password.")   // shown in the form
  }} />`,
    variants: [
      { name: "Email + password", note: "Providers, then both fields on one screen. Familiar everywhere.", refs: [["Campsite", mobbin("a9bc5e81-2c12-4737-b76d-30cfce4077f9")], ["Square", mobbin("d3fa9846-a3d7-4a43-aa05-ebe84657161d")]], demo: <SignInDemo variant="password" /> },
      { name: "Email first", note: "Email, then choose a link or a password. One question per screen.", refs: [["Slite", mobbin("5226025d-5914-4dcc-a817-20e1b412917c")], ["Coda", mobbin("7dcf63ee-7054-4e54-bf22-b7da802e6d01")]], demo: <SignInDemo variant="email-first" /> },
      { name: "Magic link", note: "No password at all; a link by email with a resend timer.", refs: [["Peec AI", mobbin("a94f60af-804f-4274-8844-74ecf775aa4e")]], demo: <SignInDemo variant="magic-link" /> },
    ],
  },
  {
    domain: "foundations",
    id: "password-field",
    title: "Account · create a password",
    description: "Rules shown before typing, checked as you type, and a deny-list for the passwords everyone tries first. Try “password1”.",
    question: "Which new password field should the template use?",
    pick: 0,
    verdict: "Every rule visible from the start, so nobody guesses why the button stays off. A meter alone says “weak” without saying what to change.",
    file: "password-field",
    usage: `import { PasswordField } from "@/components/candidates/password-field"
import { DEFAULT_RULES } from "@/lib/password"

<PasswordField variant="checklist" name="new-password" rules={DEFAULT_RULES}
  onValidityChange={setCanSubmit} />
// Check again on the server with checkPassword() from lib/password.`,
    variants: [
      { name: "Checklist", note: "Every rule listed, ticked as it’s met.", refs: [["Acorns", mobbin("a167b326-16f0-4b5c-8f9a-1f76307b8eea")], ["Binance", mobbin("8b0dc4dd-5651-42f0-883e-90f5aa20c9c3")]], demo: <PasswordDemo variant="checklist" /> },
      { name: "Strength meter", note: "Four-step bar and one hint about what to add next.", refs: [["foodpanda", mobbin("290b915e-7514-43cf-a781-5bbd62e47117")]], demo: <PasswordDemo variant="meter" /> },
      { name: "Rule chips", note: "Compact chips that turn green. Smallest footprint.", refs: [["Origin", mobbin("095f3830-331d-454f-89fd-e94566be0641")]], demo: <PasswordDemo variant="chips" /> },
    ],
  },
  {
    domain: "foundations",
    id: "phone-input",
    title: "Inputs · phone number",
    description: "Accepts 0812…, +62 812… or 62812… and always submits E.164 (+62812…), so your SMS provider gets one format. Try a number from another country.",
    question: "Which phone input should the template use?",
    pick: 0,
    verdict: "The country is visible and changeable without leaving the field, and the number pad opens straight away. Stacked is clearer for older users on narrow phones.",
    file: "phone-input",
    usage: `import { PhoneInput } from "@/components/candidates/phone-input"

<PhoneInput variant="split" name="phone" defaultCountry="ID" required
  hint="We text a code to this number." onValueChange={setPhone} />  // "+6281234567890"
// Validate again on the server with normalizePhone() from lib/phone.`,
    variants: [
      { name: "Split", note: "Country select beside the number.", refs: [["Artsy", mobbin("274cd7d8-e7fe-46a9-9e3d-3fcc5484f15c")], ["Alan", mobbin("376841a2-a33e-42a2-923b-f6a4bf2fb450")]], demo: <PhoneDemo variant="split" /> },
      { name: "Inline prefix", note: "One field; the country code is a button at its start.", refs: [["Deel", mobbin("53bbb738-7815-4749-8442-13967cd07cc2")]], demo: <PhoneDemo variant="inline" /> },
      { name: "Stacked", note: "Full-width country select above the number.", refs: [["Kraken", mobbin("60bb19c9-691c-405c-8b63-85350b20ee4b")], ["Monese", mobbin("32b5a982-af56-4cb1-ad40-94ad8c615fea")]], demo: <PhoneDemo variant="stacked" /> },
    ],
  },
  {
    domain: "data",
    id: "stat-card",
    title: "Dashboards · a number that matters",
    description: "Label, value, change against a named period. Green means better, not up: fewer overdue loans is good news. Hover or arrow through the line.",
    question: "Which stat card should the template use?",
    pick: 1,
    verdict: "The delta says which way it moved; the line says whether it’s a blip or a trend. Use the plain delta when a row of six cards would get busy; add the explanation where people argue about what a number means.",
    file: "stat-card",
    usage: `import { StatCard } from "@/components/candidates/stat-card"

<StatCard variant="spark" label="Overdue loans" value={23}
  delta={{ value: 5, period: "vs last week", goodWhen: "down", absolute: true }}
  trend={last12Weeks} />`,
    variants: [
      { name: "Delta", note: "Value and a change chip. Most compact.", refs: [["Obvious", mobbin("f8d79792-2e5d-4eac-aa5d-6050dce3aebb")], ["Mintlify", mobbin("205aefea-2dfc-4668-9af7-bc4921da1762")]], demo: <StatDemo variant="delta" /> },
      { name: "Sparkline", note: "Adds 12 points of history you can read point by point.", refs: [["Whop", mobbin("add1901d-9b32-4751-83e0-b44083fd2c03")], ["Navattic", mobbin("a5be5a57-9c24-49a2-9ce5-ccd5edc17a1b")]], demo: <StatDemo variant="spark" /> },
      { name: "Explained", note: "A comparison sentence and “What is this?”.", refs: [["Xero", mobbin("53cdffbc-e6e6-40b6-9f62-7a5a1a543a90")]], demo: <StatDemo variant="explained" /> },
    ],
  },
  {
    domain: "data",
    id: "filter-bar",
    title: "Lists · search, filter, sort",
    description: "One value shape for all three, filtered here by lib/filter (accent-insensitive search, OR inside a facet, AND across). Counts update as you filter.",
    question: "Which filter bar should the template use?",
    pick: 0,
    verdict: "Fits above any list without taking a column, and active filters stay visible as chips you can remove. Use the sidebar for catalogs with many facets; chips when there is one main facet.",
    file: "filter-bar",
    usage: `import { FilterBar } from "@/components/candidates/filter-bar"
import { applyFilters, EMPTY_FILTER } from "@/lib/filter"

const [filter, setFilter] = useState(EMPTY_FILTER)
const results = applyFilters(books, filter, { search: (b) => b.title, facet: (b, id) => b[id] })

<FilterBar variant="toolbar" facets={facets} sorts={sorts}
  value={filter} onValueChange={setFilter} resultCount={results.length}>
  <BookList books={results} />
</FilterBar>`,
    variants: [
      { name: "Toolbar", note: "Search, a dropdown per facet, sort; removable chips.", refs: [["Miro", mobbin("bb0d544b-0098-4703-8317-1641aa432d9b")], ["Sana AI", mobbin("77f9f4bc-2d72-40bd-a645-9c1260fa43e5")], ["Jira", mobbin("c3c48f78-98fd-4f17-bb06-7bd3bbf48064")]], demo: <FilterDemo variant="toolbar" /> },
      { name: "Sidebar", note: "Checkbox groups beside the list; a Filters sheet on phones.", refs: [["User Interviews", mobbin("151a6810-834a-491c-abd7-a45c73ca293d")]], demo: <FilterDemo variant="sidebar" /> },
      { name: "Chips", note: "Search and one row of chips with counts.", refs: [["Tabby", mobbin("6d39e50e-d8b5-43e0-b78a-7f96fcc12007")]], demo: <FilterDemo variant="chips" /> },
    ],
  },
  {
    domain: "data",
    id: "notifications",
    title: "Activity · notifications",
    description: "What changed since you last looked. Unread is a dot and a bold title, never color alone. Open one to mark it read; Mark all has Undo.",
    question: "Which notification list should the template use?",
    pick: 0,
    verdict: "Grouping by Today, Yesterday and Earlier answers “what’s new?” at a glance. Cards suit few, important notices; compact rows suit busy inboxes with actions.",
    file: "notifications",
    usage: `import { NotificationList } from "@/components/candidates/notifications"

<NotificationList variant="grouped" items={notices}
  onOpen={(id) => markRead(id)} onMarkAllRead={markAllRead} />
// Notice: { id, title, body?, time: ISO, read, category?, actor?, action? }`,
    variants: [
      { name: "Grouped by day", note: "Today, Yesterday, Earlier; unread dot; Mark all as read.", refs: [["Beli", mobbin("607c8cff-e74c-4c2f-a284-922870a33be2")], ["Luma", mobbin("6fa303e6-c330-410c-a676-b248fa51df6a")]], demo: <NotificationsDemo variant="grouped" /> },
      { name: "Cards + categories", note: "Category chips on top, one card each.", refs: [["Tabby", mobbin("6d39e50e-d8b5-43e0-b78a-7f96fcc12007")]], demo: <NotificationsDemo variant="cards" /> },
      { name: "Compact inbox", note: "Dense rows with initials and one inline action.", refs: [["Canva", mobbin("2a66d379-9fb8-4f0a-bef7-2e0233f86250")]], demo: <NotificationsDemo variant="compact" /> },
    ],
  },
];
