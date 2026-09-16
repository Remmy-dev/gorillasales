'use client';

import React, { useState, useMemo } from 'react';
import SalesEntryForm from './SalesEntryForm';
import RecentEntriesTable from './RecentEntriesTable';
import { visitLogs, VisitLog, SALESPEOPLE } from '@/lib/mockData';
import { ClipboardList, TrendingUp, ChevronDown } from 'lucide-react';
import { useUser } from '@/context/UserContext';

export default function DailySalesEntryClient() {
  const { currentUser, canViewAllReps } = useUser();
  const [entries, setEntries] = useState<VisitLog[]>(visitLogs);
  const [selectedRep, setSelectedRep] = useState<string>(canViewAllReps ? '' : currentUser.name);

  const effectiveRep = canViewAllReps ? selectedRep : currentUser.name;

  const handleSubmitSuccess = (
    entry: Omit<VisitLog, 'timestamp'> & { salesValue: number; id: string }
  ) => {
    const newEntry: VisitLog = {
      ...entry,
      timestamp: new Date().toISOString(),
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const visibleEntries = useMemo(() => {
    if (!effectiveRep) return entries;
    return entries.filter((e) => e.salesperson === effectiveRep);
  }, [entries, effectiveRep]);

  const todayEntries = visibleEntries.filter((e) => e.dateOfVisit === '2026-09-04');
  const todaySales = todayEntries.reduce((s, e) => s + e.salesValue, 0);
  const todayOrders = todayEntries.filter((e) => e.visitOutcome === 'Order Placed').length;

  return (
    <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Daily Sales Entry</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {canViewAllReps
              ? 'Log and review field visit outcomes — Sep 4, 2026'
              : `Log your field visit outcomes — Sep 4, 2026`}
          </p>
        </div>

        {/* Salesperson selector for managers/admins */}
        {canViewAllReps && (
          <div className="shrink-0">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Viewing Rep</label>
            <div className="relative">
              <select
                value={selectedRep}
                onChange={(e) => setSelectedRep(e.target.value)}
                className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-accent/40 pr-8 min-w-[160px]"
              >
                <option value="">All Reps</option>
                {SALESPEOPLE.map((sp) => (
                  <option key={sp} value={sp}>{sp}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Today's summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <ClipboardList size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Visits Today
            </p>
            <p className="text-2xl font-bold text-foreground font-tabular">
              {todayEntries.length}
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <TrendingUp size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Sales Today
            </p>
            <p className="text-2xl font-bold text-foreground font-tabular">
              {todaySales >= 1000000
                ? `RWF ${(todaySales / 1000000).toFixed(2)}M`
                : `RWF ${(todaySales / 1000).toFixed(0)}K`}
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-positive/10 flex items-center justify-center shrink-0">
            <ClipboardList size={18} className="text-positive" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Orders Today
            </p>
            <p className="text-2xl font-bold text-foreground font-tabular">
              {todayOrders}
            </p>
          </div>
        </div>
      </div>

      {/* Form — only show for the current user's own entries */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-accent rounded-full" />
          <h2 className="text-base font-semibold text-foreground">Log New Visit</h2>
        </div>
        <SalesEntryForm onSubmitSuccess={handleSubmitSuccess} />
      </div>

      {/* Recent entries table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <h2 className="text-base font-semibold text-foreground">
              {canViewAllReps && !effectiveRep ? 'All Visit Logs' : effectiveRep ? `${effectiveRep.split(' ')[0]}'s Visit Logs` : 'My Visit Logs'}
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">{visibleEntries.length} entries</span>
        </div>
        <RecentEntriesTable entries={visibleEntries} onDelete={handleDelete} />
      </div>
    </div>
  );
}