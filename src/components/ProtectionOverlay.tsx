import React from 'react';
import { Eye, LockOpen, ShieldCheck } from 'lucide-react';

interface ProtectionOverlayProps {
  active: boolean;
  onResumeMonitoring: () => void;
  onUnlockProtection: () => void;
}

export const ProtectionOverlay: React.FC<ProtectionOverlayProps> = ({
  active,
  onResumeMonitoring,
  onUnlockProtection,
}) => {
  if (!active) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Screen Protected Emergency Lock"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl transition-opacity duration-200"
    >
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono font-semibold tracking-widest text-emerald-400">
            ZERO-EXPOSURE SHIELD ACTIVE
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            SCREEN PROTECTED
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Sensitive information has been hidden across all monitored workspaces, terminals, and credential regions.
          </p>
        </div>

        <div className="py-3 px-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 tabular-nums">
          <span>Active Masking: Full Viewport</span>
          <span className="text-emerald-400">Privacy Score: 100/100</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onResumeMonitoring}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Resume Monitoring</span>
          </button>

          <button
            type="button"
            onClick={onUnlockProtection}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
          >
            <LockOpen className="w-4 h-4" />
            <span>Unlock Protection</span>
          </button>
        </div>
      </div>
    </div>
  );
};
