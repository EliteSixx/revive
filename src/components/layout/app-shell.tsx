import type { ReactNode } from "react";
// Phase 1 only: every portal shows sample data. Remove when real data is connected.
import { SampleDataNotice } from "@/components/domain/sample-data-notice";
import { PORTAL_NAMES, type Portal } from "@/lib/navigation";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { PortalNav } from "./portal-nav";
import { SignOutLink } from "./sign-out-link";
import { SkipLink } from "./skip-link";

interface AppShellProps {
  portal: Exclude<Portal, "trainee">;
  /** Whose data this user can see, e.g. "All districts" or a provider name. */
  scopeLabel: string;
  userName: string;
  children: ReactNode;
}

/** Staff portal layout: top bar plus a 240px sidebar that collapses below 1024px. */
export function AppShell({
  portal,
  scopeLabel,
  userName,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-page">
      <SkipLink />
      <header className="relative border-b border-border bg-surface">
        <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
          <div className="lg:hidden">
            <MobileNav portal={portal} />
          </div>
          <Logo href={`/${portal}`} />
          <span
            className="hidden h-5 w-px bg-border sm:block"
            aria-hidden="true"
          />
          <span className="hidden font-medium sm:inline">
            {PORTAL_NAMES[portal]}
          </span>
          <span className="hidden text-small text-fg-muted md:inline">
            {scopeLabel}
          </span>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-small text-fg-muted sm:inline">
              {userName}
            </span>
            <SignOutLink />
          </div>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden w-60 shrink-0 border-r border-border bg-surface p-3 lg:block">
          <PortalNav portal={portal} />
        </aside>
        <main id="main" className="min-w-0 flex-1 px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SampleDataNotice />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
