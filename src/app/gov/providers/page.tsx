import Link from "next/link";
import { FilterBar } from "@/components/domain/filter-bar";
import { outcomeColumns } from "@/components/domain/outcome-columns";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { GOV_FILTERS } from "@/features/gov/gov-filters";
import {
  computeOutcomeRates,
  formatRate,
  SUPPRESSED_LABEL,
} from "@/lib/metrics";
import { PROVIDER_ROWS, type ProviderRow } from "@/mocks/analytics";

export const metadata = { title: "Providers" };

export default function GovProvidersPage() {
  return (
    <>
      <PageHeader
        title="Providers"
        description="Compare providers on verified outcomes. Compare within the same sector and district where possible."
      />
      <FilterBar filters={GOV_FILTERS} />
      <Card>
        <DataTable
          caption="Training providers"
          rows={PROVIDER_ROWS}
          getRowKey={(row) => row.provider.id}
          totalCount={PROVIDER_ROWS.length}
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
            {
              key: "verified-share",
              header: "Verified share",
              align: "right",
              cell: (row) =>
                formatRate(computeOutcomeRates(row.counts).verifiedShare, 0) ??
                SUPPRESSED_LABEL,
            },
          ]}
        />
      </Card>
    </>
  );
}
