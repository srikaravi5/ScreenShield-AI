export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ProtectionMode =
  | 'Blur'
  | 'Pixelate'
  | 'Blackout'
  | 'Warning Overlay'
  | 'Safe Mode';

export type ZonePolicy =
  | 'Always Blur'
  | 'Always Blackout'
  | 'Always Monitor'
  | 'Ignore';

export type ProtectionTrigger = 'Medium Risk' | 'High Risk' | 'Critical Risk';

export type NavigationTab =
  | 'dashboard'
  | 'live-monitor'
  | 'privacy-events'
  | 'analytics'
  | 'privacy-zones'
  | 'protection'
  | 'ai-detection'
  | 'camera-vision'
  | 'privacy-center'
  | 'settings';

export type DetectionCategory =
  | 'Password'
  | 'OTP'
  | 'Email'
  | 'Credit Card'
  | 'API Key'
  | 'Personal ID'
  | 'Banking';

export interface BoundingBox {
  /** Percentage 0-100 from left of screen preview */
  x: number;
  /** Percentage 0-100 from top of screen preview */
  y: number;
  /** Percentage 0-100 width */
  width: number;
  /** Percentage 0-100 height */
  height: number;
}

export interface DetectionItem {
  id: string;
  category: DetectionCategory;
  label: string;
  confidence: number; // e.g. 96
  risk: RiskLevel;
  timestamp: string; // e.g. "09:42:10"
  relativeTime: string; // e.g. "2 sec ago"
  box: BoundingBox;
  isProtected: boolean;
  actionTaken: string; // e.g. "Region Automatically Blurred"
  sourceApp: string; // e.g. "VaultAuth Chrome", "Stripe Dashboard"
}

export interface PrivacyEvent {
  id: string;
  timestamp: string; // e.g. "09:42:10"
  title: string; // e.g. "Password detected"
  action: string; // e.g. "Automatically blurred"
  category: DetectionCategory | 'System' | 'Camera';
  risk: RiskLevel;
  confidence?: number;
}

export interface PrivacyZone {
  id: string;
  name: string;
  policy: ZonePolicy;
  active: boolean;
  box: BoundingBox;
  createdAt: string;
}

export interface AIModelStatus {
  id: string;
  name: string;
  version: string;
  inferenceTimeMs: number;
  accuracy: number;
  status: 'ONLINE' | 'OFF';
  description: string;
  threshold: number;
}

export interface SystemTelemetry {
  cpuPercent: number;
  memoryGb: number;
  inferenceMs: number;
  fps: number;
  aiEngine: 'ONLINE' | 'STANDBY';
  protectionActive: boolean;
  onDeviceAi: boolean;
  lastScanSecondsAgo: number;
}

export interface CameraState {
  enabled: boolean;
  viewerDetectionActive: boolean;
  detectedViewers: number;
  privacyRisk: RiskLevel;
  autoLockOnShoulderSurf: boolean;
}

export interface ProtectionConfig {
  mode: ProtectionMode;
  blurIntensity: number; // 10 - 100
  automaticProtection: boolean;
  triggerLevel: ProtectionTrigger;
  safeModeActive: boolean;
  emergencyProtected: boolean;
}

export interface AppSettings {
  monitoringFrequencyFps: 1 | 5 | 10 | 15;
  detectionSensitivity: 'Balanced' | 'Strict' | 'Maximum';
  autoStart: boolean;
  theme: 'dark' | 'light';
  localProcessingOnly: boolean;
  dataRetention: 'Minimal' | 'Session Only' | '7 Days';
  eventLogging: boolean;
  defaultProtectionMethod: ProtectionMode;
  desktopAlerts: boolean;
  soundAlerts: boolean;
}

export interface AnalyticsTimeframeData {
  totalScans: number;
  privacyThreats: number;
  protectedRegions: number;
  averageRisk: number;
  riskOverTime: { label: string; risk: number; scans: number }[];
  byCategory: { category: string; count: number; percentage: number }[];
  protectionActions: { action: string; count: number; share: number }[];
  dailyThreatDistribution: { label: string; critical: number; high: number; medium: number }[];
}

export type AnalyticsRange = 'Today' | '7 Days' | '30 Days';

export interface ToastNotification {
  id: string;
  type: 'success' | 'warning' | 'critical' | 'info';
  title: string;
  detail?: string;
  timestamp: string;
}

export interface RecentApplication {
  id: string;
  name: string;
  windowTitle: string;
  status: 'Protected' | 'Shielded' | 'Monitored' | 'Safe';
  risk: RiskLevel;
  maskedCount: number;
}

export interface SmartInsight {
  id: string;
  type: 'insight' | 'recommendation';
  title: string;
  message: string;
  actionLabel?: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface ScreenShieldState {
  userName: string;
  privacyScore: number;
  privacyStreakDays: number;
  privacyHealth: 'Excellent' | 'Good' | 'Fair' | 'At Risk';
  threatLevel: RiskLevel;
  telemetry: SystemTelemetry & { ramPercent: number };
  detections: DetectionItem[];
  activeThreatAlert: DetectionItem | null;
  events: PrivacyEvent[];
  zones: PrivacyZone[];
  protection: ProtectionConfig & { sensitivity: 'LOW' | 'MEDIUM' | 'HIGH' };
  models: AIModelStatus[];
  camera: CameraState;
  settings: AppSettings;
  recentApplications: RecentApplication[];
  smartInsights: SmartInsight[];
  analytics: Record<AnalyticsRange, AnalyticsTimeframeData>;
}
