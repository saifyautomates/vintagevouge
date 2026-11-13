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
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { playClickSound, playSuccessChime } from '../../utils/audio';

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
  const { showToast } = useCart();
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
    <header className="bg-white border-b border-[#EAE3D4] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[#181513] select-none">
      {/* Search Input Bar (⌘K Global Search) */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-3.5 h-3.5 text-[#8C857B] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Global Search (orders, phone, VV-D24-XX)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl pl-9 pr-8 py-1.5 text-xs font-mono placeholder:text-[#8C857B] text-[#181513] outline-none focus:border-[#8B2635] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8C857B] hover:text-[#181513]"
          >
            ✕
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 font-sans text-xs">
        {/* Clock */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E5E0D8] text-[#5C564E] text-[11px] font-mono">
          <Clock className="w-3 h-3 text-[#8B2635]" />
          <span>{currentTime || '08:00:00 PM IST'}</span>
        </div>

        {/* Refresh Sync Button */}
        <button
          onClick={() => {
            playSuccessChime();
            refreshData();
            showToast('Catalog telemetry synchronized with Kota hub.');
          }}
          className="p-2 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#E5E0D8] text-[#5C564E] hover:text-[#181513] transition-colors shadow-2xs btn-press"
          title="Sync Telemetry"
          aria-label="Sync Telemetry"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Ambient Audio Toggle */}
        <button
          onClick={() => {
            playClickSound();
            toggleVinylAudio();
          }}
          className={`p-2 rounded-xl border transition-colors shadow-2xs btn-press ${
            isVinylAudioOn
              ? 'bg-[#8B2635] text-white border-[#8B2635]'
              : 'bg-white hover:bg-[#FAF7F2] border-[#E5E0D8] text-[#5C564E]'
          }`}
          title={isVinylAudioOn ? 'Mute Vinyl Ambient Lo-Fi' : 'Enable Needle Ambient Crackle'}
          aria-label="Toggle Vinyl Audio"
        >
          {isVinylAudioOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-[#8C857B]" />}
        </button>

        {/* Ingest 1-of-1 Specimen CTA */}
        <button
          onClick={() => {
            playClickSound();
            onOpenAddModal();
          }}
          className="px-3.5 py-1.5 bg-[#8B2635] hover:bg-[#731F2C] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors btn-press"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ingest Specimen</span>
        </button>
      </div>
    </header>
  );
};
