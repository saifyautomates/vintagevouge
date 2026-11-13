import React, { useState } from 'react';
import {
  Clock,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Users,
  Send,
  Save,
  Check
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../../backend/api/client';
import { playClickSound, playSuccessChime } from '../../utils/audio';

export const AdminDropLaunchpad: React.FC = () => {
  const { dropConfig } = useStore();

  const [title, setTitle] = useState(dropConfig.title);
  const [dropDate, setDropDate] = useState(dropConfig.scheduledLaunch);
  const [isVipLocked, setIsVipLocked] = useState(dropConfig.isVipGateLocked);
  const [vipPasscode, setVipPasscode] = useState(dropConfig.vipPasscode);
  const [savedToast, setSavedToast] = useState(false);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    await api.drop.updateConfig({
      title,
      scheduledLaunch: dropDate,
      isVipGateLocked: isVipLocked,
      vipPasscode,
    });
    playSuccessChime();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl text-white">
      {/* Header */}
      <div className="bg-[#181513] border border-white/10 rounded-2xl p-6 space-y-2 shadow-xl">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#E67E44]" />
          <h3 className="font-serif text-2xl font-bold">Drop Launch Control & VIP Gatekeeper</h3>
        </div>
        <p className="font-sans text-xs text-white/60">
          Configure weekly Sunday drop schedules, early-access passcodes for Instagram close friends, and lock down catalog access.
        </p>
      </div>

      <form onSubmit={handleSaveConfig} className="space-y-6">
        {/* Drop Metadata */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-[#E67E44] flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Drop Campaign Schedule</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-white/50 mb-1">
                Drop Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-[#E67E44]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-white/50 mb-1">
                Target Launch Date & Time (IST)
              </label>
              <input
                type="datetime-local"
                value={dropDate}
                onChange={(e) => setDropDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-[#E67E44]"
              />
            </div>
          </div>
        </div>

        {/* VIP Gatekeeper */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                VIP Early Access Gatekeeper
              </h4>
            </div>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setIsVipLocked(!isVipLocked);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                isVipLocked
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {isVipLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{isVipLocked ? 'VIP GATE LOCKED' : 'PUBLICLY ACCESSIBLE'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-white/50 mb-1">
                Exclusive VIP Passcode
              </label>
              <input
                type="text"
                value={vipPasscode}
                onChange={(e) => setVipPasscode(e.target.value.toUpperCase())}
                placeholder="e.g. NOMAD1992"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase text-white outline-none focus:border-[#E67E44] tracking-widest font-bold"
              />
              <span className="text-[10px] font-mono text-white/40 block mt-1">
                Share with Instagram VIP subscribers for 1-hour early acquisition window.
              </span>
            </div>

            <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 space-y-1.5 text-xs font-mono">
              <span className="text-[10px] text-white/50 uppercase font-bold block">Live Status</span>
              <p className="text-[11px] text-white/80">
                {isVipLocked
                  ? 'Shoppers attempting to view Drop #24 before launch time will be asked for the passcode.'
                  : 'Anyone can browse and acquire Drop #24 pieces immediately.'}
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-6 py-3 bg-[#E67E44] hover:bg-[#d57038] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#E67E44]/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Launch Configuration</span>
          </button>

          {savedToast && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-4 h-4" />
              <span>Configuration successfully saved to database!</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
