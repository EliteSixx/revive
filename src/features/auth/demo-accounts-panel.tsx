"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ROLE_LABELS } from "@/lib/constants";
import {
  DEMO_STAFF_ACCOUNTS,
  DEMO_STAFF_PASSWORD,
  DEMO_TRAINEE_ACCOUNTS,
  type DemoStaffAccount,
  type DemoTraineeAccount,
} from "./demo-accounts";

interface DemoAccountsPanelProps {
  onChooseTrainee: (account: DemoTraineeAccount) => void;
  onChooseStaff: (account: DemoStaffAccount) => void;
}

/** Prototype accounts for demos. Choosing one fills the form; it never signs in by itself. */
export function DemoAccountsPanel({
  onChooseTrainee,
  onChooseStaff,
}: DemoAccountsPanelProps) {
  return (
    <Card className="mt-10">
      <CardHeader
        title="Prototype accounts"
        description={`Sample accounts for the demo. Choose one to fill the form, then sign in. Every staff account uses the password ${DEMO_STAFF_PASSWORD}.`}
      />
      <ul>
        {DEMO_TRAINEE_ACCOUNTS.map((account) => (
          <AccountRow
            key={account.phone}
            roleLabel={ROLE_LABELS.TRAINEE}
            name={account.displayName}
            identifier={account.phone}
            onChoose={() => onChooseTrainee(account)}
          />
        ))}
        {DEMO_STAFF_ACCOUNTS.map((account) => (
          <AccountRow
            key={account.email}
            roleLabel={ROLE_LABELS[account.role]}
            name={account.displayName}
            identifier={account.email}
            onChoose={() => onChooseStaff(account)}
          />
        ))}
      </ul>
    </Card>
  );
}

interface AccountRowProps {
  roleLabel: string;
  name: string;
  identifier: string;
  onChoose: () => void;
}

function AccountRow({
  roleLabel,
  name,
  identifier,
  onChoose,
}: AccountRowProps) {
  return (
    <li className="flex items-center justify-between gap-3 border-b border-border px-5 py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="font-medium">{roleLabel}</p>
        <p className="truncate text-small text-fg-muted">{identifier}</p>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={onChoose}
        aria-label={`Use the ${roleLabel} account, ${name}`}
      >
        Use
      </Button>
    </li>
  );
}
