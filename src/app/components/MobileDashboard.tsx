'use client';

import React from 'react';
import { AlertTriangle, Target, TrendingUp, Users, ShoppingBag, UserPlus, Trophy, Clock } from 'lucide-react';
import { overdueFollowUps, formatRWF, getMonthTargets } from '@/lib/mockData';
import { useUser } from '@/context/UserContext';

interface MobileDashboardProps {
  selectedMonth: string;
  monthLabel: string;
}

export default function MobileDashboard({ selectedMonth, monthLabel }: MobileDashboardProps) {
  const { currentUser, canViewAllReps } = useUser();
  const targets = getMonthTargets(selectedMonth);

  const kpis = canViewAllReps
    ? (() => {
        const totalTarget = targets?.reduce((s, t) => s + t?.target, 0) ?? 0;
        const totalActual = targets?.reduce((s, t) => s + t?.actualSales, 0) ?? 0;
        const achievementPct = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;
        const totalVisits = targets?.reduce((s, t) => s + t?.customerVisits, 0) ?? 0;
        const totalOrders = targets?.reduce((s, t) => s + t?.orders, 0) ?? 0;
        const newCustomers = targets?.reduce((s, t) => s + t?.newCustomers, 0) ?? 0;
        const topRep = [...(targets ?? [])].sort((a, b) => b?.actualSales - a?.actualSales)?.[0];
        const overdueCount = overdueFollowUps?.length ?? 0;
        return { totalTarget, totalActual, achievementPct, totalVisits, totalOrders, newCustomers, topRep, overdueCount };
      })()
    : (() => {
        const repTarget = targets?.find((t) => t?.salesperson === currentUser.name);
        const totalTarget = repTarget?.target ?? 0;
        const totalActual = repTarget?.actualSales ?? 0;
        const achievementPct = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;
        const totalVisits = repTarget?.customerVisits ?? 0;
        const totalOrders = repTarget?.orders ?? 0;
        const newCustomers = repTarget?.newCustomers ?? 0;
        const overdueCount = overdueFollowUps?.filter((f) => f?.salesperson === currentUser.name)?.length ?? 0;
        return { totalTarget, totalActual, achievementPct, totalVisits, totalOrders, newCustomers, topRep: repTarget, overdueCount };
      })();

  const achievementColor =
    kpis.achievementPct >= 80 ? 'text-positive' : kpis.achievementPct >= 60 ? 'text-amber-500' : 'text-negative';
  const achievementBarColor =
    kpis.achievementPct >= 80 ? 'bg-positive' : kpis.achievementPct >= 60 ? 'bg-amber-400' : 'bg-negative';

  // Top alerts: overdue follow-ups
  const myOverdue = canViewAllReps
    ? overdueFollowUps?.slice(0, 4)
    : overdueFollowUps?.filter((f) => f?.salesperson === currentUser.name)?.slice(0, 4);

  return (
    <div className="space-y-4 px-4 py-5">
      {/* Month + greeting */}
      <div>
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">{monthLabel}</p>
        <h1 className="text-xl font-bold text-foreground mt-0.5">
          {canViewAllReps ? 'Team Overview' : `Hi, ${currentUser.name.split(' ')[0]}`}
        </h1>
      </div>

      {/* Hero achievement card */}
      <div className="bg-primary rounded-2xl p-5">
        <p className="text-primary-foreground/60 text-xs font-semibold uppercase tracking-widest mb-1">
          {canViewAllReps ? 'Team Achievement' : 'My Achievement'}
        </p>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-3xl font-bold text-primary-foreground font-tabular">
              {kpis.achievementPct.toFixed(1)}%
            </p>
            <p className="text-primary-foreground/60 text-sm mt-0.5">
              {formatRWF(kpis.totalActual)} of {formatRWF(kpis.totalTarget)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center">
            <Target size={20} className="text-primary-foreground/80" />
          </div>
        </div>
        <div className="w-full bg-primary-foreground/15 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-accent transition-all"
            style={{ width: `${Math.min(kpis.achievementPct, 100)}%` }}
          />
        </div>
      </div>

      {/* KPI grid — 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Visits</p>
            <Users size={14} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground font-tabular">{kpis.totalVisits}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{monthLabel}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Orders</p>
            <ShoppingBag size={14} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground font-tabular">{kpis.totalOrders}</p>
          <p className="text-[11px] text-positive mt-0.5">
            {kpis.totalVisits > 0 ? `${((kpis.totalOrders / kpis.totalVisits) * 100).toFixed(0)}% conv.` : '—'}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">New Cust.</p>
            <UserPlus size={14} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground font-tabular">{kpis.newCustomers}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Acquired</p>
        </div>

        <div className={`border rounded-xl p-4 ${kpis.overdueCount > 0 ? 'bg-negative-bg border-negative/20' : 'bg-card border-border'}`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-[10px] font-semibold uppercase tracking-widest ${kpis.overdueCount > 0 ? 'text-negative/70' : 'text-muted-foreground'}`}>
              Overdue
            </p>
            <AlertTriangle size={14} className={kpis.overdueCount > 0 ? 'text-negative' : 'text-muted-foreground'} />
          </div>
          <p className={`text-2xl font-bold font-tabular ${kpis.overdueCount > 0 ? 'text-negative' : 'text-foreground'}`}>
            {kpis.overdueCount}
          </p>
          <p className={`text-[11px] mt-0.5 ${kpis.overdueCount > 0 ? 'text-negative/60' : 'text-muted-foreground'}`}>
            Follow-ups
          </p>
        </div>
      </div>

      {/* Top performer — managers only */}
      {canViewAllReps && kpis.topRep && (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
            <Trophy size={18} className="text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-accent/70">Top Performer</p>
            <p className="font-bold text-foreground truncate">{kpis.topRep.salesperson}</p>
            <p className="text-xs text-muted-foreground">{kpis.topRep.achievementPct?.toFixed(1)}% · {formatRWF(kpis.topRep.actualSales)}</p>
          </div>
          <TrendingUp size={18} className="text-accent shrink-0" />
        </div>
      )}

      {/* Top alerts */}
      {myOverdue && myOverdue.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <AlertTriangle size={14} className="text-negative" />
            <p className="text-sm font-semibold text-foreground">Top Alerts</p>
            <span className="ml-auto bg-negative text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {myOverdue.length}
            </span>
          </div>
          <div className="divide-y divide-border">
            {myOverdue.map((fu) => (
              <div key={`mfu-${fu?.id}`} className="px-4 py-3 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-negative/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={13} className="text-negative" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{fu?.customer}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {canViewAllReps ? `${fu?.salesperson} · ` : ''}{fu?.area}
                  </p>
                  <p className="text-[11px] text-negative mt-0.5">
                    {fu?.daysOverdue > 0 ? `${fu?.daysOverdue}d overdue` : 'Due today'} · {fu?.lastOutcome}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
