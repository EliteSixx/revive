import type { VerificationLevel } from "@/types/domain";

// Chart colours from design.md section 3. Recharts needs literal colour values
// (SVG presentation attributes do not resolve CSS variables), so they live here.

/** Categorical palette (Okabe-Ito based). Use in order; at most 6 series per chart. */
export const CHART_COLORS = [
  "#0072B2",
  "#E69F00",
  "#009E73",
  "#D55E00",
  "#56B4E9",
  "#CC79A7",
] as const;

export const VERIFICATION_COLORS: Record<VerificationLevel, string> = {
  EPFO_VERIFIED: "#1E7A46",
  EMPLOYER_CONFIRMED: "#00808A",
  EVIDENCE_ATTACHED: "#1F4E8C",
  PROVIDER_REPORTED: "#9A5B00",
  SELF_REPORTED: "#6B7280",
};

export const AXIS_COLORS = {
  grid: "#D9DDE3",
  axisLine: "#B8BFC9",
  tickText: "#545B67",
  /** Gap between stacked segments (design.md section 3). */
  segmentGap: "#FFFFFF",
} as const;
