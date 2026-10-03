"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import type { Session } from "./session";

/** Confirms the sign-in and opens the portal for the signed-in role. */
export function useCompleteSignIn() {
  const router = useRouter();
  const { showToast } = useToast();

  return (session: Session) => {
    showToast("success", `Signed in as ${session.displayName}.`);
    router.push(session.portalPath);
  };
}
