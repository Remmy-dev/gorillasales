'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  ChevronLeft,
  ChevronRight,
  Target,
  Settings,
  LogOut,
  AlertTriangle,
  SlidersHorizontal,
  UserCog,
  BarChart2,
  ChevronDown,
  Kanban,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { useUser, MOCK_USERS } from '@/context/UserContext';
import { logoutAction, loginAction } from '@/lib/auth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  managerOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Daily Sales Entry',
    href: '/daily-sales-entry',
    icon: <ClipboardList size={20} />,
    badge: 3,
  },
  {
    label: 'Customer Management',
    href: '/customer-management',
    icon: <Users size={20} />,
  },
  {
    label: 'Sales Pipeline',
    href: '/sales-pipeline',
    icon: <Kanban size={20} />,
  },
  {
    label: 'Monthly Targets',
    href: '/monthly-targets',
    icon: <TrendingUp size={20} />,
  },
  {
    label: 'Team Management',
    href: '/manager',
    icon: <UserCog size={20} />,
    managerOnly: true,
  },
  {
    label: 'Monthly Report',
    href: '/monthly-report',
    icon: <BarChart2 size={20} />,
  },
  {
    label: 'Config & Master Lists',
    href: '/config',
    icon: <SlidersHorizontal size={20} />,
    managerOnly: true,
  },
  {
    label: 'User Management',
    href: '/user-management',
    icon: <ShieldCheck size={20} />,
    managerOnly: true,
  },
];

const bottomItems = [
  { label: 'Targets & Config', href: '#', icon: <Target size={20} /> },
  { label: 'Settings', href: '#', icon: <Settings size={20} /> },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { currentUser, setCurrentUser, canViewAllReps } = useUser();
  const [showUserPicker, setShowUserPicker] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const visibleNavItems = navItems.filter((item) => {
    if (item.managerOnly && !canViewAllReps) return false;
    return true;
  });

  return (
    <aside
      className={`relative flex flex-col h-screen bg-slate-900 border-r border-slate-800 sidebar-transition overflow-hidden ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center border-b border-slate-800 ${
          collapsed ? 'justify-center px-0 py-4' : 'px-5 py-4 gap-3'
        }`}
      >
        <AppLogo size={32} />
        {!collapsed && (
          <span className="font-bold text-white text-base tracking-tight truncate">
            GorillaSales
          </span>
        )}
      </div>

      {/* Rep context pill with user switcher */}
      {!collapsed && (
        <div className="mx-3 mt-3 mb-1 relative">
          <button
            onClick={() => setShowUserPicker((v) => !v)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-md bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-xs font-bold text-yellow-400 shrink-0">
              {currentUser.initials}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-slate-200 text-xs font-semibold truncate">
                {currentUser.name}
              </p>
              <p className="text-slate-400 text-[11px] truncate">
                {currentUser.role}
              </p>
            </div>
            <ChevronDown size={12} className="text-slate-500 shrink-0" />
          </button>

          {/* User picker dropdown */}
          {showUserPicker && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden">
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-800">
                Switch User (Demo)
              </p>
              {MOCK_USERS.map((user) => (
                <button
                  key={user.name}
                  onClick={() => {
                    setCurrentUser(user);
                    setShowUserPicker(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-800 transition-colors ${
                    currentUser.name === user.name ? 'bg-yellow-500/10' : ''
                  }`}
                >
                  <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-yellow-400 shrink-0">
                    {user.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400">{user.role}</p>
                  </div>
                  {currentUser.name === user.name && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Nav section label */}
      {!collapsed && (
        <p className="px-4 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Main Menu
        </p>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-1 flex flex-col gap-1 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={`nav-${item.href}`}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                active
                  ? 'bg-yellow-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              } ${collapsed ? 'justify-center px-2' : ''}`}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="text-sm truncate">{item.label}</span>
              )}
              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  active ? 'bg-slate-950 text-yellow-400' : 'bg-red-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
              {/* Tooltip for collapsed */}
              {collapsed && (
                <span className="absolute left-full ml-3 bg-slate-800 text-white text-xs px-2.5 py-1 rounded-md border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-md">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Outstanding follow-up alert */}
      {!collapsed && (
        <div className="mx-3 mb-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-400 text-[11px] font-semibold">
              7 overdue follow-ups
            </p>
            <p className="text-amber-300/70 text-[10px]">Needs attention today</p>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      {!collapsed && (
        <p className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          System
        </p>
      )}
      <div className="px-2 pb-2 flex flex-col gap-1">
        {bottomItems.map((item) => (
          <Link
            key={`bottom-${item.label}`}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-slate-400 hover:bg-slate-800 hover:text-white group ${
              collapsed ? 'justify-center px-2' : ''
            }`}
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            {collapsed && (
              <span className="absolute left-full ml-3 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                {item.label}
              </span>
            )}
          </Link>
        ))}
        <button
          onClick={async () => {
            await logoutAction();
            window.location.href = '/login';
          }}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-slate-400 hover:bg-red-500/10 hover:text-red-400 group w-full text-left font-medium ${
            collapsed ? 'justify-center px-2' : ''
          }`}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span className="text-sm">Sign Out</span>}
          {collapsed && (
            <span className="absolute left-full ml-3 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              Sign Out
            </span>
          )}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 shadow-md flex items-center justify-center hover:bg-slate-700 transition-colors z-10 text-slate-300"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight size={12} />
        ) : (
          <ChevronLeft size={12} />
        )}
      </button>
    </aside>
  );
}