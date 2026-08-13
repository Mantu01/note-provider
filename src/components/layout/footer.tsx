import Link from "next/link";
import { Camera, MessageCircle, Send } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { BRAND } from "@/lib/constants";

const FOOTER_COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/notes", label: "Notes Catalogue" },
      { href: "/groups", label: "Note Bundles" },
      { href: "/notes?pricing=free", label: "Free Notes" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact Support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/refund-policy", label: "Refund Policy" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {BRAND.tagline}
          </p>
          <div className="flex items-center gap-3 text-muted-foreground">
            <a
              aria-label="Instagram"
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg border bg-card transition-colors hover:text-primary hover:border-primary/40"
            >
              <Camera aria-hidden="true" className="size-4" />
            </a>
            <a
              aria-label="WhatsApp"
              href="https://wa.me"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg border bg-card transition-colors hover:text-primary hover:border-primary/40"
            >
              <MessageCircle aria-hidden="true" className="size-4" />
            </a>
            <a
              aria-label="Telegram"
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg border bg-card transition-colors hover:text-primary hover:border-primary/40"
            >
              <Send aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
              {column.title}
            </h2>
            <ul className="space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
