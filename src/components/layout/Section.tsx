import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const sectionVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-background)]",
        surface: "bg-[var(--color-surface)]",
        elevated: "bg-[var(--color-surface-elevated)]",
        mystical: "bg-gradient-to-b from-[var(--color-mystical)]/5 to-transparent",
        warm: "bg-gradient-to-b from-[var(--color-secondary)]/5 to-transparent"
      },
      padding: {
        none: "py-0",
        sm: "py-8",
        default: "py-12",
        lg: "py-16",
        xl: "py-20"
      },
      spacing: {
        none: "space-y-0",
        sm: "space-y-4",
        default: "space-y-6",
        lg: "space-y-8",
        xl: "space-y-12"
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      spacing: "default"
    }
  }
);

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant, padding, spacing, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(sectionVariants({ variant, padding, spacing, className }))}
        {...props}
      />
    );
  }
);
Section.displayName = "Section";

export { Section, sectionVariants };