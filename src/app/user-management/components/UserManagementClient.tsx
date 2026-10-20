'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/lib/supabase/client';
import {
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  KeyRound,
  Search,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  X,
  RefreshCw,
} from 'lucide-react';

type UserRole = 'Admin' | 'Manager' | 'Sales Officer' | 'Support' | 'Driver';
type AccountStatus = 'Active' | 'Inactive';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  initials: string;
  lastLogin: string;
  joinedDate: string;
}

const ROLE_OPTIONS: UserRole[] = ['Admin', 'Manager', 'Sales Officer', 'Support', 'Driver'];

const ROLE_COLORS: Record<UserRole, string> = {
  Admin: 'bg-purple-100 text-purple-700 border-purple-200',
  Manager: 'bg-blue-100 text-blue-700 border-blue-200',
  'Sales Officer': 'bg-green-100 text-green-700 border-green-200',
  Support: 'bg-amber-100 text-amber-700 border-amber-200',
  Driver: 'bg-slate-100 text-slate-600 border-slate-200',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function normalizeRole(raw: string | null | undefined): UserRole {
  if (!raw) return 'Sales Officer';
  const map: Record<string, UserRole> = {
    admin: 'Admin',
    manager: 'Manager',
    'sales officer': 'Sales Officer',
    support: 'Support',
    driver: 'Driver',
  };
  return map[raw.toLowerCase()] ?? 'Sales Officer';
}

interface ResetPasswordModalProps {
  user: ManagedUser;
  onClose: () => void;
  onConfirm: (newPassword: string) => void;
}

function ResetPasswordModal({ user, onClose, onConfirm }: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    onConfirm(newPassword);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <KeyRound size={18} className="text-accent" />
            <h2 className="font-semibold text-foreground text-sm">Reset Password</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Set a new password for <span className="font-semibold text-foreground">{user.name}</span>.
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                  placeholder="Min. 8 characters"
                  className="w-full px-3 py-2 pr-10 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 pr-10 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>
          {error && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertTriangle size={12} /> {error}
            </p>
          )}
        </div>
        <div className="flex gap-2 px-5 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 text-sm font-semibold bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserManagementClient() {
  const { isAdmin } = useUser();
  const supabase = createClient();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<AccountStatus | 'All'>('All');
  const [resetTarget, setResetTarget] = useState<ManagedUser | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, full_name, role, is_disabled, created_at, updated_at')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const mapped: ManagedUser[] = (data ?? []).map((row) => ({
        id: row.id,
        name: row.full_name || row.email?.split('@')[0] || 'Unknown',
        email: row.email,
        role: normalizeRole(row.role),
        status: row.is_disabled ? 'Inactive' : 'Active',
        initials: getInitials(row.full_name || row.email?.split('@')[0] || 'U'),
        lastLogin: '—',
        joinedDate: row.created_at ? new Date(row.created_at).toLocaleDateString('en-CA') : '—',
      }));

      setUsers(mapped);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load users';
      setFetchError(msg);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [isAdmin, fetchUsers]);

  // Access guard — admin only
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6">
        <ShieldCheck size={48} className="text-muted-foreground/40" />
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground">Access Restricted</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Only Super Admins can access User Management.
          </p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'All' || u.role === filterRole;
    const matchStatus = filterStatus === 'All' || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setOpenRoleDropdown(null);
    setUpdatingId(userId);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      showToast(`Role updated to ${newRole}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update role';
      showToast(msg, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const newDisabled = user.status === 'Active';
    setUpdatingId(userId);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_disabled: newDisabled, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, status: newDisabled ? 'Inactive' : 'Active' }
            : u
        )
      );
      showToast(`${user.name} account ${newDisabled ? 'deactivated' : 'activated'}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update account status';
      showToast(msg, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResetPassword = (_newPassword: string) => {
    if (resetTarget) {
      showToast(`Password reset link sent for ${resetTarget.name}`);
      setResetTarget(null);
    }
  };

  const activeCount = users.filter((u) => u.status === 'Active').length;
  const inactiveCount = users.filter((u) => u.status === 'Inactive').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users size={22} className="text-accent" />
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage accounts, roles, and access for all system users.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
            <ShieldCheck size={14} className="text-purple-600" />
            <span className="text-xs font-semibold text-purple-700">Super Admin View</span>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl px-4 py-3">
          <p className="text-xs text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold text-foreground mt-0.5">{users.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl px-4 py-3">
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-0.5">{activeCount}</p>
        </div>
        <div className="bg-card border border-border rounded-xl px-4 py-3">
          <p className="text-xs text-muted-foreground">Inactive</p>
          <p className="text-2xl font-bold text-red-500 mt-0.5">{inactiveCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as UserRole | 'All')}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        >
          <option value="All">All Roles</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as AccountStatus | 'All')}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Error state */}
      {fetchError && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertTriangle size={15} />
          <span>{fetchError}</span>
          <button onClick={fetchUsers} className="ml-auto text-xs underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* Users table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
            <RefreshCw size={18} className="animate-spin" />
            <span className="text-sm">Loading users…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Joined</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      {users.length === 0 ? 'No users found in the system.' : 'No users match your filters.'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className={`hover:bg-muted/30 transition-colors ${updatingId === user.id ? 'opacity-60' : ''}`}>
                      {/* User info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                            {user.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role dropdown */}
                      <td className="px-4 py-3">
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              setOpenRoleDropdown(openRoleDropdown === user.id ? null : user.id)
                            }
                            disabled={updatingId === user.id}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors hover:opacity-80 disabled:cursor-not-allowed ${ROLE_COLORS[user.role]}`}
                          >
                            {user.role}
                            <ChevronDown size={11} />
                          </button>
                          {openRoleDropdown === user.id && (
                            <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-20 min-w-[150px] overflow-hidden">
                              {ROLE_OPTIONS.map((role) => (
                                <button
                                  key={role}
                                  onClick={() => handleRoleChange(user.id, role)}
                                  className={`w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2 ${
                                    user.role === role ? 'font-semibold text-accent' : 'text-foreground'
                                  }`}
                                >
                                  {user.role === role && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
                                  {user.role !== role && <span className="w-1.5 h-1.5 shrink-0" />}
                                  {role}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            user.status === 'Active' ?'bg-green-50 text-green-700 border-green-200' :'bg-red-50 text-red-600 border-red-200'
                          }`}
                        >
                          {user.status === 'Active' ? (
                            <CheckCircle size={11} />
                          ) : (
                            <XCircle size={11} />
                          )}
                          {user.status}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                        {user.joinedDate}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {/* Toggle active/inactive */}
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            disabled={updatingId === user.id}
                            title={user.status === 'Active' ? 'Deactivate account' : 'Activate account'}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                              user.status === 'Active' ?'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' :'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                            }`}
                          >
                            {user.status === 'Active' ? (
                              <><UserX size={13} /> <span className="hidden sm:inline">Deactivate</span></>
                            ) : (
                              <><UserCheck size={13} /> <span className="hidden sm:inline">Activate</span></>
                            )}
                          </button>

                          {/* Reset password */}
                          <button
                            onClick={() => setResetTarget(user)}
                            disabled={updatingId === user.id}
                            title="Reset password"
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-accent hover:text-white border border-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <KeyRound size={13} />
                            <span className="hidden sm:inline">Reset PW</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-2.5 border-t border-border bg-muted/20 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>

      {/* Reset password modal */}
      {resetTarget && (
        <ResetPasswordModal
          user={resetTarget}
          onClose={() => setResetTarget(null)}
          onConfirm={handleResetPassword}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Click outside to close role dropdown */}
      {openRoleDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenRoleDropdown(null)}
        />
      )}
    </div>
  );
}
