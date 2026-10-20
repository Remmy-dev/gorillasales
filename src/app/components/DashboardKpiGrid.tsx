'use client';

import React from 'react';
import { TrendingUp, Target, Users, ShoppingBag, AlertTriangle, UserPlus, Layers, Trophy, Activity } from 'lucide-react';
import { pipelineDeals, overdueFollowUps, formatRWF, getMonthTargets } from '@/lib/mockData';
import { useUser } from '@/context/UserContext';

function computeKpisForAll(monthKey: string) {
  const targets = getMonthTargets(monthKey);
  const totalTarget = targets?.reduce((s, t) => s + t?.target, 0);
  const totalActual = targets?.reduce((s, t) => s + t?.actualSales, 0);
  const achievementPct = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;
  const newCustomers = targets?.reduce((s, t) => s + t?.newCustomers, 0);
  const totalVisits = targets?.reduce((s, t) => s + t?.customerVisits, 0);
  const totalOrders = targets?.reduce((s, t) => s + t?.orders, 0);
  const totalKg = targets?.reduce((s, t) => s + (t?.kgSold ?? 0), 0);
  const outstandingFollowUps = overdueFollowUps?.length;
  const pipelinePotential = pipelineDeals?.reduce((s, d) => s + d?.potentialValue, 0);
  const weightedPipeline = pipelineDeals?.reduce((s, d) => s + d?.weightedValue, 0);
  const topRep = [...targets]?.sort((a, b) => b?.actualSales - a?.actualSales)?.[0];
  return { totalTarget, totalActual, achievementPct, newCustomers, totalVisits, totalOrders, outstandingFollowUps, pipelinePotential, weightedPipeline, topRep, totalKg };
}

function computeKpisForRep(repName: string, monthKey: string) {
  const targets = getMonthTargets(monthKey);
  const repTarget = targets?.find((t) => t?.salesperson === repName);
  const totalTarget = repTarget?.target ?? 0;
  const totalActual = repTarget?.actualSales ?? 0;
  const achievementPct = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;
  const newCustomers = repTarget?.newCustomers ?? 0;
  const totalVisits = repTarget?.customerVisits ?? 0;
  const totalOrders = repTarget?.orders ?? 0;
  const totalKg = repTarget?.kgSold ?? 0;
  const outstandingFollowUps = overdueFollowUps?.filter((f) => f?.salesperson === repName)?.length ?? 0;
  const myDeals = pipelineDeals?.filter((d) => d?.salesperson === repName);
  const pipelinePotential = myDeals?.reduce((s, d) => s + d?.potentialValue, 0);
  const weightedPipeline = myDeals?.reduce((s, d) => s + d?.weightedValue, 0);
  return { totalTarget, totalActual, achievementPct, newCustomers, totalVisits, totalOrders, outstandingFollowUps, pipelinePotential, weightedPipeline, topRep: repTarget, totalKg };
}

interface DashboardKpiGridProps {
  selectedMonth: string;
  monthLabel: string;
}

export default function DashboardKpiGrid({ selectedMonth, monthLabel }: DashboardKpiGridProps) {
  const { currentUser, canViewAllReps } = useUser();
  const kpis = canViewAllReps
    ? computeKpisForAll(selectedMonth)
    : computeKpisForRep(currentUser.name, selectedMonth);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {/* Hero: Actual Sales vs Target — spans 2 cols */}
      <div className="col-span-1 sm:col-span-2 bg-primary rounded-xl p-5 flex flex-col justify-between min-h-[140px]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary-foreground/50 mb-1">
              {canViewAllReps ? `Total Actual Sales — ${monthLabel}` : `My Actual Sales — ${monthLabel}`}
            </p>
            <p className="text-hero-metric text-primary-foreground font-tabular">
              {formatRWF(kpis?.totalActual)}
            </p>
            <p className="text-sm text-primary-foreground/60 mt-0.5 font-tabular">
              of {formatRWF(kpis?.totalTarget)} target
            </p>
            {/* KG display */}
            <p className="text-sm text-primary-foreground/70 mt-1 font-tabular font-semibold">
              {kpis?.totalKg > 0 ? `${kpis.totalKg.toLocaleString()} KG sold` : '—'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center shrink-0">
            <Activity size={20} className="text-primary-foreground/70" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-primary-foreground/60">Achievement</span>
            <span className="text-sm font-bold text-accent font-tabular">
              {kpis?.achievementPct?.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-primary-foreground/10 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-accent health-bar-fill"
              style={{ width: `${Math.min(kpis?.achievementPct, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Outstanding Follow-ups — alert state */}
      <div className="bg-negative-bg border border-negative/20 rounded-xl p-5 flex flex-col justify-between min-h-[140px]">
        <div className="flex items-start justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-negative/70 mb-1">
            Overdue Follow-ups
          </p>
          <AlertTriangle size={16} className="text-negative shrink-0" />
        </div>
        <div>
          <p className="text-hero-metric text-negative font-tabular">
            {kpis?.outstandingFollowUps}
          </p>
          <p className="text-xs text-negative/60 mt-1">
            Require action today
          </p>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <TrendingUp size={13} className="text-negative" />
          <span className="text-[11px] text-negative/70">+2 since yesterday</span>
        </div>
      </div>

      {/* Top Salesperson — only for managers/admins */}
      {canViewAllReps ? (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 flex flex-col justify-between min-h-[140px]">
          <div className="flex items-start justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-accent/70 mb-1">
              Top Performer
            </p>
            <Trophy size={16} className="text-accent shrink-0" />
          </div>
          <div>
            <p className="text-base font-bold text-foreground leading-tight">
              {kpis?.topRep?.salesperson?.split(' ')?.[0]}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {kpis?.topRep?.salesperson}
            </p>
            <p className="text-xl font-bold text-accent font-tabular mt-1">
              {kpis?.topRep?.achievementPct?.toFixed(1)}%
            </p>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {formatRWF(kpis?.topRep?.actualSales ?? 0)} actual
          </p>
        </div>
      ) : (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 flex flex-col justify-between min-h-[140px]">
          <div className="flex items-start justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-accent/70 mb-1">
              My Achievement
            </p>
            <Target size={16} className="text-accent shrink-0" />
          </div>
          <div>
            <p className="text-xl font-bold text-accent font-tabular mt-1">
              {kpis?.achievementPct?.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">of monthly target</p>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {formatRWF(kpis?.totalActual)} actual
          </p>
        </div>
      )}

      {/* Row 2: 4 equal cards */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Total Visits
          </p>
          <Users size={15} className="text-muted-foreground" />
        </div>
        <p className="text-3xl font-bold text-foreground font-tabular">
          {kpis?.totalVisits}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{monthLabel}</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Orders Placed
          </p>
          <ShoppingBag size={15} className="text-muted-foreground" />
        </div>
        <p className="text-3xl font-bold text-foreground font-tabular">
          {kpis?.totalOrders}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs text-positive font-medium">
            {kpis?.totalVisits > 0 ? ((kpis?.totalOrders / kpis?.totalVisits) * 100)?.toFixed(0) : 0}% conversion
          </span>
        </div>
      </div>

      {/* New Customers card */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            New Customers
          </p>
          <UserPlus size={15} className="text-muted-foreground" />
        </div>
        <p className="text-3xl font-bold text-foreground font-tabular">
          {kpis?.newCustomers}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Acquired · {monthLabel}</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Weighted Pipeline
          </p>
          <Layers size={15} className="text-muted-foreground" />
        </div>
        <p className="text-2xl font-bold text-foreground font-tabular">
          {formatRWF(kpis?.weightedPipeline ?? 0)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatRWF(kpis?.pipelinePotential ?? 0)} potential
        </p>
      </div>
    </div>
  );
}