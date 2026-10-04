import type { ReactNode } from "react";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/cn";

type Severity = "high" | "medium" | "low";

interface AttentionCardProps {
  title: string;
  severity: Severity;
  action?: ReactNode;
  className?: string;
}

const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; icon: typeof AlertTriangle; wrapperClass: string; iconClass: string }
> = {
  high: {
    label: "High",
    icon: AlertCircle,
    wrapperClass: "border-danger-subtle bg-danger-subtle",
    iconClass: "text-danger",
  },
  medium: {
    label: "Medium",
    icon: AlertTriangle,
    wrapperClass: "border-warning-subtle bg-warning-subtle",
    iconClass: "text-warning",
  },
  low: {
    label: "Low",
    icon: Info,
    wrapperClass: "border-info-subtle bg-info-subtle",
    iconClass: "text-primary",
  },
};

/**
 * One-line card in the "Needs attention" list.
 * Severity is shown as a text badge plus icon so colour is never the only signal (design principle 4).
 */
export function AttentionCard({ title, severity, action, className }: AttentionCardProps) {
  const cfg = SEVERITY_CONFIG[severity];
  const Icon = cfg.icon;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-md border px-4 py-3",
        cfg.wrapperClass,
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Icon className={cn("size-4 shrink-0", cfg.iconClass)} aria-hidden="true" />
        <span className="text-small text-fg">{title}</span>
        <span className={cn("rounded-sm px-1.5 py-0.5 text-label", cfg.iconClass, "border border-current bg-white/60")}>
          {cfg.label}
        </span>
      </div>
      {action}
    </div>
  );
}
