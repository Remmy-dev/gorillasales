'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardKpiGrid from './components/DashboardKpiGrid';
import RepTargetsTable from './components/RepTargetsTable';
import OverdueFollowUpsFeed from './components/OverdueFollowUpsFeed';
import { useUser } from '@/context/UserContext';
import { pipelineDeals, formatRWF, AVAILABLE_MONTHS, getMonthTargets, visitLogs } from '@/lib/mockData';
import { ChevronDown, Download } from 'lucide-react';
import dynamic from 'next/dynamic';

const SalesTrendChart = dynamic(() => import('./components/SalesTrendChart'), {
  ssr: false,
  loading: () => (
    <div className="skeleton-pulse rounded-lg h-[260px] w-full" />
  ),
});

const RepPerformanceChart = dynamic(() => import('./components/RepPerformanceChart'), {
  ssr: false,
  loading: () => (
    <div className="skeleton-pulse rounded-lg h-[220px] w-full" />
  ),
});

export default function DashboardPage() {
  const { currentUser, canViewAllReps, profileLoading } = useUser();
  const [selectedMonth, setSelectedMonth] = useState('2026-09');

  const monthLabel = AVAILABLE_MONTHS?.find((m) => m?.value === selectedMonth)?.label ?? 'Sep 2026';

  // Filter pipeline deals by role
  const visibleDeals = canViewAllReps
    ? pipelineDeals
    : pipelineDeals?.filter((d) => d?.salesperson === currentUser?.name);

  // Get targets for selected month
  const selectedTargets = getMonthTargets(selectedMonth);
  const myTarget = selectedTargets?.find((t) => t?.salesperson === currentUser?.name);

  function exportDashboardCSV() {
    const monthPrefix = selectedMonth; // e.g. "2026-09"

    // KPI rows
    const kpiRows = canViewAllReps
      ? (selectedTargets ?? []).map((t) => ({
          Salesperson: t?.salesperson ?? '',
          Target_RWF: t?.target ?? 0,
          Actual_Sales_RWF: t?.actualSales ?? 0,
          Achievement_Pct: t?.achievementPct?.toFixed(1) ?? '0.0',
          New_Customers: t?.newCustomers ?? 0,
          Customer_Visits: t?.customerVisits ?? 0,
          Orders: t?.orders ?? 0,
          KG_Sold: t?.kgSold ?? 0,
        }))
      : (() => {
          const t = selectedTargets?.find((t) => t?.salesperson === currentUser?.name);
          if (!t) return [];
          return [{
            Salesperson: t?.salesperson ?? '',
            Target_RWF: t?.target ?? 0,
            Actual_Sales_RWF: t?.actualSales ?? 0,
            Achievement_Pct: t?.achievementPct?.toFixed(1) ?? '0.0',
            New_Customers: t?.newCustomers ?? 0,
            Customer_Visits: t?.customerVisits ?? 0,
            Orders: t?.orders ?? 0,
            KG_Sold: t?.kgSold ?? 0,
          }];
        })();

    // Visit log rows filtered by month and rep
    const filteredVisits = visitLogs.filter((v) => {
      const inMonth = v.dateOfVisit?.startsWith(monthPrefix);
      const byRep = canViewAllReps ? true : v.salesperson === currentUser?.name;
      return inMonth && byRep;
    });

    const visitRows = filteredVisits.map((v) => ({
      Date: v.dateOfVisit,
      Salesperson: v.salesperson,
      Customer: v.customerName,
      Area: v.area,
      Category: v.customerCategory,
      Outcome: v.visitOutcome,
      Product: v.productCategory,
      Quantity: v.quantity,
      Unit_Price_RWF: v.unitPrice,
      Sales_Value_RWF: v.salesValue,
      Payment_Status: v.paymentStatus,
      Customer_Type: v.customerType,
      Next_Follow_Up: v.nextFollowUpDate,
      Remarks: v.remarks,
    }));

    function toCSV(rows: Record<string, string | number>[]): string {
      if (!rows.length) return '';
      const headers = Object.keys(rows[0]);
      const lines = [
        headers.join(','),
        ...rows.map((r) =>
          headers.map((h) => {
            const val = String(r[h] ?? '');
            return val.includes(',') || val.includes('"') || val.includes('\n')
              ? `"${val.replace(/"/g, '""')}"`
              : val;
          }).join(',')
        ),
      ];
      return lines.join('\n');
    }

    const kpiCSV = toCSV(kpiRows);
    const visitCSV = toCSV(visitRows);
    const combined = `KPI SUMMARY — ${monthLabel}\n${kpiCSV}\n\nVISIT LOGS — ${monthLabel}\n${visitCSV}`;

    const blob = new Blob([combined], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard_${monthPrefix}_${canViewAllReps ? 'all_reps' : currentUser?.name?.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Show loading state while user profile/role is being fetched
  if (profileLoading) {
    return (
      <AppLayout>
        <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto space-y-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="skeleton-pulse h-7 w-48 rounded-lg" />
              <div className="skeleton-pulse h-4 w-32 rounded mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)]?.map((_, i) => (
              <div key={i} className="skeleton-pulse rounded-xl h-[140px]" />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2 skeleton-pulse rounded-xl h-[320px]" />
            <div className="skeleton-pulse rounded-xl h-[320px]" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Sales Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {canViewAllReps
                ? `${monthLabel} · All Reps`
                : `${monthLabel} · ${currentUser?.name}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Export CSV */}
            <button
              onClick={exportDashboardCSV}
              className="flex items-center gap-2 bg-card border border-border text-foreground px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              title="Export KPIs and visit logs to CSV"
            >
              <Download size={14} />
              Export CSV
            </button>
            {/* Global Month Selector */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e?.target?.value)}
                className="appearance-none bg-card border border-border text-sm text-foreground rounded-lg pl-3 pr-8 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
              >
                {AVAILABLE_MONTHS?.map((m) => (
                  <option key={m?.value} value={m?.value}>
                    {m?.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            {selectedMonth === '2026-09' && (
              <span className="inline-flex items-center gap-1.5 text-xs text-positive bg-positive/10 border border-positive/20 px-2.5 py-1 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
                Live
              </span>
            )}
          </div>
        </div>

        {/* KPI Bento Grid */}
        <DashboardKpiGrid selectedMonth={selectedMonth} monthLabel={monthLabel} />

        {/* Charts + Overdue Feed row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
          {/* Sales Trend Chart */}
          <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Monthly Sales vs Target
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Apr – Sep 2026
                </p>
              </div>
              <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                RWF millions
              </span>
            </div>
            <SalesTrendChart />
          </div>

          {/* Overdue Follow-ups Feed */}
          <div className="xl:col-span-1">
            <OverdueFollowUpsFeed />
          </div>
        </div>

        {/* Rep performance row — only for managers/admins */}
        {canViewAllReps && (
          <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
            <div className="xl:col-span-1 bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Achievement by Rep
                </h3>
                <span className="text-[11px] text-muted-foreground">{monthLabel}</span>
              </div>
              <RepPerformanceChart selectedMonth={selectedMonth} />
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-positive" />
                  <span className="text-[11px] text-muted-foreground">≥80% on target</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-accent" />
                  <span className="text-[11px] text-muted-foreground">60–79% at risk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-negative" />
                  <span className="text-[11px] text-muted-foreground">&lt;60% critical</span>
                </div>
              </div>
            </div>

            <div className="xl:col-span-2">
              <RepTargetsTable selectedMonth={selectedMonth} monthLabel={monthLabel} />
            </div>
          </div>
        )}

        {/* Personal performance card — only for Sales Officers */}
        {!canViewAllReps && (() => {
          if (!myTarget) return null;
          const achievementColor =
            myTarget?.achievementPct >= 80
              ? 'text-positive'
              : myTarget?.achievementPct >= 60
              ? 'text-warning' :'text-negative';
          const barColor =
            myTarget?.achievementPct >= 80
              ? 'bg-positive'
              : myTarget?.achievementPct >= 60
              ? 'bg-accent' :'bg-negative';
          return (
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">My Performance — {monthLabel}</h3>
                <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {selectedMonth === '2026-09' ? 'Live' : 'Historical'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="bg-muted/40 rounded-lg p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Target</p>
                  <p className="text-xl font-bold text-foreground font-tabular">{formatRWF(myTarget?.target)}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Actual (RWF)</p>
                  <p className="text-xl font-bold text-foreground font-tabular">{formatRWF(myTarget?.actualSales)}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">KG Sold</p>
                  <p className="text-xl font-bold text-foreground font-tabular">{myTarget?.kgSold ? `${myTarget?.kgSold?.toLocaleString()} KG` : '—'}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Visits</p>
                  <p className="text-xl font-bold text-foreground font-tabular">{myTarget?.customerVisits}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Orders</p>
                  <p className="text-xl font-bold text-foreground font-tabular">{myTarget?.orders}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Achievement</span>
                  <span className={`text-sm font-bold font-tabular ${achievementColor}`}>
                    {myTarget?.achievementPct?.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full health-bar-fill ${barColor}`}
                    style={{ width: `${Math.min(myTarget?.achievementPct, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })()}

        {/* Pipeline summary */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              {canViewAllReps ? 'Active Pipeline Deals' : 'My Pipeline Deals'}
            </h3>
            <span className="text-[11px] text-muted-foreground">
              {visibleDeals?.length} open deal{visibleDeals?.length !== 1 ? 's' : ''}
            </span>
          </div>
          {visibleDeals?.length === 0 ? (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm">
              No active pipeline deals assigned to you.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                    {canViewAllReps && (
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Salesperson</th>
                    )}
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Stage</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Potential</th>
                    <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Probability</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Weighted</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Follow-up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visibleDeals?.map((deal) => {
                    const stageVariant =
                      deal?.stage === 'Closing' ? 'success'
                        : deal?.stage === 'Proposal' ? 'accent'
                        : deal?.stage === 'Contacted' ? 'info' : 'neutral';
                    return (
                      <tr key={`pipeline-${deal?.id}`} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{deal?.customer}</td>
                        {canViewAllReps && (
                          <td className="px-4 py-3 text-muted-foreground">{deal?.salesperson?.split(' ')?.[0]}</td>
                        )}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                              stageVariant === 'success' ? 'bg-positive/10 text-positive border-positive/20'
                                : stageVariant === 'accent' ? 'bg-accent/10 text-accent border-accent/20'
                                : stageVariant === 'info' ? 'bg-info/10 text-info border-info/20' : 'bg-muted text-muted-foreground border-border'
                            }`}
                          >
                            {deal?.stage}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-tabular text-foreground">
                          {deal?.potentialValue >= 1000000
                            ? `RWF ${(deal?.potentialValue / 1000000)?.toFixed(1)}M`
                            : `RWF ${(deal?.potentialValue / 1000)?.toFixed(0)}K`}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs font-semibold text-foreground font-tabular">{deal?.probability}%</span>
                            <div className="w-16 bg-muted rounded-full h-1">
                              <div
                                className="h-1 rounded-full bg-primary health-bar-fill"
                                style={{ width: `${deal?.probability}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-foreground font-tabular">
                          {deal?.weightedValue >= 1000000
                            ? `RWF ${(deal?.weightedValue / 1000000)?.toFixed(2)}M`
                            : `RWF ${(deal?.weightedValue / 1000)?.toFixed(0)}K`}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{deal?.followUpDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}