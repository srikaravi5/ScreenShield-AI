import React from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { RiskLevel } from '../types/screenshield';
import { RiskIndicator } from './RiskIndicator';

interface PrivacyScoreProps {
  userName?: string;
  score: number;
  threatLevel: RiskLevel;
  aiMonitoringActive: boolean;
  lastScanSecondsAgo: number;
  sensitiveRegionsCount: number;
  protectedRegionsCount: number;
  unprotectedThreatsCount: number;
  totalScans?: number;
  totalThreats?: number;
  totalProtectedRegions?: number;
  streakDays?: number;
  compact?: boolean;
}

export const PrivacyScore: React.FC<PrivacyScoreProps> = ({
  userName = 'SRI KARTHIKA',
  score,
  threatLevel,
  aiMonitoringActive,
  lastScanSecondsAgo,
  sensitiveRegionsCount,
  protectedRegionsCount,
  unprotectedThreatsCount,
  totalScans = 1284,
  totalThreats = 12,
  totalProtectedRegions = 27,
  streakDays = 7,
  compact = false,
}) => {
  const radius = compact ? 46 : 66;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // Score states per Section 13: 90-100 Protected, 70-89 Low Risk, 40-69 Warning, 0-39 Critical
  const strokeColor =
    clampedScore >= 90
      ? '#10B981' // emerald
      : clampedScore >= 70
      ? '#38BDF8' // sky/cyan
      : clampedScore >= 40
      ? '#F59E0B' // amber
      : '#F43F5E'; // rose

  const statusLabel =
    clampedScore >= 90
      ? 'PROTECTED'
      : clampedScore >= 70
      ? 'LOW RISK'
      : clampedScore >= 40
      ? 'WARNING'
      : 'CRITICAL';

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 112 112">
              <circle
                cx="56"
                cy="56"
                r={radius}
                fill="none"
                stroke="rgba(30, 41, 59, 0.9)"
                strokeWidth="8"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                fill="none"
                stroke={strokeColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-2xl font-bold text-slate-100 tabular-nums">
                {clampedScore}
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                {statusLabel}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>🛡 PRIVACY {statusLabel}</span>
            </div>
            <h3 className="text-base font-semibold text-slate-100 mt-1">
              Privacy Score: {clampedScore} / 100
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono tabular-nums">
              Sensitive: {sensitiveRegionsCount} · Protected: {protectedRegionsCount} · Threats: {unprotectedThreatsCount}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Hero Greeting & Status */}
        <div className="space-y-3.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            <span className="font-semibold text-cyan-300">
              🤖 GOOD MORNING, {userName}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-300">🔥 {streakDays} days protected</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400">Privacy Health: Excellent</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
              Your visual privacy is under control.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/90 mt-1.5 leading-relaxed">
              On-device Visual AI is actively inspecting frame buffers, masking credentials, and guarding your workspace in real time.
            </p>
          </div>

          {/* Status Strip */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Status:</span>
              <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                {clampedScore >= 70 ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                )}
                <span>🛡 {statusLabel}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">AI Monitoring:</span>
              <span className="font-mono font-semibold text-cyan-400">
                {aiMonitoringActive ? 'ACTIVE' : 'PAUSED'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Threat Level:</span>
              <RiskIndicator risk={threatLevel} />
            </div>

            <div className="flex items-center gap-2 font-mono tabular-nums">
              <span className="text-slate-400">Last Scan:</span>
              <span className="text-slate-200">
                {lastScanSecondsAgo === 0 ? 'Just now' : `${lastScanSecondsAgo} sec ago`}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Large Futuristic Circular Privacy Score */}
        <div className="flex items-center gap-5 shrink-0 self-start lg:self-center">
          <div
            className="relative w-40 h-40 flex items-center justify-center"
            style={{
              filter: `drop-shadow(0 0 24px ${
                clampedScore >= 85
                  ? 'rgba(16, 185, 129, 0.25)'
                  : 'rgba(56, 189, 248, 0.25)'
              })`,
            }}
          >
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="rgba(30, 41, 59, 0.85)"
                strokeWidth="10"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={strokeColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Shield className="w-4 h-4 text-cyan-400 mb-0.5" />
              <div className="font-mono text-3xl font-bold text-slate-100 tabular-nums leading-none">
                {clampedScore}
              </div>
              <div className="w-10 h-px bg-slate-700 my-1" />
              <div className="font-mono text-[10px] font-semibold tracking-wider text-emerald-400">
                {statusLabel}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Glass Hero Summary Cards (Section 10) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2 border-t border-white/10">
        <div className="p-3.5 rounded-xl bg-slate-950/55 border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">🛡 Protected</div>
            <div className="font-mono text-lg sm:text-xl font-bold text-emerald-400 tabular-nums mt-0.5">
              {clampedScore}%
            </div>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            {clampedScore} / 100
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/55 border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">🔍 Scans</div>
            <div className="font-mono text-lg sm:text-xl font-bold text-cyan-300 tabular-nums mt-0.5">
              {totalScans.toLocaleString()}
            </div>
          </div>
          <span className="font-mono text-[11px] text-slate-400">On-Device</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/55 border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">🚨 Threats</div>
            <div className="font-mono text-lg sm:text-xl font-bold text-rose-400 tabular-nums mt-0.5">
              {totalThreats}
            </div>
          </div>
          <span className="font-mono text-[11px] text-slate-400">Mitigated</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/55 border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">👁 Regions</div>
            <div className="font-mono text-lg sm:text-xl font-bold text-slate-100 tabular-nums mt-0.5">
              {totalProtectedRegions} Protected
            </div>
          </div>
          <span className="font-mono text-[11px] text-emerald-400">Active</span>
        </div>
      </div>
    </div>
  );
};
