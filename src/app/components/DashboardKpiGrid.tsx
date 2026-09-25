'use client';

import React from 'react';
import { TrendingUp, Target, Users, ShoppingBag, AlertTriangle, UserPlus, Layers, Trophy, Activity } from 'lucide-react';
import { monthlyTargets, pipelineDeals, overdueFollowUps, formatRWF } from '@/lib/mockData';
import { useUser } from '@/context/UserContext';

function computeKpisForAll() {
  const totalTarget = monthlyTargets?.reduce((s, t) => s + t?.target, 0);
  const totalActual = monthlyTargets?.reduce((s, t) => s + t?.actualSales, 0);
  const achievementPct = (totalActual / totalTarget) * 100;
  const newCustomers = monthlyTargets?.reduce((s, t) => s + t?.newCustomers, 0);
  const totalVisits = monthlyTargets?.reduce((s, t) => s + t?.customerVisits, 0);
  const totalOrders = monthlyTargets?.reduce((s, t) => s + t?.orders, 0);
  const outstandingFollowUps = overdueFollowUps?.length;
  const pipelinePotential = pipelineDeals?.reduce((s, d) => s + d?.potentialValue, 0);
  const weightedPipeline = pipelineDeals?.reduce((s, d) => s + d?.weightedValue, 0);
  const topRep = [...monthlyTargets]?.sort((a, b) => b?.actualSales - a?.actualSales)?.[0];
  return { totalTarget, totalActual, achievementPct, newCustomers, totalVisits, totalOrders, outstandingFollowUps, pipelinePotential, weightedPipeline, topRep };
}

function computeKpisForRep(repName: string) {
  const repTarget = monthlyTargets?.find((t) => t?.salesperson === repName);
  const totalTarget = repTarget?.target ?? 0;
  const totalActual = repTarget?.actualSales ?? 0;
  const achievementPct = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;
  const newCustomers = repTarget?.newCustomers ?? 0;
  const totalVisits = repTarget?.customerVisits ?? 0;
  const totalOrders = repTarget?.orders ?? 0;
  const outstandingFollowUps = overdueFollowUps?.filter((f) => f?.salesperson === repName)?.length ?? 0;
  const myDeals = pipelineDeals?.filter((d) => d?.salesperson === repName);
  const pipelinePotential = myDeals?.reduce((s, d) => s + d?.potentialValue, 0);
  const weightedPipeline = myDeals?.reduce((s, d) => s + d?.weightedValue, 0);
  return { totalTarget, totalActual, achievementPct, newCustomers, totalVisits, totalOrders, outstandingFollowUps, pipelinePotential, weightedPipeline, topRep: repTarget };
}

export default function DashboardKpiGrid() {
  const { currentUser, canViewAllReps } = useUser();
  const kpis = canViewAllReps
    ? computeKpisForAll()
    : computeKpisForRep(currentUser.name);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {/* Hero: Actual Sales vs Target — spans 2 cols */}
      <div className="col-span-1 sm:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between min-h-[150px] shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              {canViewAllReps ? 'Total Actual Revenue — Sep 2026' : 'My Actual Revenue — Sep 2026'}
            </p>
            <p className="text-3xl font-extrabold text-white font-tabular tracking-tight">
              {formatRWF(kpis?.totalActual)}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-tabular">
              Target: <span className="text-slate-200 font-semibold">{formatRWF(kpis?.totalTarget)}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
            <Activity size={20} className="text-yellow-400" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-400">Target Achievement</span>
            <span className="text-xs font-bold text-slate-950 bg-yellow-500 px-2.5 py-0.5 rounded-full font-tabular">
              {kpis?.achievementPct?.toFixed(1)}% Achieved
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
            <div
              className="h-2 rounded-full bg-yellow-500 health-bar-fill"
              style={{ width: `${Math.min(kpis?.achievementPct, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Outstanding Follow-ups — alert state */}
      <div className="bg-red-50/90 border border-red-200 rounded-xl p-5 flex flex-col justify-between min-h-[150px]">
        <div className="flex items-start justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest text-red-700 mb-1">
            Overdue Follow-ups
          </p>
          <AlertTriangle size={18} className="text-red-600 shrink-0" />
        </div>
        <div>
          <p className="text-3xl font-extrabold text-red-900 font-tabular">
            {kpis?.outstandingFollowUps}
          </p>
          <p className="text-xs text-red-700 font-medium mt-1">
            Requires immediate attention today
          </p>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <TrendingUp size={13} className="text-red-700" />
          <span className="text-[11px] text-red-800 font-medium">+2 pending since yesterday</span>
        </div>
      </div>

      {/* Top Salesperson — only for managers/admins */}
      {canViewAllReps ? (
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between min-h-[150px] shadow-sm">
          <div className="flex items-start justify-between">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              Top Performer
            </p>
            <div className="w-7 h-7 rounded-md bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center">
              <Trophy size={15} className="text-yellow-600 shrink-0" />
            </div>
          </div>
          <div>
            <p className="text-base font-bold text-slate-900 leading-tight">
              {kpis?.topRep?.salesperson?.split(' ')?.[0]}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {kpis?.topRep?.salesperson}
            </p>
            <p className="text-xl font-extrabold text-slate-900 font-tabular mt-1">
              {kpis?.topRep?.achievementPct?.toFixed(1)}%
            </p>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            {formatRWF(kpis?.topRep?.actualSales ?? 0)} actual
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between min-h-[150px] shadow-sm">
          <div className="flex items-start justify-between">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              My Achievement
            </p>
            <Target size={16} className="text-yellow-600 shrink-0" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 font-tabular mt-1">
              {kpis?.achievementPct?.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">of monthly target</p>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            {formatRWF(kpis?.totalActual)} actual
          </p>
        </div>
      )}

      {/* Row 2: 4 equal cards */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
        <div className="flex items-start justify-between mb-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Total Visits
          </p>
          <Users size={16} className="text-slate-400" />
        </div>
        <p className="text-3xl font-extrabold text-slate-900 font-tabular">
          {kpis?.totalVisits}
        </p>
        <p className="text-xs text-slate-500 mt-1 font-medium">Logged this month</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
        <div className="flex items-start justify-between mb-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Orders Placed
          </p>
          <ShoppingBag size={16} className="text-slate-400" />
        </div>
        <p className="text-3xl font-extrabold text-slate-900 font-tabular">
          {kpis?.totalOrders}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {kpis?.totalVisits > 0 ? ((kpis?.totalOrders / kpis?.totalVisits) * 100)?.toFixed(0) : 0}% conversion
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
        <div className="flex items-start justify-between mb-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            New Customers
          </p>
          <UserPlus size={16} className="text-slate-400" />
        </div>
        <p className="text-3xl font-extrabold text-slate-900 font-tabular">
          {kpis?.newCustomers}
        </p>
        <p className="text-xs text-slate-500 mt-1 font-medium">Acquired this month</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
        <div className="flex items-start justify-between mb-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Weighted Pipeline
          </p>
          <Layers size={16} className="text-slate-400" />
        </div>
        <p className="text-2xl font-extrabold text-slate-900 font-tabular">
          {formatRWF(kpis?.weightedPipeline ?? 0)}
        </p>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          {formatRWF(kpis?.pipelinePotential ?? 0)} potential
        </p>
      </div>
    </div>
  );
}