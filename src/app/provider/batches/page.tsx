import { FileUp } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { formatDate, formatNumber } from "@/lib/format";
import { CURRENT_PROVIDER, getProviderBatches } from "@/mocks/batches";

export const metadata = { title: "Batches" };

export default function ProviderBatchesPage() {
  const batches = getProviderBatches(CURRENT_PROVIDER.id);

  return (
    <>
      <PageHeader
        title="Batches"
        description="Every batch run by your centres, newest first."
        actions={
          <Button asChild>
            <Link href="/provider/batches/upload">
              <FileUp aria-hidden="true" />
              Upload roster
            </Link>
          </Button>
        }
      />
      <Card>
        <DataTable
          caption="Batches"
          rows={batches}
          getRowKey={(summary) => summary.batch.id}
          totalCount={batches.length}
          columns={[
            {
              key: "batch",
              header: "Batch",
              cell: (summary) => (
                <Link
                  href={`/provider/batches/${summary.batch.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {summary.batch.id}
                </Link>
              ),
            },
            {
              key: "course",
              header: "Course",
              cell: (summary) => summary.course.name,
            },
            {
              key: "centre",
              header: "Centre",
              cell: (summary) => summary.centre.name,
            },
            {
              key: "dates",
              header: "Training dates",
              cell: (summary) =>
                `${formatDate(summary.batch.startDate)} to ${formatDate(summary.batch.endDate)}`,
            },
            {
              key: "enrolled",
              header: "Enrolled",
              align: "right",
              cell: (summary) => formatNumber(summary.batch.enrolledCount),
            },
            {
              key: "certified",
              header: "Certified",
              align: "right",
              cell: (summary) => formatNumber(summary.batch.certifiedCount),
            },
          ]}
        />
      </Card>
    </>
  );
}
