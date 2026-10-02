import type {
  ConsentEvent,
  ContactPoint,
  Enrolment,
  FollowUpTask,
  OutcomeRecord,
  Trainee,
} from "@/types/domain";

// The signed-in trainee shown in the trainee portal. Synthetic person.

export const CURRENT_TRAINEE: Trainee = {
  id: "RV-2026-004127",
  fullName: "Asha Patil",
  dateOfBirth: "2003-04-18",
  gender: "FEMALE",
  socialCategory: "OBC",
  hasDisability: false,
  residenceType: "URBAN",
  districtCode: "pune",
};

export const CURRENT_TRAINEE_ENROLMENT: Enrolment & {
  courseName: string;
  providerName: string;
  centreName: string;
  batchStartDate: string;
  batchEndDate: string;
} = {
  id: "enr-004127-1",
  traineeId: CURRENT_TRAINEE.id,
  batchId: "b-sahyadri-electrician-202606",
  status: "CERTIFIED",
  certifiedAt: "2026-06-26",
  courseName: "Assistant Electrician",
  providerName: "Sahyadri Trades Institute",
  centreName: "Pimpri centre",
  batchStartDate: "2026-03-02",
  batchEndDate: "2026-06-12",
};

export const CURRENT_TRAINEE_FOLLOW_UPS: readonly FollowUpTask[] = [
  {
    id: "fu-004127-w0",
    enrolmentId: "enr-004127-1",
    window: "W0",
    opensAt: "2026-06-26",
    closesAt: "2026-07-26",
    status: "RESPONDED",
  },
  {
    id: "fu-004127-w3",
    enrolmentId: "enr-004127-1",
    window: "W3",
    opensAt: "2026-09-26",
    closesAt: "2026-10-26",
    status: "SENT",
  },
  {
    id: "fu-004127-w6",
    enrolmentId: "enr-004127-1",
    window: "W6",
    opensAt: "2026-12-26",
    closesAt: "2027-01-25",
    status: "SCHEDULED",
  },
  {
    id: "fu-004127-w12",
    enrolmentId: "enr-004127-1",
    window: "W12",
    opensAt: "2027-06-26",
    closesAt: "2027-07-26",
    status: "SCHEDULED",
  },
];

export const CURRENT_TRAINEE_OUTCOMES: readonly (OutcomeRecord & {
  employerName: string;
})[] = [
  {
    id: "out-004127-1",
    traineeId: CURRENT_TRAINEE.id,
    type: "WAGE",
    window: "W0",
    source: "TRAINEE",
    verificationLevel: "EMPLOYER_CONFIRMED",
    employerId: "e-precision-auto",
    employerName: "Precision Auto Parts Pvt Ltd (sample)",
    jobRole: "Electrician helper",
    monthlyWage: 14200,
    employmentType: "FULL_TIME",
    startDate: "2026-07-15",
    endDate: null,
    reasonCode: null,
    relevanceScore: 3,
    createdAt: "2026-07-20",
  },
];

export const CURRENT_TRAINEE_CONTACTS: readonly ContactPoint[] = [
  {
    id: "cp-004127-1",
    traineeId: CURRENT_TRAINEE.id,
    type: "PHONE",
    maskedValue: "90000 •••41",
    status: "ACTIVE",
  },
  {
    id: "cp-004127-2",
    traineeId: CURRENT_TRAINEE.id,
    type: "ALTERNATE",
    maskedValue: "90000 •••87",
    status: "ACTIVE",
  },
];

export const CURRENT_TRAINEE_CONSENT_EVENTS: readonly ConsentEvent[] = [
  {
    id: "ce-5",
    traineeId: CURRENT_TRAINEE.id,
    purpose: "ALTERNATE_CONTACT",
    action: "WITHDRAW",
    noticeVersion: "1.0",
    channel: "WEB",
    at: "2026-08-10T11:24:00Z",
  },
  {
    id: "ce-4",
    traineeId: CURRENT_TRAINEE.id,
    purpose: "ALTERNATE_CONTACT",
    action: "GRANT",
    noticeVersion: "1.0",
    channel: "WEB",
    at: "2026-03-02T09:15:00Z",
  },
  {
    id: "ce-3",
    traineeId: CURRENT_TRAINEE.id,
    purpose: "EMPLOYER_VERIFICATION",
    action: "GRANT",
    noticeVersion: "1.0",
    channel: "WEB",
    at: "2026-03-02T09:15:00Z",
  },
  {
    id: "ce-2",
    traineeId: CURRENT_TRAINEE.id,
    purpose: "ANALYTICS",
    action: "GRANT",
    noticeVersion: "1.0",
    channel: "WEB",
    at: "2026-03-02T09:15:00Z",
  },
  {
    id: "ce-1",
    traineeId: CURRENT_TRAINEE.id,
    purpose: "OUTCOME_TRACKING",
    action: "GRANT",
    noticeVersion: "1.0",
    channel: "WEB",
    at: "2026-03-02T09:15:00Z",
  },
];
