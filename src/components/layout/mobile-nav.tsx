"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { Portal } from "@/lib/navigation";
import { PortalNav } from "./portal-nav";

export function MobileNav({ portal }: { portal: Portal }) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = isOpen ? X : Menu;

  return (
    <>
      <button
        type="button"
        className="rounded-sm p-2 text-fg hover:bg-surface-muted"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Icon className="size-5" aria-hidden="true" />
      </button>
      {isOpen && (
        <div
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-full z-30 border-b border-border bg-surface p-3 shadow-overlay"
        >
          <PortalNav portal={portal} onNavigate={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
