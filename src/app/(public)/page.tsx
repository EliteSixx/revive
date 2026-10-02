import {
  Building2,
  Factory,
  GraduationCap,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: { absolute: "Revive: skilling outcomes for Maharashtra" },
};

interface Audience {
  title: string;
  description: string;
  icon: LucideIcon;
}

const AUDIENCES: readonly Audience[] = [
  {
    title: "Trainees",
    description:
      "Answer a short follow-up at 3, 6 and 12 months after your certificate. Choose what you share and change it at any time.",
    icon: GraduationCap,
  },
  {
    title: "Training providers",
    description:
      "Upload batches, record placements with evidence, and see verified results for your own courses.",
    icon: Building2,
  },
  {
    title: "Employers",
    description:
      "Confirm or correct employment details for trainees you hired, and tell us which skills were missing.",
    icon: Factory,
  },
  {
    title: "Government",
    description:
      "Compare courses, providers and districts on verified outcomes, find skill gaps and track remedial actions.",
    icon: Landmark,
  },
];

const STEPS = [
  {
    title: "Consent at enrolment",
    description:
      "Each trainee chooses what Revive may do with their data, one purpose at a time. Consent can be withdrawn later from their own account.",
  },
  {
    title: "Follow-ups after certification",
    description:
      "Revive asks about work at 3, 6 and 12 months by SMS, WhatsApp or a phone call. Each follow-up has at most six questions.",
  },
  {
    title: "Verification and reporting",
    description:
      "Employers and EPFO records confirm what trainees and providers report. Reports show how much of each figure is verified.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <h1 className="text-display">
              Employment outcomes for skilling courses in Maharashtra
            </h1>
            <p className="mt-4 text-body-lg text-fg-muted">
              Revive follows trainees for 12 months after certification.
              Trainees report their work in a few minutes, employers confirm it,
              and departments see verified results by course, provider and
              district.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/how-it-works">How it works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-b border-border bg-page"
        aria-labelledby="audiences-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <h2 id="audiences-heading" className="text-h2">
            Who uses Revive
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCES.map((audience) => {
              const Icon = audience.icon;
              return (
                <li
                  key={audience.title}
                  className="rounded-md border border-border bg-surface p-5"
                >
                  <Icon className="size-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-3 text-h3">{audience.title}</h3>
                  <p className="mt-2 text-fg-muted">{audience.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section
        className="border-b border-border"
        aria-labelledby="steps-heading"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <h2 id="steps-heading" className="text-h2">
            How tracking works
          </h2>
          <ol className="mt-6 grid gap-6 lg:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary-subtle font-semibold text-primary"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-h3">{step.title}</h3>
                  <p className="mt-1 text-fg-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="privacy-heading">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <div className="max-w-3xl">
            <h2 id="privacy-heading" className="text-h2">
              How personal data is handled
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-fg-muted">
              <li>
                Consent is recorded separately for each purpose and can be
                withdrawn at any time.
              </li>
              <li>Aadhaar numbers are not collected or stored.</li>
              <li>
                Employers see only the trainees they are asked to confirm.
              </li>
              <li>
                Reports never show a figure based on fewer than 10 trainees.
              </li>
            </ul>
            <p className="mt-4">
              <Link href="/privacy" className="text-primary underline">
                Read the privacy policy
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
