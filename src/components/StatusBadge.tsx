import React from 'react';
import { Check, PowerOff, ShieldCheck, Zap } from 'lucide-react';

interface StatusBadgeProps {
  label: string;
  value: string;
  tone?: 'emerald' | 'cyan' | 'amber' | 'rose' | 'slate';
}

const TONE_MAP = {
  emerald: {
    text: 'text-emerald-400',
    Icon: ShieldCheck,
  },
  cyan: {
    text: 'text-cyan-400',
    Icon: Zap,
  },
  amber: {
    text: 'text-amber-400',
    Icon: Check,
  },
  rose: {
    text: 'text-rose-400',
    Icon: PowerOff,
  },
  slate: {
    text: 'text-slate-400',
    Icon: PowerOff,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  value,
  tone = 'emerald',
}) => {
  const config = TONE_MAP[tone];
  const Icon = config.Icon;

  return (
    <div className="inline-flex items-center gap-2 text-xs whitespace-nowrap shrink-0">
      <span className="text-slate-400">{label}:</span>
      <span className={`inline-flex items-center gap-1 font-mono font-semibold ${config.text}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{value}</span>
      </span>
    </div>
  );
};
