import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Choice, ChoiceGroup } from "@/components/ui/choice";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  FEEDBACK_JOB_ROLES,
  SKILLS_BY_JOB_ROLE,
} from "@/mocks/employer-portal";

export const metadata = { title: "Skill feedback" };

export default function EmployerFeedbackPage() {
  const selectedRole = FEEDBACK_JOB_ROLES[0];

  return (
    <>
      <PageHeader
        title="Skill feedback"
        description="Tell us which skills new hires from these courses were missing. Your answers help training centres change their courses."
      />
      <Card className="max-w-3xl">
        <CardHeader title="Feedback for one job role" />
        <CardBody>
          <form className="flex flex-col gap-6" noValidate>
            <Field id="feedback-role" label="Job role">
              <Select
                id="feedback-role"
                defaultValue={selectedRole}
                options={FEEDBACK_JOB_ROLES.map((role) => ({
                  value: role,
                  label: role,
                }))}
              />
            </Field>

            <ChoiceGroup
              legend="Which skills were missing?"
              helperText="Choose all that apply. Then say how serious each gap was."
            >
              {SKILLS_BY_JOB_ROLE[selectedRole].map((skill) => (
                <Choice
                  key={skill}
                  type="checkbox"
                  name="missingSkills"
                  value={skill}
                  label={skill}
                />
              ))}
            </ChoiceGroup>

            <ChoiceGroup legend="Overall, how serious were the gaps?">
              <Choice
                type="radio"
                name="severity"
                value="MINOR"
                label="Minor: fixed with a few days of on-the-job training"
              />
              <Choice
                type="radio"
                name="severity"
                value="MAJOR"
                label="Major: the person could not do the job without retraining"
              />
            </ChoiceGroup>

            <Field id="feedback-comment" label="Anything else" isOptional>
              <Textarea id="feedback-comment" maxLength={500} />
            </Field>

            <Button className="self-start">Send feedback</Button>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
