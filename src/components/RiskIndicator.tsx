import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { RiskLevel } from '../types/screenshield';

interface RiskIndicatorProps {
  risk: RiskLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

const RISK_META: Record<
  RiskLevel,
  {
    label: string;
    textClass: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  SAFE: {
    label: 'SAFE',
    textClass: 'text-emerald-400',
    Icon: CheckCircle2,
  },
  LOW: {
    label: 'LOW',
    textClass: 'text-sky-400',
    Icon: Info,
  },
  MEDIUM: {
    label: 'MEDIUM',
    textClass: 'text-amber-400',
    Icon: AlertTriangle,
  },
  HIGH: {
    label: 'HIGH',
    textClass: 'text-orange-400',
    Icon: ShieldAlert,
  },
  CRITICAL: {
    label: 'CRITICAL',
    textClass: 'text-rose-400',
    Icon: AlertOctagon,
  },
};

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  risk,
  showIcon = true,
  size = 'sm',
}) => {
  const meta = RISK_META[risk] || RISK_META.SAFE;
  const IconComponent = meta.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium tracking-wide whitespace-nowrap shrink-0 ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      } ${meta.textClass}`}
    >
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      <span>{meta.label}</span>
    </span>
  );
};
