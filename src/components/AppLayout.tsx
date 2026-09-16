'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, Home, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
        />
      </div>

      {/* Sidebar — mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-40 lg:hidden transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button overlaid on top of sidebar */}
        <div className="relative h-full">
          <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground transition-colors z-50"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-2 px-3 py-2.5 bg-primary border-b border-primary/20 min-h-[52px]">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors shrink-0"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="font-semibold text-primary-foreground text-sm flex-1 truncate">
            GorillaSales
          </span>
          {!isHome && (
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground text-xs font-medium transition-colors shrink-0 min-h-[36px]"
            >
              <Home size={14} />
              <span>Home</span>
            </Link>
          )}
        </div>

        {/* Desktop "Back to Home" bar — shown on all non-home pages */}
        {!isHome && (
          <div className="hidden lg:flex items-center px-6 py-2 bg-card border-b border-border">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-accent hover:text-white text-muted-foreground hover:text-white text-xs font-medium transition-all duration-150 group"
            >
              <Home size={14} className="group-hover:scale-110 transition-transform" />
              <span>Back to Home</span>
            </Link>
          </div>
        )}

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}