import { Info } from "lucide-react";

/** Required on every page that shows mock data (rules.md, section C). */
export function SampleDataNotice() {
  return (
    <p
      role="note"
      className="mb-6 flex items-start gap-2 rounded-sm border border-primary/20 bg-info-subtle px-3 py-2 text-small text-fg"
    >
      <Info
        className="mt-0.5 size-4 shrink-0 text-primary"
        aria-hidden="true"
      />
      Sample data. These figures are synthetic and for demonstration only.
    </p>
  );
}
