import { BookOpen } from "lucide-react";
import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "full" | "icon" | "wordmark";
  size?: "sm" | "md" | "lg";
  href?: string | null;
  className?: string;
};

const sizes = {
  sm: { mark: "size-8 rounded-lg", icon: "size-4", wordmark: "text-sm" },
  md: { mark: "size-10 rounded-xl", icon: "size-5", wordmark: "text-base" },
  lg: { mark: "size-12 rounded-2xl", icon: "size-6", wordmark: "text-xl" },
} as const;

export function Logo({ variant = "full", size = "md", href = "/", className }: LogoProps) {
  const content = <span className={cn("inline-flex items-center gap-2.5", className)}>
    {variant !== "wordmark" && <span className={cn("brand-gradient-bg inline-flex items-center justify-center text-primary-foreground shadow-sm", sizes[size].mark)}><BookOpen aria-hidden="true" className={sizes[size].icon} /></span>}
    {variant !== "icon" && <span className={cn("font-heading font-bold tracking-tight", sizes[size].wordmark)}>{BRAND.name}</span>}
  </span>;
  return href ? <Link href={href} aria-label={`${BRAND.name} home`}>{content}</Link> : content;
}
