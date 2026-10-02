import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import {
  ATTRITION_REASONS,
  NON_PLACEMENT_REASONS,
  VERIFICATION_LEVEL_LABELS,
  VERIFICATION_LEVELS,
} from "@/lib/constants";
import { METRIC_DEFINITIONS, SMALL_GROUP_THRESHOLD } from "@/lib/metrics";

export const metadata = { title: "Definitions" };

export default function GovDefinitionsPage() {
  return (
    <>
      <PageHeader
        title="Definitions"
        description="Every figure in Revive uses these definitions, for every programme. They are the same on every screen and in every export."
      />

      <Card className="mb-6">
        <CardHeader title="Metrics" />
        <DataTable
          caption="Metric definitions"
          rows={METRIC_DEFINITIONS}
          getRowKey={(metric) => metric.id}
          columns={[
            {
              key: "name",
              header: "Metric",
              cell: (metric) => (
                <span className="font-medium">{metric.name}</span>
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
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Small groups" />
          <CardBody>
            <p>
              Any figure based on fewer than {SMALL_GROUP_THRESHOLD} trainees is
              shown as &ldquo;Fewer than {SMALL_GROUP_THRESHOLD}&rdquo; and is
              left out of exports. This protects the privacy of trainees in
              small groups.
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Verification levels"
            description="Strongest first."
          />
          <CardBody>
            <ol className="list-decimal space-y-1 pl-5">
              {VERIFICATION_LEVELS.map((level) => (
                <li key={level}>{VERIFICATION_LEVEL_LABELS[level]}</li>
              ))}
            </ol>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Reasons for not working" />
          <CardBody>
            <ul className="list-disc space-y-1 pl-5">
              {Object.entries(NON_PLACEMENT_REASONS).map(([code, label]) => (
                <li key={code}>{label}</li>
              ))}
            </ul>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Reasons for leaving a job" />
          <CardBody>
            <ul className="list-disc space-y-1 pl-5">
              {Object.entries(ATTRITION_REASONS).map(([code, label]) => (
                <li key={code}>{label}</li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
