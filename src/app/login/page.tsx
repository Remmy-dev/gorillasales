'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppLogo from '@/components/ui/AppLogo';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type AuthMode = 'login' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [signupConfirmation, setSignupConfirmation] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const data = await signIn(email, password);
        // Check if email is verified
        const sessionUser = data?.user;
        if (sessionUser && !sessionUser.email_confirmed_at) {
          setError('Please verify your email address before signing in. Check your inbox for the confirmation link.');
          setLoading(false);
          return;
        }
        router.replace('/');
        router.refresh();
      } else {
        await signUp(email, password, { fullName });
        // Show confirmation message instead of redirecting
        setSignupConfirmation(email);
      }
    } catch (err: any) {
      const msg = err?.message || 'Something went wrong. Please try again.';
      if (msg.toLowerCase().includes('invalid login credentials')) {
        setError('Incorrect email or password. Please try again.');
      } else if (msg.toLowerCase().includes('user already registered')) {
        setError('An account with this email already exists. Please sign in.');
      } else if (msg.toLowerCase().includes('password should be at least')) {
        setError('Password must be at least 6 characters.');
      } else if (msg.toLowerCase().includes('email not confirmed')) {
        setError('Please verify your email address before signing in. Check your inbox for the confirmation link.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    setError('');
    setEmail('');
    setPassword('');
    setFullName('');
    setSignupConfirmation(null);
  };

  // Email confirmation pending screen
  if (signupConfirmation) {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Left panel — branding */}
        <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] bg-primary flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]"
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

        {/* Right panel — confirmation */}
        <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[420px] space-y-7 text-center">
            <div className="lg:hidden flex items-center justify-center gap-2.5 mb-2">
              <AppLogo size={32} />
              <span className="font-bold text-foreground text-lg">GorillaSales</span>
            </div>

            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-positive/10 flex items-center justify-center">
                <Mail size={32} className="text-positive" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Check your inbox</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We sent a confirmation link to
              </p>
              <p className="font-semibold text-foreground text-sm">{signupConfirmation}</p>
              <p className="text-muted-foreground text-sm leading-relaxed pt-1">
                Click the link in the email to verify your address and unlock access to your dashboard.
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">What to do next</p>
              <ul className="space-y-1.5">
                {[
                  'Open the email from GorillaSales',
                  'Click the "Confirm your email" button',
                  'You\'ll be redirected to your dashboard',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 size={14} className="text-positive shrink-0 mt-0.5" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm text-muted-foreground">
              Already verified?{' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-primary font-semibold hover:underline focus:outline-none"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] bg-primary flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-primary-foreground/5 blur-2xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <AppLogo size={40} />
          <span className="text-primary-foreground font-bold text-xl tracking-tight">GorillaSales</span>
        </div>

        {/* Hero copy */}
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

          {/* Stats row */}
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

        {/* Footer note */}
        <p className="relative text-primary-foreground/30 text-xs">
          © {new Date().getFullYear()} GorillaSales · Secure & encrypted
        </p>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[420px] space-y-7">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-2">
            <AppLogo size={32} />
            <span className="font-bold text-foreground text-lg">GorillaSales</span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold text-foreground">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {mode === 'login' ? 'Sign in to access your sales dashboard.' : 'Join your team on GorillaSales today.'}
            </p>
          </div>

          {/* Google OAuth button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-sm font-medium text-foreground disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin text-muted-foreground" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2045C17.64 8.5663 17.5827 7.9527 17.4764 7.3636H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.2045Z" fill="#4285F4"/>
                <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
                <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.5931 3.68182 9C3.68182 8.4069 3.78409 7.83 3.96409 7.29V4.9582H0.957275C0.347727 6.1731 0 7.5477 0 9C0 10.4523 0.347727 11.8269 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                <path d="M9 3.5795C10.3214 3.5795 11.5077 4.0336 12.4405 4.9254L15.0218 2.344C13.4632 0.8918 11.4259 0 9 0C5.48182 0 2.43818 2.0168 0.957275 4.9582L3.96409 7.29C4.67182 5.1627 6.65591 3.5795 9 3.5795Z" fill="#EA4335"/>
              </svg>
            )}
            {googleLoading ? 'Redirecting…' : `Continue with Google`}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Error alert */}
          {error && (
            <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-negative/8 border border-negative/20 text-negative text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Email/password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                </div>
              </div>
            )}

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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Password
                </label>
                {mode === 'login' && (
                  <Link href="/forgot-password" className="text-xs text-primary font-medium hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                  required
                  minLength={6}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
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

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                </>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Mode switch */}
          <p className="text-center text-sm text-muted-foreground">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={switchMode}
              className="text-primary font-semibold hover:underline focus:outline-none"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
