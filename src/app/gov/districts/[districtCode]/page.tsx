import Link from "next/link";
import { notFound } from "next/navigation";
import { outcomeColumns } from "@/components/domain/outcome-columns";
import { OutcomeSummaryTiles } from "@/components/domain/outcome-summary-tiles";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { NON_PLACEMENT_REASONS } from "@/lib/constants";
import { formatReportCount } from "@/lib/metrics";
import {
  DISTRICT_ROWS,
  getCourseRows,
  getNonPlacementReasons,
  getTraineesForDistrict,
  PROVIDER_ROWS,
  type CourseRow,
  type ProviderRow,
} from "@/mocks/analytics";

export const metadata = { title: "District" };

export default async function GovDistrictPage(
  props: PageProps<"/gov/districts/[districtCode]">,
) {
  const { districtCode } = await props.params;
  const row = DISTRICT_ROWS.find((item) => item.district.code === districtCode);
  if (!row) notFound();

  const trainees = getTraineesForDistrict(districtCode);
  const providers = PROVIDER_ROWS.filter(
    (provider) => provider.districtCode === districtCode,
  );
  const reasons = getNonPlacementReasons(trainees).slice(0, 5);

  return (
    <>
      <PageHeader
        title={row.district.name}
        description="Outcomes for trainees from training centres in this district."
        breadcrumbs={[{ label: "Districts", href: "/gov/districts" }]}
      />
      <OutcomeSummaryTiles counts={row.counts} />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Providers in this district" />
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
        </Card>
        <Card>
          <CardHeader title="Top reasons for not working at W3" />
          <DataTable
            caption="Top reasons for not working"
            rows={reasons}
            getRowKey={(reason) => reason.code}
            emptyDescription="No reasons recorded for this district."
            columns={[
              {
                key: "reason",
                header: "Reason",
                cell: (reason) => NON_PLACEMENT_REASONS[reason.code],
              },
              {
                key: "count",
                header: "Trainees",
                align: "right",
                cell: (reason) => formatReportCount(reason.count),
              },
            ]}
          />
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="By course" />
        <DataTable
          caption="District outcomes by course"
          rows={getCourseRows(trainees)}
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
      </Card>
    </>
  );
}
