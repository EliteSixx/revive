import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { HIRES } from "@/mocks/employer-portal";

export const metadata = { title: "Hires" };

export default function EmployerHiresPage() {
  return (
    <>
      <PageHeader
        title="Hires"
        description="Trainees you confirmed. At each check date we will ask whether they still work for you."
      />
      <Card>
        <DataTable
          caption="Confirmed hires"
          rows={HIRES}
          getRowKey={(hire) => hire.id}
          totalCount={HIRES.length}
          columns={[
            {
              key: "name",
              header: "Trainee",
              cell: (hire) => hire.traineeName,
            },
            { key: "role", header: "Job role", cell: (hire) => hire.jobRole },
            {
              key: "start",
              header: "Started",
              cell: (hire) => formatDate(hire.startDate),
            },
            { key: "wage", header: "Wage band", cell: (hire) => hire.wageBand },
            {
              key: "next-check",
              header: "Next check",
              cell: (hire) =>
                `${hire.nextCheckWindow}, ${formatDate(hire.nextCheckDate)}`,
            },
          ]}
        />
      </Card>
    </>
  );
}
