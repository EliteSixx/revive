"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  findActiveNavHref,
  NAVIGATION,
  PORTAL_NAMES,
  type Portal,
} from "@/lib/navigation";

interface PortalNavProps {
  portal: Portal;
  orientation?: "vertical" | "horizontal";
  onNavigate?: () => void;
}

export function PortalNav({
  portal,
  orientation = "vertical",
  onNavigate,
}: PortalNavProps) {
  const pathname = usePathname();
  const items = NAVIGATION[portal];
  const activeHref = findActiveNavHref(items, pathname);

  return (
    <nav aria-label={`${PORTAL_NAMES[portal]} navigation`}>
      <ul
        className={cn(
          "flex gap-1",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
        )}
      >
        {items.map((item) => {
          const isActive = item.href === activeHref;
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2 transition-colors duration-150",
                  isActive
                    ? "bg-primary-subtle font-medium text-primary"
                    : "text-fg-muted hover:bg-surface-muted hover:text-fg",
                )}
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
