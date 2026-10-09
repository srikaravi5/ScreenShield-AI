import React, { useState } from 'react';
import { Download, Search, Trash2 } from 'lucide-react';
import { PrivacyEvent, RiskLevel } from '../types/screenshield';
import { EventTimeline } from '../components/EventTimeline';

interface PrivacyEventsPageProps {
  events: PrivacyEvent[];
  onClearEvents: () => void;
}

export const PrivacyEventsPage: React.FC<PrivacyEventsPageProps> = ({
  events,
  onClearEvents,
}) => {
  const [query, setQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<'ALL' | RiskLevel>('ALL');

  const filtered = events.filter((e) => {
    const matchesRisk = selectedRisk === 'ALL' || e.risk === selectedRisk;
    const matchesQuery =
      !query.trim() ||
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.action.toLowerCase().includes(query.toLowerCase()) ||
      e.category.toLowerCase().includes(query.toLowerCase());
    return matchesRisk && matchesQuery;
  });

  const handleExportCsv = () => {
    const headers = 'Timestamp,Category,Title,Action,Risk,Confidence\n';
    const rows = filtered
      .map(
        (e) =>
          `"${e.timestamp}","${e.category}","${e.title}","${e.action}","${
            e.risk
          }","${e.confidence ?? ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `screenshield-privacy-events-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Privacy Event Timeline & Audit Log
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Local-only security ledger of detected screen exposures and automated redactions
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onClearEvents}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-rose-950/50 text-slate-300 hover:text-rose-300 border border-slate-800 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by category, detection title, or protection action..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800/80 overflow-x-auto">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'SAFE'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRisk(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedRisk === r
                  ? 'bg-slate-800 text-cyan-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Full Timeline */}
      <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800/90">
        <EventTimeline events={filtered} maxItems={50} />
      </div>
    </div>
  );
};
