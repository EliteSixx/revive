import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table";
import { ConsentCard } from "@/features/trainee/consent-card";
import { getConsentState } from "@/lib/consent";
import { CONSENT_PURPOSES } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { CURRENT_TRAINEE_CONSENT_EVENTS } from "@/mocks/trainee-portal";

export const metadata = { title: "Consent" };

const PURPOSE_TITLES = Object.fromEntries(
  CONSENT_PURPOSES.map((item) => [item.purpose, item.title]),
) as Record<(typeof CONSENT_PURPOSES)[number]["purpose"], string>;

export default function TraineeConsentPage() {
  return (
    <>
      <h1 className="text-h1">Your consent</h1>
      <p className="mt-1 text-fg-muted">
        Choose what Revive may do with your information. You can change any of
        these at any time.
      </p>

      <ul className="mt-6 flex flex-col gap-4">
        {CONSENT_PURPOSES.map((item) => {
          const state = getConsentState(
            CURRENT_TRAINEE_CONSENT_EVENTS,
            item.purpose,
          );
          return (
            <ConsentCard
              key={item.purpose}
              title={item.title}
              description={item.description}
              isRequired={item.isRequired}
              isGranted={state.isGranted}
              changedAt={state.changedAt}
            />
          );
        })}
      </ul>

      <Card className="mt-8">
        <CardHeader
          title="History"
          description="Every change you make is recorded here."
        />
        <DataTable
          caption="Consent history"
          rows={CURRENT_TRAINEE_CONSENT_EVENTS}
          getRowKey={(event) => event.id}
          columns={[
            {
              key: "date",
              header: "Date",
              cell: (event) => formatDate(event.at),
            },
            {
              key: "purpose",
              wrap: true,
              header: "Purpose",
              cell: (event) => PURPOSE_TITLES[event.purpose],
            },
            {
              key: "action",
              header: "Change",
              cell: (event) =>
                event.action === "GRANT" ? "Agreed" : "Withdrawn",
            },
          ]}
        />
      </Card>
    </>
  );
}
