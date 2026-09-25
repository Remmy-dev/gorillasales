'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { loginAction } from '@/lib/auth';
import { LogIn, Shield, Users, Sparkles, CheckCircle, ArrowRight, Lock } from 'lucide-react';

const DEMO_USERS = [
  { name: 'Mugabe Eric', email: 'eric.m@gorillacoffee.rw', role: 'Sales Manager', initials: 'ME', color: 'bg-accent/20 border-accent/40 text-accent' },
  { name: 'Karenzi Remmy', email: 'remmy.k@gorillacoffee.rw', role: 'Sales Officer', initials: 'KR', color: 'bg-positive/20 border-positive/40 text-positive' },
  { name: 'Alex Mushumba', email: 'alex.m@gorillacoffee.rw', role: 'Sales Officer', initials: 'AM', color: 'bg-info/20 border-info/40 text-info' },
  { name: 'Isimbi Patience', email: 'patience.i@gorillacoffee.rw', role: 'Sales Officer', initials: 'IP', color: 'bg-purple-500/20 border-purple-500/40 text-purple-400' },
  { name: 'Muyenzi Dan', email: 'dan.m@gorillacoffee.rw', role: 'Sales Officer', initials: 'MD', color: 'bg-warning/20 border-warning/40 text-warning' },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get('from') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (emailToSubmit: string) => {
    setLoading(true);
    setError(null);

    const res = await loginAction(emailToSubmit);
    setLoading(false);

    if (res.success) {
      router.push(fromPath);
      router.refresh();
    } else {
      setError(res.error || 'Login failed');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    handleLogin(email);
  };

  return (
    <div className="bg-card/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 mb-2 shadow-inner">
          <AppLogo size={36} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">GorillaSales Enterprise</h1>
        <p className="text-xs text-primary-foreground/70">
          Multi-Tenant Coffee Distribution CRM & SFA Platform
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-negative/20 border border-negative/40 text-negative text-xs font-medium text-center">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-primary-foreground/80 mb-1.5">
            Work Email Address
          </label>
          <input
            type="email"
            required
            placeholder="name@gorillacoffee.rw"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-primary-foreground/80 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
            />
            <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-accent hover:bg-accent/90 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            'Authenticating...'
          ) : (
            <>
              <LogIn size={16} />
              Sign In to Workspace
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Selector */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={13} className="text-accent" />
            Quick Demo Switcher
          </span>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60">
            1-Click Login
          </span>
        </div>

        <div className="space-y-2">
          {DEMO_USERS.map((u) => (
            <button
              key={u.email}
              type="button"
              onClick={() => {
                setEmail(u.email);
                handleLogin(u.email);
              }}
              className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between transition-all group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center ${u.color}`}>
                  {u.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-accent transition-colors">
                    {u.name}
                  </p>
                  <p className="text-[10px] text-white/50">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  {u.role}
                </span>
                <ArrowRight size={13} className="text-white/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-slate-900 to-primary/90 text-primary-foreground flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background glow circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Suspense fallback={<div className="p-8 bg-card rounded-3xl text-center text-white text-sm">Loading workspace auth...</div>}>
          <LoginForm />
        </Suspense>

        {/* Footer info */}
        <p className="text-center text-[11px] text-white/40 mt-4">
          GorillaSales Enterprise CRM · Protected by JWT HTTP-Only Cookie Session Guards
        </p>
      </div>
    </div>
  );
}
