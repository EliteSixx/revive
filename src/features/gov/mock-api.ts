import { countOutcomes } from "@/mocks/aggregate";
import {
  COHORT_ROWS,
  DISTRICT_ROWS,
  getCohortRows,
  getNonPlacementReasons,
  getAttritionReasons,
  PROVIDER_ROWS,
  STATE_COUNTS,
  type DistrictRow,
  type ProviderRow,
} from "@/mocks/analytics";
import { REMEDIAL_ACTIONS } from "@/mocks/remedial-actions";
import { SYNTHETIC_TRAINEES } from "@/mocks/synthetic-trainees";
import type { OutcomeCounts } from "@/types/analytics";
import type { RemedialAction } from "@/types/domain";

// Gov mock API: scope enforcement for the frontend phase (architecture.md section 11).
// District officers only ever see their own district's data. State admin sees all.
// In Phase 2 these become server actions enforcing the same rule via session cookie.

/** Returns provider rows scoped to a district, or all providers for state admin. */
export function getScopedProviderRows(districtCode: string | null): readonly ProviderRow[] {
  if (districtCode === null) return PROVIDER_ROWS;
  return PROVIDER_ROWS.filter((row) => row.districtCode === districtCode);
}

/** Returns district rows. District officers only get their own row. State admin gets all. */
export function getScopedDistrictRows(districtCode: string | null): readonly DistrictRow[] {
  if (districtCode === null) return DISTRICT_ROWS;
  return DISTRICT_ROWS.filter((row) => row.district.code === districtCode);
}

/** Returns cohort rows scoped by district, or all cohorts for state admin. */
export function getScopedCohortRows(districtCode: string | null) {
  if (districtCode === null) return COHORT_ROWS;
  const trainees = SYNTHETIC_TRAINEES.filter((t) => t.districtCode === districtCode);
  return getCohortRows(trainees);
}

/** Returns aggregate outcome counts scoped by district, or the state total for state admin. */
export function getScopedStateCounts(districtCode: string | null): OutcomeCounts {
  if (districtCode === null) return STATE_COUNTS;
  const trainees = SYNTHETIC_TRAINEES.filter((t) => t.districtCode === districtCode);
  return countOutcomes(trainees);
}

/** Non-placement reasons scoped by district. */
export function getScopedNonPlacementReasons(districtCode: string | null) {
  const trainees = districtCode
    ? SYNTHETIC_TRAINEES.filter((t) => t.districtCode === districtCode)
    : SYNTHETIC_TRAINEES;
  return getNonPlacementReasons(trainees);
}

/** Attrition reasons scoped by district. */
export function getScopedAttritionReasons(districtCode: string | null) {
  const trainees = districtCode
    ? SYNTHETIC_TRAINEES.filter((t) => t.districtCode === districtCode)
    : SYNTHETIC_TRAINEES;
  return getAttritionReasons(trainees);
}

/** Remedial actions scoped by district: district officers see only actions for their district or its providers. */
export function getScopedActions(districtCode: string | null): readonly RemedialAction[] {
  if (districtCode === null) return REMEDIAL_ACTIONS;
  const districtProviderIds = new Set(
    PROVIDER_ROWS.filter((r) => r.districtCode === districtCode).map((r) => r.provider.id),
  );
  return REMEDIAL_ACTIONS.filter(
    (action) =>
      (action.targetType === "DISTRICT" && action.targetId === districtCode) ||
      (action.targetType === "PROVIDER" && districtProviderIds.has(action.targetId)) ||
      action.targetType === "COHORT" ||
      action.targetType === "COURSE",
  );
}
