import { createMockStore, useMockStore } from "@/mocks/client-store";
import type { Role } from "@/types/domain";

// Frontend phase only: the signed-in user lives in the browser tab. Phase 2
// replaces this with a server session cookie (architecture.md section 1).

export interface Session {
  role: Role;
  displayName: string;
  portalPath: string;
  signedInAt: string;
  /** For DISTRICT_OFFICER: the district code they are scoped to. Null for STATE_ADMIN. */
  districtCode: string | null;
  email?: string;
}

export const sessionStore = createMockStore<Session | null>(
  "auth-session",
  null,
);

/** A one-time password waiting to be entered. Kept only until it is used or replaced. */
export interface PendingOtp {
  phone: string;
  code: string;
  /** Milliseconds since the epoch. */
  sentAt: number;
  expiresAt: number;
  attemptsLeft: number;
}

export const pendingOtpStore = createMockStore<PendingOtp | null>(
  "auth-pending-otp",
  null,
);

export function useSession(): Session | null {
  return useMockStore(sessionStore);
}
