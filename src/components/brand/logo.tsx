import { BookOpen } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";

type LogoProps = {
  variant?: "full" | "icon" | "wordmark";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: { mark: "size-8 rounded-lg", icon: "size-4", wordmark: "text-sm" },
  md: { mark: "size-10 rounded-xl", icon: "size-5", wordmark: "text-base" },
  lg: { mark: "size-12 rounded-2xl", icon: "size-6", wordmark: "text-xl" },
} as const;

export function Logo({ variant = "full", size = "md", className }: LogoProps) {
  return (
    <span className={cn("group flex items-center gap-2.5", className)}>
      {variant !== "wordmark" && (
        <Image
          alt="logo"
          src={'https://yt3.ggpht.com/oXVVVzBSDvF4QmHBJMj10Gmu8oBUXyp1385fEcAmGG2TV42xfgHj6J3mJkzCJ6suymbVvI-j9Q=s88-c-k-c0x00ffffff-no-rj'}
          width={30}
          height={30}
          className={cn(
            "relative flex items-center justify-center overflow-hidden bg-linear-to-br from-primary via-primary to-accent text-primary-foreground shadow-sm",
            sizes[size].mark
          )}
        />
      )}
    </span>
  );
}
