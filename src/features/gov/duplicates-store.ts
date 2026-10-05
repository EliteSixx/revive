import { createMockStore, useMockStore } from "@/mocks/client-store";
import { simulateRequest } from "@/mocks/simulate-request";

export interface TraineeRecordDetail {
  id: string;
  fullName: string;
  phone: string;
  dob: string;
  gender: string;
  district: string;
  districtCode: string;
  provider: string;
  course: string;
  cohort: string;
  outcomeStatus: string;
  enrolmentId: string;
  verificationLevel: string;
}

export type DuplicateStatus =
  | "PENDING"
  | "MERGED"
  | "DISMISSED"
  | "NEEDS_REVIEW";

export interface DuplicateAuditEntry {
  action: "MERGED" | "DISMISSED" | "FLAGGED_FOR_REVIEW";
  performedBy: string;
  performedAt: string; // ISO date-time string
  notes: string;
  survivingRecordId?: string;
}

export interface DuplicateCandidateItem {
  id: string;
  districtCode: string;
  matchReason: string;
  detectedAt: string;
  status: DuplicateStatus;
  differingFields: (keyof TraineeRecordDetail)[];
  recordA: TraineeRecordDetail;
  recordB: TraineeRecordDetail;
  auditTrail: DuplicateAuditEntry[];
  survivingRecordId?: string;
}

export const INITIAL_DUPLICATE_CANDIDATES: readonly DuplicateCandidateItem[] = [
  {
    id: "dup-1",
    districtCode: "pune",
    matchReason: "Same phone and date of birth; surname spelt differently",
    detectedAt: "2026-09-29",
    status: "PENDING",
    differingFields: ["fullName", "enrolmentId", "verificationLevel"],
    recordA: {
      id: "RV-2026-001877",
      fullName: "Rahul Deshmukh",
      phone: "90000 14820",
      dob: "14 Aug 2002",
      gender: "Male",
      district: "Pune",
      districtCode: "pune",
      provider: "Sahyadri Trades Institute",
      course: "Solar PV Installer",
      cohort: "May 2026",
      outcomeStatus: "In work at W3",
      enrolmentId: "ENR-2026-0188",
      verificationLevel: "EPFO Verified",
    },
    recordB: {
      id: "RV-2026-003954",
      fullName: "Rahul Deshmukhe",
      phone: "90000 14820",
      dob: "14 Aug 2002",
      gender: "Male",
      district: "Pune",
      districtCode: "pune",
      provider: "Sahyadri Trades Institute",
      course: "Solar PV Installer",
      cohort: "May 2026",
      outcomeStatus: "In work at W3",
      enrolmentId: "ENR-2026-0395",
      verificationLevel: "Provider Reported",
    },
    auditTrail: [],
  },
  {
    id: "dup-2",
    districtCode: "pune",
    matchReason: "Same programme ID in two programmes",
    detectedAt: "2026-09-27",
    status: "PENDING",
    differingFields: ["course", "provider", "enrolmentId", "cohort", "outcomeStatus", "verificationLevel"],
    recordA: {
      id: "RV-2025-006120",
      fullName: "Aniket Shinde",
      phone: "90000 78210",
      dob: "22 Mar 2001",
      gender: "Male",
      district: "Pune",
      districtCode: "pune",
      provider: "Maharashtra Skills Academy",
      course: "Electrician Helper",
      cohort: "Nov 2025",
      outcomeStatus: "In work at W3",
      enrolmentId: "ENR-2025-0612",
      verificationLevel: "Employer Confirmed",
    },
    recordB: {
      id: "RV-2026-000418",
      fullName: "Aniket Shinde",
      phone: "90000 78210",
      dob: "22 Mar 2001",
      gender: "Male",
      district: "Pune",
      districtCode: "pune",
      provider: "Sahyadri Trades Institute",
      course: "Wireman Level 4",
      cohort: "Feb 2026",
      outcomeStatus: "Certified (W3 pending)",
      enrolmentId: "ENR-2026-0041",
      verificationLevel: "Self Reported",
    },
    auditTrail: [],
  },
  {
    id: "dup-3",
    districtCode: "pune",
    matchReason: "Same name and date of birth; different phone",
    detectedAt: "2026-09-21",
    status: "PENDING",
    differingFields: ["phone", "provider", "enrolmentId", "outcomeStatus"],
    recordA: {
      id: "RV-2026-002233",
      fullName: "Pooja Jadhav",
      phone: "90000 55122",
      dob: "05 Nov 2001",
      gender: "Female",
      district: "Pune",
      districtCode: "pune",
      provider: "Sahyadri Trades Institute",
      course: "Sewing Machine Operator",
      cohort: "Jun 2026",
      outcomeStatus: "In work at W3",
      enrolmentId: "ENR-2026-0223",
      verificationLevel: "Employer Confirmed",
    },
    recordB: {
      id: "RV-2026-002291",
      fullName: "Pooja Jadhav",
      phone: "90000 88319",
      dob: "05 Nov 2001",
      gender: "Female",
      district: "Pune",
      districtCode: "pune",
      provider: "Godavari Foundation Centre",
      course: "Sewing Machine Operator",
      cohort: "Jun 2026",
      outcomeStatus: "Self-employed",
      enrolmentId: "ENR-2026-0229",
      verificationLevel: "Self Reported",
    },
    auditTrail: [],
  },
  {
    id: "dup-4",
    districtCode: "nagpur",
    matchReason: "Same phone number with similar names in adjacent batches",
    detectedAt: "2026-09-18",
    status: "PENDING",
    differingFields: ["fullName", "cohort", "enrolmentId"],
    recordA: {
      id: "RV-2026-004101",
      fullName: "Suresh Wankhede",
      phone: "90000 33419",
      dob: "19 Jan 2003",
      gender: "Male",
      district: "Nagpur",
      districtCode: "nagpur",
      provider: "Vidarbha Vocational Centre",
      course: "Automotive Service Technician",
      cohort: "Mar 2026",
      outcomeStatus: "In work at W3",
      enrolmentId: "ENR-2026-0410",
      verificationLevel: "EPFO Verified",
    },
    recordB: {
      id: "RV-2026-004188",
      fullName: "Suresh S. Wankhede",
      phone: "90000 33419",
      dob: "19 Jan 2003",
      gender: "Male",
      district: "Nagpur",
      districtCode: "nagpur",
      provider: "Vidarbha Vocational Centre",
      course: "Automotive Service Technician",
      cohort: "Apr 2026",
      outcomeStatus: "In work at W3",
      enrolmentId: "ENR-2026-0418",
      verificationLevel: "Provider Reported",
    },
    auditTrail: [],
  },
];

export const duplicateCandidatesStore = createMockStore<DuplicateCandidateItem[]>(
  "gov-duplicate-candidates",
  [...INITIAL_DUPLICATE_CANDIDATES],
);

/** Hook to read duplicate candidates from store (persisted in sessionStorage). */
export function useDuplicateCandidates(districtCode: string | null) {
  const allCandidates = useMockStore(duplicateCandidatesStore);
  if (districtCode === null) return allCandidates;
  return allCandidates.filter((item) => item.districtCode === districtCode);
}

/** Execute merge of duplicate candidate record */
export function mergeDuplicateRecord(
  candidateId: string,
  winningRecordId: string,
  officerName: string,
  notes: string,
) {
  return simulateRequest<DuplicateCandidateItem>(() => {
    const list = duplicateCandidatesStore.getState();
    const target = list.find((item) => item.id === candidateId);
    if (!target) throw new Error("Candidate record not found");

    const auditEntry: DuplicateAuditEntry = {
      action: "MERGED",
      performedBy: officerName,
      performedAt: new Date().toISOString(),
      notes: notes || "Merged duplicate records into canonical master profile.",
      survivingRecordId: winningRecordId,
    };

    const updated: DuplicateCandidateItem = {
      ...target,
      status: "MERGED",
      survivingRecordId: winningRecordId,
      auditTrail: [auditEntry, ...target.auditTrail],
    };

    duplicateCandidatesStore.setState((prev) =>
      prev.map((item) => (item.id === candidateId ? updated : item)),
    );

    return updated;
  });
}

/** Dismiss duplicate candidate flag */
export function dismissDuplicateRecord(
  candidateId: string,
  officerName: string,
  notes: string,
) {
  return simulateRequest<DuplicateCandidateItem>(() => {
    const list = duplicateCandidatesStore.getState();
    const target = list.find((item) => item.id === candidateId);
    if (!target) throw new Error("Candidate record not found");

    const auditEntry: DuplicateAuditEntry = {
      action: "DISMISSED",
      performedBy: officerName,
      performedAt: new Date().toISOString(),
      notes: notes || "Confirmed as distinct individual trainees.",
    };

    const updated: DuplicateCandidateItem = {
      ...target,
      status: "DISMISSED",
      auditTrail: [auditEntry, ...target.auditTrail],
    };

    duplicateCandidatesStore.setState((prev) =>
      prev.map((item) => (item.id === candidateId ? updated : item)),
    );

    return updated;
  });
}

/** Flag duplicate for further physical/centre verification */
export function flagDuplicateForReview(
  candidateId: string,
  officerName: string,
  notes: string,
) {
  return simulateRequest<DuplicateCandidateItem>(() => {
    const list = duplicateCandidatesStore.getState();
    const target = list.find((item) => item.id === candidateId);
    if (!target) throw new Error("Candidate record not found");

    const auditEntry: DuplicateAuditEntry = {
      action: "FLAGGED_FOR_REVIEW",
      performedBy: officerName,
      performedAt: new Date().toISOString(),
      notes: notes || "Flagged for physical verification at training centre.",
    };

    const updated: DuplicateCandidateItem = {
      ...target,
      status: "NEEDS_REVIEW",
      auditTrail: [auditEntry, ...target.auditTrail],
    };

    duplicateCandidatesStore.setState((prev) =>
      prev.map((item) => (item.id === candidateId ? updated : item)),
    );

    return updated;
  });
}
