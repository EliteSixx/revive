import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Choice, ChoiceGroup } from "@/components/ui/choice";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CURRENT_PROVIDER, getProviderBatches } from "@/mocks/batches";
import { DISTRICTS } from "@/mocks/reference";

export const metadata = { title: "Record placement" };

export default function RecordPlacementPage() {
  const latestBatch = getProviderBatches(CURRENT_PROVIDER.id)[0];
  const traineeOptions = (latestBatch?.trainees ?? []).map((trainee) => ({
    value: trainee.id,
    label: `${trainee.fullName} (${trainee.id})`,
  }));

  return (
    <>
      <PageHeader
        title="Record placement"
        description="Placements you record are marked as provider reported until the employer confirms them."
      />
      <form className="flex max-w-3xl flex-col gap-6" noValidate>
        <Card>
          <CardHeader title="Trainee" />
          <CardBody>
            <Field
              id="placement-trainee"
              label="Trainee"
              helperText="Showing trainees from your latest batch."
            >
              <Select
                id="placement-trainee"
                placeholder="Choose a trainee"
                options={traineeOptions}
                aria-describedby="placement-trainee-helper"
              />
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Job" />
          <CardBody className="grid gap-5 sm:grid-cols-2">
            <Field
              id="placement-employer"
              label="Employer legal name"
              className="sm:col-span-2"
            >
              <Input id="placement-employer" autoComplete="off" />
            </Field>
            <Field
              id="placement-gstin"
              label="Employer GSTIN or Udyam number"
              isOptional
            >
              <Input id="placement-gstin" autoComplete="off" />
            </Field>
            <Field id="placement-district" label="Job district">
              <Select
                id="placement-district"
                placeholder="Choose a district"
                options={DISTRICTS.map((district) => ({
                  value: district.code,
                  label: district.name,
                }))}
              />
            </Field>
            <Field id="placement-role" label="Job role">
              <Input id="placement-role" />
            </Field>
            <Field id="placement-start" label="Start date">
              <Input id="placement-start" type="date" />
            </Field>
            <Field id="placement-wage" label="Monthly gross wage (₹)">
              <Input id="placement-wage" inputMode="numeric" />
            </Field>
            <ChoiceGroup legend="Employment type" className="sm:col-span-2">
              <div className="grid gap-2 sm:grid-cols-3">
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
              </div>
            </ChoiceGroup>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Evidence"
            description="An offer letter or payslip raises the record to evidence attached."
          />
          <CardBody>
            <Field
              id="placement-evidence"
              label="Document"
              isOptional
              helperText="Image or PDF, up to 5 MB."
            >
              <Input
                id="placement-evidence"
                type="file"
                accept="image/*,application/pdf"
                className="h-auto py-2"
                aria-describedby="placement-evidence-helper"
              />
            </Field>
          </CardBody>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button>Save placement</Button>
          <Button asChild variant="secondary">
            <Link href="/provider">Cancel</Link>
          </Button>
        </div>
      </form>
    </>
  );
}
