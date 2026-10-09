"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { OutcomeSummaryTiles } from "@/components/domain/outcome-summary-tiles";
import { outcomeColumns } from "@/components/domain/outcome-columns";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { CollapsibleCard } from "@/features/gov/collapsible-card";
import { useGovScope } from "@/features/gov/gov-session";
import { NON_PLACEMENT_REASONS } from "@/lib/constants";
import { formatReportCount } from "@/lib/metrics";
import type { OutcomeCounts } from "@/types/analytics";
import type { CourseRow, ProviderRow } from "@/mocks/analytics";

interface DistrictClientProps {
  districtCode: string;
  districtName: string;
  counts: OutcomeCounts;
  providers: readonly ProviderRow[];
  reasons: readonly { code: string; count: number }[];
  courses: readonly CourseRow[];
}

export default function GovDistrictClient({
  districtCode,
  districtName,
  counts,
  providers,
  reasons,
  courses,
}: DistrictClientProps) {
  const scope = useGovScope();

  // Task 4: Enforce role-based scoping. District officers cannot access other districts.
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
              Cross-District Access Restricted
            </h1>
            <p className="mb-6 text-body text-fg-muted">
              You are signed in as the District Officer for {scope.districtName}.
              Under DPDP jurisdictional isolation rules, you may only access
              data and trainees belonging to your assigned district.
            </p>
            <div className="flex gap-3">
              <Link href={`/gov/districts/${scope.districtCode}`}>
                <Button>Go to {scope.districtName} district view</Button>
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

  return (
    <>
      <PageHeader
        title={districtName}
        description="Outcomes for trainees from training centres in this district."
        breadcrumbs={
          scope.role === "STATE_ADMIN"
            ? [{ label: "Outcomes", href: "/gov/outcomes?tab=districts" }]
            : [{ label: "Overview", href: "/gov" }]
        }
      />
      <OutcomeSummaryTiles counts={counts} />

      <div className="mb-6 grid gap-6 xl:grid-cols-2">
        <CollapsibleCard
          title="Providers in this district"
          description="Training partners active in this jurisdiction."
          badge={
            <span className="rounded-sm bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
              {providers.length} providers
            </span>
          }
          defaultOpen={true}
        >
          <DataTable
            caption="Providers in this district"
            rows={providers}
            getRowKey={(provider) => provider.provider.id}
            columns={[
              {
                key: "provider",
                header: "Provider",
                cell: (provider) => (
                  <Link
                    href={`/gov/providers/${provider.provider.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {provider.provider.name}
                  </Link>
                ),
              },
              ...outcomeColumns(
                (provider: ProviderRow) => provider.counts,
              ).slice(0, 3),
            ]}
          />
        </CollapsibleCard>

        <CollapsibleCard
          title="Top reasons for not working at W3"
          description="Reported roadblocks from 3-month follow-up tracer."
          badge={
            <span className="rounded-sm bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
              {reasons.length} reasons
            </span>
          }
          defaultOpen={true}
        >
          <DataTable
            caption="Top reasons for not working"
            rows={reasons}
            getRowKey={(reason) => reason.code}
            emptyDescription="No reasons recorded for this district."
            columns={[
              {
                key: "reason",
                header: "Reason",
                cell: (reason) =>
                  NON_PLACEMENT_REASONS[
                    reason.code as keyof typeof NON_PLACEMENT_REASONS
                  ] ?? reason.code,
              },
              {
                key: "count",
                header: "Trainees",
                align: "right",
                cell: (reason) => formatReportCount(reason.count),
              },
            ]}
          />
        </CollapsibleCard>
      </div>

      <CollapsibleCard
        title="Outcomes by course"
        description="Course-wise breakdown of certification and placement."
        badge={
          <span className="rounded-sm bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
            {courses.length} courses
          </span>
        }
        defaultOpen={false}
      >
        <DataTable
          caption="District outcomes by course"
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
    </>
  );
}
