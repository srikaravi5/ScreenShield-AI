import React from 'react';
import {
  Camera,
  CameraOff,
  EyeOff,
  Shield,
  ShieldCheck,
  Sliders,
  Users,
} from 'lucide-react';
import {
  CameraState,
  ProtectionConfig,
  ProtectionMode,
  ProtectionTrigger,
} from '../types/screenshield';
import { RiskIndicator } from '../components/RiskIndicator';

interface ProtectionPageProps {
  protection: ProtectionConfig & { sensitivity?: 'LOW' | 'MEDIUM' | 'HIGH' };
  camera: CameraState;
  onUpdateProtection: (
    patch: Partial<ProtectionConfig & { sensitivity: 'LOW' | 'MEDIUM' | 'HIGH' }>
  ) => void;
  onUpdateCamera: (patch: Partial<CameraState>) => void;
  onTriggerEmergencyProtect: () => void;
}

const PROTECTION_MODES: {
  mode: ProtectionMode;
  description: string;
}[] = [
  {
    mode: 'Blur',
    description: 'Gaussian optical blur preserving window context while hiding text',
  },
  {
    mode: 'Pixelate',
    description: 'High-contrast mosaic redaction for dense credential blocks',
  },
  {
    mode: 'Blackout',
    description: 'Zero-luminance solid blackout shield over sensitive regions',
  },
  {
    mode: 'Warning Overlay',
    description: 'Translucent caution banner warning before screen sharing',
  },
  {
    mode: 'Safe Mode',
    description: 'Enforces strict masking across all detected inputs regardless of tier',
  },
];

const TRIGGERS: ProtectionTrigger[] = [
  'Medium Risk',
  'High Risk',
  'Critical Risk',
];

export const ProtectionPage: React.FC<ProtectionPageProps> = ({
  protection,
  camera,
  onUpdateProtection,
  onUpdateCamera,
  onTriggerEmergencyProtect,
}) => {
  const filledBlocks = Math.round(protection.blurIntensity / 10);
  const asciiBar =
    '█'.repeat(filledBlocks) + '░'.repeat(Math.max(0, 10 - filledBlocks));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Protection Center Hero Banner (Section 19) */}
      <div className="p-6 rounded-2xl glass-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_28px_rgba(16,185,129,0.28)] shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-emerald-400">
              🛡 PROTECTION CENTER
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mt-0.5">
              Autonomous Visual Shield — {protection.automaticProtection ? 'ON' : 'STANDBY'}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 mt-1.5">
              <span>
                Protection Mode: <strong className="text-cyan-300">{protection.mode}</strong>
              </span>
              <span>·</span>
              <span>
                Sensitivity: <strong className="text-emerald-400">{protection.sensitivity || 'HIGH'}</strong>
              </span>
              <span>·</span>
              <span>
                Trigger: <strong className="text-amber-300">{protection.triggerLevel}</strong>
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onTriggerEmergencyProtect}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-[0_0_24px_rgba(244,63,94,0.35)] transition-all whitespace-nowrap self-start md:self-auto cursor-pointer"
        >
          <Shield className="w-4 h-4" />
          <span>⚡ PROTECT SCREEN NOW</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Protection Modes & Intensity */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-semibold text-slate-100">
                Protection Modes
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs text-slate-400">
                Automatic Protection:
              </span>
              <button
                type="button"
                onClick={() =>
                  onUpdateProtection({
                    automaticProtection: !protection.automaticProtection,
                  })
                }
                className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold border transition-colors cursor-pointer ${
                  protection.automaticProtection
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {protection.automaticProtection ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Mode Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROTECTION_MODES.map(({ mode, description }) => {
              const selected = protection.mode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() =>
                    onUpdateProtection({
                      mode,
                      safeModeActive: mode === 'Safe Mode',
                    })
                  }
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selected
                      ? 'bg-cyan-950/50 border-cyan-400/60 text-slate-100 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-950/60 border-white/10 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{mode}</span>
                    {selected && (
                      <span className="font-mono text-[11px] text-cyan-400">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Blur Intensity Slider */}
          <div className="p-4 rounded-xl bg-slate-950/75 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="blur-intensity-slider"
                className="text-xs font-semibold text-slate-200"
              >
                Blur Intensity
              </label>
              <span className="font-mono text-xs text-cyan-400 tabular-nums">
                {asciiBar} {protection.blurIntensity}%
              </span>
            </div>

            <input
              id="blur-intensity-slider"
              type="range"
              min={20}
              max={100}
              step={5}
              value={protection.blurIntensity}
              onChange={(e) =>
                onUpdateProtection({ blurIntensity: Number(e.target.value) })
              }
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Sensitivity & Trigger Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-200">
                Sensitivity Level
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['LOW', 'MEDIUM', 'HIGH'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onUpdateProtection({ sensitivity: s })}
                    className={`py-2 px-2.5 rounded-xl text-xs font-mono font-medium border transition-colors cursor-pointer ${
                      (protection.sensitivity || 'HIGH') === s
                        ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-200">
                Protection Trigger
              </span>
              <div className="grid grid-cols-3 gap-2">
                {TRIGGERS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onUpdateProtection({ triggerLevel: t })}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                      protection.triggerLevel === t
                        ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.replace(' Risk', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Camera / Shoulder Surfing Guard */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                {camera.enabled ? (
                  <Camera className="w-4 h-4 text-amber-400" />
                ) : (
                  <CameraOff className="w-4 h-4 text-slate-400" />
                )}
                <h2 className="text-base font-semibold text-slate-100">
                  Camera / Shoulder Surfing
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  onUpdateCamera({
                    enabled: !camera.enabled,
                    viewerDetectionActive: !camera.enabled,
                    detectedViewers: !camera.enabled ? 2 : 0,
                    privacyRisk: !camera.enabled ? 'HIGH' : 'SAFE',
                  })
                }
                className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold border transition-colors cursor-pointer ${
                  camera.enabled
                    ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                {camera.enabled ? 'ACTIVE' : 'OFF'}
              </button>
            </div>

            {!camera.enabled ? (
              <div className="p-6 rounded-xl bg-slate-950/70 border border-white/10 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <EyeOff className="w-6 h-6" />
                </div>
                <div className="font-mono text-xs font-semibold text-slate-300">
                  Camera: OFF
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  “Camera is disabled. ScreenShield will not use your camera.”
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateCamera({
                        enabled: true,
                        viewerDetectionActive: true,
                        detectedViewers: 2,
                        privacyRisk: 'HIGH',
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                  >
                    Enable Shoulder-Surfing Detection
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-950/25 border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Camera:</span>
                    <span className="font-mono font-semibold text-emerald-400">
                      ACTIVE (Local Enclave)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Viewer Detection:</span>
                    <span className="font-mono font-semibold text-cyan-400">
                      {camera.viewerDetectionActive ? 'ACTIVE' : 'STANDBY'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Detected Viewers:</span>
                    <span className="font-mono font-bold text-slate-100 tabular-nums">
                      {camera.detectedViewers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Privacy Risk:</span>
                    <RiskIndicator risk={camera.privacyRisk} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Simulate Viewer Count</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateCamera({
                          detectedViewers: 1,
                          privacyRisk: 'SAFE',
                        })
                      }
                      className={`py-2 px-3 rounded-lg text-xs font-mono border cursor-pointer ${
                        camera.detectedViewers === 1
                          ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      1 Viewer (Safe)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateCamera({
                          detectedViewers: 2,
                          privacyRisk: 'HIGH',
                        })
                      }
                      className={`py-2 px-3 rounded-lg text-xs font-mono border cursor-pointer ${
                        camera.detectedViewers >= 2
                          ? 'bg-amber-950/50 border-amber-500/50 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      2 Viewers (High Risk)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 leading-relaxed">
            Zero frames leave RAM. Gaze estimation runs locally on the NPU and immediately discards optical buffers after inference.
          </div>
        </div>
      </div>
    </div>
  );
};
