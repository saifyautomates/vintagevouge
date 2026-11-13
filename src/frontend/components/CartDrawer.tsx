import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle,
  Truck,
  MessageCircle,
  Clock,
  Lock,
  Sparkles,
  Tag,
  MapPin,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { playClickSound, playSuccessChime, playHoverSound } from '../utils/audio';
import { productRepository } from '../../database/repositories/productRepository';
import { Product } from '../types';
import { CouponRecord } from '../../database/schema';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    addToCart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    subtotal,
    formatPrice,
    freeShippingThreshold,
    openCheckout,
    showToast,
    toggleWishlist,
    setSelectedProduct,
    appliedCoupon,
    setAppliedCoupon,
    discountAmount,
  } = useCart();
  const { coupons } = useStore();

  const [promoCode, setPromoCode] = useState(appliedCoupon?.code || '');
  const [pincode, setPincode] = useState('');
  const [pincodeCity, setPincodeCity] = useState<string | null>(null);
  const [waxSealGift, setWaxSealGift] = useState(true);
  const [holdSeconds, setHoldSeconds] = useState(600); // 10 minutes hold

  // Auto-apply promo from URL parameter (?promo=VIP500)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const promo = params.get('promo');
    if (promo && coupons && coupons.length > 0) {
      const match = coupons.find(c => c.code.toLowerCase() === promo.trim().toLowerCase() && c.active);
      if (match) {
        setAppliedCoupon(match);
        setPromoCode(match.code);
      }
    }
  }, [coupons]);

  const cartProductIds = new Set(cart.map((c) => c.product.id));
  const primaryCartItem = cart[0]?.product;
  const pairedRecommendations = primaryCartItem
    ? productRepository
        .getRecommendations(primaryCartItem.id, 4)
        .filter((p) => !cartProductIds.has(p.id))
    : [];

  // Live Cart Hold Countdown Timer (Scarcity & Urgency)
  useEffect(() => {
    if (!isCartOpen || cart.length === 0) return;
    const timer = setInterval(() => {
      setHoldSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isCartOpen, cart.length]);

  // Escape key handler for smooth UX
  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    const match = coupons.find((c) => c.code.toUpperCase() === clean && c.active);
    if (match) {
      if (match.minOrderValue && subtotal < match.minOrderValue) {
        showToast(`Min order for [${match.code}] is ${formatPrice(match.minOrderValue)}`);
        return;
      }
      playSuccessChime();
      setAppliedCoupon(match);
      showToast(`VIP Promo [${match.code}] Applied!`);
    } else {
      showToast('Invalid or inactive promo code.');
    }
  };

  const handlePincodeChange = (pin: string) => {
    setPincode(pin);
    if (pin.length === 6) {
      if (pin.startsWith('324')) setPincodeCity('Kota Hub (Same-Day / Next-Day Delivery)');
      else if (pin.startsWith('110')) setPincodeCity('Delhi NCR (24–48h Blue Dart Express)');
      else if (pin.startsWith('400')) setPincodeCity('Mumbai (2-Day Blue Dart Express)');
      else if (pin.startsWith('560')) setPincodeCity('Bengaluru (2-Day Blue Dart Express)');
      else if (pin.startsWith('302')) setPincodeCity('Jaipur (24–48h Blue Dart Express)');
      else setPincodeCity('All-India Serviceable (2–4 Days)');
    } else {
      setPincodeCity(null);
    }
  };

  const finalSubtotal = Math.max(0, subtotal - discountAmount);
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      onClick={() => setIsCartOpen(false)} 
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-fadeIn"
    >
      <div 
        className="w-full max-w-md sm:max-w-lg bg-[#FAF7F2] border-l border-[#181513]/20 h-full flex flex-col shadow-2xl animate-slideLeft text-[#181513]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#181513]/10 flex justify-between items-center bg-[#EFE7DB]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#A65B32]" />
            <h3 className="font-mono text-xs tracking-widest-plus uppercase font-bold text-[#181513]">
              ACQUISITION BAG ({cart.length})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#181513] hover:bg-[#181513]/10 transition-colors rounded-lg"
            aria-label="Close Bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10-Minute Cart Hold Urgency Timer */}
        {cart.length > 0 && (
          <div className={`px-6 py-2 flex items-center justify-between text-[11px] font-mono border-b border-white/10 ${
            holdSeconds === 0
              ? 'bg-red-950 text-red-200'
              : holdSeconds < 120
              ? 'bg-amber-950 text-amber-200 animate-pulse'
              : 'bg-[#181513] text-[#FAF7F2]'
          }`}>
            <div className="flex items-center gap-1.5 font-bold">
              <Clock className={`w-3.5 h-3.5 ${holdSeconds === 0 ? 'text-red-400' : 'text-[#C4975A] animate-spin'}`} />
              <span>
                {holdSeconds === 0 ? 'HOLD LAPSED INTO OPEN POOL:' : '1-OF-1 SPECIMEN HOLD:'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-bold font-mono tracking-wider ${
                holdSeconds === 0 ? 'text-red-400 font-extrabold' : 'text-amber-300'
              }`}>
                {formatTimer(holdSeconds)}
              </span>
              {holdSeconds === 0 ? (
                <button
                  onClick={() => {
                    playSuccessChime();
                    setHoldSeconds(600);
                    showToast('Archival reservation extended for 10 minutes.');
                  }}
                  className="px-2 py-0.5 bg-[#A65B32] text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#8B2635] transition-colors"
                >
                  Extend +10m
                </button>
              ) : (
                <span className="text-[9px] text-white/50 hidden sm:inline">until release</span>
              )}
            </div>
          </div>
        )}

        {/* Free Shipping Progress Meter (Indian Ecom Standard) */}
        {cart.length > 0 && (
          <div className="px-6 py-3 bg-[#EAE2D3] border-b border-[#181513]/10 text-xs font-mono">
            <div className="flex justify-between items-center mb-1 text-[11px]">
              <span className="flex items-center gap-1.5 font-bold text-[#181513]">
                <Truck className="w-3.5 h-3.5 text-[#A65B32]" />
                {isFreeShipping ? (
                  <span className="text-[#2D5A3F] font-bold">🎉 Unlocked Free Pan-India Express Delivery!</span>
                ) : (
                  <span>Add {formatPrice(amountNeededForFreeShipping)} more for Free Express Delivery</span>
                )}
              </span>
              <span className="text-[#5C564E]">{shippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#181513]/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#A65B32] to-emerald-600 transition-all duration-500 rounded-full"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Bag Content */}
        {cart.length === 0 ? (
          /* Empty Bag State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EFE7DB] border border-[#181513]/10 flex items-center justify-center text-[#8C857B]">
              <ShoppingBag className="w-7 h-7 text-[#A65B32]" />
            </div>
            <p className="font-serif italic text-2xl text-[#5C564E]">
              Your acquisition bag is empty.
            </p>
            <p className="font-sans text-xs text-[#8C857B] max-w-xs leading-relaxed">
              Every drop piece is an authentic 1-of-1 archival specimen. Once another collector claims a piece, it enters the permanent archive vault.
            </p>
            <button
              onClick={() => {
                playClickSound();
                setIsCartOpen(false);
                const el = document.getElementById('archive-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-2 px-6 py-2.5 bg-[#181513] text-white font-mono text-xs tracking-widest uppercase hover:bg-[#A65B32] transition-colors rounded-lg shadow-md"
            >
              Browse Drop #24 Catalog
            </button>
          </div>
        ) : (
          /* Cart Items List */
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#181513]/10 space-y-4">
              {cart.map((item) => {
                const isOutOfStock = !item.product.inStock || holdSeconds === 0;

                return (
                  <div 
                    key={item.product.id} 
                    className={`pt-4 first:pt-0 flex gap-4 items-start transition-all ${
                      isOutOfStock ? 'opacity-85 bg-red-50/50 -mx-3 px-3 py-3 rounded-xl border border-red-200/60' : ''
                    }`}
                  >
                    {/* Thumbnail with Out-of-Stock Overlay */}
                    <div className="w-20 h-24 bg-[#EAE3D4] border border-[#181513]/10 flex-shrink-0 overflow-hidden rounded relative">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/assets/images/boxy-embroidered-shirt.jpg';
                        }}
                        className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale contrast-75' : ''}`}
                      />
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-red-950/70 flex items-center justify-center p-1 text-center">
                          <span className="text-[9px] font-mono font-bold text-white uppercase tracking-wider leading-tight">
                            OUT OF STOCK
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start">
                        <span className={`font-mono text-[10px] tracking-wider font-bold ${
                          isOutOfStock ? 'text-red-600' : 'text-[#A65B32]'
                        }`}>
                          {isOutOfStock ? '⚠️ HOLD LAPSED • 1-OF-1' : `1-OF-1 • ${item.product.size}`}
                        </span>
                        <button
                          onClick={() => {
                            playClickSound();
                            removeFromCart(item.product.id);
                          }}
                          className="text-[#6B6358] hover:text-[#8E2B2B] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center p-1"
                          title="Remove piece"
                          aria-label="Remove piece"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className={`font-serif text-base font-bold truncate ${
                        isOutOfStock ? 'text-[#5C564E] line-through' : 'text-[#181513]'
                      }`}>
                        {item.product.title}
                      </h4>

                      <div className="text-[10px] font-mono text-[#5C564E]">
                        {item.product.conditionRating} • {item.product.measurements.pitToPit.split('/')[0]} Chest
                      </div>

                      {/* Amazon/Flipkart Out-of-stock Notice & Quick Action Buttons */}
                      {isOutOfStock ? (
                        <div className="pt-2 space-y-2">
                          <p className="text-[10px] font-mono text-red-700 leading-snug">
                            {holdSeconds === 0
                              ? 'Your 10-minute hold expired. Item released to public catalog.'
                              : 'This specimen was claimed by another collector.'}
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            {item.product.inStock && holdSeconds === 0 && (
                              <button
                                onClick={() => {
                                  playSuccessChime();
                                  setHoldSeconds(600);
                                  showToast('Re-reserved specimen for 10 minutes!');
                                }}
                                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-colors"
                              >
                                Re-Reserve (+10m)
                              </button>
                            )}
                            <button
                              onClick={() => {
                                playClickSound();
                                toggleWishlist(item.product.id);
                                removeFromCart(item.product.id);
                                showToast('Moved specimen to your saved wishlist.');
                              }}
                              className="px-2.5 py-1 bg-[#181513] hover:bg-[#A65B32] text-white rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-colors"
                            >
                              Move to Wishlist
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* In-Stock Tag & Unit Price */
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-[10px] font-mono font-bold text-[#A65B32] bg-[#A65B32]/10 border border-[#A65B32]/25 px-2 py-0.5 rounded">
                            1-OF-1 SPECIMEN (QTY: 1)
                          </span>

                          <span className="font-serif text-lg font-bold text-[#181513]">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Curator's Archival Pairing Recommendations */}
              {pairedRecommendations.length > 0 && (
                <div className="pt-6 mt-4 border-t border-[#181513]/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] font-bold text-[#A65B32] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#C4975A]" />
                      CURATOR'S ARCHIVAL PAIRING
                    </span>
                    <span className="text-[10px] font-mono text-[#5C564E]">Drop #24 Aesthetic Match</span>
                  </div>

                  <div className="space-y-2.5">
                    {pairedRecommendations.slice(0, 2).map((rec) => (
                      <div
                        key={rec.id}
                        className="p-2.5 bg-[#FAF7F2] border border-[#181513]/15 rounded-lg flex items-center justify-between gap-3 group hover:border-[#A65B32] transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={rec.images[0]}
                            alt={rec.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/assets/images/boxy-embroidered-shirt.jpg';
                            }}
                            className="w-10 h-12 object-cover rounded bg-[#EAE3D4] flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="font-serif text-xs font-bold text-[#181513] truncate">
                              {rec.title}
                            </h5>
                            <div className="text-[10px] font-mono text-[#5C564E]">
                              {rec.size} • {formatPrice(rec.price)}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            playClickSound();
                            addToCart(rec);
                          }}
                          className="px-2.5 py-1.5 bg-[#181513] hover:bg-[#A65B32] text-white text-[10px] font-mono uppercase font-bold tracking-wider rounded transition-colors whitespace-nowrap flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Claim 1-of-1</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Packaging, Promo Code & Calculations Footer */}
            <div className="border-t border-[#181513]/15 bg-[#EFE7DB] p-5 sm:p-6 space-y-4">
              
              {/* Pincode Quick Delivery Estimator */}
              <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#181513]/15 space-y-1 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#A65B32]" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Check Pincode (e.g. 324002)"
                    value={pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    className="w-full bg-transparent outline-none text-xs font-mono placeholder:text-[#5C564E]/60 text-[#181513]"
                  />
                </div>
                {pincodeCity && (
                  <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 pt-0.5">
                    <Check className="w-3 h-3" />
                    <span>{pincodeCity}</span>
                  </div>
                )}
              </div>

              {/* Complimentary Wax Seal Gift Wrapping Toggle */}
              <div 
                onClick={() => setWaxSealGift(!waxSealGift)}
                className="flex items-center justify-between text-xs font-mono p-2.5 bg-[#FAF7F2] rounded-lg border border-[#181513]/15 cursor-pointer hover:border-[#A65B32] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#991B1B]" />
                  <span className="text-[11px] font-medium text-[#181513]">
                    Hand-Stamped Crimson Wax Seal Packaging
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {waxSealGift ? 'INCLUDED' : 'OMIT'}
                </span>
              </div>

              {/* Promo input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5C564E]" />
                  <input
                    type="text"
                    placeholder="Promo (VOGUE10 / KOTA24)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#181513]/20 pl-9 pr-3 py-1.5 text-xs font-mono uppercase tracking-wider outline-none focus:border-[#A65B32] rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#181513] text-[#FAF7F2] text-[10px] font-mono tracking-widest uppercase hover:bg-[#A65B32] transition-colors rounded font-bold"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="text-xs font-mono text-[#2D5A3F] flex items-center justify-between font-bold bg-[#2D5A3F]/10 p-2 rounded">
                  <span>
                    VIP Privilege [{appliedCoupon.code}] — {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% Off` : `₹${appliedCoupon.discountValue} Off`}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>- {formatPrice(discountAmount)}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setPromoCode('');
                      }}
                      className="text-red-700 hover:text-red-900 text-[10px] uppercase font-bold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Summary Rows */}
              <div className="space-y-1.5 text-xs font-mono text-[#5C564E]">
                <div className="flex justify-between">
                  <span>Specimens Subtotal</span>
                  <span className="font-bold text-[#181513]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Blue Dart Express Air (Pan-India)</span>
                  <span className={isFreeShipping ? "text-[#2D5A3F] font-bold" : "text-[#181513]"}>
                    {isFreeShipping ? "FREE" : formatPrice(199)}
                  </span>
                </div>
                <div className="flex justify-between text-base pt-2 border-t border-[#181513]/10 font-serif">
                  <span className="font-bold text-[#181513]">Total Amount (₹ INR)</span>
                  <span className="font-bold text-[#181513] text-2xl font-serif">
                    {formatPrice(finalSubtotal + (isFreeShipping ? 0 : 199))}
                  </span>
                </div>
              </div>

              {/* Checkout CTAs with 1-Click Auto-Renewal */}
              <div className="space-y-2">
                {cart.some(item => !item.product.inStock) ? (
                  <button
                    disabled
                    className="w-full py-4 bg-red-950/80 text-red-200 text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-2 rounded-sm font-bold cursor-not-allowed border border-red-500/40"
                  >
                    <span>CANNOT CHECKOUT • REMOVE CLAIMED SPECIMEN</span>
                  </button>
                ) : holdSeconds === 0 ? (
                  <button
                    onClick={() => {
                      playClickSound();
                      setHoldSeconds(600);
                      openCheckout();
                    }}
                    className="w-full py-4 bg-[#A65B32] hover:bg-[#8E4B27] text-white text-xs font-mono tracking-widest-plus uppercase flex items-center justify-center gap-2 rounded-sm font-bold shadow-xl animate-pulse btn-press"
                  >
                    <Clock className="w-4 h-4" />
                    <span>RE-RESERVE HOLD (+10M) & CHECKOUT</span>
                  </button>
                ) : (
                  <button
                    data-cursor="CLAIM"
                    onClick={() => {
                      playClickSound();
                      openCheckout();
                    }}
                    className="w-full py-4 bg-[#181513] hover:bg-[#A65B32] text-[#FAF7F2] text-xs font-mono tracking-widest-plus uppercase flex items-center justify-center gap-2 transition-all duration-200 shadow-xl group rounded-sm font-bold btn-press"
                  >
                    <span>PROCEED TO INSTANT CHECKOUT</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}

                {/* Direct WhatsApp Order Option */}
                <a
                  href={`https://wa.me/919829012345?text=${encodeURIComponent(
                    `Hello Vintage Vogue Studio! I would like to order the following 1-of-1 pieces from my bag:\n${cart
                      .map((c) => `• [${c.product.referenceCode}] ${c.product.title} (${formatPrice(c.product.price)})`)
                      .join('\n')}\nSubtotal: ${formatPrice(finalSubtotal)}\nPlease send delivery confirmation for my pincode: ${pincode || 'India'}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-[11px] font-mono tracking-wider uppercase flex items-center justify-center gap-2 border border-[#25D366]/30 transition-colors rounded-sm font-medium btn-press"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Order via WhatsApp Direct (+91 98290 12345)</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#6B6358]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A3F]" />
                <span>Encrypted Bharat UPI / Cards • 100% Authentic Guaranteed</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
