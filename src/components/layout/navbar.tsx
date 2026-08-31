"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isPublic) return null;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/40 glass-panel">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Notes Provider home">
            <div className="flex items-center gap-2.5">
              <Logo variant="icon" size="sm" />
              <span className="font-heading text-sm font-bold tracking-tight text-foreground hidden sm:inline-block">
                {BRAND.name}
              </span>
            </div>
          </Link>

          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === "/"
                ? pathname === link.href
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-medium",
                    isActive
                      ? "bg-primary/12 text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search notes (Ctrl+K)"
              className="size-8 rounded-full text-muted-foreground"
              onClick={() => {
                setSearchOpen(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              data-active={searchOpen}
            >
              <Search aria-hidden="true" className="size-3.5" />
              <kbd className="pointer-events-none ml-1 hidden font-sans text-[9px] text-muted-foreground/50 sm:inline">
                ⌘K
              </kbd>
            </Button>

            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </header>

      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-24 bg-background/70 backdrop-blur-sm animate-scale-in"
          onClick={() => {
            setSearchOpen(false);
            inputRef.current?.blur();
          }}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search notes, bundles…"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputRef.current?.value?.trim()) {
                    window.location.href = `/notes?q=${encodeURIComponent(inputRef.current.value.trim())}`;
                  }
                  if (e.key === "Escape") {
                    setSearchOpen(false);
                    inputRef.current?.blur();
                  }
                }}
                className="h-9 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
              />
              <button
                type="button"
                className="rounded-md p-1 text-muted-foreground"
                onClick={() => {
                  setSearchOpen(false);
                  inputRef.current?.blur();
                }}
                aria-label="Close search"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              <div className="px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Quick links
                </p>
              </div>
              {[
                { href: "/notes", label: "All Notes", sublabel: "Browse the full catalogue" },
                { href: "/notes?pricing=free", label: "Free Notes", sublabel: "Start learning at zero cost" },
                { href: "/groups", label: "Bundles", sublabel: "Curated topic packs" },
                { href: "/order/track", label: "Track Order", sublabel: "Find your existing order" },
              ].map(({ href, label, sublabel }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => {
                    setSearchOpen(false);
                    inputRef.current?.blur();
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-foreground"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Search aria-hidden="true" className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">{label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{sublabel}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
