'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { loginAction } from '@/lib/auth';
import { LogIn, Sparkles, ArrowRight, Lock } from 'lucide-react';

const DEMO_USERS = [
  { name: 'Mugabe Eric', email: 'eric.m@gorillacoffee.rw', role: 'Sales Manager', initials: 'ME', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
  { name: 'Karenzi Remmy', email: 'remmy.k@gorillacoffee.rw', role: 'Sales Officer', initials: 'KR', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
  { name: 'Alex Mushumba', email: 'alex.m@gorillacoffee.rw', role: 'Sales Officer', initials: 'AM', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  { name: 'Isimbi Patience', email: 'patience.i@gorillacoffee.rw', role: 'Sales Officer', initials: 'IP', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
  { name: 'Muyenzi Dan', email: 'dan.m@gorillacoffee.rw', role: 'Sales Officer', initials: 'MD', color: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 mb-1">
          <AppLogo size={32} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">GorillaSales Enterprise</h1>
        <p className="text-xs text-slate-400">
          Multi-Tenant Coffee Distribution CRM & SFA Platform
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-400 text-xs font-medium text-center">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Work Email Address
          </label>
          <input
            type="email"
            required
            placeholder="eric.m@gorillacoffee.rw"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
            />
            <Lock size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-sm font-bold flex items-center justify-center gap-2 transition-colors active:scale-[0.99] disabled:opacity-50"
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
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={13} className="text-yellow-500" />
            Quick Demo Switcher
          </span>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-medium">
            1-Click Login
          </span>
        </div>

        <div className="space-y-1.5">
          {DEMO_USERS.map((u) => (
            <button
              key={u.email}
              type="button"
              onClick={() => {
                setEmail(u.email);
                handleLogin(u.email);
              }}
              className="w-full p-2 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 flex items-center justify-between transition-colors group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-md font-bold text-xs flex items-center justify-center border ${u.color}`}>
                  {u.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-yellow-400 transition-colors">
                    {u.name}
                  </p>
                  <p className="text-[10px] text-slate-400">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium border border-slate-700/50">
                  {u.role}
                </span>
                <ArrowRight size={13} className="text-slate-500 group-hover:text-yellow-500 group-hover:translate-x-0.5 transition-all" />
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-300 text-sm">Loading workspace auth...</div>}>
          <LoginForm />
        </Suspense>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-500 mt-4">
          GorillaSales Enterprise CRM · Protected by JWT HTTP-Only Cookie Session Guards
        </p>
      </div>
    </div>
  );
}
