import type { Metadata } from "next";
import GovSkillGapsClient from "./skill-gaps-client";

export const metadata: Metadata = { title: "Skill gaps and reasons | Revive" };

export default function GovSkillGapsPage() {
  return <GovSkillGapsClient />;
}
