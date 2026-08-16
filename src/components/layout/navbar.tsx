"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/notes", label: "Notes" },
  { href: "/groups", label: "Bundles" },
  { href: "/order/track", label: "Track Order" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const isPublic = !pathname.startsWith("/admin");

  if (!isPublic) return null;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Logo variant="icon" size="sm" />
          <span className="font-heading text-sm font-bold tracking-tight text-foreground">
            {BRAND.name}
          </span>
        </div>

        <nav aria-label="Primary navigation" className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            render={<Link href="/notes" />}
            variant="ghost"
            size="icon"
            aria-label="Search notes"
            className="size-7 rounded-full"
          >
            <Search aria-hidden="true" className="size-3.5" />
          </Button>

          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
