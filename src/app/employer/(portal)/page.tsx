import Link from "next/link";
import { MetricTile } from "@/components/domain/metric-tile";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { formatDate, formatNumber } from "@/lib/format";
import { HIRES, VERIFICATION_REQUESTS } from "@/mocks/employer-portal";

export const metadata = { title: "Dashboard" };

export default function EmployerDashboardPage() {
  const pending = VERIFICATION_REQUESTS.filter(
    (request) => request.status === "PENDING",
  );
  const checksDue = HIRES.filter((hire) => hire.nextCheckDate <= "2026-12-31");

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Confirm employment for trainees who say they work for you. Each request takes under a minute."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MetricTile
          label="Requests waiting for you"
          value={formatNumber(pending.length)}
        />
        <MetricTile
          label="Trainees confirmed as hired"
          value={formatNumber(HIRES.length)}
        />
        <MetricTile
          label="Retention checks due by Dec 2026"
          value={formatNumber(checksDue.length)}
        />
      </div>
      <Card>
        <CardHeader
          title="Waiting for confirmation"
          action={
            <Button asChild size="sm">
              <Link href="/employer/verifications">Review requests</Link>
            </Button>
          }
        />
        <DataTable
          caption="Requests waiting for confirmation"
          rows={pending}
          getRowKey={(request) => request.id}
          emptyTitle="Nothing to confirm"
          emptyDescription="New requests appear here when a trainee or provider names your business."
          columns={[
            {
              key: "name",
              header: "Trainee",
              cell: (request) => request.traineeName,
            },
            {
              key: "role",
              header: "Job role",
              cell: (request) => request.jobRole,
            },
            {
              key: "requested",
              header: "Requested",
              cell: (request) => formatDate(request.requestedAt),
            },
          ]}
        />
      </Card>
    </>
  );
}
