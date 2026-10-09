import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// IT-2023 › Notice. Status fill + status text, 24px icon top-aligned.
// An error notice always states what went wrong and how to fix it.
const alertVariants = cva(
  "group/alert relative grid w-full gap-1 rounded-xl p-4 text-left text-base has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 *:[svg]:row-span-2 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-6",
  {
    variants: {
      variant: {
        neutral: "bg-surface-strong text-body",
        info: "bg-status-info-fill text-status-info-text",
        warning: "bg-status-warning-fill text-status-warning-text",
        success: "bg-status-success-fill text-status-success-text",
        error: "bg-status-error-fill text-status-error-text",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role={variant === "error" ? "alert" : "status"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("font-semibold group-has-[>svg]/alert:col-start-2", className)}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-pretty group-has-[>svg]/alert:col-start-2 [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
