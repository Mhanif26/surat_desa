import * as React from "react"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-lg border border-input bg-white px-4 py-2 text-base text-body transition-[border-color,box-shadow] duration-150 outline-none read-only:border-hairline file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-strong disabled:text-disabled aria-invalid:border-status-error aria-invalid:ring-1 aria-invalid:ring-status-error dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
