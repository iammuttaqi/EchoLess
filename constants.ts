import { AudioSettings } from './types';

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  echoCancellation: false, // Default to false for "pure" monitoring
  noiseSuppression: false,
  autoGainControl: false,
  latencyHint: 'interactive',
  gain: 1.0,
};

export const VISUALIZER_FFT_SIZE = 2048;
export const VISUALIZER_SMOOTHING = 0.8;
