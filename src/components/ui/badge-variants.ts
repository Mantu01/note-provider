import { cva } from "class-variance-authority"

export const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground border border-border/50 shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm",
        outline:
          "border-border text-foreground shadow-sm",
        ghost:
          "text-muted-foreground",
        link: "text-primary underline-offset-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
