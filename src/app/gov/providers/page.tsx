import { redirect } from "next/navigation";

// Redirect /gov/providers to /gov/outcomes?tab=providers (IA consolidation).
export default function GovProvidersRedirect() {
  redirect("/gov/outcomes?tab=providers");
}
