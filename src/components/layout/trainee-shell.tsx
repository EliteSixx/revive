import type { ReactNode } from "react";
// Phase 1 only: every portal shows sample data. Remove when real data is connected.
import { SampleDataNotice } from "@/components/domain/sample-data-notice";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { PortalNav } from "./portal-nav";
import { SignOutLink } from "./sign-out-link";
import { SkipLink } from "./skip-link";

/** Trainee layout: mobile-first single column, 720px max width (design.md section 5). */
export function TraineeShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-page text-body-lg">
      <SkipLink />
      <header className="relative border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-[720px] items-center gap-3 px-4">
          <Logo href="/trainee" />
          <div className="ml-auto flex items-center gap-1">
            <SignOutLink />
            <div className="md:hidden">
              <MobileNav portal="trainee" />
            </div>
          </div>
        </div>
        <div className="mx-auto hidden max-w-[720px] px-4 pb-2 md:block">
          <PortalNav portal="trainee" orientation="horizontal" />
        </div>
      </header>
      <main id="main" className="mx-auto max-w-[720px] px-4 py-6">
        <SampleDataNotice />
        {children}
      </main>
    </div>
  );
}
