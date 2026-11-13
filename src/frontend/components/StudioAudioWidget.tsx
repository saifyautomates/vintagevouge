import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Disc3, Radio, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { startVinylCrackle, stopVinylCrackle, setSoundEnabled, playClickSound } from '../utils/audio';

export const StudioAudioWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [channel, setChannel] = useState<'monsoon' | 'shibuya' | 'selvedge'>('monsoon');
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.4);

  const togglePlayback = () => {
    playClickSound();
    if (isPlaying) {
      stopVinylCrackle();
      setIsPlaying(false);
    } else {
      setSoundEnabled(true);
      startVinylCrackle();
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none hidden sm:block">
      {/* Expanded Cassette Player Modal */}
      {isExpanded && (
        <div className="mb-3 w-72 bg-[#FAF7F2] border border-[#181513]/25 rounded-2xl shadow-2xl p-4 font-mono text-xs text-[#181513] space-y-3 animate-slideUp backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-[#181513]/10 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-[11px] tracking-wider text-[#E67E44]">
              <Disc3 className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
              <span>KOTA STUDIO SOUNDSCAPE</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-black/10 rounded"
              aria-label="Collapse audio player"
            >
              <ChevronDown className="w-4 h-4 text-[#5C564E]" />
            </button>
          </div>

          {/* VU Meter Bars (Visual Delight) */}
          <div className="bg-[#181513] p-2.5 rounded-lg flex items-center justify-between gap-1 h-12 shadow-inner">
            {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-white/10 rounded-full overflow-hidden flex flex-col justify-end h-full"
              >
                <div
                  className={`w-full rounded-full transition-all duration-300 ${
                    isPlaying
                      ? i > 9
                        ? 'bg-red-500'
                        : i > 6
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                      : 'bg-white/20 h-1'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(15, (height * (i % 2 === 0 ? 0.9 : 1.1)) % 100)}%` : '4px',
                    transition: 'height 0.2s ease-in-out',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Channel Selector */}
          <div className="space-y-1 text-[10px]">
            <span className="text-[#5C564E] uppercase font-bold block">Archival Channel:</span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'monsoon', label: '🌧️ Kota Rain' },
                { id: 'shibuya', label: '📻 Shibuya 94' },
                { id: 'selvedge', label: '✂️ Selvedge' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    playClickSound();
                    setChannel(c.id as any);
                    if (!isPlaying) togglePlayback();
                  }}
                  className={`py-1 px-1 rounded text-center transition-all ${
                    channel === c.id
                      ? 'bg-[#E67E44] text-white font-bold'
                      : 'bg-[#EFE7DB] text-[#5C564E] hover:bg-black/10'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={togglePlayback}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 transition-all shadow ${
                isPlaying
                  ? 'bg-[#181513] text-white'
                  : 'bg-[#E67E44] text-white hover:bg-[#d57038]'
              }`}
            >
              {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'PAUSE AMBIENCE' : 'PLAY AMBIENCE'}</span>
            </button>

            <span className="text-[10px] text-[#8C857B] italic">
              Studio Web Audio 44.1kHz
            </span>
          </div>
        </div>
      )}

      {/* Floating Cassette Pill Toggle Button */}
      <button
        onClick={() => {
          playClickSound();
          setIsExpanded(!isExpanded);
        }}
        className="flex items-center gap-2.5 bg-[#FAF7F2]/95 backdrop-blur-md border border-[#181513]/20 px-3.5 py-2 rounded-full shadow-lg hover:border-[#E67E44] transition-all group"
      >
        <span className={`p-1 rounded-full ${isPlaying ? 'bg-[#E67E44] text-white' : 'bg-[#EFE7DB] text-[#181513]'}`}>
          <Disc3 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
        </span>
        <div className="text-left font-mono leading-none">
          <span className="text-[10px] font-bold text-[#181513] block group-hover:text-[#E67E44] transition-colors">
            {isPlaying ? 'STUDIO SOUNDSCAPE • LIVE' : 'STUDIO CASSETTE'}
          </span>
          <span className="text-[9px] text-[#5C564E]">
            {isPlaying ? (channel === 'monsoon' ? '🌧️ Kota Rain Beats' : '📻 1994 Shibuya') : 'Tap for Atmosphere'}
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-[#5C564E]" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-[#5C564E]" />
        )}
      </button>
    </div>
  );
};

