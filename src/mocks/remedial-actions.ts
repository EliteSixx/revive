import type { RemedialAction } from "@/types/domain";

export const REMEDIAL_ACTIONS: readonly RemedialAction[] = [
  {
    id: "act-014",
    targetType: "PROVIDER",
    targetId: "p-deccan",
    targetName: "Deccan Vocational Institute",
    title: "Raise employer verification of reported placements",
    assigneeName: "Deccan Vocational Institute",
    status: "IN_PROGRESS",
    dueDate: "2026-11-30",
    notes:
      "Most placements are provider reported. Share employer contacts so confirmations can be requested.",
    createdAt: "2026-09-02",
  },
  {
    id: "act-013",
    targetType: "PROVIDER",
    targetId: "p-sahyadri",
    targetName: "Sahyadri Trades Institute",
    title:
      "Upload evidence for provider-reported placements in the Jan 2026 cohort",
    assigneeName: "Sahyadri Trades Institute",
    status: "OPEN",
    dueDate: "2026-10-31",
    notes: "Offer letters or payslips are acceptable evidence.",
    createdAt: "2026-09-18",
  },
  {
    id: "act-012",
    targetType: "COURSE",
    targetId: "c-sewing",
    targetName: "Sewing Machine Operator",
    title: "Review wages offered by partner employers",
    assigneeName: "State skills cell",
    status: "OPEN",
    dueDate: "2026-12-15",
    notes:
      "Low wage is the most common reason trainees in this course leave a job.",
    createdAt: "2026-09-10",
  },
  {
    id: "act-011",
    targetType: "DISTRICT",
    targetId: "solapur",
    targetName: "Solapur",
    title: "Assisted follow-up campaign for unreachable trainees",
    assigneeName: "District officer, Solapur",
    status: "IN_PROGRESS",
    dueDate: "2026-10-20",
    notes: "Use alternate contacts where consent exists.",
    createdAt: "2026-08-28",
  },
  {
    id: "act-009",
    targetType: "COHORT",
    targetId: "2025-10-01",
    targetName: "Oct 2025 cohort",
    title: "Refresher sessions for trainees not placed at W3",
    assigneeName: "State skills cell",
    status: "DONE",
    dueDate: "2026-04-30",
    notes: "Completed in four districts.",
    createdAt: "2026-02-05",
  },
];

export function getActionsForTarget(targetId: string): RemedialAction[] {
  return REMEDIAL_ACTIONS.filter((action) => action.targetId === targetId);
}
