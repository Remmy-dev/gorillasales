'use client';

// Centralized config store for all lookup tables
// This is the single source of truth for all dropdowns across the app.
// In production, replace with API calls to your database config tables.

export interface ConfigItem {
  id: string;
  label: string;
  sortOrder?: number;
  meta?: string; // e.g. probability % for pipeline stages
}

// Monthly target per rep per period
export interface RepMonthlyTarget {
  id: string;
  repName: string;
  month: number;   // 0-11
  year: number;
  targetAmount: number; // RWF
  targetWeightKg: number; // KG
}

// Commission / bonus rule
export interface CommissionRule {
  id: string;
  name: string;          // e.g. "Base Commission"
  type: 'percentage' | 'flat';
  value: number;         // % or flat RWF
  thresholdPct: number;  // achievement % at which rule activates (0 = always)
  description: string;
  sortOrder: number;
}

export interface ConfigStore {
  salespeople: ConfigItem[];
  customerCategories: ConfigItem[];
  visitOutcomes: ConfigItem[];
  paymentStatuses: ConfigItem[];
  productNames: ConfigItem[];
  pipelineStages: ConfigItem[];
  monthlyTargets: RepMonthlyTarget[];
  commissionRules: CommissionRule[];
}

// Seeded defaults — coffee distribution business
export const DEFAULT_CONFIG: ConfigStore = {
  salespeople: [
    { id: 'sp-1', label: 'Karenzi Remmy', sortOrder: 1 },
    { id: 'sp-2', label: 'Alex Mushumba', sortOrder: 2 },
    { id: 'sp-3', label: 'Isimbi Patience', sortOrder: 3 },
    { id: 'sp-4', label: 'Mastiko Frank', sortOrder: 4 },
    { id: 'sp-5', label: 'Muyenzi Dan', sortOrder: 5 },
  ],
  customerCategories: [
    { id: 'cc-1', label: 'Hotels', sortOrder: 1 },
    { id: 'cc-2', label: 'Coffee Shops', sortOrder: 2 },
    { id: 'cc-3', label: 'Wholesalers', sortOrder: 3 },
    { id: 'cc-4', label: 'Supermarkets', sortOrder: 4 },
    { id: 'cc-5', label: 'Shops', sortOrder: 5 },
    { id: 'cc-6', label: 'Stores', sortOrder: 6 },
    { id: 'cc-7', label: 'Galleries', sortOrder: 7 },
    { id: 'cc-8', label: 'Offices', sortOrder: 8 },
  ],
  visitOutcomes: [
    { id: 'vo-1', label: 'Order Placed', sortOrder: 1 },
    { id: 'vo-2', label: 'No Order / Visit Only', sortOrder: 2 },
    { id: 'vo-3', label: 'Follow-up Required', sortOrder: 3 },
    { id: 'vo-4', label: 'Sample Delivered', sortOrder: 4 },
    { id: 'vo-5', label: 'Complaint Logged', sortOrder: 5 },
  ],
  paymentStatuses: [
    { id: 'ps-1', label: 'Paid', sortOrder: 1 },
    { id: 'ps-2', label: 'Credit', sortOrder: 2 },
    { id: 'ps-3', label: 'Pending', sortOrder: 3 },
    { id: 'ps-4', label: 'Overdue', sortOrder: 4 },
    { id: 'ps-5', label: 'Partial Payment', sortOrder: 5 },
  ],
  productNames: [
    { id: 'pn-1', label: '250G Roasted Coffee', sortOrder: 1 },
    { id: 'pn-2', label: '500G MG', sortOrder: 2 },
    { id: 'pn-3', label: '1KG Roasted Coffee', sortOrder: 3 },
    { id: 'pn-4', label: 'Instant Coffee Sachets', sortOrder: 4 },
    { id: 'pn-5', label: 'Green Coffee Beans', sortOrder: 5 },
    { id: 'pn-6', label: 'Coffee Pods 10-pack', sortOrder: 6 },
    { id: 'pn-7', label: 'Espresso Blend 250G', sortOrder: 7 },
    { id: 'pn-8', label: 'Cold Brew Concentrate 500ML', sortOrder: 8 },
  ],
  pipelineStages: [
    { id: 'pl-1', label: 'Lead', sortOrder: 1, meta: '10' },
    { id: 'pl-2', label: 'Contacted', sortOrder: 2, meta: '25' },
    { id: 'pl-3', label: 'Proposal Sent', sortOrder: 3, meta: '40' },
    { id: 'pl-4', label: 'Negotiation', sortOrder: 4, meta: '65' },
    { id: 'pl-5', label: 'Closing', sortOrder: 5, meta: '80' },
    { id: 'pl-6', label: 'Won', sortOrder: 6, meta: '100' },
    { id: 'pl-7', label: 'Lost', sortOrder: 7, meta: '0' },
  ],
  monthlyTargets: [
    { id: 'mt-1', repName: 'Karenzi Remmy',   month: new Date().getMonth(), year: new Date().getFullYear(), targetAmount: 4000000, targetWeightKg: 500 },
    { id: 'mt-2', repName: 'Alex Mushumba',   month: new Date().getMonth(), year: new Date().getFullYear(), targetAmount: 3800000, targetWeightKg: 480 },
    { id: 'mt-3', repName: 'Isimbi Patience', month: new Date().getMonth(), year: new Date().getFullYear(), targetAmount: 3200000, targetWeightKg: 400 },
    { id: 'mt-4', repName: 'Mastiko Frank',   month: new Date().getMonth(), year: new Date().getFullYear(), targetAmount: 3500000, targetWeightKg: 440 },
    { id: 'mt-5', repName: 'Muyenzi Dan',     month: new Date().getMonth(), year: new Date().getFullYear(), targetAmount: 3600000, targetWeightKg: 450 },
  ],
  commissionRules: [
    { id: 'cr-1', name: 'Base Commission',       type: 'percentage', value: 2,       thresholdPct: 0,   description: 'Earned on all sales regardless of target', sortOrder: 1 },
    { id: 'cr-2', name: 'Target Bonus',          type: 'percentage', value: 3,       thresholdPct: 100, description: 'Extra % when monthly target is fully met', sortOrder: 2 },
    { id: 'cr-3', name: 'Stretch Bonus',         type: 'percentage', value: 1.5,     thresholdPct: 120, description: 'Additional % for exceeding target by 20%', sortOrder: 3 },
    { id: 'cr-4', name: 'Top Performer Bonus',   type: 'flat',       value: 50000,   thresholdPct: 150, description: 'Flat RWF bonus for 150%+ achievement', sortOrder: 4 },
  ],
};

// localStorage key
const STORAGE_KEY = 'gorillasales_config';

export function loadConfig(): ConfigStore {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as ConfigStore;
      // Backfill new keys that may not exist in older stored configs
      const monthlyTargets = (parsed.monthlyTargets ?? DEFAULT_CONFIG.monthlyTargets).map((t) => ({
        ...t,
        targetWeightKg: t.targetWeightKg ?? 0,
      }));
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        monthlyTargets,
        commissionRules: parsed.commissionRules ?? DEFAULT_CONFIG.commissionRules,
      };
    }
  } catch {
    // ignore
  }
  return DEFAULT_CONFIG;
}

export function saveConfig(config: ConfigStore): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/** Get the target amount for a rep in a given month/year. Falls back to 3 000 000. */
export function getRepTarget(targets: RepMonthlyTarget[], repName: string, month: number, year: number): number {
  const match = targets.find(t => t.repName === repName && t.month === month && t.year === year);
  if (match) return match.targetAmount;
  // Fallback: most recent target for this rep regardless of period
  const repTargets = targets.filter(t => t.repName === repName).sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.month - a.month;
  });
  return repTargets[0]?.targetAmount ?? 3000000;
}

/** Get the weight target (KG) for a rep in a given month/year. Falls back to 0. */
export function getRepTargetWeight(targets: RepMonthlyTarget[], repName: string, month: number, year: number): number {
  const match = targets.find(t => t.repName === repName && t.month === month && t.year === year);
  if (match) return match.targetWeightKg ?? 0;
  const repTargets = targets.filter(t => t.repName === repName).sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.month - a.month;
  });
  return repTargets[0]?.targetWeightKg ?? 0;
}
