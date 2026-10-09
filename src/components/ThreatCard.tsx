import React from 'react';
import { AlertTriangle, Eye, Shield, X } from 'lucide-react';
import { DetectionItem } from '../types/screenshield';
import { RiskIndicator } from './RiskIndicator';

interface ThreatCardProps {
  threat: DetectionItem;
  onProtectNow: (id: string) => void;
  onViewDetails?: () => void;
  onDismiss: () => void;
}

export const ThreatCard: React.FC<ThreatCardProps> = ({
  threat,
  onProtectNow,
  onViewDetails,
  onDismiss,
}) => {
  return (
    <div className="rounded-2xl border border-rose-500/45 bg-gradient-to-r from-rose-950/40 via-slate-900/80 to-slate-900/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_0_28px_rgba(244,63,94,0.18)] transition-all duration-200 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="font-bold tracking-wider text-rose-400">
                🚨 PRIVACY THREAT DETECTED
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 tabular-nums">{threat.timestamp}</span>
            </div>

            <h3 className="text-base font-semibold text-slate-100">
              “{threat.label}” <span className="text-xs font-normal text-slate-400">({threat.sourceApp})</span>
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Risk:</span>
                <RiskIndicator risk={threat.risk} />
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div className="font-mono tabular-nums">
                <span className="text-slate-400">Confidence: </span>
                <span className="text-slate-100 font-semibold">{threat.confidence}%</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div>
                <span className="text-slate-400">Action: </span>
                <span className="text-emerald-400 font-semibold">{threat.actionTaken}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={() => onProtectNow(threat.id)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-[0_0_16px_rgba(244,63,94,0.35)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>🛡 Protect Now</span>
          </button>

          {onViewDetails && (
            <button
              type="button"
              onClick={onViewDetails}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>View Details</span>
            </button>
          )}

          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss threat alert"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
