import { LogOut } from "lucide-react";
import Link from "next/link";

// Phase 1 has no sessions, so signing out only returns to the sign-in page.
export function SignOutLink() {
  return (
    <Link
      href="/login"
      className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-small text-fg-muted hover:bg-surface-muted hover:text-fg"
    >
      <LogOut className="size-4" aria-hidden="true" />
      Sign out
    </Link>
  );
}
