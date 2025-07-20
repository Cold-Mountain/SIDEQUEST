import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const inputVariants = cva(
  "flex w-full rounded-lg border transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: [
          "border-[var(--color-border)] bg-[var(--color-surface)]",
          "text-[var(--color-text-primary)]",
          "focus-visible:ring-[var(--color-primary)] focus-visible:border-[var(--color-primary)]"
        ],
        mystical: [
          "border-[var(--color-mystical)]/30 bg-[var(--color-surface)]",
          "text-[var(--color-text-primary)]",
          "focus-visible:ring-[var(--color-mystical)] focus-visible:border-[var(--color-mystical)]",
          "focus-visible:mystical-glow"
        ],
        warm: [
          "border-[var(--color-secondary)]/30 bg-[var(--color-surface)]",
          "text-[var(--color-text-primary)]",
          "focus-visible:ring-[var(--color-secondary)] focus-visible:border-[var(--color-secondary)]",
          "focus-visible:warm-glow"
        ]
      },
      size: {
        sm: "h-8 px-3 text-sm",
        default: "h-10 px-3 py-2 text-base",
        lg: "h-12 px-4 py-3 text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };