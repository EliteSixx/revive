import type { Metadata } from "next";
import GovActionsClient from "./actions-client";

export const metadata: Metadata = { title: "Remedial actions | Revive" };

export default function GovActionsPage() {
  return <GovActionsClient />;
}
