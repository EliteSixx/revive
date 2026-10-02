import {
  CircleCheck,
  CircleDot,
  FileCheck,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { VERIFICATION_LEVEL_LABELS } from "@/lib/constants";
import type { VerificationLevel } from "@/types/domain";

const LEVEL_STYLE: Record<
  VerificationLevel,
  { tone: BadgeTone; Icon: typeof CircleCheck }
> = {
  EPFO_VERIFIED: { tone: "success", Icon: ShieldCheck },
  EMPLOYER_CONFIRMED: { tone: "success", Icon: CircleCheck },
  EVIDENCE_ATTACHED: { tone: "info", Icon: FileCheck },
  PROVIDER_REPORTED: { tone: "warning", Icon: CircleDot },
  SELF_REPORTED: { tone: "neutral", Icon: UserRound },
};

/** Always shows the level as text; colour is never the only signal. */
export function VerificationBadge({ level }: { level: VerificationLevel }) {
  const { tone, Icon } = LEVEL_STYLE[level];
  return (
    <Badge tone={tone}>
      <Icon aria-hidden="true" />
      {VERIFICATION_LEVEL_LABELS[level]}
    </Badge>
  );
}
