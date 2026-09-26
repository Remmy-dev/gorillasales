'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { loginAction } from '@/lib/auth';
import { LogIn, Sparkles, ArrowRight, Lock } from 'lucide-react';

const DEMO_USERS = [
  { name: 'Mugabe Eric', email: 'eric.m@gorillacoffee.rw', role: 'Sales Manager', initials: 'ME', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  { name: 'Karenzi Remmy', email: 'remmy.k@gorillacoffee.rw', role: 'Sales Officer', initials: 'KR', color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
  { name: 'Alex Mushumba', email: 'alex.m@gorillacoffee.rw', role: 'Sales Officer', initials: 'AM', color: 'bg-blue-100 border-blue-300 text-blue-800' },
  { name: 'Isimbi Patience', email: 'patience.i@gorillacoffee.rw', role: 'Sales Officer', initials: 'IP', color: 'bg-purple-100 border-purple-300 text-purple-800' },
  { name: 'Muyenzi Dan', email: 'dan.m@gorillacoffee.rw', role: 'Sales Officer', initials: 'MD', color: 'bg-amber-100 border-amber-300 text-amber-800' },
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
    <div className="bg-white border border-slate-200 rounded-md p-7 shadow-sm space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-yellow-500/10 border border-yellow-500/30 mb-1">
          <AppLogo size={32} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">GorillaSales Enterprise</h1>
        <p className="text-xs text-slate-500">
          Multi-Tenant Coffee Distribution CRM & SFA Platform
        </p>
      </div>

      {error && (
        <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Work Email Address
          </label>
          <input
            type="email"
            required
            placeholder="eric.m@gorillacoffee.rw"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
            />
            <Lock size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-sm font-bold flex items-center justify-center gap-2 transition-colors active:scale-[0.99] disabled:opacity-50 shadow-sm"
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
      <div className="pt-4 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={13} className="text-yellow-600" />
            Quick Demo Switcher
          </span>
          <span className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-sm text-slate-600 font-medium">
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
              className="w-full p-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between transition-colors group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-sm font-bold text-xs flex items-center justify-center border ${u.color}`}>
                  {u.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 group-hover:text-yellow-600 transition-colors">
                    {u.name}
                  </p>
                  <p className="text-[10px] text-slate-500">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-sm bg-white text-slate-700 font-medium border border-slate-200">
                  {u.role}
                </span>
                <ArrowRight size={13} className="text-slate-400 group-hover:text-yellow-600 group-hover:translate-x-0.5 transition-all" />
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="p-8 bg-white border border-slate-200 rounded-md text-center text-slate-600 text-sm">Loading workspace auth...</div>}>
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
