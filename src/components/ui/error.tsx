import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";
import { Button } from "./button";

// Alert Component for errors and messages
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 text-sm",
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--color-surface)] border-[var(--color-border)]",
          "text-[var(--color-text-primary)]"
        ],
        destructive: [
          "bg-red-50 border-red-200 text-red-800",
          "dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
        ],
        warning: [
          "bg-yellow-50 border-yellow-200 text-yellow-800",
          "dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400"
        ],
        success: [
          "bg-green-50 border-green-200 text-green-800",
          "dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
        ],
        info: [
          "bg-blue-50 border-blue-200 text-blue-800",
          "dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
        ]
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

// Error Boundary Component
interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        {/* Error Icon */}
        <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h3 className="text-heading-3 text-[var(--color-text-primary)]">
            Something went wrong
          </h3>
          <p className="text-body text-[var(--color-text-secondary)]">
            We encountered an unexpected error. Don&apos;t worry, your quest awaits!
          </p>
        </div>

        {/* Error details (dev mode) */}
        {process.env.NODE_ENV === 'development' && (
          <Alert variant="destructive" className="text-left">
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription>
              <code className="text-xs">{error.message}</code>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={resetError} variant="primary">
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

// Not Found Component
const NotFound: React.FC<{ 
  title?: string; 
  description?: string; 
  showBackButton?: boolean;
}> = ({ 
  title = "Quest Not Found", 
  description = "The adventure you're looking for doesn't exist or has been completed.",
  showBackButton = true 
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        {/* 404 Icon */}
        <div className="mx-auto h-16 w-16 rounded-full bg-[var(--color-mystical)]/10 flex items-center justify-center mystical-glow">
          <svg
            className="h-8 w-8 text-[var(--color-mystical)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.5a7.962 7.962 0 01-5.657-2.343m11.314 0c.47-.47.927-.97 1.316-1.485.389-.515.726-1.069.998-1.657.272-.588.487-1.21.641-1.854.154-.644.248-1.31.28-1.979.032-.669-.004-1.338-.104-1.996a14.933 14.933 0 00-.414-1.917c-.185-.627-.426-1.234-.723-1.818a14.933 14.933 0 00-1.009-1.742"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h3 className="text-heading-3 text-[var(--color-text-primary)]">
            {title}
          </h3>
          <p className="text-body text-[var(--color-text-secondary)]">
            {description}
          </p>
        </div>

        {showBackButton && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="mystical"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              Start New Quest
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState: React.FC<{
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}> = ({ title, description, actionLabel, onAction, icon }) => {
  const defaultIcon = (
    <svg
      className="h-8 w-8 text-[var(--color-text-muted)]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  );

  return (
    <div className="text-center py-12 px-6">
      <div className="mx-auto h-16 w-16 rounded-full bg-[var(--color-border-light)] flex items-center justify-center mb-4">
        {icon || defaultIcon}
      </div>
      <h3 className="text-heading-3 text-[var(--color-text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-body text-[var(--color-text-secondary)] mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export {
  Alert,
  AlertTitle,
  AlertDescription,
  alertVariants,
  ErrorFallback,
  NotFound,
  EmptyState
};