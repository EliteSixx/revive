import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Choice, ChoiceGroup } from "@/components/ui/choice";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { OUTCOME_TYPE_LABELS } from "@/lib/constants";
import { DISTRICTS } from "@/mocks/reference";
import type { OutcomeType } from "@/types/domain";

export const metadata = { title: "Report a change" };

const OUTCOME_OPTIONS = Object.entries(OUTCOME_TYPE_LABELS) as [
  OutcomeType,
  string,
][];

export default function ReportOutcomePage() {
  return (
    <>
      <h1 className="text-h1">Report a change</h1>
      <p className="mt-1 text-fg-muted">
        Tell us if you started a new job, changed jobs, started your own work or
        stopped working.
      </p>

      <form className="mt-6 flex flex-col gap-6" noValidate>
        <Card>
          <CardBody>
            <ChoiceGroup legend="What is your situation now?">
              {OUTCOME_OPTIONS.map(([value, label]) => (
                <Choice
                  key={value}
                  type="radio"
                  name="outcomeType"
                  value={value}
                  label={label}
                  defaultChecked={value === "WAGE"}
                />
              ))}
            </ChoiceGroup>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Job details"
            description="Shown because you chose wage employment."
          />
          <CardBody className="flex flex-col gap-5">
            <Field id="employer-name" label="Employer name">
              <Input
                id="employer-name"
                className="h-12"
                autoComplete="organization"
              />
            </Field>
            <Field
              id="job-role"
              label="Job role"
              helperText="For example: electrician helper"
            >
              <Input
                id="job-role"
                className="h-12"
                aria-describedby="job-role-helper"
              />
            </Field>
            <Field id="job-district" label="District where you work">
              <Select
                id="job-district"
                className="h-12"
                placeholder="Choose a district"
                options={DISTRICTS.map((district) => ({
                  value: district.code,
                  label: district.name,
                }))}
              />
            </Field>
            <Field id="start-date" label="Start date">
              <Input id="start-date" type="date" className="h-12" />
            </Field>
            <Field
              id="monthly-wage"
              label="Monthly wage in rupees"
              helperText="Before deductions. Enter numbers only."
            >
              <Input
                id="monthly-wage"
                inputMode="numeric"
                className="h-12"
                aria-describedby="monthly-wage-helper"
              />
            </Field>
            <ChoiceGroup legend="Type of job">
              <Choice
                type="radio"
                name="employmentType"
                value="FULL_TIME"
                label="Full-time"
              />
              <Choice
                type="radio"
                name="employmentType"
                value="PART_TIME"
                label="Part-time"
              />
              <Choice
                type="radio"
                name="employmentType"
                value="CONTRACT"
                label="Contract"
              />
            </ChoiceGroup>
            <Field
              id="evidence"
              label="Offer letter or payslip"
              isOptional
              helperText="Image or PDF, up to 5 MB. Adding proof makes your record stronger."
            >
              <Input
                id="evidence"
                type="file"
                accept="image/*,application/pdf"
                className="h-auto py-2"
                aria-describedby="evidence-helper"
              />
            </Field>
          </CardBody>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row-reverse sm:justify-start">
          <Button size="lg">Save</Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/trainee">Cancel</Link>
          </Button>
        </div>
      </form>
    </>
  );
}
