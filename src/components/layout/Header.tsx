import * as React from "react";
import Link from "next/link";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-surface)]/60",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--color-mystical)] to-[var(--color-mystical-dark)] mystical-glow flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-display text-2xl font-bold text-[var(--color-text-primary)]">
            Sidequest
          </span>
          <span className="text-xs font-medium text-[var(--color-mystical)] bg-[var(--color-mystical)]/10 px-2 py-1 rounded-full border border-[var(--color-mystical)]/20 mystical-glow-subtle">
            BETA
          </span>
        </Link>

        {/* Simple Start Quest Button */}
        <div className="flex items-center">
          <Button variant="mystical" size="sm">
            Start Quest
          </Button>
        </div>
      </div>
    </header>
  );
}