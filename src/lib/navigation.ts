import {
  Activity,
  BookOpen,
  Briefcase,
  Building2,
  ChartColumn,
  ClipboardCheck,
  ClipboardList,
  Database,
  FileUp,
  Inbox,
  Layers,
  LayoutDashboard,
  ListChecks,
  MapPin,
  MessageSquareWarning,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

export type Portal = "trainee" | "agent" | "provider" | "employer" | "gov";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const PORTAL_NAMES: Record<Portal, string> = {
  trainee: "Trainee",
  agent: "Follow-up desk",
  provider: "Training provider",
  employer: "Employer",
  gov: "Government",
};

export const NAVIGATION: Record<Portal, readonly NavItem[]> = {
  trainee: [
    { label: "Home", href: "/trainee", icon: LayoutDashboard },
    {
      label: "Report a change",
      href: "/trainee/outcomes/new",
      icon: Briefcase,
    },
    { label: "Consent", href: "/trainee/consent", icon: ShieldCheck },
    { label: "Profile", href: "/trainee/profile", icon: UserRound },
  ],
  agent: [{ label: "Work queue", href: "/agent", icon: Inbox }],
  provider: [
    { label: "Scorecard", href: "/provider", icon: LayoutDashboard },
    { label: "Batches", href: "/provider/batches", icon: Layers },
    { label: "Upload roster", href: "/provider/batches/upload", icon: FileUp },
    {
      label: "Record placement",
      href: "/provider/placements/new",
      icon: Briefcase,
    },
    { label: "Actions", href: "/provider/actions", icon: ListChecks },
  ],
  employer: [
    { label: "Dashboard", href: "/employer", icon: LayoutDashboard },
    {
      label: "Verifications",
      href: "/employer/verifications",
      icon: ClipboardCheck,
    },
    { label: "Hires", href: "/employer/hires", icon: Users },
    {
      label: "Skill feedback",
      href: "/employer/feedback",
      icon: MessageSquareWarning,
    },
  ],
  gov: [
    { label: "Overview", href: "/gov", icon: LayoutDashboard },
    { label: "Cohorts", href: "/gov/cohorts", icon: Activity },
    { label: "Providers", href: "/gov/providers", icon: Building2 },
    { label: "Districts", href: "/gov/districts", icon: MapPin },
    { label: "Demographics", href: "/gov/demographics", icon: Users },
    { label: "Skill gaps", href: "/gov/skill-gaps", icon: ChartColumn },
    { label: "Data quality", href: "/gov/data-quality", icon: Database },
    { label: "Actions", href: "/gov/actions", icon: ClipboardList },
    { label: "Definitions", href: "/gov/definitions", icon: BookOpen },
    { label: "Settings", href: "/gov/settings", icon: Settings },
  ],
};

/**
 * Returns the href of the nav item that best matches the current path, so that
 * "/provider/batches/upload" highlights "Upload roster" and not also "Batches".
 */
export function findActiveNavHref(
  items: readonly NavItem[],
  pathname: string,
): string | null {
  const matches = items.filter(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  if (matches.length === 0) return null;
  return matches.reduce((best, item) =>
    item.href.length > best.href.length ? item : best,
  ).href;
}
