import { Plus } from "lucide-react";
import { ActionStatusBadge } from "@/components/domain/status-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { REMEDIAL_ACTION_TARGET_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { REMEDIAL_ACTIONS } from "@/mocks/remedial-actions";

export const metadata = { title: "Actions" };

export default function GovActionsPage() {
  return (
    <>
      <PageHeader
        title="Remedial actions"
        description="Actions created from the outcome data, with who owns them and when they are due."
        actions={
          <Button>
            <Plus aria-hidden="true" />
            New action
          </Button>
        }
      />
      <Card>
        <DataTable
          caption="Remedial actions"
          rows={REMEDIAL_ACTIONS}
          getRowKey={(action) => action.id}
          totalCount={REMEDIAL_ACTIONS.length}
          columns={[
            {
              key: "title",
              wrap: true,
              header: "Action",
              cell: (action) => (
                <span className="font-medium">{action.title}</span>
              ),
            },
            {
              key: "target",
              header: "For",
              cell: (action) =>
                `${REMEDIAL_ACTION_TARGET_LABELS[action.targetType]}: ${action.targetName}`,
            },
            {
              key: "assignee",
              header: "Owner",
              cell: (action) => action.assigneeName,
            },
            {
              key: "due",
              header: "Due",
              cell: (action) => formatDate(action.dueDate),
            },
            {
              key: "status",
              header: "Status",
              cell: (action) => <ActionStatusBadge status={action.status} />,
            },
          ]}
        />
      </Card>
    </>
  );
}
