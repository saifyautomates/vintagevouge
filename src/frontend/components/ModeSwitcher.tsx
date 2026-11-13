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
    <div className="fixed bottom-20 sm:bottom-6 inset-x-0 z-50 pointer-events-none flex justify-center px-2 sm:px-4">
      <div className="pointer-events-auto bg-[#181513]/92 backdrop-blur-xl border border-white/20 p-1 sm:p-1.5 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex items-center gap-1 sm:gap-2 max-w-[calc(100vw-16px)]">
        {/* Modes Pill Button Group */}
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = viewMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              className={`relative px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-mono text-[9px] sm:text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-1 sm:gap-1.5 btn-press min-h-[36px] sm:min-h-[40px] ${
                isActive
                  ? 'bg-gradient-to-r from-[#A65B32] to-[#C4975A] text-white font-bold shadow-md scale-100 sm:scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className={isActive ? 'inline' : 'hidden sm:inline'}>{m.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              )}
            </button>
          );
        })}

        <div className="h-5 w-[1px] bg-white/20 mx-0.5 sm:mx-1"></div>

        {/* Vinyl Audio Cracker Sound Toggle Button */}
        <button
          data-cursor="CRACKLE"
          onClick={() => {
            playClickSound();
            toggleVinylAudio();
          }}
          className={`p-2 rounded-full text-xs transition-all min-w-[36px] min-h-[36px] flex items-center justify-center btn-press ${
            isVinylAudioOn
              ? 'bg-[#A65B32] text-white shadow-[0_0_12px_rgba(166,91,50,0.6)]'
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

