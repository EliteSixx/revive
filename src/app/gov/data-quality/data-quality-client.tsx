"use client";

import { useState } from "react";
import { ChartCard } from "@/components/charts/chart-card";
import { CHART_COLORS } from "@/components/charts/palette";
import { MetricTile } from "@/components/domain/metric-tile";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/table";
import { CollapsibleCard } from "@/features/gov/collapsible-card";
import { DuplicateReviewDialog } from "@/features/gov/duplicate-review-dialog";
import {
  useDuplicateCandidates,
  type DuplicateCandidateItem,
} from "@/features/gov/duplicates-store";
import { useGovScope } from "@/features/gov/gov-session";
import { getScopedStateCounts } from "@/features/gov/mock-api";
import {
  ATTRITION_REASONS,
  NON_PLACEMENT_REASONS,
  VERIFICATION_LEVEL_LABELS,
  VERIFICATION_LEVELS,
} from "@/lib/constants";
import { formatDate, formatNumber } from "@/lib/format";
import {
  calculateRate,
  computeOutcomeRates,
  formatRate,
  METRIC_DEFINITIONS,
  SMALL_GROUP_THRESHOLD,
} from "@/lib/metrics";
import { countContactable, getResponseByWindow } from "@/mocks/analytics";
import { OUTCOME_CONFLICTS } from "@/mocks/data-quality";
import { SYNTHETIC_TRAINEES } from "@/mocks/synthetic-trainees";

export default function GovDataQualityClient() {
  const scope = useGovScope();
  const trainees = scope.districtCode
    ? SYNTHETIC_TRAINEES.filter((t) => t.districtCode === scope.districtCode)
    : SYNTHETIC_TRAINEES;

  const counts = getScopedStateCounts(scope.districtCode);
  const responseByWindow = getResponseByWindow(trainees);
  const contactability = calculateRate(
    countContactable(trainees),
    counts.certified,
  );
  const rates = computeOutcomeRates(counts);

  // Scoped duplicate records from store (persisted in sessionStorage)
  const duplicates = useDuplicateCandidates(scope.districtCode);
  const pendingDuplicates = duplicates.filter((d) => d.status === "PENDING");
  const reviewedDuplicates = duplicates.filter((d) => d.status !== "PENDING");

  const [selectedCandidate, setSelectedCandidate] =
    useState<DuplicateCandidateItem | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  function handleOpenReview(candidate: DuplicateCandidateItem) {
    setSelectedCandidate(candidate);
    setIsReviewOpen(true);
  }

  return (
    <>
      <PageHeader
        title="Data quality and definitions"
        description={`${scope.scopeLabel}. How complete and reliable the outcome data is. Low figures here mean outcome rates are less certain.`}
      />

      {/* 4 At-a-glance KPI summary tiles */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile
          label="Contactability"
          value={formatRate(contactability)}
          baseText="Reached in at least one follow-up"
        />
        <MetricTile
          label="Verified share of placements"
          value={formatRate(rates.verifiedShare)}
          baseText="Employer confirmed or EPFO verified"
        />
        <MetricTile
          label="Possible duplicates"
          value={formatNumber(pendingDuplicates.length)}
          baseText={
            pendingDuplicates.length === 1
              ? "1 record waiting for review"
              : `${pendingDuplicates.length} waiting for review`
          }
        />
        <MetricTile
          label="Conflicting outcomes"
          value={formatNumber(OUTCOME_CONFLICTS.length)}
          baseText="Sources disagree"
        />
      </div>

      {/* Primary Chart visible at a glance */}
      <div className="mb-6">
        <ChartCard
          title="Response rate by follow-up"
          description="Trainees who answered, out of those whose follow-up window has closed."
          kind="bar"
          data={responseByWindow.map((item) => ({
            label: item.window,
            responseRate: calculateRate(item.responded, item.due).value,
          }))}
          categoryKey="label"
          categoryLabel="Follow-up"
          series={[
            {
              key: "responseRate",
              label: "Response rate",
              color: CHART_COLORS[0],
            },
          ]}
          valueFormat="percent"
        />
      </div>

      {/* Task 2 & Task 3: Collapsible Data Quality & Review Sections */}
      <div className="space-y-4">
        {/* DUPLICATE RECORDS SECTION (TASK 3) */}
        <CollapsibleCard
          title="Possible duplicate records"
          description="Records are never merged automatically without manual confirmation."
          badge={
            pendingDuplicates.length > 0 ? (
              <span className="rounded-sm bg-warning-subtle px-2 py-0.5 text-2xs font-semibold text-warning">
                {pendingDuplicates.length} pending review
              </span>
            ) : (
              <span className="rounded-sm bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
                All reviewed
              </span>
            )
          }
          defaultOpen={true}
        >
          <div className="mb-3 flex items-center justify-between text-small text-fg-muted">
            <span>
              Showing {duplicates.length} duplicate pair
              {duplicates.length > 1 ? "s" : ""}{" "}
              {scope.districtName ? `in ${scope.districtName}` : "statewide"}.
            </span>
            {reviewedDuplicates.length > 0 && (
              <span className="text-2xs text-fg-subtle">
                {reviewedDuplicates.length} resolved / under inquiry
              </span>
            )}
          </div>

          <DataTable
            caption="Possible duplicate records"
            rows={duplicates}
            getRowKey={(row) => row.id}
            columns={[
              {
                key: "records",
                header: "Records",
                cell: (row) => (
                  <span className="font-mono text-small text-fg">
                    {row.recordA.id}
                    <br />
                    {row.recordB.id}
                  </span>
                ),
              },
              {
                key: "names",
                header: "Trainee names",
                cell: (row) => (
                  <div className="text-small">
                    <span className="font-medium text-fg">
                      {row.recordA.fullName}
                    </span>
                    <br />
                    <span
                      className={
                        row.differingFields.includes("fullName")
                          ? "font-medium text-warning"
                          : "text-fg-muted"
                      }
                    >
                      {row.recordB.fullName}
                    </span>
                  </div>
                ),
              },
              {
                key: "reason",
                wrap: true,
                header: "Why flagged",
                cell: (row) => (
                  <span className="text-small text-fg-muted">
                    {row.matchReason}
                  </span>
                ),
              },
              {
                key: "status",
                header: "Status",
                cell: (row) => {
                  if (row.status === "MERGED") {
                    return (
                      <span className="inline-flex rounded-sm bg-primary/10 px-2 py-0.5 text-2xs font-semibold text-primary">
                        Merged
                      </span>
                    );
                  }
                  if (row.status === "DISMISSED") {
                    return (
                      <span className="inline-flex rounded-sm bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
                        Not duplicate
                      </span>
                    );
                  }
                  if (row.status === "NEEDS_REVIEW") {
                    return (
                      <span className="inline-flex rounded-sm bg-warning/20 px-2 py-0.5 text-2xs font-semibold text-warning">
                        In inquiry
                      </span>
                    );
                  }
                  return (
                    <span className="inline-flex rounded-sm bg-warning-subtle px-2 py-0.5 text-2xs font-semibold text-warning">
                      Pending review
                    </span>
                  );
                },
              },
              {
                key: "detected",
                header: "Detected",
                cell: (row) => formatDate(row.detectedAt),
              },
              {
                key: "action",
                header: "Action",
                align: "right",
                cell: (row) => (
                  <Button
                    size="sm"
                    variant={row.status === "PENDING" ? "primary" : "secondary"}
                    onClick={() => handleOpenReview(row)}
                  >
                    {row.status === "PENDING" ? "Review" : "View audit"}
                  </Button>
                ),
              },
            ]}
          />
        </CollapsibleCard>

        {/* CONFLICTING OUTCOMES SECTION */}
        <CollapsibleCard
          title="Conflicting outcomes queue"
          description="Both versions are kept. The higher verification level is used in reports."
          badge={
            <span className="rounded-sm bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
              {OUTCOME_CONFLICTS.length} conflicts
            </span>
          }
          defaultOpen={false}
        >
          <DataTable
            caption="Conflicting outcomes"
            rows={OUTCOME_CONFLICTS}
            getRowKey={(row) => row.id}
            columns={[
              {
                key: "trainee",
                header: "Revive ID",
                cell: (row) => (
                  <span className="font-mono text-small text-fg">
                    {row.traineeId}
                  </span>
                ),
              },
              {
                key: "sources",
                wrap: true,
                header: "Sources",
                cell: (row) => (
                  <span className="text-small text-fg-muted">
                    {row.firstSource}
                    <br />
                    {row.secondSource}
                  </span>
                ),
              },
              {
                key: "detected",
                header: "Found",
                cell: (row) => formatDate(row.detectedAt),
              },
            ]}
          />
        </CollapsibleCard>

        {/* METRIC DEFINITIONS & FORMULAS */}
        <CollapsibleCard
          title="Metric definitions and computation formulas"
          description="Standardised formulas agreed across state and central guidelines."
          badge={
            <span className="rounded-sm bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
              {METRIC_DEFINITIONS.length} definitions
            </span>
          }
          defaultOpen={false}
        >
          <DataTable
            caption="Metric definitions"
            rows={METRIC_DEFINITIONS}
            getRowKey={(metric) => metric.id}
            columns={[
              {
                key: "name",
                header: "Metric",
                cell: (metric) => (
                  <span className="font-medium text-fg">{metric.name}</span>
                ),
              },
              {
                key: "formula",
                wrap: true,
                header: "How it is calculated",
                cell: (metric) => metric.formula,
              },
              {
                key: "notes",
                wrap: true,
                header: "Notes",
                cell: (metric) => metric.notes,
              },
            ]}
          />
        </CollapsibleCard>

        {/* VERIFICATION LEVEL HIERARCHY */}
        <CollapsibleCard
          title="Verification level hierarchy"
          description="Standard ranking for outcome credibility. Strongest verification source wins."
          badge={
            <span className="rounded-sm bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
              5 tier hierarchy
            </span>
          }
          defaultOpen={false}
        >
          <div className="space-y-2 text-body text-fg-muted">
            <p>Verification levels are ranked strongest first:</p>
            <ol className="list-decimal space-y-1.5 pl-5">
              {VERIFICATION_LEVELS.map((level) => (
                <li key={level}>
                  <strong className="text-fg">
                    {VERIFICATION_LEVEL_LABELS[level]}:
                  </strong>{" "}
                  {level === "EPFO_VERIFIED" &&
                    "Automatic electronic match against Employee Provident Fund records."}
                  {level === "EMPLOYER_CONFIRMED" &&
                    "Direct confirmation received from employer with offer letter or payslip."}
                  {level === "EVIDENCE_ATTACHED" &&
                    "Offer letter, payslip, or GST invoice uploaded as proof."}
                  {level === "PROVIDER_REPORTED" &&
                    "Uploaded by training partner without external independent corroboration."}
                  {level === "SELF_REPORTED" &&
                    "Self-reported by trainee via WhatsApp, IVR or portal survey."}
                </li>
              ))}
            </ol>
          </div>
        </CollapsibleCard>

        {/* SMALL GROUP SUPPRESSION */}
        <CollapsibleCard
          title="Small group suppression & privacy rules"
          description="DPDP Act compliance to prevent re-identification of trainees."
          badge={
            <span className="rounded-sm bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
              n &lt; 10 threshold
            </span>
          }
          defaultOpen={false}
        >
          <p className="text-body text-fg-muted">
            Any figure based on fewer than {SMALL_GROUP_THRESHOLD} trainees is
            shown as &ldquo;Fewer than {SMALL_GROUP_THRESHOLD}&rdquo;
            (&ldquo;—&rdquo;) and is suppressed in exports. This protects the
            privacy of individual trainees in small cohort slices.
          </p>
        </CollapsibleCard>

        {/* REASON CODE TAXONOMIES */}
        <CollapsibleCard
          title="Reason code taxonomies (Non-placement & Attrition)"
          description="Standard state taxonomy codes used in W3 and W6 tracer surveys."
          badge={
            <span className="rounded-sm bg-surface-muted px-2 py-0.5 text-2xs font-medium text-fg-muted">
              Taxonomy codes
            </span>
          }
          defaultOpen={false}
        >
          <div className="grid gap-6 text-body text-fg-muted md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-medium text-fg">
                Reasons for not working at W3
              </h3>
              <ul className="list-disc space-y-1 pl-5">
                {Object.entries(NON_PLACEMENT_REASONS).map(([code, label]) => (
                  <li key={code}>{label}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-fg">
                Reasons for leaving a job by W6
              </h3>
              <ul className="list-disc space-y-1 pl-5">
                {Object.entries(ATTRITION_REASONS).map(([code, label]) => (
                  <li key={code}>{label}</li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleCard>
      </div>

      {/* Review Dialog Modal (Task 3) */}
      <DuplicateReviewDialog
        candidate={selectedCandidate}
        officerName={scope.displayName}
        open={isReviewOpen}
        onOpenChange={setIsReviewOpen}
        onActionComplete={() => {
          // Re-sync local candidate selection if still open
          if (selectedCandidate) {
            const updated = duplicates.find(
              (d) => d.id === selectedCandidate.id,
            );
            if (updated) setSelectedCandidate(updated);
          }
        }}
      />
    </>
  );
}
