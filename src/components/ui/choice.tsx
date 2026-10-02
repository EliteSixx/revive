import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ChoiceProps = Omit<ComponentProps<"input">, "type"> & {
  type: "checkbox" | "radio";
  label: ReactNode;
  description?: string;
};

/** A checkbox or radio where the whole row is clickable (design.md section 6). */
export function Choice({
  type,
  label,
  description,
  className,
  ...props
}: ChoiceProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-sm border border-border bg-surface px-3 py-2.5 hover:bg-surface-muted has-checked:border-primary has-checked:bg-primary-subtle",
        className,
      )}
    >
      <input
        type={type}
        className="mt-1 size-4 shrink-0 accent-primary"
        {...props}
      />
      <span>
        <span className="block text-fg">{label}</span>
        {description && (
          <span className="block text-small text-fg-muted">{description}</span>
        )}
      </span>
    </label>
  );
}

interface ChoiceGroupProps {
  legend: string;
  helperText?: string;
  children: ReactNode;
  className?: string;
}

export function ChoiceGroup({
  legend,
  helperText,
  children,
  className,
}: ChoiceGroupProps) {
  return (
    <fieldset className={cn("flex flex-col gap-2", className)}>
      <legend className="mb-1.5 text-label text-fg">{legend}</legend>
      {helperText && (
        <p className="-mt-1 mb-1 text-small text-fg-muted">{helperText}</p>
      )}
      {children}
    </fieldset>
  );
}
