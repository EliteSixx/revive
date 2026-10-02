import { ChartCard } from "@/components/charts/chart-card";
import { CHART_COLORS } from "@/components/charts/palette";
import { MetricTile } from "@/components/domain/metric-tile";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { formatDate, formatNumber } from "@/lib/format";
import { calculateRate, computeOutcomeRates, formatRate } from "@/lib/metrics";
import {
  countContactable,
  getResponseByWindow,
  STATE_COUNTS,
} from "@/mocks/analytics";
import { DUPLICATE_QUEUE, OUTCOME_CONFLICTS } from "@/mocks/data-quality";
import { SYNTHETIC_TRAINEES } from "@/mocks/synthetic-trainees";

export const metadata = { title: "Data quality" };

export default function GovDataQualityPage() {
  const responseByWindow = getResponseByWindow(SYNTHETIC_TRAINEES);
  const contactability = calculateRate(
    countContactable(SYNTHETIC_TRAINEES),
    STATE_COUNTS.certified,
  );
  const rates = computeOutcomeRates(STATE_COUNTS);

  return (
    <>
      <PageHeader
        title="Data quality"
        description="How complete and reliable the outcome data is. Low figures here mean the outcome rates are less certain."
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

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Possible duplicate records"
            description="Records are never merged automatically."
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
    </>
  );
}
