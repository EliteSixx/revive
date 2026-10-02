"use client";

import { RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { resetAllMockStores } from "@/mocks/client-store";

/** Undoes every change made to sample data in this browser tab, for demos. */
export function ResetSampleDataButton() {
  const { showToast } = useToast();

  return (
    <button
      type="button"
      onClick={() => {
        resetAllMockStores();
        showToast("success", "Sample data has been reset.");
      }}
      className="inline-flex shrink-0 items-center gap-1 rounded-sm font-medium text-primary hover:underline"
    >
      <RotateCcw className="size-3.5" aria-hidden="true" />
      Reset sample data
    </button>
  );
}
