import { TriangleAlert } from "lucide-react";

/** Marks legal text that the team has not yet reviewed. Remove before launch. */
export function DraftNotice({ children }: { children: string }) {
  return (
    <p
      role="note"
      className="flex items-start gap-2 rounded-sm border border-warning/30 bg-warning-subtle px-3 py-2 text-small text-fg"
    >
      <TriangleAlert
        className="mt-0.5 size-4 shrink-0 text-warning"
        aria-hidden="true"
      />
      {children}
    </p>
  );
}
