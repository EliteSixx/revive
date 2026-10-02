import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CURRENT_PROVIDER } from "@/mocks/batches";

export default function ProviderLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      portal="provider"
      scopeLabel={CURRENT_PROVIDER.name}
      userName="Centre manager (sample)"
    >
      {children}
    </AppShell>
  );
}
