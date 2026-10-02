import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DISTRICTS } from "@/mocks/reference";

export const metadata = { title: "Register your business" };

export default function EmployerRegisterPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-10 lg:py-14">
      <h1 className="text-h1">Register your business</h1>
      <p className="mt-2 text-fg-muted">
        Register to confirm employment for trainees who name your business. We
        check the format of your GSTIN or Udyam number before the account is
        approved.
      </p>

      <form className="mt-8 flex flex-col gap-8" noValidate>
        <fieldset className="flex flex-col gap-5">
          <legend className="mb-4 text-h2">Business</legend>
          <Field id="business-name" label="Legal name of business">
            <Input id="business-name" autoComplete="organization" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="business-gstin"
              label="GSTIN"
              helperText="15 characters, for example 27ABCDE1234F1Z5"
            >
              <Input
                id="business-gstin"
                maxLength={15}
                aria-describedby="business-gstin-helper"
              />
            </Field>
            <Field
              id="business-udyam"
              label="Udyam registration number"
              helperText="If you have no GSTIN"
            >
              <Input
                id="business-udyam"
                aria-describedby="business-udyam-helper"
              />
            </Field>
          </div>
          <Field id="business-address" label="Address">
            <Textarea id="business-address" autoComplete="street-address" />
          </Field>
          <Field id="business-district" label="District">
            <Select
              id="business-district"
              placeholder="Choose a district"
              options={DISTRICTS.map((district) => ({
                value: district.code,
                label: district.name,
              }))}
            />
          </Field>
        </fieldset>

        <fieldset className="flex flex-col gap-5">
          <legend className="mb-4 text-h2">Contact person</legend>
          <Field id="contact-name" label="Full name">
            <Input id="contact-name" autoComplete="name" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="contact-email" label="Work email">
              <Input id="contact-email" type="email" autoComplete="email" />
            </Field>
            <Field id="contact-phone" label="Mobile number">
              <Input
                id="contact-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
              />
            </Field>
          </div>
        </fieldset>

        <Button size="lg" className="self-start">
          Submit for approval
        </Button>
      </form>
    </div>
  );
}
