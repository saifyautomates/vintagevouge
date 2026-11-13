import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  CheckCircle2,
  QrCode,
  CreditCard,
  Banknote,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  Lock,
  Sparkles,
  MapPin,
  Phone,
  User,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { api } from '../../backend/api/client';
import { OrderRecord } from '../../database/schema';
import { playClickSound, playSuccessChime, playWaxSealStampSound } from '../utils/audio';

export const ExpressCheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    closeCheckout,
    checkoutProduct,
    cart,
    clearCart,
    formatPrice,
    freeShippingThreshold,
    showToast,
    appliedCoupon,
    discountAmount,
  } = useCart();
  const { paymentSettings } = useStore();

  // If a single product was checked out (e.g. from 1-Click Buy), use that; otherwise use cart
  const itemsToCheckout: { product: Product; quantity: number }[] = checkoutProduct
    ? [{ product: checkoutProduct, quantity: 1 }]
    : cart;

  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [clientPincode, setClientPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'GATEWAY' | 'COD'>(() => {
    if (paymentSettings?.enableUpi) return 'UPI';
    if (paymentSettings?.enableRazorpay || paymentSettings?.enableCashfree) return 'GATEWAY';
    return 'COD';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Escape key handler to close checkout
  useEffect(() => {
    if (!isCheckoutModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCheckout();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCheckoutModalOpen, closeCheckout]);

  if (!isCheckoutModalOpen || itemsToCheckout.length === 0) return null;

  const subtotal = itemsToCheckout.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const activeDiscount = checkoutProduct
    ? appliedCoupon
      ? appliedCoupon.discountType === 'percentage'
        ? Math.round(subtotal * (appliedCoupon.discountValue / 100))
        : Math.min(appliedCoupon.discountValue, subtotal)
      : 0
    : discountAmount;

  const isFreeDelivery = subtotal >= freeShippingThreshold;
  const deliveryCharge = isFreeDelivery ? 0 : 199;
  const finalTotal = Math.max(0, subtotal - activeDiscount) + deliveryCharge;

  const upiId = 'vintagevogue@upi';
  const upiPaymentUri = `upi://pay?pa=${upiId}&pn=Vintage%20Vogue%20India&am=${finalTotal}&cu=INR&tn=VV-Archive-Drop24`;

  const handlePincodeChange = (pin: string) => {
    setClientPincode(pin);
    // Auto-fill major Indian hubs for immediate high-conversion UX
    if (pin.startsWith('324')) {
      setClientCity('Kota, Rajasthan');
    } else if (pin.startsWith('110')) {
      setClientCity('New Delhi, NCR');
    } else if (pin.startsWith('400')) {
      setClientCity('Mumbai, Maharashtra');
    } else if (pin.startsWith('560')) {
      setClientCity('Bengaluru, Karnataka');
    } else if (pin.startsWith('302')) {
      setClientCity('Jaipur, Rajasthan');
    } else if (pin.startsWith('700')) {
      setClientCity('Kolkata, West Bengal');
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !clientAddress.trim() || !clientPincode.trim()) {
      showToast('Please fill all dispatch delivery details.');
      return;
    }
    playClickSound();
    setStep('payment');
  };

  const handleExecuteOrder = async () => {
    setIsSubmitting(true);
    try {
      const fullContact = `${clientPhone.trim()} • ${clientAddress.trim()}, ${clientCity || 'India'} - ${clientPincode.trim()}`;
      const result = await api.checkout.process({
        channel: 'Online Store',
        customerName: clientName.trim(),
        customerContact: fullContact,
        productIds: itemsToCheckout.map((i) => i.product.id),
        discountAmount: activeDiscount,
        paymentMethod:
          paymentMethod === 'UPI'
            ? 'UPI (GPay / PhonePe / Paytm)'
            : paymentMethod === 'GATEWAY'
            ? 'Razorpay NetBanking'
            : 'Cash Tender',
      });

      playWaxSealStampSound();
      setTimeout(() => playSuccessChime(), 180);
      setConfirmedOrder(result.order);
      setStep('confirmed');

      // Clear online cart if general cart was checked out
      if (!checkoutProduct) {
        clearCart();
      }
    } catch (err: any) {
      alert(err.message || 'Error processing reservation. Specimen may have just been claimed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopiedUpi(true);
    playClickSound();
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const whatsappDossierUrl = confirmedOrder
    ? `https://wa.me/919829012345?text=${encodeURIComponent(
        `Hello Vintage Vogue! Order Confirmed: #${confirmedOrder.trackingNumber}\nCustomer: ${confirmedOrder.customerName}\nPieces: ${confirmedOrder.items
          .map((i) => `[${i.referenceCode}] ${i.title}`)
          .join(', ')}\nTotal: ₹${confirmedOrder.totalAmount.toLocaleString('en-IN')}\nPlease send Blue Dart tracking dispatch updates.`
      )}`
    : '#';

  return (
    <div 
      onClick={closeCheckout} 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
    >
      <div
        className="relative bg-[#FAF7F2] border border-[#181513]/25 max-w-2xl w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#181513] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#EFE7DB] border-b border-[#181513]/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-[#E67E44]/15 rounded text-[#E67E44]">
              <Lock className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-mono text-xs tracking-widest-plus uppercase font-bold text-[#181513]">
                EXPRESS AIR ACQUISITION • 1-OF-1 ARCHIVE
              </h3>
              <p className="font-sans text-[11px] text-[#5C564E]">
                Direct Dispatch from Sogaria Studio, Kota, Rajasthan – 324002
              </p>
            </div>
          </div>
          <button
            onClick={closeCheckout}
            className="p-1.5 rounded-lg hover:bg-black/10 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5 text-[#181513]" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="bg-[#EAE2D3] px-6 py-2 border-b border-[#181513]/10 flex items-center justify-between text-[11px] font-mono">
          <span className={`flex items-center gap-1.5 font-bold ${step === 'details' ? 'text-[#E67E44]' : 'text-[#2D5A3F]'}`}>
            1. Dispatch Details
          </span>
          <span className="text-[#181513]/25">→</span>
          <span className={`flex items-center gap-1.5 font-bold ${step === 'payment' ? 'text-[#E67E44]' : step === 'confirmed' ? 'text-[#2D5A3F]' : 'text-[#8C857B]'}`}>
            2. Instant Bharat UPI
          </span>
          <span className="text-[#181513]/25">→</span>
          <span className={`flex items-center gap-1.5 font-bold ${step === 'confirmed' ? 'text-[#2D5A3F]' : 'text-[#8C857B]'}`}>
            3. Blue Dart Dispatch
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[78vh] space-y-6">
          {/* STEP 1: DISPATCH DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              {/* Order Items Preview */}
              <div className="bg-[#F4EFE6] border border-[#181513]/10 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono font-bold text-[#5C564E]">
                  <span>SPECIMENS BEING RESERVED ({itemsToCheckout.length})</span>
                  <span className="text-[#E67E44]">STRICT 1-OF-1 ALLOCATION</span>
                </div>
                <div className="divide-y divide-[#181513]/10">
                  {itemsToCheckout.map((item) => (
                    <div key={item.product.id} className="py-2 first:pt-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-12 h-14 object-cover rounded border border-[#181513]/15 flex-shrink-0"
                        />
                        <div>
                          <span className="font-mono text-[10px] text-[#E67E44] font-bold block">
                            [{item.product.referenceCode}] • {item.product.size}
                          </span>
                          <span className="font-serif font-bold text-sm text-[#181513] block">
                            {item.product.title}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-bold text-[#181513]">
                        {formatPrice(item.product.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Dispatch Fields */}
              <div className="space-y-4">
                <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-[#181513] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#E67E44]" />
                  <span>Pan-India Delivery Address</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#5C564E] mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Aryan Sharma"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#181513]/20 rounded-lg px-3.5 py-2.5 text-xs font-sans outline-none focus:border-[#E67E44]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#5C564E] mb-1">
                      WhatsApp Contact * (For Blue Dart Tracking)
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98290 XXXXX"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#181513]/20 rounded-lg px-3.5 py-2.5 text-xs font-mono outline-none focus:border-[#E67E44]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#5C564E] mb-1">
                    Street Address, House/Apartment No. *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 42-B, Civil Lines, Near City Mall"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#181513]/20 rounded-lg px-3.5 py-2.5 text-xs font-sans outline-none focus:border-[#E67E44]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#5C564E] mb-1">
                      Pincode (6-digit) *
                    </label>
                    <input
                      required
                      maxLength={6}
                      type="text"
                      placeholder="e.g. 324002"
                      value={clientPincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#181513]/20 rounded-lg px-3.5 py-2.5 text-xs font-mono outline-none focus:border-[#E67E44]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#5C564E] mb-1">
                      City / State
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kota, Rajasthan"
                      value={clientCity}
                      onChange={(e) => setClientCity(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#181513]/20 rounded-lg px-3.5 py-2.5 text-xs font-sans outline-none focus:border-[#E67E44]"
                    />
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-[#EFE7DB] rounded-xl p-4 space-y-2 text-xs font-mono text-[#5C564E]">
                <div className="flex justify-between">
                  <span>Specimens Subtotal</span>
                  <span className="font-bold text-[#181513]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#E67E44]" />
                    <span>Blue Dart Express Air Delivery</span>
                  </span>
                  <span className={isFreeDelivery ? 'text-[#2D5A3F] font-bold' : 'text-[#181513]'}>
                    {isFreeDelivery ? 'FREE (Over ₹2,999)' : formatPrice(199)}
                  </span>
                </div>
                {activeDiscount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700 font-bold">
                    <span>VIP Privilege {appliedCoupon ? `[${appliedCoupon.code}]` : ''}</span>
                    <span>- {formatPrice(activeDiscount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#181513]/10 flex justify-between items-baseline text-base font-serif">
                  <span className="font-bold text-[#181513]">Total Amount</span>
                  <span className="text-2xl font-bold text-[#181513]">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 bg-[#181513] hover:bg-[#E67E44] text-[#FAF7F2] font-mono text-xs tracking-widest-plus uppercase rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-xl"
              >
                <span>CONTINUE TO PAYMENT ({formatPrice(finalTotal)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="bg-[#F4EFE6] border border-[#181513]/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#5C564E] block">Delivering to</span>
                  <span className="font-bold text-sm text-[#181513] block">{clientName} ({clientPhone})</span>
                  <span className="text-xs text-[#5C564E] block">{clientAddress}, {clientCity} - {clientPincode}</span>
                </div>
                <button
                  onClick={() => setStep('details')}
                  className="text-xs font-mono underline text-[#E67E44] hover:text-[#181513]"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-[#181513]">
                    Select Verified Payment Method
                  </h4>
                  <span className="text-[10px] font-mono text-[#E67E44] font-bold">
                    100% Encrypted & Authentic
                  </span>
                </div>

                {/* Option 1: Bharat UPI (Recommended) */}
                {paymentSettings?.enableUpi !== false && (
                  <div
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-[#E67E44] bg-[#FAF7F2] shadow-md'
                        : 'border-[#181513]/15 bg-[#FAF7F2]/50 hover:border-[#181513]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#E67E44]/10 text-[#E67E44] flex items-center justify-center">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-[#181513] flex items-center gap-2">
                            Instant Bharat UPI (GPay / PhonePe / Paytm)
                            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-mono uppercase font-bold">
                              Instant Lock
                            </span>
                          </span>
                          <span className="text-xs text-[#5C564E] block">
                            Zero transaction fee • Auto-locks your 1-of-1 specimen immediately
                          </span>
                        </div>
                      </div>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'UPI' ? 'border-[#E67E44] bg-[#E67E44]' : 'border-[#181513]/30'
                      }`}>
                        {paymentMethod === 'UPI' && <Check className="w-3 h-3 text-white" />}
                      </span>
                    </div>

                    {paymentMethod === 'UPI' && (
                      <div className="mt-4 pt-4 border-t border-[#181513]/10 space-y-4">
                        {/* Dynamic UPI QR Display */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-sm border border-[#181513]/10">
                          <div className="w-32 h-32 bg-[#FAF7F2] p-2 border border-[#181513]/15 rounded-sm flex items-center justify-center flex-shrink-0 shadow-inner">
                            <QrCode className="w-24 h-24 text-[#181513]" />
                          </div>
                          <div className="space-y-2 text-center sm:text-left flex-1">
                            <span className="text-[10px] font-mono text-[#5C564E] uppercase tracking-wider block">
                              SCAN WITH ANY UPI APP (BHIM, GPAY, PHONEPE, PAYTM)
                            </span>
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                              <span className="font-mono text-xs font-bold bg-[#FAF7F2] px-2.5 py-1 border border-[#181513]/15 rounded-none">
                                {upiId}
                              </span>
                              <button
                                type="button"
                                onClick={handleCopyUpi}
                                className="px-2.5 py-1.5 bg-[#181513] text-white text-[10px] font-mono rounded-none hover:bg-[#A65B32] flex items-center gap-1 btn-press"
                              >
                                {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                            <span className="font-serif text-lg font-bold text-[#181513] block">
                              Amount: {formatPrice(finalTotal)}
                            </span>
                          </div>
                        </div>

                        {/* 1-Tap Mobile UPI Intent App Switcher (Smartphone High-Conversion) */}
                        <div className="pt-2">
                          <span className="text-[10px] font-mono text-[#5C564E] uppercase tracking-wider block mb-2 text-center sm:text-left">
                            ⚡ Mobile 1-Tap Instant App Switcher
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <a
                              href={upiPaymentUri}
                              className="py-2.5 px-3 bg-[#181513] hover:bg-[#A65B32] text-white text-[10px] font-mono tracking-wider uppercase rounded-sm flex items-center justify-center gap-1.5 transition-colors btn-press shadow"
                            >
                              <Sparkles className="w-3 h-3 text-[#C4975A]" />
                              <span>Pay with GPay</span>
                            </a>
                            <a
                              href={upiPaymentUri}
                              className="py-2.5 px-3 bg-[#5f259f] hover:bg-[#4d1d82] text-white text-[10px] font-mono tracking-wider uppercase rounded-sm flex items-center justify-center gap-1.5 transition-colors btn-press shadow"
                            >
                              <span>PhonePe</span>
                            </a>
                            <a
                              href={upiPaymentUri}
                              className="py-2.5 px-3 bg-[#002e6e] hover:bg-[#002252] text-white text-[10px] font-mono tracking-wider uppercase rounded-sm flex items-center justify-center gap-1.5 transition-colors btn-press shadow col-span-2 sm:col-span-1"
                            >
                              <span>Paytm / BHIM</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Option 2: Razorpay / Cashfree Online Cards Gateway */}
                {(paymentSettings?.enableRazorpay !== false || paymentSettings?.enableCashfree !== false) && (
                  <div
                    onClick={() => setPaymentMethod('GATEWAY')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'GATEWAY'
                        ? 'border-[#E67E44] bg-[#FAF7F2] shadow-md'
                        : 'border-[#181513]/15 bg-[#FAF7F2]/50 hover:border-[#181513]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-[#181513] flex items-center gap-2">
                            Razorpay & Cashfree Gateway (Cards / NetBanking)
                            <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[9px] font-mono uppercase font-bold">
                              Cards / NetBanking
                            </span>
                          </span>
                          <span className="text-xs text-[#5C564E] block">
                            Visa, Mastercard, RuPay, Amex & All Major Indian Banks
                          </span>
                        </div>
                      </div>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'GATEWAY' ? 'border-[#E67E44] bg-[#E67E44]' : 'border-[#181513]/30'
                      }`}>
                        {paymentMethod === 'GATEWAY' && <Check className="w-3 h-3 text-white" />}
                      </span>
                    </div>

                    {paymentMethod === 'GATEWAY' && (
                      <div className="mt-3 pt-3 border-t border-[#181513]/10 text-xs font-mono text-[#5C564E] flex items-center justify-between">
                        <span>Secured via Razorpay & Cashfree 256-bit encryption</span>
                        <span className="font-bold text-emerald-700">Instant Authorization</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Option 3: Cash on Delivery (Air Express) */}
                {paymentSettings?.enableCod !== false && (
                  <div
                    onClick={() => {
                      if (finalTotal <= (paymentSettings?.codMaxAmount || 7000)) {
                        setPaymentMethod('COD');
                      }
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      finalTotal > (paymentSettings?.codMaxAmount || 7000)
                        ? 'opacity-50 border-[#181513]/10 bg-gray-100 cursor-not-allowed'
                        : paymentMethod === 'COD'
                        ? 'border-[#E67E44] bg-[#FAF7F2] shadow-md cursor-pointer'
                        : 'border-[#181513]/15 bg-[#FAF7F2]/50 hover:border-[#181513]/30 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#181513]/10 text-[#181513] flex items-center justify-center">
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-[#181513] flex items-center gap-2">
                            Cash on Delivery (Blue Dart Air Express)
                            {finalTotal > (paymentSettings?.codMaxAmount || 7000) && (
                              <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-mono uppercase font-bold">
                                Limit Exceeded
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-[#5C564E] block">
                            {finalTotal > (paymentSettings?.codMaxAmount || 7000)
                              ? `COD limit is ${formatPrice(paymentSettings?.codMaxAmount || 7000)}. Please use UPI/Cards for 1-of-1 archival pieces.`
                              : 'Pay upon delivery to Blue Dart courier. OTP verification sent to WhatsApp.'}
                          </span>
                        </div>
                      </div>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'COD' ? 'border-[#E67E44] bg-[#E67E44]' : 'border-[#181513]/30'
                      }`}>
                        {paymentMethod === 'COD' && <Check className="w-3 h-3 text-white" />}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm & Complete Order Action */}
              <div className="space-y-3 pt-2">
                <button
                  disabled={isSubmitting}
                  onClick={handleExecuteOrder}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs tracking-widest-plus uppercase rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-xl font-bold"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'LOCKING SPECIMEN IN RAJASTHAN ARCHIVE...'
                      : `CONFIRM & COMPLETE ACQUISITION (${formatPrice(finalTotal)})`}
                  </span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#5C564E]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Atomic Inventory Lock • Immediate Blue Dart Airway Bill Generation</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER CONFIRMED DOSSIER */}
          {step === 'confirmed' && confirmedOrder && (
            <div className="text-center space-y-6 py-2">
              {/* Crimson Vintage Vogue Wax Seal */}
              <div className="relative inline-block mx-auto animate-sealStamp">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#991B1B] via-[#7F1D1D] to-[#450A0A] text-amber-200 border-4 border-amber-300/40 shadow-2xl flex flex-col items-center justify-center font-serif text-center select-none ring-4 ring-red-900/30">
                  <span className="text-[10px] tracking-widest font-mono text-amber-300 font-bold">V.V.</span>
                  <span className="text-sm font-bold tracking-tight text-amber-100 font-serif">1992</span>
                  <span className="text-[8px] tracking-widest font-mono text-amber-300/90 uppercase font-bold">WAX SEALED</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-[#A65B32] font-bold">
                  TRANSACTION CONFIRMED • 1-OF-1 PERMANENTLY ALLOCATED
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#181513]">
                  Specimen Locked in Your Name
                </h3>
                <p className="font-sans text-xs text-[#5C564E] max-w-md mx-auto">
                  Thank you, <strong className="text-[#181513]">{confirmedOrder.customerName}</strong>. Your archival piece is allocated. Our studio team at Sogaria / Workshop Road, Kota is steam sanitizing and wax-sealing your order.
                </p>
              </div>

              {/* Blue Dart AWB Tracking Box */}
              <div className="bg-[#FAF7F2] border-2 border-dashed border-[#181513]/25 p-4 rounded-xl max-w-md mx-auto text-left space-y-2 font-mono text-xs shadow-sm">
                <div className="flex justify-between items-center text-[#5C564E] text-[11px] border-b border-[#181513]/10 pb-1.5">
                  <span className="flex items-center gap-1.5 font-bold text-[#181513]">
                    <Truck className="w-3.5 h-3.5 text-[#E67E44]" />
                    <span>BLUE DART EXPRESS AIR</span>
                  </span>
                  <span className="text-emerald-700 font-bold uppercase">DISPATCHING WITHIN 24H</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[#5C564E]">AWB Airway Bill Number:</span>
                  <span className="font-bold text-[#181513] bg-[#EFE7DB] px-2 py-0.5 rounded">
                    {confirmedOrder.trackingNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#5C564E]">Fulfillment Hub:</span>
                  <span className="text-[#181513] font-medium">Kota Studio, RJ – 324002</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#5C564E]">Total Paid:</span>
                  <span className="font-bold text-emerald-800 text-sm">
                    {formatPrice(confirmedOrder.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-[#181513]/10 text-[11px]">
                  <span className="text-[#5C564E]">Client Protection:</span>
                  <span className="font-bold text-emerald-800">48h Size Exchange or 100% Studio Credit</span>
                </div>
              </div>

              {/* WhatsApp Concierge Dispatch CTA */}
              <div className="space-y-3 max-w-md mx-auto pt-2">
                <a
                  href={whatsappDossierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-mono text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all font-bold"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Receive Live Blue Dart Updates on WhatsApp</span>
                </a>

                <button
                  onClick={closeCheckout}
                  className="w-full py-3 bg-[#181513] hover:bg-[#E67E44] text-[#FAF7F2] font-mono text-xs tracking-widest uppercase rounded-xl transition-colors"
                >
                  Continue Exploring Archive
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

