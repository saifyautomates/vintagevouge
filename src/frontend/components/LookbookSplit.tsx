import React, { useState } from 'react';
import { Sparkles, ArrowRight, Eye, ShoppingBag, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { playClickSound, playHoverSound, playSuccessChime } from '../utils/audio';

interface HotspotPin {
  id: string;
  x: number; // percentage left
  y: number; // percentage top
  product: Product;
  label: string;
}

export const LookbookSplit: React.FC = () => {
  const { products } = useStore();
  const { setSelectedProduct, addToCart, formatPrice, cart } = useCart();
  const [activePinId, setActivePinId] = useState<string | null>(null);

  const jacketPiece = products.find((p) => p.referenceCode === 'VV-D24-02') || products[1] || products[0];
  const corduroyPiece = products.find((p) => p.referenceCode === 'VV-D24-07') || products[6] || products[0];
  const dressPiece = products.find((p) => p.referenceCode === 'VV-D24-05') || products[4] || products[0];
  const bomberPiece = products.find((p) => p.referenceCode === 'VV-D24-03') || products[2] || products[0];

  const leftPins: HotspotPin[] = [
    {
      id: 'pin-jacket',
      x: 48,
      y: 38,
      product: jacketPiece,
      label: '14oz Washed Indigo Denim',
    },
    {
      id: 'pin-corduroy',
      x: 36,
      y: 58,
      product: corduroyPiece,
      label: 'Chunky Wale Western Corduroy',
    },
  ];

  const rightPins: HotspotPin[] = [
    {
      id: 'pin-dress',
      x: 52,
      y: 36,
      product: dressPiece,
      label: 'Reworked 70s Prairie Floral Dress',
    },
    {
      id: 'pin-bomber',
      x: 44,
      y: 65,
      product: bomberPiece,
      label: '1988 Distressed Lambskin Aviator',
    },
  ];

  const handlePinClick = (pin: HotspotPin) => {
    playClickSound();
    setActivePinId(activePinId === pin.id ? null : pin.id);
  };

  return (
    <section className="relative w-full min-h-[720px] lg:h-[92vh] lg:max-h-[960px] bg-[#181513] text-white flex flex-col justify-between overflow-hidden">
      {/* Top Editorial Floating Label */}
      <div className="absolute top-0 inset-x-0 z-30 px-6 sm:px-12 py-6 flex items-center justify-between bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest-plus uppercase text-white/80">
          <Sparkles className="w-3.5 h-3.5 text-[#E67E44]" />
          <span>AUTUMN / WINTER ARCHIVE LOOKBOOK • INTERACTIVE SHOPPING</span>
        </div>

        <div className="font-serif italic text-xs tracking-wider text-white/70 hidden sm:block">
          "Tap pulsating pins to inspect & claim specimens straight from the campaign."
        </div>
      </div>

      {/* 45 / 55 Asymmetric Full-Bleed Split */}
      <div className="w-full flex-1 h-full grid grid-cols-1 lg:grid-cols-12 relative pt-16 lg:pt-0">
        
        {/* Left Panel: 45% (Urban Concrete Studio Denim & Workwear) */}
        <div className="lg:col-span-5 relative min-h-[50vh] lg:min-h-full overflow-hidden group border-b lg:border-b-0 lg:border-r border-white/10 bg-[#241F1B]">
          <img
            src="/assets/images/lookbook-editorial-1.jpg"
            alt="Vintage Vogue Urban Workwear Lookbook"
            className="absolute inset-0 w-full h-full object-cover object-center filter grayscale-[10%] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

          {/* Interactive Hotspot Pins (Left) */}
          {leftPins.map((pin) => {
            const isPinActive = activePinId === pin.id;
            const isInCart = cart.some((item) => item.product.id === pin.product.id);
            return (
              <div
                key={pin.id}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
              >
                {/* Hotspot Target Button */}
                <button
                  onClick={() => handlePinClick(pin)}
                  onMouseEnter={() => playHoverSound()}
                  className="relative group/pin flex items-center justify-center p-2 focus:outline-none"
                  aria-label={`Inspect ${pin.product.title}`}
                >
                  <span className="w-6 h-6 rounded-full bg-[#E67E44]/40 animate-ping absolute"></span>
                  <span className="w-4 h-4 rounded-full bg-[#E67E44] border-2 border-white shadow-[0_0_12px_rgba(230,126,68,0.8)] relative z-10 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </span>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono whitespace-nowrap text-white/80 opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none">
                    {pin.label}
                  </span>
                </button>

                {/* Floating Hotspot Micro-Card Popover */}
                {isPinActive && (
                  <div className="absolute left-6 top-0 w-64 bg-[#181513]/95 backdrop-blur-xl border border-white/20 p-3 rounded-xl shadow-2xl z-40 animate-slideUp font-mono text-xs">
                    <div className="flex items-start gap-2.5">
                      <img
                        src={pin.product.images[0]}
                        alt={pin.product.title}
                        className="w-12 h-14 object-cover rounded bg-black border border-white/10"
                      />
                      <div className="flex-1">
                        <span className="text-[10px] text-[#E67E44] font-bold block">{pin.product.referenceCode}</span>
                        <h4 className="font-serif font-bold text-xs text-white line-clamp-1">{pin.product.title}</h4>
                        <span className="text-[10px] text-white/50 block">{pin.product.size} • {pin.product.era}</span>
                        <span className="text-xs font-bold text-white block mt-0.5">{formatPrice(pin.product.price)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-white/10">
                      <button
                        onClick={() => {
                          playClickSound();
                          setSelectedProduct(pin.product);
                        }}
                        className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] uppercase font-bold flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                      <button
                        disabled={!pin.product.inStock}
                        onClick={() => {
                          if (pin.product.inStock) {
                            playSuccessChime();
                            addToCart(pin.product);
                          }
                        }}
                        className={`flex-1 py-1.5 rounded text-[10px] uppercase font-bold flex items-center justify-center gap-1 ${
                          !pin.product.inStock
                            ? 'bg-black/40 text-white/40 cursor-not-allowed'
                            : 'bg-[#E67E44] hover:bg-[#d57038] text-white'
                        }`}
                      >
                        {isInCart ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        <span>{isInCart ? 'In Bag' : 'Claim'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bottom Left Mirrored Commerce Zone */}
          <div className="absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 z-20">
            <div>
              <span className="block font-mono text-[10px] tracking-widest-plus uppercase text-white/70">
                1-OF-1 ARCHIVAL DENIM
              </span>
              <h3 className="font-mono text-lg sm:text-xl font-bold uppercase text-white tracking-widest mt-0.5">
                INDIGO TRUCKER 1996
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playClickSound();
                  setSelectedProduct(jacketPiece);
                }}
                className="px-5 py-2.5 bg-white text-black text-[10px] font-mono tracking-widest uppercase hover:bg-[#E67E44] hover:text-white transition-colors duration-200 rounded-full"
              >
                Inspect
              </button>
              <button
                disabled={!jacketPiece?.inStock}
                onClick={() => {
                  if (jacketPiece?.inStock) {
                    playSuccessChime();
                    addToCart(jacketPiece);
                  }
                }}
                className={`px-5 py-2.5 text-[10px] font-mono tracking-widest uppercase transition-colors duration-200 rounded-full ${
                  jacketPiece?.inStock ? 'bg-[#E67E44] text-white hover:bg-white hover:text-black' : 'bg-black/40 text-white/40'
                }`}
              >
                {jacketPiece?.inStock ? 'Claim Piece' : 'Sold'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: 55% (Warm Sunlight Prairie & Western Bohemian Campaign) */}
        <div className="lg:col-span-7 relative min-h-[50vh] lg:min-h-full overflow-hidden group bg-[#2B231D]">
          <img
            src="/assets/images/lookbook-editorial-2.jpg"
            alt="Vintage Vogue Western Bohemian Lookbook"
            className="absolute inset-0 w-full h-full object-cover object-center filter sepia-[15%] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

          {/* Interactive Hotspot Pins (Right) */}
          {rightPins.map((pin) => {
            const isPinActive = activePinId === pin.id;
            const isInCart = cart.some((item) => item.product.id === pin.product.id);
            return (
              <div
                key={pin.id}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
              >
                {/* Hotspot Target Button */}
                <button
                  onClick={() => handlePinClick(pin)}
                  onMouseEnter={() => playHoverSound()}
                  className="relative group/pin flex items-center justify-center p-2 focus:outline-none"
                  aria-label={`Inspect ${pin.product.title}`}
                >
                  <span className="w-6 h-6 rounded-full bg-[#E67E44]/40 animate-ping absolute"></span>
                  <span className="w-4 h-4 rounded-full bg-[#E67E44] border-2 border-white shadow-[0_0_12px_rgba(230,126,68,0.8)] relative z-10 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </span>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono whitespace-nowrap text-white/80 opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none">
                    {pin.label}
                  </span>
                </button>

                {/* Floating Hotspot Micro-Card Popover */}
                {isPinActive && (
                  <div className="absolute right-6 top-0 w-64 bg-[#181513]/95 backdrop-blur-xl border border-white/20 p-3 rounded-xl shadow-2xl z-40 animate-slideUp font-mono text-xs">
                    <div className="flex items-start gap-2.5">
                      <img
                        src={pin.product.images[0]}
                        alt={pin.product.title}
                        className="w-12 h-14 object-cover rounded bg-black border border-white/10"
                      />
                      <div className="flex-1">
                        <span className="text-[10px] text-[#E67E44] font-bold block">{pin.product.referenceCode}</span>
                        <h4 className="font-serif font-bold text-xs text-white line-clamp-1">{pin.product.title}</h4>
                        <span className="text-[10px] text-white/50 block">{pin.product.size} • {pin.product.era}</span>
                        <span className="text-xs font-bold text-white block mt-0.5">{formatPrice(pin.product.price)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-white/10">
                      <button
                        onClick={() => {
                          playClickSound();
                          setSelectedProduct(pin.product);
                        }}
                        className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] uppercase font-bold flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                      <button
                        disabled={!pin.product.inStock}
                        onClick={() => {
                          if (pin.product.inStock) {
                            playSuccessChime();
                            addToCart(pin.product);
                          }
                        }}
                        className={`flex-1 py-1.5 rounded text-[10px] uppercase font-bold flex items-center justify-center gap-1 ${
                          !pin.product.inStock
                            ? 'bg-black/40 text-white/40 cursor-not-allowed'
                            : 'bg-[#E67E44] hover:bg-[#d57038] text-white'
                        }`}
                      >
                        {isInCart ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        <span>{isInCart ? 'In Bag' : 'Claim'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bottom Right Mirrored Commerce Zone */}
          <div className="absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 z-20">
            <div>
              <span className="block font-mono text-[10px] tracking-widest-plus uppercase text-white/70">
                70S BOHEMIAN ARCHIVE
              </span>
              <h3 className="font-mono text-lg sm:text-xl font-bold uppercase text-white tracking-widest mt-0.5">
                TIERED PRAIRIE DRESS
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playClickSound();
                  setSelectedProduct(dressPiece);
                }}
                className="px-5 py-2.5 bg-white text-black text-[10px] font-mono tracking-widest uppercase hover:bg-[#E67E44] hover:text-white transition-colors duration-200 rounded-full"
              >
                Inspect
              </button>
              <button
                disabled={!dressPiece?.inStock}
                onClick={() => {
                  if (dressPiece?.inStock) {
                    playSuccessChime();
                    addToCart(dressPiece);
                  }
                }}
                className={`px-5 py-2.5 text-[10px] font-mono tracking-widest uppercase transition-colors duration-200 rounded-full ${
                  dressPiece?.inStock ? 'bg-[#E67E44] text-white hover:bg-white hover:text-black' : 'bg-black/40 text-white/40'
                }`}
              >
                {dressPiece?.inStock ? 'Claim Piece' : 'Sold'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
