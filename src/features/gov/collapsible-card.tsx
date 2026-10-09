"use client";

import { useState, useId, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface CollapsibleCardProps {
  title: string;
  description?: string;
  badge?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

/**
 * Clean, accessible collapsible card section.
 * Group related data under clearly labeled, collapsed-by-default sections
 * with an accordion chevron to expand on demand.
 */
export function CollapsibleCard({
  title,
  description,
  badge,
  defaultOpen = false,
  children,
  className,
  headerClassName,
  bodyClassName,
}: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface transition-shadow",
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-surface-muted/60 focus-visible:outline-2 focus-visible:outline-primary",
          open && "border-b border-border/70",
          headerClassName,
        )}
      >
        <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-h3 font-semibold text-fg">{title}</h3>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className="text-small text-fg-muted sm:ml-auto sm:pr-4">
              {description}
            </p>
          )}
        </div>
        <div className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-surface-muted text-fg-muted transition-colors">
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-200",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </div>
      </button>

      <div
        id={contentId}
        hidden={!open}
        className={cn("p-5", !open && "hidden", bodyClassName)}
      >
        {children}
      </div>
    </div>
  );
}
