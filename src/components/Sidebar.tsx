import React, { useState } from 'react';
import {
  Activity,
  BarChart3,
  Camera,
  Cpu,
  History,
  Layers,
  LayoutDashboard,
  Lock,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { NavigationTab, SystemTelemetry } from '../types/screenshield';
import avatarImg from '../assets/images/avatar_security_lead_1791519196910.jpg';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  telemetry: SystemTelemetry;
  privacyScore: number;
  privacyStreakDays: number;
  unprotectedCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenProfileModal: () => void;
  onOpenOnboarding: () => void;
}

const NAV_ITEMS: {
  id: NavigationTab;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'live-monitor', label: 'Live Monitor', Icon: Activity },
  { id: 'privacy-events', label: 'Privacy Events', Icon: History },
  { id: 'analytics', label: 'Analytics', Icon: BarChart3 },
  { id: 'privacy-zones', label: 'Privacy Zones', Icon: Layers },
  { id: 'protection', label: 'Protection Center', Icon: Shield },
  { id: 'ai-detection', label: 'AI Detection', Icon: Cpu },
  { id: 'camera-vision', label: 'Camera Vision', Icon: Camera },
  { id: 'privacy-center', label: 'Privacy Center', Icon: Lock },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  telemetry,
  privacyScore,
  privacyStreakDays,
  unprotectedCount,
  isOpenMobile,
  onCloseMobile,
  onOpenProfileModal,
  onOpenOnboarding,
}) => {
  const [imgError, setImgError] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full w-64 bg-[#070B16]/90 backdrop-blur-2xl border-r border-white/10 text-slate-200 select-none z-20">
      {/* Top Brand Logo & Navigation */}
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
          <button
            type="button"
            onClick={() => {
              onSelectTab('dashboard');
              onCloseMobile();
            }}
            className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-600/25 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.25)] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display text-sm font-bold tracking-wider text-slate-100 block leading-none">
                SCREENSHIELD AI
              </span>
              <span className="font-mono text-[10px] text-cyan-400 tracking-wide">
                🛡️ SCREEN SHIELD
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation sidebar"
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global AI Security Score & Streak in Sidebar */}
        <div className="px-3.5 pt-3 pb-1">
          <div className="p-2.5 rounded-xl glass-card flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-slate-400">
                🛡 AI SECURITY SCORE
              </div>
              <div className="font-mono text-sm font-bold text-emerald-400 tabular-nums mt-0.5">
                {privacyScore} / 100
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-amber-300">
                🔥 {privacyStreakDays}d streak
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Protected
              </div>
            </div>
          </div>
        </div>

        <nav className="px-3 py-2 space-y-0.5" aria-label="Main Navigation">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onSelectTab(id);
                  onCloseMobile();
                }}
                className={`relative w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-200 border border-cyan-400/35 shadow-[0_0_18px_rgba(6,182,212,0.14)] font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                {/* Small left active indicator (Section 13) */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                )}

                <span className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{label}</span>
                </span>

                {id === 'live-monitor' && unprotectedCount > 0 && (
                  <span className="font-mono text-[11px] text-amber-400 tabular-nums">
                    {unprotectedCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom System Status & User Profile */}
      <div className="p-3.5 space-y-2 border-t border-white/10">
        <div className="p-2.5 rounded-xl glass-card space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>System Status</span>
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Tour</span>
            </button>
          </div>
          <div className="space-y-0.5 text-[11px] font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">ON-DEVICE AI</span>
              <span className="text-emerald-400 font-semibold">
                {telemetry.onDeviceAi ? 'ACTIVE' : 'OFF'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">PROTECTION</span>
              <span
                className={
                  telemetry.protectionActive
                    ? 'text-emerald-400 font-semibold'
                    : 'text-amber-400 font-semibold'
                }
              >
                {telemetry.protectionActive ? 'ACTIVE' : 'PAUSED'}
              </span>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <button
          type="button"
          onClick={onOpenProfileModal}
          className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 transition-colors text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-800 border border-cyan-500/30 shrink-0 flex items-center justify-center">
            {!imgError ? (
              <img
                src={avatarImg}
                alt="Sri Karthika — Security Lead"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-mono text-xs font-bold text-cyan-400">
                SK
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-100 truncate">
              Sri Karthika
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              SecOps Lead · Local Enclave
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block shrink-0 relative z-20">{sidebarContent}</aside>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
