"use client";

import Link from "next/link";
import { Search, X, Menu } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRef, useCallback, useEffect } from "react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { BRAND, NAV_LINKS, MOBILE_NAV_LINKS } from "@/lib/constants";

function isActive(pathname: string, link: { href: string }): boolean {
  if (link.href === "/") return pathname === link.href;
  return pathname.startsWith(link.href);
}

function SearchPanel({ searchParams, onClose }: { searchParams: URLSearchParams; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const closePanel = useCallback(() => {
    onClose();
    inputRef.current?.blur();
  }, [onClose]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") closePanel();
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      closePanel();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleKeyDown, handleClickOutside]);

  const searchParam = searchParams.get("search") || "";

  return (
    <>
      <div className="fixed inset-0 z-60 bg-background/70 backdrop-blur-sm animate-scale-in" aria-hidden="true" onClick={closePanel} />
      <div className="fixed inset-0 z-60 flex items-start justify-center pt-24">
        <div ref={panelRef} className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl paper-card">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
            <Input
              ref={inputRef}
              defaultValue={searchParam}
              placeholder="Search notes, bundles…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputRef.current?.value?.trim()) {
                  const query = inputRef.current.value.trim();
                  window.location.href = `/notes?q=${encodeURIComponent(query)}`;
                }
              }}
              className="h-9 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
            />
            <button type="button" className="rounded-md p-1 text-muted-foreground" onClick={closePanel} aria-label="Close search">
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            <div className="px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Quick links</p>
            </div>
            {[
              { href: "/notes", label: "All Notes", sublabel: "Browse the full catalogue" },
              { href: "/notes?pricing=free", label: "Free Notes", sublabel: "Start learning at zero cost" },
              ...NAV_LINKS.map((l) => ({ href: l.href, label: l.label, sublabel: "" })),
            ].map(({ href, label, sublabel }) => (
              <Link key={href} href={href} onClick={closePanel} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-foreground hover:bg-accent/30 transition-colors">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Search aria-hidden="true" className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{label}</p>
                  {sublabel && <p className="text-[10px] text-muted-foreground truncate">{sublabel}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function SearchTrigger({ searchParams }: { searchParams: URLSearchParams }) {
  const isOpen = searchParams.has("search");

  return (
    <>
      {isOpen && <SearchPanel searchParams={searchParams} onClose={() => { const url = new URL(window.location.href); url.searchParams.delete("search"); window.history.replaceState({}, "", url.toString()); }} />}
      <Button variant="ghost" size="icon" aria-label="Search notes" className={cn("size-8 rounded-full text-muted-foreground transition-colors", isOpen && "text-primary bg-primary/10")} onClick={() => { const url = new URL(window.location.href); url.searchParams.set("search", "open"); window.history.pushState({}, "", url.toString()); }}>
        <Search aria-hidden="true" className="size-3.5" />
        <kbd className="pointer-events-none ml-1 hidden font-sans text-[9px] text-muted-foreground/50 sm:inline">⌘K</kbd>
      </Button>
    </>
  );
}

function SearchWrapper() {
  const searchParams = useSearchParams();
  return <SearchTrigger searchParams={searchParams} />;
}

function NavLinks({ links }: { links: typeof NAV_LINKS }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className={cn("rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors", isActive(pathname, link) ? "bg-primary/12 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-accent/30")}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function MobileNavigation() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open navigation menu" className="size-7 md:hidden" />}>
        <Menu aria-hidden="true" className="size-4" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(18rem,88vw)] p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle><Logo size="sm" /></SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile navigation" className="flex flex-1 flex-col gap-0.5 p-2.5">
          {MOBILE_NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={cn("rounded-lg px-3 py-2 text-sm font-medium", isActive(pathname, link) ? "bg-primary/12 text-primary" : "text-muted-foreground hover:bg-accent/30")}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-2.5">
          <Link href="/notes" className="block rounded-xl bg-primary px-4 py-2 text-center text-xs font-semibold text-primary-foreground">Browse notes</Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isPublic = !pathname.startsWith("/admin");

  if (!isPublic) return null;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/30 glass-panel torn-edge">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Notes Provider home" className="flex items-center gap-2.5">
            <Logo variant="icon" size="sm" />
            <span className="font-heading text-sm font-bold tracking-tight text-foreground hidden sm:inline-block">{BRAND.name}</span>
          </Link>
          <NavLinks links={NAV_LINKS} />
          <div className="flex items-center gap-1.5">
            <SearchWrapper />
            <ThemeToggle />
            <MobileNavigation />
          </div>
        </div>
      </header>
    </>
  );
}