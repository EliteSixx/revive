"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { signOut } from "@/features/auth/mock-api";

/** Ends the prototype session and returns to the sign-in page. */
export function SignOutLink() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    const result = await signOut();
    setIsSigningOut(false);
    if (!result.ok) {
      showToast("error", result.error);
      return;
    }
    showToast("success", "You have signed out.");
    router.push("/login");
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-small text-fg-muted hover:bg-surface-muted hover:text-fg disabled:opacity-50"
    >
      <LogOut className="size-4" aria-hidden="true" />
      Sign out
    </button>
  );
}
