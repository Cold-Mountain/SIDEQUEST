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
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/discover" 
            className="text-body text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            Discover
          </Link>
          <Link 
            href="/dashboard" 
            className="text-body text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/submit" 
            className="text-body text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            Submit Quest
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            Sign In
          </Button>
          <Button variant="mystical" size="sm">
            Start Quest
          </Button>
        </div>
      </div>
    </header>
  );
}