'use client';

import React, { useState, useEffect } from 'react';
import { useConfig } from '@/context/ConfigContext';
import { ConfigStore } from '@/lib/configStore';
import LookupTableEditor from './LookupTableEditor';
import MonthlyTargetsEditor from './MonthlyTargetsEditor';
import CommissionRulesEditor from './CommissionRulesEditor';
import {
  Users,
  Tag,
  CheckSquare,
  CreditCard,
  Package,
  TrendingUp,
  RotateCcw,
  CheckCircle,
  Info,
  Target,
  DollarSign,
  List,
} from 'lucide-react';
import { DEFAULT_CONFIG } from '@/lib/configStore';

type TabId = 'lookup' | 'targets' | 'commission';

const TABS: { id: TabId; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'lookup',
    label: 'Lookup Tables',
    icon: <List size={15} />,
    description: 'Manage all dropdown lists: salespeople, categories, outcomes, statuses, products, and pipeline stages.',
  },
  {
    id: 'targets',
    label: 'Monthly Targets',
    icon: <Target size={15} />,
    description: 'Set individual monthly sales targets (RWF) per rep per period.',
  },
  {
    id: 'commission',
    label: 'Commission & Bonuses',
    icon: <DollarSign size={15} />,
    description: 'Define commission percentages and flat bonuses triggered at achievement thresholds.',
  },
];

export default function ConfigAdminClient() {
  const { config, updateConfig } = useConfig();
  const [saved, setSaved] = useState(false);
  const [localConfig, setLocalConfig] = useState<ConfigStore>(config);
  const [activeTab, setActiveTab] = useState<TabId>('lookup');

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleChange = (key: keyof ConfigStore) => (items: ConfigStore[keyof ConfigStore]) => {
    const next = { ...localConfig, [key]: items };
    setLocalConfig(next);
    updateConfig(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all configuration to factory defaults? This cannot be undone.')) {
      setLocalConfig(DEFAULT_CONFIG);
      updateConfig(DEFAULT_CONFIG);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const lookupSections = [
    {
      key: 'salespeople' as keyof ConfigStore,
      title: 'Salespeople',
      description: 'Active sales representatives. Used in all assignment dropdowns.',
      icon: <Users size={16} />,
      idPrefix: 'sp',
      showMeta: false,
      accentColor: 'bg-accent',
    },
    {
      key: 'customerCategories' as keyof ConfigStore,
      title: 'Customer Categories',
      description: 'Segment customers by channel (e.g. Supermarket, Hotel, Wholesale).',
      icon: <Tag size={16} />,
      idPrefix: 'cc',
      showMeta: false,
      accentColor: 'bg-accent',
    },
    {
      key: 'visitOutcomes' as keyof ConfigStore,
      title: 'Visit Outcomes',
      description: 'Possible results of a field sales visit.',
      icon: <CheckSquare size={16} />,
      idPrefix: 'vo',
      showMeta: false,
      accentColor: 'bg-accent',
    },
    {
      key: 'paymentStatuses' as keyof ConfigStore,
      title: 'Payment Statuses',
      description: 'Payment state for each order (e.g. Paid, Credit, Pending).',
      icon: <CreditCard size={16} />,
      idPrefix: 'ps',
      showMeta: false,
      accentColor: 'bg-accent',
    },
    {
      key: 'productNames' as keyof ConfigStore,
      title: 'Product Names',
      description: 'Coffee products available for sale. Used in daily entry product dropdown.',
      icon: <Package size={16} />,
      idPrefix: 'pn',
      showMeta: false,
      accentColor: 'bg-accent',
    },
    {
      key: 'pipelineStages' as keyof ConfigStore,
      title: 'Pipeline Stages',
      description: 'Ordered deal stages for the sales pipeline. Set default probability % per stage.',
      icon: <TrendingUp size={16} />,
      idPrefix: 'pl',
      showMeta: true,
      metaLabel: 'Probability',
      metaPlaceholder: '% e.g. 40',
      accentColor: 'bg-accent',
    },
  ];

  const activeTabInfo = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">Admin Configuration</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Centrally manage all business rules, targets, and lookup tables — no code changes required.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1.5 text-positive text-xs font-semibold px-3 py-1.5 bg-positive-bg rounded-lg border border-positive/20">
              <CheckCircle size={13} />
              Saved
            </span>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-muted-foreground text-xs font-medium hover:bg-muted/50 hover:text-foreground transition-colors"
          >
            <RotateCcw size={13} />
            Reset to defaults
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-5 border-b border-border">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-accent text-accent' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div className="mb-5 px-4 py-3 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-2.5">
        <Info size={15} className="text-accent shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/80">{activeTabInfo.description}</p>
      </div>

      {/* Tab content */}
      {activeTab === 'lookup' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {lookupSections.map((section) => (
            <div key={section.key} className="flex flex-col">
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="text-accent">{section.icon}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </span>
              </div>
              <LookupTableEditor
                title={section.title}
                description={section.description}
                items={localConfig[section.key] as import('@/lib/configStore').ConfigItem[]}
                idPrefix={section.idPrefix}
                showMeta={section.showMeta}
                metaLabel={section.metaLabel}
                metaPlaceholder={section.metaPlaceholder}
                onChange={handleChange(section.key)}
                accentColor={section.accentColor}
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'targets' && (
        <MonthlyTargetsEditor
          targets={localConfig.monthlyTargets}
          salespeople={localConfig.salespeople.map(s => s.label)}
          onChange={handleChange('monthlyTargets') as (targets: import('@/lib/configStore').RepMonthlyTarget[]) => void}
        />
      )}

      {activeTab === 'commission' && (
        <CommissionRulesEditor
          rules={localConfig.commissionRules}
          onChange={handleChange('commissionRules') as (rules: import('@/lib/configStore').CommissionRule[]) => void}
        />
      )}
    </div>
  );
}
