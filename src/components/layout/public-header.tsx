import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

const PUBLIC_LINKS = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Privacy", href: "/privacy" },
  { label: "Contact", href: "/contact" },
] as const;

export function PublicHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-4">
          <ul className="hidden items-center gap-6 sm:flex">
            {PUBLIC_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-fg-muted hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
