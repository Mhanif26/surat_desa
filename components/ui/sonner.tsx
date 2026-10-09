"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheck, Info, TriangleAlert, CircleAlert, LoaderCircle } from "lucide-react"

// IT-2023 › Toasts: top center, 4s (pass duration: 6000 when there's an action).
// Only for confirming what the person just did; never for blocking errors.
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      duration={4000}
      className="toaster group"
      icons={{
        success: <CircleCheck className="size-5 text-status-success-text" />,
        info: <Info className="size-5 text-status-info-text" />,
        warning: <TriangleAlert className="size-5 text-status-warning-text" />,
        error: <CircleAlert className="size-5 text-status-error-text" />,
        loading: <LoaderCircle className="size-5 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--color-heading)",
          "--normal-border": "var(--hairline)",
          "--border-radius": "var(--radius-xl)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast !shadow-float !text-base !font-sans",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
