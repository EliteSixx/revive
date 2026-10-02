import { VERIFICATION_LEVELS } from "@/lib/constants";
import type { CountedReason, OutcomeCounts } from "@/types/analytics";
import type { VerificationLevel } from "@/types/domain";
import type { SyntheticTrainee } from "./synthetic-trainees";

// Turns synthetic trainee records into OutcomeCounts. In Phase 2 this is replaced by
// SQL aggregation in the analytics service; the output shape stays the same.

const VERIFIED_LEVELS: readonly VerificationLevel[] = [
  "EPFO_VERIFIED",
  "EMPLOYER_CONFIRMED",
];

function median(values: readonly number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function isInWork(trainee: SyntheticTrainee): boolean {
  return (
    trainee.w3Outcome === "WAGE" ||
    trainee.w3Outcome === "SELF" ||
    trainee.w3Outcome === "APPRENTICE"
  );
}

export function countOutcomes(
  trainees: readonly SyntheticTrainee[],
): OutcomeCounts {
  const inWork = trainees.filter(isInWork);
  const w12Eligible = inWork.filter((trainee) => trainee.w12InWork !== null);
  const verificationByLevel = Object.fromEntries(
    VERIFICATION_LEVELS.map((level) => [
      level,
      inWork.filter((trainee) => trainee.verificationLevel === level).length,
    ]),
  ) as Record<VerificationLevel, number>;

  const wages = inWork.flatMap((trainee) =>
    trainee.wageAtW3 === null ? [] : [trainee.wageAtW3],
  );
  const wageChanges = inWork.flatMap((trainee) =>
    trainee.wageAtW3 !== null && trainee.wageAtW12 !== null
      ? [(trainee.wageAtW12 - trainee.wageAtW3) / trainee.wageAtW3]
      : [],
  );

  return {
    certified: trainees.length,
    // Every sample cohort is old enough for its W3 window to have closed.
    w3Closed: trainees.length,
    w3Responded: trainees.filter((trainee) => trainee.w3Responded).length,
    w3InWork: inWork.length,
    w3SelfEmployed: inWork.filter((trainee) => trainee.w3Outcome === "SELF")
      .length,
    w3Verified: inWork.filter(
      (trainee) =>
        trainee.verificationLevel !== null &&
        VERIFIED_LEVELS.includes(trainee.verificationLevel),
    ).length,
    w6Eligible: inWork.length,
    w6Retained: inWork.filter((trainee) => trainee.w6InWork === true).length,
    w12Eligible: w12Eligible.length,
    w12Retained: w12Eligible.filter((trainee) => trainee.w12InWork === true)
      .length,
    verificationByLevel,
    medianWageAtPlacement: median(wages),
    medianWageProgression: median(wageChanges),
  };
}

export interface GroupedCounts {
  key: string;
  counts: OutcomeCounts;
}

/** Groups trainees by a key and counts outcomes per group, keeping the order of `keys`. */
export function groupOutcomes(
  trainees: readonly SyntheticTrainee[],
  keys: readonly string[],
  getKey: (trainee: SyntheticTrainee) => string,
): GroupedCounts[] {
  return keys.map((key) => ({
    key,
    counts: countOutcomes(
      trainees.filter((trainee) => getKey(trainee) === key),
    ),
  }));
}

/** Counts non-null reason codes, most frequent first. */
export function countReasons(
  reasonCodes: readonly (string | null)[],
): CountedReason[] {
  const totals = new Map<string, number>();
  for (const code of reasonCodes) {
    if (code !== null) totals.set(code, (totals.get(code) ?? 0) + 1);
  }
  return [...totals.entries()]
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count);
}
