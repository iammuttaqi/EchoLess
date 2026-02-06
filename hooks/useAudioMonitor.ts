import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioSettings } from '../types';
import { DEFAULT_AUDIO_SETTINGS, VISUALIZER_FFT_SIZE, VISUALIZER_SMOOTHING } from '../constants';

export const useAudioMonitor = () => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AudioSettings>(DEFAULT_AUDIO_SETTINGS);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanupAudio = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    try {
      // 1. Initialize Audio Context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass({
        latencyHint: settings.latencyHint,
      });
      audioContextRef.current = ctx;

      // 2. Get Media Stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: settings.echoCancellation,
          noiseSuppression: settings.noiseSuppression,
          autoGainControl: settings.autoGainControl,
          // Low latency constraints if supported
          // @ts-ignore
          latency: 0, 
        }
      });
      streamRef.current = stream;

      // 3. Create Nodes
      const source = ctx.createMediaStreamSource(stream);
      const gainNode = ctx.createGain();
      const analyser = ctx.createAnalyser();

      // Configure Analyser
      analyser.fftSize = VISUALIZER_FFT_SIZE;
      analyser.smoothingTimeConstant = VISUALIZER_SMOOTHING;

      // Configure Gain
      gainNode.gain.value = settings.gain;

      // 4. Connect Graph: Source -> Analyser -> Gain -> Destination
      // Note: We put Analyser before Gain so visualization shows input levels, not output volume
      // But typically we want to see what we hear. Let's do Source -> Gain -> Analyser -> Destination
      
      source.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(ctx.destination);

      sourceNodeRef.current = source;
      gainNodeRef.current = gainNode;
      analyserRef.current = analyser;

      setIsListening(true);
    } catch (err: any) {
      console.error("Error accessing microphone:", err);
      setError(err.message || "Could not access microphone.");
      cleanupAudio();
      setIsListening(false);
    }
  }, [settings, cleanupAudio]);

  const stopListening = useCallback(() => {
    cleanupAudio();
    setIsListening(false);
  }, [cleanupAudio]);

  const updateSettings = useCallback((newSettings: Partial<AudioSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Live updates for gain without restarting
      if (gainNodeRef.current && newSettings.gain !== undefined) {
        // Smooth transition to prevent clicking
        gainNodeRef.current.gain.setTargetAtTime(
            newSettings.gain, 
            audioContextRef.current?.currentTime || 0, 
            0.1
        );
      }
      
      return updated;
    });
  }, []);

  // Restart stream if processing constraints change (requires new getUserMedia)
  useEffect(() => {
    if (isListening) {
      // If critical settings change, we might need to restart.
      // For now, only gain changes are real-time. 
      // Changing echo/noise constraints requires a full restart which is disruptive.
      // We will let the user toggle Start/Stop for constraint changes to apply
      // EXCEPT gain which we handled above.
    }
  }, [settings.echoCancellation, settings.noiseSuppression, settings.latencyHint]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  return {
    isListening,
    error,
    analyser: analyserRef.current,
    startListening,
    stopListening,
    settings,
    updateSettings
  };
};
