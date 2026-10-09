import type { Metadata } from "next";
import GovDataQualityClient from "./data-quality-client";

export const metadata: Metadata = {
  title: "Data quality and definitions | Revive",
};

export default function GovDataQualityPage() {
  return <GovDataQualityClient />;
}
