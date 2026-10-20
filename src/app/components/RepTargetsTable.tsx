'use client';

import React from 'react';
import { getMonthTargets, formatRWF } from '@/lib/mockData';
import { useUser } from '@/context/UserContext';

interface RepTargetsTableProps {
  selectedMonth: string;
  monthLabel: string;
}

export default function RepTargetsTable({ selectedMonth, monthLabel }: RepTargetsTableProps) {
  const { currentUser, canViewAllReps } = useUser();
  const allTargets = getMonthTargets(selectedMonth);

  const visibleTargets = canViewAllReps
    ? allTargets
    : allTargets?.filter((t) => t?.salesperson === currentUser?.name);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {canViewAllReps ? `Rep Performance — ${monthLabel}` : `My Performance — ${monthLabel}`}
        </h3>
        <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {selectedMonth === '2026-09' ? 'Live' : 'Historical'}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Salesperson
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Target
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Actual (RWF)
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                KG Sold
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Achievement
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Visits
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Orders
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                New Cust.
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Follow-ups
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visibleTargets?.map((rep) => {
              const achievementColor =
                rep?.achievementPct >= 80
                  ? 'text-positive'
                  : rep?.achievementPct >= 60
                  ? 'text-warning' : 'text-negative';
              const barColor =
                rep?.achievementPct >= 80
                  ? 'bg-positive'
                  : rep?.achievementPct >= 60
                  ? 'bg-accent' : 'bg-negative';
              return (
                <tr
                  key={`rep-row-${rep?.id}`}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {rep?.salesperson?.split(' ')?.map((n) => n?.[0])?.join('')}
                      </div>
                      <span className="font-medium text-foreground text-sm">
                        {rep?.salesperson}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-muted-foreground font-tabular">
                    {formatRWF(rep?.target)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-foreground font-tabular">
                    {formatRWF(rep?.actualSales)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-foreground font-tabular">
                    {rep?.kgSold ? `${rep.kgSold.toLocaleString()} KG` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-sm font-bold ${achievementColor} font-tabular`}>
                        {rep?.achievementPct?.toFixed(1)}%
                      </span>
                      <div className="w-full bg-muted rounded-full h-1.5 min-w-[80px]">
                        <div
                          className={`h-1.5 rounded-full health-bar-fill ${barColor}`}
                          style={{ width: `${Math.min(rep?.achievementPct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-foreground font-tabular">
                    {rep?.customerVisits}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-foreground font-tabular">
                    {rep?.orders}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {rep?.newCustomers > 0 ? (
                      <span className="text-sm font-semibold text-positive font-tabular">
                        +{rep?.newCustomers}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {rep?.outstandingFollowUps > 0 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-negative/10 text-negative text-xs font-bold">
                        {rep?.outstandingFollowUps}
                      </span>
                    ) : (
                      <span className="text-sm text-positive">✓</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}