import { VerificationRequestBadge } from "@/components/domain/status-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import {
  EMPLOYMENT_TYPE_LABELS,
  VERIFICATION_LEVEL_LABELS,
} from "@/lib/constants";
import { formatDate, formatRupees } from "@/lib/format";
import { VERIFICATION_REQUESTS } from "@/mocks/employer-portal";

export const metadata = { title: "Verifications" };

export default function EmployerVerificationsPage() {
  const pending = VERIFICATION_REQUESTS.filter(
    (request) => request.status === "PENDING",
  );
  const answered = VERIFICATION_REQUESTS.filter(
    (request) => request.status !== "PENDING",
  );

  return (
    <>
      <PageHeader
        title="Verifications"
        description="Check the details below against your records. Confirm if they are right, correct them if not, or reject if this person never worked for you."
      />

      <Card className="mb-6">
        <CardHeader
          title="Waiting for you"
          description={`${pending.length} requests`}
        />
        <ul>
          {pending.map((request) => (
            <li
              key={request.id}
              className="border-b border-border px-5 py-4 last:border-b-0"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-h3">{request.traineeName}</h3>
                  <p className="text-small text-fg-muted">
                    {VERIFICATION_LEVEL_LABELS[request.reportedBy]} via{" "}
                    {request.providerName}. Requested{" "}
                    {formatDate(request.requestedAt)}.
                  </p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-4">
                    <div>
                      <dt className="text-small text-fg-muted">Job role</dt>
                      <dd>{request.jobRole}</dd>
                    </div>
                    <div>
                      <dt className="text-small text-fg-muted">Start date</dt>
                      <dd>{formatDate(request.claimedStartDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-small text-fg-muted">Monthly wage</dt>
                      <dd className="tabular-nums">
                        {formatRupees(request.claimedMonthlyWage)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-small text-fg-muted">Type</dt>
                      <dd>{EMPLOYMENT_TYPE_LABELS[request.employmentType]}</dd>
                    </div>
                  </dl>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Confirm</Button>
                  <Button size="sm" variant="secondary">
                    Correct
                  </Button>
                  <Button size="sm" variant="ghost">
                    Reject
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader title="Answered" />
        <DataTable
          caption="Answered requests"
          rows={answered}
          getRowKey={(request) => request.id}
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
            {
              key: "status",
              header: "Your answer",
              cell: (request) => (
                <VerificationRequestBadge status={request.status} />
              ),
            },
          ]}
        />
      </Card>
    </>
  );
}
