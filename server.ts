import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_SCREENSHIELD_STATE } from './src/services/initialData';
import {
  AIModelStatus,
  AppSettings,
  CameraState,
  DetectionItem,
  PrivacyZone,
  ProtectionConfig,
  ScreenShieldState,
} from './src/types/screenshield';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serverState: ScreenShieldState = structuredClone(INITIAL_SCREENSHIELD_STATE);

function buildLocalAssistantReply(prompt: string, state: ScreenShieldState): string {
  const q = prompt.toLowerCase();
  const protectedCount = state.detections.filter((d) => d.isProtected).length;
  const criticalItems = state.detections.filter((d) => d.risk === 'CRITICAL');

  if (q.includes('scan')) {
    return `I have initiated a full on-device neural screen scan (${state.telemetry.inferenceMs} ms). Currently ${state.detections.length} sensitive regions are detected and ${protectedCount} are actively shielded with ${state.protection.mode} (${state.protection.blurIntensity}%). Your Privacy Score is ${state.privacyScore}/100.`;
  }
  if (q.includes('protect') || q.includes('sensitive')) {
    return `All ${state.detections.length} sensitive regions—including ${criticalItems.map((c) => c.category).join(' & ') || 'credentials'}—are now masked using ${state.protection.mode} mode. Zero raw pixels or text strings leave your device.`;
  }
  if (q.includes('risk') || q.includes('explain') || q.includes('today')) {
    return `Today's Risk Summary: ScreenShield AI completed ${state.analytics.Today.totalScans.toLocaleString()} local scans and intercepted ${state.analytics.Today.privacyThreats} high-risk exposures. The primary risk sources were browser password inputs (96% confidence) and production API keys in VS Code (95% confidence), both of which were automatically blurred.`;
  }
  if (q.includes('setting') || q.includes('mode') || q.includes('blackout')) {
    return `Your current protection mode is set to ${state.protection.mode} at ${state.protection.blurIntensity}% intensity with ${state.protection.triggerLevel} auto-triggering. For financial spreadsheets or terminal secrets, I recommend switching Banking zones to "Always Blackout".`;
  }
  return `Your screen privacy score is ${state.privacyScore}/100 (${state.privacyHealth}). On-device Visual AI (${state.models[0]?.accuracy ?? 96.4}% accuracy) is actively protecting ${protectedCount} of ${state.detections.length} detected regions across Chrome, VS Code, and Browser windows.`;
}

function recalculateScore(state: ScreenShieldState) {
  const unprotectedHighOrCritical = state.detections.filter(
    (d) => !d.isProtected && (d.risk === 'CRITICAL' || d.risk === 'HIGH')
  ).length;
  const unprotectedMedium = state.detections.filter(
    (d) => !d.isProtected && d.risk === 'MEDIUM'
  ).length;

  let base = 96;
  base -= unprotectedHighOrCritical * 18;
  base -= unprotectedMedium * 4;
  if (state.camera.enabled && state.camera.detectedViewers > 1) {
    base -= 15;
  }
  if (!state.protection.automaticProtection) {
    base -= 8;
  }
  if (state.protection.safeModeActive || state.protection.emergencyProtected) {
    base = 100;
  }

  state.privacyScore = Math.max(24, Math.min(100, base));
  if (state.privacyScore >= 88) {
    state.threatLevel = 'SAFE';
  } else if (state.privacyScore >= 72) {
    state.threatLevel = 'MEDIUM';
  } else if (state.privacyScore >= 55) {
    state.threatLevel = 'HIGH';
  } else {
    state.threatLevel = 'CRITICAL';
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get('/api/state', (_req, res) => {
    res.json(serverState);
  });

  app.post('/api/scan', (_req, res) => {
    const now = new Date();
    const timestamp = now.toTimeString().slice(0, 8);
    serverState.telemetry.lastScanSecondsAgo = 0;
    serverState.analytics.Today.totalScans += 1;

    // Auto-protect if enabled
    if (serverState.protection.automaticProtection) {
      serverState.detections = serverState.detections.map((d) => {
        if (d.risk === 'CRITICAL' || d.risk === 'HIGH') {
          return {
            ...d,
            isProtected: true,
            actionTaken: `Automatically protected (${serverState.protection.mode})`,
          };
        }
        return d;
      });
    }

    serverState.events.unshift({
      id: `evt-${Date.now()}`,
      timestamp,
      title: 'Full screen AI scan completed',
      action: `${serverState.detections.filter((d) => d.isProtected).length} regions shielded`,
      category: 'System',
      risk: 'SAFE',
    });
    serverState.events = serverState.events.slice(0, 30);

    recalculateScore(serverState);
    res.json(serverState);
  });

  app.patch('/api/protection', (req, res) => {
    const patch = req.body as Partial<ProtectionConfig>;
    serverState.protection = { ...serverState.protection, ...patch };
    serverState.telemetry.protectionActive =
      serverState.protection.automaticProtection ||
      serverState.protection.safeModeActive ||
      serverState.protection.emergencyProtected;
    recalculateScore(serverState);
    res.json(serverState);
  });

  app.patch('/api/camera', (req, res) => {
    const patch = req.body as Partial<CameraState>;
    serverState.camera = { ...serverState.camera, ...patch };
    recalculateScore(serverState);
    res.json(serverState);
  });

  app.patch('/api/settings', (req, res) => {
    const patch = req.body as Partial<AppSettings>;
    serverState.settings = { ...serverState.settings, ...patch };
    if (patch.monitoringFrequencyFps) {
      serverState.telemetry.fps = patch.monitoringFrequencyFps;
    }
    res.json(serverState);
  });

  app.post('/api/zones', (req, res) => {
    const body = req.body as Omit<PrivacyZone, 'id' | 'createdAt'>;
    const newZone: PrivacyZone = {
      ...body,
      id: `zone-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    serverState.zones.unshift(newZone);
    res.json(serverState);
  });

  app.patch('/api/zones/:id', (req, res) => {
    const { id } = req.params;
    const patch = req.body as Partial<PrivacyZone>;
    serverState.zones = serverState.zones.map((z) => (z.id === id ? { ...z, ...patch } : z));
    res.json(serverState);
  });

  app.delete('/api/zones/:id', (req, res) => {
    const { id } = req.params;
    serverState.zones = serverState.zones.filter((z) => z.id !== id);
    res.json(serverState);
  });

  app.patch('/api/models/:id', (req, res) => {
    const { id } = req.params;
    const patch = req.body as Partial<AIModelStatus>;
    serverState.models = serverState.models.map((m) => (m.id === id ? { ...m, ...patch } : m));
    res.json(serverState);
  });

  app.post('/api/detections/simulate', (req, res) => {
    const detection = req.body as DetectionItem;
    serverState.detections = [detection, ...serverState.detections.slice(0, 7)];
    serverState.activeThreatAlert = detection;
    serverState.events.unshift({
      id: `evt-${Date.now()}`,
      timestamp: detection.timestamp,
      title: `${detection.category} detected`,
      action: detection.actionTaken,
      category: detection.category,
      risk: detection.risk,
      confidence: detection.confidence,
    });
    serverState.analytics.Today.privacyThreats += 1;
    if (detection.isProtected) {
      serverState.analytics.Today.protectedRegions += 1;
    }
    recalculateScore(serverState);
    res.json(serverState);
  });

  app.post('/api/assistant', async (req, res) => {
    const { prompt } = req.body as { prompt?: string };
    const userPrompt = (prompt || 'Explain current screen privacy status').trim();

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const contextSummary = `Current ScreenShield AI State: Privacy Score=${serverState.privacyScore}/100, Protection Mode=${serverState.protection.mode} (${serverState.protection.blurIntensity}%), Active Detections=${serverState.detections
          .map((d) => `${d.category} (${d.confidence}%, ${d.risk}, Protected:${d.isProtected})`)
          .join('; ')}.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${contextSummary}\n\nUser question: ${userPrompt}`,
          config: {
            systemInstruction:
              'You are ScreenShield AI, an intelligent on-device visual privacy guardian assistant. Explain detected screen risks and privacy settings in clear, concise, reassuring language (2-3 sentences max).',
          },
        });

        if (response.text) {
          res.json({ reply: response.text });
          return;
        }
      } catch {
        // Fallback to local deterministic intelligence below
      }
    }

    res.json({ reply: buildLocalAssistantReply(userPrompt, serverState) });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScreenShield AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
