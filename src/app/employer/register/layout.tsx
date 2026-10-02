import type { ReactNode } from "react";
import { PublicFrame } from "@/components/layout/public-frame";

// Registration happens before an employer has an account, so it uses the public frame.
export default function EmployerRegisterLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <PublicFrame>{children}</PublicFrame>;
}
