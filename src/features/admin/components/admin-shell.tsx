"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, BookOpen, LayoutDashboard, Layers3, LogOut, ReceiptText, Tags, Users, ShieldCheck, Shield } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminLogout, useAdminProfile } from "@/features/admin/api/use-admin-auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/notes", label: "Notes Catalogue", icon: BookOpen },
  { href: "/admin/groups", label: "Bundles", icon: Layers3 },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders & Fulfillment", icon: ReceiptText },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/activities", label: "Audit Activity Log", icon: Activity },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAdminLogout();
  const { data: profile } = useAdminProfile();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        toast.success("Signed out");
        router.push("/admin/login");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-card lg:flex lg:flex-col shadow-sm">
        {/* Logo area */}
        <div className="flex h-14 items-center px-4 border-b border-border/50">
          <Link href="/admin">
            <Logo />
          </Link>
        </div>

        {/* Profile card */}
        {profile && (
          <div className="mx-3 mt-4 rounded-xl border border-border/60 bg-muted/20 p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-foreground truncate">{profile.name}</span>
              {profile.isHead ? (
                <Badge className="bg-brand-emerald-soft text-brand-emerald-foreground border-brand-emerald/20 text-[10px] py-0 px-1.5 flex items-center gap-1 shrink-0">
                  <ShieldCheck className="h-3 w-3" /> Head
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 flex items-center gap-1 shrink-0">
                  <Shield className="h-3 w-3" /> Admin
                </Badge>
              )}
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground truncate">{profile.email}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="mt-4 flex-1 overflow-y-auto px-3 space-y-1" aria-label="Admin navigation">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-border/50 p-3 space-y-2">
          <div className="px-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Theme</span>
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-destructive h-9"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-h-screen lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 lg:px-8 backdrop-blur-md">
          <Logo className="lg:hidden" />
          <div className="ml-auto flex items-center gap-3">
            {profile?.isHead && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-brand-emerald/20 bg-brand-emerald-soft px-2.5 py-1 text-xs font-semibold text-brand-emerald-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> Full Delete Authority
              </span>
            )}
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
