import Link from "next/link";
import { FilterBar } from "@/components/domain/filter-bar";
import { FollowUpStatusBadge } from "@/components/domain/status-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { ATTEMPT_RESULT_LABELS } from "@/lib/constants";
import { formatDate, formatNumber } from "@/lib/format";
import { AGENT_QUEUE } from "@/mocks/agent-queue";
import { DISTRICTS } from "@/mocks/reference";

export const metadata = { title: "Work queue" };

export default function AgentQueuePage() {
  return (
    <>
      <PageHeader
        title="Work queue"
        description="Trainees who have not answered automated follow-ups. Oldest closing date first."
      />
      <FilterBar
        filters={[
          {
            id: "district",
            label: "District",
            options: [
              { value: "all", label: "All districts" },
              ...DISTRICTS.map((district) => ({
                value: district.code,
                label: district.name,
              })),
            ],
          },
          {
            id: "window",
            label: "Follow-up",
            options: [
              { value: "all", label: "All follow-ups" },
              { value: "W3", label: "W3" },
              { value: "W6", label: "W6" },
              { value: "W12", label: "W12" },
            ],
          },
          {
            id: "attempts",
            label: "Attempts",
            options: [
              { value: "all", label: "Any number" },
              { value: "0", label: "Not yet called" },
              { value: "3+", label: "3 or more" },
            ],
          },
        ]}
      />
      <Card>
        <DataTable
          caption="Open follow-up tasks"
          rows={[...AGENT_QUEUE].sort((a, b) =>
            a.closesAt.localeCompare(b.closesAt),
          )}
          getRowKey={(item) => item.taskId}
          totalCount={AGENT_QUEUE.length}
          columns={[
            {
              key: "trainee",
              header: "Trainee",
              cell: (item) => (
                <Link
                  href={`/agent/tasks/${item.taskId}`}
                  className="font-medium text-primary hover:underline"
                >
                  {item.traineeName}
                </Link>
              ),
            },
            {
              key: "district",
              header: "District",
              cell: (item) => item.districtName,
            },
            { key: "window", header: "Follow-up", cell: (item) => item.window },
            {
              key: "closes",
              header: "Closes",
              cell: (item) => formatDate(item.closesAt),
            },
            {
              key: "attempts",
              header: "Attempts",
              align: "right",
              cell: (item) => formatNumber(item.attemptCount),
            },
            {
              key: "last-result",
              header: "Last result",
              cell: (item) =>
                item.lastResult
                  ? ATTEMPT_RESULT_LABELS[item.lastResult]
                  : "Not yet called",
            },
            {
              key: "status",
              header: "Status",
              cell: (item) => <FollowUpStatusBadge status={item.status} />,
            },
          ]}
        />
      </Card>
    </>
  );
}
