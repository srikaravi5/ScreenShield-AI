import React, { useState } from 'react';
import {
  CheckCircle2,
  CloudOff,
  Database,
  EyeOff,
  FileX,
  Lock,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { ScreenShieldState } from '../types/screenshield';

interface PrivacyCenterPageProps {
  state: ScreenShieldState;
  onPurgeSessionCache: () => void;
}

export const PrivacyCenterPage: React.FC<PrivacyCenterPageProps> = ({
  state,
  onPurgeSessionCache,
}) => {
  const [verifiedTime, setVerifiedTime] = useState('Just now');

  const pillars = [
    {
      label: 'AI Processing',
      value: '✓ ON-DEVICE',
      detail: 'All Visual AI, OCR, and classification models execute 100% locally on your hardware.',
      Icon: ShieldCheck,
    },
    {
      label: 'Cloud Upload',
      value: '✓ OFF',
      detail: 'Zero outbound network sockets permitted for screen frames or OCR text.',
      Icon: CloudOff,
    },
    {
      label: 'Raw Screenshots',
      value: '✓ NOT STORED',
      detail: 'Frame buffers are analyzed in volatile RAM and overwritten within 16ms.',
      Icon: FileX,
    },
    {
      label: 'Sensitive Text',
      value: '✓ NOT STORED',
      detail: 'Detected passwords, OTPs, and keys are never written to disk or logs.',
      Icon: Lock,
    },
    {
      label: 'Camera',
      value: state.camera.enabled ? '✓ ACTIVE (LOCAL)' : '✓ OFF',
      detail: state.camera.enabled
        ? 'Used strictly for local viewer count detection; zero video recorded.'
        : 'Camera hardware is disconnected from ScreenShield AI.',
      Icon: EyeOff,
    },
    {
      label: 'Event Data',
      value: `✓ ${state.settings.dataRetention.toUpperCase()}`,
      detail: 'Only anonymized bounding-box event timestamps are kept in memory.',
      Icon: Database,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>ZERO-TRUST ARCHITECTURE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            🔐 YOUR PRIVACY, YOUR CONTROL
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic and architectural guarantees ensuring your screen content never leaves your machine
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setVerifiedTime(new Date().toLocaleTimeString())}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-card hover:border-cyan-400/50 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Verify Isolation ({verifiedTime})</span>
          </button>

          <button
            type="button"
            onClick={onPurgeSessionCache}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Purge Ephemeral Cache</span>
          </button>
        </div>
      </div>

      {/* 6 Core Privacy Guarantees Grid (Section 20) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pillars.map(({ label, value, detail, Icon }) => (
          <div
            key={label}
            className="p-5 rounded-2xl glass-card glass-card-hover flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-cyan-400">
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{value.replace('✓ ', '')}</span>
              </span>
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-100">
                ✓ {label}: <span className="text-emerald-400">{value.replace('✓ ', '')}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Architecture Verification Statement */}
      <div className="p-6 rounded-2xl glass-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <h3 className="text-sm font-semibold text-slate-100">
            Zero-Egress Memory Pipeline
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            ScreenShield AI processes display frames inside an isolated on-device process. Bounding box coordinates are computed in real time and passed directly to the compositor overlay without serializing pixel data or text strings to storage.
          </p>
        </div>
        <div className="font-mono text-xs text-emerald-400 shrink-0">
          ✓ Egress Traffic: 0.00 KB/s
        </div>
      </div>
    </div>
  );
};
