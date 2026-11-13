import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Ruler, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';

interface EditorialHeroProps {
  onExploreClick?: () => void;
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({ onExploreClick }) => {
  const { products } = useStore();
  const { setSelectedProduct, addToCart, formatPrice, cart } = useCart();
  const heroPiece = products[0];
  if (!heroPiece) return null;
  const isInCart = cart.some(item => item.product.id === heroPiece.id);

  return (
    <section className="relative min-h-[680px] lg:h-[88vh] lg:max-h-[920px] bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#EAE3D4] border-b border-[#181513]/10 overflow-hidden flex flex-col justify-center">
      {/* Background Archival Seal Watermark */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 font-serif text-[15vw] font-bold text-[#181513]/[0.02] select-none pointer-events-none leading-none tracking-tighter">
        VOGUE
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-16 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: High-Fashion Editorial Manifesto */}
          <div className="lg:col-span-7 space-y-6">
            {/* Drop Ribbon & Instagram Tag */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#181513] text-[#FAF7F2] text-[10px] font-mono tracking-widest-plus uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A65B32] animate-ping"></span>
                <span>VAULT DROP #24 • SPECIMEN N° 01 • 1-OF-1 ONLY</span>
              </div>
              <a
                href="https://www.instagram.com/vintagevoguee_in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF7F2] border border-[#181513]/15 text-[#181513] text-[10px] font-mono tracking-wider uppercase hover:border-[#A65B32] transition-colors"
              >
                <span className="text-[#A65B32] font-bold">@vintagevoguee_in</span>
                <span className="text-[#6B6358] hidden sm:inline">• Private Drops</span>
              </a>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.6rem] leading-[1.0] tracking-tight text-[#181513]">
                HAUTE ARCHIVAL & <br />
                <span className="italic font-light text-[#A65B32]">HERITAGE</span> WESTERN ATELIER.
              </h2>
              <p className="font-serif italic text-lg sm:text-xl text-[#5C564E] tracking-wide">
                1992 Japanese Draped Camp Shirt — Hand Chain-Stitched Sandwashed Rayon Twill.
              </p>
            </div>

            {/* Curatorial Story */}
            <p className="font-sans text-sm sm:text-base text-[#5C564E] max-w-xl leading-relaxed font-normal">
              Every specimen in the Vintage Vogue vault is an authenticated 1-of-1 archival garment hand-selected from private Tokyo archives, Osaka collector estates, and American heritage vaults. Preserved, steam sanitized, and measured to the quarter-inch at our Sogaria Atelier, Kota.
            </p>

            {/* Garment Provenance Metrics */}
            <div className="grid grid-cols-3 gap-3 py-4 border-y border-[#181513]/10 max-w-lg">
              <div className="space-y-0.5">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-[#6B6358]">
                  Silhouette Fit
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-[#181513]">
                  {heroPiece.size}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-[#6B6358]">
                  Condition Score
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-[#2D5A3F] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 inline" /> {heroPiece.conditionRating.split(' ')[0]}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-[#6B6358]">
                  Chest Measurement
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-[#181513]">
                  {heroPiece.measurements.pitToPit.split('/')[0]}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => addToCart(heroPiece)}
                className="px-8 py-4 bg-[#181513] hover:bg-[#A65B32] text-white text-xs font-mono tracking-widest-plus uppercase flex items-center gap-3 transition-all duration-300 shadow-md hover:shadow-xl group rounded-sm btn-press"
              >
                {isInCart ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>CLAIMED IN BAG</span>
                  </>
                ) : (
                  <>
                    <span>CLAIM 1-OF-1 SPECIMEN • {formatPrice(heroPiece.price)}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedProduct(heroPiece)}
                className="px-5 py-4 border border-[#181513]/25 hover:border-[#181513] text-[#181513] text-xs font-mono tracking-widest uppercase hover:bg-[#FAF7F2] transition-colors flex items-center gap-2"
              >
                <Ruler className="w-3.5 h-3.5 text-[#E67E44]" />
                <span>EXAMINE TAPE MEASUREMENTS</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-[#EFE7DB] border border-[#181513]/15 p-4 sm:p-6 shadow-xl group">
              {/* Corner Stamp Marks */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#181513]/40"></div>
              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#181513]/40"></div>
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#181513]/40"></div>
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#181513]/40"></div>

              {/* Tag Header */}
              <div className="flex justify-between items-center mb-3 text-[10px] font-mono tracking-wider text-[#5C564E]">
                <span className="bg-[#181513] text-white px-2 py-0.5 font-bold">
                  {heroPiece.referenceCode}
                </span>
                <span className="text-[#E67E44] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> 1-OF-1 PIECE
                </span>
              </div>

              {/* Garment Image */}
              <div 
                className="relative aspect-[4/5] overflow-hidden bg-[#FAF7F2] border border-[#181513]/10 cursor-pointer image-zoom-container"
                onClick={() => setSelectedProduct(heroPiece)}
              >
                <img
                  src={heroPiece.images[0]}
                  alt={heroPiece.title}
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Hover inspect banner */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-mono tracking-widest uppercase underline underline-offset-4">
                    Click for Macro Embroidery Detail →
                  </span>
                </div>

                {/* Condition Seal Badge */}
                <span className="absolute top-3 right-3 bg-[#FAF7F2]/95 backdrop-blur-sm border border-[#181513]/20 text-[#2D5A3F] font-mono text-[9px] px-2 py-1 tracking-wider uppercase font-bold shadow-sm">
                  {heroPiece.conditionRating}
                </span>
              </div>

              {/* Garment Info Footnote */}
              <div className="mt-4 pt-3 border-t border-[#181513]/10 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#181513] leading-snug">
                    {heroPiece.title}
                  </h3>
                  <p className="font-sans text-xs text-[#5C564E] mt-0.5">
                    {heroPiece.size} • {heroPiece.era}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-serif text-2xl font-bold text-[#181513]">
                    {formatPrice(heroPiece.price)}
                  </span>
                  {heroPiece.originalEstimatePrice && (
                    <span className="block font-mono text-[9px] text-[#8C857B] line-through">
                      Est. {formatPrice(heroPiece.originalEstimatePrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

