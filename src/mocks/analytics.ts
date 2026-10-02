import type { CountedReason, OutcomeCounts } from "@/types/analytics";
import type { Course, District, Provider } from "@/types/domain";
import { countOutcomes, countReasons, groupOutcomes } from "./aggregate";
import {
  AGE_BANDS,
  COHORT_MONTHS,
  COURSES,
  DISTRICTS,
  getDistrictName,
  getProviderDistrictCode,
  PROVIDERS,
} from "./reference";
import {
  SYNTHETIC_TRAINEES,
  type SyntheticTrainee,
} from "./synthetic-trainees";

// Ready-made sample datasets for the government and provider dashboards.

export const STATE_COUNTS: OutcomeCounts = countOutcomes(SYNTHETIC_TRAINEES);

export interface ProviderRow {
  provider: Provider;
  districtCode: string;
  districtName: string;
  counts: OutcomeCounts;
}

export const PROVIDER_ROWS: readonly ProviderRow[] = PROVIDERS.map(
  (provider) => ({
    provider,
    districtCode: getProviderDistrictCode(provider.id),
    districtName: getDistrictName(getProviderDistrictCode(provider.id)),
    counts: countOutcomes(
      SYNTHETIC_TRAINEES.filter(
        (trainee) => trainee.providerId === provider.id,
      ),
    ),
  }),
);

export interface DistrictRow {
  district: District;
  providerCount: number;
  counts: OutcomeCounts;
}

export const DISTRICT_ROWS: readonly DistrictRow[] = DISTRICTS.map(
  (district) => ({
    district,
    providerCount: PROVIDER_ROWS.filter(
      (row) => row.districtCode === district.code,
    ).length,
    counts: countOutcomes(
      SYNTHETIC_TRAINEES.filter(
        (trainee) => trainee.districtCode === district.code,
      ),
    ),
  }),
);

export interface CourseRow {
  course: Course;
  counts: OutcomeCounts;
}

export function getCourseRows(
  trainees: readonly SyntheticTrainee[],
): CourseRow[] {
  return COURSES.map((course) => ({
    course,
    counts: countOutcomes(
      trainees.filter((trainee) => trainee.courseId === course.id),
    ),
  })).filter((row) => row.counts.certified > 0);
}

export const COURSE_ROWS: readonly CourseRow[] =
  getCourseRows(SYNTHETIC_TRAINEES);

export function getCohortRows(trainees: readonly SyntheticTrainee[]) {
  return groupOutcomes(
    trainees,
    COHORT_MONTHS,
    (trainee) => trainee.cohortMonth,
  );
}

export const COHORT_ROWS = getCohortRows(SYNTHETIC_TRAINEES);

export const DEMOGRAPHIC_BREAKDOWNS = {
  gender: groupOutcomes(
    SYNTHETIC_TRAINEES,
    ["FEMALE", "MALE", "OTHER"],
    (trainee) => trainee.gender,
  ),
  ageBand: groupOutcomes(
    SYNTHETIC_TRAINEES,
    AGE_BANDS,
    (trainee) => trainee.ageBand,
  ),
  socialCategory: groupOutcomes(
    SYNTHETIC_TRAINEES,
    ["GENERAL", "OBC", "SC", "ST", "OTHER"],
    (trainee) => trainee.socialCategory,
  ),
  disability: groupOutcomes(SYNTHETIC_TRAINEES, ["YES", "NO"], (trainee) =>
    trainee.hasDisability ? "YES" : "NO",
  ),
  residence: groupOutcomes(
    SYNTHETIC_TRAINEES,
    ["RURAL", "URBAN"],
    (trainee) => trainee.residenceType,
  ),
};

export function getNonPlacementReasons(
  trainees: readonly SyntheticTrainee[],
): CountedReason[] {
  return countReasons(trainees.map((trainee) => trainee.nonPlacementReason));
}

export function getAttritionReasons(
  trainees: readonly SyntheticTrainee[],
): CountedReason[] {
  return countReasons(trainees.map((trainee) => trainee.attritionReason));
}

export const NON_PLACEMENT_REASONS_STATE =
  getNonPlacementReasons(SYNTHETIC_TRAINEES);
export const ATTRITION_REASONS_STATE = getAttritionReasons(SYNTHETIC_TRAINEES);

export function getTraineesForProvider(providerId: string): SyntheticTrainee[] {
  return SYNTHETIC_TRAINEES.filter(
    (trainee) => trainee.providerId === providerId,
  );
}

export function getTraineesForDistrict(
  districtCode: string,
): SyntheticTrainee[] {
  return SYNTHETIC_TRAINEES.filter(
    (trainee) => trainee.districtCode === districtCode,
  );
}

/** Response counts per follow-up window, for the data-quality view. */
export function getResponseByWindow(trainees: readonly SyntheticTrainee[]) {
  const w12Due = trainees.filter((trainee) => trainee.w12Responded !== null);
  return [
    {
      window: "W3",
      due: trainees.length,
      responded: trainees.filter((t) => t.w3Responded).length,
    },
    {
      window: "W6",
      due: trainees.length,
      responded: trainees.filter((t) => t.w6Responded).length,
    },
    {
      window: "W12",
      due: w12Due.length,
      responded: w12Due.filter((t) => t.w12Responded).length,
    },
  ];
}

export function countContactable(
  trainees: readonly SyntheticTrainee[],
): number {
  return trainees.filter(
    (t) => t.w3Responded || t.w6Responded || t.w12Responded === true,
  ).length;
}
