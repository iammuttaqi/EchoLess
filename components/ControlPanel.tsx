import React from 'react';
import { Mic, MicOff, Volume2, Activity, Settings2 } from 'lucide-react';
import { AudioSettings } from '../types';

interface ControlPanelProps {
  isListening: boolean;
  onToggle: () => void;
  settings: AudioSettings;
  onSettingsChange: (settings: Partial<AudioSettings>) => void;
  onOpenSettings: () => void;
  onToggleVisualizer: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isListening,
  onToggle,
  settings,
  onSettingsChange,
  onOpenSettings,
  onToggleVisualizer
}) => {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Main Action Button */}
        <button
          onClick={onToggle}
          className={`
            group relative w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20' 
              : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
            }
          `}
        >
          {isListening ? (
            <>
              <MicOff className="w-6 h-6" />
              <span>Stop Monitoring</span>
            </>
          ) : (
            <>
              <Mic className="w-6 h-6" />
              <span>Start Monitoring</span>
            </>
          )}
        </button>

        {/* Volume Slider */}
        <div className="flex-1 w-full flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <Volume2 className="w-5 h-5 text-slate-400" />
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between mb-1">
                <label htmlFor="volume" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monitor Volume</label>
                <span className="text-xs font-mono text-indigo-400">{(settings.gain * 100).toFixed(0)}%</span>
            </div>
            <input
              id="volume"
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={settings.gain}
              onChange={(e) => onSettingsChange({ gain: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="flex gap-2 w-full md:w-auto">
            <button 
                onClick={onToggleVisualizer}
                className="flex-1 md:flex-none p-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors border border-slate-600"
                title="Toggle View Mode"
            >
                <Activity className="w-5 h-5 mx-auto" />
            </button>
            <button 
                onClick={onOpenSettings}
                className="flex-1 md:flex-none p-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors border border-slate-600"
                title="Audio Settings"
            >
                <Settings2 className="w-5 h-5 mx-auto" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
