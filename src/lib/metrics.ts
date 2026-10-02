import type { OutcomeCounts } from "@/types/analytics";
import { formatNumber, formatPercent } from "./format";

// Metric definitions and calculations. Source of truth: prd.md section 8.
// Screens must not calculate rates themselves; they call computeOutcomeRates().

/** Any value based on fewer trainees than this is suppressed (prd.md section 8). */
export const SMALL_GROUP_THRESHOLD = 10;

/** Text shown in place of any suppressed value. */
export const SUPPRESSED_LABEL = "Fewer than 10";

/** Text shown for a metric whose follow-up window has not closed yet. */
export const NOT_YET_DUE_LABEL = "Not yet due";

export type RateResult =
  | { isSuppressed: false; value: number; denominator: number }
  | { isSuppressed: true; value: null; denominator: number };

export function isSmallGroup(count: number): boolean {
  return count < SMALL_GROUP_THRESHOLD;
}

export function calculateRate(
  numerator: number,
  denominator: number,
): RateResult {
  if (isSmallGroup(denominator)) {
    return { isSuppressed: true, value: null, denominator };
  }
  return { isSuppressed: false, value: numerator / denominator, denominator };
}

export interface OutcomeRates {
  responseRate: RateResult;
  placementRate: RateResult;
  verifiedPlacementRate: RateResult;
  verifiedShare: RateResult;
  selfEmploymentShare: RateResult;
  retentionW6: RateResult | null;
  retentionW12: RateResult | null;
}

export function computeOutcomeRates(counts: OutcomeCounts): OutcomeRates {
  return {
    responseRate: calculateRate(counts.w3Responded, counts.w3Closed),
    placementRate: calculateRate(counts.w3InWork, counts.w3Closed),
    verifiedPlacementRate: calculateRate(counts.w3Verified, counts.w3Closed),
    verifiedShare: calculateRate(counts.w3Verified, counts.w3InWork),
    selfEmploymentShare: calculateRate(counts.w3SelfEmployed, counts.w3InWork),
    retentionW6:
      counts.w6Eligible === 0
        ? null
        : calculateRate(counts.w6Retained, counts.w6Eligible),
    retentionW12:
      counts.w12Eligible === 0
        ? null
        : calculateRate(counts.w12Retained, counts.w12Eligible),
  };
}

/** Formats a rate as a percentage, or returns null when it is suppressed or not yet available. */
export function formatRate(
  rate: RateResult | null,
  decimals = 1,
): string | null {
  if (rate === null || rate.isSuppressed) return null;
  return formatPercent(rate.value, decimals);
}

/** Formats a trainee count for reports, hiding it when it is a small group. */
export function formatReportCount(count: number): string {
  return isSmallGroup(count) ? SUPPRESSED_LABEL : formatNumber(count);
}

/** Base line under a figure, e.g. "n = 2,658 with W3 closed". Small bases are hidden too. */
export function formatBase(count: number, description: string): string {
  return isSmallGroup(count)
    ? `${SUPPRESSED_LABEL} ${description}`
    : `n = ${formatNumber(count)} ${description}`;
}

/** Sort value for a rate: suppressed or missing rates sort after every real value. */
export function rateSortValue(rate: RateResult | null): number {
  // MAX_VALUE rather than Infinity so two missing rates compare as equal (Infinity - Infinity is NaN).
  return rate === null || rate.isSuppressed ? Number.MAX_VALUE : rate.value;
}

/** Median values are suppressed under the same small-group rule as rates. */
export function suppressMedian(
  value: number | null,
  groupSize: number,
): number | null {
  if (value === null || isSmallGroup(groupSize)) return null;
  return value;
}

export interface MetricDefinition {
  id: string;
  name: string;
  formula: string;
  notes: string;
}

export const METRIC_DEFINITIONS: readonly MetricDefinition[] = [
  {
    id: "certified",
    name: "Certified",
    formula: "Trainees with a certification date in the period",
    notes: "Base cohort for every other metric.",
  },
  {
    id: "response-rate",
    name: "Response rate (by window)",
    formula:
      "Trainees with a completed follow-up in the window ÷ trainees whose window has closed",
    notes: "Shown separately for W3, W6 and W12.",
  },
  {
    id: "placement-rate",
    name: "Placement rate (W3)",
    formula:
      "Trainees in wage employment, self-employment or apprenticeship at W3 ÷ certified trainees whose W3 has closed",
    notes:
      "Unreachable trainees stay in the denominator. Shown with its verification breakdown.",
  },
  {
    id: "verified-placement-rate",
    name: "Verified placement rate (W3)",
    formula:
      "Same as placement rate, counting only outcomes that are employer confirmed or EPFO verified",
    notes: "The headline accountability metric.",
  },
  {
    id: "retention",
    name: "Retention (W6 and W12)",
    formula:
      "Trainees in work at both W3 and W6 (or W12) ÷ trainees in work at W3",
    notes:
      "Any work counts, so a job change is allowed. Trainees unreachable at W6 or W12 count as not retained and are also reported separately.",
  },
  {
    id: "same-employer-retention",
    name: "Same-employer retention",
    formula:
      "Trainees with the same employer at W3 and W6 ÷ trainees in wage employment at W3",
    notes: "",
  },
  {
    id: "median-wage",
    name: "Median wage at placement",
    formula: "Median monthly gross wage at the first wage-employment outcome",
    notes: "Shown in rupees with Indian number grouping.",
  },
  {
    id: "wage-progression",
    name: "Wage progression",
    formula: "Median of (wage at W12 minus wage at W3) ÷ wage at W3",
    notes:
      "Only trainees with a wage at both W3 and W12. Shown as a percentage.",
  },
  {
    id: "self-employment-share",
    name: "Self-employment share",
    formula: "Self-employed trainees ÷ all trainees in work",
    notes: "",
  },
  {
    id: "training-relevance",
    name: "Training relevance",
    formula:
      'Share answering "Mostly" or "Fully" to "Are you using skills from this training in your work?"',
    notes: "Among trainees in work.",
  },
  {
    id: "contactability",
    name: "Contactability",
    formula: "Trainees reached in at least one window ÷ certified trainees",
    notes: "Data-quality metric.",
  },
];
