import React, { useEffect, useState } from 'react';
import {
  Eye,
  Lock,
  Maximize2,
  Shield,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  DetectionItem,
  NavigationTab,
  ScreenShieldState,
} from '../types/screenshield';

interface CentralScreenShieldProps {
  state: ScreenShieldState;
  scanStepText: string | null;
  isScanning: boolean;
  onToggleDetectionMask: (id: string) => void;
  onRunScan: () => void;
  onProtectAll: () => void;
  onEmergencyProtect: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

const CYCLING_STATES = [
  { emoji: '🧠', text: 'AI ANALYZING', color: 'text-cyan-300' },
  { emoji: '👁', text: 'SCREEN MONITORING', color: 'text-sky-300' },
  { emoji: '🛡', text: 'PRIVACY PROTECTED', color: 'text-emerald-300' },
];

export const CentralScreenShield: React.FC<CentralScreenShieldProps> = ({
  state,
  scanStepText,
  isScanning,
  onToggleDetectionMask,
  onRunScan,
  onProtectAll,
  onEmergencyProtect,
  onNavigate,
}) => {
  const [cycleIndex, setCycleIndex] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % CYCLING_STATES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const currentCycle = CYCLING_STATES[cycleIndex];
  const detectedCount = state.detections.length;
  const protectedCount = state.detections.filter(
    (d) => d.isProtected || state.protection.safeModeActive
  ).length;
  const riskScoreOutOf100 = Math.max(4, 100 - state.privacyScore);

  const getEmojiForCategory = (cat: DetectionItem['category']) => {
    if (cat === 'Password') return '🔐';
    if (cat === 'Email') return '📧';
    if (cat === 'OTP') return '🔢';
    return '🔑';
  };

  return (
    <div className="relative rounded-3xl glass-card border border-cyan-500/25 p-5 sm:p-7 overflow-hidden">
      {/* Brighter Center Radial Glow Behind the Shield (Section 10) */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full bg-cyan-500/15 blur-[110px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-indigo-500/15 blur-[80px] pointer-events-none"
      />

      {/* Connecting Holographic Circuit Lines SVG (Desktop) */}
      <svg
        aria-hidden="true"
        className="hidden xl:block absolute inset-0 w-full h-full pointer-events-none opacity-35"
        viewBox="0 0 1000 620"
        fill="none"
      >
        {/* Top Left to Shield */}
        <path
          d="M210 110 L320 110 L380 185"
          stroke="url(#shieldLineGrad)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="380" cy="185" r="3.5" fill="#22D3EE" />

        {/* Top Right to Shield */}
        <path
          d="M790 110 L680 110 L620 185"
          stroke="url(#shieldLineGrad)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="620" cy="185" r="3.5" fill="#22D3EE" />

        {/* Middle Left to Shield */}
        <path
          d="M195 300 L345 300"
          stroke="url(#shieldLineGrad)"
          strokeWidth="1.5"
        />
        <circle cx="345" cy="300" r="4" fill="#38BDF8" />

        {/* Middle Right to Shield */}
        <path
          d="M805 300 L655 300"
          stroke="url(#shieldLineGrad)"
          strokeWidth="1.5"
        />
        <circle cx="655" cy="300" r="4" fill="#38BDF8" />

        {/* Bottom Left to Shield */}
        <path
          d="M210 485 L320 485 L385 415"
          stroke="url(#shieldLineGrad)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="385" cy="415" r="3.5" fill="#22D3EE" />

        {/* Bottom Right to Shield */}
        <path
          d="M790 485 L680 485 L615 415"
          stroke="url(#shieldLineGrad)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="615" cy="415" r="3.5" fill="#22D3EE" />

        <defs>
          <linearGradient id="shieldLineGrad" x1="0" y1="0" x2="1000" y2="620" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Top Header Strip Inside Command Center */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold tracking-wider text-slate-100 uppercase">
              🛡️ AI SCREEN SHIELD — LIVE SCREEN ANALYSIS
            </h2>
          </div>
        </div>

        {/* Dynamic Cycling Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/85 border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.22)]">
          {isScanning || scanStepText ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span className="font-mono text-xs font-bold text-cyan-300">
                {scanStepText || '🧠 INITIALIZING AI...'}
              </span>
            </>
          ) : (
            <>
              <span className="text-xs">{currentCycle.emoji}</span>
              <span className={`font-mono text-xs font-bold tracking-wider ${currentCycle.color}`}>
                {currentCycle.text}
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => onNavigate('live-monitor')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-xs font-medium text-cyan-300 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Full Screen Monitor</span>
        </button>
      </div>

      {/* Main 3-Column Command Center Layout: Left Modules | Central AI Screen Shield | Right Modules */}
      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-5 items-center my-6">
        {/* LEFT SURROUNDING INTELLIGENCE PANELS (Section 9) */}
        <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3.5">
          {/* TOP LEFT: LIVE SCAN */}
          <div className="p-3.5 rounded-2xl bg-slate-950/75 border border-cyan-500/25 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-cyan-300">🔍 LIVE SCAN</span>
              <span className="text-emerald-400 font-semibold">ACTIVE</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 font-mono text-xs tabular-nums">
              <div>
                <div className="text-[10px] text-slate-400">FPS</div>
                <div className="text-slate-100 font-bold">{state.telemetry.fps}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Inference</div>
                <div className="text-cyan-300 font-bold">{state.telemetry.inferenceMs} ms</div>
              </div>
            </div>
          </div>

          {/* LEFT: VISUAL INTELLIGENCE */}
          <div className="p-3.5 rounded-2xl bg-slate-950/75 border border-cyan-500/25 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-sky-300">👁 VISUAL INTELLIGENCE</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 font-mono text-xs tabular-nums">
              <div>
                <div className="text-[10px] text-slate-400">Detected</div>
                <div className="text-slate-100 font-bold">{detectedCount}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Protected</div>
                <div className="text-emerald-400 font-bold">{protectedCount}</div>
              </div>
            </div>
          </div>

          {/* BOTTOM LEFT: ACTIVITY */}
          <div className="p-3.5 rounded-2xl bg-slate-950/75 border border-cyan-500/25 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-indigo-300">📊 ACTIVITY</span>
              <span className="text-[10px] text-slate-400">Today</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 font-mono text-xs tabular-nums">
              <div>
                <div className="text-[10px] text-slate-400">Scans</div>
                <div className="text-slate-100 font-bold">
                  {state.analytics.Today.totalScans.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Threats</div>
                <div className="text-rose-400 font-bold">
                  {state.analytics.Today.privacyThreats}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER: HOLOGRAPHIC 3D AI SCREEN SHIELD + MINIATURE LIVE SCREEN (Sections 2, 3, 4, 17) */}
        <div className="xl:col-span-6 flex flex-col items-center justify-center relative py-2">
          <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center">
            {/* Outer Rotating Scanning Ring 1 */}
            <svg
              aria-hidden="true"
              className="absolute inset-0 w-full h-full animate-spin-slow pointer-events-none"
              viewBox="0 0 400 400"
            >
              <circle
                cx="200"
                cy="200"
                r="190"
                fill="none"
                stroke="rgba(34, 211, 238, 0.22)"
                strokeWidth="1.5"
                strokeDasharray="18 12 6 12"
              />
              <circle cx="200" cy="10" r="4" fill="#22D3EE" />
              <circle cx="390" cy="200" r="3" fill="#818CF8" />
              <circle cx="200" cy="390" r="4" fill="#10B981" />
            </svg>

            {/* Inner Counter-Rotating Wireframe Ring 2 */}
            <svg
              aria-hidden="true"
              className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)] animate-spin-reverse-slow pointer-events-none"
              viewBox="0 0 360 360"
            >
              <circle
                cx="180"
                cy="180"
                r="170"
                fill="none"
                stroke="rgba(129, 140, 248, 0.25)"
                strokeWidth="1.2"
                strokeDasharray="40 20"
              />
              <circle cx="180" cy="10" r="3" fill="#38BDF8" />
              <circle cx="10" cy="180" r="3" fill="#22D3EE" />
            </svg>

            {/* Holographic Wireframe Shield Crest Backdrop */}
            <svg
              aria-hidden="true"
              className="absolute inset-6 w-[calc(100%-48px)] h-[calc(100%-48px)] pointer-events-none"
              viewBox="0 0 320 340"
              style={{
                filter: 'drop-shadow(0 0 28px rgba(6, 182, 212, 0.32))',
              }}
            >
              <defs>
                <linearGradient id="holoShieldFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.20" />
                  <stop offset="50%" stopColor="#1E1B4B" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.18" />
                </linearGradient>
                <linearGradient id="holoShieldStroke" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="50%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
              {/* Outer Shield Polygon */}
              <path
                d="M160 12 L296 62 L296 168 C296 248 236 304 160 330 C84 304 24 248 24 168 L24 62 Z"
                fill="url(#holoShieldFill)"
                stroke="url(#holoShieldStroke)"
                strokeWidth="2.2"
              />
              {/* Inner Wireframe Shield Polygon */}
              <path
                d="M160 28 L278 72 L278 165 C278 235 225 286 160 310 C95 286 42 235 42 165 L42 72 Z"
                fill="none"
                stroke="rgba(56, 189, 248, 0.35)"
                strokeWidth="1"
                strokeDasharray="6 4"
              />
            </svg>

            {/* LIVE MINIATURE COMPUTER SCREEN INSIDE THE SHIELD (Sections 2 & 4) */}
            <div className="relative z-20 w-[82%] rounded-2xl bg-[#060B16]/95 border-2 border-cyan-400/50 shadow-[0_0_36px_rgba(6,182,212,0.3)] overflow-hidden">
              {/* Laser Sweep when scanning */}
              {isScanning && (
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_20px_#22d3ee] animate-scan-line z-30 pointer-events-none" />
              )}

              {/* Miniature Screen Window Titlebar */}
              <div className="px-3 py-1.5 bg-slate-900/95 border-b border-white/10 flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                  <span className="w-2 h-2 rounded-full bg-amber-400/80" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
                  <span className="text-slate-300 font-semibold ml-1">
                    Protected Screen
                  </span>
                </div>
                <span className="text-cyan-400">🛡️ AI SHIELD ACTIVE</span>
              </div>

              {/* Miniature Screen Body with Detected Sensitive Regions */}
              <div className="p-3 space-y-2.5">
                {state.detections.slice(0, 3).map((det) => {
                  const emoji = getEmojiForCategory(det.category);
                  const isMasked = det.isProtected || state.protection.safeModeActive;

                  return (
                    <div
                      key={det.id}
                      onClick={() => onToggleDetectionMask(det.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onToggleDetectionMask(det.id);
                        }
                      }}
                      className={`group relative p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isMasked
                          ? 'bg-emerald-950/25 border-emerald-400/50 hover:border-emerald-300'
                          : 'bg-rose-950/35 border-rose-500/70 hover:border-rose-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{emoji}</span>
                          <span className="uppercase">{det.category}</span>
                          <span className="text-cyan-300">{det.confidence}%</span>
                        </span>

                        <span
                          className={`text-[10px] font-semibold ${
                            isMasked ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isMasked ? '🛡 AUTOMATICALLY PROTECTED' : '⚠ EXPOSED'}
                        </span>
                      </div>

                      {/* Protection Visualization (Section 17: Password: ████████) */}
                      <div className="mt-1.5 flex items-center justify-between text-xs font-mono bg-slate-950/90 px-2.5 py-1.5 rounded-lg border border-white/8">
                        <span className="text-slate-400 truncate">
                          {det.category}:{' '}
                          {isMasked ? (
                            <span className="text-emerald-300 tracking-widest">
                              ████████████
                            </span>
                          ) : (
                            <span className="text-amber-300">
                              {det.category === 'Password'
                                ? 'vlt_994#Aegis'
                                : det.category === 'OTP'
                                ? '482 910'
                                : 'srikaravi5@gmail.com'}
                            </span>
                          )}
                        </span>
                        <Lock
                          className={`w-3 h-3 shrink-0 ${
                            isMasked ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Miniature Screen Footer */}
              <div className="px-3 py-1.5 bg-slate-950/90 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Mode: {state.protection.mode.toUpperCase()}</span>
                <span className="text-emerald-400">Click box to toggle mask</span>
              </div>
            </div>
          </div>

          {/* SHIELD STATUS BAR UNDER THE CENTRAL SHIELD (Section 8) */}
          <div className="w-full max-w-xl mt-2 p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">SCREEN PROTECTION:</span>
              <span className="text-emerald-400 font-bold">PROTECTED</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <div>
              <span className="text-slate-400">AI Monitoring: </span>
              <span className="text-cyan-300 font-semibold">ACTIVE</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <div className="tabular-nums">
              <span className="text-slate-400">Last Scan: </span>
              <span className="text-slate-200">
                {state.telemetry.lastScanSecondsAgo}s ago
              </span>
            </div>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <div>
              <span className="text-slate-400">Mode: </span>
              <span className="text-emerald-300 font-semibold">
                AUTO {state.protection.mode.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SURROUNDING INTELLIGENCE PANELS (Section 9) */}
        <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3.5">
          {/* TOP RIGHT: AI ENGINE */}
          <div className="p-3.5 rounded-2xl bg-slate-950/75 border border-cyan-500/25 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-cyan-300">🧠 AI ENGINE</span>
              <span className="text-emerald-400 font-semibold">ONLINE</span>
            </div>
            <div className="space-y-1 pt-1 border-t border-white/10 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Vision</span>
                <span className="text-emerald-400">ONLINE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">OCR</span>
                <span className="text-emerald-400">ONLINE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Engine</span>
                <span className="text-emerald-400">ONLINE</span>
              </div>
            </div>
          </div>

          {/* RIGHT: PRIVACY RISK */}
          <div className="p-3.5 rounded-2xl bg-slate-950/75 border border-cyan-500/25 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-amber-300">⚠ PRIVACY RISK</span>
              <span className="text-emerald-400 font-semibold">LOW</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 font-mono text-xs tabular-nums">
              <div>
                <div className="text-[10px] text-slate-400">Current</div>
                <div className="text-emerald-400 font-bold">
                  {state.threatLevel === 'SAFE' ? 'LOW' : state.threatLevel}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Risk Index</div>
                <div className="text-slate-100 font-bold">
                  {riskScoreOutOf100}/100
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM RIGHT: PROTECTION */}
          <div className="p-3.5 rounded-2xl bg-slate-950/75 border border-cyan-500/25 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-emerald-300">🛡 PROTECTION</span>
              <span className="text-cyan-300">Active</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 font-mono text-xs">
              <div>
                <div className="text-[10px] text-slate-400">Auto Blur</div>
                <div className="text-emerald-400 font-bold">
                  {state.protection.automaticProtection ? 'ON' : 'OFF'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Auto Blackout</div>
                <div className="text-slate-300 font-bold">
                  {state.protection.mode === 'Blackout' ? 'ON' : 'ZONE'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar + Subtle Trust Details (Sections 25 & 27) */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Glowing Command Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onProtectAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-[0_0_24px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>🛡 PROTECT SCREEN</span>
          </button>

          <button
            type="button"
            onClick={onRunScan}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 font-semibold text-xs shadow-[0_0_16px_rgba(6,182,212,0.15)] transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>🔍 RUN PRIVACY SCAN</span>
          </button>

          <button
            type="button"
            onClick={onEmergencyProtect}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 text-rose-200 border border-rose-500/50 hover:border-rose-400 font-semibold text-xs shadow-[0_0_20px_rgba(244,63,94,0.25)] transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-rose-400" />
            <span>⚡ EMERGENCY PROTECT</span>
          </button>
        </div>

        {/* Premium Trust Details (Section 27) */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
          <span>ON-DEVICE AI</span>
          <span>·</span>
          <span>PRIVACY FIRST</span>
          <span>·</span>
          <span>NO CLOUD UPLOAD</span>
          <span>·</span>
          <span className="text-emerald-400">REAL-TIME PROTECTION</span>
        </div>
      </div>
    </div>
  );
};
