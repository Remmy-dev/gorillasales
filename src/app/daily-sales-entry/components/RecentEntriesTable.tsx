'use client';

import React, { useState } from 'react';
import { Trash2, Eye, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { VisitLog, formatRWFFull } from '@/lib/mockData';
import Badge from '@/components/ui/Badge';

interface RecentEntriesTableProps {
  entries: VisitLog[];
  onDelete: (id: string) => void;
}

type SortKey = keyof VisitLog;

function getOutcomeBadge(outcome: string) {
  if (outcome === 'Order Placed') return <Badge label="Order Placed" variant="success" dot />;
  if (outcome === 'Follow-up Required') return <Badge label="Follow-up Required" variant="warning" dot />;
  return <Badge label="Visit Only" variant="neutral" dot />;
}

function getPaymentBadge(status: string) {
  if (status === 'Paid') return <Badge label="Paid" variant="success" />;
  if (status === 'Credit') return <Badge label="Credit" variant="info" />;
  if (status === 'Pending') return <Badge label="Pending" variant="warning" />;
  return <Badge label={status} variant="neutral" />;
}

const PAGE_SIZE = 5;

function VisitDetailModal({ entry, onClose }: { entry: VisitLog; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card rounded-xl shadow-2xl border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">Visit Details</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Date</p>
              <p className="text-sm font-medium text-foreground">{entry.dateOfVisit}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Salesperson</p>
              <p className="text-sm font-medium text-foreground">{entry.salesperson}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Customer</p>
              <p className="text-sm font-medium text-foreground">{entry.customerName}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Area</p>
              <p className="text-sm font-medium text-foreground">{entry.area}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Category</p>
              <p className="text-sm font-medium text-foreground">{entry.customerCategory || '—'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Outcome</p>
              <div>{getOutcomeBadge(entry.visitOutcome)}</div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Product</p>
              <p className="text-sm font-medium text-foreground">{entry.productCategory || '—'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Quantity</p>
              <p className="text-sm font-medium text-foreground">{entry.quantity || '—'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Unit Price</p>
              <p className="text-sm font-medium text-foreground">{entry.unitPrice > 0 ? `RWF ${entry.unitPrice.toLocaleString()}` : '—'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Sales Value</p>
              <p className="text-sm font-bold text-foreground">{entry.salesValue > 0 ? formatRWFFull(entry.salesValue) : '—'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Payment</p>
              <div>{entry.paymentStatus ? getPaymentBadge(entry.paymentStatus) : <span className="text-muted-foreground text-xs">—</span>}</div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Customer Type</p>
              <p className="text-sm font-medium text-foreground">{entry.customerType || '—'}</p>
            </div>
            {entry.nextFollowUpDate && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Next Follow-up</p>
                <p className="text-sm font-medium text-foreground">{entry.nextFollowUpDate}</p>
              </div>
            )}
          </div>
          {entry.remarks && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Remarks</p>
              <p className="text-sm text-foreground bg-muted/40 rounded-lg p-3">{entry.remarks}</p>
            </div>
          )}
        </div>
        <div className="px-5 py-3 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecentEntriesTable({ entries, onDelete }: RecentEntriesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('dateOfVisit');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewEntry, setViewEntry] = useState<VisitLog | null>(null);

  const sorted = [...entries].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir === 'asc' ? av - bv : bv - av;
    }
    return sortDir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(1);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      onDelete(id);
      setDeletingId(null);
    }, 300);
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === 'asc' ? (
        <ChevronUp size={12} className="text-accent" />
      ) : (
        <ChevronDown size={12} className="text-accent" />
      )
    ) : (
      <ChevronDown size={12} className="text-muted-foreground opacity-40" />
    );

  if (entries.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
          <Eye size={22} className="text-muted-foreground" />
        </div>
        <h4 className="text-sm font-semibold text-foreground mb-1">
          No visit logs yet
        </h4>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          Use the form above to log your first field visit. Entries will appear here immediately after saving.
        </p>
      </div>
    );
  }

  return (
    <>
      {viewEntry && (
        <VisitDetailModal entry={viewEntry} onClose={() => setViewEntry(null)} />
      )}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Recent Visit Logs</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {entries.length} total entries — September 2026
            </p>
          </div>
          <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, entries.length)} of {entries.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1100px]">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                {(
                  [
                    { key: 'dateOfVisit', label: 'Date' },
                    { key: 'salesperson', label: 'Rep' },
                    { key: 'customerName', label: 'Customer' },
                    { key: 'area', label: 'Area' },
                    { key: 'visitOutcome', label: 'Outcome' },
                    { key: 'productCategory', label: 'Product' },
                    { key: 'quantity', label: 'Qty' },
                    { key: 'unitPrice', label: 'Unit Price' },
                    { key: 'salesValue', label: 'Sales Value' },
                    { key: 'paymentStatus', label: 'Payment' },
                    { key: 'customerType', label: 'Type' },
                    { key: 'nextFollowUpDate', label: 'Follow-up' },
                  ] as { key: SortKey; label: string }[]
                ).map((col) => (
                  <th
                    key={`th-${col.key}`}
                    className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground select-none whitespace-nowrap"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key} />
                    </div>
                  </th>
                ))}
                <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageData.map((entry) => (
                <tr
                  key={`entry-row-${entry.id}`}
                  className={`hover:bg-muted/40 transition-all duration-300 ${
                    deletingId === entry.id ? 'opacity-0 max-h-0' : 'opacity-100'
                  }`}
                >
                  <td className="px-3 py-3 text-sm text-foreground whitespace-nowrap font-tabular">
                    {entry.dateOfVisit}
                  </td>
                  <td className="px-3 py-3 text-sm text-foreground whitespace-nowrap">
                    {entry.salesperson.split(' ')[0]}
                  </td>
                  <td className="px-3 py-3 text-sm font-medium text-foreground max-w-[180px] truncate">
                    {entry.customerName}
                  </td>
                  <td className="px-3 py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {entry.area}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {getOutcomeBadge(entry.visitOutcome)}
                  </td>
                  <td className="px-3 py-3 text-sm text-muted-foreground max-w-[140px] truncate whitespace-nowrap">
                    {entry.productCategory || '—'}
                  </td>
                  <td className="px-3 py-3 text-sm text-foreground font-tabular text-right">
                    {entry.quantity || '—'}
                  </td>
                  <td className="px-3 py-3 text-sm text-muted-foreground font-tabular whitespace-nowrap text-right">
                    {entry.unitPrice > 0 ? `RWF ${entry.unitPrice.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-3 py-3 text-sm font-semibold text-foreground font-tabular whitespace-nowrap text-right">
                    {entry.salesValue > 0 ? formatRWFFull(entry.salesValue) : '—'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {entry.paymentStatus ? getPaymentBadge(entry.paymentStatus) : <span className="text-muted-foreground text-xs">—</span>}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {entry.customerType === 'New Customer' ? (
                      <Badge label="New" variant="accent" dot />
                    ) : (
                      <Badge label="Existing" variant="neutral" />
                    )}
                  </td>
                  <td className="px-3 py-3 text-sm text-muted-foreground font-tabular whitespace-nowrap">
                    {entry.nextFollowUpDate || '—'}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="View visit details"
                        onClick={() => setViewEntry(entry)}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-info/10 hover:text-info transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        title="Delete this visit log — cannot be undone"
                        onClick={() => handleDelete(entry.id)}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-negative/10 hover:text-negative transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between bg-muted/20">
          <span className="text-xs text-muted-foreground">
            {entries.length} visit{entries.length !== 1 ? 's' : ''} total
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 rounded-md flex items-center justify-center border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={13} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={`page-${i + 1}`}
                onClick={() => setPage(i + 1)}
                className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                  page === i + 1
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 rounded-md flex items-center justify-center border border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}