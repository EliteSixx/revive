import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Choice, ChoiceGroup } from "@/components/ui/choice";
import { StepProgress } from "@/components/ui/stepper";
import { FOLLOW_UP_WINDOWS } from "@/lib/constants";
import { CURRENT_TRAINEE_FOLLOW_UPS } from "@/mocks/trainee-portal";
import type { FollowUpWindow } from "@/types/domain";

export const metadata = { title: "Follow-up" };

// The first question decides which questions follow (prd.md FR-T-04).
const WORK_SITUATION_OPTIONS = [
  {
    value: "WAGE",
    label: "Working for an employer",
    description: "Full-time, part-time or contract",
  },
  { value: "SELF", label: "Running my own work or business" },
  { value: "APPRENTICE", label: "Doing an apprenticeship" },
  { value: "STUDY", label: "Studying" },
  { value: "NOT_WORKING", label: "Not working at the moment" },
] as const;

const TOTAL_QUESTIONS = 5;

function getFollowUpTitle(followUpWindow: FollowUpWindow): string {
  const months = FOLLOW_UP_WINDOWS.find(
    (item) => item.window === followUpWindow,
  )?.monthsAfterCertification;
  return months ? `${months}-month follow-up` : "Follow-up at certification";
}

export default async function TraineeFollowUpPage(
  props: PageProps<"/trainee/follow-ups/[followUpId]">,
) {
  const { followUpId } = await props.params;
  const followUp = CURRENT_TRAINEE_FOLLOW_UPS.find(
    (task) => task.id === followUpId,
  );
  if (!followUp) notFound();

  return (
    <form className="flex min-h-[60vh] flex-col" noValidate>
      <h1 className="text-h3 text-fg-muted">
        {getFollowUpTitle(followUp.window)}
      </h1>
      <div className="mt-3">
        <StepProgress current={1} total={TOTAL_QUESTIONS} />
      </div>

      <ChoiceGroup
        legend="What is your work situation now?"
        className="mt-6 [&_legend]:text-h2"
      >
        {WORK_SITUATION_OPTIONS.map((option) => (
          <Choice
            key={option.value}
            type="radio"
            name="workSituation"
            value={option.value}
            label={option.label}
            description={
              "description" in option ? option.description : undefined
            }
            className="py-3"
          />
        ))}
      </ChoiceGroup>

      <div className="sticky bottom-0 mt-auto flex flex-col gap-3 border-t border-border bg-page py-4 sm:flex-row sm:justify-between">
        <Button asChild variant="ghost" size="lg">
          <Link href="/trainee">Save and finish later</Link>
        </Button>
        <Button size="lg">Continue</Button>
      </div>
    </form>
  );
}
