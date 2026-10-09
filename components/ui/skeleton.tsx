import { cn } from "cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(// Appears only after 300ms so a quick load never flashes it. No shimmer.
      "animate-in fade-in-0 rounded-lg bg-surface-strong delay-300 duration-150 [animation-fill-mode:backwards]", className)}
      {...props}
    />
  )
}

export { Skeleton }
