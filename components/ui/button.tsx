import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"
import { LoaderCircle } from "lucide-react"

// IT-2023 › Buttons. Press answers on press: scale 0.97 in 100ms, back in 160ms.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent font-semibold whitespace-nowrap select-none transition-[scale,background-color,border-color,color] duration-160 ease-out active:scale-97 active:duration-100 disabled:pointer-events-none disabled:border-transparent disabled:bg-surface-strong disabled:text-disabled aria-busy:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-hover",
        outline:
          "border-primary bg-background text-primary hover:bg-primary-soft active:bg-primary-soft",
        soft: "bg-surface-strong text-primary hover:bg-hairline active:bg-hairline",
        ghost: "text-primary hover:bg-surface-strong active:bg-surface-strong",
        link: "h-auto px-0 text-primary underline underline-offset-4 active:scale-100",
        "destructive-outline":
          "border-status-error bg-background text-status-error-text hover:bg-status-error-fill active:bg-status-error-fill",
      },
      size: {
        default: "h-12 px-5 text-base", // default, 48px
        dense: "h-11 px-4 text-sm", // dense tools, 44px
        sm: "h-9 px-3 text-xs", // inline actions such as "Edit" inside a row
        icon: "size-11", // dense tools only, always with aria-label + tooltip
        // Small icon buttons used inside other shadcn parts (carousel arrows, sheet close, combobox clear).
        // Their hit area is extended by the parent; don't use them as standalone targets.
        "icon-sm": "size-9",
        "icon-xs": "size-7 rounded-md [&_svg:not([class*='size-'])]:size-4",
        xs: "h-7 gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** Shows a spinner and this label ("Saving…"). The button keeps its width. */
    pending?: boolean
    pendingLabel?: React.ReactNode
  }

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  pending = false,
  pendingLabel,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      aria-busy={pending || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {pendingLabel === undefined ? (
        children
      ) : (
        // Both labels share one grid cell, so the wider one sets the width.
        <span className="grid *:col-start-1 *:row-start-1 *:inline-flex *:items-center *:justify-center *:gap-2">
          <span className={cn(pending && "invisible")}>{children}</span>
          <span className={cn(!pending && "invisible")} aria-hidden={!pending}>
            <LoaderCircle className="animate-spin [animation-duration:800ms]" aria-hidden="true" />
            {pendingLabel}
          </span>
        </span>
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
