import { notFound } from "next/navigation";
import { FollowUpStatusBadge } from "@/components/domain/status-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Choice, ChoiceGroup } from "@/components/ui/choice";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DataTable } from "@/components/ui/table";
import {
  ATTEMPT_CHANNEL_LABELS,
  ATTEMPT_RESULT_LABELS,
  OUTCOME_TYPE_LABELS,
} from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { AGENT_ATTEMPTS, findQueueItem } from "@/mocks/agent-queue";

export const metadata = { title: "Follow-up call" };

export default async function AgentTaskPage(
  props: PageProps<"/agent/tasks/[taskId]">,
) {
  const { taskId } = await props.params;
  const item = findQueueItem(taskId);
  if (!item) notFound();
  const attempts = AGENT_ATTEMPTS[item.taskId] ?? [];

  return (
    <>
      <PageHeader
        title={item.traineeName}
        description={`${item.window} follow-up for ${item.courseName}. Closes ${formatDate(item.closesAt)}.`}
        breadcrumbs={[{ label: "Work queue", href: "/agent" }]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader
              title="Contact"
              action={<FollowUpStatusBadge status={item.status} />}
            />
            <CardBody>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                <dt className="text-fg-muted">Revive ID</dt>
                <dd>{item.traineeId}</dd>
                <dt className="text-fg-muted">District</dt>
                <dd>{item.districtName}</dd>
                <dt className="text-fg-muted">Main number</dt>
                <dd className="tabular-nums">{item.primaryPhone}</dd>
                <dt className="text-fg-muted">Alternate</dt>
                <dd>
                  {item.hasAlternateConsent && item.alternatePhone
                    ? item.alternatePhone
                    : "No consent to use an alternate number"}
                </dd>
              </dl>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button>Call main number</Button>
                {item.hasAlternateConsent && (
                  <Button variant="secondary">Call alternate</Button>
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Attempts"
              description={`${item.attemptCount} so far`}
            />
            <DataTable
              caption="Previous attempts"
              rows={attempts}
              getRowKey={(attempt) => attempt.id}
              emptyTitle="No attempts recorded"
              emptyDescription="Attempts appear here after each message or call."
              columns={[
                {
                  key: "date",
                  header: "Date",
                  cell: (attempt) => formatDate(attempt.at),
                },
                {
                  key: "channel",
                  header: "Channel",
                  cell: (attempt) => ATTEMPT_CHANNEL_LABELS[attempt.channel],
                },
                {
                  key: "result",
                  header: "Result",
                  cell: (attempt) => ATTEMPT_RESULT_LABELS[attempt.result],
                },
              ]}
            />
          </Card>
        </div>

        <Card>
          <CardHeader
            title="Call form"
            description="Read each question as written. Record the answer the trainee gives."
          />
          <CardBody>
            <form className="flex flex-col gap-6" noValidate>
              <ChoiceGroup
                legend="1. Consent check"
                helperText="Say: “This call is about your training. Your answers help improve courses. Is it all right to continue?”"
              >
                <Choice
                  type="checkbox"
                  name="consentConfirmed"
                  label="Trainee agreed to continue"
                />
              </ChoiceGroup>

              <ChoiceGroup legend="2. What is your work situation now?">
                {Object.entries(OUTCOME_TYPE_LABELS).map(([value, label]) => (
                  <Choice
                    key={value}
                    type="radio"
                    name="workSituation"
                    value={value}
                    label={label}
                  />
                ))}
              </ChoiceGroup>

              <Field id="call-result" label="Call result">
                <Select
                  id="call-result"
                  placeholder="Choose a result"
                  options={Object.entries(ATTEMPT_RESULT_LABELS).map(
                    ([value, label]) => ({ value, label }),
                  )}
                />
              </Field>

              <Field
                id="call-notes"
                label="Notes"
                isOptional
                helperText="Do not write phone numbers or ID numbers here."
              >
                <Textarea
                  id="call-notes"
                  aria-describedby="call-notes-helper"
                />
              </Field>

              <div className="flex flex-wrap gap-3">
                <Button>Save attempt</Button>
                <Button variant="secondary">Schedule callback</Button>
                <Button variant="ghost">Mark number unreachable</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
