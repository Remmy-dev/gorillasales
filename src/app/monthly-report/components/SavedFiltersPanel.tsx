'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export interface SavedFilter {
  id: string;
  name: string;
  reportType: string;
  selectedMonth?: number;
  selectedYear?: number;
  selectedRep?: string;
  selectedDate?: string;
  selectedWeek?: number;
  selectedWeekYear?: number;
  selectedQuarter?: number;
  selectedQuarterYear?: number;
  selectedYearOnly?: number;
  savedAt: string;
}

const STORAGE_KEY = 'gorillasales_saved_report_filters';

function loadFilters(): SavedFilter[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFilters(filters: SavedFilter[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
}

interface SavedFiltersPanelProps {
  currentFilter: Omit<SavedFilter, 'id' | 'name' | 'savedAt'>;
  onLoad: (filter: SavedFilter) => void;
}

export default function SavedFiltersPanel({ currentFilter, onLoad }: SavedFiltersPanelProps) {
  const [filters, setFilters] = useState<SavedFilter[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [savedFlash, setSavedFlash] = useState('');

  useEffect(() => {
    setFilters(loadFilters());
  }, []);

  function handleSave() {
    const name = saveName.trim();
    if (!name) return;
    const newFilter: SavedFilter = {
      ...currentFilter,
      id: `filter-${Date.now()}`,
      name,
      savedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    const updated = [newFilter, ...filters].slice(0, 10); // max 10 saved
    setFilters(updated);
    saveFilters(updated);
    setSaveName('');
    setShowSaveInput(false);
    setSavedFlash(`"${name}" saved`);
    setTimeout(() => setSavedFlash(''), 2500);
  }

  function handleDelete(id: string) {
    const updated = filters.filter((f) => f.id !== id);
    setFilters(updated);
    saveFilters(updated);
  }

  function getFilterSummary(f: SavedFilter): string {
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const QUARTERS = ['Q1 (Jan–Mar)', 'Q2 (Apr–Jun)', 'Q3 (Jul–Sep)', 'Q4 (Oct–Dec)'];
    let period = '';
    if (f.reportType === 'daily') period = f.selectedDate ?? '';
    else if (f.reportType === 'weekly') period = `Week ${f.selectedWeek}, ${f.selectedWeekYear}`;
    else if (f.reportType === 'monthly') period = `${MONTHS[f.selectedMonth ?? 0]} ${f.selectedYear}`;
    else if (f.reportType === 'quarterly') period = `${QUARTERS[f.selectedQuarter ?? 0]} ${f.selectedQuarterYear}`;
    else period = `${f.selectedYearOnly}`;
    const rep = f.selectedRep ? ` · ${f.selectedRep.split(' ')[0]}` : ' · All Reps';
    return `${f.reportType.charAt(0).toUpperCase() + f.reportType.slice(1)} · ${period}${rep}`;
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bookmark size={15} className="text-accent" />
          <span className="text-sm font-semibold text-foreground">Saved Filter Views</span>
          {filters.length > 0 && (
            <span className="bg-accent/15 text-accent text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {filters.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {savedFlash && (
            <span className="text-xs text-positive font-medium animate-pulse">{savedFlash}</span>
          )}
          {expanded ? <ChevronUp size={15} className="text-muted-foreground" /> : <ChevronDown size={15} className="text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border px-5 py-4 space-y-4">
          {/* Save current filter */}
          <div>
            {!showSaveInput ? (
              <button
                onClick={() => setShowSaveInput(true)}
                className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
              >
                <BookmarkCheck size={14} />
                Save current filter as view
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setShowSaveInput(false); }}
                  placeholder="View name (e.g. Sep Karenzi Monthly)"
                  className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  disabled={!saveName.trim()}
                  className="bg-accent text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => { setShowSaveInput(false); setSaveName(''); }}
                  className="text-muted-foreground hover:text-foreground px-2 py-2 text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Saved filters list */}
          {filters.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved views yet. Apply filters and save them for quick reuse.</p>
          ) : (
            <div className="space-y-2">
              {filters.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors group"
                >
                  <button
                    onClick={() => onLoad(f)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="text-sm font-semibold text-foreground truncate">{f.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{getFilterSummary(f)}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">Saved {f.savedAt}</p>
                  </button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-negative hover:bg-negative/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete saved view"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
