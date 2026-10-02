import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";

export default function AgentLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      portal="agent"
      scopeLabel="All districts"
      userName="Desk agent 2 (sample)"
    >
      {children}
    </AppShell>
  );
}
