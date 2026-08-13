import Link from "next/link";
import { SearchX } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center px-4"><div className="flex max-w-md flex-col items-center gap-6 text-center"><Logo href={null} size="lg" /><div className="space-y-2"><SearchX aria-hidden="true" className="mx-auto size-10 text-primary" /><h1 className="text-3xl font-bold tracking-tight">Page not found</h1><p className="text-muted-foreground">The page you are looking for does not exist or may have moved.</p></div><Button render={<Link href="/" />}>Back home</Button></div></main>;
}
