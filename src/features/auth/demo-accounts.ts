import { CURRENT_TRAINEE } from "@/mocks/trainee-portal";
import type { Role } from "@/types/domain";

// Prototype sign-in accounts. All values are fake: emails use the reserved .test
// domain and the phone number starts with 90000 (rules.md, section 3).

/** Where each role lands after signing in. */
export const PORTAL_PATH_BY_ROLE: Record<Role, string> = {
  TRAINEE: "/trainee",
  AGENT: "/agent",
  PROVIDER_STAFF: "/provider",
  EMPLOYER: "/employer",
  DISTRICT_OFFICER: "/gov",
  STATE_ADMIN: "/gov",
};

export const DEMO_STAFF_PASSWORD = "Revive@2026";

export interface DemoStaffAccount {
  role: Exclude<Role, "TRAINEE">;
  email: string;
  displayName: string;
  /** Scoped district for DISTRICT_OFFICER accounts; null for all others. */
  districtCode: string | null;
}

export const DEMO_STAFF_ACCOUNTS: readonly DemoStaffAccount[] = [
  {
    role: "AGENT",
    email: "desk.agent@revive.test",
    displayName: "Desk agent (sample)",
    districtCode: null,
  },
  {
    role: "PROVIDER_STAFF",
    email: "centre.sahyadri@revive.test",
    displayName: "Centre manager, Sahyadri Trades Institute (sample)",
    districtCode: null,
  },
  {
    role: "EMPLOYER",
    email: "hr.precision@revive.test",
    displayName: "HR desk, Precision Auto Parts (sample)",
    districtCode: null,
  },
  {
    role: "DISTRICT_OFFICER",
    email: "district.pune@revive.test",
    displayName: "District officer, Pune (sample)",
    districtCode: "pune",
  },
  {
    role: "STATE_ADMIN",
    email: "state.admin@revive.test",
    displayName: "State admin (sample)",
    districtCode: null,
  },
];

export interface DemoTraineeAccount {
  phone: string;
  displayName: string;
}

/** Matches the trainee shown in the trainee portal (main number ends in 41). */
export const DEMO_TRAINEE_ACCOUNTS: readonly DemoTraineeAccount[] = [
  { phone: "9000012341", displayName: CURRENT_TRAINEE.fullName },
];

/** "9000012341" becomes "90000 •••41", the same masking used across the portals. */
export function maskPhone(phone: string): string {
  return `${phone.slice(0, 5)} •••${phone.slice(-2)}`;
}
