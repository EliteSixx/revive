"use client";

import { useState, useId } from "react";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface DisclosureExpanderProps {
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Keyboard-accessible accordion (aria-expanded / aria-controls).
 * Used to put secondary content behind a chevron (design principle 2).
 */
export function DisclosureExpander({
  label,
  children,
  defaultOpen = false,
  className,
}: DisclosureExpanderProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={cn("border-t border-border", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left text-small font-medium text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-primary"
      >
        {label}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform duration-150",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className={cn("px-5 pb-4", !open && "hidden")}
      >
        {children}
      </div>
    </div>
  );
}
