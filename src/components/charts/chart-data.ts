import {
  VERIFICATION_LEVEL_LABELS,
  VERIFICATION_LEVELS,
} from "@/lib/constants";
import {
  calculateRate,
  computeOutcomeRates,
  isSmallGroup,
  NOT_YET_DUE_LABEL,
} from "@/lib/metrics";
import type { CountedReason, OutcomeCounts } from "@/types/analytics";
import { VERIFICATION_COLORS } from "./palette";
import { missingReasonKey, type ChartDatum, type ChartSeries } from "./types";

// Builders that turn OutcomeCounts into chart rows. Rates always come from
// src/lib/metrics.ts, and suppressed values become null.

export interface LabelledCounts {
  label: string;
  counts: OutcomeCounts;
}

export const VERIFICATION_SERIES: readonly ChartSeries[] =
  VERIFICATION_LEVELS.map((level) => ({
    key: level,
    label: VERIFICATION_LEVEL_LABELS[level],
    color: VERIFICATION_COLORS[level],
  }));

/**
 * Share of trainees (W3 closed) in work at W3, split by verification level.
 * Each bar adds up to the placement rate.
 */
export function toVerificationChartData(
  groups: readonly LabelledCounts[],
): ChartDatum[] {
  return groups.map(({ label, counts }) => {
    const row: ChartDatum = { label };
    for (const level of VERIFICATION_LEVELS) {
      const rate = calculateRate(
        counts.verificationByLevel[level],
        counts.w3Closed,
      );
      row[level] = rate.value;
    }
    return row;
  });
}

type RateKey = keyof ReturnType<typeof computeOutcomeRates>;

/** One row per group with the requested rates as columns. */
export function toRateChartData(
  groups: readonly LabelledCounts[],
  rateKeys: readonly RateKey[],
): ChartDatum[] {
  return groups.map(({ label, counts }) => {
    const rates = computeOutcomeRates(counts);
    const row: ChartDatum = { label };
    for (const key of rateKeys) {
      const rate = rates[key];
      row[key] = rate?.value ?? null;
      // A null rate (not a suppressed one) means the follow-up window has not closed yet.
      if (rate === null) row[missingReasonKey(key)] = NOT_YET_DUE_LABEL;
    }
    return row;
  });
}

/** Reason counts as chart rows; counts under the small-group threshold become null. */
export function toReasonChartData(
  reasons: readonly CountedReason[],
  labels: Record<string, string>,
): ChartDatum[] {
  return reasons.map((reason) => ({
    label: labels[reason.code] ?? reason.code,
    count: isSmallGroup(reason.count) ? null : reason.count,
  }));
}
