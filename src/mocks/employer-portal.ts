import type {
  EmploymentType,
  VerificationLevel,
  VerificationRequestStatus,
} from "@/types/domain";

// The signed-in employer and their sample verification requests.

export const CURRENT_EMPLOYER = {
  id: "e-precision-auto",
  legalName: "Precision Auto Parts Pvt Ltd (sample)",
  districtName: "Pune",
  contactName: "HR desk",
};

export interface VerificationRequestRow {
  id: string;
  traineeName: string;
  jobRole: string;
  claimedStartDate: string;
  claimedMonthlyWage: number;
  employmentType: EmploymentType;
  reportedBy: VerificationLevel;
  providerName: string;
  requestedAt: string;
  status: VerificationRequestStatus;
}

export const VERIFICATION_REQUESTS: readonly VerificationRequestRow[] = [
  {
    id: "vr-301",
    traineeName: "Sachin Jadhav",
    jobRole: "Service technician",
    claimedStartDate: "2026-08-04",
    claimedMonthlyWage: 15800,
    employmentType: "FULL_TIME",
    reportedBy: "PROVIDER_REPORTED",
    providerName: "Sahyadri Trades Institute",
    requestedAt: "2026-09-26",
    status: "PENDING",
  },
  {
    id: "vr-302",
    traineeName: "Tushar Wagh",
    jobRole: "Service technician",
    claimedStartDate: "2026-08-11",
    claimedMonthlyWage: 15200,
    employmentType: "FULL_TIME",
    reportedBy: "SELF_REPORTED",
    providerName: "Sahyadri Trades Institute",
    requestedAt: "2026-09-27",
    status: "PENDING",
  },
  {
    id: "vr-303",
    traineeName: "Priya Kulkarni",
    jobRole: "Quality inspector trainee",
    claimedStartDate: "2026-07-21",
    claimedMonthlyWage: 14000,
    employmentType: "CONTRACT",
    reportedBy: "PROVIDER_REPORTED",
    providerName: "Deccan Vocational Institute",
    requestedAt: "2026-09-29",
    status: "PENDING",
  },
  {
    id: "vr-304",
    traineeName: "Amol Bhosale",
    jobRole: "Electrician helper",
    claimedStartDate: "2026-07-28",
    claimedMonthlyWage: 14500,
    employmentType: "FULL_TIME",
    reportedBy: "SELF_REPORTED",
    providerName: "Sahyadri Trades Institute",
    requestedAt: "2026-09-30",
    status: "PENDING",
  },
  {
    id: "vr-298",
    traineeName: "Asha Patil",
    jobRole: "Electrician helper",
    claimedStartDate: "2026-07-15",
    claimedMonthlyWage: 14200,
    employmentType: "FULL_TIME",
    reportedBy: "SELF_REPORTED",
    providerName: "Sahyadri Trades Institute",
    requestedAt: "2026-07-21",
    status: "CONFIRMED",
  },
  {
    id: "vr-295",
    traineeName: "Nikhil Salunkhe",
    jobRole: "Service technician",
    claimedStartDate: "2026-06-30",
    claimedMonthlyWage: 16500,
    employmentType: "FULL_TIME",
    reportedBy: "PROVIDER_REPORTED",
    providerName: "Sahyadri Trades Institute",
    requestedAt: "2026-07-08",
    status: "CORRECTED",
  },
  {
    id: "vr-290",
    traineeName: "Sagar Pawar",
    jobRole: "Service technician",
    claimedStartDate: "2026-06-16",
    claimedMonthlyWage: 15000,
    employmentType: "FULL_TIME",
    reportedBy: "PROVIDER_REPORTED",
    providerName: "Deccan Vocational Institute",
    requestedAt: "2026-06-29",
    status: "REJECTED",
  },
];

export interface HireRow {
  id: string;
  traineeName: string;
  jobRole: string;
  startDate: string;
  wageBand: string;
  nextCheckWindow: "W6" | "W12";
  nextCheckDate: string;
}

export const HIRES: readonly HireRow[] = [
  {
    id: "h-1",
    traineeName: "Asha Patil",
    jobRole: "Electrician helper",
    startDate: "2026-07-15",
    wageBand: "₹12,001 to ₹15,000",
    nextCheckWindow: "W6",
    nextCheckDate: "2026-12-26",
  },
  {
    id: "h-2",
    traineeName: "Nikhil Salunkhe",
    jobRole: "Service technician",
    startDate: "2026-06-30",
    wageBand: "₹15,001 to ₹18,000",
    nextCheckWindow: "W6",
    nextCheckDate: "2026-11-24",
  },
  {
    id: "h-3",
    traineeName: "Snehal More",
    jobRole: "Service technician",
    startDate: "2026-02-09",
    wageBand: "₹15,001 to ₹18,000",
    nextCheckWindow: "W12",
    nextCheckDate: "2027-01-19",
  },
  {
    id: "h-4",
    traineeName: "Rahul Shinde",
    jobRole: "Store assistant",
    startDate: "2026-01-12",
    wageBand: "₹12,001 to ₹15,000",
    nextCheckWindow: "W12",
    nextCheckDate: "2026-12-22",
  },
];

export const FEEDBACK_JOB_ROLES = [
  "Service technician",
  "Electrician helper",
  "Store assistant",
] as const;

export const SKILLS_BY_JOB_ROLE: Record<
  (typeof FEEDBACK_JOB_ROLES)[number],
  readonly string[]
> = {
  "Service technician": [
    "Engine and vehicle diagnostics",
    "Use of torque and measuring tools",
    "Reading service manuals",
    "Workshop safety practice",
    "Explaining work to customers",
  ],
  "Electrician helper": [
    "Wiring as per drawings",
    "Use of testing instruments",
    "Electrical safety and lockout",
    "Fault finding",
  ],
  "Store assistant": [
    "Stock counting and records",
    "Basic computer use",
    "Handling customer queries",
  ],
};
