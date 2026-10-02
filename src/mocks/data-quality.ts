// Sample records for the data-quality view. Only Revive IDs are shown, never names.

export interface DuplicateCandidate {
  id: string;
  recordA: string;
  recordB: string;
  matchReason: string;
  detectedAt: string;
}

export const DUPLICATE_QUEUE: readonly DuplicateCandidate[] = [
  {
    id: "dup-1",
    recordA: "RV-2026-001877",
    recordB: "RV-2026-003954",
    matchReason: "Same phone and date of birth; surname spelt differently",
    detectedAt: "2026-09-29",
  },
  {
    id: "dup-2",
    recordA: "RV-2025-006120",
    recordB: "RV-2026-000418",
    matchReason: "Same programme ID in two programmes",
    detectedAt: "2026-09-27",
  },
  {
    id: "dup-3",
    recordA: "RV-2026-002233",
    recordB: "RV-2026-002291",
    matchReason: "Same name and date of birth; different phone",
    detectedAt: "2026-09-21",
  },
];

export interface OutcomeConflict {
  id: string;
  traineeId: string;
  firstSource: string;
  secondSource: string;
  detectedAt: string;
}

export const OUTCOME_CONFLICTS: readonly OutcomeConflict[] = [
  {
    id: "conf-1",
    traineeId: "RV-2026-000951",
    firstSource: "Provider: in wage employment",
    secondSource: "Employer: not employed here",
    detectedAt: "2026-09-30",
  },
  {
    id: "conf-2",
    traineeId: "RV-2025-008402",
    firstSource: "Trainee: wage ₹16,000",
    secondSource: "Employer: wage ₹13,500",
    detectedAt: "2026-09-24",
  },
  {
    id: "conf-3",
    traineeId: "RV-2026-001134",
    firstSource: "Provider: start 4 Jul 2026",
    secondSource: "EPFO: joining 1 Sep 2026",
    detectedAt: "2026-09-19",
  },
];

/** Employer-reported skill gaps, aggregated across feedback forms. */
export interface SkillGapRow {
  id: string;
  jobRole: string;
  sector: string;
  skill: string;
  employersReporting: number;
  majorShare: number;
}

export const EMPLOYER_SKILL_GAPS: readonly SkillGapRow[] = [
  {
    id: "sg-1",
    jobRole: "Service technician",
    sector: "Automotive",
    skill: "Engine and vehicle diagnostics",
    employersReporting: 18,
    majorShare: 0.61,
  },
  {
    id: "sg-2",
    jobRole: "Electrician helper",
    sector: "Power",
    skill: "Fault finding",
    employersReporting: 15,
    majorShare: 0.47,
  },
  {
    id: "sg-3",
    jobRole: "Store assistant",
    sector: "Retail",
    skill: "Basic computer use",
    employersReporting: 14,
    majorShare: 0.36,
  },
  {
    id: "sg-4",
    jobRole: "Patient care assistant",
    sector: "Healthcare",
    skill: "Infection control practice",
    employersReporting: 12,
    majorShare: 0.58,
  },
  {
    id: "sg-5",
    jobRole: "Machine operator",
    sector: "Apparel",
    skill: "Machine threading and minor repairs",
    employersReporting: 11,
    majorShare: 0.45,
  },
  {
    id: "sg-6",
    jobRole: "Picker and packer",
    sector: "Logistics",
    skill: "Using a handheld scanner",
    employersReporting: 10,
    majorShare: 0.3,
  },
];
