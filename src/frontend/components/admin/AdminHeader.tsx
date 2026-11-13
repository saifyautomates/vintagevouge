import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Bell,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Clock,
  Volume2,
  VolumeX,
  Store,
  Smartphone
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { playClickSound } from '../../utils/audio';

interface AdminHeaderProps {
  onOpenAddModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenAddModal,
  searchQuery,
  onSearchChange,
}) => {
  const { isVinylAudioOn, toggleVinylAudio, refreshData, setViewMode } = useStore();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#181513] border-b border-white/10 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 text-white">
      {/* Search Input Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search specimens (VV-D24-XX), clients, orders, phone..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-mono placeholder:text-white/30 text-white outline-none focus:border-[#E67E44] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 font-mono text-xs">
        {/* Clock */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-[11px]">
          <Clock className="w-3.5 h-3.5 text-[#E67E44]" />
          <span>{currentTime || '08:00:00 PM IST'}</span>
        </div>

        {/* Refresh Sync Button */}
        <button
          onClick={() => {
            playClickSound();
            refreshData();
          }}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
          title="Sync Database"
          aria-label="Sync Database"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Ambient Audio Toggle */}
        <button
          onClick={() => {
            playClickSound();
            toggleVinylAudio();
          }}
          className={`p-2 rounded-xl border transition-colors ${
            isVinylAudioOn
              ? 'bg-[#E67E44]/20 border-[#E67E44] text-[#E67E44]'
              : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
          }`}
          title="Toggle Vinyl Audio"
          aria-label="Toggle Vinyl Audio"
        >
          {isVinylAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Direct POS Counter Link */}
        <button
          onClick={() => {
            playClickSound();
            setViewMode('pos');
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-all font-bold text-[11px]"
        >
          <Store className="w-3.5 h-3.5 text-emerald-400" />
          <span>Launch POS Register</span>
        </button>

        {/* Primary Add Specimen Action Button */}
        <button
          onClick={() => {
            playClickSound();
            onOpenAddModal();
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#E67E44] hover:bg-[#d57038] text-white rounded-xl font-bold tracking-wider text-xs shadow-lg shadow-[#E67E44]/20 transition-all uppercase"
        >
          <Plus className="w-4 h-4" />
          <span>Add 1-of-1 Specimen</span>
        </button>
      </div>
    </header>
  );
};

