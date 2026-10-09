import React from 'react';
import {
  Bell,
  Camera,
  CameraOff,
  Maximize2,
  Menu,
  Search,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import {
  CameraState,
  NavigationTab,
  SystemTelemetry,
} from '../types/screenshield';

interface TopBarProps {
  activeTab: NavigationTab;
  telemetry: SystemTelemetry;
  camera: CameraState;
  unreadNotifications: number;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  onOpenCommandPalette: () => void;
  onToggleCamera: () => void;
  onOpenMobileSidebar: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onTriggerEmergencyProtect: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  telemetry,
  camera,
  unreadNotifications,
  focusMode,
  onToggleFocusMode,
  onOpenCommandPalette,
  onToggleCamera,
  onOpenMobileSidebar,
  onOpenNotifications,
  onOpenProfile,
  onTriggerEmergencyProtect,
}) => {
  return (
    <header className="h-16 px-4 sm:px-6 bg-[#080D1B]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-4 sm:gap-6 sticky top-0 z-30">
      {/* Zone 1: Brand & Mobile Trigger + Glowing Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 cursor-pointer shrink-0"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Glowing Search Bar (Section 6) */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="group w-full flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-slate-900/75 hover:bg-slate-900 border border-slate-700/80 hover:border-cyan-400/60 focus:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
            <span className="text-xs text-slate-400 group-hover:text-slate-200 truncate">
              Search privacy events, detections, applications...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950/90 border border-slate-800 font-mono text-[10px] text-cyan-300 shrink-0">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Zone 2: Live System Telemetry Status */}
      <div className="hidden xl:flex items-center gap-5 text-xs whitespace-nowrap shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">🤖 AI Engine:</span>
          <span className="font-mono font-semibold text-emerald-400">
            {telemetry.aiEngine}
          </span>
        </div>

        <span aria-hidden="true" className="text-slate-700">·</span>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">🛡 Protection:</span>
          <span
            className={`font-mono font-semibold ${
              telemetry.protectionActive ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {telemetry.protectionActive ? 'ACTIVE' : 'STANDBY'}
          </span>
        </div>

        <span aria-hidden="true" className="text-slate-700">·</span>

        <button
          type="button"
          onClick={onToggleCamera}
          title="Toggle Camera & Shoulder-Surfing Detection"
          className="inline-flex items-center gap-1.5 text-xs hover:text-slate-100 transition-colors cursor-pointer"
        >
          <span className="text-slate-400">Camera:</span>
          {camera.enabled ? (
            <span className="inline-flex items-center gap-1 font-mono font-semibold text-amber-400">
              <Camera className="w-3.5 h-3.5" />
              <span>ON ({camera.detectedViewers})</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-mono font-semibold text-slate-400">
              <CameraOff className="w-3.5 h-3.5" />
              <span>OFF</span>
            </span>
          )}
        </button>
      </div>

      {/* Zone 3: Focus Mode, Notifications, Profile & Emergency Action */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onToggleFocusMode}
          title={focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
          className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
            focusMode
              ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200'
              : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:text-slate-100'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Focus Mode</span>
        </button>

        <button
          type="button"
          onClick={onOpenNotifications}
          aria-label="Open notifications"
          title="Notification Center"
          className="relative p-2 rounded-xl text-slate-300 hover:text-slate-100 hover:bg-slate-800/80 border border-slate-800 transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950 font-mono text-[10px] font-bold tabular-nums">
              {unreadNotifications}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenProfile}
          title="Operator Enclave Profile & Onboarding"
          className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800/80 border border-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span className="w-5 h-5 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold flex items-center justify-center">
            SK
          </span>
          <span>Sri Karthika</span>
        </button>

        <button
          type="button"
          onClick={onTriggerEmergencyProtect}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-rose-600/85 to-orange-600/85 hover:from-rose-500 hover:to-orange-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          {telemetry.protectionActive ? (
            <ShieldAlert className="w-3.5 h-3.5" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5" />
          )}
          <span>Protect Screen Now</span>
        </button>
      </div>
    </header>
  );
};
