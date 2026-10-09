"use client";

import { ChartCard } from "@/components/charts/chart-card";
import { toReasonChartData } from "@/components/charts/chart-data";
import { CHART_COLORS } from "@/components/charts/palette";
import { FilterBar } from "@/components/domain/filter-bar";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/ui/table";
import { CollapsibleCard } from "@/features/gov/collapsible-card";
import { getGovFilters } from "@/features/gov/gov-filters";
import { useGovScope } from "@/features/gov/gov-session";
import {
  getScopedAttritionReasons,
  getScopedNonPlacementReasons,
} from "@/features/gov/mock-api";
import { ATTRITION_REASONS, NON_PLACEMENT_REASONS } from "@/lib/constants";
import { formatNumber, formatPercent } from "@/lib/format";
import { EMPLOYER_SKILL_GAPS } from "@/mocks/data-quality";

export default function GovSkillGapsClient() {
  const scope = useGovScope();
  const nonPlacementReasons = getScopedNonPlacementReasons(scope.districtCode);
  const attritionReasons = getScopedAttritionReasons(scope.districtCode);

  const topNonPlacement = [...nonPlacementReasons].sort(
    (a, b) => b.count - a.count,
  )[0];
  const topAttrition = [...attritionReasons].sort(
    (a, b) => b.count - a.count,
  )[0];

  return (
    <>
      <PageHeader
        title="Skill gaps and reasons"
        description={`${scope.scopeLabel}. Why trainees are not placed or leave jobs, and which skills employers say are missing.`}
      />
      <FilterBar filters={getGovFilters(scope.districtCode)} />

      {/* At-a-glance summary KPI cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-border bg-surface p-4">
          <span className="text-label text-fg-muted">
            Top roadblock at W3 (3 months)
          </span>
          <p className="mt-1 text-h3 font-semibold text-fg">
            {topNonPlacement
              ? (NON_PLACEMENT_REASONS[
                  topNonPlacement.code as keyof typeof NON_PLACEMENT_REASONS
                ] ?? topNonPlacement.code)
              : "None"}
          </p>
          <p className="mt-0.5 text-small text-fg-muted">
            {topNonPlacement
              ? `${formatNumber(topNonPlacement.count)} unplaced trainees cited this`
              : "—"}
          </p>
        </div>

        <div className="rounded-md border border-border bg-surface p-4">
          <span className="text-label text-fg-muted">
            Top attrition cause at W6 (6 months)
          </span>
          <p className="mt-1 text-h3 font-semibold text-fg">
            {topAttrition
              ? (ATTRITION_REASONS[
                  topAttrition.code as keyof typeof ATTRITION_REASONS
                ] ?? topAttrition.code)
              : "None"}
          </p>
          <p className="mt-0.5 text-small text-fg-muted">
            {topAttrition
              ? `${formatNumber(topAttrition.count)} departures attributed to this`
              : "—"}
          </p>
        </div>

        <div className="rounded-md border border-border bg-surface p-4">
          <span className="text-label text-fg-muted">
            Most-cited employer skill deficit
          </span>
          <p className="mt-1 text-h3 font-semibold text-fg">
            {EMPLOYER_SKILL_GAPS[0]?.skill ?? "None"}
          </p>
          <p className="mt-0.5 text-small text-fg-muted">
            {EMPLOYER_SKILL_GAPS[0]?.jobRole} (
            {formatPercent(EMPLOYER_SKILL_GAPS[0]?.majorShare ?? 0, 0)} rated major)
          </p>
        </div>
      </div>

      {/* Task 2: Collapsible Sections */}
      <div className="space-y-4">
        {/* Charts Section */}
        <CollapsibleCard
          title="Trainee reasons breakdown (Charts)"
          description="Visual distribution of primary reasons reported in W3 non-placement and W6 attrition tracers."
          badge={
            <span className="rounded-sm bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
              2 tracer charts
            </span>
          }
          defaultOpen={false}
        >
          <div className="grid gap-6 xl:grid-cols-2">
            <ChartCard
              title="Reasons for not working at W3"
              description="Number of trainees not working at W3, by the main reason they gave."
              kind="bar"
              isHorizontal
              data={toReasonChartData(nonPlacementReasons, NON_PLACEMENT_REASONS)}
              categoryKey="label"
              categoryLabel="Reason"
              series={[
                { key: "count", label: "Trainees", color: CHART_COLORS[0] },
              ]}
              valueFormat="number"
              height={360}
            />
            <ChartCard
              title="Reasons for leaving a job by W6"
              description="Number of trainees in work at W3 but not at W6, by the main reason they gave."
              kind="bar"
              isHorizontal
              data={toReasonChartData(attritionReasons, ATTRITION_REASONS)}
              categoryKey="label"
              categoryLabel="Reason"
              series={[
                { key: "count", label: "Trainees", color: CHART_COLORS[3] },
              ]}
              valueFormat="number"
              height={360}
            />
          </div>
        </CollapsibleCard>

        {/* Employer Reported Gaps Table */}
        <CollapsibleCard
          title="Skills employers say are missing"
          description="From employer feedback forms on trainees they hired across target job roles."
          badge={
            <span className="rounded-sm bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
              {EMPLOYER_SKILL_GAPS.length} roles flagged
            </span>
          }
          defaultOpen={false}
        >
          <DataTable
            caption="Employer-reported skill gaps"
            rows={EMPLOYER_SKILL_GAPS}
            getRowKey={(row) => row.id}
            columns={[
              { key: "role", header: "Job role", cell: (row) => row.jobRole },
              { key: "sector", header: "Sector", cell: (row) => row.sector },
              { key: "skill", header: "Missing skill", cell: (row) => row.skill },
              {
                key: "employers",
                header: "Employers reporting",
                align: "right",
                cell: (row) => formatNumber(row.employersReporting),
              },
              {
                key: "major",
                header: "Rated major",
                align: "right",
                cell: (row) => formatPercent(row.majorShare, 0),
              },
            ]}
          />
        </CollapsibleCard>

        {/* Methodology */}
        <CollapsibleCard
          title="Methodology and survey cadence"
          description="Standard operating procedure for follow-up outreach."
          defaultOpen={false}
        >
          <div className="space-y-3 text-body text-fg-muted">
            <p>
              Trainee reasons are collected during structured telephonic and
              digital surveys:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong className="text-fg">
                  W3 follow-up (3 months post-certification):
                </strong>{" "}
                Identifies placement status and primary roadblocks for
                non-working trainees.
              </li>
              <li>
                <strong className="text-fg">
                  W6 follow-up (6 months post-certification):
                </strong>{" "}
                Measures job retention. For trainees who exited their initial
                job, the primary reason is recorded using standard state
                taxonomy codes.
              </li>
              <li>
                <strong className="text-fg">Employer feedback:</strong>{" "}
                Collected concurrently with employment verification
                confirmations.
              </li>
            </ul>
          </div>
        </CollapsibleCard>

        {/* Remedial Actions Recommendations */}
        <CollapsibleCard
          title="Recommended remedial actions by reason type"
          description="Guidelines for triggering corrective interventions when specific attrition thresholds are crossed."
          defaultOpen={false}
        >
          <div className="space-y-2 text-body text-fg-muted">
            <p>
              When a specific reason exceeds 25% of unplaced or departed
              trainees in a district or provider:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <strong className="text-fg">Location / Travel:</strong> Work
                with local employers within 15km or coordinate transport
                stipends.
              </li>
              <li>
                <strong className="text-fg">Wage below expectations:</strong>{" "}
                Trigger course-level wage benchmarking action with industry
                partners.
              </li>
              <li>
                <strong className="text-fg">
                  Lacked required practical skills:
                </strong>{" "}
                Create provider-targeted curriculum audit and practical lab
                remediation action.
              </li>
            </ul>
          </div>
        </CollapsibleCard>
      </div>
    </>
  );
}
