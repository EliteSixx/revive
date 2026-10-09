import Link from "next/link";

const FOOTER_LINKS = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms and conditions", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Contact", href: "/contact" },
] as const;

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-small text-fg-muted hover:text-primary hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-6 max-w-3xl text-small text-fg-muted">
          Revive. Skilling outcomes and impact measurement.
        </p>
      </div>
    </footer>
  );
}
