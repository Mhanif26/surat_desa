"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const query = "(min-width: 640px)"
const subscribe = (cb: () => void) => {
  const m = matchMedia(query)
  m.addEventListener("change", cb)
  return () => m.removeEventListener("change", cb)
}

/** IT-2023 › Phones get sheets, not dialogs. Dialog from 640px, bottom sheet below. */
export function ResponsiveDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  footer,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
}) {
  const desktop = React.useSyncExternalStore(subscribe, () => matchMedia(query).matches, () => true)

  if (desktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          {children}
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-semibold text-heading">{title}</DrawerTitle>
          {description && <DrawerDescription className="text-base">{description}</DrawerDescription>}
        </DrawerHeader>
        {children && <div className="px-6">{children}</div>}
        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  )
}
