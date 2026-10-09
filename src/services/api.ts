import {
  AIModelStatus,
  AppSettings,
  CameraState,
  DetectionItem,
  PrivacyZone,
  ProtectionConfig,
  ScreenShieldState,
} from '../types/screenshield';
import { INITIAL_SCREENSHIELD_STATE } from './initialData';

const STORAGE_KEY = 'screenshield_ai_state_v2';

export function loadLocalState(): ScreenShieldState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_SCREENSHIELD_STATE;
    return { ...INITIAL_SCREENSHIELD_STATE, ...JSON.parse(raw) };
  } catch {
    return INITIAL_SCREENSHIELD_STATE;
  }
}

export function saveLocalState(state: ScreenShieldState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const ScreenShieldApi = {
  async fetchState(): Promise<ScreenShieldState> {
    const remote = await apiRequest<ScreenShieldState>('/api/state');
    if (remote) {
      saveLocalState(remote);
      return remote;
    }
    return loadLocalState();
  },

  async runScan(): Promise<ScreenShieldState | null> {
    return apiRequest<ScreenShieldState>('/api/scan', { method: 'POST' });
  },

  async updateProtection(patch: Partial<ProtectionConfig>): Promise<ScreenShieldState | null> {
    return apiRequest<ScreenShieldState>('/api/protection', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  },

  async updateCamera(patch: Partial<CameraState>): Promise<ScreenShieldState | null> {
    return apiRequest<ScreenShieldState>('/api/camera', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  },

  async updateSettings(patch: Partial<AppSettings>): Promise<ScreenShieldState | null> {
    return apiRequest<ScreenShieldState>('/api/settings', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  },

  async createZone(zone: Omit<PrivacyZone, 'id' | 'createdAt'>): Promise<ScreenShieldState | null> {
    return apiRequest<ScreenShieldState>('/api/zones', {
      method: 'POST',
      body: JSON.stringify(zone),
    });
  },

  async updateZone(id: string, patch: Partial<PrivacyZone>): Promise<ScreenShieldState | null> {
    return apiRequest<ScreenShieldState>(`/api/zones/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  },

  async deleteZone(id: string): Promise<ScreenShieldState | null> {
    return apiRequest<ScreenShieldState>(`/api/zones/${id}`, {
      method: 'DELETE',
    });
  },

  async updateModel(id: string, patch: Partial<AIModelStatus>): Promise<ScreenShieldState | null> {
    return apiRequest<ScreenShieldState>(`/api/models/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  },

  async simulateDetection(detection: DetectionItem): Promise<ScreenShieldState | null> {
    return apiRequest<ScreenShieldState>('/api/detections/simulate', {
      method: 'POST',
      body: JSON.stringify(detection),
    });
  },

  async askAssistant(prompt: string): Promise<string> {
    const res = await apiRequest<{ reply: string }>('/api/assistant', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
    return (
      res?.reply ||
      'ScreenShield AI is actively monitoring your display on-device. All high-risk password, OTP, and API key regions are protected.'
    );
  },
};
