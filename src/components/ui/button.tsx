import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:focus-brand disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-brand-gold text-secondary hover:bg-brand-gold-700 rounded-pill tracking-button font-bold shadow-md hover:shadow-lg hover:shadow-brand-gold/30",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-pill shadow-md hover:shadow-lg",
        outline: "border border-line-100 bg-transparent hover:bg-surface-50 text-ink-700 rounded-pill",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-pill shadow-md hover:shadow-lg",
        ghost: "hover:bg-surface-50 hover:text-ink-700 text-ink-500",
        link: "text-brand-gold underline-offset-4 hover:underline font-medium",
        icon: "bg-brand-gold text-secondary hover:bg-brand-gold-700 rounded-button shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-12 px-6 py-3 text-body-s font-bold",
        sm: "h-9 px-4 py-2 text-caption font-semibold",
        lg: "h-14 px-8 py-4 text-body-l font-bold",
        icon: "h-9 w-9 p-0",
        pill: "h-12 px-8 py-3 text-caption font-bold tracking-button",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };