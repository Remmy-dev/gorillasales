'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  Mail,
  Lock,
  Bell,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Save,
} from 'lucide-react';

type Tab = 'profile' | 'security' | 'notifications';

interface NotificationPrefs {
  emailDailySummary: boolean;
  emailWeeklyReport: boolean;
  emailTargetAlerts: boolean;
  emailNewCustomer: boolean;
  pushOverdueFollowUps: boolean;
  pushTargetMilestones: boolean;
}

const DEFAULT_NOTIF_PREFS: NotificationPrefs = {
  emailDailySummary: true,
  emailWeeklyReport: true,
  emailTargetAlerts: true,
  emailNewCustomer: false,
  pushOverdueFollowUps: true,
  pushTargetMilestones: false,
};

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-border last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
          checked ? 'bg-accent' : 'bg-muted-foreground/30'
        }`}
        style={{ height: '22px', width: '40px' }}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-[18px]' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default function AccountSettingsClient() {
  const { user } = useAuth();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Profile state
  const [displayName, setDisplayName] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Email update state
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password update state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Notification prefs state
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>(DEFAULT_NOTIF_PREFS);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifMsg, setNotifMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.full_name || '');
      setNewEmail(user.email || '');
      // Load saved notification prefs from localStorage
      const saved = localStorage.getItem(`notif_prefs_${user.id}`);
      if (saved) {
        try {
          setNotifPrefs(JSON.parse(saved));
        } catch {}
      }
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName },
      });
      if (error) throw error;
      setProfileMsg({ type: 'success', text: 'Display name updated successfully.' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err?.message || 'Failed to update profile.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || newEmail === user?.email) {
      setEmailMsg({ type: 'error', text: 'Please enter a different email address.' });
      return;
    }
    setEmailLoading(true);
    setEmailMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      setEmailMsg({
        type: 'success',
        text: 'Confirmation email sent. Check your inbox to verify the new address.',
      });
    } catch (err: any) {
      setEmailMsg({ type: 'error', text: err?.message || 'Failed to update email.' });
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordMsg({ type: 'success', text: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err?.message || 'Failed to update password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleNotifSave = async () => {
    setNotifLoading(true);
    setNotifMsg(null);
    try {
      if (user) {
        localStorage.setItem(`notif_prefs_${user.id}`, JSON.stringify(notifPrefs));
      }
      await new Promise((r) => setTimeout(r, 400));
      setNotifMsg({ type: 'success', text: 'Notification preferences saved.' });
    } catch {
      setNotifMsg({ type: 'error', text: 'Failed to save preferences.' });
    } finally {
      setNotifLoading(false);
    }
  };

  const initials = displayName
    ? displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'U';

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your profile, security, and notification preferences.
        </p>
      </div>

      {/* User identity card */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border mb-6">
        <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-white font-bold text-lg shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground truncate">
            {displayName || 'No display name set'}
          </p>
          <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                user?.email_confirmed_at ? 'bg-positive' : 'bg-warning'
              }`}
            />
            <span className="text-[11px] text-muted-foreground">
              {user?.email_confirmed_at ? 'Email verified' : 'Email not verified'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === tab.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Profile Tab ── */}
      {activeTab === 'profile' && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-5">
          <div>
            <h2 className="text-base font-semibold text-foreground">Profile Information</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update your display name shown across the app.
            </p>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Display Name
              </label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Account Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-muted text-muted-foreground text-sm cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                To change your email, go to the Security tab.
              </p>
            </div>

            {profileMsg && (
              <div
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${
                  profileMsg.type === 'success' ?'bg-positive/10 border border-positive/20 text-positive' :'bg-negative/8 border border-negative/20 text-negative'
                }`}
              >
                {profileMsg.type === 'success' ? (
                  <CheckCircle size={15} className="shrink-0" />
                ) : (
                  <AlertCircle size={15} className="shrink-0" />
                )}
                {profileMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={profileLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {profileLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {profileLoading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* ── Security Tab ── */}
      {activeTab === 'security' && (
        <div className="space-y-5">
          {/* Update Email */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Update Email Address</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                A confirmation link will be sent to your new address.
              </p>
            </div>
            <form onSubmit={handleEmailUpdate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  New Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="new@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              {emailMsg && (
                <div
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${
                    emailMsg.type === 'success' ?'bg-positive/10 border border-positive/20 text-positive' :'bg-negative/8 border border-negative/20 text-negative'
                  }`}
                >
                  {emailMsg.type === 'success' ? (
                    <CheckCircle size={15} className="shrink-0" />
                  ) : (
                    <AlertCircle size={15} className="shrink-0" />
                  )}
                  {emailMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={emailLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {emailLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Mail size={15} />
                )}
                {emailLoading ? 'Sending…' : 'Update Email'}
              </button>
            </form>
          </div>

          {/* Update Password */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Change Password</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose a strong password of at least 6 characters.
              </p>
            </div>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              {/* Current password (UX hint only — Supabase doesn't require it for updateUser) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Current Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-11 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-11 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {passwordMsg && (
                <div
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${
                    passwordMsg.type === 'success' ?'bg-positive/10 border border-positive/20 text-positive' :'bg-negative/8 border border-negative/20 text-negative'
                  }`}
                >
                  {passwordMsg.type === 'success' ? (
                    <CheckCircle size={15} className="shrink-0" />
                  ) : (
                    <AlertCircle size={15} className="shrink-0" />
                  )}
                  {passwordMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {passwordLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Lock size={15} />
                )}
                {passwordLoading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Notifications Tab ── */}
      {activeTab === 'notifications' && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Notification Preferences</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose which alerts and digests you want to receive.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Email Notifications
            </p>
            <Toggle
              checked={notifPrefs.emailDailySummary}
              onChange={(v) => setNotifPrefs((p) => ({ ...p, emailDailySummary: v }))}
              label="Daily Sales Summary"
              description="Receive a daily digest of your team's sales activity."
            />
            <Toggle
              checked={notifPrefs.emailWeeklyReport}
              onChange={(v) => setNotifPrefs((p) => ({ ...p, emailWeeklyReport: v }))}
              label="Weekly Performance Report"
              description="Get a weekly breakdown of targets vs. actuals."
            />
            <Toggle
              checked={notifPrefs.emailTargetAlerts}
              onChange={(v) => setNotifPrefs((p) => ({ ...p, emailTargetAlerts: v }))}
              label="Target Achievement Alerts"
              description="Be notified when a rep hits or misses their monthly target."
            />
            <Toggle
              checked={notifPrefs.emailNewCustomer}
              onChange={(v) => setNotifPrefs((p) => ({ ...p, emailNewCustomer: v }))}
              label="New Customer Onboarded"
              description="Email alert whenever a new customer is added to the system."
            />
          </div>

          <div className="pt-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              In-App Notifications
            </p>
            <Toggle
              checked={notifPrefs.pushOverdueFollowUps}
              onChange={(v) => setNotifPrefs((p) => ({ ...p, pushOverdueFollowUps: v }))}
              label="Overdue Follow-Up Reminders"
              description="Show alerts for follow-ups that are past their due date."
            />
            <Toggle
              checked={notifPrefs.pushTargetMilestones}
              onChange={(v) => setNotifPrefs((p) => ({ ...p, pushTargetMilestones: v }))}
              label="Target Milestone Badges"
              description="Celebrate when reps reach 50%, 75%, and 100% of their target."
            />
          </div>

          {notifMsg && (
            <div
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${
                notifMsg.type === 'success' ?'bg-positive/10 border border-positive/20 text-positive' :'bg-negative/8 border border-negative/20 text-negative'
              }`}
            >
              {notifMsg.type === 'success' ? (
                <CheckCircle size={15} className="shrink-0" />
              ) : (
                <AlertCircle size={15} className="shrink-0" />
              )}
              {notifMsg.text}
            </div>
          )}

          <button
            type="button"
            onClick={handleNotifSave}
            disabled={notifLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {notifLoading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {notifLoading ? 'Saving…' : 'Save Preferences'}
          </button>
        </div>
      )}
    </div>
  );
}
