import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

export function Section({ className, children, ...props }: ComponentProps<"section">) {
  return <section className={cn("py-10 md:py-14", className)} {...props}><Container>{children}</Container></section>;
}
