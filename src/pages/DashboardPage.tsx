import React, { useState } from 'react';
import {
  Camera,
  CameraOff,
  Cpu,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  CameraState,
  NavigationTab,
  ProtectionMode,
  ScreenShieldState,
} from '../types/screenshield';
import { CentralScreenShield } from '../components/CentralScreenShield';
import { ThreatCard } from '../components/ThreatCard';
import { ScreenPreview } from '../components/ScreenPreview';
import { DetectionCard } from '../components/DetectionCard';
import { EventTimeline } from '../components/EventTimeline';
import { RiskIndicator } from '../components/RiskIndicator';

interface DashboardPageProps {
  state: ScreenShieldState;
  focusMode: boolean;
  isScanning: boolean;
  scanStatusText: string | null;
  onProtectAll: () => void;
  onRunScan: () => void;
  onToggleSafeMode: () => void;
  onEmergencyProtect: () => void;
  onToggleDetectionMask: (id: string) => void;
  onDismissThreatAlert: () => void;
  onSimulateThreat: () => void;
  onApplyProtectionMode: (mode: ProtectionMode) => void;
  onUpdateCamera: (patch: Partial<CameraState>) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  state,
  focusMode,
  isScanning,
  scanStatusText,
  onProtectAll,
  onRunScan,
  onEmergencyProtect,
  onToggleDetectionMask,
  onDismissThreatAlert,
  onSimulateThreat,
  onApplyProtectionMode,
  onUpdateCamera,
  onNavigate,
}) => {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const protectedCount = state.detections.filter(
    (d) => d.isProtected || state.protection.safeModeActive
  ).length;
  const exposedSensitiveCount = state.detections.filter(
    (d) => !d.isProtected && !state.protection.safeModeActive
  ).length;

  // Circular Privacy Risk Module math (Section 7)
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, state.privacyScore));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;
  const ringColor =
    clampedScore >= 85
      ? '#10B981'
      : clampedScore >= 70
      ? '#38BDF8'
      : clampedScore >= 45
      ? '#F59E0B'
      : '#F43F5E';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* High-Risk Threat Alert Banner */}
      {state.activeThreatAlert && (
        <ThreatCard
          threat={state.activeThreatAlert}
          onProtectNow={(id) => {
            onToggleDetectionMask(id);
          }}
          onViewDetails={() => onNavigate('live-monitor')}
          onDismiss={onDismissThreatAlert}
        />
      )}

      {/* COMMAND-CENTER TOP GRID: Central AI Screen Shield (Left/Center) + Right AI Status Modules */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* CENTERPIECE: 🛡️ AI SCREEN SHIELD (8 Columns) */}
        <div className="xl:col-span-8">
          <CentralScreenShield
            state={state}
            scanStepText={scanStatusText}
            isScanning={isScanning}
            onToggleDetectionMask={onToggleDetectionMask}
            onRunScan={onRunScan}
            onProtectAll={onProtectAll}
            onEmergencyProtect={onEmergencyProtect}
            onNavigate={onNavigate}
          />
        </div>

        {/* RIGHT COLUMN: Privacy Risk Module + AI Detection Console + Camera Vision Module (4 Columns) */}
        <aside className="xl:col-span-4 space-y-4">
          {/* 1. PRIVACY RISK MODULE (Section 7) */}
          <div className="p-5 rounded-2xl glass-card border border-cyan-500/25 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold tracking-wider text-slate-100 uppercase">
                🛡️ PRIVACY RISK MODULE
              </span>
              <RiskIndicator risk={state.threatLevel} />
            </div>

            <div className="flex items-center justify-between gap-4">
              {/* Futuristic Circular Score Ring */}
              <div
                className="relative w-32 h-32 flex items-center justify-center shrink-0"
                style={{
                  filter: `drop-shadow(0 0 18px ${
                    clampedScore >= 85
                      ? 'rgba(16, 185, 129, 0.25)'
                      : 'rgba(56, 189, 248, 0.25)'
                  })`,
                }}
              >
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="none"
                    stroke="rgba(30, 41, 59, 0.85)"
                    strokeWidth="9"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-2xl font-bold text-slate-100 tabular-nums leading-none">
                    {clampedScore}
                  </span>
                  <div className="w-8 h-px bg-slate-700 my-1" />
                  <span className="font-mono text-[9px] font-bold tracking-wider text-emerald-400">
                    PRIVACY
                  </span>
                  <span className="font-mono text-[9px] font-bold tracking-wider text-cyan-300">
                    {clampedScore >= 80 ? 'PROTECTED' : 'WARNING'}
                  </span>
                </div>
              </div>

              {/* Telemetry Breakdown */}
              <div className="flex-1 space-y-2.5 font-mono text-xs tabular-nums">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-white/8">
                  <span className="text-slate-400">Threat Level</span>
                  <span className="text-emerald-400 font-bold">
                    {state.threatLevel}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-white/8">
                  <span className="text-slate-400">Sensitive Regions</span>
                  <span
                    className={`font-bold ${
                      exposedSensitiveCount > 0
                        ? 'text-rose-400'
                        : 'text-slate-200'
                    }`}
                  >
                    {exposedSensitiveCount}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-white/8">
                  <span className="text-slate-400">Protected Regions</span>
                  <span className="text-emerald-400 font-bold">
                    {protectedCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. AI DETECTION DIAGNOSTIC MODULE (Section 6) */}
          <div className="p-5 rounded-2xl glass-card border border-cyan-500/25 space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold tracking-wider text-slate-100 uppercase">
                  🧠 AI DETECTION
                </h2>
              </div>
              <span className="font-mono text-xs text-cyan-300 tabular-nums">
                Inference: {state.telemetry.inferenceMs} ms
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-white/8">
                <span className="text-slate-300">UI Elements</span>
                <span className="text-emerald-400 font-semibold">ONLINE</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-white/8">
                <span className="text-slate-300">OCR</span>
                <span className="text-emerald-400 font-semibold">ONLINE</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-white/8">
                <span className="text-slate-300">Privacy Classifier</span>
                <span className="text-emerald-400 font-semibold">ONLINE</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-white/8">
                <span className="text-slate-300">Face/Viewer Detection</span>
                <span
                  className={
                    state.camera.enabled
                      ? 'text-emerald-400 font-semibold'
                      : 'text-amber-300 font-semibold'
                  }
                >
                  {state.camera.enabled ? 'ONLINE' : 'STANDBY'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. CAMERA VISION MODULE (Section 5) */}
          <div className="p-5 rounded-2xl glass-card border border-cyan-500/25 space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                {state.camera.enabled ? (
                  <Camera className="w-4 h-4 text-emerald-400" />
                ) : (
                  <CameraOff className="w-4 h-4 text-slate-400" />
                )}
                <h2 className="text-xs font-bold tracking-wider text-slate-100 uppercase">
                  👁 CAMERA VISION
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  onUpdateCamera({
                    enabled: !state.camera.enabled,
                    viewerDetectionActive: !state.camera.enabled,
                    detectedViewers: 1,
                    privacyRisk: 'LOW',
                  })
                }
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold border transition-colors cursor-pointer ${
                  state.camera.enabled
                    ? 'bg-emerald-950/60 border-emerald-400/50 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {state.camera.enabled ? 'ACTIVE' : 'Camera OFF'}
              </button>
            </div>

            {!state.camera.enabled ? (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/8 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Status: STANDBY</span>
                <span className="text-slate-300">Optional Shoulder Guard</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 font-mono text-xs tabular-nums">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/8">
                  <div className="text-[10px] text-slate-400">Viewer Det.</div>
                  <div className="text-emerald-400 font-bold mt-0.5">ON</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/8">
                  <div className="text-[10px] text-slate-400">People</div>
                  <div className="text-slate-100 font-bold mt-0.5">
                    {state.camera.detectedViewers}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/8">
                  <div className="text-[10px] text-slate-400">Privacy Risk</div>
                  <div className="text-emerald-400 font-bold mt-0.5">
                    {state.camera.privacyRisk === 'SAFE'
                      ? 'LOW'
                      : state.camera.privacyRisk}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Secondary Section: Interactive Full Screen Preview + Detections + Smart Insights + SOC Timeline */}
      {!focusMode && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <div className="xl:col-span-8">
              <ScreenPreview
                detections={state.detections}
                zones={state.zones}
                protection={state.protection}
                highlightedDetectionId={highlightedId}
                isScanning={isScanning}
                scanStatusText={scanStatusText}
                onToggleDetectionMask={onToggleDetectionMask}
                onSimulateThreat={onSimulateThreat}
              />
            </div>

            {/* Live AI Detections + Smart Insights */}
            <div className="xl:col-span-4 space-y-4">
              <div className="p-5 rounded-2xl glass-card space-y-3.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <h2 className="text-xs font-bold tracking-wider text-slate-100 uppercase">
                      LIVE AI INTELLIGENCE
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-cyan-400">
                    {state.detections.length} Regions
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
                  {state.detections.map((det) => (
                    <DetectionCard
                      key={det.id}
                      detection={det}
                      isHighlighted={highlightedId === det.id}
                      onHover={setHighlightedId}
                      onToggleProtect={onToggleDetectionMask}
                    />
                  ))}
                </div>
              </div>

              {/* Smart Insights (Section 23) */}
              <div className="p-5 rounded-2xl glass-card space-y-3">
                <div className="p-3 rounded-xl bg-slate-950/65 border border-white/10">
                  <div className="text-[11px] font-mono font-bold text-cyan-300">
                    🧠 AI INSIGHT
                  </div>
                  <p className="text-xs text-slate-200 mt-1">
                    “Most privacy risks occurred while using browser login pages.”
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/65 border border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-mono font-bold text-amber-300">
                      💡 RECOMMENDATION
                    </div>
                    <p className="text-xs text-slate-200 mt-1">
                      “Enable automatic blackout for financial information.”
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onApplyProtectionMode('Blackout')}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 font-mono text-[11px] font-semibold shrink-0 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom SOC Privacy Event Feed (Section 18) */}
          <section className="p-5 sm:p-6 rounded-2xl glass-card">
            <EventTimeline
              events={state.events}
              maxItems={5}
              title="PRIVACY EVENT FEED"
              onViewAll={() => onNavigate('privacy-events')}
            />
          </section>
        </>
      )}
    </div>
  );
};
