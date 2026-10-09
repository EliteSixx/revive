import { redirect } from "next/navigation";

// Redirect /gov/demographics to /gov/outcomes?tab=demographics (IA consolidation).
export default function GovDemographicsRedirect() {
  redirect("/gov/outcomes?tab=demographics");
}
