import React, { useState, useEffect } from 'react';
import { Bell, Flame, Globe, Instagram } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const DropCountdownRibbon: React.FC = () => {
  const { currency, setCurrency, setIsDropModalOpen } = useCart();
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 36,
    seconds: 42
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="bg-[#181513] text-[#FAF7F2] py-2 px-4 sm:px-8 border-b border-[#FAF7F2]/10 font-mono text-[11px] tracking-widest uppercase flex flex-wrap justify-between items-center gap-2 relative z-50">
      {/* Left: Live Drop Countdown */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-[#E67E44] font-bold">
          <Flame className="w-3.5 h-3.5 animate-bounce" />
          <span>DROP #24 LIVE IN:</span>
        </span>
        <span className="bg-[#241F1B] px-2 py-0.5 border border-[#FAF7F2]/15 text-[#FAF7F2] font-bold font-mono tracking-wider">
          {pad(timeLeft.days)}D : {pad(timeLeft.hours)}H : {pad(timeLeft.minutes)}M : {pad(timeLeft.seconds)}S
        </span>
        <button
          onClick={() => setIsDropModalOpen(true)}
          className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-[#C4975A] hover:text-white underline underline-offset-4 transition-colors"
        >
          <Bell className="w-3 h-3" /> Get Drop Alert
        </button>
      </div>

      {/* Center: Brand Pill for 1-of-1 Vintage */}
      <div className="hidden lg:flex items-center gap-2 text-[#FAF7F2]/75 text-[10px]">
        <span>ALL SPECIMENS 1-OF-1 AUTHENTICATED ARCHIVE</span>
        <span>•</span>
        <span>NO RESTOCKS EVER</span>
      </div>

      {/* Right: Instagram Direct & Indian Rupee Badge */}
      <div className="flex items-center gap-3 ml-auto">
        <a
          href="https://www.instagram.com/vintagevoguee_in/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[10px] text-[#FAF7F2]/90 hover:text-[#C4975A] transition-colors font-mono font-bold"
        >
          <Instagram className="w-3.5 h-3.5 text-[#C4975A]" />
          <span>@VINTAGEVOGUEE_IN</span>
        </a>

        <span className="text-[#FAF7F2]/25">|</span>

        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#FAF7F2]/90">
          <span className="px-1.5 py-0.5 rounded bg-[#E67E44]/20 border border-[#E67E44]/50 text-[#E67E44] font-bold">
            ₹ INR ONLY
          </span>
          <span className="hidden sm:inline text-white/50">KOTA, RAJASTHAN</span>
        </div>
      </div>
    </div>
  );
};

