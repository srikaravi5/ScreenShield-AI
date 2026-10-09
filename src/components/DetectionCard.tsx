import React from 'react';
import {
  CreditCard,
  Eye,
  EyeOff,
  KeyRound,
  Landmark,
  Lock,
  Mail,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { DetectionCategory, DetectionItem } from '../types/screenshield';
import { RiskIndicator } from './RiskIndicator';

interface DetectionCardProps {
  detection: DetectionItem;
  onToggleProtect: (id: string) => void;
  isHighlighted?: boolean;
  onHover?: (id: string | null) => void;
}

export function getCategoryIcon(category: DetectionCategory) {
  switch (category) {
    case 'Password':
      return Lock;
    case 'OTP':
      return Smartphone;
    case 'Email':
      return Mail;
    case 'API Key':
      return KeyRound;
    case 'Credit Card':
      return CreditCard;
    case 'Banking':
      return Landmark;
    default:
      return ShieldCheck;
  }
}

export const DetectionCard: React.FC<DetectionCardProps> = ({
  detection,
  onToggleProtect,
  isHighlighted = false,
  onHover,
}) => {
  const Icon = getCategoryIcon(detection.category);

  return (
    <div
      onMouseEnter={() => onHover?.(detection.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`group flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all duration-150 ${
        isHighlighted
          ? 'bg-slate-800/90 border-cyan-500/60'
          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 mt-0.5 ${
            detection.risk === 'CRITICAL'
              ? 'bg-rose-500/15 text-rose-400'
              : detection.risk === 'HIGH'
              ? 'bg-orange-500/15 text-orange-400'
              : 'bg-amber-500/15 text-amber-400'
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-100 truncate">
              {detection.category}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-xs text-cyan-400 tabular-nums whitespace-nowrap">
              {detection.confidence}% confidence
            </span>
          </div>

          <div className="text-xs text-slate-400 truncate mt-0.5">
            {detection.label}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1.5 font-mono tabular-nums">
            <RiskIndicator risk={detection.risk} size="sm" />
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{detection.timestamp}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span
              className={
                detection.isProtected ? 'text-emerald-400' : 'text-amber-400'
              }
            >
              {detection.isProtected ? 'Masked' : 'Unmasked'}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onToggleProtect(detection.id)}
        title={detection.isProtected ? 'Reveal region on screen' : 'Mask region now'}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
          detection.isProtected
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
            : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
        }`}
      >
        {detection.isProtected ? (
          <>
            <EyeOff className="w-3.5 h-3.5" />
            <span>Protected</span>
          </>
        ) : (
          <>
            <Eye className="w-3.5 h-3.5" />
            <span>Mask</span>
          </>
        )}
      </button>
    </div>
  );
};
