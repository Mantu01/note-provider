import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button-variants"

export { buttonVariants } from "./button-variants"

function Button({
  className,
  variant = "default",
  size = "default",
  nativeButton,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const isNative = nativeButton ?? (props.render ? false : true);
  return (
    <ButtonPrimitive
      data-slot="button"
      nativeButton={isNative}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button }
