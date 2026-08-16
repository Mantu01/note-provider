import Link from "next/link";
import { SearchX } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--brand-green-soft),transparent_60%)] opacity-40" />
      <div className="relative z-10 flex max-w-sm flex-col items-center gap-5 text-center">
        <Logo href={null} size="lg" />
        <div className="space-y-1.5">
          <SearchX aria-hidden="true" className="mx-auto size-8 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Page not found</h1>
          <p className="text-sm text-muted-foreground">The page you are looking for does not exist or may have moved.</p>
        </div>
        <Button render={<Link href="/" />}>Back home</Button>
      </div>
    </main>
  );
}
