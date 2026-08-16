import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { XIcon, YouTubeIcon } from "@/components/shared/social-icons";
import { BRAND, SEO } from "@/lib/constants";

const FOOTER_LINKS = [
  {
    title: "Explore",
    links: [
      { href: "/notes", label: "All Notes" },
      { href: "/groups", label: "Bundles" },
      { href: "/notes?pricing=free", label: "Free Notes" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/refund-policy", label: "Refunds" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 sm:col-span-2">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {BRAND.tagline}
            </p>
            <div className="flex items-center gap-2">
              <a
                aria-label="X"
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground"
              >
                <XIcon aria-hidden="true" className="size-3.5" />
              </a>
              <a
                aria-label="YouTube"
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground"
              >
                <YouTubeIcon aria-hidden="true" className="size-3.5" />
              </a>
              <a
                aria-label="Email"
                href={`mailto:${SEO.contactEmail}`}
                className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground"
              >
                <Mail aria-hidden="true" className="size-3.5" />
              </a>
            </div>
          </div>

          {FOOTER_LINKS.map((column) => (
            <div key={column.title}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground">
                {column.title}
              </h2>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
