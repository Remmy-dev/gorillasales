'use client';

import React, { useState, useMemo } from 'react';
import {
  Trophy,
  TrendingUp,
  Users,
  UserPlus,
  Target,
  ChevronDown,
  Medal,
  Zap,
  Award,
  Star,
} from 'lucide-react';
import { visitLogs, SALESPEOPLE, pipelineDeals, formatRWF, getMonthTargets, AVAILABLE_MONTHS } from '@/lib/mockData';
import { useUser } from '@/context/UserContext';

const MONTHS_LABEL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface RepMetrics {
  name: string;
  initials: string;
  totalSales: number;
  target: number;
  achievementPct: number;
  totalVisits: number;
  ordersPlaced: number;
  conversionRate: number;
  newCustomers: number;
  kgSold: number;
  pipelineValue: number;
  weightedPipeline: number;
  followUps: number;
}

function buildLeaderboard(monthKey: string): RepMetrics[] {
  const targets = getMonthTargets(monthKey);
  const [year, month] = monthKey.split('-').map(Number);

  return SALESPEOPLE.map((name) => {
    const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    const repTarget = targets?.find((t) => t?.salesperson === name);
    const totalSales = repTarget?.actualSales ?? 0;
    const target = repTarget?.target ?? 0;
    const achievementPct = target > 0 ? (totalSales / target) * 100 : 0;
    const newCustomers = repTarget?.newCustomers ?? 0;
    const kgSold = repTarget?.kgSold ?? 0;

    const repLogs = visitLogs.filter((v) => {
      const d = new Date(v.dateOfVisit);
      return v.salesperson === name && d.getFullYear() === year && d.getMonth() === month - 1;
    });
    const totalVisits = repLogs.length;
    const ordersPlaced = repLogs.filter((v) => v.visitOutcome === 'Order Placed').length;
    const conversionRate = totalVisits > 0 ? (ordersPlaced / totalVisits) * 100 : 0;
    const followUps = repLogs.filter((v) => v.visitOutcome === 'Follow-up Required').length;

    const repDeals = pipelineDeals?.filter((d) => d?.salesperson === name);
    const pipelineValue = repDeals?.reduce((s, d) => s + d?.potentialValue, 0) ?? 0;
    const weightedPipeline = repDeals?.reduce((s, d) => s + d?.weightedValue, 0) ?? 0;

    return { name, initials, totalSales, target, achievementPct, totalVisits, ordersPlaced, conversionRate, newCustomers, kgSold, pipelineValue, weightedPipeline, followUps };
  });
}

type SortKey = 'achievementPct' | 'totalSales' | 'pipelineValue' | 'newCustomers' | 'conversionRate' | 'kgSold';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'achievementPct', label: 'Achievement %' },
  { key: 'totalSales', label: 'Total Sales' },
  { key: 'pipelineValue', label: 'Pipeline Value' },
  { key: 'newCustomers', label: 'New Customers' },
  { key: 'conversionRate', label: 'Conversion Rate' },
  { key: 'kgSold', label: 'KG Sold' },
];

const RANK_COLORS = [
  { bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-400', text: 'text-amber-700', ring: 'ring-amber-300' },
  { bg: 'bg-slate-50 border-slate-200', badge: 'bg-slate-400', text: 'text-slate-600', ring: 'ring-slate-300' },
  { bg: 'bg-orange-50 border-orange-200', badge: 'bg-orange-400', text: 'text-orange-700', ring: 'ring-orange-300' },
];

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardClient() {
  const { canViewAllReps, currentUser } = useUser();
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [sortKey, setSortKey] = useState<SortKey>('achievementPct');

  const monthLabel = AVAILABLE_MONTHS?.find((m) => m?.value === selectedMonth)?.label ?? 'Sep 2026';

  const allMetrics = useMemo(() => buildLeaderboard(selectedMonth), [selectedMonth]);

  const ranked = useMemo(
    () => [...allMetrics].sort((a, b) => b[sortKey] - a[sortKey]),
    [allMetrics, sortKey]
  );

  // For Sales Officers: show their own rank card prominently
  const myRank = ranked.findIndex((r) => r.name === currentUser.name) + 1;
  const myMetrics = ranked.find((r) => r.name === currentUser.name);

  const topThree = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  function getAchievementColor(pct: number) {
    if (pct >= 100) return 'text-positive';
    if (pct >= 75) return 'text-amber-600';
    if (pct >= 50) return 'text-orange-500';
    return 'text-negative';
  }

  function getAchievementBarColor(pct: number) {
    if (pct >= 100) return 'bg-positive';
    if (pct >= 75) return 'bg-amber-400';
    if (pct >= 50) return 'bg-orange-400';
    return 'bg-negative';
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-screen-xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Trophy size={22} className="text-amber-500" />
            Team Leaderboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ranked rep achievement, pipeline value, and customer acquisition — {monthLabel}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Sort selector */}
          <div className="relative">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="appearance-none bg-card border border-border text-sm text-foreground rounded-lg pl-3 pr-8 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 font-medium"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>Rank by: {o.label}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          {/* Month selector */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-card border border-border text-sm text-foreground rounded-lg pl-3 pr-8 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 font-medium"
            >
              {AVAILABLE_MONTHS?.map((m) => (
                <option key={m?.value} value={m?.value}>{m?.label}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* My rank banner — for Sales Officers */}
      {!canViewAllReps && myMetrics && (
        <div className="bg-primary rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center text-lg font-bold text-primary-foreground shrink-0">
            {myRank <= 3 ? RANK_MEDALS[myRank - 1] : `#${myRank}`}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-primary-foreground/70 text-xs font-semibold uppercase tracking-widest">Your Rank</p>
            <p className="text-primary-foreground font-bold text-lg">{myMetrics.name}</p>
            <p className="text-primary-foreground/60 text-xs mt-0.5">
              {myMetrics.achievementPct.toFixed(1)}% achievement · {formatRWF(myMetrics.totalSales)} sales · {myMetrics.newCustomers} new customers
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-primary-foreground/50 text-xs">Achievement</p>
            <p className={`text-2xl font-bold font-tabular ${myMetrics.achievementPct >= 80 ? 'text-accent' : 'text-primary-foreground'}`}>
              {myMetrics.achievementPct.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Top 3 podium */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {topThree.map((rep, idx) => {
          const colors = RANK_COLORS[idx] ?? RANK_COLORS[2];
          return (
            <div
              key={rep.name}
              className={`relative border rounded-xl p-5 flex flex-col gap-3 ${colors.bg} ${idx === 0 ? 'sm:order-2' : idx === 1 ? 'sm:order-1' : 'sm:order-3'}`}
            >
              {/* Rank badge */}
              <div className="flex items-center justify-between">
                <span className="text-2xl">{RANK_MEDALS[idx]}</span>
                {idx === 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                    <Star size={9} fill="currentColor" /> Top Performer
                  </span>
                )}
              </div>

              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full ${colors.badge} flex items-center justify-center text-white font-bold text-sm shrink-0 ring-2 ${colors.ring}`}>
                  {rep.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground truncate">{rep.name}</p>
                  <p className={`text-xs font-semibold ${colors.text}`}>Rank #{idx + 1}</p>
                </div>
              </div>

              {/* Achievement bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Achievement</span>
                  <span className={`font-bold ${getAchievementColor(rep.achievementPct)}`}>
                    {rep.achievementPct.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getAchievementBarColor(rep.achievementPct)}`}
                    style={{ width: `${Math.min(rep.achievementPct, 100)}%` }}
                  />
                </div>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-white/50 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Sales</p>
                  <p className="text-sm font-bold text-foreground font-tabular mt-0.5">{formatRWF(rep.totalSales)}</p>
                </div>
                <div className="bg-white/50 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Pipeline</p>
                  <p className="text-sm font-bold text-foreground font-tabular mt-0.5">{formatRWF(rep.pipelineValue)}</p>
                </div>
                <div className="bg-white/50 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">New Customers</p>
                  <p className="text-sm font-bold text-foreground font-tabular mt-0.5">{rep.newCustomers}</p>
                </div>
                <div className="bg-white/50 rounded-lg p-2.5">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Conversion</p>
                  <p className="text-sm font-bold text-foreground font-tabular mt-0.5">{rep.conversionRate.toFixed(0)}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full rankings table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Medal size={16} className="text-accent" />
          <h2 className="text-sm font-semibold text-foreground">Full Rankings — {monthLabel}</h2>
          <span className="text-xs text-muted-foreground ml-auto">Sorted by: {SORT_OPTIONS.find((o) => o.key === sortKey)?.label}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-center px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-14">Rank</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rep</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <span className="flex items-center justify-center gap-1"><Target size={11} /> Achievement</span>
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <span className="flex items-center justify-end gap-1"><TrendingUp size={11} /> Sales (RWF)</span>
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                  Pipeline
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                  <span className="flex items-center justify-center gap-1"><UserPlus size={11} /> New Cust.</span>
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                  <span className="flex items-center justify-center gap-1"><Zap size={11} /> Conversion</span>
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                  <span className="flex items-center justify-center gap-1"><Users size={11} /> Visits</span>
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                  KG Sold
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ranked.map((rep, idx) => {
                const isMe = rep.name === currentUser.name;
                const isTop = idx === 0;
                return (
                  <tr
                    key={rep.name}
                    className={`hover:bg-muted/30 transition-colors ${isTop ? 'bg-amber-50/40' : ''} ${isMe && !canViewAllReps ? 'bg-accent/5 ring-1 ring-inset ring-accent/20' : ''}`}
                  >
                    <td className="px-3 py-3.5 text-center">
                      {idx < 3 ? (
                        <span className="text-xl leading-none">{RANK_MEDALS[idx]}</span>
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">#{idx + 1}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isTop ? 'bg-amber-400 text-white' : 'bg-primary/15 text-primary'}`}>
                          {rep.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{rep.name}</p>
                          {isMe && !canViewAllReps && (
                            <p className="text-[10px] text-accent font-semibold">You</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-xs font-bold ${getAchievementColor(rep.achievementPct)}`}>
                          {rep.achievementPct.toFixed(1)}%
                        </span>
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getAchievementBarColor(rep.achievementPct)}`}
                            style={{ width: `${Math.min(rep.achievementPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-foreground font-tabular">
                      {rep.totalSales > 0 ? formatRWF(rep.totalSales) : <span className="text-muted-foreground font-normal">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-right text-muted-foreground font-tabular hidden sm:table-cell">
                      {rep.pipelineValue > 0 ? formatRWF(rep.pipelineValue) : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-center hidden md:table-cell">
                      <span className={`font-semibold ${rep.newCustomers > 0 ? 'text-positive' : 'text-muted-foreground'}`}>
                        {rep.newCustomers > 0 ? `+${rep.newCustomers}` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center hidden md:table-cell">
                      <span className="text-sm font-semibold text-foreground">
                        {rep.conversionRate.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center text-muted-foreground hidden lg:table-cell">
                      {rep.totalVisits}
                    </td>
                    <td className="px-4 py-3.5 text-center text-muted-foreground hidden lg:table-cell">
                      {rep.kgSold > 0 ? `${rep.kgSold.toLocaleString()} KG` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary insight cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Top Achiever',
            value: ranked[0]?.name?.split(' ')?.[0] ?? '—',
            sub: `${ranked[0]?.achievementPct?.toFixed(1)}% achievement`,
            icon: <Trophy size={16} className="text-amber-500" />,
            color: 'border-amber-200 bg-amber-50/50',
          },
          {
            label: 'Most New Customers',
            value: [...ranked].sort((a, b) => b.newCustomers - a.newCustomers)[0]?.name?.split(' ')?.[0] ?? '—',
            sub: `${[...ranked].sort((a, b) => b.newCustomers - a.newCustomers)[0]?.newCustomers ?? 0} acquired`,
            icon: <UserPlus size={16} className="text-positive" />,
            color: 'border-positive/20 bg-positive/5',
          },
          {
            label: 'Best Conversion',
            value: [...ranked].sort((a, b) => b.conversionRate - a.conversionRate)[0]?.name?.split(' ')?.[0] ?? '—',
            sub: `${[...ranked].sort((a, b) => b.conversionRate - a.conversionRate)[0]?.conversionRate?.toFixed(0) ?? 0}% rate`,
            icon: <Zap size={16} className="text-accent" />,
            color: 'border-accent/20 bg-accent/5',
          },
          {
            label: 'Largest Pipeline',
            value: [...ranked].sort((a, b) => b.pipelineValue - a.pipelineValue)[0]?.name?.split(' ')?.[0] ?? '—',
            sub: formatRWF([...ranked].sort((a, b) => b.pipelineValue - a.pipelineValue)[0]?.pipelineValue ?? 0),
            icon: <Award size={16} className="text-violet-500" />,
            color: 'border-violet-200 bg-violet-50/50',
          },
        ].map((card) => (
          <div key={card.label} className={`border rounded-xl p-4 ${card.color}`}>
            <div className="flex items-center gap-2 mb-2">
              {card.icon}
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{card.label}</p>
            </div>
            <p className="text-base font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
