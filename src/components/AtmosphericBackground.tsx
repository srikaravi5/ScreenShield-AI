import React from 'react';
import { NavigationTab } from '../types/screenshield';

interface AtmosphericBackgroundProps {
  activeTab: NavigationTab;
}

const PAGE_THEMES: Record<
  NavigationTab,
  {
    baseBg: string;
    orbPrimary: string;
    orbSecondary: string;
    gridOpacity: string;
    showNeuralLines?: boolean;
    showScanLines?: boolean;
  }
> = {
  dashboard: {
    // Midnight Blue + Cyan
    baseBg: 'from-[#0A1226] via-[#0B152B] to-[#070C18]',
    orbPrimary: 'bg-cyan-500/12',
    orbSecondary: 'bg-blue-600/12',
    gridOpacity: 'opacity-20',
    showNeuralLines: true,
  },
  'live-monitor': {
    // Deep Indigo + Electric Blue
    baseBg: 'from-[#0B102C] via-[#0E1738] to-[#070B1A]',
    orbPrimary: 'bg-indigo-500/14',
    orbSecondary: 'bg-sky-500/12',
    gridOpacity: 'opacity-25',
    showScanLines: true,
  },
  'privacy-events': {
    // Dark Purple + Violet
    baseBg: 'from-[#140D2A] via-[#191132] to-[#090714]',
    orbPrimary: 'bg-purple-500/12',
    orbSecondary: 'bg-violet-500/10',
    gridOpacity: 'opacity-15',
  },
  analytics: {
    // Dark Teal + Blue
    baseBg: 'from-[#071A26] via-[#0A2130] to-[#071019]',
    orbPrimary: 'bg-teal-500/12',
    orbSecondary: 'bg-cyan-500/12',
    gridOpacity: 'opacity-30',
  },
  'privacy-zones': {
    // Dark Emerald + Cyan
    baseBg: 'from-[#071D21] via-[#0B2429] to-[#071117]',
    orbPrimary: 'bg-emerald-500/12',
    orbSecondary: 'bg-cyan-500/10',
    gridOpacity: 'opacity-25',
  },
  'ai-detection': {
    // Dark Violet + Pink/Purple
    baseBg: 'from-[#170E2C] via-[#1E1236] to-[#0B0818]',
    orbPrimary: 'bg-fuchsia-500/12',
    orbSecondary: 'bg-violet-600/14',
    gridOpacity: 'opacity-20',
    showNeuralLines: true,
  },
  'camera-vision': {
    // Deep Indigo + Cyan Optical Vision
    baseBg: 'from-[#09152B] via-[#0D1E3A] to-[#070D1B]',
    orbPrimary: 'bg-cyan-500/14',
    orbSecondary: 'bg-indigo-500/14',
    gridOpacity: 'opacity-25',
    showScanLines: true,
  },
  protection: {
    // Deep Blue + Soft Green
    baseBg: 'from-[#081928] via-[#0C212F] to-[#07111B]',
    orbPrimary: 'bg-emerald-500/12',
    orbSecondary: 'bg-blue-500/12',
    gridOpacity: 'opacity-20',
  },
  settings: {
    // Charcoal + Indigo
    baseBg: 'from-[#0D111C] via-[#111625] to-[#090C14]',
    orbPrimary: 'bg-indigo-500/8',
    orbSecondary: 'bg-slate-500/8',
    gridOpacity: 'opacity-10',
  },
  'privacy-center': {
    // Deep Navy + Silver/Cyan
    baseBg: 'from-[#0A1424] via-[#0F1C30] to-[#080E1A]',
    orbPrimary: 'bg-cyan-400/10',
    orbSecondary: 'bg-slate-400/8',
    gridOpacity: 'opacity-20',
    showNeuralLines: true,
  },
};

export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({
  activeTab,
}) => {
  const theme = PAGE_THEMES[activeTab] || PAGE_THEMES.dashboard;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 bg-gradient-to-br ${theme.baseBg} transition-colors duration-700 overflow-hidden`}
    >
      {/* Soft Glowing Atmospheric Orbs */}
      <div
        className={`absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full blur-[130px] transition-all duration-700 animate-float-slow ${theme.orbPrimary}`}
      />
      <div
        className={`absolute top-1/3 -right-32 w-[480px] h-[480px] rounded-full blur-[140px] transition-all duration-700 ${theme.orbSecondary}`}
      />

      {/* Digital Grid Pattern */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${theme.gridOpacity}`}
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(148, 163, 184, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.07) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Subtle Neural Network & Circuit SVG Pattern */}
      {theme.showNeuralLines && (
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.11]"
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M120 140 L340 220 L580 160 L860 280 L1180 190 L1340 310"
            stroke="url(#neuralGrad)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />
          <path
            d="M220 680 L480 560 L760 640 L1060 510 L1310 620"
            stroke="url(#neuralGrad)"
            strokeWidth="1.2"
          />
          <circle cx="340" cy="220" r="3.5" fill="#38BDF8" />
          <circle cx="580" cy="160" r="3" fill="#818CF8" />
          <circle cx="860" cy="280" r="4" fill="#22D3EE" />
          <circle cx="1180" cy="190" r="3" fill="#38BDF8" />
          <circle cx="480" cy="560" r="3.5" fill="#22D3EE" />
          <circle cx="1060" cy="510" r="3.5" fill="#818CF8" />
          <defs>
            <linearGradient id="neuralGrad" x1="0" y1="0" x2="1440" y2="900" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* Subtle horizontal scanlines for Live Monitor */}
      {theme.showScanLines && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(56, 189, 248, 0.12) 4px)',
          }}
        />
      )}
    </div>
  );
};
