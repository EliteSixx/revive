import Link from "next/link";
import { ChartCard } from "@/components/charts/chart-card";
import { toRateChartData } from "@/components/charts/chart-data";
import { CHART_COLORS } from "@/components/charts/palette";
import { FilterBar } from "@/components/domain/filter-bar";
import { outcomeColumns } from "@/components/domain/outcome-columns";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { GOV_FILTERS } from "@/features/gov/gov-filters";
import { formatNumber } from "@/lib/format";
import { DISTRICT_ROWS, type DistrictRow } from "@/mocks/analytics";

export const metadata = { title: "Districts" };

export default function GovDistrictsPage() {
  return (
    <>
      <PageHeader
        title="Districts"
        description="Outcomes by the district of the training centre. District officers see only their own district."
      />
      <FilterBar filters={GOV_FILTERS} />

      <div className="mb-6">
        <ChartCard
          title="Verified placement by district"
          description="Verified placement rate at W3. Districts with fewer than 10 trainees are not shown."
          kind="bar"
          isHorizontal
          data={toRateChartData(
            DISTRICT_ROWS.map((row) => ({
              label: row.district.name,
              counts: row.counts,
            })),
            ["verifiedPlacementRate"],
          )}
          categoryKey="label"
          categoryLabel="District"
          series={[
            {
              key: "verifiedPlacementRate",
              label: "Verified placement (W3)",
              color: CHART_COLORS[0],
            },
          ]}
          valueFormat="percent"
          height={340}
        />
      </div>

      <Card>
        <DataTable
          caption="Outcomes by district"
          rows={DISTRICT_ROWS}
          getRowKey={(row) => row.district.code}
          totalCount={DISTRICT_ROWS.length}
          columns={[
            {
              key: "district",
              header: "District",
              cell: (row) => (
                <Link
                  href={`/gov/districts/${row.district.code}`}
                  className="font-medium text-primary hover:underline"
                >
                  {row.district.name}
                </Link>
              ),
            },
            {
              key: "providers",
              header: "Providers",
              align: "right",
              cell: (row) => formatNumber(row.providerCount),
            },
            ...outcomeColumns((row: DistrictRow) => row.counts),
          ]}
        />
      </Card>
    </>
  );
}
