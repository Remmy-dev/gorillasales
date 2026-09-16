'use client';

import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,  } from 'recharts';
import { TrendingUp, TrendingDown, Minus, ChevronDown, Info } from 'lucide-react';
import { pipelineDeals, monthlyTargets, salesTrendData, SALESPEOPLE, PIPELINE_STAGES, formatRWF } from '@/lib/mockData';
import { useUser } from '@/context/UserContext';

// Historical close rates per stage (based on industry + mock data patterns)
const HISTORICAL_CLOSE_RATES: Record<string, number> = {
  Prospecting: 0.12,
  Contacted: 0.28,
  Proposal: 0.52,
  Closing: 0.81,
  Won: 1.0,
  Lost: 0.0,
};

// Rep performance multipliers derived from monthlyTargets achievement %
const REP_PERFORMANCE: Record<string, { achievementPct: number; trend: 'up' | 'down' | 'flat' }> = {
  'Alex Mugisha':      { achievementPct: 78.1, trend: 'flat' },
  'Frank Habimana':    { achievementPct: 62.5, trend: 'down' },
  'Grace Uwimana':     { achievementPct: 86.2, trend: 'up' },
  'Patrick Nzeyimana': { achievementPct: 61.0, trend: 'down' },
  'Diane Mukamana':    { achievementPct: 92.0, trend: 'up' },
};

function getRepMultiplier(rep: string): number {
  const perf = REP_PERFORMANCE[rep];
  if (!perf) return 0.75;
  return perf.achievementPct / 100;
}

interface ForecastPoint {
  period: string;
  base: number;
  optimistic: number;
  pessimistic: number;
  weighted: number;
}

interface StageBreakdown {
  stage: string;
  pipelineValue: number;
  closeRate: number;
  expectedRevenue: number;
  dealCount: number;
}

interface RepForecast {
  rep: string;
  pipelineValue: number;
  weightedForecast: number;
  achievementPct: number;
  trend: 'up' | 'down' | 'flat';
  confidence: number;
}

function buildMonthlyForecast(repFilter: string): ForecastPoint[] {
  const deals = repFilter
    ? pipelineDeals.filter((d) => d.salesperson === repFilter && d.stage !== 'Lost')
    : pipelineDeals.filter((d) => d.stage !== 'Lost');

  // Base weighted value from pipeline
  const baseWeighted = deals.reduce((s, d) => {
    const closeRate = HISTORICAL_CLOSE_RATES[d.stage] ?? 0;
    const repMult = getRepMultiplier(d.salesperson);
    return s + d.potentialValue * closeRate * repMult;
  }, 0);

  // Already won this month from salesTrendData (Sep actual so far)
  const wonThisMonth = deals
    .filter((d) => d.stage === 'Won')
    .reduce((s, d) => s + d.potentialValue, 0);

  const months = ['Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026', 'Jan 2027', 'Feb 2027'];
  const growthFactors = [1.0, 1.05, 1.08, 1.12, 0.95, 1.02]; // seasonal pattern

  return months.map((period, i) => {
    const factor = growthFactors[i];
    const base = Math.round((baseWeighted + wonThisMonth * 0.3) * factor);
    return {
      period,
      base,
      optimistic: Math.round(base * 1.22),
      pessimistic: Math.round(base * 0.72),
      weighted: Math.round(base * 1.05),
    };
  });
}

function buildQuarterlyForecast(repFilter: string): ForecastPoint[] {
  const monthly = buildMonthlyForecast(repFilter);
  const quarters = [
    { label: 'Q3 2026', months: [0] },
    { label: 'Q4 2026', months: [1, 2, 3] },
    { label: 'Q1 2027', months: [4, 5] },
  ];
  return quarters.map(({ label, months: idxs }) => {
    const sum = (key: keyof ForecastPoint) =>
      idxs.reduce((s, i) => s + (monthly[i][key] as number), 0);
    return {
      period: label,
      base: sum('base'),
      optimistic: sum('optimistic'),
      pessimistic: sum('pessimistic'),
      weighted: sum('weighted'),
    };
  });
}

function buildStageBreakdown(repFilter: string): StageBreakdown[] {
  return PIPELINE_STAGES.filter((s) => s !== 'Won' && s !== 'Lost').map((stage) => {
    const stageDeals = repFilter
      ? pipelineDeals.filter((d) => d.stage === stage && d.salesperson === repFilter)
      : pipelineDeals.filter((d) => d.stage === stage);
    const pipelineValue = stageDeals.reduce((s, d) => s + d.potentialValue, 0);
    const closeRate = HISTORICAL_CLOSE_RATES[stage] ?? 0;
    return {
      stage,
      pipelineValue,
      closeRate,
      expectedRevenue: Math.round(pipelineValue * closeRate),
      dealCount: stageDeals.length,
    };
  });
}

function buildRepForecasts(): RepForecast[] {
  return SALESPEOPLE.map((rep) => {
    const repDeals = pipelineDeals.filter((d) => d.salesperson === rep && d.stage !== 'Lost');
    const pipelineValue = repDeals.reduce((s, d) => s + d.potentialValue, 0);
    const weightedForecast = repDeals.reduce((s, d) => {
      const closeRate = HISTORICAL_CLOSE_RATES[d.stage] ?? 0;
      const repMult = getRepMultiplier(rep);
      return s + d.potentialValue * closeRate * repMult;
    }, 0);
    const perf = REP_PERFORMANCE[rep] ?? { achievementPct: 75, trend: 'flat' };
    const confidence = Math.min(95, Math.max(45, perf.achievementPct * 0.9 + 10));
    return {
      rep,
      pipelineValue,
      weightedForecast: Math.round(weightedForecast),
      achievementPct: perf.achievementPct,
      trend: perf.trend,
      confidence: Math.round(confidence),
    };
  });
}

const STAGE_COLORS_MAP: Record<string, string> = {
  Prospecting: '#94a3b8',
  Contacted: '#60a5fa',
  Proposal: '#fbbf24',
  Closing: '#f97316',
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-xs min-w-[160px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground capitalize">{p.name}</span>
          </span>
          <span className="font-semibold text-foreground font-tabular">{formatRWF(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function SalesForecastingPanel() {
  const { canViewAllReps, currentUser } = useUser();
  const [repFilter, setRepFilter] = useState<string>(canViewAllReps ? '' : currentUser.name);
  const [periodView, setPeriodView] = useState<'monthly' | 'quarterly'>('monthly');

  const monthlyData = buildMonthlyForecast(repFilter);
  const quarterlyData = buildQuarterlyForecast(repFilter);
  const chartData = periodView === 'monthly' ? monthlyData : quarterlyData;
  const stageBreakdown = buildStageBreakdown(repFilter);
  const repForecasts = buildRepForecasts();

  const totalForecast = chartData[0]?.weighted ?? 0;
  const totalOptimistic = chartData[0]?.optimistic ?? 0;
  const totalPessimistic = chartData[0]?.pessimistic ?? 0;

  const trendIcon = (trend: 'up' | 'down' | 'flat') => {
    if (trend === 'up') return <TrendingUp size={13} className="text-green-500" />;
    if (trend === 'down') return <TrendingDown size={13} className="text-red-500" />;
    return <Minus size={13} className="text-muted-foreground" />;
  };

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-accent" />
          <div>
            <h2 className="text-lg font-bold text-foreground">Sales Forecast</h2>
            <p className="text-xs text-muted-foreground">Weighted pipeline × historical close rates × rep performance</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Period toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1 gap-0.5">
            <button
              onClick={() => setPeriodView('monthly')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                periodView === 'monthly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriodView('quarterly')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                periodView === 'quarterly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Quarterly
            </button>
          </div>
          {/* Rep filter (managers only) */}
          {canViewAllReps && (
            <div className="relative">
              <select
                value={repFilter}
                onChange={(e) => setRepFilter(e.target.value)}
                className="border border-border rounded-lg px-3 py-2 text-xs bg-card text-foreground appearance-none pr-7 focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <option value="">All Reps</option>
                {SALESPEOPLE.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* Summary KPI strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            {periodView === 'monthly' ? 'Sep Forecast' : 'Q3 Forecast'}
          </p>
          <p className="text-xl font-bold text-accent font-tabular">{formatRWF(totalForecast)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Weighted projection</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Optimistic</p>
          <p className="text-xl font-bold text-green-600 font-tabular">{formatRWF(totalOptimistic)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">+22% upside band</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Conservative</p>
          <p className="text-xl font-bold text-orange-500 font-tabular">{formatRWF(totalPessimistic)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">−28% downside band</p>
        </div>
      </div>

      {/* Forecast chart with confidence bands */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {periodView === 'monthly' ? 'Monthly' : 'Quarterly'} Revenue Projection
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Shaded area = confidence band (pessimistic → optimistic)</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-2 py-1 rounded-lg">
            <Info size={11} />
            <span>Based on {pipelineDeals.filter(d => d.stage !== 'Lost').length} active deals</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="optimisticGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="pessimisticGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="weightedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatRWF(v)}
              width={72}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            />
            {/* Confidence band — optimistic */}
            <Area
              type="monotone"
              dataKey="optimistic"
              name="optimistic"
              stroke="#22c55e"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              fill="url(#optimisticGrad)"
              dot={false}
            />
            {/* Confidence band — pessimistic */}
            <Area
              type="monotone"
              dataKey="pessimistic"
              name="pessimistic"
              stroke="#f97316"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              fill="url(#pessimisticGrad)"
              dot={false}
            />
            {/* Weighted forecast — main line */}
            <Area
              type="monotone"
              dataKey="weighted"
              name="weighted"
              stroke="var(--accent)"
              strokeWidth={2.5}
              fill="url(#weightedGrad)"
              dot={{ r: 4, fill: 'var(--accent)', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Stage close rate breakdown */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Expected Revenue by Stage</h3>
          <p className="text-xs text-muted-foreground mb-4">Pipeline value × historical close rate per stage</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stageBreakdown} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="stage" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatRWF(v)}
                width={68}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="expectedRevenue" name="expected" radius={[4, 4, 0, 0]}>
                {stageBreakdown.map((entry) => (
                  <Cell key={entry.stage} fill={STAGE_COLORS_MAP[entry.stage] ?? '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Stage close rate legend */}
          <div className="mt-3 space-y-1.5">
            {stageBreakdown.map((s) => (
              <div key={s.stage} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: STAGE_COLORS_MAP[s.stage] ?? '#94a3b8' }} />
                  <span className="text-muted-foreground">{s.stage}</span>
                  <span className="text-muted-foreground/60">({s.dealCount} deals)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">{Math.round(s.closeRate * 100)}% close rate</span>
                  <span className="font-semibold text-foreground font-tabular">{formatRWF(s.expectedRevenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rep performance trends */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">Rep Performance & Forecast</h3>
          <p className="text-xs text-muted-foreground mb-4">Weighted pipeline forecast adjusted by rep achievement trend</p>
          <div className="space-y-3">
            {repForecasts.map((rep) => {
              const confColor =
                rep.confidence >= 80 ? 'text-green-600' :
                rep.confidence >= 65 ? 'text-amber-600' : 'text-red-500';
              const barColor =
                rep.achievementPct >= 85 ? 'bg-green-500' :
                rep.achievementPct >= 70 ? 'bg-accent' :
                rep.achievementPct >= 55 ? 'bg-amber-500' : 'bg-red-400';
              return (
                <div key={rep.rep} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent shrink-0">
                        {rep.rep.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className="text-xs font-semibold text-foreground">{rep.rep}</span>
                      {trendIcon(rep.trend)}
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-muted-foreground font-tabular">{formatRWF(rep.weightedForecast)}</span>
                      <span className={`font-semibold ${confColor}`}>{rep.confidence}% conf.</span>
                    </div>
                  </div>
                  {/* Achievement bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${barColor} transition-all`}
                        style={{ width: `${Math.min(100, rep.achievementPct)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-tabular w-10 text-right">
                      {rep.achievementPct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confidence legend */}
          <div className="mt-4 pt-3 border-t border-border flex items-center gap-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" />≥80% high confidence</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />65–79% moderate</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" />&lt;65% low</span>
          </div>
        </div>
      </div>
    </div>
  );
}
