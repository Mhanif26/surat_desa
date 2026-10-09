import { DocsNav } from "./nav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en" className="min-h-dvh">
      <header className="material-bar sticky top-0 z-40 border-b">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-4 sm:px-6">
          <span className="shrink-0 text-lg font-bold text-heading">IT-2023</span>
          <span className="hidden text-muted-foreground sm:inline" aria-hidden="true">/</span>
          <span className="hidden text-muted-foreground sm:inline">Design system</span>
          <DocsNav />
        </div>
      </header>
      {children}
    </div>
  );
}
