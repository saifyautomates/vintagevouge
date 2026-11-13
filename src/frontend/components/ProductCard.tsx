import React, { useState } from 'react';
import { Eye, Plus, Check, Heart, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { playClickSound, playHoverSound, playShutterSound, playSparkleSound } from '../utils/audio';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, formatPrice, cart, wishlist, toggleWishlist } = useCart();
  const isInCart = cart.some(item => item.product.id === product.id);
  const isWishlisted = wishlist.includes(product.id);

  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (x - 0.5) * 8, // rotateY (-4deg to +4deg)
      y: (0.5 - y) * 8, // rotateX (-4deg to +4deg)
      glareX: x * 100,
      glareY: y * 100,
    });
  };

  const handleMouseEnter = () => {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
    setIsHovered(true);
    playHoverSound();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  return (
    <article
      data-cursor="INSPECT"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale3d(1.015, 1.015, 1.015)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
      className="group relative flex flex-col bg-[#FAF7F2] border border-[#181513]/12 hover:border-[#181513]/40 transition-shadow duration-300 hover:shadow-2xl will-change-transform rounded-sm overflow-hidden card-lift"
    >
      {/* Dynamic Holographic Specular Glare */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-20 mix-blend-soft-light transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle 240px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.4), transparent 70%)`,
          }}
        />
      )}
      {/* Top Header Strip: Ref Code & Size */}
      <div className="p-3 pb-2 flex justify-between items-center text-[10px] font-mono tracking-wider border-b border-[#181513]/8 text-[#5C564E] bg-[#F4EFE6]">
        <div className="flex items-center gap-1.5 font-semibold text-[#181513]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A65B32]"></span>
          <span>{product.referenceCode}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono text-[#6B6358] uppercase hidden sm:inline">Fits Modern {product.size}</span>
          <span className="bg-[#181513] text-[#FAF7F2] px-2 py-0.5 font-bold tracking-widest text-[9px] rounded-none">
            {product.size}
          </span>
        </div>
      </div>

      {/* Main Image Viewport with Natural Aspect Ratio */}
      <div 
        className="relative aspect-[4/5] bg-[#EAE3D4] overflow-hidden cursor-pointer image-zoom-container"
        onClick={() => setSelectedProduct(product)}
      >
        {/* Primary Specimen Angle */}
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/assets/images/boxy-embroidered-shirt.jpg';
          }}
          className={`w-full h-full object-cover object-center transition-all duration-700 ${
            product.images[1] ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'
          }`}
        />

        {/* Secondary Detail Angle on Hover */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.title} archival detail`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105 pointer-events-none"
          />
        )}

        {/* 1-of-1 Stamp Badge or Sold Out Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          {product.inStock ? (
            <span className="bg-[#181513]/90 backdrop-blur-sm text-[#FAF7F2] text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 flex items-center gap-1 shadow">
              <Sparkles className="w-2.5 h-2.5 text-[#C4975A]" /> 1-OF-1
            </span>
          ) : (
            <span className="bg-red-700 text-white text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 shadow">
              SOLD OUT / ARCHIVED
            </span>
          )}
        </div>

        {/* Sold out overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-10 flex items-center justify-center pointer-events-none">
            <span className="px-3 py-1 bg-black/80 border border-white/20 text-[#FAF7F2] font-mono text-xs font-bold tracking-widest uppercase -rotate-6 shadow-2xl">
              CLAIMED ARCHIVE
            </span>
          </div>
        )}

        {/* Wishlist Button with Haptic Sound and Accessible 44px Touch Target */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isWishlisted) {
              playSparkleSound();
            } else {
              playShutterSound();
            }
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full backdrop-blur-md transition-all shadow-sm ${
            isWishlisted
              ? 'bg-[#A65B32] text-white scale-105'
              : 'bg-white/85 text-[#181513] hover:bg-white hover:text-[#A65B32]'
          }`}
          title="Save piece"
          aria-label="Save piece"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Action Pill Strip */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="flex-1 py-2 px-3 bg-[#FAF7F2]/95 backdrop-blur-sm text-[#181513] text-[10px] font-mono tracking-widest uppercase hover:bg-[#181513] hover:text-white transition-all shadow-md border border-[#181513]/15 flex items-center justify-center gap-1.5 btn-press"
          >
            <Eye className="w-3 h-3" /> Quick View
          </button>
          
          <button
            disabled={!product.inStock}
            onClick={(e) => {
              e.stopPropagation();
              if (product.inStock) addToCart(product);
            }}
            className={`flex-1 py-2 px-3 text-white text-[10px] font-mono tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-1.5 btn-press ${
              !product.inStock
                ? 'bg-black/50 cursor-not-allowed opacity-60'
                : 'bg-[#181513] hover:bg-[#A65B32]'
            }`}
          >
            {isInCart ? <Check className="w-3 h-3 text-emerald-300" /> : <Plus className="w-3 h-3" />}
            {!product.inStock ? 'Sold' : isInCart ? 'In Bag' : 'Claim 1-of-1'}
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-[10px] font-mono text-[#5C564E]">
            <span className="text-[#2D5A3F] font-bold bg-[#2D5A3F]/10 px-1.5 py-0.5 rounded-sm">
              {product.conditionRating}
            </span>
            <span>•</span>
            <span>{product.era}</span>
          </div>

          <h3 
            onClick={() => setSelectedProduct(product)}
            className="font-serif text-lg sm:text-xl font-bold text-[#181513] hover:text-[#A65B32] cursor-pointer transition-colors leading-snug line-clamp-1"
          >
            {product.title}
          </h3>

          <p className="font-sans text-xs text-[#5C564E] mt-1 line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing & Claim Button */}
        <div className="pt-3 border-t border-[#181513]/10 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#181513]">
                {formatPrice(product.price)}
              </span>
              {product.originalEstimatePrice && (
                <span className="font-mono text-[10px] text-[#6B6358] line-through">
                  {formatPrice(product.originalEstimatePrice)}
                </span>
              )}
            </div>
            <span className="block text-[9px] font-mono text-[#A65B32] font-semibold uppercase tracking-wider">
              📏 {product.measurements.pitToPit.split('/')[0]} Chest • {product.measurements.length.split('/')[0]} L
            </span>
          </div>

          <button
            disabled={!product.inStock}
            onClick={() => {
              if (product.inStock) addToCart(product);
            }}
            className={`px-3.5 py-2 text-[10px] font-mono tracking-widest uppercase transition-colors rounded-none btn-press ${
              !product.inStock
                ? 'bg-black/20 text-black/40 cursor-not-allowed'
                : isInCart
                ? 'bg-[#2D5A3F] text-white'
                : 'bg-[#181513] hover:bg-[#A65B32] text-white'
            }`}
          >
            {!product.inStock ? 'Sold' : isInCart ? 'In Bag' : 'Claim'}
          </button>
        </div>
      </div>
    </article>
  );
};
