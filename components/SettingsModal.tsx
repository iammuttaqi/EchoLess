import React from 'react';
import { X, Info } from 'lucide-react';
import { AudioSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AudioSettings;
  onSettingsChange: (settings: Partial<AudioSettings>) => void;
  isListening: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange,
  isListening 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-700 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Audio Configuration</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Warning */}
          {isListening && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-3 text-amber-200 text-sm">
                <Info className="w-5 h-5 flex-shrink-0" />
                <p>Some settings require restarting the monitor to take effect.</p>
            </div>
          )}

          {/* Processing Toggles */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Signal Processing</h3>
            
            <label className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl cursor-pointer hover:bg-slate-900/80 transition-colors">
              <div className="space-y-1">
                <div className="font-medium text-slate-200">Echo Cancellation</div>
                <div className="text-xs text-slate-500">Reduces feedback but adds latency</div>
              </div>
              <input
                type="checkbox"
                checked={settings.echoCancellation}
                onChange={(e) => onSettingsChange({ echoCancellation: e.target.checked })}
                className="w-5 h-5 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 bg-slate-700"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl cursor-pointer hover:bg-slate-900/80 transition-colors">
              <div className="space-y-1">
                <div className="font-medium text-slate-200">Noise Suppression</div>
                <div className="text-xs text-slate-500">Removes background noise</div>
              </div>
              <input
                type="checkbox"
                checked={settings.noiseSuppression}
                onChange={(e) => onSettingsChange({ noiseSuppression: e.target.checked })}
                className="w-5 h-5 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 bg-slate-700"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl cursor-pointer hover:bg-slate-900/80 transition-colors">
              <div className="space-y-1">
                <div className="font-medium text-slate-200">Auto Gain Control</div>
                <div className="text-xs text-slate-500">Automatically adjusts levels</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoGainControl}
                onChange={(e) => onSettingsChange({ autoGainControl: e.target.checked })}
                className="w-5 h-5 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 bg-slate-700"
              />
            </label>
          </div>

          {/* Latency Hint */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Latency Optimization</h3>
            <div className="grid grid-cols-3 gap-2">
                {(['interactive', 'balanced', 'playback'] as const).map((mode) => (
                    <button
                        key={mode}
                        onClick={() => onSettingsChange({ latencyHint: mode })}
                        className={`
                            px-3 py-2 rounded-lg text-sm font-medium border transition-all
                            ${settings.latencyHint === mode 
                                ? 'bg-indigo-500 border-indigo-500 text-white' 
                                : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500'}
                        `}
                    >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                ))}
            </div>
            <p className="text-xs text-slate-500">
                'Interactive' offers the lowest latency but may cause glitches on slower devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
