import Link from "next/link";
import { ChartCard } from "@/components/charts/chart-card";
import {
  toRateChartData,
  toVerificationChartData,
  VERIFICATION_SERIES,
} from "@/components/charts/chart-data";
import { CHART_COLORS } from "@/components/charts/palette";
import { FilterBar } from "@/components/domain/filter-bar";
import { outcomeColumns } from "@/components/domain/outcome-columns";
import { OutcomeSummaryTiles } from "@/components/domain/outcome-summary-tiles";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { GOV_FILTERS } from "@/features/gov/gov-filters";
import { formatMonth } from "@/lib/format";
import { computeOutcomeRates, rateSortValue } from "@/lib/metrics";
import {
  COHORT_ROWS,
  PROVIDER_ROWS,
  STATE_COUNTS,
  type ProviderRow,
} from "@/mocks/analytics";

export const metadata = { title: "Overview" };

export default function GovOverviewPage() {
  const cohortGroups = COHORT_ROWS.map((row) => ({
    label: formatMonth(row.key),
    counts: row.counts,
  }));

  return (
    <>
      <PageHeader
        title="Overview"
        description="Outcomes for all certified trainees in the selected period. Every rate shows its base."
      />
      <FilterBar filters={GOV_FILTERS} />
      <OutcomeSummaryTiles counts={STATE_COUNTS} />

      <div className="mb-6 grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Placement by cohort"
          description="Placement rate at W3, all sources and verified only, by certification month."
          kind="line"
          data={toRateChartData(cohortGroups, [
            "placementRate",
            "verifiedPlacementRate",
          ])}
          categoryKey="label"
          categoryLabel="Cohort"
          series={[
            {
              key: "placementRate",
              label: "All sources",
              color: CHART_COLORS[0],
            },
            {
              key: "verifiedPlacementRate",
              label: "Verified only",
              color: CHART_COLORS[2],
            },
          ]}
          valueFormat="percent"
        />
        <ChartCard
          title="How placements are verified, by provider"
          description="Share of certified trainees in work at W3, split by verification level."
          kind="stacked-bar"
          isHorizontal
          data={toVerificationChartData(
            PROVIDER_ROWS.map((row) => ({
              label: row.provider.name,
              counts: row.counts,
            })),
          )}
          categoryKey="label"
          categoryLabel="Provider"
          series={VERIFICATION_SERIES}
          valueFormat="percent"
          height={360}
        />
      </div>

      <Card>
        <CardHeader
          title="Providers"
          description="Sorted by verified placement rate, lowest first, to show where help is needed."
          action={
            <Button asChild variant="secondary" size="sm">
              <Link href="/gov/providers">All providers</Link>
            </Button>
          }
        />
        <DataTable
          caption="Providers by verified placement rate"
          rows={[...PROVIDER_ROWS].sort(compareByVerifiedPlacement)}
          getRowKey={(row) => row.provider.id}
          columns={[
            {
              key: "provider",
              header: "Provider",
              cell: (row) => (
                <Link
                  href={`/gov/providers/${row.provider.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {row.provider.name}
                </Link>
              ),
            },
            {
              key: "district",
              header: "District",
              cell: (row) => row.districtName,
            },
            ...outcomeColumns((row: ProviderRow) => row.counts),
          ]}
        />
      </Card>
    </>
  );
}

/** Lowest verified placement first; suppressed providers go last. */
function compareByVerifiedPlacement(a: ProviderRow, b: ProviderRow): number {
  return (
    rateSortValue(computeOutcomeRates(a.counts).verifiedPlacementRate) -
    rateSortValue(computeOutcomeRates(b.counts).verifiedPlacementRate)
  );
}
