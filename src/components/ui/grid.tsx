import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const gridVariants = cva(
  "grid",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
        6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
        auto: "grid-cols-[repeat(auto-fit,minmax(280px,1fr))]"
      },
      gap: {
        none: "gap-0",
        sm: "gap-2",
        default: "gap-4",
        md: "gap-6",
        lg: "gap-8",
        xl: "gap-12"
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch"
      }
    },
    defaultVariants: {
      cols: "auto",
      gap: "default",
      align: "stretch"
    }
  }
);

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, align, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(gridVariants({ cols, gap, align, className }))}
        {...props}
      />
    );
  }
);
Grid.displayName = "Grid";

const flexVariants = cva(
  "flex",
  {
    variants: {
      direction: {
        row: "flex-row",
        col: "flex-col",
        "row-reverse": "flex-row-reverse",
        "col-reverse": "flex-col-reverse"
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly"
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline"
      },
      gap: {
        none: "gap-0",
        sm: "gap-2",
        default: "gap-4",
        md: "gap-6",
        lg: "gap-8",
        xl: "gap-12"
      },
      wrap: {
        wrap: "flex-wrap",
        nowrap: "flex-nowrap",
        reverse: "flex-wrap-reverse"
      }
    },
    defaultVariants: {
      direction: "row",
      justify: "start",
      align: "start",
      gap: "default",
      wrap: "nowrap"
    }
  }
);

export interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants> {}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction, justify, align, gap, wrap, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(flexVariants({ direction, justify, align, gap, wrap, className }))}
        {...props}
      />
    );
  }
);
Flex.displayName = "Flex";

export { Grid, gridVariants, Flex, flexVariants };