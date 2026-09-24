"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { Search, X, Menu } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("q");
    const query = typeof value === "string" ? value.trim() : "";
    router.push(query ? `/notes?q=${encodeURIComponent(query)}` : "/notes");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-20 max-w-lg translate-y-0 gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-lg"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search notes</DialogTitle>
          <DialogDescription>Search the notes catalogue by keyword.</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={initialQuery}
            placeholder="Search notes, bundles…"
            aria-label="Search query"
            className="h-9 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close search"
            onClick={() => onOpenChange(false)}
          >
            <X aria-hidden="true" className="size-4" />
          </Button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          <p className="px-3 py-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Quick links
          </p>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-foreground transition-colors hover:bg-accent/30"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Search aria-hidden="true" className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{link.label}</span>
                <span className="block truncate text-[10px] text-muted-foreground">
                  {link.href === "/"
                    ? "Browse featured notes and bundles"
                    : `Open ${link.label.toLowerCase()}`}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [search, setSearch] = useQueryState("search", parseAsString);

  if (pathname.startsWith("/admin")) return null;

  const searchOpen = search !== null;

  const openSearch = () => setSearch("1", { history: "push", shallow: true });
  const closeSearch = () => setSearch(null, { history: "replace", shallow: true });

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 glass-panel">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label={`${BRAND.name} home`} className="flex items-center gap-2.5">
          <Logo variant="icon" size="sm" />
          <span className="hidden font-heading text-sm font-bold tracking-tight text-foreground sm:inline-block">
            {BRAND.name}
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                isActive(pathname, link)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent/30 hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search notes"
            aria-expanded={searchOpen}
            className={cn(
              "size-11 rounded-full text-muted-foreground transition-colors",
              searchOpen && "bg-primary/10 text-primary",
            )}
            onClick={openSearch}
          >
            <Search aria-hidden="true" className="size-3.5" />
          </Button>

          <ThemeToggle />

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="size-9 rounded-xl md:hidden"
                />
              }
            >
              <Menu aria-hidden="true" className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(18rem,88vw)] gap-0 p-0">
              <SheetHeader className="border-b px-4 py-3">
                <SheetTitle>
                  <Logo size="sm" />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile navigation" className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2.5">
                {MOBILE_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex min-h-11 items-center rounded-lg px-3 text-sm font-medium",
                      isActive(pathname, link)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent/30",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="border-t p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
                <Link
                  href="/notes"
                  className="flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-center text-xs font-semibold text-primary-foreground"
                >
                  Browse notes
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={(next) => (next ? openSearch() : closeSearch())} />
    </header>
  );
}
