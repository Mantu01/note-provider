"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/notes", label: "Notes" },
  { href: "/groups", label: "Bundles" },
  { href: "/order/track", label: "Track Order" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open navigation menu" className="md:hidden" />}>
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(22rem,88vw)] p-0">
        <SheetHeader className="border-b">
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile navigation" className="flex flex-1 flex-col gap-1 p-4">
          {links.map((link) => (
            <SheetClose
              key={link.href}
              render={
                <Link
                  href={link.href}
                  className={cn(
                    "rounded-lg px-4 py-3 text-base font-medium",
                    pathname === link.href && "bg-primary/10 text-primary"
                  )}
                />
              }
            >
              {link.label}
            </SheetClose>
          ))}
        </nav>
        <div className="border-t p-4">
          <SheetClose render={<Link href="/notes" className="block rounded-lg bg-primary px-4 py-3 text-center font-medium text-primary-foreground" />}>
            Browse notes
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
