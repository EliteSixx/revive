import { Badge, type BadgeTone } from "@/components/ui/badge";
import {
  FOLLOW_UP_STATUS_LABELS,
  REMEDIAL_ACTION_STATUS_LABELS,
  VERIFICATION_REQUEST_STATUS_LABELS,
} from "@/lib/constants";
import type {
  FollowUpStatus,
  RemedialActionStatus,
  VerificationRequestStatus,
} from "@/types/domain";

const FOLLOW_UP_TONES: Record<FollowUpStatus, BadgeTone> = {
  SCHEDULED: "neutral",
  SENT: "info",
  RESPONDED: "success",
  ESCALATED: "warning",
  UNREACHABLE: "danger",
  CLOSED: "neutral",
};

const ACTION_TONES: Record<RemedialActionStatus, BadgeTone> = {
  OPEN: "warning",
  IN_PROGRESS: "info",
  DONE: "success",
  DROPPED: "neutral",
};

const REQUEST_TONES: Record<VerificationRequestStatus, BadgeTone> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CORRECTED: "info",
  REJECTED: "danger",
};

export function FollowUpStatusBadge({ status }: { status: FollowUpStatus }) {
  return (
    <Badge tone={FOLLOW_UP_TONES[status]}>
      {FOLLOW_UP_STATUS_LABELS[status]}
    </Badge>
  );
}

export function ActionStatusBadge({
  status,
}: {
  status: RemedialActionStatus;
}) {
  return (
    <Badge tone={ACTION_TONES[status]}>
      {REMEDIAL_ACTION_STATUS_LABELS[status]}
    </Badge>
  );
}

export function VerificationRequestBadge({
  status,
}: {
  status: VerificationRequestStatus;
}) {
  return (
    <Badge tone={REQUEST_TONES[status]}>
      {VERIFICATION_REQUEST_STATUS_LABELS[status]}
    </Badge>
  );
}
