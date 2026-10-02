import type {
  Gender,
  OutcomeType,
  ResidenceType,
  SocialCategory,
  VerificationLevel,
} from "@/types/domain";
import {
  COHORT_MONTHS,
  COHORTS_WITH_W12,
  getProviderDistrictCode,
  type AgeBand,
} from "./reference";

// Generates one consistent set of synthetic trainee records. Every sample dashboard
// is aggregated from these records, so totals match across pages. The seed is fixed,
// so the output is identical on every run.

export interface SyntheticTrainee {
  id: string;
  fullName: string;
  providerId: string;
  courseId: string;
  districtCode: string;
  cohortMonth: string;
  gender: Gender;
  ageBand: AgeBand;
  socialCategory: SocialCategory;
  hasDisability: boolean;
  residenceType: ResidenceType;
  w3Responded: boolean;
  /** Null when the trainee's status at W3 is unknown (no response and no other report). */
  w3Outcome: OutcomeType | null;
  verificationLevel: VerificationLevel | null;
  wageAtW3: number | null;
  nonPlacementReason: string | null;
  w6Responded: boolean;
  w6InWork: boolean | null;
  attritionReason: string | null;
  w12Responded: boolean | null;
  w12InWork: boolean | null;
  wageAtW12: number | null;
}

interface ProviderProfile {
  providerId: string;
  certified: number;
  courseIds: readonly string[];
  responseProbability: number;
  placementProbability: number;
  verifiedProbability: number;
  retentionProbability: number;
}

const PROVIDER_PROFILES: readonly ProviderProfile[] = [
  {
    providerId: "p-godavari",
    certified: 420,
    courseIds: ["c-electrician", "c-warehouse"],
    responseProbability: 0.8,
    placementProbability: 0.6,
    verifiedProbability: 0.6,
    retentionProbability: 0.8,
  },
  {
    providerId: "p-konkan",
    certified: 610,
    courseIds: ["c-retail", "c-data-entry"],
    responseProbability: 0.74,
    placementProbability: 0.66,
    verifiedProbability: 0.66,
    retentionProbability: 0.82,
  },
  {
    providerId: "p-vidarbha",
    certified: 350,
    courseIds: ["c-gda", "c-electrician"],
    responseProbability: 0.66,
    placementProbability: 0.6,
    verifiedProbability: 0.35,
    retentionProbability: 0.74,
  },
  {
    providerId: "p-sahyadri",
    certified: 540,
    courseIds: ["c-auto-service", "c-electrician"],
    responseProbability: 0.8,
    placementProbability: 0.66,
    verifiedProbability: 0.65,
    retentionProbability: 0.84,
  },
  {
    providerId: "p-deccan",
    certified: 290,
    courseIds: ["c-auto-service", "c-sewing"],
    responseProbability: 0.56,
    placementProbability: 0.62,
    verifiedProbability: 0.2,
    retentionProbability: 0.66,
  },
  {
    providerId: "p-panchganga",
    certified: 260,
    courseIds: ["c-sewing", "c-electrician"],
    responseProbability: 0.82,
    placementProbability: 0.6,
    verifiedProbability: 0.68,
    retentionProbability: 0.85,
  },
  {
    providerId: "p-bhima",
    certified: 180,
    courseIds: ["c-sewing", "c-retail"],
    responseProbability: 0.62,
    placementProbability: 0.58,
    verifiedProbability: 0.42,
    retentionProbability: 0.72,
  },
  {
    providerId: "p-purna",
    certified: 8,
    courseIds: ["c-gda"],
    responseProbability: 0.75,
    placementProbability: 0.5,
    verifiedProbability: 0.5,
    retentionProbability: 0.75,
  },
];

const BASE_WAGE_BY_COURSE: Record<string, number> = {
  "c-electrician": 14500,
  "c-auto-service": 15500,
  "c-gda": 13000,
  "c-retail": 12500,
  "c-sewing": 10500,
  "c-warehouse": 13500,
  "c-data-entry": 12000,
};

const NON_PLACEMENT_WEIGHTS: Record<string, number> = {
  NO_OFFER: 26,
  LOW_WAGE: 18,
  LOCATION: 15,
  SKILL_MISMATCH: 11,
  NEEDS_EXPERIENCE: 9,
  NO_CERTIFICATE: 4,
  FURTHER_STUDY: 6,
  FAMILY: 7,
  HEALTH: 2,
  OTHER: 2,
};

const ATTRITION_WEIGHTS: Record<string, number> = {
  LOW_WAGE: 27,
  CONDITIONS: 16,
  DISTANCE: 15,
  CONTRACT_ENDED: 12,
  LAID_OFF: 6,
  HEALTH: 3,
  FAMILY: 8,
  BETTER_OPPORTUNITY: 7,
  OWN_WORK: 4,
  OTHER: 2,
};

const FEMALE_FIRST_NAMES = [
  "Asha",
  "Pooja",
  "Snehal",
  "Kavita",
  "Priya",
  "Rutuja",
  "Sayali",
  "Neha",
  "Komal",
  "Shraddha",
];
const MALE_FIRST_NAMES = [
  "Rahul",
  "Sachin",
  "Amol",
  "Vikas",
  "Ganesh",
  "Akash",
  "Sagar",
  "Nikhil",
  "Prashant",
  "Tushar",
];
const LAST_NAMES = [
  "Patil",
  "Jadhav",
  "Pawar",
  "Shinde",
  "Kale",
  "More",
  "Gaikwad",
  "Deshmukh",
  "Kulkarni",
  "Bhosale",
  "Salunkhe",
  "Wagh",
];

/** Small deterministic pseudo-random generator (mulberry32). */
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickWeighted<T extends string>(
  random: () => number,
  weights: Record<T, number>,
): T {
  const entries = Object.entries(weights) as [T, number][];
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let threshold = random() * total;
  for (const [value, weight] of entries) {
    threshold -= weight;
    if (threshold < 0) return value;
  }
  return entries[entries.length - 1][0];
}

function pickOne<T>(random: () => number, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)];
}

function roundToHundred(value: number): number {
  return Math.round(value / 100) * 100;
}

function pickVerificationLevel(
  random: () => number,
  outcome: OutcomeType,
  verifiedProbability: number,
): VerificationLevel {
  // Self-employment has no employer or EPFO record to check against.
  if (outcome === "SELF")
    return random() < 0.5 ? "EVIDENCE_ATTACHED" : "SELF_REPORTED";
  if (random() < verifiedProbability)
    return random() < 0.55 ? "EPFO_VERIFIED" : "EMPLOYER_CONFIRMED";
  return pickWeighted(random, {
    EVIDENCE_ATTACHED: 2,
    PROVIDER_REPORTED: 5,
    SELF_REPORTED: 3,
  });
}

function generateTrainees(): SyntheticTrainee[] {
  const random = createRandom(26135);
  const trainees: SyntheticTrainee[] = [];

  for (const profile of PROVIDER_PROFILES) {
    for (let index = 0; index < profile.certified; index += 1) {
      const gender: Gender =
        random() < 0.003 ? "OTHER" : random() < 0.42 ? "FEMALE" : "MALE";
      const firstNames =
        gender === "FEMALE" ? FEMALE_FIRST_NAMES : MALE_FIRST_NAMES;
      const courseId = pickOne(random, profile.courseIds);
      const cohortMonth = pickOne(random, COHORT_MONTHS);
      const hasDisability = random() < 0.03;

      const w3Responded = random() < profile.responseProbability;
      // Non-responders can still be known to be in work through a provider report.
      const isReportedByProviderOnly = !w3Responded && random() < 0.25;
      const isStatusKnown = w3Responded || isReportedByProviderOnly;
      const placementProbability =
        profile.placementProbability * (hasDisability ? 0.75 : 1);
      const isInWork =
        isReportedByProviderOnly ||
        (w3Responded && random() < placementProbability);

      let w3Outcome: OutcomeType | null = null;
      if (isInWork) {
        w3Outcome = pickWeighted(random, { WAGE: 82, SELF: 12, APPRENTICE: 6 });
      } else if (isStatusKnown) {
        w3Outcome = random() < 0.08 ? "STUDY" : "NOT_WORKING";
      }

      const verificationLevel =
        w3Outcome && isInWork
          ? isReportedByProviderOnly
            ? "PROVIDER_REPORTED"
            : pickVerificationLevel(
                random,
                w3Outcome,
                profile.verifiedProbability,
              )
          : null;
      const wageAtW3 =
        w3Outcome === "WAGE"
          ? roundToHundred(
              BASE_WAGE_BY_COURSE[courseId] * (0.85 + random() * 0.35),
            )
          : null;

      const w6Responded = random() < profile.responseProbability * 0.92;
      const w6InWork = isInWork
        ? random() < profile.retentionProbability
        : null;
      const hasW12 = COHORTS_WITH_W12.includes(cohortMonth);
      const w12InWork =
        hasW12 && isInWork ? Boolean(w6InWork) && random() < 0.88 : null;

      trainees.push({
        id: `t-${profile.providerId.slice(2)}-${String(index + 1).padStart(4, "0")}`,
        fullName: `${pickOne(random, firstNames)} ${pickOne(random, LAST_NAMES)}`,
        providerId: profile.providerId,
        courseId,
        districtCode: getProviderDistrictCode(profile.providerId),
        cohortMonth,
        gender,
        ageBand: pickWeighted(random, {
          "18 to 24": 60,
          "25 to 29": 25,
          "30 to 35": 10,
          "36 and above": 5,
        }),
        socialCategory: pickWeighted(random, {
          GENERAL: 30,
          OBC: 38,
          SC: 16,
          ST: 10,
          OTHER: 6,
        }),
        hasDisability,
        residenceType: random() < 0.55 ? "RURAL" : "URBAN",
        w3Responded,
        w3Outcome,
        verificationLevel,
        wageAtW3,
        nonPlacementReason:
          w3Outcome === "NOT_WORKING"
            ? pickWeighted(random, NON_PLACEMENT_WEIGHTS)
            : null,
        w6Responded,
        w6InWork,
        attritionReason:
          w6InWork === false ? pickWeighted(random, ATTRITION_WEIGHTS) : null,
        w12Responded: hasW12
          ? random() < profile.responseProbability * 0.85
          : null,
        w12InWork,
        wageAtW12:
          w12InWork && wageAtW3 !== null
            ? roundToHundred(wageAtW3 * (1 + random() * 0.18))
            : null,
      });
    }
  }

  return trainees;
}

export const SYNTHETIC_TRAINEES: readonly SyntheticTrainee[] =
  generateTrainees();
