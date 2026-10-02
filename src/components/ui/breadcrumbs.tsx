import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface Breadcrumb {
  label: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: readonly Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-small text-fg-muted">
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-1">
            <Link
              href={item.href}
              className="hover:text-primary hover:underline"
            >
              {item.label}
            </Link>
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </li>
        ))}
      </ol>
    </nav>
  );
}
