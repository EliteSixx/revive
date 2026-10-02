import { ChartCard } from "@/components/charts/chart-card";
import {
  toVerificationChartData,
  VERIFICATION_SERIES,
} from "@/components/charts/chart-data";
import { outcomeColumns } from "@/components/domain/outcome-columns";
import { OutcomeSummaryTiles } from "@/components/domain/outcome-summary-tiles";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { formatMonth } from "@/lib/format";
import { countOutcomes } from "@/mocks/aggregate";
import {
  getCohortRows,
  getCourseRows,
  getTraineesForProvider,
} from "@/mocks/analytics";
import { CURRENT_PROVIDER } from "@/mocks/batches";

export const metadata = { title: "Scorecard" };

export default function ProviderScorecardPage() {
  const trainees = getTraineesForProvider(CURRENT_PROVIDER.id);
  const counts = countOutcomes(trainees);
  const courseRows = getCourseRows(trainees);
  const cohortRows = getCohortRows(trainees);

  return (
    <>
      <PageHeader
        title="Scorecard"
        description="Outcomes for trainees certified by your centres, Jul 2025 to Feb 2026 cohorts."
      />
      <OutcomeSummaryTiles counts={counts} />

      <div className="mb-6">
        <ChartCard
          title="How placements are verified, by cohort"
          description="Share of certified trainees in work at W3, split by verification level."
          kind="stacked-bar"
          data={toVerificationChartData(
            cohortRows.map((row) => ({
              label: formatMonth(row.key),
              counts: row.counts,
            })),
          )}
          categoryKey="label"
          categoryLabel="Cohort"
          series={VERIFICATION_SERIES}
          valueFormat="percent"
        />
      </div>

      <Card>
        <CardHeader title="By course" />
        <DataTable
          caption="Outcomes by course"
          rows={courseRows}
          getRowKey={(row) => row.course.id}
          columns={[
            { key: "course", header: "Course", cell: (row) => row.course.name },
            ...outcomeColumns((row: (typeof courseRows)[number]) => row.counts),
          ]}
        />
      </Card>
    </>
  );
}
