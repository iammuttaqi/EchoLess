import React, { useEffect, useRef } from 'react';
import { VisualizerMode } from '../types';

interface VisualizerProps {
  analyser: AnalyserNode | null;
  mode: VisualizerMode;
  isListening: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ analyser, mode, isListening }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // If not listening or no analyser, draw a flat line or idle state
    if (!isListening || !analyser) {
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.5)'; // slate-600
      ctx.lineWidth = 2;
      ctx.stroke();
      return;
    }

    if (mode === 'waveform') {
      const bufferLength = analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#6366f1'; // indigo-500
      ctx.beginPath();

      const sliceWidth = width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // normalize 0..2
        const y = v * height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    } else {
      // Frequency mode
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        // Gradient fill
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, '#4f46e5'); // indigo-600
        gradient.addColorStop(1, '#818cf8'); // indigo-400
        
        ctx.fillStyle = gradient;
        
        // Scale height to fit canvas
        const scaledHeight = (barHeight / 255) * height;

        ctx.fillRect(x, height - scaledHeight, barWidth, scaledHeight);

        x += barWidth + 1;
      }
    }

    animationRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    // Handle High DPI displays
    const canvas = canvasRef.current;
    if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
    }

    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [analyser, isListening, mode]);

  return (
    <div className="w-full h-48 md:h-64 bg-slate-800 rounded-xl overflow-hidden shadow-inner relative border border-slate-700">
        <div className="absolute top-2 right-4 text-xs font-mono text-slate-400 pointer-events-none">
            {mode === 'waveform' ? 'TIME DOMAIN' : 'FREQUENCY DOMAIN'}
        </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};

export default Visualizer;