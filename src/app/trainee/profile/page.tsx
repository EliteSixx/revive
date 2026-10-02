import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { GENDER_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { getDistrictName } from "@/mocks/reference";
import {
  CURRENT_TRAINEE,
  CURRENT_TRAINEE_CONTACTS,
} from "@/mocks/trainee-portal";
import type { ContactPointStatus, ContactPointType } from "@/types/domain";

export const metadata = { title: "Profile" };

const CONTACT_TYPE_LABELS: Record<ContactPointType, string> = {
  PHONE: "Main mobile number",
  ALTERNATE: "Alternate number",
  EMAIL: "Email",
};

const CONTACT_STATUS: Record<
  ContactPointStatus,
  { label: string; tone: "success" | "danger" | "neutral" }
> = {
  ACTIVE: { label: "Active", tone: "success" },
  UNREACHABLE: { label: "Not reachable", tone: "danger" },
  RETIRED: { label: "No longer used", tone: "neutral" },
};

export default function TraineeProfilePage() {
  const trainee = CURRENT_TRAINEE;

  return (
    <>
      <h1 className="text-h1">Your profile</h1>

      <Card className="mt-6">
        <CardHeader
          title="Personal details"
          description="To correct these, contact your training centre."
        />
        <CardBody>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-body">
            <dt className="text-fg-muted">Name</dt>
            <dd>{trainee.fullName}</dd>
            <dt className="text-fg-muted">Revive ID</dt>
            <dd>{trainee.id}</dd>
            <dt className="text-fg-muted">Date of birth</dt>
            <dd>{formatDate(trainee.dateOfBirth)}</dd>
            <dt className="text-fg-muted">Gender</dt>
            <dd>{GENDER_LABELS[trainee.gender]}</dd>
            <dt className="text-fg-muted">District</dt>
            <dd>{getDistrictName(trainee.districtCode)}</dd>
          </dl>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Contact numbers" />
        <ul>
          {CURRENT_TRAINEE_CONTACTS.map((contact) => (
            <li
              key={contact.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3 last:border-b-0"
            >
              <span>
                <span className="block text-small text-fg-muted">
                  {CONTACT_TYPE_LABELS[contact.type]}
                </span>
                <span className="tabular-nums">{contact.maskedValue}</span>
              </span>
              <Badge tone={CONTACT_STATUS[contact.status].tone}>
                {CONTACT_STATUS[contact.status].label}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-6">
        <CardHeader
          title="Change your mobile number"
          description="We will send a one-time password to the new number to confirm it."
        />
        <CardBody>
          <form className="flex flex-col gap-4" noValidate>
            <Field id="new-phone" label="New mobile number">
              <Input
                id="new-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                className="h-12"
              />
            </Field>
            <Button size="lg" className="sm:self-start">
              Send one-time password
            </Button>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
