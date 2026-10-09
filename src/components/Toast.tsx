import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';
import { ToastNotification } from '../types/screenshield';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((t) => {
        const meta = {
          success: {
            Icon: CheckCircle2,
            border: 'border-emerald-500/40',
            iconColor: 'text-emerald-400',
          },
          warning: {
            Icon: AlertTriangle,
            border: 'border-amber-500/40',
            iconColor: 'text-amber-400',
          },
          critical: {
            Icon: AlertOctagon,
            border: 'border-rose-500/50',
            iconColor: 'text-rose-400',
          },
          info: {
            Icon: Info,
            border: 'border-cyan-500/40',
            iconColor: 'text-cyan-400',
          },
        }[t.type];

        const Icon = meta.Icon;

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl bg-slate-900/95 backdrop-blur-md border ${meta.border} shadow-xl transition-all duration-200`}
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${meta.iconColor}`} />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-100">
                  {t.title}
                </div>
                {t.detail && (
                  <div className="text-xs text-slate-400 mt-0.5 leading-snug">
                    {t.detail}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
