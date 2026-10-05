import type { Metadata } from "next";
import GovOverviewClient from "./overview-client";

export const metadata: Metadata = { title: "Overview | Revive" };

export default function GovOverviewPage() {
  return <GovOverviewClient />;
}
