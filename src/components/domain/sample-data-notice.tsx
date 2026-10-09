import { Info } from "lucide-react";
import { ResetSampleDataButton } from "./reset-sample-data-button";

/**
 * Quiet label on every page that shows sample figures, so they are never taken
 * for real results (rules.md, section C). Remove once real data is connected.
 */
export function SampleDataNotice() {
  return (
    <div
      role="note"
      className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-fg-muted"
    >
      <p className="flex items-center gap-1.5">
        <Info className="size-4 shrink-0" aria-hidden="true" />
        Figures shown use sample data.
      </p>
      <ResetSampleDataButton />
    </div>
  );
}
