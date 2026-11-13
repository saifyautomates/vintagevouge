import React, { useState } from 'react';
import {
  Settings,
  MapPin,
  QrCode,
  Truck,
  MessageCircle,
  Database,
  RefreshCw,
  Save,
  Check,
  AlertTriangle,
  Banknote,
  CreditCard,
  Zap,
  Sliders
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { db } from '../../../database/db';
import { playClickSound, playSuccessChime } from '../../utils/audio';

export const AdminSettingsModal: React.FC = () => {
  const { refreshData, paymentSettings, updatePaymentSettings } = useStore();
  const [studioAddress, setStudioAddress] = useState(
    'Sogaria / Workshop Road, New Basti, Maan Singh Farm Area, Kota, Rajasthan – 324002'
  );
  const [upiVpa, setUpiVpa] = useState(paymentSettings.upiVpa);
  const [whatsappPhone, setWhatsappPhone] = useState('+91 98290 12345');
  const [shippingThreshold, setShippingThreshold] = useState('2999');
  const [codMaxAmount, setCodMaxAmount] = useState(paymentSettings.codMaxAmount.toString());
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessChime();
    updatePaymentSettings({
      upiVpa,
      codMaxAmount: Number(codMaxAmount) || 7000,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleResetDatabase = () => {
    if (confirm('Are you sure you want to restore initial seed database? All test orders will be reset.')) {
      playClickSound();
      db.resetToSeed();
      refreshData();
      alert('Database restored to authentic initial seed state!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl text-white">
      {/* Header */}
      <div className="bg-[#181513] border border-white/10 rounded-2xl p-6 space-y-2 shadow-xl">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#E67E44]" />
          <h3 className="font-serif text-2xl font-bold">Studio Hub & Logistics Settings</h3>
        </div>
        <p className="font-sans text-xs text-white/60">
          Core operational parameters for Vintage Vogue India dispatch, payments, and studio location.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Physical Studio Hub */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-[#E67E44] flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Studio Physical Headquarters</span>
          </h4>

          <div>
            <label className="block text-[11px] font-mono uppercase text-white/50 mb-1">
              Registered Studio & Fulfillment Address
            </label>
            <input
              type="text"
              value={studioAddress}
              onChange={(e) => setStudioAddress(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-[#E67E44]"
            />
            <span className="text-[10px] font-mono text-white/40 block mt-1">
              Included on all Blue Dart shipping labels and printed thermal counter receipts.
            </span>
          </div>
        </div>

        {/* Live Payment Gateway Switchboard (COD, UPI, Razorpay, Cashfree Controls) */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-[#E67E44] flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>Live Payment Gateways & Cash on Delivery (COD) Switchboard</span>
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Live Store Controls
            </span>
          </div>

          <p className="text-xs text-white/60">
            Control which payment methods are accepted at checkout. Turn COD on/off instantly or protect 1-of-1 pieces by setting max limits.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Toggle 1: Cash on Delivery (COD) */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  paymentSettings.enableCod ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-white/40'
                }`}>
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">Cash on Delivery (COD)</span>
                  <span className="text-[10px] text-white/50 block">Pay cash to Blue Dart courier</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  updatePaymentSettings({ enableCod: !paymentSettings.enableCod });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  paymentSettings.enableCod
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {paymentSettings.enableCod ? 'ON (ACTIVE)' : 'OFF (DISABLED)'}
              </button>
            </div>

            {/* Toggle 2: Bharat UPI (PhonePe / GPay / Paytm) */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  paymentSettings.enableUpi ? 'bg-[#E67E44]/20 text-[#E67E44]' : 'bg-white/10 text-white/40'
                }`}>
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">Bharat UPI Dynamic QR</span>
                  <span className="text-[10px] text-white/50 block">Instant 0% fee lock</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  updatePaymentSettings({ enableUpi: !paymentSettings.enableUpi });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  paymentSettings.enableUpi
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {paymentSettings.enableUpi ? 'ON (ACTIVE)' : 'OFF (DISABLED)'}
              </button>
            </div>

            {/* Toggle 3: Razorpay Online Gateway */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  paymentSettings.enableRazorpay ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/40'
                }`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">Razorpay Gateway</span>
                  <span className="text-[10px] text-white/50 block">Credit/Debit Cards & NetBanking</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  updatePaymentSettings({ enableRazorpay: !paymentSettings.enableRazorpay });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  paymentSettings.enableRazorpay
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {paymentSettings.enableRazorpay ? 'ON (ACTIVE)' : 'OFF (DISABLED)'}
              </button>
            </div>

            {/* Toggle 4: Cashfree Payments Gateway */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  paymentSettings.enableCashfree ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-white/40'
                }`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">Cashfree Payments</span>
                  <span className="text-[10px] text-white/50 block">High-speed backup gateway</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  updatePaymentSettings({ enableCashfree: !paymentSettings.enableCashfree });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  paymentSettings.enableCashfree
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {paymentSettings.enableCashfree ? 'ON (ACTIVE)' : 'OFF (DISABLED)'}
              </button>
            </div>
          </div>

          {/* COD Fraud Prevention Limits */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-white/50 mb-1">
                COD Maximum Order Amount (₹ INR)
              </label>
              <input
                type="number"
                value={codMaxAmount}
                onChange={(e) => setCodMaxAmount(e.target.value)}
                placeholder="7000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-[#E67E44]"
              />
              <span className="text-[10px] font-mono text-white/40 block mt-1">
                Orders higher than this will require online prepaid (UPI/Razorpay) to prevent RTO fraud.
              </span>
            </div>
          </div>
        </div>

        {/* Financial & Logistics Rules */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            <span>Payment & Shipping Parameters</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-white/50 mb-1">
                Bharat UPI VPA ID
              </label>
              <input
                type="text"
                value={upiVpa}
                onChange={(e) => setUpiVpa(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-[#E67E44]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-white/50 mb-1">
                WhatsApp Concierge Number
              </label>
              <input
                type="text"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-[#E67E44]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-white/50 mb-1">
                Free Express Air Threshold (₹)
              </label>
              <input
                type="number"
                value={shippingThreshold}
                onChange={(e) => setShippingThreshold(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-[#E67E44]"
              />
            </div>
          </div>
        </div>

        {/* Web Push Drop Broadcast Channel */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-purple-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Instant Browser Web Push Broadcast</span>
              </h4>
              <p className="text-xs text-white/60">
                Send 1-tap browser notifications to subscribed patrons when new 1-of-1 archival drops go live.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                if ('Notification' in window && Notification.permission === 'granted') {
                  playSuccessChime();
                  new Notification('Vintage Vogue India • Drop #24 Live ⚡', {
                    body: 'New 1-of-1 Japanese & Western pieces unsealed in Kota Hub. Tap to claim before another collector reserves.',
                    icon: '/assets/images/boxy-embroidered-shirt.jpg',
                  });
                  alert('Test Push Notification dispatched to your browser!');
                } else if ('Notification' in window) {
                  Notification.requestPermission().then((perm) => {
                    if (perm === 'granted') {
                      playSuccessChime();
                      new Notification('Vintage Vogue India • Drop #24 Live ⚡', {
                        body: 'New 1-of-1 Japanese pieces unsealed in Kota Hub.',
                        icon: '/assets/images/boxy-embroidered-shirt.jpg',
                      });
                    }
                  });
                } else {
                  alert('Push notifications not supported on this browser.');
                }
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs rounded-xl font-bold transition-all shadow"
            >
              Broadcast Test Alert
            </button>
          </div>
        </div>

        {/* Database Engine Management */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>Transactional Database Engine</span>
              </h4>
              <p className="text-xs text-white/60">
                Reset database back to the 10 authentic Japanese & Western seed archives.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetDatabase}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 font-mono text-xs rounded-xl transition-colors font-bold"
            >
              Reset to Seed
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-6 py-3 bg-[#E67E44] hover:bg-[#d57038] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#E67E44]/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>

          {savedToast && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-4 h-4" />
              <span>Settings successfully persisted!</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

