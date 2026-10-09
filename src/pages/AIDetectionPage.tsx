import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Gauge,
  Play,
  Power,
  Shield,
} from 'lucide-react';
import { AIModelStatus } from '../types/screenshield';

interface AIDetectionPageProps {
  models: AIModelStatus[];
  onToggleModel: (id: string) => void;
  onUpdateThreshold: (id: string, threshold: number) => void;
}

const MODEL_EMOJIS: Record<string, string> = {
  'model-ui-det': '🧠',
  'model-ocr': '👁',
  'model-classifier': '🤖',
  'model-face': '🎯',
};

const PIPELINE_STEPS = [
  { step: '01', title: 'SCREEN', detail: '60Hz Frame Buffer' },
  { step: '02', title: 'VISION AI', detail: 'UI Bounding Boxes' },
  { step: '03', title: 'OCR', detail: 'Token Extraction' },
  { step: '04', title: 'CLASSIFIER', detail: 'Context Analysis' },
  { step: '05', title: 'RISK ENGINE', detail: 'Severity Scoring' },
  { step: '06', title: 'SHIELD PROTECTION', detail: 'Auto Blur / Blackout' },
];

export const AIDetectionPage: React.FC<AIDetectionPageProps> = ({
  models,
  onToggleModel,
  onUpdateThreshold,
}) => {
  const [benchmarkingId, setBenchmarkingId] = useState<string | null>(null);

  const handleBenchmark = (id: string) => {
    setBenchmarkingId(id);
    setTimeout(() => {
      setBenchmarkingId(null);
    }, 650);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            🧠 AI Detection Laboratory & Neural Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Holographic neural architecture connecting Vision AI, OCR, Classification, Risk Engine, and Camera Vision
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-card text-xs font-mono">
          <Cpu className="w-4 h-4 text-fuchsia-400" />
          <span className="text-slate-300">Runtime:</span>
          <span className="text-emerald-400 font-semibold">ONNX WebGPU Local</span>
        </div>
      </div>

      {/* AI Laboratory Central Hub Visualization (Section 20) */}
      <div className="relative p-6 sm:p-8 rounded-3xl glass-card border border-violet-500/30 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-fuchsia-500/15 blur-[100px] pointer-events-none"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Surrounding Nodes: Vision + OCR */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/35 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-cyan-300">🧠 VISION AI</span>
                <span className="text-emerald-400">ONLINE</span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time UI element localization for password inputs, login modals, and financial tables.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/35 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-sky-300">🔍 OCR ENGINE</span>
                <span className="text-emerald-400">ONLINE</span>
              </div>
              <p className="text-xs text-slate-400">
                Zero-egress character recognition identifying 6-digit OTPs, API secrets, and IBANs.
              </p>
            </div>
          </div>

          {/* Center Large AI Shield Hub */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center py-4">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full border border-fuchsia-400/30 animate-spin-reverse-slow" />
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-cyan-500/25 via-indigo-600/30 to-fuchsia-600/25 border-2 border-cyan-400/60 shadow-[0_0_36px_rgba(34,211,238,0.35)] flex flex-col items-center justify-center text-center p-3">
                <Shield className="w-9 h-9 text-cyan-300 mb-1" />
                <span className="font-display text-xs font-bold tracking-wider text-slate-100">
                  AI SHIELD CORE
                </span>
                <span className="font-mono text-[10px] text-emerald-400">
                  82 ms Latency
                </span>
              </div>
            </div>
          </div>

          {/* Right Surrounding Nodes: Classification + Risk Engine + Camera Vision */}
          <div className="lg:col-span-4 space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-fuchsia-500/35 space-y-1">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-fuchsia-300">🤖 CLASSIFICATION</span>
                <span className="text-emerald-400">97.1% ACC</span>
              </div>
              <p className="text-xs text-slate-400">
                Contextual semantic transformer scoring sensitive visual regions.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/35 space-y-1">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-amber-300">⚠ RISK ENGINE</span>
                <span className="text-emerald-400">ACTIVE</span>
              </div>
              <p className="text-xs text-slate-400">
                Maps detections into SAFE, LOW, MEDIUM, HIGH, and CRITICAL actions.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-indigo-500/35 space-y-1">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-indigo-300">👁 CAMERA VISION</span>
                <span className="text-amber-300">OPTIONAL</span>
              </div>
              <p className="text-xs text-slate-400">
                Shoulder-surfing multi-viewer detector (Standby until enabled).
              </p>
            </div>
          </div>
        </div>

        {/* Visual Pipeline Architecture Diagram: SCREEN -> VISION AI -> OCR -> CLASSIFIER -> RISK ENGINE -> SHIELD PROTECTION */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10">
          <div className="text-[11px] font-mono text-slate-400 mb-3 uppercase tracking-wider">
            Autonomous Neural Processing Pipeline
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {PIPELINE_STEPS.map((item, idx) => (
              <div
                key={item.step}
                className="relative p-3 rounded-xl bg-slate-950/85 border border-white/10 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
                  <span>STEP {item.step}</span>
                  {idx < PIPELINE_STEPS.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-500 hidden lg:block" />
                  )}
                </div>
                <div className="text-xs font-bold text-slate-100 mt-1">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Model Management Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {models.map((model) => {
          const isOnline = model.status === 'ONLINE';
          const isBenchmarking = benchmarkingId === model.id;
          const emoji = MODEL_EMOJIS[model.id] || '🤖';

          return (
            <div
              key={model.id}
              className="p-6 rounded-2xl glass-card flex flex-col justify-between gap-5"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-base font-bold text-slate-100">
                        {emoji} {model.name}
                      </h2>
                      <span className="font-mono text-xs text-slate-400">
                        {model.version}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300/90 mt-1 leading-relaxed">
                      {model.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleModel(model.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-semibold border transition-colors shrink-0 cursor-pointer ${
                      isOnline
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-amber-300'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{isOnline ? 'ONLINE' : 'STANDBY'}</span>
                  </button>
                </div>

                {/* Telemetry Specs Row */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-white/10 font-mono text-xs tabular-nums">
                  <div>
                    <div className="text-slate-400 text-[11px]">Inference</div>
                    <div className="text-slate-100 font-semibold mt-0.5">
                      {isBenchmarking ? '...' : `${model.inferenceTimeMs} ms`}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">
                      {model.id === 'model-ocr' ? 'Confidence' : 'Accuracy'}
                    </div>
                    <div className="text-cyan-300 font-semibold mt-0.5">
                      {model.accuracy}%
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Status</div>
                    <div
                      className={`font-semibold mt-0.5 ${
                        isOnline ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {isOnline ? 'ONLINE' : 'STANDBY'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Confidence Threshold & Benchmark Control */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Detection Threshold</span>
                    <span className="font-mono text-cyan-300 tabular-nums">
                      {model.threshold}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={98}
                    value={model.threshold}
                    onChange={(e) =>
                      onUpdateThreshold(model.id, Number(e.target.value))
                    }
                    aria-label={`Confidence threshold for ${model.name}`}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleBenchmark(model.id)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isBenchmarking ? (
                    <>
                      <Gauge className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Benchmark</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-2xl glass-card flex items-center gap-3 text-xs text-slate-300">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          ✨ AI Processing executes on an isolated thread so visual animations never slow down real-time frame inspection.
        </span>
      </div>
    </div>
  );
};
