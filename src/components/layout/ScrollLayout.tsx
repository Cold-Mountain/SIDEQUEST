"use client";

import * as React from "react";
import { Header, Footer } from "@/components/layout";

interface ScrollLayoutProps {
  children: React.ReactNode;
}

export function ScrollLayout({ children }: ScrollLayoutProps) {
  const [showHeader, setShowHeader] = React.useState(false);
  const [showFooter, setShowFooter] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show header after scrolling down 100px
      setShowHeader(scrollY > 100);
      
      // Show footer when near bottom of page (within 200px)
      const nearBottom = scrollY + windowHeight >= documentHeight - 200;
      setShowFooter(nearBottom);
    };

    // Initial check
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with slide-down animation */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          showHeader ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <Header />
      </div>
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer with slide-up animation */}
      <div 
        className={`transition-transform duration-300 ease-in-out ${
          showFooter ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <Footer />
      </div>
    </div>
  );
}