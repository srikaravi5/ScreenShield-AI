import React from 'react';
import {
  AppSettings,
  CameraState,
  ProtectionConfig,
  ProtectionMode,
} from '../types/screenshield';
import { SettingRow, SettingsSection } from '../components/SettingsSection';

interface SettingsPageProps {
  settings: AppSettings;
  protection: ProtectionConfig;
  camera: CameraState;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onUpdateProtection: (patch: Partial<ProtectionConfig>) => void;
  onUpdateCamera: (patch: Partial<CameraState>) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  protection,
  camera,
  onUpdateSettings,
  onUpdateProtection,
  onUpdateCamera,
}) => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
          System Preferences & Security Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure monitoring cadence, appearance, local privacy enforcement, camera guard, and alerts
        </p>
      </div>

      {/* 1. General */}
      <SettingsSection
        title="General"
        description="Core monitoring frequency, AI sensitivity, and startup behavior"
      >
        <SettingRow
          label="Monitoring Frequency"
          description="Frame inspection rate per second (higher FPS increases responsiveness)"
          control={
            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800">
              {([1, 5, 10, 15] as const).map((fps) => (
                <button
                  key={fps}
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ monitoringFrequencyFps: fps })
                  }
                  className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer ${
                    settings.monitoringFrequencyFps === fps
                      ? 'bg-cyan-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {fps} FPS
                </button>
              ))}
            </div>
          }
        />

        <SettingRow
          label="Detection Sensitivity"
          description="Confidence threshold required before flagging screen elements"
          control={
            <select
              aria-label="Detection Sensitivity"
              value={settings.detectionSensitivity}
              onChange={(e) =>
                onUpdateSettings({
                  detectionSensitivity: e.target
                    .value as AppSettings['detectionSensitivity'],
                })
              }
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="Balanced">Balanced</option>
              <option value="Strict">Strict</option>
              <option value="Maximum">Maximum</option>
            </select>
          }
        />

        <SettingRow
          label="Auto Start"
          description="Launch ScreenShield AI daemon automatically at system login"
          control={
            <button
              type="button"
              onClick={() =>
                onUpdateSettings({ autoStart: !settings.autoStart })
              }
              className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold border cursor-pointer ${
                settings.autoStart
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {settings.autoStart ? 'ENABLED' : 'DISABLED'}
            </button>
          }
        />
      </SettingsSection>

      {/* 2. Appearance */}
      <SettingsSection
        title="Appearance"
        description="Interface contrast theme optimized for SOC and desktop workspaces"
      >
        <SettingRow
          label="Interface Theme"
          description="Switch between Cyber Dark Mode and High-Contrast Light Mode"
          control={
            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800">
              {(['dark', 'light'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onUpdateSettings({ theme: t })}
                  className={`px-3 py-1 rounded text-xs font-medium capitalize cursor-pointer ${
                    settings.theme === t
                      ? 'bg-cyan-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t} Mode
                </button>
              ))}
            </div>
          }
        />
      </SettingsSection>

      {/* 3. Privacy */}
      <SettingsSection
        title="Privacy"
        description="Zero-egress processing guarantees and local audit log retention"
      >
        <SettingRow
          label="Local Processing"
          description="Enforce 100% on-device neural execution with zero cloud calls"
          control={
            <span className="font-mono text-xs font-semibold text-emerald-400">
              LOCKED ON (ENFORCED)
            </span>
          }
        />

        <SettingRow
          label="Data Retention"
          description="Lifecycle policy for local privacy event metadata"
          control={
            <select
              aria-label="Data Retention"
              value={settings.dataRetention}
              onChange={(e) =>
                onUpdateSettings({
                  dataRetention: e.target.value as AppSettings['dataRetention'],
                })
              }
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="Minimal">Minimal</option>
              <option value="Session Only">Session Only</option>
              <option value="7 Days">7 Days</option>
            </select>
          }
        />

        <SettingRow
          label="Event Logging"
          description="Record detection timestamps in the Privacy Event Timeline"
          control={
            <button
              type="button"
              onClick={() =>
                onUpdateSettings({ eventLogging: !settings.eventLogging })
              }
              className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold border cursor-pointer ${
                settings.eventLogging
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {settings.eventLogging ? 'ON' : 'OFF'}
            </button>
          }
        />
      </SettingsSection>

      {/* 4. Protection */}
      <SettingsSection
        title="Protection"
        description="Default visual masking method and automated response rules"
      >
        <SettingRow
          label="Default Protection Method"
          description="Redaction style applied when sensitive fields appear"
          control={
            <select
              aria-label="Default Protection Method"
              value={protection.mode}
              onChange={(e) => {
                const mode = e.target.value as ProtectionMode;
                onUpdateProtection({ mode });
                onUpdateSettings({ defaultProtectionMethod: mode });
              }}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="Blur">Blur</option>
              <option value="Pixelate">Pixelate</option>
              <option value="Blackout">Blackout</option>
              <option value="Warning Overlay">Warning Overlay</option>
              <option value="Safe Mode">Safe Mode</option>
            </select>
          }
        />

        <SettingRow
          label="Automatic Protection"
          description="Immediately shield Critical and High-Risk detections without prompting"
          control={
            <button
              type="button"
              onClick={() =>
                onUpdateProtection({
                  automaticProtection: !protection.automaticProtection,
                })
              }
              className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold border cursor-pointer ${
                protection.automaticProtection
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {protection.automaticProtection ? 'ON' : 'OFF'}
            </button>
          }
        />
      </SettingsSection>

      {/* 5. Camera */}
      <SettingsSection
        title="Camera"
        description="Optical shoulder-surfing detection and secondary viewer alerts"
      >
        <SettingRow
          label="Enable Camera"
          description={
            camera.enabled
              ? 'Camera is active for local viewer detection'
              : 'Camera is disabled. ScreenShield will not use your camera.'
          }
          control={
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
              className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold border cursor-pointer ${
                camera.enabled
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {camera.enabled ? 'ACTIVE' : 'OFF'}
            </button>
          }
        />

        <SettingRow
          label="Shoulder Surfing Detection"
          description="Elevate privacy risk when 2 or more viewers face the display"
          control={
            <button
              type="button"
              onClick={() =>
                onUpdateCamera({
                  viewerDetectionActive: !camera.viewerDetectionActive,
                })
              }
              disabled={!camera.enabled}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold border cursor-pointer disabled:opacity-40 ${
                camera.viewerDetectionActive && camera.enabled
                  ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {camera.viewerDetectionActive && camera.enabled ? 'ACTIVE' : 'OFF'}
            </button>
          }
        />
      </SettingsSection>

      {/* 6. Notifications */}
      <SettingsSection
        title="Notifications"
        description="Non-blocking toast notifications and audio cues"
      >
        <SettingRow
          label="Desktop Alerts"
          description="Show real-time toast alerts when sensitive regions are blurred"
          control={
            <button
              type="button"
              onClick={() =>
                onUpdateSettings({ desktopAlerts: !settings.desktopAlerts })
              }
              className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold border cursor-pointer ${
                settings.desktopAlerts
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {settings.desktopAlerts ? 'ON' : 'OFF'}
            </button>
          }
        />

        <SettingRow
          label="Sound Alerts"
          description="Play subtle acoustic chime on Critical privacy risk"
          control={
            <button
              type="button"
              onClick={() =>
                onUpdateSettings({ soundAlerts: !settings.soundAlerts })
              }
              className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold border cursor-pointer ${
                settings.soundAlerts
                  ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {settings.soundAlerts ? 'ON' : 'OFF'}
            </button>
          }
        />
      </SettingsSection>
    </div>
  );
};
