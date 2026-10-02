import type {
  AttemptResult,
  FollowUpAttempt,
  FollowUpStatus,
  FollowUpWindow,
} from "@/types/domain";

// Sample follow-up desk queue: trainees who did not answer automated follow-ups.

export interface AgentQueueItem {
  taskId: string;
  traineeId: string;
  traineeName: string;
  districtName: string;
  courseName: string;
  window: FollowUpWindow;
  opensAt: string;
  closesAt: string;
  attemptCount: number;
  lastResult: AttemptResult | null;
  status: FollowUpStatus;
  primaryPhone: string;
  hasAlternateConsent: boolean;
  alternatePhone: string | null;
}

export const AGENT_QUEUE: readonly AgentQueueItem[] = [
  {
    taskId: "task-1041",
    traineeId: "RV-2026-003310",
    traineeName: "Sachin Jadhav",
    districtName: "Pune",
    courseName: "Automotive Service Technician",
    window: "W3",
    opensAt: "2026-09-12",
    closesAt: "2026-10-12",
    attemptCount: 3,
    lastResult: "NO_ANSWER",
    status: "ESCALATED",
    primaryPhone: "90000 •••18",
    hasAlternateConsent: true,
    alternatePhone: "90000 •••52",
  },
  {
    taskId: "task-1042",
    traineeId: "RV-2026-002875",
    traineeName: "Komal Shinde",
    districtName: "Nashik",
    courseName: "Warehouse Associate",
    window: "W3",
    opensAt: "2026-09-14",
    closesAt: "2026-10-14",
    attemptCount: 2,
    lastResult: "SWITCHED_OFF",
    status: "ESCALATED",
    primaryPhone: "90000 •••63",
    hasAlternateConsent: false,
    alternatePhone: null,
  },
  {
    taskId: "task-1043",
    traineeId: "RV-2025-009914",
    traineeName: "Ganesh Pawar",
    districtName: "Solapur",
    courseName: "Sewing Machine Operator",
    window: "W6",
    opensAt: "2026-09-03",
    closesAt: "2026-10-03",
    attemptCount: 4,
    lastResult: "WRONG_NUMBER",
    status: "ESCALATED",
    primaryPhone: "90000 •••07",
    hasAlternateConsent: true,
    alternatePhone: "90000 •••29",
  },
  {
    taskId: "task-1044",
    traineeId: "RV-2026-001502",
    traineeName: "Rutuja Kale",
    districtName: "Kolhapur",
    courseName: "Assistant Electrician",
    window: "W3",
    opensAt: "2026-09-20",
    closesAt: "2026-10-20",
    attemptCount: 1,
    lastResult: "CALLBACK_REQUESTED",
    status: "ESCALATED",
    primaryPhone: "90000 •••74",
    hasAlternateConsent: false,
    alternatePhone: null,
  },
  {
    taskId: "task-1045",
    traineeId: "RV-2025-008733",
    traineeName: "Vikas More",
    districtName: "Nagpur",
    courseName: "General Duty Assistant",
    window: "W12",
    opensAt: "2026-09-08",
    closesAt: "2026-10-08",
    attemptCount: 2,
    lastResult: "NO_ANSWER",
    status: "ESCALATED",
    primaryPhone: "90000 •••35",
    hasAlternateConsent: true,
    alternatePhone: "90000 •••96",
  },
  {
    taskId: "task-1046",
    traineeId: "RV-2026-004002",
    traineeName: "Neha Gaikwad",
    districtName: "Mumbai Suburban",
    courseName: "Retail Sales Associate",
    window: "W3",
    opensAt: "2026-09-24",
    closesAt: "2026-10-24",
    attemptCount: 0,
    lastResult: null,
    status: "ESCALATED",
    primaryPhone: "90000 •••58",
    hasAlternateConsent: false,
    alternatePhone: null,
  },
  {
    taskId: "task-1047",
    traineeId: "RV-2025-007126",
    traineeName: "Akash Deshmukh",
    districtName: "Chhatrapati Sambhajinagar",
    courseName: "Automotive Service Technician",
    window: "W6",
    opensAt: "2026-09-01",
    closesAt: "2026-10-01",
    attemptCount: 5,
    lastResult: "WRONG_NUMBER",
    status: "UNREACHABLE",
    primaryPhone: "90000 •••81",
    hasAlternateConsent: false,
    alternatePhone: null,
  },
];

export const AGENT_ATTEMPTS: Record<string, readonly FollowUpAttempt[]> = {
  "task-1041": [
    {
      id: "att-1",
      taskId: "task-1041",
      channel: "SMS",
      result: "NO_ANSWER",
      agentName: null,
      notes: "Follow-up link sent. No response.",
      at: "2026-09-12T10:00:00Z",
    },
    {
      id: "att-2",
      taskId: "task-1041",
      channel: "IVR",
      result: "NO_ANSWER",
      agentName: null,
      notes: "Automated call not answered.",
      at: "2026-09-19T12:30:00Z",
    },
    {
      id: "att-3",
      taskId: "task-1041",
      channel: "AGENT_CALL",
      result: "NO_ANSWER",
      agentName: "Desk agent 2",
      notes: "Rang out twice.",
      at: "2026-09-23T15:10:00Z",
    },
  ],
};

export function findQueueItem(taskId: string): AgentQueueItem | undefined {
  return AGENT_QUEUE.find((item) => item.taskId === taskId);
}
