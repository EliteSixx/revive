import { outcomeColumns } from "@/components/domain/outcome-columns";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import type { GroupedCounts } from "@/mocks/aggregate";

interface BreakdownTableProps {
  title: string;
  groupHeader: string;
  groups: readonly GroupedCounts[];
  labels: Record<string, string>;
}

/** Outcome table for one demographic dimension. */
export function BreakdownTable({
  title,
  groupHeader,
  groups,
  labels,
}: BreakdownTableProps) {
  return (
    <Card>
      <CardHeader title={title} />
      <DataTable
        caption={title}
        rows={groups}
        getRowKey={(group) => group.key}
        columns={[
          {
            key: "group",
            header: groupHeader,
            cell: (group) => labels[group.key] ?? group.key,
          },
          ...outcomeColumns((group: GroupedCounts) => group.counts),
        ]}
      />
    </Card>
  );
}
