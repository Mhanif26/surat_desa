"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const LINKS = [
  ["/docs", "Getting started"],
  ["/docs/components", "Components"],
  ["/docs/iconiq", "iconiq"],
  ["/docs/components/reusable", "Reusable · vote"],
] as const;

export function DocsNav() {
  const path = usePathname();
  return (
    <nav aria-label="Docs" className="ml-auto flex h-full gap-5 overflow-x-auto [scrollbar-width:none]">
      {LINKS.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={path === href ? "page" : undefined}
          className={cn(
            "relative flex shrink-0 items-center text-sm whitespace-nowrap text-muted-foreground hover:text-heading",
            path === href && "font-semibold text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary"
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
