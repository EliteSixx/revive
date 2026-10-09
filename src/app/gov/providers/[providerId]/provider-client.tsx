"use client";

import Link from "next/link";
import { Plus, ShieldAlert } from "lucide-react";
import { ChartCard } from "@/components/charts/chart-card";
import {
  toVerificationChartData,
  VERIFICATION_SERIES,
} from "@/components/charts/chart-data";
import { outcomeColumns } from "@/components/domain/outcome-columns";
import { OutcomeSummaryTiles } from "@/components/domain/outcome-summary-tiles";
import { RemedialActionList } from "@/components/domain/remedial-action-list";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { CollapsibleCard } from "@/features/gov/collapsible-card";
import { useGovScope } from "@/features/gov/gov-session";
import { formatMonth } from "@/lib/format";
import type { OutcomeCounts } from "@/types/analytics";
import type { RemedialAction } from "@/types/domain";
import type { CourseRow } from "@/mocks/analytics";
import type { GroupedCounts } from "@/mocks/aggregate";

interface ProviderClientProps {
  providerId: string;
  providerName: string;
  districtName: string;
  districtCode: string;
  registrationRef: string;
  counts: OutcomeCounts;
  cohorts: readonly GroupedCounts[];
  courses: readonly CourseRow[];
  actions: readonly RemedialAction[];
}

export default function GovProviderClient({
  providerName,
  districtName,
  districtCode,
  registrationRef,
  counts,
  cohorts,
  courses,
  actions,
}: ProviderClientProps) {
  const scope = useGovScope();

  // Task 4: Enforce role-based scoping. District officers cannot access out-of-district providers.
  if (
    scope.role === "DISTRICT_OFFICER" &&
    scope.districtCode &&
    scope.districtCode !== districtCode
  ) {
    return (
      <div className="py-8">
        <Card className="mx-auto max-w-xl border-warning/40 bg-surface">
          <CardBody className="flex flex-col items-center p-8 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-warning/10 text-warning">
              <ShieldAlert className="size-6" aria-hidden="true" />
            </div>
            <h1 className="mb-2 text-h2 font-semibold text-fg">
              Cross-District Provider Restricted
            </h1>
            <p className="mb-6 text-body text-fg-muted">
              {providerName} is located in {districtName} district. As District
              Officer for {scope.districtName}, you may only view training
              providers operational within your designated district.
            </p>
            <div className="flex gap-3">
              <Link href="/gov/outcomes?tab=providers">
                <Button>View {scope.districtName} providers</Button>
              </Link>
              <Link href="/gov">
                <Button variant="secondary">Return to overview</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  const chartData = toVerificationChartData(
    cohorts.map((cohort) => ({
      label: formatMonth(cohort.key),
      counts: cohort.counts,
    })),
  );

  return (
    <>
      <PageHeader
        title={providerName}
        description={`${districtName}. Registration ${registrationRef}.`}
        breadcrumbs={[{ label: "Outcomes", href: "/gov/outcomes?tab=providers" }]}
        actions={
          <Link href="/gov/actions">
            <Button>
              <Plus aria-hidden="true" />
              New action
            </Button>
          </Link>
        }
      />
      <OutcomeSummaryTiles counts={counts} />

      <div className="mb-6">
        <ChartCard
          title="How placements are verified, by cohort"
          description="Share of certified trainees in work at W3, split by verification level."
          kind="stacked-bar"
          data={chartData}
          categoryKey="label"
          categoryLabel="Cohort"
          series={VERIFICATION_SERIES}
          valueFormat="percent"
        />
      </div>

      <div className="space-y-4">
        <CollapsibleCard
          title="Outcomes by course"
          description="Detailed breakdown of batches and outcome rates per course."
          badge={
            <span className="rounded-sm bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
              {courses.length} courses
            </span>
          }
          defaultOpen={true}
        >
          <DataTable
            caption="Provider outcomes by course"
            rows={courses}
            getRowKey={(course) => course.course.id}
            columns={[
              {
                key: "course",
                header: "Course",
                cell: (course) => course.course.name,
              },
              ...outcomeColumns((course: CourseRow) => course.counts),
            ]}
          />
        </CollapsibleCard>

        <CollapsibleCard
          title="Remedial actions"
          description="Operational interventions logged against this provider."
          badge={
            <span className="rounded-sm bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
              {actions.length} actions
            </span>
          }
          defaultOpen={false}
        >
          {actions.length > 0 ? (
            <RemedialActionList actions={actions} />
          ) : (
            <p className="p-4 text-small text-fg-muted">
              No actions currently assigned to this provider.
            </p>
          )}
        </CollapsibleCard>
      </div>
    </>
  );
}
