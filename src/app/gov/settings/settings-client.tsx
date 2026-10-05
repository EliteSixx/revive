"use client";

import { Info, UserCheck, Lock, Calendar, Mail, MapPin, Shield } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { CollapsibleCard } from "@/features/gov/collapsible-card";
import { useGovScope } from "@/features/gov/gov-session";
import { FOLLOW_UP_WINDOWS } from "@/lib/constants";
import { PROGRAMMES } from "@/mocks/reference";

export default function GovSettingsClient() {
  const scope = useGovScope();

  const formattedLoginTime = scope.signedInAt
    ? new Date(scope.signedInAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <>
      <PageHeader
        title="Settings & Profile"
        description={`${scope.scopeLabel}. Account credentials, programme configuration, and tracking cadence rules.`}
      />

      {/* Task 1: Officer Profile Section */}
      <Card className="mb-6 border-primary/20 bg-surface">
        <CardHeader
          title="Officer Profile"
          description="Authenticated officer credentials and jurisdiction scope."
          action={
            <div className="flex items-center gap-1.5 rounded-sm bg-surface-muted px-2.5 py-1 text-2xs font-medium text-fg-muted">
              <Lock className="size-3" aria-hidden="true" />
              <span>Read-only credentials</span>
            </div>
          }
        />
        <CardBody className="pt-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-md border border-border bg-surface-muted/30 p-3.5">
              <div className="flex items-center gap-1.5 text-label text-fg-muted">
                <UserCheck className="size-3.5 text-primary" aria-hidden="true" />
                Officer name
              </div>
              <p className="mt-1 font-semibold text-fg">{scope.displayName}</p>
              <p className="mt-0.5 text-2xs text-fg-subtle">
                {scope.isAuthenticated ? "Active session" : "Demo profile"}
              </p>
            </div>

            <div className="rounded-md border border-border bg-surface-muted/30 p-3.5">
              <div className="flex items-center gap-1.5 text-label text-fg-muted">
                <Shield className="size-3.5 text-primary" aria-hidden="true" />
                Assigned role
              </div>
              <p className="mt-1 font-semibold text-fg">
                {scope.role === "STATE_ADMIN"
                  ? "State Administrator"
                  : "District Officer"}
              </p>
              <p className="mt-0.5 text-2xs text-fg-subtle">
                Role-based access level
              </p>
            </div>

            <div className="rounded-md border border-border bg-surface-muted/30 p-3.5">
              <div className="flex items-center gap-1.5 text-label text-fg-muted">
                <MapPin className="size-3.5 text-primary" aria-hidden="true" />
                Jurisdiction / District
              </div>
              <p className="mt-1 font-semibold text-fg">
                {scope.role === "STATE_ADMIN"
                  ? "All districts (State-level)"
                  : `${scope.districtName} (${scope.districtCode})`}
              </p>
              <p className="mt-0.5 text-2xs text-fg-subtle">
                {scope.role === "STATE_ADMIN"
                  ? "Statewide data scope"
                  : "Scoped strictly to district"}
              </p>
            </div>

            <div className="rounded-md border border-border bg-surface-muted/30 p-3.5">
              <div className="flex items-center gap-1.5 text-label text-fg-muted">
                <Mail className="size-3.5 text-primary" aria-hidden="true" />
                Email / Officer ID
              </div>
              <p className="mt-1 font-mono text-small font-semibold text-fg">
                {scope.email ?? (
                  <span className="font-sans font-normal text-fg-subtle">
                    No authenticated email (Demo mode)
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-2xs text-fg-subtle">
                Official government email
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-3 border-t border-border pt-3.5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-small text-fg-muted">
              <Calendar className="size-4 shrink-0 text-fg-subtle" aria-hidden="true" />
              <span>
                <strong className="text-fg">Last login timestamp: </strong>
                {formattedLoginTime ?? "No active login recorded (unauthenticated demo session)"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xs text-fg-subtle">
                Contact your administrator to update these details.
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled
                title="Profile details are provisioned centrally through the State Skills Directory and are read-only."
              >
                Edit profile
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="border-info/30 bg-info/5 mb-6 flex items-center gap-2 rounded-md border p-3 text-small text-fg-muted">
        <Info className="text-info size-4 shrink-0" aria-hidden="true" />
        <span>
          <strong className="text-fg">Pilot mode:</strong> Programme parameters
          and follow-up schedules are shown in read-only mode for demonstration.
        </span>
      </div>

      {/* Task 2: Collapsible Sections */}
      <div className="space-y-4">
        <CollapsibleCard
          title="Programme details"
          description="Active government skill development programmes tracked in Revive."
          badge={
            <span className="rounded-sm bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
              {PROGRAMMES.length} programmes
            </span>
          }
          defaultOpen={false}
        >
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
        </CollapsibleCard>

        <CollapsibleCard
          title="Follow-up schedule"
          description="Standard cadence counted from the certification milestone."
          badge={
            <span className="rounded-sm bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
              {FOLLOW_UP_WINDOWS.length} windows
            </span>
          }
          defaultOpen={false}
        >
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
        </CollapsibleCard>

        <CollapsibleCard
          title="Trainee consent notice & compliance"
          description="Standard trainee data processing agreement for analytics and outcome follow-ups."
          badge={
            <span className="rounded-sm bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
              v1.0 active
            </span>
          }
          defaultOpen={false}
        >
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
        </CollapsibleCard>
      </div>
    </>
  );
}
