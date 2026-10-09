import { notFound } from "next/navigation";
import {
  DISTRICT_ROWS,
  getCourseRows,
  getNonPlacementReasons,
  getTraineesForDistrict,
  PROVIDER_ROWS,
} from "@/mocks/analytics";
import GovDistrictClient from "./district-client";

export const metadata = { title: "District | Revive" };

export default async function GovDistrictPage(
  props: PageProps<"/gov/districts/[districtCode]">,
) {
  const { districtCode } = await props.params;
  const row = DISTRICT_ROWS.find((item) => item.district.code === districtCode);
  if (!row) notFound();

  const trainees = getTraineesForDistrict(districtCode);
  const providers = PROVIDER_ROWS.filter(
    (provider) => provider.districtCode === districtCode,
  );
  const reasons = getNonPlacementReasons(trainees).slice(0, 5);
  const courses = getCourseRows(trainees);

  return (
    <GovDistrictClient
      districtCode={districtCode}
      districtName={row.district.name}
      counts={row.counts}
      providers={providers}
      reasons={reasons}
      courses={courses}
    />
  );
}
