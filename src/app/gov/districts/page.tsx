import { redirect } from "next/navigation";

// Redirect /gov/districts to /gov/outcomes?tab=districts (IA consolidation).
export default function GovDistrictsRedirect() {
  redirect("/gov/outcomes?tab=districts");
}
