"use client";

import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChartCard } from "@/components/charts/chart-card";
import { toRateChartData } from "@/components/charts/chart-data";
import { CHART_COLORS } from "@/components/charts/palette";
import { FilterBar } from "@/components/domain/filter-bar";
import { outcomeColumns } from "@/components/domain/outcome-columns";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getGovFilters } from "@/features/gov/gov-filters";
import { useGovScope } from "@/features/gov/gov-session";
import {
  getScopedCohortRows,
  getScopedDistrictRows,
  getScopedProviderRows,
} from "@/features/gov/mock-api";
import { formatMonth, formatNumber } from "@/lib/format";
import {
  computeOutcomeRates,
  formatRate,
  formatReportCount,
  NOT_YET_DUE_LABEL,
  rateSortValue,
  SUPPRESSED_LABEL,
} from "@/lib/metrics";
import {
  GENDER_LABELS,
  RESIDENCE_TYPE_LABELS,
  SOCIAL_CATEGORY_LABELS,
} from "@/lib/constants";
import type { GroupedCounts } from "@/mocks/aggregate";
import { DEMOGRAPHIC_BREAKDOWNS } from "@/mocks/analytics";
import { AGE_BANDS } from "@/mocks/reference";

const AGE_LABELS = Object.fromEntries(AGE_BANDS.map((band) => [band, band]));
const DISABILITY_LABELS = {
  YES: "Persons with disability",
  NO: "Without disability",
};

const DEFAULT_TAB = "cohorts";
const PAGE_SIZE = 5;

export default function GovOutcomesPage() {
  const scope = useGovScope();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = searchParams.get("tab") ?? DEFAULT_TAB;

  const cohortRows = getScopedCohortRows(scope.districtCode);
  const providerRows = getScopedProviderRows(scope.districtCode);
  const districtRows = getScopedDistrictRows(scope.districtCode);

  const cohortGroups = cohortRows.map((row) => ({
    label: formatMonth(row.key),
    counts: row.counts,
  }));

  function handleTabChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  const sortedProviders = [...providerRows].sort(
    (a, b) =>
      rateSortValue(computeOutcomeRates(a.counts).verifiedPlacementRate) -
      rateSortValue(computeOutcomeRates(b.counts).verifiedPlacementRate),
  );

  return (
    <>
      <PageHeader
        title="Outcomes"
        description={`${scope.scopeLabel}. Placement, retention and demographics across certified trainees.`}
      />
      <FilterBar filters={getGovFilters(scope.districtCode)} />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          {/* Districts tab only for state admin */}
          {scope.role === "STATE_ADMIN" && (
            <TabsTrigger value="districts">Districts</TabsTrigger>
          )}
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        {/* COHORTS TAB */}
        <TabsContent value="cohorts">
          <div className="mb-6">
            <ChartCard
              title="Outcomes by cohort"
              description="Placement at W3 (3 months) and retention at W6 (6 months) and W12 (12 months) among those in work at W3."
              kind="line"
              data={toRateChartData(cohortGroups, [
                "placementRate",
                "retentionW6",
                "retentionW12",
              ])}
              categoryKey="label"
              categoryLabel="Cohort"
              series={[
                {
                  key: "placementRate",
                  label: "Placement (W3, 3 months)",
                  color: CHART_COLORS[0],
                },
                {
                  key: "retentionW6",
                  label: "Retention (W6, 6 months)",
                  color: CHART_COLORS[2],
                },
                {
                  key: "retentionW12",
                  label: "Retention (W12, 12 months)",
                  color: CHART_COLORS[3],
                },
              ]}
              valueFormat="percent"
            />
          </div>
          <Card>
            <CardHeader
              title="Cohort table"
              description="W12 shown only for cohorts whose 12-month window has closed. Default: 5 rows."
            />
            <DataTable
              caption="Outcomes by cohort"
              rows={cohortGroups}
              getRowKey={(row) => row.label}
              pageSize={PAGE_SIZE}
              totalCount={cohortGroups.length}
              columns={[
                {
                  key: "cohort",
                  header: "Certified in",
                  cell: (row) => row.label,
                },
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
                  header: "Verified (W3)",
                  align: "right",
                  cell: (row) =>
                    formatRate(
                      computeOutcomeRates(row.counts).verifiedPlacementRate,
                    ) ?? SUPPRESSED_LABEL,
                },
              ]}
            />
          </Card>
        </TabsContent>

        {/* PROVIDERS TAB */}
        <TabsContent value="providers">
          <Card>
            <CardHeader
              title="Providers"
              description="Sorted by verified placement rate, lowest first. Rows with n < 30 show a low-base badge."
            />
            <DataTable
              caption="Training providers by outcomes"
              rows={sortedProviders}
              getRowKey={(row) => row.provider.id}
              pageSize={PAGE_SIZE}
              totalCount={sortedProviders.length}
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
                {
                  key: "verified",
                  header: "Verified %",
                  align: "right",
                  cell: (row) => {
                    const rates = computeOutcomeRates(row.counts);
                    if (row.counts.certified < 30) {
                      return (
                        <span className="text-fg-subtle">
                          {formatRate(rates.verifiedPlacementRate) ??
                            SUPPRESSED_LABEL}
                          <span className="ml-1 rounded-sm bg-warning-subtle px-1 text-label text-warning">
                            Low base
                          </span>
                        </span>
                      );
                    }
                    return (
                      formatRate(rates.verifiedPlacementRate) ??
                      SUPPRESSED_LABEL
                    );
                  },
                  sortValue: (row) =>
                    rateSortValue(
                      computeOutcomeRates(row.counts).verifiedPlacementRate,
                    ),
                },
                {
                  key: "response",
                  header: "Response %",
                  align: "right",
                  cell: (row) =>
                    formatRate(computeOutcomeRates(row.counts).responseRate) ??
                    SUPPRESSED_LABEL,
                },
                {
                  key: "retention",
                  header: "Retention W6",
                  align: "right",
                  cell: (row) => {
                    const rate = computeOutcomeRates(row.counts).retentionW6;
                    return rate === null
                      ? NOT_YET_DUE_LABEL
                      : (formatRate(rate) ?? SUPPRESSED_LABEL);
                  },
                },
              ]}
            />
          </Card>
        </TabsContent>

        {/* DISTRICTS TAB (state admin only) */}
        {scope.role === "STATE_ADMIN" && (
          <TabsContent value="districts">
            <Card>
              <CardHeader
                title="Districts"
                description="Sorted alphabetically. Each row can be expanded for provider detail."
              />
              <DataTable
                caption="Outcomes by district"
                rows={districtRows}
                getRowKey={(row) => row.district.code}
                pageSize={PAGE_SIZE}
                totalCount={districtRows.length}
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
                  {
                    key: "certified",
                    header: "Certified",
                    align: "right",
                    cell: (row) => formatReportCount(row.counts.certified),
                  },
                  {
                    key: "verified",
                    header: "Verified %",
                    align: "right",
                    cell: (row) =>
                      formatRate(
                        computeOutcomeRates(row.counts).verifiedPlacementRate,
                      ) ?? SUPPRESSED_LABEL,
                    sortValue: (row) =>
                      rateSortValue(
                        computeOutcomeRates(row.counts).verifiedPlacementRate,
                      ),
                  },
                  {
                    key: "retention",
                    header: "Retention W6",
                    align: "right",
                    cell: (row) => {
                      const rate = computeOutcomeRates(row.counts).retentionW6;
                      return rate === null
                        ? NOT_YET_DUE_LABEL
                        : (formatRate(rate) ?? SUPPRESSED_LABEL);
                    },
                  },
                ]}
              />
            </Card>
          </TabsContent>
        )}

        {/* DEMOGRAPHICS TAB */}
        <TabsContent value="demographics">
          <div className="flex flex-col gap-6">
            {[
              {
                title: "By gender",
                groupHeader: "Gender",
                groups: DEMOGRAPHIC_BREAKDOWNS.gender,
                labels: GENDER_LABELS,
              },
              {
                title: "By age",
                groupHeader: "Age",
                groups: DEMOGRAPHIC_BREAKDOWNS.ageBand,
                labels: AGE_LABELS,
              },
              {
                title: "By social category",
                groupHeader: "Category",
                groups: DEMOGRAPHIC_BREAKDOWNS.socialCategory,
                labels: SOCIAL_CATEGORY_LABELS,
              },
              {
                title: "By disability",
                groupHeader: "Group",
                groups: DEMOGRAPHIC_BREAKDOWNS.disability,
                labels: DISABILITY_LABELS,
              },
              {
                title: "By residence",
                groupHeader: "Residence",
                groups: DEMOGRAPHIC_BREAKDOWNS.residence,
                labels: RESIDENCE_TYPE_LABELS,
              },
            ].map(({ title, groupHeader, groups, labels }) => (
              <Card key={title}>
                <CardHeader
                  title={title}
                  description="Groups with fewer than 10 trainees are hidden to protect privacy."
                />
                <DataTable
                  caption={title}
                  rows={groups}
                  getRowKey={(group) => group.key}
                  columns={[
                    {
                      key: "group",
                      header: groupHeader,
                      cell: (group) =>
                        (labels as Record<string, string>)[group.key] ??
                        group.key,
                    },
                    ...outcomeColumns<GroupedCounts>((group) => group.counts),
                  ]}
                />
              </Card>
            ))}
          </div>
          <p className="mt-4 text-small text-fg-subtle">
            Cells with fewer than 10 trainees are suppressed. Figures include
            only trainees who consented to analytics.
          </p>
        </TabsContent>
      </Tabs>
    </>
  );
}
