/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  AppSettings,
  CameraState,
  DetectionItem,
  NavigationTab,
  PrivacyZone,
  ProtectionConfig,
  ScreenShieldState,
  ToastNotification,
  ZonePolicy,
} from './types/screenshield';
import { INITIAL_SCREENSHIELD_STATE } from './services/initialData';
import { ScreenShieldApi, saveLocalState } from './services/api';
import { AtmosphericBackground } from './components/AtmosphericBackground';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ToastContainer } from './components/Toast';
import { ProtectionOverlay } from './components/ProtectionOverlay';
import { Modal } from './components/Modal';
import { CommandPalette } from './components/CommandPalette';
import { AIAssistantPanel } from './components/AIAssistantPanel';
import { WelcomeModal } from './components/WelcomeModal';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitorPage } from './pages/LiveMonitorPage';
import { PrivacyEventsPage } from './pages/PrivacyEventsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PrivacyZonesPage } from './pages/PrivacyZonesPage';
import { ProtectionPage } from './pages/ProtectionPage';
import { AIDetectionPage } from './pages/AIDetectionPage';
import { PrivacyCenterPage } from './pages/PrivacyCenterPage';
import { SettingsPage } from './pages/SettingsPage';

function computePrivacyScore(state: ScreenShieldState): {
  score: number;
  threatLevel: ScreenShieldState['threatLevel'];
} {
  if (state.protection.safeModeActive || state.protection.emergencyProtected) {
    return { score: 100, threatLevel: 'SAFE' };
  }

  const unprotectedCritOrHigh = state.detections.filter(
    (d) => !d.isProtected && (d.risk === 'CRITICAL' || d.risk === 'HIGH')
  ).length;
  const unprotectedMed = state.detections.filter(
    (d) => !d.isProtected && d.risk === 'MEDIUM'
  ).length;

  let score = 94 - unprotectedCritOrHigh * 18 - unprotectedMed * 4;
  if (state.camera.enabled && state.camera.detectedViewers > 1) {
    score -= 15;
  }
  if (!state.protection.automaticProtection) {
    score -= 8;
  }

  const clamped = Math.max(24, Math.min(100, score));
  const threatLevel =
    clamped >= 88
      ? 'SAFE'
      : clamped >= 70
      ? 'MEDIUM'
      : clamped >= 40
      ? 'HIGH'
      : 'CRITICAL';

  return { score: clamped, threatLevel };
}

const SIMULATED_THREATS: Omit<DetectionItem, 'id' | 'timestamp' | 'relativeTime'>[] = [
  {
    category: 'OTP',
    label: 'Authenticator 6-Digit Code Exposed',
    confidence: 95,
    risk: 'HIGH',
    box: { x: 53, y: 16, width: 40, height: 24 },
    isProtected: true,
    actionTaken: 'Automatically Protected',
    sourceApp: 'Browser — Hardware Token Auth',
  },
  {
    category: 'Password',
    label: 'Password field detected on screen.',
    confidence: 96,
    risk: 'CRITICAL',
    box: { x: 6, y: 18, width: 41, height: 22 },
    isProtected: true,
    actionTaken: 'Automatically Protected',
    sourceApp: 'Chrome — Enterprise IAM Login',
  },
  {
    category: 'Credit Card',
    label: 'Corporate Treasury Card CVV & PAN',
    confidence: 94,
    risk: 'CRITICAL',
    box: { x: 53, y: 52, width: 40, height: 35 },
    isProtected: false,
    actionTaken: 'Awaiting Manual Shield',
    sourceApp: 'Chrome — Billing Settlement Portal',
  },
];

export default function App() {
  const [state, setState] = useState<ScreenShieldState>(INITIAL_SCREENSHIELD_STATE);
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(4);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [welcomeMode, setWelcomeMode] = useState<'onboarding' | 'login' | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatusText, setScanStatusText] = useState<string | null>(null);
  const [simIndex, setSimIndex] = useState(0);

  const pushToast = useCallback(
    (
      type: ToastNotification['type'],
      title: string,
      detail?: string
    ) => {
      if (!state.settings.desktopAlerts) return;
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const timestamp = new Date().toTimeString().slice(0, 8);
      setToasts((prev) => [{ id, type, title, detail, timestamp }, ...prev.slice(0, 3)]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    [state.settings.desktopAlerts]
  );

  // Initial fetch from backend API + brief AI initialization status
  useEffect(() => {
    setScanStatusText('🤖 AI INITIALIZING...');
    const t1 = setTimeout(() => setScanStatusText('🧠 ANALYZING SCREEN...'), 450);
    const t2 = setTimeout(() => setScanStatusText('✓ PROTECTION ACTIVE'), 950);
    const t3 = setTimeout(() => setScanStatusText(null), 2000);

    ScreenShieldApi.fetchState().then((loaded) => {
      setState(loaded);
    });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Global keyboard shortcuts: Ctrl+K / Cmd+K for Command Palette, Escape for modals/emergency
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((open) => !open);
        return;
      }
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
        } else if (welcomeMode) {
          setWelcomeMode(null);
        } else if (state.protection.emergencyProtected) {
          setState((prev) => ({
            ...prev,
            protection: { ...prev.protection, emergencyProtected: false },
          }));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, welcomeMode, state.protection.emergencyProtected]);

  // Subtle live telemetry heartbeat (CPU, Inference ms, Last Scan counter)
  useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => {
        const cpuDelta = Math.floor(Math.random() * 5) - 2;
        const infDelta = Math.floor(Math.random() * 7) - 3;
        const nextCpu = Math.max(14, Math.min(28, prev.telemetry.cpuPercent + cpuDelta));
        const nextInf = Math.max(74, Math.min(92, prev.telemetry.inferenceMs + infDelta));
        const nextScanSec =
          prev.telemetry.lastScanSecondsAgo >= 8
            ? 1
            : prev.telemetry.lastScanSecondsAgo + 1;

        return {
          ...prev,
          telemetry: {
            ...prev.telemetry,
            cpuPercent: nextCpu,
            inferenceMs: nextInf,
            lastScanSecondsAgo: nextScanSec,
          },
        };
      });
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const applyAndSave = (updater: (prev: ScreenShieldState) => ScreenShieldState) => {
    setState((prev) => {
      const updated = updater(prev);
      const { score, threatLevel } = computePrivacyScore(updated);
      const finalState: ScreenShieldState = {
        ...updated,
        privacyScore: score,
        threatLevel,
      };
      saveLocalState(finalState);
      return finalState;
    });
  };

  const handleToggleDetectionMask = (id: string) => {
    let targetCategory = 'Region';
    let nextProtected = true;

    applyAndSave((prev) => {
      const detections = prev.detections.map((d) => {
        if (d.id === id) {
          targetCategory = d.category;
          nextProtected = !d.isProtected;
          return {
            ...d,
            isProtected: nextProtected,
            actionTaken: nextProtected
              ? `Automatically Protected (${prev.protection.mode})`
              : 'Manually Revealed',
          };
        }
        return d;
      });

      const activeThreatAlert =
        prev.activeThreatAlert?.id === id
          ? { ...prev.activeThreatAlert, isProtected: nextProtected }
          : prev.activeThreatAlert;

      return { ...prev, detections, activeThreatAlert };
    });

    pushToast(
      nextProtected ? 'success' : 'warning',
      nextProtected ? '🛡 Sensitive region blurred' : `⚠ ${targetCategory} unmasked`,
      nextProtected
        ? `${targetCategory} region is now shielded using ${state.protection.mode}.`
        : `${targetCategory} region is temporarily visible on screen.`
    );
  };

  const handleProtectAll = () => {
    const timestamp = new Date().toTimeString().slice(0, 8);
    applyAndSave((prev) => ({
      ...prev,
      detections: prev.detections.map((d) => ({
        ...d,
        isProtected: true,
        actionTaken: `Automatically Protected`,
      })),
      activeThreatAlert: null,
      events: [
        {
          id: `evt-${Date.now()}`,
          timestamp,
          title: 'Screen protected',
          action: `${prev.detections.length} regions masked (${prev.protection.mode})`,
          category: 'System',
          risk: 'SAFE',
        },
        ...prev.events,
      ],
    }));
    setUnreadNotifications((n) => n + 1);
    ScreenShieldApi.updateProtection({ automaticProtection: true });
    pushToast(
      'success',
      '🛡 Screen protected',
      `All ${state.detections.length} sensitive regions are actively masked.`
    );
  };

  const handleRunScan = async () => {
    setIsScanning(true);
    setScanStatusText('🧠 AI ANALYZING SCREEN...');

    setTimeout(() => {
      setIsScanning(false);
      setScanStatusText('✓ SCREEN ANALYSIS COMPLETE');
      setTimeout(() => {
        setScanStatusText(null);
      }, 1500);
    }, 1300);

    const timestamp = new Date().toTimeString().slice(0, 8);
    applyAndSave((prev) => ({
      ...prev,
      telemetry: {
        ...prev.telemetry,
        lastScanSecondsAgo: 0,
      },
      analytics: {
        ...prev.analytics,
        Today: {
          ...prev.analytics.Today,
          totalScans: prev.analytics.Today.totalScans + 1,
        },
      },
      events: [
        {
          id: `evt-${Date.now()}`,
          timestamp,
          title: 'Screen scanned',
          action: 'No unmitigated threats',
          category: 'System',
          risk: 'SAFE',
        },
        ...prev.events,
      ],
    }));
    setUnreadNotifications((n) => n + 1);
    await ScreenShieldApi.runScan();
    pushToast(
      'info',
      '🤖 AI scan completed',
      `Frame buffer analyzed in ${state.telemetry.inferenceMs} ms.`
    );
  };

  const handleToggleSafeMode = () => {
    const nextSafe = !state.protection.safeModeActive;
    applyAndSave((prev) => ({
      ...prev,
      protection: {
        ...prev.protection,
        safeModeActive: nextSafe,
        mode: nextSafe ? 'Safe Mode' : 'Blur',
      },
    }));
    ScreenShieldApi.updateProtection({
      safeModeActive: nextSafe,
      mode: nextSafe ? 'Safe Mode' : 'Blur',
    });
    pushToast(
      nextSafe ? 'success' : 'info',
      nextSafe ? '🛡 Safe Mode activated' : 'Safe Mode disabled',
      nextSafe
        ? 'Maximum zero-trust masking enforced across all screen regions.'
        : 'Returned to standard intelligent detection mode.'
    );
  };

  const handleEmergencyProtect = () => {
    applyAndSave((prev) => ({
      ...prev,
      protection: {
        ...prev.protection,
        emergencyProtected: true,
      },
    }));
    setUnreadNotifications((n) => n + 1);
    ScreenShieldApi.updateProtection({ emergencyProtected: true });
    pushToast(
      'critical',
      '⚡ Emergency protection activated',
      'Full-screen blackout active until manually unlocked.'
    );
  };

  const handleUnlockEmergency = () => {
    applyAndSave((prev) => ({
      ...prev,
      protection: {
        ...prev.protection,
        emergencyProtected: false,
      },
    }));
    ScreenShieldApi.updateProtection({ emergencyProtected: false });
    pushToast('success', '✓ Monitoring resumed', 'Interactive workspace unlocked.');
  };

  const handleSimulateThreat = () => {
    const template = SIMULATED_THREATS[simIndex % SIMULATED_THREATS.length];
    setSimIndex((i) => i + 1);
    const timestamp = new Date().toTimeString().slice(0, 8);
    const shouldAutoMask = state.protection.automaticProtection;

    const newDetection: DetectionItem = {
      ...template,
      id: `det-sim-${Date.now()}`,
      timestamp,
      relativeTime: 'Just now',
      isProtected: shouldAutoMask,
      actionTaken: shouldAutoMask
        ? 'Automatically Protected'
        : 'Unmasked Exposure Warning',
    };

    applyAndSave((prev) => ({
      ...prev,
      detections: [newDetection, ...prev.detections.slice(0, 5)],
      activeThreatAlert: newDetection,
      events: [
        {
          id: `evt-${Date.now()}`,
          timestamp,
          title: `${newDetection.category} detected`,
          action: shouldAutoMask ? 'Region blurred' : 'Alert triggered',
          category: newDetection.category,
          risk: newDetection.risk,
          confidence: newDetection.confidence,
        },
        ...prev.events,
      ],
      analytics: {
        ...prev.analytics,
        Today: {
          ...prev.analytics.Today,
          privacyThreats: prev.analytics.Today.privacyThreats + 1,
          protectedRegions:
            prev.analytics.Today.protectedRegions + (shouldAutoMask ? 1 : 0),
        },
      },
    }));
    setUnreadNotifications((n) => n + 1);
    ScreenShieldApi.simulateDetection(newDetection);

    pushToast(
      newDetection.risk === 'CRITICAL' ? 'critical' : 'warning',
      `🚨 Sensitive information detected: ${newDetection.category}`,
      `${newDetection.label} (${newDetection.confidence}% confidence)`
    );
  };

  const handleUpdateProtection = (
    patch: Partial<ProtectionConfig & { sensitivity: 'LOW' | 'MEDIUM' | 'HIGH' }>
  ) => {
    applyAndSave((prev) => ({
      ...prev,
      protection: { ...prev.protection, ...patch },
      telemetry: {
        ...prev.telemetry,
        protectionActive:
          (patch.automaticProtection ?? prev.protection.automaticProtection) ||
          (patch.safeModeActive ?? prev.protection.safeModeActive),
      },
    }));
    ScreenShieldApi.updateProtection(patch);
  };

  const handleUpdateCamera = (patch: Partial<CameraState>) => {
    applyAndSave((prev) => ({
      ...prev,
      camera: { ...prev.camera, ...patch },
    }));
    ScreenShieldApi.updateCamera(patch);
    if (patch.enabled === true) {
      pushToast(
        'warning',
        '⚠ Shoulder-Surfing Guard Active',
        '2 viewers detected facing display — Privacy Risk elevated.'
      );
    } else if (patch.enabled === false) {
      pushToast(
        'info',
        'Camera disabled',
        'ScreenShield AI has disconnected from optical hardware.'
      );
    }
  };

  const handleUpdateSettings = (patch: Partial<AppSettings>) => {
    applyAndSave((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
      telemetry: {
        ...prev.telemetry,
        fps: patch.monitoringFrequencyFps ?? prev.telemetry.fps,
      },
    }));
    ScreenShieldApi.updateSettings(patch);
  };

  const handleCreateZone = (zoneInput: Omit<PrivacyZone, 'id' | 'createdAt'>) => {
    const newZone: PrivacyZone = {
      ...zoneInput,
      id: `zone-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    applyAndSave((prev) => ({
      ...prev,
      zones: [newZone, ...prev.zones],
    }));
    ScreenShieldApi.createZone(zoneInput);
    pushToast(
      'success',
      `🛡 Privacy Zone "${zoneInput.name}" created`,
      `Policy set to ${zoneInput.policy}.`
    );
  };

  const handleUpdateZonePolicy = (id: string, policy: ZonePolicy) => {
    applyAndSave((prev) => ({
      ...prev,
      zones: prev.zones.map((z) => (z.id === id ? { ...z, policy } : z)),
    }));
    ScreenShieldApi.updateZone(id, { policy });
  };

  const handleToggleZoneActive = (id: string) => {
    let targetState = true;
    applyAndSave((prev) => ({
      ...prev,
      zones: prev.zones.map((z) => {
        if (z.id === id) {
          targetState = !z.active;
          return { ...z, active: targetState };
        }
        return z;
      }),
    }));
    ScreenShieldApi.updateZone(id, { active: targetState });
  };

  const handleDeleteZone = (id: string) => {
    applyAndSave((prev) => ({
      ...prev,
      zones: prev.zones.filter((z) => z.id !== id),
    }));
    ScreenShieldApi.deleteZone(id);
    pushToast('info', 'Privacy zone removed');
  };

  const handleToggleModel = (id: string) => {
    let nextStatus: 'ONLINE' | 'OFF' = 'ONLINE';
    applyAndSave((prev) => ({
      ...prev,
      models: prev.models.map((m) => {
        if (m.id === id) {
          nextStatus = m.status === 'ONLINE' ? 'OFF' : 'ONLINE';
          return { ...m, status: nextStatus };
        }
        return m;
      }),
    }));
    ScreenShieldApi.updateModel(id, { status: nextStatus });
  };

  const handleUpdateModelThreshold = (id: string, threshold: number) => {
    applyAndSave((prev) => ({
      ...prev,
      models: prev.models.map((m) =>
        m.id === id ? { ...m, threshold } : m
      ),
    }));
    ScreenShieldApi.updateModel(id, { threshold });
  };

  const unprotectedCount = state.detections.filter(
    (d) => !d.isProtected && !state.protection.safeModeActive
  ).length;

  return (
    <div
      className={`relative min-h-screen flex text-slate-100 ${
        state.settings.theme === 'light' ? 'invert hue-rotate-180' : ''
      }`}
    >
      {/* Dynamic Atmospheric Page Theme Background (Sections 1, 2, 3, 24) */}
      <AtmosphericBackground activeTab={activeTab} />

      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        telemetry={state.telemetry}
        privacyScore={state.privacyScore}
        privacyStreakDays={state.privacyStreakDays}
        unprotectedCount={unprotectedCount}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenOnboarding={() => setWelcomeMode('onboarding')}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        <TopBar
          activeTab={activeTab}
          telemetry={state.telemetry}
          camera={state.camera}
          unreadNotifications={unreadNotifications}
          focusMode={focusMode}
          onToggleFocusMode={() => {
            setFocusMode((f) => !f);
            pushToast(
              'info',
              !focusMode ? '✨ Focus Mode Enabled' : 'Focus Mode Disabled',
              !focusMode
                ? 'Showing only essential privacy status and live screen monitor.'
                : 'Restored full security intelligence widgets.'
            );
          }}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleCamera={() =>
            handleUpdateCamera({
              enabled: !state.camera.enabled,
              viewerDetectionActive: !state.camera.enabled,
              detectedViewers: !state.camera.enabled ? 2 : 0,
              privacyRisk: !state.camera.enabled ? 'HIGH' : 'SAFE',
            })
          }
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenNotifications={() => setIsNotificationsModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onTriggerEmergencyProtect={handleEmergencyProtect}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardPage
              state={state}
              focusMode={focusMode}
              isScanning={isScanning}
              scanStatusText={scanStatusText}
              onProtectAll={handleProtectAll}
              onRunScan={handleRunScan}
              onToggleSafeMode={handleToggleSafeMode}
              onEmergencyProtect={handleEmergencyProtect}
              onToggleDetectionMask={handleToggleDetectionMask}
              onDismissThreatAlert={() =>
                setState((prev) => ({ ...prev, activeThreatAlert: null }))
              }
              onSimulateThreat={handleSimulateThreat}
              onApplyProtectionMode={(mode) => {
                handleUpdateProtection({ mode });
                pushToast(
                  'success',
                  `🛡 Protection Mode set to ${mode}`,
                  'Applied AI security recommendation.'
                );
              }}
              onUpdateCamera={handleUpdateCamera}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'live-monitor' && (
            <LiveMonitorPage
              state={state}
              isScanning={isScanning}
              scanStatusText={scanStatusText}
              onToggleDetectionMask={handleToggleDetectionMask}
              onSimulateThreat={handleSimulateThreat}
              onRunScan={handleRunScan}
              onProtectAll={handleProtectAll}
              onToggleCamera={() =>
                handleUpdateCamera({
                  enabled: !state.camera.enabled,
                  viewerDetectionActive: !state.camera.enabled,
                  detectedViewers: !state.camera.enabled ? 2 : 0,
                  privacyRisk: !state.camera.enabled ? 'HIGH' : 'SAFE',
                })
              }
            />
          )}

          {activeTab === 'privacy-events' && (
            <PrivacyEventsPage
              events={state.events}
              onClearEvents={() => {
                setState((prev) => ({ ...prev, events: [] }));
                setUnreadNotifications(0);
                pushToast('info', 'Privacy event timeline cleared');
              }}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage analytics={state.analytics} />
          )}

          {activeTab === 'privacy-zones' && (
            <PrivacyZonesPage
              state={state}
              onCreateZone={handleCreateZone}
              onUpdateZonePolicy={handleUpdateZonePolicy}
              onToggleZoneActive={handleToggleZoneActive}
              onDeleteZone={handleDeleteZone}
              onToggleDetectionMask={handleToggleDetectionMask}
            />
          )}

          {(activeTab === 'protection' || activeTab === 'camera-vision') && (
            <ProtectionPage
              protection={state.protection}
              camera={state.camera}
              onUpdateProtection={handleUpdateProtection}
              onUpdateCamera={handleUpdateCamera}
              onTriggerEmergencyProtect={handleEmergencyProtect}
            />
          )}

          {activeTab === 'ai-detection' && (
            <AIDetectionPage
              models={state.models}
              onToggleModel={handleToggleModel}
              onUpdateThreshold={handleUpdateModelThreshold}
            />
          )}

          {activeTab === 'privacy-center' && (
            <PrivacyCenterPage
              state={state}
              onPurgeSessionCache={() =>
                pushToast(
                  'success',
                  '✓ Ephemeral frame cache purged',
                  'Zero sensitive buffers reside in local memory.'
                )
              }
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              settings={state.settings}
              protection={state.protection}
              camera={state.camera}
              onUpdateSettings={handleUpdateSettings}
              onUpdateProtection={handleUpdateProtection}
              onUpdateCamera={handleUpdateCamera}
            />
          )}
        </main>
      </div>

      {/* Floating AI Assistant Panel (Section 8) */}
      <AIAssistantPanel
        state={state}
        onRunScan={handleRunScan}
        onProtectAll={handleProtectAll}
        onNavigate={setActiveTab}
      />

      {/* Smart Search + Command Palette (Ctrl+K, Section 9) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        state={state}
        onNavigate={setActiveTab}
        onRunScan={handleRunScan}
        onProtectAll={handleProtectAll}
        onEmergencyProtect={handleEmergencyProtect}
        onToggleFocusMode={() => setFocusMode((f) => !f)}
        focusMode={focusMode}
      />

      {/* Welcome Onboarding (5 Steps) & Lock/Login Screen (Sections 28 & 29) */}
      <WelcomeModal
        mode={welcomeMode}
        onClose={() => setWelcomeMode(null)}
        userName={state.userName}
      />

      {/* Emergency Protection Full-Screen Overlay */}
      <ProtectionOverlay
        active={state.protection.emergencyProtected}
        onResumeMonitoring={handleUnlockEmergency}
        onUnlockProtection={handleUnlockEmergency}
      />

      {/* Non-blocking Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) =>
          setToasts((prev) => prev.filter((t) => t.id !== id))
        }
      />

      {/* Notification Center Modal (Section 22) */}
      <Modal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        title="Notification Center"
        subtitle="Real-time on-device security and protection alerts"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => {
                setUnreadNotifications(0);
                pushToast('info', '✓ All notifications marked as read');
              }}
              className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
            >
              Mark all read
            </button>

            <button
              type="button"
              onClick={() => {
                setState((prev) => ({ ...prev, events: [] }));
                setUnreadNotifications(0);
              }}
              className="text-slate-400 hover:text-rose-400 font-medium cursor-pointer"
            >
              Clear notifications
            </button>
          </div>

          {state.events.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              🛡 No active notifications. All clear.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {state.events.slice(0, 6).map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-100">
                      {evt.category === 'System'
                        ? '🤖 '
                        : evt.risk === 'CRITICAL'
                        ? '🚨 '
                        : '🛡 '}
                      {evt.title}
                    </div>
                    <div className="text-emerald-400 mt-0.5">{evt.action}</div>
                  </div>
                  <span className="font-mono text-slate-400 tabular-nums">
                    {evt.timestamp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Operator Security Enclave Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Operator Security Enclave"
        subtitle="On-device cryptographic session & onboarding controls"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Operator:</span>
              <span className="text-slate-100 font-semibold">
                {state.userName} (SecOps Lead)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Privacy Streak:</span>
              <span className="text-amber-300">
                🔥 {state.privacyStreakDays} Days Protected
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Enclave Mode:</span>
              <span className="text-emerald-400">100% On-Device NPU</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cloud Egress:</span>
              <span className="text-emerald-400">Blocked by Hardware Policy</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsProfileModalOpen(false);
                  setWelcomeMode('onboarding');
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium cursor-pointer"
              >
                Launch 5-Step Tour
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsProfileModalOpen(false);
                  setWelcomeMode('login');
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium cursor-pointer"
              >
                Lock / Login Screen
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsProfileModalOpen(false);
                setActiveTab('privacy-center');
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold cursor-pointer"
            >
              Open Privacy Center
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
