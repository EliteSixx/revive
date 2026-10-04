"use client";

import { useMockStore } from "@/mocks/client-store";
import { sessionStore } from "@/features/auth/session";
import { getDistrictName } from "@/mocks/reference";

// Gov-specific session helpers. Frontend phase only.
// In Phase 2 these are replaced by server-side session reads.

export type GovRole = "STATE_ADMIN" | "DISTRICT_OFFICER";

export interface GovScope {
  role: GovRole;
  /** null = state admin (sees all districts). */
  districtCode: string | null;
  districtName: string | null;
  displayName: string;
  /** Header scope label, e.g. "District view: Pune" or "State view: all districts". */
  scopeLabel: string;
}

/** Reads the current gov scope from the session store. Falls back to state admin for unauthenticated demo access. */
export function useGovScope(): GovScope {
  const session = useMockStore(sessionStore);

  // Fallback: unauthenticated demo navigation still works (architecture.md 10).
  if (
    !session ||
    (session.role !== "DISTRICT_OFFICER" && session.role !== "STATE_ADMIN")
  ) {
    return {
      role: "STATE_ADMIN",
      districtCode: null,
      districtName: null,
      displayName: "State admin (sample)",
      scopeLabel: "State view: all districts",
    };
  }

  if (session.role === "DISTRICT_OFFICER" && session.districtCode) {
    const districtName = getDistrictName(session.districtCode);
    return {
      role: "DISTRICT_OFFICER",
      districtCode: session.districtCode,
      districtName,
      displayName: session.displayName,
      scopeLabel: `District view: ${districtName}`,
    };
  }

  return {
    role: "STATE_ADMIN",
    districtCode: null,
    districtName: null,
    displayName: session.displayName,
    scopeLabel: "State view: all districts",
  };
}
