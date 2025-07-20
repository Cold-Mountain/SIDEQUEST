import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

// Spinner Component
const spinnerVariants = cva(
  "animate-spin rounded-full border-2 border-transparent",
  {
    variants: {
      variant: {
        default: "border-t-[var(--color-primary)] border-r-[var(--color-primary)]",
        mystical: "border-t-[var(--color-mystical)] border-r-[var(--color-mystical)]",
        warm: "border-t-[var(--color-secondary)] border-r-[var(--color-secondary)]",
        light: "border-t-white border-r-white"
      },
      size: {
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(spinnerVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Spinner.displayName = "Spinner";

// Loading Screen Component
interface LoadingScreenProps {
  message?: string;
  variant?: "default" | "mystical" | "warm";
  showSpinner?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading your next adventure...",
  variant = "mystical",
  showSpinner = true
}) => {
  return (
    <div className="fixed inset-0 bg-[var(--color-background)]/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-4 max-w-md px-6">
        {showSpinner && (
          <div className="flex justify-center">
            <Spinner variant={variant} size="xl" />
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="text-heading-3 text-[var(--color-text-primary)]">
            Please wait
          </h3>
          <p className="text-body text-[var(--color-text-secondary)]">
            {message}
          </p>
        </div>
        
        {/* Mystical dots animation */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-[var(--color-mystical)] animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1s"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Loading Card Skeleton
const LoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="bg-[var(--color-border-light)] rounded-lg h-4 w-3/4 mb-2" />
      <div className="bg-[var(--color-border-light)] rounded-lg h-4 w-1/2 mb-2" />
      <div className="bg-[var(--color-border-light)] rounded-lg h-4 w-5/6" />
    </div>
  );
};

// Quest Card Loading State
const QuestCardSkeleton: React.FC = () => {
  return (
    <div className="p-6 border border-[var(--color-border)] rounded-xl animate-pulse">
      <div className="space-y-4">
        {/* Category badge */}
        <div className="h-6 w-20 bg-[var(--color-border-light)] rounded-full" />
        
        {/* Title */}
        <div className="h-6 w-3/4 bg-[var(--color-border-light)] rounded-lg" />
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-[var(--color-border-light)] rounded-lg" />
          <div className="h-4 w-2/3 bg-[var(--color-border-light)] rounded-lg" />
        </div>
        
        {/* Meta info */}
        <div className="flex space-x-4">
          <div className="h-4 w-16 bg-[var(--color-border-light)] rounded" />
          <div className="h-4 w-20 bg-[var(--color-border-light)] rounded" />
          <div className="h-4 w-12 bg-[var(--color-border-light)] rounded" />
        </div>
        
        {/* Button */}
        <div className="h-10 w-32 bg-[var(--color-border-light)] rounded-lg" />
      </div>
    </div>
  );
};

export { 
  Spinner, 
  spinnerVariants, 
  LoadingScreen, 
  LoadingSkeleton, 
  QuestCardSkeleton 
};