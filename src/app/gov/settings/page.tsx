import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { FOLLOW_UP_WINDOWS } from "@/lib/constants";
import { PROGRAMMES } from "@/mocks/reference";

export const metadata = { title: "Settings" };

export default function GovSettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Programme configuration. Changes apply to trainees certified after the change is saved."
      />

      <Card className="mb-6">
        <CardHeader title="Programmes" />
        <DataTable
          caption="Programmes"
          rows={PROGRAMMES}
          getRowKey={(programme) => programme.id}
          columns={[
            {
              key: "name",
              header: "Programme",
              cell: (programme) => programme.name,
            },
            {
              key: "code",
              header: "Code",
              cell: (programme) => programme.code,
            },
            {
              key: "windows",
              header: "Follow-ups",
              cell: (programme) => programme.followUpWindows.join(", "),
            },
            {
              key: "edit",
              header: "Action",
              cell: () => (
                <Button size="sm" variant="secondary">
                  Edit
                </Button>
              ),
            },
          ]}
        />
      </Card>

      <Card className="mb-6">
        <CardHeader
          title="Default follow-up schedule"
          description="Counted from the certification date."
        />
        <DataTable
          caption="Default follow-up schedule"
          rows={FOLLOW_UP_WINDOWS}
          getRowKey={(item) => item.window}
          columns={[
            { key: "window", header: "Follow-up", cell: (item) => item.window },
            {
              key: "timing",
              header: "Timing",
              cell: (item) =>
                item.monthsAfterCertification === 0
                  ? "At certification"
                  : `${item.monthsAfterCertification} months after`,
            },
            {
              key: "purpose",
              wrap: true,
              header: "Covers",
              cell: (item) => item.purpose,
            },
            {
              key: "optional",
              header: "Required",
              cell: (item) => (item.isOptional ? "Optional" : "Yes"),
            },
          ]}
        />
      </Card>

      <Card>
        <CardHeader title="Consent notice" />
        <CardBody>
          <p>
            Current version: <span className="font-medium">1.0</span>, published
            2 Mar 2026.
          </p>
          <p className="mt-2 text-fg-muted">
            Publishing a new version asks every active trainee to review their
            consent at their next follow-up.
          </p>
          <Button variant="secondary" className="mt-4">
            Publish new version
          </Button>
        </CardBody>
      </Card>
    </>
  );
}
