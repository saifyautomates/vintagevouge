import React, { useState } from 'react';
import { X, Trash2, ShieldCheck, ArrowRight, ShoppingBag, Plus, Minus, CheckCircle, Truck, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    formatPrice,
    clearCart,
    freeShippingThreshold,
    currency,
  } = useCart();

  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'VOGUE10') {
      setDiscountApplied(true);
    }
  };

  const discountAmount = discountApplied ? subtotal * 0.1 : 0;
  const finalSubtotal = subtotal - discountAmount;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleCheckout = () => {
    setCheckoutComplete(true);
    setTimeout(() => {
      clearCart();
      setCheckoutComplete(false);
      setIsCartOpen(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/65 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-md sm:max-w-lg bg-[#FAF7F2] border-l border-[#181513]/20 h-full flex flex-col shadow-2xl animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#181513]/10 flex justify-between items-center bg-[#EFE7DB]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#E67E44]" />
            <h3 className="font-mono text-xs tracking-widest-plus uppercase font-bold text-[#181513]">
              ACQUISITION BAG ({cart.length})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#181513] hover:bg-[#181513]/10 transition-colors"
            aria-label="Close Bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter (Indian Ecom Standard) */}
        {cart.length > 0 && !checkoutComplete && (
          <div className="px-6 py-3 bg-[#EAE2D3] border-b border-[#181513]/10 text-xs font-mono">
            <div className="flex justify-between items-center mb-1 text-[11px]">
              <span className="flex items-center gap-1.5 font-bold text-[#181513]">
                <Truck className="w-3.5 h-3.5 text-[#E67E44]" />
                {isFreeShipping ? (
                  <span className="text-[#2D5A3F]">🎉 Unlocked Free Pan-India Express Delivery!</span>
                ) : (
                  <span>Add {formatPrice(amountNeededForFreeShipping)} more for Free Delivery</span>
                )}
              </span>
              <span className="text-[#5C564E]">{shippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#181513]/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#E67E44] transition-all duration-500 rounded-full"
                style={{ width: `${shippingProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Checkout Success Screen */}
        {checkoutComplete ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#2D5A3F]/10 text-[#2D5A3F] flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-3xl font-bold text-[#181513]">
              1-of-1 Piece Reserved!
            </h4>
            <p className="font-sans text-xs text-[#5C564E] max-w-xs leading-relaxed">
              Your Vintage Vogue order has been registered. Our fulfillment team in Rajasthan will steam sanitize, pack with custom vintage wax seal, and dispatch via Blue Dart / Delhivery Express.
            </p>
            <div className="font-mono text-[10px] text-[#8C857B] pt-2">
              ORDER TRACKING ID: #VV-IND-{Math.floor(100000 + Math.random() * 900000)}
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Bag State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#EFE7DB] border border-[#181513]/10 flex items-center justify-center text-[#8C857B]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="font-serif italic text-2xl text-[#5C564E]">
              Your acquisition bag is empty.
            </p>
            <p className="font-sans text-xs text-[#8C857B] max-w-xs leading-relaxed">
              Every drop piece is 1-of-1. Once another customer claims a piece, it enters the permanent archive.
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-2 px-6 py-2.5 bg-[#181513] text-white font-mono text-xs tracking-widest uppercase hover:bg-[#E67E44] transition-colors"
            >
              Browse Drop #24
            </button>
          </div>
        ) : (
          /* Cart Items List */
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#181513]/10 space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-[#EAE3D4] border border-[#181513]/10 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[10px] text-[#E67E44] tracking-wider font-bold">
                        1-OF-1 • {item.product.size}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#8C857B] hover:text-[#8E2B2B] transition-colors"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-serif text-base font-bold text-[#181513] truncate">
                      {item.product.title}
                    </h4>

                    <div className="text-[10px] font-mono text-[#5C564E]">
                      {item.product.conditionRating} • {item.product.measurements.pitToPit.split('/')[0]} Chest
                    </div>

                    {/* Quantity & Unit Price */}
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center border border-[#181513]/20 bg-[#FAF7F2]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs hover:bg-[#EFE7DB] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs hover:bg-[#EFE7DB] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif text-lg font-bold text-[#181513]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code & Checkout Footer */}
            <div className="border-t border-[#181513]/15 bg-[#EFE7DB] p-6 space-y-4">
              {/* Promo input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Drop Promo (try: VOGUE10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-[#FAF7F2] border border-[#181513]/20 px-3 py-1.5 text-xs font-mono uppercase tracking-wider outline-none focus:border-[#E67E44]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#181513] text-[#FAF7F2] text-[10px] font-mono tracking-widest uppercase hover:bg-[#E67E44] transition-colors"
                >
                  Apply
                </button>
              </form>

              {discountApplied && (
                <div className="text-xs font-mono text-[#2D5A3F] flex items-center justify-between">
                  <span>Vintage Vogue Insider Courtesy (10% Off)</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}

              {/* Summary Rows */}
              <div className="space-y-1.5 text-xs font-mono text-[#5C564E]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#181513]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pan-India Express Shipping</span>
                  <span className={isFreeShipping ? "text-[#2D5A3F] font-semibold" : "text-[#181513]"}>
                    {isFreeShipping ? "FREE" : formatPrice(199)}
                  </span>
                </div>
                <div className="flex justify-between text-base pt-2 border-t border-[#181513]/10 font-serif">
                  <span className="font-bold text-[#181513]">Total Amount</span>
                  <span className="font-bold text-[#181513] text-2xl font-serif">
                    {formatPrice(finalSubtotal + (isFreeShipping ? 0 : 199))}
                  </span>
                </div>
              </div>

              {/* Checkout CTAs */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-[#181513] hover:bg-[#E67E44] text-[#FAF7F2] text-xs font-mono tracking-widest-plus uppercase flex items-center justify-center gap-2 transition-colors duration-200 shadow-lg group"
                >
                  <span>PROCEED TO INSTANT CHECKOUT</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Direct WhatsApp Order Option */}
                <a
                  href={`https://wa.me/919876543210?text=Hello%20Vintage%20Vogue!%20I%20would%20like%20to%20order%20the%20following%201-of-1%20pieces:%20${cart.map(c => c.product.title).join(', ')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-[11px] font-mono tracking-wider uppercase flex items-center justify-center gap-2 border border-[#25D366]/30 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Order via WhatsApp Direct</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#8C857B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A3F]" />
                <span>Encrypted Razorpay UPI / Cards • 100% Authentic Guaranteed</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
