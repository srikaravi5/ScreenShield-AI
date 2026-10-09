import React, { useState } from 'react';
import { Crosshair, Plus } from 'lucide-react';
import {
  BoundingBox,
  PrivacyZone,
  ScreenShieldState,
  ZonePolicy,
} from '../types/screenshield';
import { ScreenPreview } from '../components/ScreenPreview';
import { PrivacyZoneCard } from '../components/PrivacyZoneCard';

interface PrivacyZonesPageProps {
  state: ScreenShieldState;
  onCreateZone: (zone: Omit<PrivacyZone, 'id' | 'createdAt'>) => void;
  onUpdateZonePolicy: (id: string, policy: ZonePolicy) => void;
  onToggleZoneActive: (id: string) => void;
  onDeleteZone: (id: string) => void;
  onToggleDetectionMask: (id: string) => void;
}

const POLICIES: ZonePolicy[] = [
  'Always Blur',
  'Always Blackout',
  'Always Monitor',
  'Ignore',
];

export const PrivacyZonesPage: React.FC<PrivacyZonesPageProps> = ({
  state,
  onCreateZone,
  onUpdateZonePolicy,
  onToggleZoneActive,
  onDeleteZone,
  onToggleDetectionMask,
}) => {
  const [zoneName, setZoneName] = useState('');
  const [policy, setPolicy] = useState<ZonePolicy>('Always Blur');
  const [draftBox, setDraftBox] = useState<BoundingBox>({
    x: 16,
    y: 22,
    width: 32,
    height: 26,
  });

  const handleSaveZone = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = zoneName.trim() || `Custom Zone ${state.zones.length + 1}`;
    onCreateZone({
      name: trimmed,
      policy,
      active: true,
      box: draftBox,
    });
    setZoneName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Custom Privacy Zones
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Draw persistent rectangular regions over your screen to enforce automatic masking policies
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Crosshair className="w-4 h-4" />
          <span>Drag cursor across screen preview to define zone</span>
        </div>
      </div>

      {/* Main Split: Interactive Drawing Canvas + Create Zone Form */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8">
          <ScreenPreview
            detections={state.detections}
            zones={state.zones}
            protection={state.protection}
            onToggleDetectionMask={onToggleDetectionMask}
            isDrawingMode={true}
            draftBox={draftBox}
            onDraftBoxChange={setDraftBox}
          />
        </div>

        {/* Right: Create Privacy Zone Panel */}
        <form
          onSubmit={handleSaveZone}
          className="xl:col-span-4 p-5 sm:p-6 rounded-xl bg-slate-900/70 border border-slate-800/90 space-y-5"
        >
          <div className="border-b border-slate-800/80 pb-3.5">
            <h2 className="text-base font-semibold text-slate-100">
              Create Privacy Zone
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click and drag on the monitor or fine-tune coordinates below
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="zone-name-input"
                className="block text-xs font-medium text-slate-300 mb-1.5"
              >
                Zone Name
              </label>
              <input
                id="zone-name-input"
                type="text"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                placeholder="e.g., Banking Area, Password Area, Slack Direct"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-300 mb-1.5">
                Protection Policy
              </span>
              <div className="grid grid-cols-2 gap-2">
                {POLICIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPolicy(p)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-colors cursor-pointer ${
                      policy === p
                        ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Coordinate Readout */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Selected Rectangle</span>
                <span className="font-mono text-cyan-400 tabular-nums">
                  X:{Math.round(draftBox.x)}% Y:{Math.round(draftBox.y)}% ·{' '}
                  {Math.round(draftBox.width)}×{Math.round(draftBox.height)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="text-[11px] text-slate-400 font-mono">
                  Width ({Math.round(draftBox.width)}%)
                  <input
                    type="range"
                    min={10}
                    max={80}
                    value={Math.round(draftBox.width)}
                    onChange={(e) =>
                      setDraftBox({ ...draftBox, width: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-400 mt-1"
                  />
                </label>
                <label className="text-[11px] text-slate-400 font-mono">
                  Height ({Math.round(draftBox.height)}%)
                  <input
                    type="range"
                    min={10}
                    max={80}
                    value={Math.round(draftBox.height)}
                    onChange={(e) =>
                      setDraftBox({
                        ...draftBox,
                        height: Number(e.target.value),
                      })
                    }
                    className="w-full accent-cyan-400 mt-1"
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Save Privacy Zone</span>
          </button>
        </form>
      </div>

      {/* Saved Privacy Zones Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-100">
            Saved Privacy Zones ({state.zones.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            {state.zones.filter((z) => z.active).length} active on screen
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.zones.map((zone) => (
            <PrivacyZoneCard
              key={zone.id}
              zone={zone}
              onUpdatePolicy={onUpdateZonePolicy}
              onToggleActive={onToggleZoneActive}
              onDelete={onDeleteZone}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
