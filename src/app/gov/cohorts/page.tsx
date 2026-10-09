import { redirect } from "next/navigation";

// Redirect /gov/cohorts to /gov/outcomes?tab=cohorts (IA consolidation).
export default function GovCohortsRedirect() {
  redirect("/gov/outcomes?tab=cohorts");
}
