import React, { useState } from 'react';
import {
  Mail,
  Check,
  ShieldCheck,
  ArrowRight,
  Instagram,
  MessageCircle,
  MapPin,
  Truck,
  Phone,
  Clock,
  ExternalLink,
  Sparkles,
  CreditCard,
  QrCode,
  Package
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { playClickSound, playSuccessChime } from '../utils/audio';

export const Footer: React.FC = () => {
  const { showToast } = useCart();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      playSuccessChime();
      setSubscribed(true);
      showToast('Enrolled in Drop #24 VIP Gazette. Password will arrive 15m prior to drop.');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#12100F] text-[#FAF7F2] pt-16 pb-14 border-t border-white/10 relative selection:bg-[#E67E44] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* Top Drop VIP Gazette & Early Access Gate */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-12 border-b border-white/10">
          <div className="lg:col-span-6 space-y-2.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#E67E44]/20 border border-[#E67E44]/40 text-[#E67E44] text-[10px] font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3 h-3" />
              <span>KOTA DISPATCH HUB • WEEKLY ARCHIVE DROPS</span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-white">
              Get 15-Minute VIP Password Access Before Public Instagram Drop.
            </h3>
            <p className="font-sans text-xs sm:text-sm text-white/70 max-w-lg font-light leading-relaxed">
              Every drop goes live on Sunday at 8:00 PM IST on <a href="https://www.instagram.com/vintagevoguee_in/?hl=en" target="_blank" rel="noopener noreferrer" className="text-[#E67E44] hover:underline font-bold">@vintagevoguee_in</a>. All 1-of-1 pieces are single-quantity discoveries from Tokyo, Paris, and American flea archives.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email or WhatsApp number..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 focus:border-[#E67E44] pl-10 pr-4 py-3 text-xs font-mono text-white placeholder:text-white/40 outline-none transition-colors rounded-lg"
                />
              </div>
              <button
                type="submit"
                onClick={() => playClickSound()}
                className="px-6 py-3 bg-[#E67E44] hover:bg-[#d57038] text-white font-mono text-xs tracking-widest uppercase font-bold transition-all flex items-center justify-center gap-2 rounded-lg shadow-lg shadow-[#E67E44]/20"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4" /> Enrolled in VIP List
                  </>
                ) : (
                  <>
                    <span>Get Drop Pass</span> <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mt-2.5">
              <span>Strict privacy. Zero spam. Drop passcodes only.</span>
              <span className="text-[#E67E44]">All Prices in Indian Rupees (₹)</span>
            </div>
          </div>
        </div>

        {/* Multi-Column Comprehensive Information Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 text-xs font-mono">
          
          {/* Column 1: Studio & Physical Address in Kota, Rajasthan */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-[#E67E44]">
              <MapPin className="w-4 h-4" />
              <span className="tracking-wider uppercase font-bold text-[11px]">
                STUDIO & DISPATCH HUB
              </span>
            </div>
            
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2 text-white/80 leading-relaxed font-sans text-xs">
              <div className="font-bold text-white font-serif text-sm">
                Vintage Vogue India Studio
              </div>
              <p>
                Sogaria / Workshop Road, New Basti,<br />
                Maan Singh Farm Area,<br />
                <span className="font-mono text-white font-semibold">Kota, Rajasthan – 324002, India 🇮🇳</span>
              </p>
              <p className="text-[11px] text-white/50 pt-1 border-t border-white/10 font-mono">
                Landmark: Near Kota Junction Railway Division / Chambal Industrial Corridor
              </p>
              <div className="pt-1">
                <a
                  href="https://maps.google.com/?q=Kota,+Rajasthan,+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#E67E44] hover:text-white transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="text-[11px] text-white/60 space-y-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#E67E44]" />
                <span>Studio Hours: 10:30 AM – 8:30 PM IST (Mon–Sat)</span>
              </div>
              <p className="text-[10px] text-white/40 pl-5">
                * In-person fitting consultations by prior appointment.
              </p>
            </div>
          </div>

          {/* Column 2: Official Instagram Verification & Community */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-[#E67E44]">
              <Instagram className="w-4 h-4" />
              <span className="tracking-wider uppercase font-bold text-[11px]">
                OFFICIAL INSTAGRAM
              </span>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <a
                    href="https://www.instagram.com/vintagevoguee_in/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-sm text-white hover:text-[#E67E44] transition-colors flex items-center gap-1.5"
                  >
                    <span>@vintagevoguee_in</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#E67E44]" />
                  </a>
                  <span className="text-[10px] text-white/50 block font-mono">
                    Fashion & Apparel • Kota, RJ
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  VERIFIED
                </span>
              </div>

              <p className="text-[11px] font-sans text-white/70 leading-relaxed">
                Curated 1-of-1 Western Wear, Boxy Embroidered Shirts, Heavy Denims, and Japanese Archival Finds. Weekly Drops every Sunday 8 PM IST.
              </p>

              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <a
                  href="https://www.instagram.com/vintagevoguee_in/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-[#E67E44] text-white text-center rounded-lg font-mono text-[11px] font-bold tracking-wider uppercase hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 shadow"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Follow on Instagram</span>
                </a>

                <a
                  href="https://ig.me/m/vintagevoguee_in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-[10px] text-white/60 hover:text-white transition-colors underline"
                >
                  Direct Message (DM) to Reserve
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Logistics, Pan-India Dispatch & Blue Dart */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-[#E67E44]">
              <Truck className="w-4 h-4" />
              <span className="tracking-wider uppercase font-bold text-[11px]">
                PAN-INDIA DISPATCH
              </span>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2.5 font-sans text-xs">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white font-mono text-xs">Blue Dart Express Air</span>
              </div>
              
              <p className="text-white/70 leading-relaxed">
                Every order is steam-sanitized, wrapped in unbleached tissue, and dispatched directly from our Kota Hub within 24 hours.
              </p>

              <div className="space-y-1 font-mono text-[10px] text-white/60 pt-1 border-t border-white/10">
                <div className="flex justify-between">
                  <span>Rajasthan & NCR:</span>
                  <span className="font-bold text-white">24 – 48 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Mumbai, BLR, HYD, MAA:</span>
                  <span className="font-bold text-white">2 – 3 Days</span>
                </div>
                <div className="flex justify-between">
                  <span>Rest of India:</span>
                  <span className="font-bold text-white">3 – 4 Days</span>
                </div>
                <div className="flex justify-between text-[#E67E44] font-bold pt-1">
                  <span>Orders Above ₹2,999:</span>
                  <span>FREE AIR SHIPPING</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: WhatsApp Support & Indian Rupee Payment Gateway */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-[#E67E44]">
              <MessageCircle className="w-4 h-4" />
              <span className="tracking-wider uppercase font-bold text-[11px]">
                WHATSAPP CONCIERGE & UPI
              </span>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
              <a
                href="https://wa.me/919829012345?text=Hello%20Vintage%20Vogue!%20I%20am%20inquiring%20about%20a%201-of-1%20piece%20from%20the%20drop."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-center rounded-lg font-mono text-[11px] font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: +91 98290 12345</span>
              </a>

              <div className="space-y-1 text-[11px] font-mono text-white/70">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-white/50" />
                  <span>Call / Audio: +91 98290 12345</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/50 text-[10px]">
                  <span>Mon – Sat: 10:00 AM – 8:30 PM IST</span>
                </div>
              </div>

              {/* Indian Payment Badges */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <span className="text-[10px] font-mono text-white/50 block uppercase">
                  Accepted Payment Methods (₹ INR)
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[9px] font-bold">
                    UPI (GPay / PhonePe / Paytm)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[9px]">
                    NetBanking
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[9px]">
                    Debit/Credit Cards
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[9px]">
                    Cash at Kota Counter
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Circular Promise & Authenticity Banner */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
          <div className="space-y-1">
            <span className="text-[#E67E44] font-bold text-sm block">1-OF-1 SPECIMENS</span>
            <span className="text-[10px] text-white/60">Strictly single-inventory. No restocks ever.</span>
          </div>
          <div className="space-y-1">
            <span className="text-emerald-400 font-bold text-sm block">STEAM SANITIZED</span>
            <span className="text-[10px] text-white/60">Deep cleaned with organic eucalyptus mist in Kota.</span>
          </div>
          <div className="space-y-1">
            <span className="text-cyan-400 font-bold text-sm block">FLAT TAPE MEASURED</span>
            <span className="text-[10px] text-white/60">Measured to 0.25-inch precision to guarantee fit.</span>
          </div>
          <div className="space-y-1">
            <span className="text-purple-400 font-bold text-sm block">100% CIRCULAR FASHION</span>
            <span className="text-[10px] text-white/60">Zero landfill waste. Preserving textile history.</span>
          </div>
        </div>

        {/* Bottom Copyright & Legal Strip */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono text-white/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              © 2026 VINTAGE VOGUE INDIA (<a href="https://www.instagram.com/vintagevoguee_in/?hl=en" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#E67E44] underline">@VINTAGEVOGUEE_IN</a>). SOGARIA, KOTA, RAJASTHAN 324002.
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-white/40">ALL TRANSACTIONS SECURED IN INDIAN RUPEES (₹ INR)</span>
            <a href="https://www.instagram.com/vintagevoguee_in/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              INSTAGRAM ARCHIVE
            </a>
            <a href="https://maps.google.com/?q=Kota,+Rajasthan,+India" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              KOTA LOCATION
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
