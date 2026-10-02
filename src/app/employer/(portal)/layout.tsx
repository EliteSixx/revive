import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CURRENT_EMPLOYER } from "@/mocks/employer-portal";

export default function EmployerPortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AppShell
      portal="employer"
      scopeLabel={CURRENT_EMPLOYER.legalName}
      userName={CURRENT_EMPLOYER.contactName}
    >
      {children}
    </AppShell>
  );
}
