import type { Metadata } from "next";
import { Suspense } from "react";
import GovOutcomesClient from "./outcomes-client";

export const metadata: Metadata = { title: "Outcomes | Revive" };

export default function GovOutcomesPage() {
  return (
    <Suspense fallback={null}>
      <GovOutcomesClient />
    </Suspense>
  );
}
