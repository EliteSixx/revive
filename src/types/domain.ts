// Domain types shared by every portal. Source of truth: architecture.md section 4.
// Phase 2 turns these into the Prisma schema with the same names.

export type Role =
  | "TRAINEE"
  | "AGENT"
  | "PROVIDER_STAFF"
  | "EMPLOYER"
  | "DISTRICT_OFFICER"
  | "STATE_ADMIN";

export type Gender = "FEMALE" | "MALE" | "OTHER";
export type SocialCategory = "GENERAL" | "OBC" | "SC" | "ST" | "OTHER";
export type ResidenceType = "RURAL" | "URBAN";

export type FollowUpWindow = "W0" | "W3" | "W6" | "W12" | "W24";

export type FollowUpStatus =
  "SCHEDULED" | "SENT" | "RESPONDED" | "ESCALATED" | "UNREACHABLE" | "CLOSED";

export type AttemptChannel =
  "SMS" | "WHATSAPP" | "IVR" | "AGENT_CALL" | "FIELD_VISIT";

export type AttemptResult =
  | "ANSWERED"
  | "NO_ANSWER"
  | "WRONG_NUMBER"
  | "SWITCHED_OFF"
  | "REFUSED"
  | "CALLBACK_REQUESTED";

export type OutcomeType =
  "WAGE" | "SELF" | "APPRENTICE" | "STUDY" | "NOT_WORKING";

export type OutcomeSource =
  "TRAINEE" | "PROVIDER" | "EMPLOYER" | "AGENT" | "SYSTEM";

export type VerificationLevel =
  | "SELF_REPORTED"
  | "PROVIDER_REPORTED"
  | "EVIDENCE_ATTACHED"
  | "EMPLOYER_CONFIRMED"
  | "EPFO_VERIFIED";

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT";

export type ConsentPurpose =
  | "OUTCOME_TRACKING"
  | "EMPLOYER_VERIFICATION"
  | "EPFO_VERIFICATION"
  | "ALTERNATE_CONTACT"
  | "ANALYTICS";

export type ConsentAction = "GRANT" | "WITHDRAW";

export type ContactPointType = "PHONE" | "EMAIL" | "ALTERNATE";
export type ContactPointStatus = "ACTIVE" | "UNREACHABLE" | "RETIRED";

export type VerificationRequestStatus =
  "PENDING" | "CONFIRMED" | "CORRECTED" | "REJECTED";

export type RemedialActionTarget =
  "PROVIDER" | "COURSE" | "DISTRICT" | "COHORT";
export type RemedialActionStatus = "OPEN" | "IN_PROGRESS" | "DONE" | "DROPPED";

export type EnrolmentStatus =
  "ENROLLED" | "COMPLETED" | "CERTIFIED" | "DROPPED_OUT";

/** ISO 8601 date ("2026-10-02") or timestamp string. */
export type IsoDate = string;

export interface District {
  code: string;
  name: string;
}

export interface Programme {
  id: string;
  code: string;
  name: string;
  followUpWindows: FollowUpWindow[];
}

export interface Course {
  id: string;
  qpCode: string;
  name: string;
  sector: string;
  nsqfLevel: number;
  programmeId: string;
}

export interface Provider {
  id: string;
  name: string;
  registrationRef: string;
}

export interface Centre {
  id: string;
  providerId: string;
  districtCode: string;
  name: string;
}

export interface Batch {
  id: string;
  courseId: string;
  centreId: string;
  startDate: IsoDate;
  endDate: IsoDate;
  enrolledCount: number;
  certifiedCount: number;
}

export interface Trainee {
  id: string;
  fullName: string;
  dateOfBirth: IsoDate;
  gender: Gender;
  socialCategory: SocialCategory;
  hasDisability: boolean;
  residenceType: ResidenceType;
  districtCode: string;
}

export interface ContactPoint {
  id: string;
  traineeId: string;
  type: ContactPointType;
  /** Shown masked in the UI, e.g. "90000 •••12". Never the full number in lists. */
  maskedValue: string;
  status: ContactPointStatus;
}

export interface ConsentEvent {
  id: string;
  traineeId: string;
  purpose: ConsentPurpose;
  action: ConsentAction;
  noticeVersion: string;
  channel: "WEB" | "AGENT_CALL" | "IVR";
  at: IsoDate;
}

export interface Enrolment {
  id: string;
  traineeId: string;
  batchId: string;
  status: EnrolmentStatus;
  certifiedAt: IsoDate | null;
}

export interface FollowUpTask {
  id: string;
  enrolmentId: string;
  window: FollowUpWindow;
  opensAt: IsoDate;
  closesAt: IsoDate;
  status: FollowUpStatus;
}

export interface FollowUpAttempt {
  id: string;
  taskId: string;
  channel: AttemptChannel;
  result: AttemptResult;
  agentName: string | null;
  notes: string;
  at: IsoDate;
}

export interface OutcomeRecord {
  id: string;
  traineeId: string;
  type: OutcomeType;
  window: FollowUpWindow | null;
  source: OutcomeSource;
  verificationLevel: VerificationLevel;
  employerId: string | null;
  jobRole: string | null;
  monthlyWage: number | null;
  employmentType: EmploymentType | null;
  startDate: IsoDate | null;
  endDate: IsoDate | null;
  reasonCode: string | null;
  relevanceScore: 1 | 2 | 3 | 4 | null;
  createdAt: IsoDate;
}

export interface Employer {
  id: string;
  legalName: string;
  gstin: string | null;
  udyamNumber: string | null;
  districtCode: string;
}

export interface EmploymentVerification {
  id: string;
  outcomeRecordId: string;
  employerId: string;
  status: VerificationRequestStatus;
  requestedAt: IsoDate;
  respondedAt: IsoDate | null;
}

export interface SkillGapFeedback {
  id: string;
  employerId: string;
  jobRole: string;
  skillCode: string;
  severity: "MINOR" | "MAJOR";
  comment: string;
}

export interface RemedialAction {
  id: string;
  targetType: RemedialActionTarget;
  targetId: string;
  targetName: string;
  title: string;
  assigneeName: string;
  status: RemedialActionStatus;
  dueDate: IsoDate;
  notes: string;
  createdAt: IsoDate;
}
