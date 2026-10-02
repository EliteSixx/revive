import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export const controlClassName =
  "w-full rounded-sm border border-border-strong bg-surface px-3 text-fg placeholder:text-fg-subtle disabled:bg-surface-muted disabled:text-fg-muted aria-invalid:border-danger";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input className={cn(controlClassName, "h-10", className)} {...props} />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(controlClassName, "min-h-24 py-2", className)}
      {...props}
    />
  );
}
