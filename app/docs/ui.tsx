import type * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "cn";

// Building blocks shared by every docs page.

export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-16 scroll-mt-24 border-t border-hairline pt-12 first-of-type:mt-12">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2 mb-6 max-w-[68ch] text-muted-foreground">{description}</p>
      {children}
    </section>
  );
}

export function Sub({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-8 mb-3 text-lg font-semibold">{children}</h3>;
}

export function Preview({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-xl border border-hairline bg-white p-6", className)}>{children}</div>;
}

export function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <span className="w-40 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

/** Where this would live in a real product. Every example carries one. */
export function Caption({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-xs text-muted-foreground">{children}</p>;
}

export function Code({ children, title }: { children: string; title?: string }) {
  return (
    <figure className="mt-4 overflow-hidden rounded-xl bg-canvas">
      {title && <figcaption className="border-b border-hairline px-4 py-2 font-mono text-xs text-muted-foreground">{title}</figcaption>}
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-heading">
        <code>{children}</code>
      </pre>
    </figure>
  );
}

/** [name, type, default, description] */
export function Props({ rows }: { rows: [string, string, string, string][] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-hairline">
      <table className="w-full text-left text-sm">
        <thead className="bg-canvas text-xs text-muted-foreground">
          <tr>
            {["Prop", "Type", "Default", ""].map((h, i) => (
              <th key={i} className="h-10 px-4 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {rows.map(([name, type, def, desc]) => (
            <tr key={name} className="align-top">
              <td className="px-4 py-3 font-mono text-xs font-semibold whitespace-nowrap text-heading">{name}</td>
              <td className="px-4 py-3 font-mono text-xs text-status-info-text">{type}</td>
              <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-muted-foreground">{def}</td>
              <td className="min-w-56 px-4 py-3 text-sm">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {[
        { title: "Do", items: dos, Icon: Check, tone: "text-status-success-text" },
        { title: "Don’t", items: donts, Icon: X, tone: "text-status-error-text" },
      ].map(({ title, items, Icon, tone }) => (
        <div key={title} className="rounded-xl border border-hairline p-5">
          <p className={cn("flex items-center gap-2 text-sm font-semibold", tone)}>
            <Icon className="size-4" strokeWidth={3} aria-hidden="true" />
            {title}
          </p>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm">
            {items.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
