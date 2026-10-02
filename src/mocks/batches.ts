import type { Batch, Centre, Course } from "@/types/domain";
import {
  CENTRES,
  COHORT_MONTHS,
  COURSES,
  findById,
  PROVIDERS,
} from "./reference";
import {
  SYNTHETIC_TRAINEES,
  type SyntheticTrainee,
} from "./synthetic-trainees";

function getCurrentProvider() {
  const provider = findById(PROVIDERS, "p-sahyadri");
  if (!provider)
    throw new Error("Sample provider p-sahyadri is missing from PROVIDERS");
  return provider;
}

/** The training provider shown as signed in to the provider portal. */
export const CURRENT_PROVIDER = getCurrentProvider();

export interface BatchSummary {
  batch: Batch;
  course: Course;
  centre: Centre;
  trainees: readonly SyntheticTrainee[];
}

function shiftMonths(isoMonth: string, months: number, day: number): string {
  const date = new Date(`${isoMonth}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + months, day);
  return date.toISOString().slice(0, 10);
}

/** One batch per provider, course and certification month, newest first. */
export function getProviderBatches(providerId: string): BatchSummary[] {
  const centre = CENTRES.find((item) => item.providerId === providerId);
  if (!centre) return [];
  const trainees = SYNTHETIC_TRAINEES.filter(
    (trainee) => trainee.providerId === providerId,
  );
  const summaries: BatchSummary[] = [];

  for (const cohortMonth of [...COHORT_MONTHS].reverse()) {
    for (const course of COURSES) {
      const batchTrainees = trainees.filter(
        (trainee) =>
          trainee.cohortMonth === cohortMonth && trainee.courseId === course.id,
      );
      if (batchTrainees.length === 0) continue;
      const certifiedCount = batchTrainees.length;
      summaries.push({
        batch: {
          id: `b-${providerId.slice(2)}-${course.id.slice(2)}-${cohortMonth.slice(0, 7).replace("-", "")}`,
          courseId: course.id,
          centreId: centre.id,
          startDate: shiftMonths(cohortMonth, -4, 1),
          endDate: shiftMonths(cohortMonth, -1, 20),
          // Sample assumption: about 8% of enrolled trainees did not complete.
          enrolledCount: Math.ceil(certifiedCount * 1.08),
          certifiedCount,
        },
        course,
        centre,
        trainees: batchTrainees,
      });
    }
  }
  return summaries;
}

export function findProviderBatch(
  providerId: string,
  batchId: string,
): BatchSummary | undefined {
  return getProviderBatches(providerId).find(
    (summary) => summary.batch.id === batchId,
  );
}
