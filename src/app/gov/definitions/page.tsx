import { redirect } from "next/navigation";

// Redirect /gov/definitions to /gov/data-quality (IA consolidation).
export default function GovDefinitionsRedirect() {
  redirect("/gov/data-quality");
}
