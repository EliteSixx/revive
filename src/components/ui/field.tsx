import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FieldProps {
  /** Must match the id of the control passed as children. */
  id: string;
  label: string;
  helperText?: string;
  errorText?: string;
  isOptional?: boolean;
  className?: string;
  children: ReactNode;
}

/** Visible label above, helper text and error text below, as required by design.md section 6. */
export function Field({
  id,
  label,
  helperText,
  errorText,
  isOptional,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-label text-fg">
        {label}
        {isOptional && (
          <span className="font-normal text-fg-muted"> (optional)</span>
        )}
      </label>
      {children}
      {helperText && (
        <p id={`${id}-helper`} className="text-small text-fg-muted">
          {helperText}
        </p>
      )}
      {errorText && (
        <p
          id={`${id}-error`}
          className="flex items-center gap-1.5 text-small text-danger"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {errorText}
        </p>
      )}
    </div>
  );
}

/** Builds the aria-describedby value for a control inside a Field. */
export function describedBy(
  id: string,
  hasHelper: boolean,
  hasError: boolean,
): string | undefined {
  const ids = [hasHelper && `${id}-helper`, hasError && `${id}-error`].filter(
    Boolean,
  );
  return ids.length > 0 ? ids.join(" ") : undefined;
}
