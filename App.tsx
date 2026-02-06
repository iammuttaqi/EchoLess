import React, { useState } from 'react';
import { useAudioMonitor } from './hooks/useAudioMonitor';
import Visualizer from './components/Visualizer';
import ControlPanel from './components/ControlPanel';
import SettingsModal from './components/SettingsModal';
import { Headphones, AlertTriangle } from 'lucide-react';
import { VisualizerMode } from './types';

function App() {
  const { 
    isListening, 
    error, 
    analyser, 
    startListening, 
    stopListening, 
    settings, 
    updateSettings 
  } = useAudioMonitor();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('waveform');

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const toggleVisualizerMode = () => {
    setVisualizerMode(prev => prev === 'waveform' ? 'frequency' : 'waveform');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Headphones className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-xl tracking-tight text-white">EchoLess</h1>
                    <p className="text-xs text-slate-400 font-medium">Low Latency Monitor</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></span>
                <span className="text-xs font-mono text-slate-400 uppercase">{isListening ? 'Live' : 'Offline'}</span>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 space-y-8">
        
        {/* Warning Banner */}
        {!isListening && (
             <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-4">
                <div className="bg-indigo-500/10 p-2 rounded-lg">
                    <Headphones className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-indigo-200">Headphones Recommended</h3>
                    <p className="text-sm text-indigo-200/70 mt-1">
                        To prevent audio feedback loops (screeching), please wear headphones before starting the monitor.
                    </p>
                </div>
             </div>
        )}

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 animate-in fade-in slide-in-from-top-4">
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
            </div>
        )}

        {/* Visualizer Area */}
        <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Real-time Visualization</h2>
                <div className="text-xs text-slate-500 font-mono">
                    {visualizerMode === 'waveform' ? '20ms window' : '20Hz - 20kHz'}
                </div>
            </div>
            <Visualizer 
                analyser={analyser} 
                mode={visualizerMode} 
                isListening={isListening} 
            />
        </section>

        {/* Controls */}
        <section className="sticky bottom-6 z-30">
             <ControlPanel 
                isListening={isListening}
                onToggle={toggleListening}
                settings={settings}
                onSettingsChange={updateSettings}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onToggleVisualizer={toggleVisualizerMode}
             />
        </section>

        <section className="text-center pb-8">
            <p className="text-sm text-slate-600">
                Optimized for Chrome & Edge. Safari latency may vary.
            </p>
        </section>

      </main>

      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={updateSettings}
        isListening={isListening}
      />
    </div>
  );
}

export default App;
