"use client";

import * as Popover from "radix-ui/react-popover";
import { Info } from "lucide-react";
import { cn } from "@/lib/cn";

interface InfoPopoverProps {
  label: string;
  definition: string;
  /** Optional formula or numerator/denominator note. */
  formula?: string;
  className?: string;
}

/**
 * Small (i) button that opens a popover with a metric definition.
 * Keeps definitions out of inline text (design principle 5).
 */
export function InfoPopover({ label, definition, formula, className }: InfoPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={`Definition of ${label}`}
          className={cn(
            "inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-fg-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-primary",
            className,
          )}
        >
          <Info className="size-4" aria-hidden="true" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          align="start"
          sideOffset={6}
          className="z-50 max-w-xs rounded-md border border-border bg-surface p-3 text-small shadow-[0_4px_16px_rgba(22,25,31,0.12)]"
        >
          <p className="font-medium text-fg">{label}</p>
          <p className="mt-1 text-fg-muted">{definition}</p>
          {formula && (
            <p className="mt-1 text-fg-subtle">
              <span className="font-medium">Formula: </span>
              {formula}
            </p>
          )}
          <Popover.Arrow className="fill-border" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
