import React, { useRef, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Monitor,
  PlusCircle,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react';
import {
  BoundingBox,
  DetectionItem,
  PrivacyZone,
  ProtectionConfig,
} from '../types/screenshield';

interface ScreenPreviewProps {
  detections: DetectionItem[];
  zones?: PrivacyZone[];
  protection: ProtectionConfig;
  highlightedDetectionId?: string | null;
  isScanning?: boolean;
  scanStatusText?: string | null;
  onToggleDetectionMask: (id: string) => void;
  onSimulateThreat?: () => void;
  isDrawingMode?: boolean;
  draftBox?: BoundingBox | null;
  onDraftBoxChange?: (box: BoundingBox) => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
  Password: '🔐',
  Email: '📧',
  OTP: '🎯',
  'API Key': '🔑',
  'Credit Card': '💳',
  Banking: '🏦',
};

export const ScreenPreview: React.FC<ScreenPreviewProps> = ({
  detections,
  zones = [],
  protection,
  highlightedDetectionId,
  isScanning = false,
  scanStatusText = null,
  onToggleDetectionMask,
  onSimulateThreat,
  isDrawingMode = false,
  draftBox = null,
  onDraftBoxChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenShareError, setScreenShareError] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [otpValue, setOtpValue] = useState('482 910');
  const [vaultPassword, setVaultPassword] = useState('vlt_994#AegisProd!26');

  const rotateOtp = () => {
    const part1 = Math.floor(100 + Math.random() * 900);
    const part2 = Math.floor(100 + Math.random() * 900);
    setOtpValue(`${part1} ${part2}`);
  };

  const handleToggleScreenShare = async () => {
    setScreenShareError(null);
    if (isScreenSharing) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      setIsScreenSharing(false);
      return;
    }

    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        setScreenShareError('Display capture API unavailable in this context; interactive AI vision workspace active.');
        return;
      }
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 15 },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsScreenSharing(true);
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        setIsScreenSharing(false);
      });
    } catch {
      setScreenShareError('Screen capture permission declined or restricted by sandbox; interactive workspace active.');
    }
  };

  const getRelativeCoords = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawingMode || !onDraftBoxChange) return;
    const coords = getRelativeCoords(e);
    setDragStart(coords);
    onDraftBoxChange({ x: coords.x, y: coords.y, width: 1, height: 1 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawingMode || !dragStart || !onDraftBoxChange) return;
    const current = getRelativeCoords(e);
    const x = Math.min(dragStart.x, current.x);
    const y = Math.min(dragStart.y, current.y);
    const width = Math.max(6, Math.abs(current.x - dragStart.x));
    const height = Math.max(6, Math.abs(current.y - dragStart.y));
    onDraftBoxChange({ x, y, width, height });
  };

  const handleMouseUp = () => {
    if (dragStart) {
      setDragStart(null);
    }
  };

  const getBoxBorderStyle = (det: DetectionItem) => {
    if (det.isProtected || protection.safeModeActive) {
      return {
        border: 'border-emerald-400/80 shadow-[0_0_16px_rgba(16,185,129,0.2)]',
        tagBg: 'bg-emerald-950/95 text-emerald-300 border-emerald-400/50',
      };
    }
    if (det.risk === 'CRITICAL' || det.risk === 'HIGH') {
      return {
        border: 'border-rose-500/90 shadow-[0_0_20px_rgba(244,63,94,0.3)]',
        tagBg: 'bg-rose-950/95 text-rose-200 border-rose-500/60',
      };
    }
    return {
      border: 'border-amber-400/85 shadow-[0_0_16px_rgba(245,158,11,0.2)]',
      tagBg: 'bg-amber-950/95 text-amber-200 border-amber-500/60',
    };
  };

  const getMaskStyle = (): React.CSSProperties => {
    if (protection.mode === 'Blur' || protection.mode === 'Safe Mode') {
      const px = Math.max(4, Math.round((protection.blurIntensity / 100) * 18));
      return {
        backdropFilter: `blur(${px}px)`,
        WebkitBackdropFilter: `blur(${px}px)`,
        backgroundColor: 'rgba(9, 13, 22, 0.45)',
      };
    }
    if (protection.mode === 'Blackout') {
      return {
        backgroundColor: '#040711',
      };
    }
    return {};
  };

  return (
    <div className="rounded-2xl glass-card overflow-hidden flex flex-col">
      {/* Monitor Header Bar */}
      <div className="px-4 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <Monitor className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold tracking-wider text-slate-100">
            👁 LIVE SCREEN
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono text-xs text-cyan-300 tabular-nums">
            AI Vision Active · {protection.mode} ({protection.blurIntensity}%)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onSimulateThreat && (
            <button
              type="button"
              onClick={onSimulateThreat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-400/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Exposure</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleScreenShare}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isScreenSharing
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isScreenSharing ? 'Stop Capture' : 'Connect Real Screen'}</span>
          </button>
        </div>
      </div>

      {screenShareError && (
        <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs text-amber-300 flex items-center justify-between">
          <span>{screenShareError}</span>
          <button
            type="button"
            onClick={() => setScreenShareError(null)}
            className="text-slate-400 hover:text-slate-200 ml-3 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main 16:9 AI Vision Screen Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`relative w-full aspect-[16/9] min-h-[340px] bg-[#060A14] overflow-hidden select-none ${
          isDrawingMode ? 'cursor-crosshair' : ''
        }`}
      >
        {/* AI Scanning Animation Overlay (Section 12) */}
        {(isScanning || scanStatusText) && (
          <div className="absolute inset-0 z-30 pointer-events-none">
            {isScanning && (
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_24px_#22d3ee] animate-scan-line" />
            )}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-950/90 border border-cyan-400/50 shadow-[0_0_24px_rgba(6,182,212,0.35)] flex items-center gap-2 text-xs font-mono font-semibold text-cyan-300 animate-fadeIn">
              {isScanning ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>{scanStatusText || '🧠 AI ANALYZING SCREEN...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">{scanStatusText}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Subtle technical grid background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(rgba(56, 189, 248, 0.25) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        {/* Video element when real screen share is active */}
        <video
          ref={videoRef}
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover ${
            isScreenSharing ? 'block' : 'hidden'
          }`}
        />

        {/* Interactive Simulated Desktop Workspace */}
        {!isScreenSharing && (
          <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between pointer-events-auto">
            {/* Simulated OS Top Menu Bar */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <span className="text-slate-200 font-semibold">Workspace OS</span>
                <span>Chrome</span>
                <span>VS Code</span>
                <span>Excel</span>
              </div>
              <div className="flex items-center gap-3 tabular-nums">
                <span className="text-cyan-400">✨ AI Vision Hook: Online</span>
                <span>2560×1440</span>
              </div>
            </div>

            {/* Simulated Desktop Windows matching Detection Bounding Boxes */}
            <div className="relative flex-1 mt-3">
              {/* Window 1: Chrome — Enterprise IAM Console (Top Left) */}
              <div
                style={{ left: '4%', top: '6%', width: '44%', height: '40%' }}
                className="absolute rounded-xl bg-slate-900/95 border border-slate-800 p-3.5 flex flex-col justify-between shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-semibold text-slate-200">
                    Chrome — Enterprise IAM Login
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    auth.aegis.internal
                  </span>
                </div>
                <div className="space-y-1.5 my-auto">
                  <label className="block text-[10px] font-mono text-slate-400">
                    Master Vault Password
                  </label>
                  <input
                    type="text"
                    value={vaultPassword}
                    onChange={(e) => setVaultPassword(e.target.value)}
                    aria-label="Simulated master vault password"
                    className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono text-xs text-amber-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>Operator: Sri Karthika</span>
                  <span>TLS 1.3</span>
                </div>
              </div>

              {/* Window 2: Hardware 2FA Authenticator (Top Right) */}
              <div
                style={{ left: '51%', top: '4%', width: '44%', height: '42%' }}
                className="absolute rounded-xl bg-slate-900/95 border border-slate-800 p-3.5 flex flex-col justify-between shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-semibold text-slate-200">
                    Browser — 2FA Verification
                  </span>
                  <button
                    type="button"
                    onClick={rotateOtp}
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Rotate</span>
                  </button>
                </div>
                <div className="my-auto py-1">
                  <div className="text-[10px] text-slate-400 font-mono">
                    ONE-TIME PASSCODE (OTP)
                  </div>
                  <div className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-cyan-300 tabular-nums mt-0.5">
                    {otpValue}
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Expires in 18s · srikaravi5@gmail.com
                </div>
              </div>

              {/* Window 3: Executive Email Client (Bottom Left) */}
              <div
                style={{ left: '4%', top: '51%', width: '45%', height: '44%' }}
                className="absolute rounded-xl bg-slate-900/95 border border-slate-800 p-3.5 flex flex-col justify-between shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-xs font-semibold text-slate-200">
                    Mercury Mail — Executive Inbox
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    cfo@aegis-sec.io
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-300 my-auto">
                  <div className="font-medium text-slate-200">
                    Subject: Q4 Treasury Settlement & Wire Routing
                  </div>
                  <p className="text-slate-400 line-clamp-2 leading-relaxed">
                    Confirm routing #021000021 and executive recipient srikaravi5@gmail.com before 16:00 UTC.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Classification: Confidential PII
                </div>
              </div>

              {/* Window 4: VS Code Terminal (Bottom Right) */}
              <div
                style={{ left: '51%', top: '50%', width: '44%', height: '45%' }}
                className="absolute rounded-xl bg-slate-950 border border-slate-800 p-3.5 flex flex-col justify-between shadow-lg font-mono"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>VS Code — .env.production</span>
                  </span>
                  <span className="text-[10px] text-slate-500">UTF-8</span>
                </div>
                <div className="text-[11px] space-y-1 text-slate-300 my-auto overflow-hidden">
                  <div className="text-slate-500"># Production API Secrets</div>
                  <div className="text-rose-300 truncate">
                    STRIPE_LIVE_KEY=sk_live_51Nx98A7f6D5c4B3a210
                  </div>
                  <div className="text-emerald-300 truncate">
                    DB_ADMIN_URI=postgres://root:9xK2pL@10.0.4.12
                  </div>
                </div>
                <div className="text-[10px] text-slate-500">
                  Active Workspace Shield
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Privacy Zones Overlay */}
        {zones
          .filter((z) => z.active && z.policy !== 'Ignore')
          .map((zone) => (
            <div
              key={zone.id}
              style={{
                left: `${zone.box.x}%`,
                top: `${zone.box.y}%`,
                width: `${zone.box.width}%`,
                height: `${zone.box.height}%`,
                ...(zone.policy === 'Always Blur'
                  ? {
                      backdropFilter: 'blur(14px)',
                      WebkitBackdropFilter: 'blur(14px)',
                      backgroundColor: 'rgba(15, 23, 42, 0.45)',
                    }
                  : zone.policy === 'Always Blackout'
                  ? { backgroundColor: '#020617' }
                  : {}),
              }}
              className="absolute rounded-lg border border-dashed border-cyan-400/60 pointer-events-none z-10 flex items-end justify-end p-1.5"
            >
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-950/90 text-cyan-300 border border-cyan-500/30">
                Zone: {zone.name} ({zone.policy.replace('Always ', '')})
              </span>
            </div>
          ))}

        {/* AI Detected Sensitive Regions Bounding Boxes */}
        {detections.map((det) => {
          const styleMeta = getBoxBorderStyle(det);
          const isMasked = det.isProtected || protection.safeModeActive;
          const isHighlighted = highlightedDetectionId === det.id;
          const emoji = CATEGORY_EMOJI[det.category] || '🛡';

          return (
            <div
              key={det.id}
              style={{
                left: `${det.box.x}%`,
                top: `${det.box.y}%`,
                width: `${det.box.width}%`,
                height: `${det.box.height}%`,
                ...(isMasked ? getMaskStyle() : {}),
              }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleDetectionMask(det.id);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggleDetectionMask(det.id);
                }
              }}
              aria-label={`${det.category} detection (${det.confidence}% confidence). Click to ${
                isMasked ? 'unmask' : 'mask'
              }.`}
              className={`group absolute rounded-xl border-2 transition-all duration-200 z-20 cursor-pointer ${
                styleMeta.border
              } ${
                isHighlighted ? 'ring-2 ring-cyan-400 scale-[1.01]' : ''
              } ${
                isMasked && protection.mode === 'Pixelate'
                  ? 'pattern-pixelate'
                  : ''
              } ${
                isMasked && protection.mode === 'Warning Overlay'
                  ? 'pattern-stripes'
                  : ''
              }`}
            >
              {/* Top-left floating AI Vision detection badge */}
              <div
                className={`absolute -top-6 left-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border shadow-md whitespace-nowrap ${styleMeta.tagBg}`}
              >
                <span>{emoji}</span>
                <span className="uppercase">{det.category}</span>
                <span>{det.confidence}%</span>
                <span className="text-[9px] opacity-80">· AI DETECTED</span>
              </div>

              {/* Center status indicator when masked */}
              {isMasked && (
                <div className="w-full h-full flex items-center justify-center p-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-white/10 text-[11px] font-mono text-slate-200 shadow-lg">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>{protection.mode} Protected</span>
                    <span className="text-slate-500 hidden sm:inline">· Click to toggle</span>
                  </div>
                </div>
              )}

              {/* Hover affordance when unmasked */}
              {!isMasked && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity w-full h-full flex items-center justify-center bg-slate-950/50">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 text-[11px] font-mono text-slate-100 border border-cyan-500/40">
                    <EyeOff className="w-3 h-3 text-cyan-400" />
                    <span>Click to Shield</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Interactive Draft Zone Box while drawing on Privacy Zones page */}
        {isDrawingMode && draftBox && (
          <div
            style={{
              left: `${draftBox.x}%`,
              top: `${draftBox.y}%`,
              width: `${draftBox.width}%`,
              height: `${draftBox.height}%`,
            }}
            className="absolute rounded-xl border-2 border-cyan-400 bg-cyan-500/15 z-30 pointer-events-none flex items-center justify-center"
          >
            <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-slate-950/90 text-cyan-300 border border-cyan-500/40">
              Create Privacy Zone ({Math.round(draftBox.width)}×{Math.round(draftBox.height)}%)
            </span>
          </div>
        )}
      </div>

      {/* Bottom Legend & Quick Interaction Bar */}
      <div className="px-4 py-2.5 bg-slate-950/75 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Protected</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Warning</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Critical Threat</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click any AI bounding box to toggle protection</span>
        </div>
      </div>
    </div>
  );
};
