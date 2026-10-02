import { cn } from "@/lib/cn";
import { SUPPRESSED_LABEL } from "@/lib/metrics";

interface MetricTileProps {
  label: string;
  /** Pre-formatted value, or null when the value is suppressed or not yet available. */
  value: string | null;
  /** Base line under the value, e.g. "n = 1,240 certified". */
  baseText?: string;
  /** Extra context such as the verified share. */
  detailText?: string;
  /** Shown instead of the value when it is null. */
  missingText?: string;
  className?: string;
}

/** A headline number with its base and context (design.md section 6). */
export function MetricTile({
  label,
  value,
  baseText,
  detailText,
  missingText = SUPPRESSED_LABEL,
  className,
}: MetricTileProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface p-4",
        className,
      )}
    >
      <p className="text-label text-fg-muted">{label}</p>
      <p
        className={cn(
          "mt-1 tabular-nums",
          value === null ? "text-h2 text-fg-muted" : "text-metric",
        )}
      >
        {value ?? missingText}
      </p>
      {baseText && <p className="mt-1 text-small text-fg-muted">{baseText}</p>}
      {detailText && <p className="text-small text-fg-muted">{detailText}</p>}
    </div>
  );
}
