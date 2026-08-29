import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { GithubIcon, XIcon, InstagramIcon, YouTubeIcon } from "@/components/shared/social-icons";
import { BRAND, SEO } from "@/lib/constants";

const FOOTER_LINKS = [
  {
    title: "Explore",
    links: [
      { href: "/notes", label: "All Notes" },
      { href: "/groups", label: "Bundles" },
      { href: "/notes?pricing=free", label: "Free Notes" },
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/order/track", label: "Track Order" },
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

const SOCIAL_LINKS = [
  { label: "X", href: "https://x.com/Mantu_kumar91", Icon: XIcon },
  { label: "GitHub", href: "https://github.com/Mantu01", Icon: GithubIcon },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCgkZ2cdrKLz7dhnXnkDOAgQ", Icon: YouTubeIcon },
  { label: "Instagram", href: "https://www.instagram.com/programmer_area", Icon: InstagramIcon },
  { label: "Email", href: `mailto:${SEO.contactEmail}`, Icon: Mail },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/10">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand column */}
          <div className="space-y-4 sm:col-span-2">
            <Logo size="sm" />
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              {BRAND.tagline}
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  aria-label={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="inline-flex size-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <Icon aria-hidden="true" className="size-3" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((column) => (
            <div key={column.title}>
              <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-foreground">
                {column.title}
              </h2>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-center text-[10px] text-muted-foreground">
            &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-[10px] text-muted-foreground">
            Built with care for developers who want notes that ship.
          </p>
        </div>
      </div>
    </footer>
  );
}
