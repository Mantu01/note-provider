"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  Layers3,
  LogOut,
  Menu,
  ReceiptText,
  Shield,
  ShieldCheck,
  Tags,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAdminLogout, useAdminProfile } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/notes", label: "Notes Catalogue", icon: BookOpen },
  { href: "/admin/groups", label: "Bundles", icon: Layers3 },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ReceiptText },
] as const;

function isActiveLink(pathname: string, href: string) {
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAdminLogout();
  const { data: profile } = useAdminProfile();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        toast.success("Signed out");
        router.push("/");
      },
    });
  };

  const roleBadge = profile ? (
    profile.isHead ? (
      <Badge className="border-brand-emerald/20 bg-brand-emerald-soft px-1.5 text-[10px] text-brand-emerald-foreground">
        <ShieldCheck aria-hidden="true" className="size-3" />
        Head Admin
      </Badge>
    ) : (
      <Badge variant="outline" className="px-1.5 text-[10px]">
        <Shield aria-hidden="true" className="size-3" />
        Admin
      </Badge>
    )
  ) : null;

  const navList = (onNavigate?: () => void) =>
    NAV_ITEMS.map(({ href, label, icon: Icon }) => (
      <Link
        key={href}
        href={href}
        onClick={onNavigate}
        aria-current={isActiveLink(pathname, href) ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
          isActiveLink(pathname, href)
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
        )}
      >
        <Icon aria-hidden="true" className="size-4 shrink-0" />
        {label}
      </Link>
    ));

  return (
    <div className="min-h-screen bg-background lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-14 items-center border-b border-border/60 px-4">
          <Link href="/admin" aria-label="Admin dashboard home">
            <Logo size="sm" />
          </Link>
        </div>

        {profile && (
          <div className="mx-3 mt-4 rounded-xl border border-border/60 bg-muted/30 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-bold text-foreground">{profile.name}</span>
              {roleBadge}
            </div>
            <p className="mt-1 truncate text-[10px] text-muted-foreground">{profile.email}</p>
          </div>
        )}

        <nav aria-label="Admin navigation" className="mt-4 flex flex-1 flex-col gap-1 overflow-y-auto px-3">
          {navList()}
        </nav>

        <div className="space-y-2 border-t border-border/60 p-3">
          <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
            <span>Theme</span>
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <LogOut aria-hidden="true" className="size-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border bg-card/85 px-4 backdrop-blur-md lg:hidden">
        <Link href="/admin" aria-label="Admin dashboard home">
          <Logo size="sm" />
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-xl"
                  aria-label="Open admin navigation"
                />
              }
            >
              <Menu aria-hidden="true" className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(19rem,88vw)] gap-0 p-0">
              <SheetHeader className="border-b px-4 py-3">
                <SheetTitle className="text-sm font-semibold">Admin menu</SheetTitle>
              </SheetHeader>

              <nav aria-label="Admin navigation" className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                  <SheetClose
                    key={href}
                    render={
                      <Link
                        href={href}
                        aria-current={isActiveLink(pathname, href) ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                          isActiveLink(pathname, href)
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                        )}
                      />
                    }
                  >
                    <Icon aria-hidden="true" className="size-4 shrink-0" />
                    {label}
                  </SheetClose>
                ))}
              </nav>

              {profile && (
                <div className="space-y-3 border-t border-border/60 p-3">
                  <div className="flex items-center justify-between gap-2 px-1">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-foreground">{profile.name}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{profile.email}</p>
                    </div>
                    {roleBadge}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-muted-foreground"
                    onClick={handleLogout}
                    disabled={logout.isPending}
                  >
                    <LogOut aria-hidden="true" className="size-4" />
                    Sign out
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="p-4 lg:p-8">{children}</main>
    </div>
  );
}
