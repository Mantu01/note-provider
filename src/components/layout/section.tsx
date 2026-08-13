import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

export function Section({ className, children, ...props }: ComponentProps<"section">) {
  return <section className={cn("py-16 md:py-24", className)} {...props}><Container>{children}</Container></section>;
}
