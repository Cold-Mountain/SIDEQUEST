import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]",
          "text-white shadow-md hover:shadow-lg",
          "hover:from-[var(--color-primary-light)] hover:to-[var(--color-primary)]",
          "focus-visible:ring-[var(--color-primary)]"
        ],
        secondary: [
          "bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-dark)]",
          "text-white shadow-md hover:shadow-lg",
          "hover:from-[var(--color-secondary-light)] hover:to-[var(--color-secondary)]",
          "focus-visible:ring-[var(--color-secondary)]"
        ],
        mystical: [
          "bg-gradient-to-r from-[var(--color-mystical)] to-[var(--color-mystical-dark)]",
          "text-white font-semibold shadow-md hover:shadow-lg mystical-glow",
          "hover:from-[var(--color-mystical-light)] hover:to-[var(--color-mystical)]",
          "focus-visible:ring-[var(--color-mystical)]",
          "border border-white/20"
        ],
        outline: [
          "border-2 border-[var(--color-primary)] text-[var(--color-primary)]",
          "bg-transparent hover:bg-[var(--color-primary)] hover:text-white",
          "focus-visible:ring-[var(--color-primary)]"
        ],
        ghost: [
          "text-[var(--color-text-primary)] hover:bg-[var(--color-border-light)]",
          "focus-visible:ring-[var(--color-primary)]"
        ],
        link: [
          "text-[var(--color-primary)] underline-offset-4",
          "hover:underline focus-visible:ring-[var(--color-primary)]"
        ],
        destructive: [
          "bg-[var(--color-error)] text-white shadow-md",
          "hover:bg-[var(--color-error)]/90 focus-visible:ring-[var(--color-error)]"
        ]
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-md",
        default: "h-10 px-4 py-2 text-base rounded-lg",
        lg: "h-12 px-6 text-lg rounded-xl",
        xl: "h-14 px-8 text-xl rounded-2xl",
        icon: "h-10 w-10 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-12 w-12 rounded-xl"
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };