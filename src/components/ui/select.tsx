import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const selectVariants = cva(
  "flex w-full rounded-lg border transition-all duration-200 bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: [
          "border-[var(--color-border)]",
          "focus-visible:ring-[var(--color-primary)] focus-visible:border-[var(--color-primary)]"
        ],
        mystical: [
          "border-[var(--color-mystical)]/30",
          "focus-visible:ring-[var(--color-mystical)] focus-visible:border-[var(--color-mystical)]",
          "focus-visible:mystical-glow"
        ],
        warm: [
          "border-[var(--color-secondary)]/30",
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

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <select
        className={cn(selectVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Select, selectVariants };