import React, { useEffect, useState } from 'react';
import { X, Sparkles, Clock, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { playClickSound, playSuccessChime } from '../utils/audio';

export const ExitIntentModal: React.FC = () => {
  const {
    isExitIntentOpen,
    setIsExitIntentOpen,
    cart,
    recentlyViewed,
    formatPrice,
    openCheckout,
    setIsCartOpen,
    showToast,
    setAppliedCoupon,
  } = useCart();

  const [hasDismissed, setHasDismissed] = useState(false);

  // Detect exit intent: cursor moves to the very top edge of the window
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger if user moves cursor near the top bar (closing tab/navigating away)
      if (e.clientY <= 12 && !hasDismissed) {
        const alreadyPrompted = sessionStorage.getItem('vv_exit_intent_shown');
        if (!alreadyPrompted) {
          setIsExitIntentOpen(true);
          sessionStorage.setItem('vv_exit_intent_shown', 'true');
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasDismissed, setIsExitIntentOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isExitIntentOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExitIntentOpen(false);
        setHasDismissed(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExitIntentOpen, setIsExitIntentOpen]);

  if (!isExitIntentOpen) return null;

  const featuredItem = cart.length > 0 ? cart[0].product : (recentlyViewed.length > 0 ? recentlyViewed[0] : null);

  const handleApplyPrivilege = () => {
    playSuccessChime();
    setAppliedCoupon({
      id: 'coupon-kota24',
      code: 'KOTA24',
      discountType: 'flat',
      discountValue: 500,
      minOrderValue: 1500,
      active: true,
      notes: 'Kota Atelier Patron Flat ₹500 Privilege',
      createdAt: new Date().toISOString(),
    });
    setIsExitIntentOpen(false);
    showToast('Applied Kota Atelier ₹500 Privilege (KOTA24)!');
    setIsCartOpen(true);
  };

  return (
    <div
      onClick={() => {
        setIsExitIntentOpen(false);
        setHasDismissed(true);
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        className="relative bg-[#FAF7F2] border border-[#181513]/30 max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden animate-scaleUp text-[#181513]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-[#181513] text-[#FAF7F2] px-6 py-3 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#E67E44] font-bold">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>ARCHIVAL HOLD EXPIRING SOON</span>
          </div>
          <button
            onClick={() => {
              playClickSound();
              setIsExitIntentOpen(false);
              setHasDismissed(true);
            }}
            className="text-white/60 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Dismiss offer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E67E44]/15 border border-[#E67E44]/30 rounded-full text-[10px] font-mono font-bold text-[#E67E44] uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Patron Retention Privilege
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#181513]">
              Before you step away...
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#5C564E] leading-relaxed">
              Every curated piece in Drop #24 is strictly <strong>1-of-1</strong>. Once another collector acquires it, this specimen will never be available again.
            </p>
          </div>

          {/* Featured Item Preview */}
          {featuredItem && (
            <div className="flex gap-4 p-3 bg-[#EFE7DB] rounded-xl border border-[#181513]/10 items-center">
              <div className="w-16 h-20 bg-[#EAE3D4] rounded-lg overflow-hidden border border-[#181513]/10 flex-shrink-0">
                <img
                  src={featuredItem.images[0]}
                  alt={featuredItem.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/images/boxy-embroidered-shirt.jpg';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="text-[10px] font-mono text-[#E67E44] font-bold">
                  [{featuredItem.referenceCode}] • {featuredItem.size}
                </div>
                <h4 className="font-serif text-sm font-bold text-[#181513] truncate">
                  {featuredItem.title}
                </h4>
                <div className="text-xs font-mono font-bold text-[#181513]">
                  {formatPrice(featuredItem.price)}
                </div>
              </div>
            </div>
          )}

          {/* Special Offer Box */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-900">
              <Tag className="w-4 h-4 text-[#E67E44]" />
              <span>UNLOCKED: ₹500 ATELIER PRIVILEGE</span>
            </div>
            <p className="text-[11px] font-mono text-amber-800 leading-snug">
              Apply code <strong className="bg-white/80 px-1.5 py-0.5 rounded border border-amber-300 font-bold">KOTA24</strong> at checkout for flat ₹500 off your order.
            </p>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleApplyPrivilege}
              className="w-full py-3.5 bg-[#181513] hover:bg-[#E67E44] text-[#FAF7F2] text-xs font-mono tracking-widest uppercase flex items-center justify-center gap-2 font-bold rounded-xl shadow-lg transition-all btn-press"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>CLAIM ₹500 & SECURE SPECIMEN</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                playClickSound();
                setIsExitIntentOpen(false);
                setHasDismissed(true);
              }}
              className="w-full text-center text-[11px] font-mono text-[#8C857B] hover:text-[#181513] underline transition-colors"
            >
              I will risk losing this 1-of-1 piece to another patron
            </button>
          </div>

          {/* Trust Footer */}
          <div className="pt-2 border-t border-[#181513]/10 flex items-center justify-center gap-2 text-[10px] font-mono text-[#8C857B]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A3F]" />
            <span>Guaranteed Authentic • Direct from Kota Flagship Studio</span>
          </div>
        </div>
      </div>
    </div>
  );
};

