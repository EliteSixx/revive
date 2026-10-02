import type { VerificationLevel } from "./domain";

/**
 * Raw counts for one group of trainees (a provider, district, course, cohort or
 * demographic group). Rates are never stored; they are derived in src/lib/metrics.ts.
 */
export interface OutcomeCounts {
  certified: number;
  /** Certified trainees whose W3 window has closed. Denominator for W3 rates. */
  w3Closed: number;
  w3Responded: number;
  /** In wage employment, self-employment or apprenticeship at W3. */
  w3InWork: number;
  w3SelfEmployed: number;
  /** In work at W3 with an EMPLOYER_CONFIRMED or EPFO_VERIFIED outcome. */
  w3Verified: number;
  /** In work at W3, in cohorts whose W6 window has closed. Denominator for W6 retention. */
  w6Eligible: number;
  /** In work at both W3 and W6. */
  w6Retained: number;
  /** In work at W3, in cohorts whose W12 window has closed. Denominator for W12 retention. */
  w12Eligible: number;
  /** In work at both W3 and W12. */
  w12Retained: number;
  verificationByLevel: Record<VerificationLevel, number>;
  medianWageAtPlacement: number | null;
  /** Median of (wage at W12 minus wage at W3) / wage at W3. Null until W12 closes for the group. */
  medianWageProgression: number | null;
}

export interface CountedReason {
  code: string;
  count: number;
}
