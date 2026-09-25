'use client';

import React, { createContext, useContext, useState } from 'react';


export type UserRole = 'Sales Officer' | 'Manager' | 'Admin' | 'Sales Admin' | 'Sales Delivery Support' | 'Driver';

export interface CurrentUser {
  name: string;
  role: UserRole;
  initials: string;
}

// Mock users for demo — in production this would come from auth
export const MOCK_USERS: CurrentUser[] = [
  { name: 'Mugabe Eric', role: 'Manager', initials: 'ME' },
  { name: 'Karenzi Remmy', role: 'Sales Officer', initials: 'KR' },
  { name: 'Alex Mushumba', role: 'Sales Officer', initials: 'AM' },
  { name: 'Isimbi Patience', role: 'Sales Officer', initials: 'IP' },
  { name: 'Mastiko Frank', role: 'Sales Officer', initials: 'MF' },
  { name: 'Muyenzi Dan', role: 'Sales Officer', initials: 'MD' },
  { name: 'Umwari Lilian', role: 'Sales Admin', initials: 'UL' },
  { name: 'Herve', role: 'Sales Delivery Support', initials: 'HV' },
  { name: 'Gakuba Samson', role: 'Driver', initials: 'GS' },
];

interface UserContextValue {
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
  isManager: boolean;
  isAdmin: boolean;
  canViewAllReps: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Default to Manager for demo — change to Sales Officer to test rep view
  const [currentUser, setCurrentUser] = useState<CurrentUser>(MOCK_USERS[5]);

  const isManager = currentUser.role === 'Manager';
  const isAdmin = currentUser.role === 'Admin';
  const canViewAllReps = isManager || isAdmin;

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, isManager, isAdmin, canViewAllReps }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
