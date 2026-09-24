import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { GithubIcon, XIcon, InstagramIcon, YouTubeIcon } from "@/components/shared/social-icons";
import { BRAND, SEO, CURRENT_YEAR } from "@/lib/constants";

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

type SocialLink = (typeof SOCIAL_LINKS)[number];

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border/40 bg-card pb-16 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-8 lg:grid-cols-6">
          <div className="col-span-2 space-y-4">
            <Logo size="sm" />
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              {BRAND.tagline}
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => {
                const external = href.startsWith("http");
                return (
                  <a
                    key={label}
                    aria-label={label}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:text-primary sm:size-10"
                  >
                    <Icon aria-hidden="true" className="size-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {FOOTER_LINKS.map((column) => (
            <div key={column.title}>
              <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-accent">
                {column.title}
              </h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-9 items-center text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/40 pt-6 sm:flex-row">
          <p className="text-center text-[10px] text-muted-foreground">
            &copy; {CURRENT_YEAR} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-[10px] text-muted-foreground">
            Built with care for developers who want notes that ship.
          </p>
        </div>
      </div>
    </footer>
  );
}
