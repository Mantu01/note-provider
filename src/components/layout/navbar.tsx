"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/notes", label: "Notes" },
  { href: "/groups", label: "Bundles" },
  { href: "/order/track", label: "Track Order" },
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Primary navigation" className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span className={cn("rounded-full px-2.5 py-1.5", isActive && "bg-primary/10")}>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button render={<Link href="/notes" />} variant="ghost" size="icon" aria-label="Search notes" className="hidden sm:inline-flex border border-border/80 bg-card/80">
            <Search aria-hidden="true" className="size-4" />
          </Button>

          <ThemeToggle />

          <Button render={<Link href="/notes" />} className="hidden rounded-xl bg-primary text-primary-foreground md:inline-flex">
            Browse Notes
          </Button>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
