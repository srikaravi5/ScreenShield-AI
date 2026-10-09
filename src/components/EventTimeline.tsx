import React from 'react';
import {
  Camera,
  KeyRound,
  Landmark,
  Lock,
  Mail,
  Scan,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { PrivacyEvent } from '../types/screenshield';
import { RiskIndicator } from './RiskIndicator';

interface EventTimelineProps {
  events: PrivacyEvent[];
  maxItems?: number;
  title?: string;
  onViewAll?: () => void;
}

function getEventIcon(category: PrivacyEvent['category']) {
  switch (category) {
    case 'Password':
      return Lock;
    case 'OTP':
      return Smartphone;
    case 'Email':
      return Mail;
    case 'API Key':
      return KeyRound;
    case 'Banking':
      return Landmark;
    case 'Camera':
      return Camera;
    default:
      return Scan;
  }
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  maxItems = 6,
  title = 'LIVE INTELLIGENCE',
  onViewAll,
}) => {
  const visibleEvents = events.slice(0, maxItems);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
            {title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time cybersecurity intelligence feed of screen scans and automated shields
          </p>
        </div>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            View All Events →
          </button>
        )}
      </div>

      {/* Premium Empty State (Section 26) */}
      {visibleEvents.length === 0 ? (
        <div className="py-12 px-6 text-center rounded-2xl bg-slate-950/50 border border-dashed border-slate-800 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-base font-bold text-slate-100">
            🛡 All clear.
          </div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            ScreenShield hasn&apos;t detected any unmitigated privacy threats in this filter view.
          </p>
        </div>
      ) : (
        <div className="relative pl-4 border-l border-slate-800 space-y-2.5">
          {visibleEvents.map((evt) => {
            const Icon = getEventIcon(evt.category);
            return (
              <div
                key={evt.id}
                className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-950/55 border border-white/8 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400 tabular-nums">
                        {evt.timestamp}
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-sm font-semibold text-slate-100 truncate">
                        {evt.title}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-400 mt-0.5 truncate">
                      {evt.action}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  {evt.confidence !== undefined && (
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      {evt.confidence}%
                    </span>
                  )}
                  <RiskIndicator risk={evt.risk} size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
