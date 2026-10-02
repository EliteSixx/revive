import type { ReactNode } from "react";
import { TraineeShell } from "@/components/layout/trainee-shell";

export default function TraineeLayout({ children }: { children: ReactNode }) {
  return <TraineeShell>{children}</TraineeShell>;
}
