import { ChartCard } from "@/components/charts/chart-card";
import { toReasonChartData } from "@/components/charts/chart-data";
import { CHART_COLORS } from "@/components/charts/palette";
import { FilterBar } from "@/components/domain/filter-bar";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { GOV_FILTERS } from "@/features/gov/gov-filters";
import { ATTRITION_REASONS, NON_PLACEMENT_REASONS } from "@/lib/constants";
import { formatNumber, formatPercent } from "@/lib/format";
import {
  ATTRITION_REASONS_STATE,
  NON_PLACEMENT_REASONS_STATE,
} from "@/mocks/analytics";
import { EMPLOYER_SKILL_GAPS } from "@/mocks/data-quality";

export const metadata = { title: "Skill gaps" };

export default function GovSkillGapsPage() {
  return (
    <>
      <PageHeader
        title="Skill gaps"
        description="Why trainees are not placed or leave jobs, and which skills employers say are missing."
      />
      <FilterBar filters={GOV_FILTERS} />

      <div className="mb-6 grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Reasons for not working at W3"
          description="Number of trainees not working at W3, by the main reason they gave."
          kind="bar"
          isHorizontal
          data={toReasonChartData(
            NON_PLACEMENT_REASONS_STATE,
            NON_PLACEMENT_REASONS,
          )}
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
          data={toReasonChartData(ATTRITION_REASONS_STATE, ATTRITION_REASONS)}
          categoryKey="label"
          categoryLabel="Reason"
          series={[{ key: "count", label: "Trainees", color: CHART_COLORS[3] }]}
          valueFormat="number"
          height={380}
        />
      </div>

      <Card>
        <CardHeader
          title="Skills employers say are missing"
          description="From employer feedback forms on trainees they hired."
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
    </>
  );
}
