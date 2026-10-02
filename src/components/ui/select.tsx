import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { controlClassName } from "./input";

export interface SelectOption {
  value: string;
  label: string;
}

type SelectProps = ComponentProps<"select"> & {
  options: readonly SelectOption[];
  placeholder?: string;
};

/** Native select: accessible and usable on basic phones without extra JavaScript. */
export function Select({
  className,
  options,
  placeholder,
  ...props
}: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(controlClassName, "h-10 appearance-none pr-9", className)}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-fg-muted"
        aria-hidden="true"
      />
    </div>
  );
}
