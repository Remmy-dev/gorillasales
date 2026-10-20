'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Mail, AlertCircle, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] bg-primary flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-primary-foreground/5 blur-2xl pointer-events-none" />

        <div className="relative flex items-center gap-3">
          <AppLogo size={40} />
          <span className="text-primary-foreground font-bold text-xl tracking-tight">GorillaSales</span>
        </div>

        <div className="relative space-y-6">
          <div className="space-y-3">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest">Coffee Field Sales CRM</p>
            <h1 className="text-primary-foreground text-4xl xl:text-5xl font-bold leading-tight">
              Close more deals.<br />Track every visit.
            </h1>
            <p className="text-primary-foreground/60 text-base leading-relaxed max-w-sm">
              Log daily visits, monitor rep performance, and hit your monthly targets — all in one place built for Rwanda's coffee distribution teams.
            </p>
          </div>
          <div className="flex items-center gap-8 pt-2">
            {[
              { value: '98%', label: 'Target visibility' },
              { value: '3×', label: 'Faster reporting' },
              { value: '100%', label: 'Field coverage' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-primary-foreground text-2xl font-bold">{stat.value}</p>
                <p className="text-primary-foreground/50 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-primary-foreground/30 text-xs">
          © {new Date().getFullYear()} GorillaSales · Secure & encrypted
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[420px] space-y-7">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-2">
            <AppLogo size={32} />
            <span className="font-bold text-foreground text-lg">GorillaSales</span>
          </div>

          {sent ? (
            /* Success state */
            <div className="space-y-7 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-positive/10 flex items-center justify-center">
                  <Mail size={32} className="text-positive" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Check your inbox</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We sent a password reset link to
                </p>
                <p className="font-semibold text-foreground text-sm">{email}</p>
                <p className="text-muted-foreground text-sm leading-relaxed pt-1">
                  Click the link in the email to set a new password. The link expires in 1 hour.
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider">What to do next</p>
                <ul className="space-y-1.5">
                  {[
                    'Open the email from GorillaSales',
                    'Click the "Reset password" button',
                    'Choose a new secure password',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 size={14} className="text-positive shrink-0 mt-0.5" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-sm text-muted-foreground">
                Remembered your password?{' '}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="space-y-1.5">
                <h2 className="text-2xl font-bold text-foreground">Forgot your password?</h2>
                <p className="text-muted-foreground text-sm">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-negative/8 border border-negative/20 text-negative text-sm">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending reset link…
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              <Link
                href="/login"
                className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={14} />
                Back to sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
