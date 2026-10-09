import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Scan,
  ShieldCheck,
} from 'lucide-react';
import { AnalyticsRange, ScreenShieldState } from '../types/screenshield';
import { AnalyticsCard } from '../components/AnalyticsCard';
import {
  CategoryBarChart,
  DailyThreatChart,
  ProtectionActionsChart,
  RiskOverTimeChart,
} from '../components/Chart';

interface AnalyticsPageProps {
  analytics: ScreenShieldState['analytics'];
}

const RANGES: AnalyticsRange[] = ['Today', '7 Days', '30 Days'];

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ analytics }) => {
  const [range, setRange] = useState<AnalyticsRange>('Today');
  const current = analytics[range];

  return (
    <div className="space-y-6">
      {/* Page Header & Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Privacy & Threat Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Quantitative telemetry across on-device scans, sensitive categories, and automated shields
          </p>
        </div>

        {/* Interactive Time Filter Controls */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                range === r
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          label="Total Scans"
          value={current.totalScans.toLocaleString()}
          delta={range}
          icon={<Scan className="w-4 h-4" />}
          accent="cyan"
        />
        <AnalyticsCard
          label="Privacy Threats"
          value={current.privacyThreats.toLocaleString()}
          delta="Auto-mitigated"
          icon={<AlertTriangle className="w-4 h-4" />}
          accent="rose"
        />
        <AnalyticsCard
          label="Protected Regions"
          value={current.protectedRegions.toLocaleString()}
          delta="100% coverage"
          icon={<ShieldCheck className="w-4 h-4" />}
          accent="emerald"
        />
        <AnalyticsCard
          label="Average Risk"
          value={`${current.averageRisk}%`}
          delta="SAFE baseline"
          icon={<Activity className="w-4 h-4" />}
          accent="amber"
        />
      </div>

      {/* 2x2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 sm:p-6 rounded-2xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                📊 Privacy Risk Trend
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Screen exposure risk index ({range}) — hover points for glass telemetry
              </p>
            </div>
            <span className="font-mono text-xs text-cyan-400 tabular-nums">
              Avg {current.averageRisk}%
            </span>
          </div>
          <RiskOverTimeChart data={current.riskOverTime} />
        </div>

        <div className="p-5 sm:p-6 rounded-2xl glass-card space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              🎯 Sensitive Data Categories
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Distribution of detected credentials, tokens, and PII
            </p>
          </div>
          <CategoryBarChart data={current.byCategory} />
        </div>

        <div className="p-5 sm:p-6 rounded-2xl glass-card space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              ⚡ Protection Activity
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown of automated visual redaction methods applied
            </p>
          </div>
          <ProtectionActionsChart data={current.protectionActions} />
        </div>

        <div className="p-5 sm:p-6 rounded-2xl glass-card space-y-4">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              🚨 Threat Detection
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Detected threats segmented by severity tier
            </p>
          </div>
          <DailyThreatChart data={current.dailyThreatDistribution} />
        </div>
      </div>
    </div>
  );
};
