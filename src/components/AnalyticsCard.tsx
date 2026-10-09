import React from 'react';

interface AnalyticsCardProps {
  label: string;
  value: string | number;
  delta?: string;
  icon: React.ReactNode;
  accent?: 'cyan' | 'emerald' | 'amber' | 'rose';
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  label,
  value,
  delta,
  icon,
  accent = 'cyan',
}) => {
  const accentText = {
    cyan: 'text-cyan-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
  }[accent];

  return (
    <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/90 flex flex-col justify-between gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <div className={`p-2 rounded-lg bg-slate-800/80 ${accentText}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-2xl sm:text-3xl font-bold text-slate-100 tabular-nums">
          {value}
        </span>
        {delta && (
          <span className="font-mono text-xs text-slate-400 tabular-nums">
            {delta}
          </span>
        )}
      </div>
    </div>
  );
};
