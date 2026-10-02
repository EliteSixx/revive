"use client";

import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { ReactNode } from "react";

interface ConfirmDialogProps {
  trigger: ReactNode;
  title: string;
  description: string;
  /** Buttons for the footer. Wrap the cancel button in <DialogClose asChild>. */
  footer: ReactNode;
}

export const DialogClose = DialogPrimitive.Close;

/** Dialogs are used for confirmations only (design.md section 6). */
export function ConfirmDialog({
  trigger,
  title,
  description,
  footer,
}: ConfirmDialogProps) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-fg/40 transition-opacity duration-200 data-[state=closed]:opacity-0" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md border border-border bg-surface p-6 shadow-overlay">
          <div className="flex items-start justify-between gap-4">
            <DialogPrimitive.Title className="text-h2">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              className="rounded-sm p-1 text-fg-muted hover:bg-surface-muted"
              aria-label="Close"
            >
              <X className="size-5" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Description className="mt-2 text-fg-muted">
            {description}
          </DialogPrimitive.Description>
          <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
