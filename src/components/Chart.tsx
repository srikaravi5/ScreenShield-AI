import React, { useState } from 'react';
import { AnalyticsTimeframeData } from '../types/screenshield';

interface RiskOverTimeChartProps {
  data: AnalyticsTimeframeData['riskOverTime'];
}

export const RiskOverTimeChart: React.FC<RiskOverTimeChartProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const width = 520;
  const height = 185;
  const padX = 34;
  const padY = 22;
  const maxRisk = Math.max(40, ...data.map((d) => d.risk));

  const points = data.map((d, i) => {
    const x =
      padX + (i / Math.max(1, data.length - 1)) * (width - padX * 2);
    const y =
      height - padY - (d.risk / maxRisk) * (height - padY * 2);
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${
    height - padY
  } L ${points[0].x.toFixed(1)} ${height - padY} Z`;

  return (
    <div className="relative w-full">
      {/* Glass Tooltip on Hover (Section 16) */}
      {hoveredIdx !== null && points[hoveredIdx] && (
        <div
          style={{
            left: `${(points[hoveredIdx].x / width) * 100}%`,
            top: '0px',
          }}
          className="absolute -translate-x-1/2 z-20 px-3 py-1.5 rounded-xl glass-card border border-cyan-400/40 text-xs font-mono pointer-events-none whitespace-nowrap animate-fadeIn"
        >
          <span className="text-cyan-300 font-bold">
            {points[hoveredIdx].label}
          </span>
          <span className="text-slate-400 mx-1.5">·</span>
          <span className="text-slate-100">
            Risk: {points[hoveredIdx].risk}%
          </span>
          <span className="text-slate-400 mx-1.5">·</span>
          <span className="text-emerald-400">
            {points[hoveredIdx].scans} scans
          </span>
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-44 overflow-visible"
        role="img"
        aria-label="Privacy risk trend chart"
      >
        <defs>
          <linearGradient id="riskAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.0" />
          </linearGradient>
          <filter id="glowPoint" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[0, 0.5, 1].map((t, idx) => {
          const y = padY + t * (height - padY * 2);
          const val = Math.round(maxRisk * (1 - t));
          return (
            <g key={idx}>
              <line
                x1={padX}
                y1={y}
                x2={width - padX}
                y2={y}
                stroke="rgba(51, 65, 85, 0.5)"
                strokeDasharray="3 3"
              />
              <text
                x={4}
                y={y + 4}
                className="fill-slate-500 font-mono text-[10px]"
              >
                {val}%
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="url(#riskAreaGrad)" />
        <path
          d={linePath}
          fill="none"
          stroke="#22D3EE"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, idx) => (
          <g
            key={idx}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="cursor-pointer"
          >
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIdx === idx ? '6' : '4.5'}
              filter="url(#glowPoint)"
              className="fill-slate-950 stroke-cyan-300 transition-all"
              strokeWidth="2.5"
            />
            <text
              x={p.x}
              y={height - 2}
              textAnchor="middle"
              className="fill-slate-400 font-mono text-[10px]"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

interface CategoryBarChartProps {
  data: AnalyticsTimeframeData['byCategory'];
}

export const CategoryBarChart: React.FC<CategoryBarChartProps> = ({ data }) => {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.category} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-200 font-medium">{item.category}</span>
            <span className="font-mono text-slate-400 tabular-nums">
              {item.count} detections · {item.percentage}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all duration-500"
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

interface ProtectionActionsChartProps {
  data: AnalyticsTimeframeData['protectionActions'];
}

export const ProtectionActionsChart: React.FC<ProtectionActionsChartProps> = ({
  data,
}) => {
  const colors = ['bg-emerald-400', 'bg-cyan-400', 'bg-amber-400', 'bg-indigo-400'];

  return (
    <div className="space-y-4">
      <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden flex gap-0.5">
        {data.map((d, idx) => (
          <div
            key={d.action}
            className={`${colors[idx % colors.length]} h-full transition-all duration-500`}
            style={{ width: `${d.share}%` }}
            title={`${d.action}: ${d.share}%`}
          />
        ))}
      </div>

      <div className="divide-y divide-slate-800/70">
        {data.map((d, idx) => (
          <div
            key={d.action}
            className="py-2.5 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2.5 h-2.5 rounded-xs ${colors[idx % colors.length]}`}
              />
              <span className="text-slate-200 font-medium">{d.action}</span>
            </div>
            <div className="font-mono text-slate-400 tabular-nums">
              <strong className="text-slate-100">{d.count}</strong> ({d.share}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface DailyThreatChartProps {
  data: AnalyticsTimeframeData['dailyThreatDistribution'];
}

export const DailyThreatChart: React.FC<DailyThreatChartProps> = ({ data }) => {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const maxTotal = Math.max(
    10,
    ...data.map((d) => d.critical + d.high + d.medium)
  );

  return (
    <div className="space-y-3">
      <div className="h-40 flex items-end justify-between gap-3 pt-4 px-2">
        {data.map((d) => {
          const total = d.critical + d.high + d.medium;
          const heightPct = Math.max(12, Math.round((total / maxTotal) * 100));
          const isHovered = hoveredLabel === d.label;

          return (
            <div
              key={d.label}
              onMouseEnter={() => setHoveredLabel(d.label)}
              onMouseLeave={() => setHoveredLabel(null)}
              className="relative flex-1 flex flex-col items-center gap-2 h-full justify-end cursor-pointer"
            >
              {isHovered && (
                <div className="absolute -top-8 px-2.5 py-1 rounded-lg glass-card border border-cyan-400/40 font-mono text-[10px] text-slate-100 whitespace-nowrap z-20">
                  {d.label}: {d.critical}C · {d.high}H · {d.medium}M
                </div>
              )}
              <div
                className="w-full max-w-[38px] rounded-t-lg bg-slate-900/90 overflow-hidden flex flex-col justify-end transition-all duration-300 border border-white/5"
                style={{ height: `${heightPct}%` }}
              >
                <div
                  style={{ height: `${(d.critical / total) * 100}%` }}
                  className="bg-rose-500 w-full"
                />
                <div
                  style={{ height: `${(d.high / total) * 100}%` }}
                  className="bg-orange-400 w-full"
                />
                <div
                  style={{ height: `${(d.medium / total) * 100}%` }}
                  className="bg-amber-400 w-full"
                />
              </div>
              <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
          <span>Critical</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-orange-400" />
          <span>High</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-xs bg-amber-400" />
          <span>Medium</span>
        </span>
      </div>
    </div>
  );
};
