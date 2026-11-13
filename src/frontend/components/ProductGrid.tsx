import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, LayoutGrid, Grid3X3, RotateCcw, Heart, Sparkles } from 'lucide-react';
import { Category, Product } from '../types';
import { ProductCard } from './ProductCard';
import { useCart } from '../context/CartContext';

interface ProductGridProps {
  products: Product[];
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch,
}) => {
  const { wishlist } = useCart();
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [wishlistOnly, setWishlistOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'condition'>('featured');
  const [gridCols, setGridCols] = useState<3 | 4>(3);

  const categories: { label: string; value: Category }[] = [
    { label: 'ALL DROPS', value: 'all' },
    { label: 'BOXY SHIRTS', value: 'boxy-shirts' },
    { label: 'DENIM & WORKWEAR', value: 'denim-workwear' },
    { label: 'LEATHER & JACKETS', value: 'leather-jackets' },
    { label: 'VINTAGE TEES', value: 'vintage-tees' },
    { label: 'DRESSES & CORSETS', value: 'dresses-corsets' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Wishlist only filter
        if (wishlistOnly && !wishlist.includes(p.id)) return false;

        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

        // Size filter
        if (sizeFilter !== 'all') {
          if (sizeFilter === 'M' && !p.size.includes('M')) return false;
          if (sizeFilter === 'L' && !p.size.includes('L')) return false;
          if (sizeFilter === 'XL' && !p.size.includes('XL')) return false;
          if (sizeFilter === 'S' && p.size !== 'S') return false;
          if (sizeFilter === 'Free Size' && p.size !== 'Free Size') return false;
        }

        // Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchSub = p.subtitle.toLowerCase().includes(q);
          const matchCode = p.referenceCode.toLowerCase().includes(q);
          const matchEra = p.era.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchSize = p.size.toLowerCase().includes(q);
          if (!matchTitle && !matchSub && !matchCode && !matchEra && !matchDesc && !matchSize) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'condition') return b.conditionRating.localeCompare(a.conditionRating);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, sizeFilter, wishlistOnly, wishlist, searchQuery, sortBy]);

  return (
    <section id="archive-catalog" className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#181513]/10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#E67E44] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DROP #24 INVENTORY • 1-OF-1 PIECES</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#181513]">
            Curated Archival Catalog
          </h2>
          <p className="font-sans text-sm text-[#5C564E] max-w-xl">
            Each piece is single-inventory. Sourced across international vintage flea markets, authenticated, steam sanitized, and measured in our studio.
          </p>
        </div>

        {/* Stats & Search Info */}
        <div className="text-left md:text-right font-mono text-xs text-[#5C564E]">
          <span className="font-bold text-[#181513] text-lg font-serif">
            {filteredProducts.length}
          </span>{' '}
          of {products.length} specimens available
          {searchQuery && (
            <div className="mt-1 flex items-center gap-2 text-[#E67E44]">
              <span>Results for "{searchQuery}"</span>
              <button onClick={onClearSearch} className="hover:underline flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Control Bar: Categories, Sizes, Wishlist & Sort */}
      <div className="py-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#181513]/10 text-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                onSelectCategory(cat.value);
                setWishlistOnly(false);
              }}
              className={`px-3.5 py-1.5 font-mono text-[11px] tracking-wider uppercase transition-all duration-200 ${
                selectedCategory === cat.value && !wishlistOnly
                  ? 'bg-[#181513] text-[#FAF7F2] font-bold'
                  : 'bg-[#EFE7DB] hover:bg-[#E2D8C9] text-[#5C564E]'
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* Wishlist Toggle Pill */}
          <button
            onClick={() => setWishlistOnly(!wishlistOnly)}
            className={`px-3.5 py-1.5 font-mono text-[11px] tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 ${
              wishlistOnly
                ? 'bg-[#E67E44] text-white font-bold'
                : 'bg-[#EFE7DB] hover:bg-[#E2D8C9] text-[#5C564E]'
            }`}
          >
            <Heart className={`w-3 h-3 ${wishlistOnly ? 'fill-current' : ''}`} />
            <span>SAVED ({wishlist.length})</span>
          </button>
        </div>

        {/* Secondary Filter Dropdowns & Controls */}
        <div className="flex items-center gap-3 ml-auto flex-wrap">
          {/* Size Filter */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#5C564E]" />
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="bg-[#EFE7DB] border border-[#181513]/15 px-2.5 py-1.5 text-[11px] font-mono outline-none text-[#181513] cursor-pointer"
              aria-label="Filter by size"
            >
              <option value="all">Size: All</option>
              <option value="S">Size S</option>
              <option value="M">Boxy M</option>
              <option value="L">Oversized L</option>
              <option value="XL">Relaxed XL</option>
              <option value="Free Size">Free Size</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#5C564E]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#EFE7DB] border border-[#181513]/15 px-2.5 py-1.5 text-[11px] font-mono outline-none text-[#181513] cursor-pointer"
              aria-label="Sort pieces by"
            >
              <option value="featured">Featured Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="condition">Condition Score</option>
            </select>
          </div>

          {/* Grid Size Toggle */}
          <div className="hidden lg:flex items-center border border-[#181513]/15 p-0.5 bg-[#EFE7DB]">
            <button
              onClick={() => setGridCols(3)}
              className={`p-1 ${gridCols === 3 ? 'bg-[#181513] text-white' : 'text-[#5C564E]'}`}
              title="3 Columns"
              aria-label="3 Columns"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={`p-1 ${gridCols === 4 ? 'bg-[#181513] text-white' : 'text-[#5C564E]'}`}
              title="4 Columns"
              aria-label="4 Columns"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div
          className={`mt-8 grid gap-6 sm:gap-8 ${
            gridCols === 4
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-[#EFE7DB] border border-[#181513]/10 mt-8 p-8 space-y-4">
          <p className="font-serif italic text-2xl text-[#5C564E]">
            No 1-of-1 pieces found matching your filter selection.
          </p>
          <p className="font-sans text-xs text-[#8C857B] max-w-md mx-auto">
            Our thrift drops sell out quickly. Reset your filters or turn on Drop Alerts to be first in line when new drops go live.
          </p>
          <button
            onClick={() => {
              onSelectCategory('all');
              setSizeFilter('all');
              setWishlistOnly(false);
              onClearSearch();
            }}
            className="px-6 py-2.5 bg-[#181513] text-white font-mono text-xs tracking-wider uppercase hover:bg-[#E67E44] transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
