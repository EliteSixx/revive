"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { ChartCard } from "@/components/charts/chart-card";
import {
  toVerificationChartData,
  VERIFICATION_SERIES,
} from "@/components/charts/chart-data";
import { FilterBar } from "@/components/domain/filter-bar";
import { MetricTile } from "@/components/domain/metric-tile";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { AttentionCard } from "@/features/gov/attention-card";
import { DisclosureExpander } from "@/features/gov/disclosure-expander";
import { InfoPopover } from "@/features/gov/info-popover";
import { useGovScope } from "@/features/gov/gov-session";
import { getGovFilters } from "@/features/gov/gov-filters";
import {
  getScopedProviderRows,
  getScopedStateCounts,
} from "@/features/gov/mock-api";
import { formatNumber, formatPercent, formatRupees } from "@/lib/format";
import {
  computeOutcomeRates,
  formatBase,
  formatRate,
  isSmallGroup,
  NOT_YET_DUE_LABEL,
  rateSortValue,
  suppressMedian,
} from "@/lib/metrics";
import { STATE_COUNTS } from "@/mocks/analytics";

export default function GovOverviewClient() {
  const scope = useGovScope();
  const counts = getScopedStateCounts(scope.districtCode);
  const rates = computeOutcomeRates(counts);
  const verifiedShare = formatRate(rates.verifiedShare, 0);
  const medianWage = suppressMedian(
    counts.medianWageAtPlacement,
    counts.w3InWork,
  );
  const wageProgression = suppressMedian(
    counts.medianWageProgression,
    counts.w12Eligible,
  );

  // State average reference for district officers
  const stateRates = computeOutcomeRates(STATE_COUNTS);
  const stateVerifiedRate = formatRate(stateRates.verifiedPlacementRate);

  // Verification breakdown chart data: cohort bars
  const providerRows = getScopedProviderRows(scope.districtCode);
  const chartData = toVerificationChartData(
    providerRows.map((row) => ({
      label: row.provider.name,
      counts: row.counts,
    })),
  );

  // "Needs attention": lowest verified placement provider, top skill gap, response rate
  const sortedProviders = [...providerRows].sort(
    (a, b) =>
      rateSortValue(computeOutcomeRates(a.counts).verifiedPlacementRate) -
      rateSortValue(computeOutcomeRates(b.counts).verifiedPlacementRate),
  );
  const lowestProvider = sortedProviders[0];
  const lowestProviderRate = lowestProvider
    ? formatRate(
        computeOutcomeRates(lowestProvider.counts).verifiedPlacementRate,
      )
    : null;

  const lastUpdated = "4 Oct 2026";

  return (
    <>
      <PageHeader
        title="Overview"
        description={`${scope.scopeLabel}. Last updated ${lastUpdated}.`}
      />
      <FilterBar filters={getGovFilters(scope.districtCode)} />

      {/* 4 headline KPI cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-md border border-border bg-surface p-4">
          <div className="flex items-center gap-1.5 text-label text-fg-muted">
            Verified placement rate
            <span className="rounded-sm bg-surface-muted px-1 py-0.5 text-label text-fg-subtle">
              W3 (3 months)
            </span>
            <InfoPopover
              label="Verified placement rate (W3)"
              definition="Trainees confirmed in work at 3 months, counting only employer-confirmed or EPFO-verified outcomes."
              formula="Verified in work at W3 / certified trainees whose W3 closed"
            />
          </div>
          <p className="mt-1 text-metric tabular-nums">
            {formatRate(rates.verifiedPlacementRate) ?? "Fewer than 10"}
          </p>
          <p className="mt-1 text-small text-fg-muted">
            {formatBase(counts.w3Closed, "with W3 closed")}
          </p>
          {verifiedShare && (
            <p className="text-small text-fg-muted">
              {verifiedShare} of all-source placements verified
            </p>
          )}
          {scope.role === "DISTRICT_OFFICER" && stateVerifiedRate && (
            <p className="mt-1 text-small text-fg-subtle">
              State average: {stateVerifiedRate}
            </p>
          )}
        </div>

        <div className="rounded-md border border-border bg-surface p-4">
          <div className="flex items-center gap-1.5 text-label text-fg-muted">
            Placement rate, all sources
            <span className="rounded-sm bg-surface-muted px-1 py-0.5 text-label text-fg-subtle">
              W3
            </span>
            <InfoPopover
              label="Placement rate (W3), all sources"
              definition="Trainees in any form of work at 3 months, regardless of verification level. Includes self-reported outcomes."
              formula="In work at W3 / certified trainees whose W3 closed"
            />
          </div>
          <p className="mt-1 text-metric tabular-nums">
            {formatRate(rates.placementRate) ?? "Fewer than 10"}
          </p>
          <p className="mt-1 text-small text-fg-muted">
            {formatBase(counts.w3Closed, "with W3 closed")}
          </p>
        </div>

        <div className="rounded-md border border-border bg-surface p-4">
          <div className="flex items-center gap-1.5 text-label text-fg-muted">
            Retention
            <span className="rounded-sm bg-surface-muted px-1 py-0.5 text-label text-fg-subtle">
              W6 (6 months)
            </span>
            <InfoPopover
              label="Retention at W6"
              definition="Among trainees in work at 3 months, the share still in work at 6 months."
              formula="In work at W3 and W6 / in work at W3"
            />
          </div>
          <p className="mt-1 text-metric tabular-nums">
            {formatRate(rates.retentionW6) ??
              (rates.retentionW6 === null
                ? NOT_YET_DUE_LABEL
                : "Fewer than 10")}
          </p>
          <p className="mt-1 text-small text-fg-muted">
            {formatBase(counts.w6Eligible, "in work at W3")}
          </p>
        </div>

        <div className="rounded-md border border-border bg-surface p-4">
          <div className="flex items-center gap-1.5 text-label text-fg-muted">
            Response rate
            <span className="rounded-sm bg-surface-muted px-1 py-0.5 text-label text-fg-subtle">
              W3
            </span>
            <InfoPopover
              label="Response rate (W3)"
              definition="Trainees who answered the 3-month follow-up, as a share of all whose W3 window has closed."
              formula="W3 responded / certified trainees whose W3 closed"
            />
          </div>
          <p className="mt-1 text-metric tabular-nums">
            {formatRate(rates.responseRate) ?? "Fewer than 10"}
          </p>
          <p className="mt-1 text-small text-fg-muted">
            {formatBase(counts.w3Closed, "with W3 closed")}
          </p>
        </div>
      </div>

      {/* Main chart: verification breakdown by provider */}
      <div className="mb-6">
        <ChartCard
          title="Placement verification breakdown"
          description="How placements are verified for each provider. Each bar is 100% of certified trainees."
          kind="stacked-bar"
          isHorizontal
          data={chartData}
          categoryKey="label"
          categoryLabel="Provider"
          series={VERIFICATION_SERIES}
          valueFormat="percent"
          height={providerRows.length * 52 + 80}
        />
      </div>

      {/* Needs attention */}
      <Card className="mb-6">
        <CardHeader
          title="Needs attention"
          description="The 3 items most likely to need action. Expand each for detail."
        />
        <CardBody className="flex flex-col gap-2">
          {lowestProvider && (
            <AttentionCard
              severity="high"
              title={`${lowestProvider.provider.name}: verified placement ${lowestProviderRate ?? "suppressed"}`}
              action={
                <Link href="/gov/actions">
                  <Button size="sm" variant="secondary">
                    <Plus aria-hidden="true" className="size-3.5" />
                    Create action
                  </Button>
                </Link>
              }
            />
          )}
          <AttentionCard
            severity="medium"
            title="Sewing Machine Operator: low wage is the top reason for attrition at W6"
            action={
              <Link href="/gov/actions">
                <Button size="sm" variant="secondary">
                  <Plus aria-hidden="true" className="size-3.5" />
                  Create action
                </Button>
              </Link>
            }
          />
          <AttentionCard
            severity="low"
            title="Engine diagnostics is the most-cited skill gap (Automotive sector)"
            action={
              <Link href="/gov/actions">
                <Button size="sm" variant="secondary">
                  <Plus aria-hidden="true" className="size-3.5" />
                  Create action
                </Button>
              </Link>
            }
          />
          <Link href="/gov/actions">
            <Button
              variant="ghost"
              size="sm"
              className="self-start text-primary"
            >
              View all actions
            </Button>
          </Link>
        </CardBody>

        {/* More metrics expander */}
        <DisclosureExpander label="More metrics">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricTile
              label="Median wage at placement"
              value={medianWage === null ? null : formatRupees(medianWage)}
              baseText="Monthly gross, wage employment"
            />
            <MetricTile
              label="Median wage change (W3 to W12)"
              value={
                wageProgression === null ? null : formatPercent(wageProgression)
              }
              baseText={formatBase(counts.w12Eligible, "with W12 closed")}
              missingText={NOT_YET_DUE_LABEL}
            />
            <MetricTile
              label="Certified trainees"
              value={
                isSmallGroup(counts.certified)
                  ? null
                  : formatNumber(counts.certified)
              }
              baseText="In the selected period"
            />
            <MetricTile
              label="Self-employment or apprenticeship share"
              value={formatRate(rates.selfEmploymentShare, 0)}
              baseText="Among trainees in work at W3"
            />
          </div>
        </DisclosureExpander>
      </Card>

      {/* Consent scope note */}
      <p className="text-small text-fg-subtle">
        Figures include only trainees who consented to analytics.
      </p>
    </>
  );
}
