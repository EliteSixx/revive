import Link from "next/link";
import { cn } from "@/lib/cn";

/** Logotype from design.md section 9: square mark plus the word "Revive". */
export function Logo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2 text-fg", className)}
    >
      <svg viewBox="0 0 32 32" className="size-6 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="4" fill="#1F4E8C" />
        <polyline
          points="7,22 13,16 18,19 25,10"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-h3 tracking-tight">Revive</span>
    </Link>
  );
}
