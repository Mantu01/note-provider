"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, BookOpen, LayoutDashboard, Layers3, LogOut, ReceiptText, Tags, Users, ShieldCheck, Shield } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminLogout, useAdminProfile } from "@/features/admin/api/use-admin";
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
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-sidebar p-4 lg:flex lg:flex-col">
        <div className="px-2 py-1">
          <Logo href="/admin" />
        </div>

        {profile && (
          <div className="mt-4 rounded-xl border border-border bg-card/60 p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground truncate">{profile.name}</span>
              {profile.isHead ? (
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] py-0 px-1.5 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Head Admin
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Admin
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">{profile.email}</p>
          </div>
        )}

        <nav className="mt-6 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <Button
          variant="ghost"
          className="mt-auto justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </aside>

      <main className="min-h-screen lg:pl-64">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-8">
          <Logo className="lg:hidden" />
          <div className="ml-auto flex items-center gap-3">
            {profile?.isHead && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <ShieldCheck className="h-3.5 w-3.5" /> Full Delete Authority Granted
              </span>
            )}
          </div>
        </header>
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
