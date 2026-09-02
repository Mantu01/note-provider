"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { MOBILE_NAV_LINKS } from "@/lib/constants";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open navigation menu"
            className="size-7 md:hidden"
          />
        }
      >
        <Menu aria-hidden="true" className="size-4" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(18rem,88vw)] p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle>
            <Logo size="sm" />
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile navigation" className="flex flex-1 flex-col gap-0.5 p-2.5">
          {MOBILE_NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-2.5">
          <Link
            href="/notes"
            className="block rounded-xl bg-primary px-4 py-2 text-center text-xs font-semibold text-primary-foreground"
          >
            Browse notes
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
