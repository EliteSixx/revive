import { ArrowRight, CalendarClock } from "lucide-react";
import Link from "next/link";
import { FollowUpStatusBadge } from "@/components/domain/status-badge";
import { VerificationBadge } from "@/components/domain/verification-badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { OUTCOME_TYPE_LABELS } from "@/lib/constants";
import { formatDate, formatRupees } from "@/lib/format";
import {
  CURRENT_TRAINEE,
  CURRENT_TRAINEE_ENROLMENT,
  CURRENT_TRAINEE_FOLLOW_UPS,
  CURRENT_TRAINEE_OUTCOMES,
} from "@/mocks/trainee-portal";

export const metadata = { title: "Home" };

export default function TraineeHomePage() {
  const openFollowUp = CURRENT_TRAINEE_FOLLOW_UPS.find(
    (task) => task.status === "SENT",
  );
  const enrolment = CURRENT_TRAINEE_ENROLMENT;

  return (
    <>
      <h1 className="text-h1">
        Hello, {CURRENT_TRAINEE.fullName.split(" ")[0]}
      </h1>
      <p className="mt-1 text-fg-muted">Revive ID {CURRENT_TRAINEE.id}</p>

      {openFollowUp && (
        <section
          aria-labelledby="due-heading"
          className="mt-6 rounded-md border border-primary/30 bg-primary-subtle p-5"
        >
          <div className="flex items-start gap-3">
            <CalendarClock
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <h2 id="due-heading" className="text-h3">
                Your 3-month follow-up is ready
              </h2>
              <p className="mt-1">
                Five short questions about your work. Please answer by{" "}
                {formatDate(openFollowUp.closesAt)}.
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="mt-4 w-full sm:w-auto">
            <Link href={`/trainee/follow-ups/${openFollowUp.id}`}>
              Start follow-up
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </section>
      )}

      <Card className="mt-6">
        <CardHeader
          title="Your work"
          action={
            <Button asChild variant="secondary" size="sm">
              <Link href="/trainee/outcomes/new">Report a change</Link>
            </Button>
          }
        />
        <ul>
          {CURRENT_TRAINEE_OUTCOMES.map((outcome) => (
            <li
              key={outcome.id}
              className="border-b border-border px-5 py-4 last:border-b-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">
                  {OUTCOME_TYPE_LABELS[outcome.type]}
                </p>
                <VerificationBadge level={outcome.verificationLevel} />
              </div>
              <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-body text-fg-muted">
                <dt>Employer</dt>
                <dd className="text-fg">{outcome.employerName}</dd>
                <dt>Job role</dt>
                <dd className="text-fg">{outcome.jobRole}</dd>
                <dt>Started</dt>
                <dd className="text-fg">
                  {outcome.startDate && formatDate(outcome.startDate)}
                </dd>
                <dt>Monthly wage</dt>
                <dd className="text-fg tabular-nums">
                  {outcome.monthlyWage !== null &&
                    formatRupees(outcome.monthlyWage)}
                </dd>
              </dl>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Your training" />
        <CardBody>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-body text-fg-muted">
            <dt>Course</dt>
            <dd className="text-fg">{enrolment.courseName}</dd>
            <dt>Provider</dt>
            <dd className="text-fg">{enrolment.providerName}</dd>
            <dt>Centre</dt>
            <dd className="text-fg">{enrolment.centreName}</dd>
            <dt>Certified</dt>
            <dd className="text-fg">
              {enrolment.certifiedAt && formatDate(enrolment.certifiedAt)}
            </dd>
          </dl>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Follow-up schedule" />
        <ul>
          {CURRENT_TRAINEE_FOLLOW_UPS.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between gap-3 border-b border-border px-5 py-3 last:border-b-0"
            >
              <span>
                <span className="font-medium">{task.window}</span>
                <span className="text-fg-muted">
                  {" "}
                  from {formatDate(task.opensAt)}
                </span>
              </span>
              <FollowUpStatusBadge status={task.status} />
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
