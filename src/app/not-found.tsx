import Link from "next/link";
import { PublicFrame } from "@/components/layout/public-frame";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <PublicFrame>
      <div className="mx-auto max-w-[720px] px-4 py-16">
        <p className="text-label text-fg-muted">Error 404</p>
        <h1 className="mt-2 text-h1">Page not found</h1>
        <p className="mt-3 text-fg-muted">
          The address may be wrong, or the page may have moved. Check the
          address or go back to the home page.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Go to home page</Link>
        </Button>
      </div>
    </PublicFrame>
  );
}
