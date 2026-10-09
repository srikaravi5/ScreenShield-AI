import React, { useState } from 'react';
import {
  Activity,
  Camera,
  Cpu,
  Gauge,
  HardDrive,
  Scan,
  Shield,
} from 'lucide-react';
import { RiskLevel, ScreenShieldState } from '../types/screenshield';
import { ScreenPreview } from '../components/ScreenPreview';
import { DetectionCard } from '../components/DetectionCard';
import { PrivacyScore } from '../components/PrivacyScore';
import { RiskIndicator } from '../components/RiskIndicator';

interface LiveMonitorPageProps {
  state: ScreenShieldState;
  isScanning?: boolean;
  scanStatusText?: string | null;
  onToggleDetectionMask: (id: string) => void;
  onSimulateThreat: () => void;
  onRunScan: () => void;
  onProtectAll: () => void;
  onToggleCamera: () => void;
}

export const LiveMonitorPage: React.FC<LiveMonitorPageProps> = ({
  state,
  isScanning = false,
  scanStatusText = null,
  onToggleDetectionMask,
  onSimulateThreat,
  onRunScan,
  onProtectAll,
  onToggleCamera,
}) => {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');

  const filteredDetections = state.detections.filter((d) =>
    riskFilter === 'ALL' ? true : d.risk === riskFilter
  );

  const sensitiveCount = state.detections.length;
  const protectedCount = state.detections.filter(
    (d) => d.isProtected || state.protection.safeModeActive
  ).length;
  const unprotectedThreats = state.detections.filter(
    (d) =>
      !d.isProtected &&
      !state.protection.safeModeActive &&
      (d.risk === 'CRITICAL' || d.risk === 'HIGH')
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Dedicated Live Screen Monitor
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time frame buffer inspection, bounding-box masking, and on-device inference telemetry
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onRunScan}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors cursor-pointer"
          >
            <Scan className="w-3.5 h-3.5 text-cyan-400" />
            <span>Force Frame Scan</span>
          </button>

          <button
            type="button"
            onClick={onProtectAll}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Mask All Regions</span>
          </button>
        </div>
      </div>

      {/* Main Monitoring Grid: Left Large Preview + Right AI Detection Stream */}
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

        {/* Right: AI Detection Stream */}
        <div className="xl:col-span-4 p-5 rounded-2xl glass-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="text-sm font-bold tracking-wider text-slate-100">
                AI DETECTION STREAM
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Live bounding boxes & confidence scores
              </p>
            </div>
            <span className="font-mono text-xs text-emerald-400 tabular-nums">
              {state.telemetry.fps} FPS
            </span>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800/80">
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setRiskFilter(level)}
                className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-mono font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  riskFilter === level
                    ? 'bg-slate-800 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredDetections.map((det) => (
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
      </div>

      {/* Bottom: Privacy Score + System Performance Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-900/70 border border-slate-800/90 flex items-center">
          <PrivacyScore
            compact
            score={state.privacyScore}
            threatLevel={state.threatLevel}
            aiMonitoringActive={state.telemetry.aiEngine === 'ONLINE'}
            lastScanSecondsAgo={state.telemetry.lastScanSecondsAgo}
            sensitiveRegionsCount={sensitiveCount}
            protectedRegionsCount={protectedCount}
            unprotectedThreatsCount={unprotectedThreats}
          />
        </div>

        {/* System Performance Metrics */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-slate-900/70 border border-slate-800/90 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              On-Device Engine Telemetry
            </span>
            <button
              type="button"
              onClick={onToggleCamera}
              className="inline-flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-cyan-300 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Shoulder-Surfing Guard: {state.camera.enabled ? 'ACTIVE' : 'OFF'}
              </span>
              {state.camera.enabled && (
                <RiskIndicator risk={state.camera.privacyRisk} size="sm" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-800/80">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>CPU</span>
              </div>
              <div className="font-mono text-lg font-bold text-slate-100 tabular-nums">
                {state.telemetry.cpuPercent}%
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                <span>Memory</span>
              </div>
              <div className="font-mono text-lg font-bold text-slate-100 tabular-nums">
                {state.telemetry.memoryGb.toFixed(1)} GB
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                <span>Inference</span>
              </div>
              <div className="font-mono text-lg font-bold text-slate-100 tabular-nums">
                {state.telemetry.inferenceMs} ms
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Monitoring</span>
              </div>
              <div className="font-mono text-lg font-bold text-slate-100 tabular-nums">
                {state.telemetry.fps} FPS
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
