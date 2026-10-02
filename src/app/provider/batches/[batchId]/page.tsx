import { notFound } from "next/navigation";
import { VerificationBadge } from "@/components/domain/verification-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { NON_PLACEMENT_REASONS, OUTCOME_TYPE_LABELS } from "@/lib/constants";
import { formatDate, formatRupees } from "@/lib/format";
import { CURRENT_PROVIDER, findProviderBatch } from "@/mocks/batches";

export const metadata = { title: "Batch" };

export default async function ProviderBatchPage(
  props: PageProps<"/provider/batches/[batchId]">,
) {
  const { batchId } = await props.params;
  const summary = findProviderBatch(CURRENT_PROVIDER.id, batchId);
  if (!summary) notFound();

  return (
    <>
      <PageHeader
        title={summary.course.name}
        description={`${summary.centre.name}. Training ${formatDate(summary.batch.startDate)} to ${formatDate(summary.batch.endDate)}.`}
        breadcrumbs={[{ label: "Batches", href: "/provider/batches" }]}
      />
      <Card>
        <CardHeader
          title="Trainees"
          description={`Batch ${summary.batch.id}. Status at the 3-month follow-up (W3).`}
        />
        <DataTable
          caption="Trainees in this batch"
          rows={summary.trainees}
          getRowKey={(trainee) => trainee.id}
          totalCount={summary.trainees.length}
          columns={[
            {
              key: "name",
              header: "Trainee",
              cell: (trainee) => trainee.fullName,
            },
            {
              key: "responded",
              header: "Responded at W3",
              cell: (trainee) => (trainee.w3Responded ? "Yes" : "No"),
            },
            {
              key: "outcome",
              header: "Outcome at W3",
              cell: (trainee) =>
                trainee.w3Outcome
                  ? OUTCOME_TYPE_LABELS[trainee.w3Outcome]
                  : "Unknown",
            },
            {
              key: "detail",
              header: "Detail",
              cell: (trainee) =>
                trainee.wageAtW3 !== null
                  ? formatRupees(trainee.wageAtW3)
                  : trainee.nonPlacementReason
                    ? NON_PLACEMENT_REASONS[trainee.nonPlacementReason]
                    : "",
            },
            {
              key: "verification",
              header: "Verification",
              cell: (trainee) =>
                trainee.verificationLevel ? (
                  <VerificationBadge level={trainee.verificationLevel} />
                ) : (
                  ""
                ),
            },
          ]}
        />
      </Card>
    </>
  );
}
