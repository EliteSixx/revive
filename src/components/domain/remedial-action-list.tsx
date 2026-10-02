import { REMEDIAL_ACTION_TARGET_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { ActionStatusBadge } from "./status-badge";
import type { RemedialAction } from "@/types/domain";

export function RemedialActionList({
  actions,
}: {
  actions: readonly RemedialAction[];
}) {
  return (
    <ul>
      {actions.map((action) => (
        <li
          key={action.id}
          className="border-b border-border px-5 py-4 last:border-b-0"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-h3">{action.title}</h3>
            <ActionStatusBadge status={action.status} />
          </div>
          <p className="mt-1 text-small text-fg-muted">
            {REMEDIAL_ACTION_TARGET_LABELS[action.targetType]}:{" "}
            {action.targetName}. Assigned to {action.assigneeName}. Due{" "}
            {formatDate(action.dueDate)}.
          </p>
          <p className="mt-2">{action.notes}</p>
        </li>
      ))}
    </ul>
  );
}
