"use client";

import { ChartCard } from "@/components/charts/chart-card";
import { CHART_COLORS } from "@/components/charts/palette";
import { MetricTile } from "@/components/domain/metric-tile";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { DisclosureExpander } from "@/features/gov/disclosure-expander";
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
import { DUPLICATE_QUEUE, OUTCOME_CONFLICTS } from "@/mocks/data-quality";
import { SYNTHETIC_TRAINEES } from "@/mocks/synthetic-trainees";

export default function GovDataQualityPage() {
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

  return (
    <>
      <PageHeader
        title="Data quality"
        description={`${scope.scopeLabel}. How complete and reliable the outcome data is. Low figures here mean outcome rates are less certain.`}
      />

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
          value={formatNumber(DUPLICATE_QUEUE.length)}
          baseText="Waiting for review"
        />
        <MetricTile
          label="Conflicting outcomes"
          value={formatNumber(OUTCOME_CONFLICTS.length)}
          baseText="Sources disagree"
        />
      </div>

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

      <div className="mb-8 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Possible duplicate records"
            description="Records are never merged automatically without manual confirmation."
          />
          <DataTable
            caption="Possible duplicate records"
            rows={DUPLICATE_QUEUE}
            getRowKey={(row) => row.id}
            columns={[
              {
                key: "records",
                header: "Records",
                cell: (row) => (
                  <span className="tabular-nums">
                    {row.recordA}
                    <br />
                    {row.recordB}
                  </span>
                ),
              },
              {
                key: "reason",
                wrap: true,
                header: "Why flagged",
                cell: (row) => row.matchReason,
              },
              {
                key: "action",
                header: "Action",
                cell: () => (
                  <Button size="sm" variant="secondary">
                    Review
                  </Button>
                ),
              },
            ]}
          />
        </Card>
        <Card>
          <CardHeader
            title="Conflicting outcomes"
            description="Both versions are kept. The higher verification level is used in reports."
          />
          <DataTable
            caption="Conflicting outcomes"
            rows={OUTCOME_CONFLICTS}
            getRowKey={(row) => row.id}
            columns={[
              {
                key: "trainee",
                header: "Revive ID",
                cell: (row) => (
                  <span className="tabular-nums">{row.traineeId}</span>
                ),
              },
              {
                key: "sources",
                wrap: true,
                header: "Sources",
                cell: (row) => (
                  <>
                    {row.firstSource}
                    <br />
                    {row.secondSource}
                  </>
                ),
              },
              {
                key: "detected",
                header: "Found",
                cell: (row) => formatDate(row.detectedAt),
              },
            ]}
          />
        </Card>
      </div>

      {/* Merged Definitions & Standards Accordion Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-h2 font-semibold text-fg">
          Definitions & standard rules
        </h2>

        <DisclosureExpander label="Metric definitions and computation formulas">
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
        </DisclosureExpander>

        <DisclosureExpander label="Verification level hierarchy">
          <div className="space-y-2 text-body text-fg-muted">
            <p>Verification levels are ranked strongest first:</p>
            <ol className="list-decimal space-y-1 pl-5">
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
        </DisclosureExpander>

        <DisclosureExpander label="Small group suppression & privacy rule">
          <p className="text-body text-fg-muted">
            Any figure based on fewer than {SMALL_GROUP_THRESHOLD} trainees is
            shown as &ldquo;Fewer than {SMALL_GROUP_THRESHOLD}&rdquo;
            (&ldquo;—&rdquo;) and is suppressed in exports. This protects the
            privacy of individual trainees in small cohort slices.
          </p>
        </DisclosureExpander>

        <DisclosureExpander label="Reason code taxonomies (Non-placement & Attrition)">
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
        </DisclosureExpander>
      </div>
    </>
  );
}
