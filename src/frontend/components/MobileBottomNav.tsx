import React from 'react';
import { ShoppingBag, Search, Heart, Ruler, Sparkles, Compass } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { playClickSound } from '../utils/audio';

interface MobileBottomNavProps {
  onOpenCommandPalette: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenCommandPalette }) => {
  const { totalItems, setIsCartOpen, wishlist, setIsFitAdvisorOpen } = useCart();

  const handleScrollToArchive = () => {
    playClickSound();
    const el = document.getElementById('archive-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-40 animate-slideUp">
      <nav className="bg-[#181513]/92 backdrop-blur-xl border border-white/15 rounded-2xl p-1.5 shadow-2xl flex items-center justify-around text-[#FAF7F2] font-mono text-[9px] uppercase tracking-wider">
        {/* Archive Button */}
        <button
          onClick={handleScrollToArchive}
          className="flex-1 py-1.5 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors"
        >
          <Sparkles className="w-4 h-4 text-[#E67E44]" />
          <span>Archive</span>
        </button>

        {/* Fit Advisor Button */}
        <button
          onClick={() => {
            playClickSound();
            setIsFitAdvisorOpen(true);
          }}
          className="flex-1 py-1.5 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors"
        >
          <Ruler className="w-4 h-4 text-[#C4975A]" />
          <span>Fit Advisor</span>
        </button>

        {/* Search / Command Palette (⌘K) */}
        <button
          onClick={() => {
            playClickSound();
            onOpenCommandPalette();
          }}
          className="flex-1 py-1.5 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors"
        >
          <Search className="w-4 h-4 text-white" />
          <span>Search</span>
        </button>

        {/* Saved Wishlist */}
        <button
          onClick={handleScrollToArchive}
          className="flex-1 py-1.5 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors relative"
        >
          <div className="relative">
            <Heart className="w-4 h-4 text-[#E67E44]" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-[#E67E44] text-white rounded-full text-[8px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span>Saved</span>
        </button>

        {/* Acquisition Bag */}
        <button
          onClick={() => {
            playClickSound();
            setIsCartOpen(true);
          }}
          className="flex-1 py-1.5 bg-[#E67E44] text-white rounded-xl flex flex-col items-center gap-1 font-bold shadow-lg shadow-[#E67E44]/25"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-white text-[#181513] rounded-full text-[8px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <span>Bag ({totalItems})</span>
        </button>
      </nav>
    </div>
  );
};

