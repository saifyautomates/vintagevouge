import React, { useState } from 'react';
import { X, ShieldCheck, Ruler, Check, Share2, Sparkles, Truck, Heart, Layers } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MeasurementBlueprint } from './MeasurementBlueprint';
import { playClickSound, playShutterSound } from '../utils/audio';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    formatPrice,
    cart,
    wishlist,
    toggleWishlist,
    showToast,
  } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [measurementMode, setMeasurementMode] = useState<'blueprint' | 'table'>('blueprint');

  if (!selectedProduct) return null;

  const isInCart = cart.some(item => item.product.id === selectedProduct.id);
  const isWishlisted = wishlist.includes(selectedProduct.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Specimen dossier link copied to clipboard.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-[#FAF7F2] border border-[#181513]/25 max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 bg-[#FAF7F2] border-b border-[#181513]/10 px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3 font-mono text-xs text-[#5C564E]">
            <span className="font-bold text-[#181513] tracking-wider">{selectedProduct.referenceCode}</span>
            <span>•</span>
            <span className="text-[#E67E44] font-semibold">{selectedProduct.size}</span>
            <span>•</span>
            <span>{selectedProduct.era}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleWishlist(selectedProduct.id)}
              className={`p-1.5 transition-colors ${
                isWishlisted ? 'text-[#E67E44]' : 'text-[#5C564E] hover:text-[#181513]'
              }`}
              title="Save to wishlist"
              aria-label="Save to wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 text-[#5C564E] hover:text-[#181513] transition-colors"
              title="Share piece"
              aria-label="Share piece"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedProduct(null)}
              className="p-1.5 text-[#181513] hover:bg-[#181513]/10 transition-colors"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
          {/* Gallery Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Image */}
            <div className="relative aspect-[4/5] bg-[#EAE3D4] border border-[#181513]/10 overflow-hidden shadow-inner image-zoom-container">
              <img
                src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                alt={selectedProduct.title}
                className="w-full h-full object-cover object-center"
              />
              <span className="absolute bottom-3 left-3 bg-[#181513]/85 backdrop-blur-sm text-[#FAF7F2] text-[10px] font-mono px-2 py-1 tracking-widest uppercase">
                PHOTO {activeImageIndex + 1} OF {selectedProduct.images.length}
              </span>

              <span className="absolute top-3 left-3 bg-[#E67E44] text-white text-[9px] font-mono px-2.5 py-1 tracking-widest uppercase font-bold shadow-md">
                1-OF-1 SPECIMEN
              </span>
            </div>

            {/* Thumbnails Row */}
            {selectedProduct.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {selectedProduct.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-24 flex-shrink-0 border overflow-hidden transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#E67E44] ring-1 ring-[#E67E44]'
                        : 'border-[#181513]/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Sanitization & Care Memo */}
            <div className="bg-[#EFE7DB] border border-[#181513]/15 p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-[#E67E44] font-bold">
                <Sparkles className="w-4 h-4" />
                AUTHENTICATED THRIFT & CLEANING REPORT
              </div>
              <p className="font-serif italic text-sm text-[#443E38] leading-relaxed">
                "{selectedProduct.provenance}"
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#8C857B] flex items-center justify-between border-t border-[#181513]/10">
                <span>STEAM SANITIZED WITH ORGANIC EUCALYPTUS</span>
                <span>READY TO WEAR OUT OF BOX</span>
              </div>
            </div>
          </div>

          {/* Details & Measurements Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border border-[#2D5A3F] text-[#2D5A3F] bg-[#2D5A3F]/5 font-bold">
                    {selectedProduct.conditionRating}
                  </span>
                  <span className="text-[10px] font-mono text-[#5C564E]">{selectedProduct.dropBatch}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513] leading-tight">
                  {selectedProduct.title}
                </h2>
                <p className="font-sans text-xs text-[#5C564E] mt-1 font-medium">
                  {selectedProduct.subtitle}
                </p>
              </div>

              {/* Price & Claim Status */}
              <div className="py-3 border-y border-[#181513]/12 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-[#181513]">
                      {formatPrice(selectedProduct.price)}
                    </span>
                    {selectedProduct.originalEstimatePrice && (
                      <span className="font-mono text-xs text-[#8C857B] line-through">
                        Est. {formatPrice(selectedProduct.originalEstimatePrice)}
                      </span>
                    )}
                  </div>
                  <span className="block font-mono text-[10px] text-[#2D5A3F] font-semibold tracking-wider uppercase mt-0.5">
                    Free Pan-India Express Delivery Included
                  </span>
                </div>
                <span className="text-xs font-mono uppercase font-bold text-[#E67E44]">
                  Only 1 Available
                </span>
              </div>

              {/* Primary Claim Button */}
              <button
                onClick={() => addToCart(selectedProduct)}
                className="w-full py-4 bg-[#181513] hover:bg-[#E67E44] text-[#FAF7F2] text-xs font-mono tracking-widest-plus uppercase flex items-center justify-center gap-2 transition-colors duration-200 shadow-md group"
              >
                {isInCart ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Claimed In Your Bag</span>
                  </>
                ) : (
                  <span>Claim 1-of-1 Specimen</span>
                )}
              </button>

              {/* Interactive Tape Measurements & Blueprint Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-[#181513] font-bold flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-[#E67E44]" />
                    <span>Exact Specimen Fit</span>
                  </h4>
                  <div className="flex items-center gap-1 bg-[#EFE7DB] p-0.5 rounded text-[10px] font-mono">
                    <button
                      onClick={() => {
                        playClickSound();
                        setMeasurementMode('blueprint');
                      }}
                      className={`px-2 py-0.5 rounded font-bold transition-all ${
                        measurementMode === 'blueprint'
                          ? 'bg-[#181513] text-white shadow'
                          : 'text-[#5C564E] hover:text-[#181513]'
                      }`}
                    >
                      Blueprint
                    </button>
                    <button
                      onClick={() => {
                        playClickSound();
                        setMeasurementMode('table');
                      }}
                      className={`px-2 py-0.5 rounded font-bold transition-all ${
                        measurementMode === 'table'
                          ? 'bg-[#181513] text-white shadow'
                          : 'text-[#5C564E] hover:text-[#181513]'
                      }`}
                    >
                      Table
                    </button>
                  </div>
                </div>

                {measurementMode === 'blueprint' ? (
                  <MeasurementBlueprint product={selectedProduct} />
                ) : (
                  <div className="border border-[#181513]/10 divide-y divide-[#181513]/10 text-xs font-mono rounded-lg overflow-hidden">
                    <div className="p-2.5 flex justify-between bg-[#FAF7F2]">
                      <span className="text-[#8C857B]">Pit to Pit (Chest)</span>
                      <span className="text-[#181513] font-bold">{selectedProduct.measurements.pitToPit}</span>
                    </div>
                    <div className="p-2.5 flex justify-between bg-[#FAF7F2]">
                      <span className="text-[#8C857B]">Total Length</span>
                      <span className="text-[#181513] font-bold">{selectedProduct.measurements.length}</span>
                    </div>
                    <div className="p-2.5 flex justify-between bg-[#FAF7F2]">
                      <span className="text-[#8C857B]">Shoulders</span>
                      <span className="text-[#181513] font-bold">{selectedProduct.measurements.shoulders}</span>
                    </div>
                    <div className="p-2.5 flex justify-between bg-[#FAF7F2]">
                      <span className="text-[#8C857B]">Sleeve / Inseam</span>
                      <span className="text-[#181513] font-bold">{selectedProduct.measurements.sleeve}</span>
                    </div>
                    <div className="p-2.5 flex justify-between bg-[#FAF7F2]">
                      <span className="text-[#8C857B]">Fabric Weave</span>
                      <span className="text-[#181513] font-medium">{selectedProduct.fabric}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Narrative Description */}
              <div className="space-y-1.5 pt-1">
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#181513] font-bold">
                  Curatorial Notes
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#5C564E] leading-relaxed font-light">
                  {selectedProduct.description}
                </p>
              </div>
            </div>

            {/* Reassurance Badges */}
            <div className="pt-4 border-t border-[#181513]/10 grid grid-cols-2 gap-3 text-[10px] font-mono text-[#5C564E]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2D5A3F] flex-shrink-0" />
                <span>100% Genuine Archival Thrift</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#E67E44] flex-shrink-0" />
                <span>Dispatches from Kota, RJ in 24h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
