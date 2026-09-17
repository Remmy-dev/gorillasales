'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

export type UserRole = 'Sales Officer' | 'Manager' | 'Admin';

export interface CurrentUser {
  name: string;
  role: UserRole;
  initials: string;
}

// Mock users for demo — used as fallback when no profile is found
export const MOCK_USERS: CurrentUser[] = [
  { name: 'Mugabe Eric', role: 'Manager', initials: 'ME' },
  { name: 'Karenzi Remmy', role: 'Sales Officer', initials: 'KR' },
  { name: 'Alex Mushumba', role: 'Sales Officer', initials: 'AM' },
  { name: 'Isimbi Patience', role: 'Sales Officer', initials: 'IP' },
  { name: 'Mastiko Frank', role: 'Sales Officer', initials: 'MF' },
  { name: 'Muyenzi Dan', role: 'Sales Officer', initials: 'MD' },
  { name: 'Umwari Lilian', role: 'Sales Officer', initials: 'UL' },
  { name: 'Herve', role: 'Sales Officer', initials: 'HV' },
  { name: 'Gakuba Samson', role: 'Sales Officer', initials: 'GS' },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function normalizeRole(raw: string | undefined | null): UserRole {
  if (!raw) return 'Sales Officer';
  const r = raw.toLowerCase();
  if (r === 'manager' || r === 'admin') return r === 'admin' ? 'Admin' : 'Manager';
  return 'Sales Officer';
}

interface UserContextValue {
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
  isManager: boolean;
  isAdmin: boolean;
  canViewAllReps: boolean;
  profileLoading: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  // Default to a Sales Officer placeholder while loading
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: '',
    role: 'Sales Officer',
    initials: '',
  });
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setProfileLoading(false);
      return;
    }

    async function loadProfile() {
      setProfileLoading(true);
      try {
        // Try to fetch from user_profiles table first
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .single();

        if (!error && profile) {
          const name = profile.full_name || user.user_metadata?.full_name || user.email || 'User';
          const role = normalizeRole(profile.role);
          setCurrentUser({ name, role, initials: getInitials(name) });
        } else {
          // Fallback: derive from auth user_metadata
          const name =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'User';
          const role = normalizeRole(user.user_metadata?.role);
          setCurrentUser({ name, role, initials: getInitials(name) });
        }
      } catch {
        // Last resort fallback
        const name = user.email?.split('@')[0] || 'User';
        setCurrentUser({ name, role: 'Sales Officer', initials: getInitials(name) });
      } finally {
        setProfileLoading(false);
      }
    }

    loadProfile();
  }, [user, authLoading]);

  const isManager = currentUser.role === 'Manager';
  const isAdmin = currentUser.role === 'Admin';
  const canViewAllReps = isManager || isAdmin;

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, isManager, isAdmin, canViewAllReps, profileLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
