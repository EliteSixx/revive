import type {
  AttemptChannel,
  AttemptResult,
  EmploymentType,
  ConsentPurpose,
  FollowUpStatus,
  FollowUpWindow,
  Gender,
  OutcomeType,
  RemedialActionStatus,
  RemedialActionTarget,
  ResidenceType,
  SocialCategory,
  VerificationLevel,
  VerificationRequestStatus,
} from "@/types/domain";

// Labels and fixed lists from prd.md section 6. Change them there first.

export const VERIFICATION_LEVELS: readonly VerificationLevel[] = [
  "EPFO_VERIFIED",
  "EMPLOYER_CONFIRMED",
  "EVIDENCE_ATTACHED",
  "PROVIDER_REPORTED",
  "SELF_REPORTED",
];

export const VERIFICATION_LEVEL_LABELS: Record<VerificationLevel, string> = {
  EPFO_VERIFIED: "EPFO verified",
  EMPLOYER_CONFIRMED: "Employer confirmed",
  EVIDENCE_ATTACHED: "Evidence attached",
  PROVIDER_REPORTED: "Provider reported",
  SELF_REPORTED: "Self reported",
};

export const OUTCOME_TYPE_LABELS: Record<OutcomeType, string> = {
  WAGE: "Wage employment",
  SELF: "Self-employment",
  APPRENTICE: "Apprenticeship",
  STUDY: "Further study",
  NOT_WORKING: "Not working",
};

export const FOLLOW_UP_WINDOWS: readonly {
  window: FollowUpWindow;
  monthsAfterCertification: number;
  purpose: string;
  isOptional: boolean;
}[] = [
  {
    window: "W0",
    monthsAfterCertification: 0,
    purpose:
      "Confirm contact details and consent, record any placement already made",
    isOptional: false,
  },
  {
    window: "W3",
    monthsAfterCertification: 3,
    purpose: "Placement status",
    isOptional: false,
  },
  {
    window: "W6",
    monthsAfterCertification: 6,
    purpose: "Retention and wage",
    isOptional: false,
  },
  {
    window: "W12",
    monthsAfterCertification: 12,
    purpose: "Retention, wage progression, training relevance",
    isOptional: false,
  },
  {
    window: "W24",
    monthsAfterCertification: 24,
    purpose: "Long-term livelihood",
    isOptional: true,
  },
];

export const FOLLOW_UP_STATUS_LABELS: Record<FollowUpStatus, string> = {
  SCHEDULED: "Scheduled",
  SENT: "Sent",
  RESPONDED: "Responded",
  ESCALATED: "Escalated",
  UNREACHABLE: "Unreachable",
  CLOSED: "Closed",
};

export const ATTEMPT_RESULT_LABELS: Record<AttemptResult, string> = {
  ANSWERED: "Answered",
  NO_ANSWER: "No answer",
  WRONG_NUMBER: "Wrong number",
  SWITCHED_OFF: "Switched off",
  REFUSED: "Refused",
  CALLBACK_REQUESTED: "Callback requested",
};

export const VERIFICATION_REQUEST_STATUS_LABELS: Record<
  VerificationRequestStatus,
  string
> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CORRECTED: "Corrected",
  REJECTED: "Rejected",
};

export const REMEDIAL_ACTION_STATUS_LABELS: Record<
  RemedialActionStatus,
  string
> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  DONE: "Done",
  DROPPED: "Dropped",
};

export const CONSENT_PURPOSES: readonly {
  purpose: ConsentPurpose;
  title: string;
  description: string;
  isRequired: boolean;
}[] = [
  {
    purpose: "OUTCOME_TRACKING",
    title: "Follow-ups about your work",
    description:
      "We contact you at 3, 6 and 12 months after your certificate to ask about your work. We store your answers.",
    isRequired: true,
  },
  {
    purpose: "ANALYTICS",
    title: "Use in combined reports",
    description:
      "Your answers are counted in reports about courses, providers and districts. Reports never show your name or number.",
    isRequired: true,
  },
  {
    purpose: "EMPLOYER_VERIFICATION",
    title: "Confirm your job with your employer",
    description:
      "We ask the employer you name to confirm that you work there. They see only your name, job role and start date.",
    isRequired: false,
  },
  {
    purpose: "EPFO_VERIFICATION",
    title: "Check your job through EPFO",
    description:
      "We use your UAN to check your provident fund record for employer name and dates. We do not see your PF balance.",
    isRequired: false,
  },
  {
    purpose: "ALTERNATE_CONTACT",
    title: "Use your alternate number",
    description:
      "If we cannot reach your main number, we may call the alternate number you gave us.",
    isRequired: false,
  },
];

export const NON_PLACEMENT_REASONS: Record<string, string> = {
  NO_OFFER: "No job offer received",
  LOW_WAGE: "Wage offered too low",
  LOCATION: "Job too far or unwilling to move",
  SKILL_MISMATCH: "Skill or role mismatch",
  NEEDS_EXPERIENCE: "Employer wanted experience",
  NO_CERTIFICATE: "Certificate not received",
  FURTHER_STUDY: "Further study",
  FAMILY: "Family or caregiving responsibilities",
  HEALTH: "Health",
  OWN_WORK: "Started own work",
  OTHER: "Other",
};

export const ATTRITION_REASONS: Record<string, string> = {
  LOW_WAGE: "Wage too low",
  CONDITIONS: "Working conditions",
  DISTANCE: "Distance or travel",
  CONTRACT_ENDED: "Contract ended",
  LAID_OFF: "Laid off",
  HEALTH: "Health",
  FAMILY: "Family",
  BETTER_OPPORTUNITY: "Better opportunity",
  OWN_WORK: "Started own work",
  OTHER: "Other",
};

export const GENDER_LABELS: Record<Gender, string> = {
  FEMALE: "Female",
  MALE: "Male",
  OTHER: "Other",
};

export const SOCIAL_CATEGORY_LABELS: Record<SocialCategory, string> = {
  GENERAL: "General",
  OBC: "OBC",
  SC: "SC",
  ST: "ST",
  OTHER: "Other",
};

export const RESIDENCE_TYPE_LABELS: Record<ResidenceType, string> = {
  RURAL: "Rural",
  URBAN: "Urban",
};

export const ATTEMPT_CHANNEL_LABELS: Record<AttemptChannel, string> = {
  SMS: "SMS",
  WHATSAPP: "WhatsApp",
  IVR: "Automated call",
  AGENT_CALL: "Desk call",
  FIELD_VISIT: "Field visit",
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
};

export const REMEDIAL_ACTION_TARGET_LABELS: Record<
  RemedialActionTarget,
  string
> = {
  PROVIDER: "Provider",
  COURSE: "Course",
  DISTRICT: "District",
  COHORT: "Cohort",
};
