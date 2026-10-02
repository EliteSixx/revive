import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";

export default function GovLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      portal="gov"
      scopeLabel="State view: all districts"
      userName="State admin (sample)"
    >
      {children}
    </AppShell>
  );
}
