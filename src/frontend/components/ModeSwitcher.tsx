import React from 'react';
import { Globe, Smartphone, ShieldCheck, CreditCard, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useStore, ViewMode } from '../context/StoreContext';
import { playClickSound } from '../utils/audio';

export const ModeSwitcher: React.FC = () => {
  const { viewMode, setViewMode, isVinylAudioOn, toggleVinylAudio } = useStore();

  const modes: { id: ViewMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'storefront', label: 'Storefront', icon: Globe },
    { id: 'mobile-app', label: 'Mobile App', icon: Smartphone },
    { id: 'admin', label: 'Admin Suite', icon: ShieldCheck },
    { id: 'pos', label: 'In-Store POS', icon: CreditCard },
  ];

  const handleModeChange = (mode: ViewMode) => {
    playClickSound();
    setViewMode(mode);
  };

  return (
    <div className="fixed bottom-6 inset-x-0 z-50 pointer-events-none flex justify-center px-4">
      <div className="pointer-events-auto bg-[#181513]/90 backdrop-blur-xl border border-white/20 p-1.5 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex items-center gap-1 sm:gap-2">
        {/* Modes Pill Button Group */}
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = viewMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              className={`relative px-3.5 sm:px-4 py-2 rounded-full font-mono text-[10px] sm:text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-[#E67E44] to-[#C4975A] text-white font-bold shadow-md scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              )}
            </button>
          );
        })}

        <div className="h-5 w-[1px] bg-white/20 mx-1"></div>

        {/* Vinyl Audio Cracker Sound Toggle Button */}
        <button
          onClick={() => {
            playClickSound();
            toggleVinylAudio();
          }}
          className={`p-2 rounded-full text-xs transition-all ${
            isVinylAudioOn
              ? 'bg-[#E67E44] text-white shadow-[0_0_12px_rgba(230,126,68,0.6)]'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title={isVinylAudioOn ? 'Mute Vinyl Ambient Lo-Fi' : 'Enable Vinyl Needle Ambient Crackle'}
          aria-label="Toggle Vinyl Audio"
        >
          {isVinylAudioOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

