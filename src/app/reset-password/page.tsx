'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { Lock, AlertCircle, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Supabase handles the token from the URL hash automatically via onAuthStateChange
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => router.replace('/login'), 3000);
    } catch (err: any) {
      setError(err?.message || 'Failed to update password. Please try again.');
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

          {success ? (
            /* Success state */
            <div className="space-y-7 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-positive/10 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-positive" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Password updated!</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your password has been changed successfully. Redirecting you to sign in…
                </p>
              </div>
              <div className="flex justify-center">
                <Loader2 size={20} className="animate-spin text-muted-foreground" />
              </div>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="space-y-1.5">
                <h2 className="text-2xl font-bold text-foreground">Set new password</h2>
                <p className="text-muted-foreground text-sm">
                  Choose a strong password for your account.
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
                    New Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
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
                      Updating password…
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
