import { Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { ChartCard } from "@/components/charts/chart-card";
import {
  toVerificationChartData,
  VERIFICATION_SERIES,
} from "@/components/charts/chart-data";
import { outcomeColumns } from "@/components/domain/outcome-columns";
import { OutcomeSummaryTiles } from "@/components/domain/outcome-summary-tiles";
import { RemedialActionList } from "@/components/domain/remedial-action-list";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { formatMonth } from "@/lib/format";
import {
  getCohortRows,
  getCourseRows,
  getTraineesForProvider,
  PROVIDER_ROWS,
  type CourseRow,
} from "@/mocks/analytics";
import { getActionsForTarget } from "@/mocks/remedial-actions";

export const metadata = { title: "Provider" };

export default async function GovProviderPage(
  props: PageProps<"/gov/providers/[providerId]">,
) {
  const { providerId } = await props.params;
  const row = PROVIDER_ROWS.find((item) => item.provider.id === providerId);
  if (!row) notFound();

  const trainees = getTraineesForProvider(providerId);
  const courseRows = getCourseRows(trainees);
  const actions = getActionsForTarget(providerId);

  return (
    <>
      <PageHeader
        title={row.provider.name}
        description={`${row.districtName}. Registration ${row.provider.registrationRef}.`}
        breadcrumbs={[{ label: "Outcomes", href: "/gov/outcomes?tab=providers" }]}
        actions={
          <Button>
            <Plus aria-hidden="true" />
            New action
          </Button>
        }
      />
      <OutcomeSummaryTiles counts={row.counts} />

      <div className="mb-6">
        <ChartCard
          title="How placements are verified, by cohort"
          description="Share of certified trainees in work at W3, split by verification level."
          kind="stacked-bar"
          data={toVerificationChartData(
            getCohortRows(trainees).map((cohort) => ({
              label: formatMonth(cohort.key),
              counts: cohort.counts,
            })),
          )}
          categoryKey="label"
          categoryLabel="Cohort"
          series={VERIFICATION_SERIES}
          valueFormat="percent"
        />
      </div>

      <Card className="mb-6">
        <CardHeader title="By course" />
        <DataTable
          caption="Provider outcomes by course"
          rows={courseRows}
          getRowKey={(course) => course.course.id}
          columns={[
            {
              key: "course",
              header: "Course",
              cell: (course) => course.course.name,
            },
            ...outcomeColumns((course: CourseRow) => course.counts),
          ]}
        />
      </Card>

      <Card>
        <CardHeader title="Remedial actions" />
        {actions.length > 0 ? (
          <RemedialActionList actions={actions} />
        ) : (
          <p className="px-5 py-4 text-fg-muted">
            No actions for this provider.
          </p>
        )}
      </Card>
    </>
  );
}
