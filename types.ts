export interface AudioSettings {
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  latencyHint: 'interactive' | 'balanced' | 'playback';
  gain: number; // 0.0 to 2.0 (Volume)
}

export type VisualizerMode = 'waveform' | 'frequency';

export interface AudioState {
  isListening: boolean;
  hasPermission: boolean | null;
  error: string | null;
}