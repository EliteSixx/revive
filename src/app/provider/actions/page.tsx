import { RemedialActionList } from "@/components/domain/remedial-action-list";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { CURRENT_PROVIDER } from "@/mocks/batches";
import { getActionsForTarget } from "@/mocks/remedial-actions";

export const metadata = { title: "Actions" };

export default function ProviderActionsPage() {
  const actions = getActionsForTarget(CURRENT_PROVIDER.id);

  return (
    <>
      <PageHeader
        title="Actions"
        description="Improvement actions the department has assigned to your organisation."
      />
      <Card>
        {actions.length > 0 ? (
          <RemedialActionList actions={actions} />
        ) : (
          <EmptyState
            title="No actions assigned"
            description="When the department assigns an action to your organisation, it appears here."
          />
        )}
      </Card>
    </>
  );
}
