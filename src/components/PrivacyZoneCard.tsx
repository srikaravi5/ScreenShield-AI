import React from 'react';
import { Eye, EyeOff, Layers, Trash2 } from 'lucide-react';
import { PrivacyZone, ZonePolicy } from '../types/screenshield';

interface PrivacyZoneCardProps {
  zone: PrivacyZone;
  onUpdatePolicy: (id: string, policy: ZonePolicy) => void;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

const POLICIES: ZonePolicy[] = [
  'Always Blur',
  'Always Blackout',
  'Always Monitor',
  'Ignore',
];

export const PrivacyZoneCard: React.FC<PrivacyZoneCardProps> = ({
  zone,
  onUpdatePolicy,
  onToggleActive,
  onDelete,
}) => {
  return (
    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-colors flex flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${
              zone.active
                ? 'bg-cyan-500/15 text-cyan-400'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-100 truncate">
              {zone.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-mono tabular-nums">
              <span>
                Protection:{' '}
                <strong className="text-slate-200 font-medium">
                  {zone.policy.replace('Always ', '')}
                </strong>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>
                Status:{' '}
                <strong
                  className={
                    zone.active ? 'text-emerald-400' : 'text-slate-500'
                  }
                >
                  {zone.active ? 'Active' : 'Paused'}
                </strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onToggleActive(zone.id)}
            title={zone.active ? 'Pause zone protection' : 'Activate zone protection'}
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              zone.active
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {zone.active ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onDelete(zone.id)}
            title="Delete privacy zone"
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] text-slate-400 tabular-nums">
          Region: {Math.round(zone.box.x)}%, {Math.round(zone.box.y)}% ({Math.round(zone.box.width)}×{Math.round(zone.box.height)}%)
        </span>

        <select
          aria-label={`Protection policy for ${zone.name}`}
          value={zone.policy}
          onChange={(e) => onUpdatePolicy(zone.id, e.target.value as ZonePolicy)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          {POLICIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
