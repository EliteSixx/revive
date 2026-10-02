import { ChartCard } from "@/components/charts/chart-card";
import { toRateChartData } from "@/components/charts/chart-data";
import { CHART_COLORS } from "@/components/charts/palette";
import { FilterBar } from "@/components/domain/filter-bar";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { GOV_FILTERS } from "@/features/gov/gov-filters";
import { formatMonth } from "@/lib/format";
import {
  computeOutcomeRates,
  formatRate,
  formatReportCount,
  NOT_YET_DUE_LABEL,
  SUPPRESSED_LABEL,
} from "@/lib/metrics";
import { COHORT_ROWS } from "@/mocks/analytics";

export const metadata = { title: "Cohorts" };

export default function GovCohortsPage() {
  const groups = COHORT_ROWS.map((row) => ({
    label: formatMonth(row.key),
    counts: row.counts,
  }));

  return (
    <>
      <PageHeader
        title="Cohorts"
        description="Each cohort is the trainees certified in one month, followed across W3, W6 and W12."
      />
      <FilterBar filters={GOV_FILTERS} />

      <div className="mb-6">
        <ChartCard
          title="Outcomes by cohort"
          description="Placement at W3, and retention at W6 and W12 among those in work at W3."
          kind="line"
          data={toRateChartData(groups, [
            "placementRate",
            "retentionW6",
            "retentionW12",
          ])}
          categoryKey="label"
          categoryLabel="Cohort"
          series={[
            {
              key: "placementRate",
              label: "Placement (W3)",
              color: CHART_COLORS[0],
            },
            {
              key: "retentionW6",
              label: "Retention (W6)",
              color: CHART_COLORS[2],
            },
            {
              key: "retentionW12",
              label: "Retention (W12)",
              color: CHART_COLORS[3],
            },
          ]}
          valueFormat="percent"
        />
      </div>

      <Card>
        <CardHeader
          title="Cohort table"
          description="W12 is shown only for cohorts whose W12 window has closed."
        />
        <DataTable
          caption="Outcomes by cohort"
          rows={groups}
          getRowKey={(row) => row.label}
          columns={[
            { key: "cohort", header: "Certified in", cell: (row) => row.label },
            {
              key: "certified",
              header: "Certified",
              align: "right",
              cell: (row) => formatReportCount(row.counts.certified),
            },
            {
              key: "response",
              header: "Response (W3)",
              align: "right",
              cell: (row) =>
                formatRate(computeOutcomeRates(row.counts).responseRate) ??
                SUPPRESSED_LABEL,
            },
            {
              key: "placement",
              header: "Placement (W3)",
              align: "right",
              cell: (row) =>
                formatRate(computeOutcomeRates(row.counts).placementRate) ??
                SUPPRESSED_LABEL,
            },
            {
              key: "verified",
              header: "Verified placement (W3)",
              align: "right",
              cell: (row) =>
                formatRate(
                  computeOutcomeRates(row.counts).verifiedPlacementRate,
                ) ?? SUPPRESSED_LABEL,
            },
            {
              key: "w6",
              header: "Retention (W6)",
              align: "right",
              cell: (row) => {
                const rate = computeOutcomeRates(row.counts).retentionW6;
                return rate === null
                  ? NOT_YET_DUE_LABEL
                  : (formatRate(rate) ?? SUPPRESSED_LABEL);
              },
            },
            {
              key: "w12",
              header: "Retention (W12)",
              align: "right",
              cell: (row) => {
                const rate = computeOutcomeRates(row.counts).retentionW12;
                return rate === null
                  ? NOT_YET_DUE_LABEL
                  : (formatRate(rate) ?? SUPPRESSED_LABEL);
              },
            },
          ]}
        />
      </Card>
    </>
  );
}
