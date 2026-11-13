import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  Smartphone,
  CreditCard,
  ShieldCheck,
  Globe,
  Volume2,
  VolumeX,
  X,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Tag
} from 'lucide-react';
import { useStore, ViewMode } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { playClickSound, playHoverSound, playSuccessChime } from '../utils/audio';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (category: any) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
}) => {
  const { products, setViewMode, isVinylAudioOn, toggleVinylAudio } = useStore();
  const { setSelectedProduct, addToCart, formatPrice, setCurrency, currency, setIsFitAdvisorOpen } = useCart();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          playClickSound();
          // parent handles toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filtered products
  const matchedProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.referenceCode.toLowerCase().includes(query.toLowerCase()) ||
      p.era.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  // Quick Action Commands
  const actions: { id: string; label: string; icon: any; action: () => void; category: string }[] = [
    {
      id: 'storefront',
      label: 'Switch to Editorial Storefront View',
      icon: Globe,
      category: 'Views',
      action: () => {
        setViewMode('storefront');
        onClose();
      },
    },
    {
      id: 'mobile-app',
      label: 'Switch to Mobile WebApp View (iPhone Frame)',
      icon: Smartphone,
      category: 'Views',
      action: () => {
        setViewMode('mobile-app');
        onClose();
      },
    },
    {
      id: 'pos',
      label: 'Open In-Store POS Register (Rajasthan Counter)',
      icon: CreditCard,
      category: 'Omnichannel',
      action: () => {
        setViewMode('pos');
        onClose();
      },
    },
    {
      id: 'admin',
      label: 'Open Admin Command Center (Inventory & Drops)',
      icon: ShieldCheck,
      category: 'Omnichannel',
      action: () => {
        setViewMode('admin');
        onClose();
      },
    },
    {
      id: 'audio-toggle',
      label: isVinylAudioOn ? 'Mute Lo-Fi Vinyl Crackle Ambient' : 'Enable Lo-Fi Vinyl Crackle Ambient',
      icon: isVinylAudioOn ? VolumeX : Volume2,
      category: 'Sensory',
      action: () => {
        toggleVinylAudio();
        onClose();
      },
    },
    {
      id: 'fit-advisor',
      label: 'Open Archival Silhouette & Fit Advisor (Body Calibration)',
      icon: Sparkles,
      category: 'Sizing',
      action: () => {
        setIsFitAdvisorOpen(true);
        onClose();
      },
    },
    {
      id: 'curr-inr',
      label: '100% Indian Rupee (₹ INR) Pricing • Zero Surcharge',
      icon: Tag,
      category: 'Currency',
      action: () => {
        setCurrency('INR');
        onClose();
      },
    },
  ];

  const matchedActions = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-20 sm:pt-28 px-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#181513] border border-white/20 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden text-[#FAF7F2] font-mono flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#E67E44]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type specimen (e.g. 'VV-D24-01', 'Boxy Shirt') or action..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
          />
          <div className="flex items-center gap-1.5 text-[10px] text-white/50 bg-white/5 px-2 py-1 rounded border border-white/10">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
          <button onClick={onClose} className="p-1 text-white/50 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-none">
          {/* Specimen Results */}
          {matchedProducts.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                Archival Specimens ({matchedProducts.length})
              </div>
              <div className="space-y-1 mt-1">
                {matchedProducts.slice(0, 6).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedProduct(p);
                      onClose();
                    }}
                    onMouseEnter={() => playHoverSound()}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-10 h-12 object-cover rounded border border-white/10 bg-black/40"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#E67E44] text-xs font-bold">{p.referenceCode}</span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-white/10 rounded text-white/70">
                            {p.size}
                          </span>
                          {!p.inStock && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-red-500/20 text-red-400 border border-red-500/30 rounded">
                              CLAIMED
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-serif text-white font-bold group-hover:text-[#E67E44] transition-colors">
                          {p.title}
                        </div>
                        <div className="text-[10px] text-white/50">{p.era}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-white">{formatPrice(p.price)}</div>
                      <span className="text-[10px] text-[#E67E44] flex items-center gap-1 group-hover:underline">
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3 inline" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {matchedActions.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                Quick Navigation & Controls
              </div>
              <div className="space-y-1 mt-1">
                {matchedActions.map((act) => {
                  const Icon = act.icon;
                  return (
                    <div
                      key={act.id}
                      onClick={() => {
                        playClickSound();
                        act.action();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[#E67E44]">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="text-xs text-white/90 group-hover:text-white font-mono">
                          {act.label}
                        </span>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-white/50 uppercase">
                        {act.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {matchedProducts.length === 0 && matchedActions.length === 0 && (
            <div className="p-8 text-center text-white/40 text-xs">
              No matching archival specimen or command found for "{query}".
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[#E67E44]">Vintage Vogue India Omnichannel Engine</span>
        </div>
      </div>
    </div>
  );
};

