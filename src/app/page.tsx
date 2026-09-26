'use client';

import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { useUser } from '@/context/UserContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MapPin,
  ClipboardCheck,
  ShoppingBag,
  Users,
  Award,
  Coffee,
  CheckCircle2,
  ChevronRight,
  Lock,
  Layers,
  Building2,
  BarChart3,
} from 'lucide-react';

const DEMO_USERS = [
  { name: 'Mugabe Eric', email: 'eric.m@gorillacoffee.rw', role: 'Sales Manager', initials: 'ME', badge: 'Manager' },
  { name: 'Karenzi Remmy', email: 'remmy.k@gorillacoffee.rw', role: 'Sales Officer', initials: 'KR', badge: 'Field Rep' },
  { name: 'Alex Mushumba', email: 'alex.m@gorillacoffee.rw', role: 'Sales Officer', initials: 'AM', badge: 'Field Rep' },
  { name: 'Isimbi Patience', email: 'patience.i@gorillacoffee.rw', role: 'Sales Officer', initials: 'IP', badge: 'Field Rep' },
];

export default function PublicHomePage() {
  const { currentUser } = useUser();
  const isLoggedIn = !!currentUser?.email;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-yellow-500 selection:text-slate-950">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <AppLogo size={34} />
            <div>
              <span className="font-bold text-white text-lg tracking-tight group-hover:text-yellow-400 transition-colors">
                GorillaSales
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-widest text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                Enterprise CRM
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#heritage" className="hover:text-white transition-colors">Coffee Network</a>
            <a href="#products" className="hover:text-white transition-colors">Product Catalog</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo Switcher</a>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="hidden sm:flex px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold mb-6">
            <Sparkles size={14} />
            <span>Powering Rwanda's Iconic Coffee Distribution</span>
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse ml-1" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Enterprise Field Sales Automation & CRM for{' '}
            <span className="text-yellow-400">Gorilla's Coffee</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Real-time daily visit logging, Kigali route management, pipeline deal tracking, and target achievement analytics—built specifically for Rwanda Farmers Coffee Company (RFCC).
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <Lock size={16} />
              <span>Sign In to GorillaSales Workspace</span>
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-800 flex items-center justify-center gap-2 transition-colors"
            >
              <span>Explore Capabilities</span>
              <ChevronRight size={16} />
            </a>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Coffee Grade</p>
              <p className="text-xl font-bold text-white mt-1">100% Arabica</p>
              <p className="text-[11px] text-yellow-500/80 mt-0.5">Bourbon Roasted</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Reps</p>
              <p className="text-xl font-bold text-white mt-1">5 Sales Officers</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">Daily Visit Route</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Key Outlets</p>
              <p className="text-xl font-bold text-white mt-1">12+ Major Chains</p>
              <p className="text-[11px] text-blue-400 mt-0.5">Hotels & Supermarkets</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Commission Engine</p>
              <p className="text-xl font-bold text-white mt-1">Automated</p>
              <p className="text-[11px] text-purple-400 mt-0.5">RWF Target Bonus</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Heritage & Coffee Story */}
      <section id="heritage" className="py-16 md:py-24 bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 mb-4">
                <Coffee size={14} className="text-yellow-500" />
                <span>Rwanda Farmers Coffee Company (RFCC)</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                From Volcanic Soils to Kigali's Finest Outlets
              </h2>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                Gorilla's Coffee is harvested by smallholder coffee farmers across Rwanda's high-altitude volcanic ridges. GorillaSales provides the digital sales backbone connecting roasted inventory directly to top luxury hotels, supermarkets, and international export partners.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    <strong className="text-white">Hotel Channels:</strong> Hotel des Mille Collines, Radisson Blu, Marriott Kigali.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    <strong className="text-white">Supermarket Retail:</strong> Nakumatt Kigali City Mall, Simba Supermarket.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    <strong className="text-white">Coffee Shops & HORECA:</strong> Bourbon Coffee Kimihurura & Kigali International Airport outlets.
                  </p>
                </div>
              </div>
            </div>

            {/* Product Cards Preview */}
            <div className="grid grid-cols-2 gap-4" id="products">
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold text-xs">
                  250G
                </div>
                <p className="text-sm font-bold text-white">250G Roasted Coffee</p>
                <p className="text-xs text-slate-400">RWF 2,600 / Pack</p>
                <span className="inline-block text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">SKU: COF-250G</span>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold text-xs">
                  500G
                </div>
                <p className="text-sm font-bold text-white">500G Medium Ground</p>
                <p className="text-xs text-slate-400">RWF 4,800 / Pack</p>
                <span className="inline-block text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">SKU: COF-500G-MG</span>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold text-xs">
                  1KG
                </div>
                <p className="text-sm font-bold text-white">1KG Coffee Beans</p>
                <p className="text-xs text-slate-400">RWF 9,000 / KG</p>
                <span className="inline-block text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">SKU: COF-1KG-BEAN</span>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold text-xs">
                  PODS
                </div>
                <p className="text-sm font-bold text-white">Espresso Pods</p>
                <p className="text-xs text-slate-400">Custom HORECA Pack</p>
                <span className="inline-block text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">Commercial Pods</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features Section */}
      <section id="features" className="py-16 md:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Built for Enterprise Coffee Sales Execution
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Everything your sales reps and route managers need to track orders, customers, and targets in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                <ClipboardCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Daily Visit & Sales Logging</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reps log customer visits across Kigali routes with outcome status (Order Placed, Follow-Up Required), units, price, and payment terms (Paid, Credit, Pending).
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Monthly Target & Commission</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated monthly revenue achievement in RWF and weight targets in KG. Includes tier-based bonus rules and top performer bonuses.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                <Layers size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Twenty CRM Custom Fields</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Flexible custom metadata definitions for coffee roaster models, coffee machine types, and custom client attributes without code changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Quick Demo Switcher Preview */}
      <section id="demo" className="py-16 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
            Experience the Workspace Demo
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto mb-8">
            Click any account below to sign in instantly with seeded Kigali coffee distribution data.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {DEMO_USERS.map((u) => (
              <Link
                key={u.email}
                href="/login"
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-yellow-500/50 hover:bg-slate-800/80 transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center font-bold text-xs text-yellow-400">
                    {u.initials}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {u.badge}
                  </span>
                </div>
                <p className="text-xs font-bold text-white group-hover:text-yellow-400 transition-colors">
                  {u.name}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{u.email}</p>
                <div className="mt-3 flex items-center text-[11px] font-bold text-yellow-500 group-hover:translate-x-1 transition-transform">
                  <span>Sign In</span>
                  <ArrowRight size={12} className="ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="mt-auto py-8 bg-slate-950 text-xs text-slate-500 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AppLogo size={24} />
            <span className="font-bold text-slate-300 text-sm">GorillaSales</span>
            <span className="text-slate-600">|</span>
            <span>Rwanda Farmers Coffee Company (RFCC)</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://gorillascoffee.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-yellow-400 transition-colors"
            >
              Gorilla's Coffee Official Site ↗
            </a>
            <Link href="/login" className="hover:text-yellow-400 transition-colors">
              Workspace Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}