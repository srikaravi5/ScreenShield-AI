import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Eye,
  Layers,
  Monitor,
  Search,
  Settings,
  Shield,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { NavigationTab, ScreenShieldState } from '../types/screenshield';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  state: ScreenShieldState;
  initialQuery?: string;
  onNavigate: (tab: NavigationTab) => void;
  onRunScan: () => void;
  onProtectAll: () => void;
  onEmergencyProtect: () => void;
  onToggleFocusMode: () => void;
  focusMode: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  state,
  initialQuery = '',
  onNavigate,
  onRunScan,
  onProtectAll,
  onEmergencyProtect,
  onToggleFocusMode,
  focusMode,
}) => {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const commands = [
    {
      id: 'cmd-monitor',
      label: 'Start Monitoring',
      category: 'Command',
      icon: Monitor,
      action: () => {
        onNavigate('live-monitor');
        onClose();
      },
    },
    {
      id: 'cmd-scan',
      label: 'Scan Screen',
      category: 'AI Action',
      icon: Eye,
      action: () => {
        onRunScan();
        onClose();
      },
    },
    {
      id: 'cmd-protect',
      label: 'Protect Screen',
      category: 'Protection',
      icon: Shield,
      action: () => {
        onProtectAll();
        onClose();
      },
    },
    {
      id: 'cmd-analytics',
      label: 'Open Analytics',
      category: 'Navigation',
      icon: BarChart3,
      action: () => {
        onNavigate('analytics');
        onClose();
      },
    },
    {
      id: 'cmd-zones',
      label: 'Privacy Zones',
      category: 'Navigation',
      icon: Layers,
      action: () => {
        onNavigate('privacy-zones');
        onClose();
      },
    },
    {
      id: 'cmd-settings',
      label: 'Settings',
      category: 'Navigation',
      icon: Settings,
      action: () => {
        onNavigate('settings');
        onClose();
      },
    },
    {
      id: 'cmd-focus',
      label: focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode',
      category: 'Workspace',
      icon: Sparkles,
      action: () => {
        onToggleFocusMode();
        onClose();
      },
    },
    {
      id: 'cmd-emergency',
      label: 'Emergency Protection',
      category: 'Critical Action',
      icon: Zap,
      action: () => {
        onEmergencyProtect();
        onClose();
      },
    },
  ].filter(
    (c) =>
      !q ||
      c.label.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
  );

  const matchingDetections = state.detections.filter(
    (d) =>
      q &&
      (d.category.toLowerCase().includes(q) ||
        d.label.toLowerCase().includes(q) ||
        d.sourceApp.toLowerCase().includes(q))
  );

  const matchingApps = state.recentApplications.filter(
    (a) =>
      q &&
      (a.name.toLowerCase().includes(q) ||
        a.windowTitle.toLowerCase().includes(q))
  );

  const matchingEvents = state.events.filter(
    (e) =>
      q &&
      (e.title.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q))
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Smart Search and Command Palette"
    >
      <div className="w-full max-w-xl rounded-2xl glass-card border border-cyan-500/30 shadow-2xl overflow-hidden">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800/80 bg-slate-950/60">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ScreenShield... (events, detections, applications, commands)"
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Commands */}
          {commands.length > 0 && (
            <div className="space-y-1">
              <div className="px-2.5 py-1 text-[11px] font-mono text-slate-400">
                COMMANDS
              </div>
              {commands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    type="button"
                    onClick={cmd.action}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-cyan-500/15 text-left transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-medium text-slate-200 group-hover:text-cyan-200">
                        <span className="text-cyan-400 mr-1.5">→</span>
                        {cmd.label}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500 group-hover:text-cyan-300 flex items-center gap-1">
                      <span>{cmd.category}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Matching Detections & Applications */}
          {(matchingDetections.length > 0 ||
            matchingApps.length > 0 ||
            matchingEvents.length > 0) && (
            <div className="space-y-1 pt-2 border-t border-slate-800/80">
              <div className="px-2.5 py-1 text-[11px] font-mono text-slate-400">
                SEARCH RESULTS
              </div>

              {matchingDetections.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    onNavigate('live-monitor');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-800/80 text-left text-xs cursor-pointer"
                >
                  <div>
                    <span className="font-semibold text-slate-100">
                      {d.category}: {d.label}
                    </span>
                    <span className="text-slate-400 ml-2">({d.sourceApp})</span>
                  </div>
                  <span className="font-mono text-cyan-400">{d.confidence}%</span>
                </button>
              ))}

              {matchingApps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    onNavigate('dashboard');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-800/80 text-left text-xs cursor-pointer"
                >
                  <div>
                    <span className="font-semibold text-slate-100">
                      App: {app.name}
                    </span>
                    <span className="text-slate-400 ml-2">
                      {app.windowTitle}
                    </span>
                  </div>
                  <span className="font-mono text-emerald-400">
                    {app.status}
                  </span>
                </button>
              ))}

              {matchingEvents.slice(0, 3).map((evt) => (
                <button
                  key={evt.id}
                  type="button"
                  onClick={() => {
                    onNavigate('privacy-events');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-800/80 text-left text-xs cursor-pointer"
                >
                  <div>
                    <span className="font-semibold text-slate-200">
                      {evt.title}
                    </span>
                    <span className="text-emerald-400 ml-2">{evt.action}</span>
                  </div>
                  <span className="font-mono text-slate-400">
                    {evt.timestamp}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Navigate with Tab / Click</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
