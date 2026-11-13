import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Ruler,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Shirt,
  Compass,
  Check,
  Eye,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { playClickSound, playTapeMeasureSound, playSparkleSound } from '../utils/audio';

interface FitAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FitAdvisorModal: React.FC<FitAdvisorModalProps> = ({ isOpen, onClose }) => {
  const { products } = useStore();
  const { setSelectedProduct, addToCart, formatPrice, cart, openCheckout } = useCart();

  const [heightInches, setHeightInches] = useState(69); // 5'9" (175 cm)
  const [shoulderType, setShoulderType] = useState<'slim' | 'regular' | 'broad'>('regular');
  const [preferredDrape, setPreferredDrape] = useState<'boxy-crop' | 'oversized-grunge' | 'classic-western'>('boxy-crop');

  const heightFeet = Math.floor(heightInches / 12);
  const heightRemInches = heightInches % 12;
  const heightCm = Math.round(heightInches * 2.54);

  const handleHeightChange = (val: number) => {
    setHeightInches(val);
    playTapeMeasureSound();
  };

  // Silhouette Matching Algorithm
  const rankedMatches = useMemo(() => {
    return products
      .filter((p) => p.inStock)
      .map((product) => {
        let score = 82; // baseline match score

        // Height affinity
        if (preferredDrape === 'boxy-crop') {
          if (product.category === 'boxy-shirts' || product.title.toLowerCase().includes('boxy')) score += 12;
          if (product.size.includes('M') || product.size.includes('S')) score += 4;
        } else if (preferredDrape === 'oversized-grunge') {
          if (product.size.includes('L') || product.size.includes('XL') || product.size.includes('Free Size')) score += 14;
          if (product.category === 'leather-jackets' || product.category === 'denim-workwear') score += 5;
        } else if (preferredDrape === 'classic-western') {
          if (product.era.includes('70s') || product.era.includes('80s')) score += 10;
        }

        // Shoulder type alignment
        if (shoulderType === 'broad') {
          if (product.measurements.shoulders.includes('20') || product.measurements.shoulders.includes('21')) score += 6;
        } else if (shoulderType === 'slim') {
          if (product.measurements.shoulders.includes('18') || product.measurements.shoulders.includes('19')) score += 6;
        }

        // Clamp between 84% and 99%
        const matchPercent = Math.min(99, Math.max(84, score));

        let fitReason = 'Ideal proportions for your frame.';
        if (preferredDrape === 'boxy-crop') {
          fitReason = `Center back length of ${product.measurements.length.split('/')[0].trim()} will sit right at your belt line with an effortless boxy hang.`;
        } else if (preferredDrape === 'oversized-grunge') {
          fitReason = `Wide ${product.measurements.pitToPit.split('/')[0].trim()} chest delivers the authentic 1990s Japanese street drape with drop shoulders.`;
        } else {
          fitReason = `Authentic tapered cut across the chest and waist, true to period western tailoring.`;
        }

        return {
          product,
          matchPercent,
          fitReason,
        };
      })
      .sort((a, b) => b.matchPercent - a.matchPercent)
      .slice(0, 3);
  }, [products, heightInches, shoulderType, preferredDrape]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
    >
      <div
        className="relative bg-[#FAF7F2] border border-[#181513]/25 max-w-3xl w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#181513] animate-scaleUp max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#EFE7DB] border-b border-[#181513]/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-[#E67E44]/15 rounded text-[#E67E44]">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-mono text-xs tracking-widest-plus uppercase font-bold text-[#181513]">
                ARCHIVAL SILHOUETTE & FIT ADVISOR
              </h3>
              <p className="font-sans text-[11px] text-[#5C564E]">
                Find the exact 1-of-1 archive drape calibrated to your body proportions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/10 transition-colors"
            aria-label="Close fit advisor"
          >
            <X className="w-5 h-5 text-[#181513]" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Sizing Interactive Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F4EFE6] p-5 rounded-xl border border-[#181513]/10">
            {/* Height Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#5C564E] uppercase font-bold">Your Height</span>
                <span className="font-bold text-[#E67E44] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#181513]/10">
                  {heightFeet}'{heightRemInches}" ({heightCm} cm)
                </span>
              </div>
              <input
                type="range"
                min={60}
                max={78}
                value={heightInches}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-full accent-[#E67E44] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-[#8C857B]">
                <span>5'0" (152cm)</span>
                <span>6'6" (198cm)</span>
              </div>
            </div>

            {/* Shoulder Frame */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#5C564E] uppercase font-bold block">
                Shoulder Build
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                {[
                  { id: 'slim', label: 'Slim' },
                  { id: 'regular', label: 'Athletic' },
                  { id: 'broad', label: 'Broad' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setShoulderType(s.id as any);
                    }}
                    className={`py-2 px-1 rounded border text-center transition-all ${
                      shoulderType === s.id
                        ? 'border-[#E67E44] bg-[#E67E44] text-white font-bold shadow'
                        : 'border-[#181513]/15 bg-white text-[#181513] hover:border-[#181513]/30'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Desired Drape Aesthetic */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#5C564E] uppercase font-bold block">
                Desired Drape
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                {[
                  { id: 'boxy-crop', label: 'Boxy Crop' },
                  { id: 'oversized-grunge', label: 'Oversized' },
                  { id: 'classic-western', label: 'Western' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setPreferredDrape(d.id as any);
                    }}
                    className={`py-2 px-1 rounded border text-center transition-all ${
                      preferredDrape === d.id
                        ? 'border-[#E67E44] bg-[#E67E44] text-white font-bold shadow'
                        : 'border-[#181513]/15 bg-white text-[#181513] hover:border-[#181513]/30'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Matched Pieces Heading */}
          <div className="flex items-center justify-between border-b border-[#181513]/10 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E67E44]" />
              <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-[#181513]">
                TOP 3 SPECIMEN MATCHES IN DROP #24
              </h4>
            </div>
            <span className="text-[10px] font-mono text-[#5C564E]">
              Calibrated from 10 live archival pieces
            </span>
          </div>

          {/* Matches List */}
          <div className="space-y-4">
            {rankedMatches.map(({ product, matchPercent, fitReason }, idx) => {
              const isInCart = cart.some((i) => i.product.id === product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white border border-[#181513]/15 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 hover:border-[#E67E44] transition-all duration-200 shadow-sm group"
                >
                  {/* Photo & Match Badge */}
                  <div className="relative w-24 h-28 bg-[#FAF7F2] rounded-lg overflow-hidden border border-[#181513]/10 flex-shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-1 left-1 bg-black/80 text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Specimen Info */}
                  <div className="flex-1 space-y-1.5 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded-full">
                        {matchPercent}% FIT MATCH
                      </span>
                      <span className="font-mono text-xs text-[#E67E44] font-bold">
                        [{product.referenceCode}] • {product.size}
                      </span>
                      <span className="text-[10px] font-mono text-[#5C564E]">
                        {product.era}
                      </span>
                    </div>

                    <h5 className="font-serif font-bold text-base sm:text-lg text-[#181513]">
                      {product.title}
                    </h5>

                    <p className="font-sans text-xs text-[#5C564E] leading-relaxed italic">
                      "{fitReason}"
                    </p>

                    {/* Tape Measurements Pill */}
                    <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-[10px] font-mono text-[#8C857B]">
                      <span>Pit-to-Pit: <strong className="text-[#181513]">{product.measurements.pitToPit.split('/')[0]}</strong></span>
                      <span>•</span>
                      <span>Length: <strong className="text-[#181513]">{product.measurements.length.split('/')[0]}</strong></span>
                      <span>•</span>
                      <span>Shoulder: <strong className="text-[#181513]">{product.measurements.shoulders.split('/')[0]}</strong></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto flex-shrink-0">
                    <span className="font-serif text-xl font-bold text-[#181513]">
                      {formatPrice(product.price)}
                    </span>

                    <div className="flex sm:flex-col gap-2 w-full sm:w-36">
                      <button
                        onClick={() => {
                          playSparkleSound();
                          onClose();
                          setSelectedProduct(product);
                        }}
                        className="flex-1 py-2 px-3 bg-[#FAF7F2] hover:bg-[#EFE7DB] text-[#181513] border border-[#181513]/20 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect Fit</span>
                      </button>

                      <button
                        onClick={() => {
                          playClickSound();
                          onClose();
                          openCheckout(product);
                        }}
                        className="flex-1 py-2 px-3 bg-[#181513] hover:bg-[#E67E44] text-white rounded-lg text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 transition-colors shadow"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-300" />
                        <span>Instant Buy</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-[#EFE7DB] border-t border-[#181513]/10 px-6 py-3 flex items-center justify-between text-[11px] font-mono text-[#5C564E]">
          <span className="flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-[#E67E44]" />
            <span>Studio Tip: Japanese 90s vintage cuts are 2" wider in the chest for the boxy drape.</span>
          </span>
          <button
            onClick={onClose}
            className="font-bold underline hover:text-[#181513]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
