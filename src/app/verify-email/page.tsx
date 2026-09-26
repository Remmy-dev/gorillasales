'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, CheckCircle2, RefreshCw, LogOut, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import AppLogo from '@/components/ui/AppLogo';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');
  const [signingOut, setSigningOut] = useState(false);

  const handleResend = async () => {
    setResending(true);
    setResendError('');
    setResendSuccess(false);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error('No email found.');
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });
      if (error) throw error;
      setResendSuccess(true);
    } catch (err: any) {
      setResendError(err?.message || 'Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace('/login');
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-[440px] space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5">
          <AppLogo size={36} />
          <span className="font-bold text-foreground text-lg">GorillaSales</span>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 space-y-6 text-center shadow-sm">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail size={32} className="text-primary" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-foreground">Verify your email address</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We sent a confirmation link to your email. Click it to unlock full access to your dashboard.
            </p>
          </div>

          {/* Steps */}
          <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Steps to verify</p>
            <ul className="space-y-1.5">
              {[
                'Open the confirmation email from GorillaSales',
                'Click the "Confirm your email" button',
                'You\'ll be redirected back to your dashboard',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 size={14} className="text-positive shrink-0 mt-0.5" />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Resend feedback */}
          {resendSuccess && (
            <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-positive/8 border border-positive/20 text-positive text-sm text-left">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>Confirmation email resent! Check your inbox.</span>
            </div>
          )}
          {resendError && (
            <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-negative/8 border border-negative/20 text-negative text-sm text-left">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{resendError}</span>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || resendSuccess}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {resending ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Resending…
                </>
              ) : resendSuccess ? (
                <>
                  <CheckCircle2 size={15} />
                  Email sent!
                </>
              ) : (
                <>
                  <RefreshCw size={15} />
                  Resend confirmation email
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-transparent hover:bg-muted text-muted-foreground font-medium text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <LogOut size={15} />
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Didn't receive the email? Check your spam folder or resend above.
        </p>
      </div>
    </div>
  );
}
