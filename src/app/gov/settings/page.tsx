"use client";

import Link from "next/link";
import { ShieldAlert, Info } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { useGovScope } from "@/features/gov/gov-session";
import { FOLLOW_UP_WINDOWS } from "@/lib/constants";
import { PROGRAMMES } from "@/mocks/reference";

export default function GovSettingsPage() {
  const scope = useGovScope();

  // Guard: District officers cannot access settings
  if (scope.role === "DISTRICT_OFFICER") {
    return (
      <div className="py-8">
        <Card className="mx-auto max-w-xl border-warning/40 bg-surface">
          <CardBody className="flex flex-col items-center p-8 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-warning/10 text-warning">
              <ShieldAlert className="size-6" aria-hidden="true" />
            </div>
            <h1 className="mb-2 text-h2 font-semibold text-fg">
              State Administrator Access Only
            </h1>
            <p className="mb-6 text-body text-fg-muted">
              You are signed in with the District Officer role (
              {scope.districtName}). Programme configurations, follow-up
              schedules, and trainee consent notices are managed centrally by
              the State Skills Cell.
            </p>
            <Link href="/gov">
              <Button>Return to district overview</Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description={`${scope.scopeLabel}. Programme configuration and tracking cadence rules.`}
      />

      <div className="border-info/30 bg-info/5 mb-6 flex items-center gap-2 rounded-md border p-3 text-small text-fg-muted">
        <Info className="text-info size-4 shrink-0" aria-hidden="true" />
        <span>
          <strong className="text-fg">Pilot mode:</strong> Programme parameters
          and follow-up schedules are shown in read-only mode for demonstration.
        </span>
      </div>

      <Card className="mb-6">
        <CardHeader
          title="Programmes"
          description="Active government skill development programmes tracked in Revive."
        />
        <DataTable
          caption="Programmes"
          rows={PROGRAMMES}
          getRowKey={(programme) => programme.id}
          columns={[
            {
              key: "name",
              header: "Programme",
              cell: (programme) => (
                <span className="font-medium text-fg">{programme.name}</span>
              ),
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
              key: "status",
              header: "Status",
              cell: () => (
                <span className="text-xs inline-flex items-center rounded-sm bg-surface-muted px-2 py-0.5 text-fg-muted">
                  Read only
                </span>
              ),
            },
          ]}
        />
      </Card>

      <Card className="mb-6">
        <CardHeader
          title="Default follow-up schedule"
          description="Standard cadence counted from the certification milestone."
        />
        <DataTable
          caption="Default follow-up schedule"
          rows={FOLLOW_UP_WINDOWS}
          getRowKey={(item) => item.window}
          columns={[
            {
              key: "window",
              header: "Follow-up",
              cell: (item) => (
                <span className="font-medium text-fg">{item.window}</span>
              ),
            },
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
        <CardHeader
          title="Consent notice"
          description="Standard trainee data processing agreement for analytics and outcome follow-ups."
        />
        <CardBody>
          <div className="space-y-2">
            <p className="text-body text-fg">
              Current version: <span className="font-medium">1.0</span>{" "}
              (published 2 Mar 2026).
            </p>
            <p className="text-small text-fg-muted">
              Publishing a revised consent notice prompts active trainees to
              review and acknowledge terms at their subsequent follow-up
              interaction.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button variant="secondary" disabled>
              Publish new version (Demo only)
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
