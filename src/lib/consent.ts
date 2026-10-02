import type { ConsentEvent, ConsentPurpose } from "@/types/domain";

export interface ConsentState {
  isGranted: boolean;
  changedAt: string | null;
}

/** The current state of a purpose is its latest event (architecture.md section 4). */
export function getConsentState(
  events: readonly ConsentEvent[],
  purpose: ConsentPurpose,
): ConsentState {
  const latest = events
    .filter((event) => event.purpose === purpose)
    .reduce<ConsentEvent | null>(
      (newest, event) =>
        newest === null || event.at > newest.at ? event : newest,
      null,
    );
  return {
    isGranted: latest?.action === "GRANT",
    changedAt: latest?.at ?? null,
  };
}
