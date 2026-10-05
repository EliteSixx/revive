import type { Metadata } from "next";
import GovSettingsClient from "./settings-client";

export const metadata: Metadata = { title: "Settings | Revive" };

export default function GovSettingsPage() {
  return <GovSettingsClient />;
}
