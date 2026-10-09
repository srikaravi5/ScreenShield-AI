import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Lock,
  Shield,
  ShieldCheck,
  X,
} from 'lucide-react';

interface WelcomeModalProps {
  mode: 'onboarding' | 'login' | null;
  onClose: () => void;
  userName: string;
}

const ONBOARDING_STEPS = [
  {
    step: 1,
    emoji: '🛡',
    title: 'Welcome to ScreenShield AI',
    subtitle: 'Intelligent Visual Privacy Guardian',
    description:
      'ScreenShield AI watches your active screen locally in real time and automatically hides passwords, OTP codes, and confidential data before anyone can see or capture them.',
  },
  {
    step: 2,
    emoji: '👁',
    title: 'Enable Visual Monitoring',
    subtitle: 'Real-Time Neural Frame Inspection',
    description:
      'Our low-latency Visual AI & OCR Engine inspect display frames at up to 15 FPS with under 85ms latency—identifying sensitive UI fields with 96%+ confidence.',
  },
  {
    step: 3,
    emoji: '🔐',
    title: 'Configure Privacy Protection',
    subtitle: 'Gaussian Blur, Pixelate & Blackout Zones',
    description:
      'Choose how sensitive areas are shielded automatically—or draw persistent Privacy Zones over banking, terminal, and messaging windows.',
  },
  {
    step: 4,
    emoji: '🤖',
    title: 'Activate On-Device AI',
    subtitle: '100% Local Enclave Execution',
    description:
      'Zero screenshots or text strings ever leave your machine. All neural models run strictly on-device with zero cloud uploads.',
  },
  {
    step: 5,
    emoji: '✓',
    title: "You're Protected",
    subtitle: 'Visual Privacy Score: 94 / 100',
    description:
      'ScreenShield AI is online and actively guarding your workspace. Use Ctrl+K anytime to launch the command palette or click Protect Screen Now for emergency blackout.',
  },
];

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  mode,
  onClose,
  userName,
}) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [passphrase, setPassphrase] = useState('••••••••••••••••');

  if (!mode) return null;

  if (mode === 'login') {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#060B16]/95 backdrop-blur-2xl animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-label="ScreenShield AI Welcome and Login"
      >
        {/* Animated AI Shield Glow Behind Interface */}
        <div className="absolute w-96 h-96 rounded-full bg-cyan-500/15 blur-[130px] pointer-events-none" />

        <div className="relative w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl glass-card border border-cyan-500/30 overflow-hidden shadow-2xl">
          {/* Left Column: Brand Statement */}
          <div className="lg:col-span-6 p-8 sm:p-10 bg-gradient-to-br from-slate-900/90 via-indigo-950/50 to-slate-950 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-display text-base font-bold tracking-wider text-slate-100">
                SCREENSHIELD AI
              </span>
            </div>

            <div className="space-y-4 my-8">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400">
                <span>🤖 ON-DEVICE VISUAL GUARDIAN</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight leading-tight">
                Your screen.
                <br />
                Your privacy.
                <br />
                <span className="text-cyan-400">Always protected.</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Autonomous AI cybersecurity layer masking credentials, 2FA tokens, and private workspaces in real time.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-emerald-400">
              <span>✓ 100% On-Device AI</span>
              <span>·</span>
              <span>✓ Zero Cloud Egress</span>
            </div>
          </div>

          {/* Right Column: Glass Login Panel */}
          <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-center space-y-6 bg-slate-950/60">
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                Unlock Security Enclave
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Authenticate local operator session for {userName}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onClose();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Operator Identity
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${userName} (srikaravi5@gmail.com)`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Local Enclave Passkey
                </label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs shadow-[0_0_24px_rgba(6,182,212,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Enter ScreenShield AI</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const current = ONBOARDING_STEPS[stepIdx];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome Onboarding Tour"
    >
      <div className="w-full max-w-lg rounded-2xl glass-card border border-cyan-500/35 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-cyan-400">
            STEP {current.step} OF {ONBOARDING_STEPS.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-center py-2">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/35 flex items-center justify-center mx-auto text-2xl shadow-[0_0_24px_rgba(6,182,212,0.2)]">
            {current.emoji}
          </div>
          <div className="text-xs font-mono text-emerald-400">
            {current.subtitle}
          </div>
          <h2 className="text-2xl font-bold text-slate-100">{current.title}</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            {current.description}
          </p>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-2">
          {ONBOARDING_STEPS.map((s, idx) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setStepIdx(idx)}
              aria-label={`Go to step ${s.step}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === stepIdx ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            Skip Tour
          </button>

          {stepIdx < ONBOARDING_STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStepIdx((i) => i + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-semibold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finish & Protect</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
