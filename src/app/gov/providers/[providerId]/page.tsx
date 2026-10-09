import { notFound } from "next/navigation";
import {
  getCohortRows,
  getCourseRows,
  getTraineesForProvider,
  PROVIDER_ROWS,
} from "@/mocks/analytics";
import { getActionsForTarget } from "@/mocks/remedial-actions";
import GovProviderClient from "./provider-client";

export const metadata = { title: "Provider | Revive" };

export default async function GovProviderPage(
  props: PageProps<"/gov/providers/[providerId]">,
) {
  const { providerId } = await props.params;
  const row = PROVIDER_ROWS.find((item) => item.provider.id === providerId);
  if (!row) notFound();

  const trainees = getTraineesForProvider(providerId);
  const cohorts = getCohortRows(trainees);
  const courseRows = getCourseRows(trainees);
  const actions = getActionsForTarget(providerId);

  return (
    <GovProviderClient
      providerId={providerId}
      providerName={row.provider.name}
      districtName={row.districtName}
      districtCode={row.districtCode}
      registrationRef={row.provider.registrationRef}
      counts={row.counts}
      cohorts={cohorts}
      courses={courseRows}
      actions={actions}
    />
  );
}
