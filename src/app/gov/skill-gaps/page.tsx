"use client";

import { ChartCard } from "@/components/charts/chart-card";
import { toReasonChartData } from "@/components/charts/chart-data";
import { CHART_COLORS } from "@/components/charts/palette";
import { FilterBar } from "@/components/domain/filter-bar";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { DisclosureExpander } from "@/features/gov/disclosure-expander";
import { getGovFilters } from "@/features/gov/gov-filters";
import { useGovScope } from "@/features/gov/gov-session";
import {
  getScopedAttritionReasons,
  getScopedNonPlacementReasons,
} from "@/features/gov/mock-api";
import { ATTRITION_REASONS, NON_PLACEMENT_REASONS } from "@/lib/constants";
import { formatNumber, formatPercent } from "@/lib/format";
import { EMPLOYER_SKILL_GAPS } from "@/mocks/data-quality";

export default function GovSkillGapsPage() {
  const scope = useGovScope();
  const nonPlacementReasons = getScopedNonPlacementReasons(scope.districtCode);
  const attritionReasons = getScopedAttritionReasons(scope.districtCode);

  return (
    <>
      <PageHeader
        title="Skill gaps and reasons"
        description={`${scope.scopeLabel}. Why trainees are not placed or leave jobs, and which skills employers say are missing.`}
      />
      <FilterBar filters={getGovFilters(scope.districtCode)} />

      <div className="mb-6 grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Reasons for not working at W3"
          description="Number of trainees not working at W3, by the main reason they gave."
          kind="bar"
          isHorizontal
          data={toReasonChartData(nonPlacementReasons, NON_PLACEMENT_REASONS)}
          categoryKey="label"
          categoryLabel="Reason"
          series={[{ key: "count", label: "Trainees", color: CHART_COLORS[0] }]}
          valueFormat="number"
          height={380}
        />
        <ChartCard
          title="Reasons for leaving a job by W6"
          description="Number of trainees in work at W3 but not at W6, by the main reason they gave."
          kind="bar"
          isHorizontal
          data={toReasonChartData(attritionReasons, ATTRITION_REASONS)}
          categoryKey="label"
          categoryLabel="Reason"
          series={[{ key: "count", label: "Trainees", color: CHART_COLORS[3] }]}
          valueFormat="number"
          height={380}
        />
      </div>

      <Card className="mb-6">
        <CardHeader
          title="Skills employers say are missing"
          description="From employer feedback forms on trainees they hired across target job roles."
        />
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
      </Card>

      <div className="flex flex-col gap-4">
        <DisclosureExpander label="Methodology and survey cadence">
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
        </DisclosureExpander>

        <DisclosureExpander label="Recommended remedial actions by reason type">
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
        </DisclosureExpander>
      </div>
    </>
  );
}
