'use client';

import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
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

const INITIAL_USERS: ManagedUser[] = [
  {
    id: 'u1',
    name: 'Mugabe Eric',
    email: 'eric.mugabe@gorillasales.rw',
    role: 'Manager',
    status: 'Active',
    initials: 'ME',
    lastLogin: '2026-09-09',
    joinedDate: '2024-01-15',
  },
  {
    id: 'u2',
    name: 'Karenzi Remmy',
    email: 'remmy.karenzi@gorillasales.rw',
    role: 'Sales Officer',
    status: 'Active',
    initials: 'KR',
    lastLogin: '2026-09-09',
    joinedDate: '2024-02-01',
  },
  {
    id: 'u3',
    name: 'Alex Mushumba',
    email: 'alex.mushumba@gorillasales.rw',
    role: 'Sales Officer',
    status: 'Active',
    initials: 'AM',
    lastLogin: '2026-09-08',
    joinedDate: '2024-02-10',
  },
  {
    id: 'u4',
    name: 'Isimbi Patience',
    email: 'patience.isimbi@gorillasales.rw',
    role: 'Sales Officer',
    status: 'Active',
    initials: 'IP',
    lastLogin: '2026-09-07',
    joinedDate: '2024-03-05',
  },
  {
    id: 'u5',
    name: 'Mastiko Frank',
    email: 'frank.mastiko@gorillasales.rw',
    role: 'Sales Officer',
    status: 'Active',
    initials: 'MF',
    lastLogin: '2026-09-09',
    joinedDate: '2024-03-12',
  },
  {
    id: 'u6',
    name: 'Muyenzi Dan',
    email: 'dan.muyenzi@gorillasales.rw',
    role: 'Sales Officer',
    status: 'Inactive',
    initials: 'MD',
    lastLogin: '2026-08-20',
    joinedDate: '2024-04-01',
  },
  {
    id: 'u7',
    name: 'Umwari Lilian',
    email: 'lilian.umwari@gorillasales.rw',
    role: 'Support',
    status: 'Active',
    initials: 'UL',
    lastLogin: '2026-09-08',
    joinedDate: '2024-05-20',
  },
  {
    id: 'u8',
    name: 'Herve',
    email: 'herve@gorillasales.rw',
    role: 'Support',
    status: 'Active',
    initials: 'HV',
    lastLogin: '2026-09-06',
    joinedDate: '2024-06-01',
  },
  {
    id: 'u9',
    name: 'Gakuba Samson',
    email: 'samson.gakuba@gorillasales.rw',
    role: 'Driver',
    status: 'Active',
    initials: 'GS',
    lastLogin: '2026-09-09',
    joinedDate: '2024-07-15',
  },
];

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
  const { currentUser, isAdmin, canViewAllReps } = useUser();
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<AccountStatus | 'All'>('All');
  const [resetTarget, setResetTarget] = useState<ManagedUser | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Access guard — admin only
  if (!isAdmin && !canViewAllReps) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6">
        <ShieldCheck size={48} className="text-muted-foreground/40" />
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground">Access Restricted</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Only Admins can access User Management.
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

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    setOpenRoleDropdown(null);
    showToast(`Role updated to ${newRole}`);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
          : u
      )
    );
    const user = users.find((u) => u.id === userId);
    if (user) {
      const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
      showToast(`${user.name} account ${newStatus.toLowerCase()}`);
    }
  };

  const handleResetPassword = (newPassword: string) => {
    if (resetTarget) {
      showToast(`Password reset for ${resetTarget.name}`);
      setResetTarget(null);
    }
  };

  const activeCount = users.filter((u) => u.status === 'Active').length;
  const inactiveCount = users.filter((u) => u.status === 'Inactive').length;
  const adminCount = users.filter((u) => u.role === 'Admin').length;

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
        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
          <ShieldCheck size={14} className="text-purple-600" />
          <span className="text-xs font-semibold text-purple-700">Admin View</span>
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

      {/* Users table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Last Login</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Joined</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
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
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors hover:opacity-80 ${ROLE_COLORS[user.role]}`}
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

                    {/* Last login */}
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                      {user.lastLogin}
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
                          title={user.status === 'Active' ? 'Deactivate account' : 'Activate account'}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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
                          title="Reset password"
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-accent hover:text-white border border-border transition-colors"
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
            toast.type === 'success' ?'bg-green-600 text-white' :'bg-red-600 text-white'
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
