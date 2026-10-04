"use client";

import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useGovScope } from "@/features/gov/gov-session";

export default function GovLayout({ children }: { children: ReactNode }) {
  const scope = useGovScope();
  // DISTRICT_OFFICER gets a sidebar without Settings and Districts tab.
  const portal = scope.role === "DISTRICT_OFFICER" ? "gov-district" : "gov";

  return (
    <AppShell
      portal={portal}
      scopeLabel={scope.scopeLabel}
      userName={scope.displayName}
    >
      {children}
    </AppShell>
  );
}
