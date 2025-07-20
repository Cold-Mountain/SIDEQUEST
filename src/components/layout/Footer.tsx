import * as React from "react";
import Link from "next/link";
import { cn } from "@/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer 
      className={cn(
        "border-t border-[var(--color-border)] bg-[var(--color-surface)] py-8",
        className
      )}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[var(--color-mystical)] to-[var(--color-mystical-dark)] mystical-glow flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-heading-3 font-bold text-[var(--color-text-primary)]">
                Sidequest
              </span>
            </div>
            <p className="text-body-small text-[var(--color-text-secondary)] max-w-xs">
              Real, meaningful experiences that push you outside your comfort zone. 
              Life is an adventure waiting to be discovered.
            </p>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h3 className="text-body font-semibold text-[var(--color-text-primary)]">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/discover" 
                  className="text-body-small text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Discover Quests
                </Link>
              </li>
              <li>
                <Link 
                  href="/categories" 
                  className="text-body-small text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-body-small text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="text-body font-semibold text-[var(--color-text-primary)]">
              Community
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/submit" 
                  className="text-body-small text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Submit Quest
                </Link>
              </li>
              <li>
                <Link 
                  href="/stories" 
                  className="text-body-small text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Quest Stories
                </Link>
              </li>
              <li>
                <Link 
                  href="/guidelines" 
                  className="text-body-small text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Safety Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-body font-semibold text-[var(--color-text-primary)]">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/help" 
                  className="text-body-small text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-body-small text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-body-small text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[var(--color-border)] mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-caption text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} Sidequest. All rights reserved.
          </p>
          <p className="text-caption text-[var(--color-text-muted)] mt-2 sm:mt-0">
            Made with ❤️ for adventure seekers
          </p>
        </div>
      </div>
    </footer>
  );
}