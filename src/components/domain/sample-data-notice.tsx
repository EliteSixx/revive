import { Info } from "lucide-react";
import { ResetSampleDataButton } from "./reset-sample-data-button";

/** Required on every page that shows mock data (rules.md, section C). */
export function SampleDataNotice() {
  return (
    <div
      role="note"
      className="mb-6 flex flex-wrap items-start justify-between gap-x-4 gap-y-1 rounded-sm border border-primary/20 bg-info-subtle px-3 py-2 text-small text-fg"
    >
      <p className="flex items-start gap-2">
        <Info
          className="mt-0.5 size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        Sample data. These figures are synthetic and for demonstration only.
      </p>
      <ResetSampleDataButton />
    </div>
  );
}
