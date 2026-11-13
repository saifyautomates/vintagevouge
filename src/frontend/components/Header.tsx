import React, { useState } from 'react';
import { ShoppingBag, Search, Heart, Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Category } from '../types';

interface HeaderProps {
  onSearchQuery?: (q: string) => void;
  onSelectCategory?: (category: Category) => void;
  activeCategory?: Category;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchQuery, onSelectCategory, activeCategory, onOpenCommandPalette }) => {
  const { totalItems, setIsCartOpen, wishlist, setIsDropModalOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchQuery) onSearchQuery(searchInput);
    setSearchOpen(false);
  };

  const navItems: { label: string; category: Category }[] = [
    { label: 'ALL DROPS', category: 'all' },
    { label: 'BOXY SHIRTS', category: 'boxy-shirts' },
    { label: 'DENIM & WORKWEAR', category: 'denim-workwear' },
    { label: 'LEATHER & JACKETS', category: 'leather-jackets' },
    { label: 'VINTAGE TEES', category: 'vintage-tees' },
    { label: 'DRESSES & CORSETS', category: 'dresses-corsets' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#181513]/10 transition-all duration-300">
      {/* Brand & Main Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between">
        {/* Left: Mobile hamburger & Search trigger */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#181513] hover:opacity-75 transition-opacity"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              if (onOpenCommandPalette) onOpenCommandPalette();
              else setSearchOpen(!searchOpen);
            }}
            className="flex items-center gap-2 text-xs tracking-wider uppercase text-[#181513]/80 hover:text-[#181513] transition-colors group"
            aria-label="Search Collection"
          >
            <Search className="w-4 h-4 text-[#E67E44] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-mono text-[11px] tracking-widest">SEARCH ARCHIVE</span>
            <span className="hidden md:inline-flex items-center text-[9px] font-mono bg-[#181513]/5 border border-[#181513]/15 px-1.5 py-0.5 rounded text-[#5C564E]">
              ⌘K
            </span>
          </button>
        </div>

        {/* Center: Brand Wordmark (Vintage Vogue India) */}
        <div className="text-center">
          <a href="#" className="inline-block group">
            <h1 className="font-display tracking-[0.25em] text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-[#181513] group-hover:text-[#E67E44] transition-colors">
              VINTAGE VOGUE
            </h1>
            <p className="font-serif italic text-xs tracking-[0.22em] text-[#5C564E] -mt-0.5">
              Curated Thrift & Archival Western Wear • India
            </p>
          </a>
        </div>

        {/* Right: Drop Alert, Wishlist & Bag */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            onClick={() => setIsDropModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#EFE7DB] hover:bg-[#E67E44] hover:text-white border border-[#181513]/15 text-[10px] font-mono tracking-widest uppercase transition-all"
          >
            <Sparkles className="w-3 h-3 text-[#E67E44] group-hover:text-white" />
            <span>DROP #24 ALERTS</span>
          </button>

          {/* Wishlist Button */}
          <div className="relative">
            <button
              onClick={() => {
                const el = document.getElementById('archive-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-2 text-[#181513]/80 hover:text-[#E67E44] transition-colors"
              title="Saved 1-of-1 pieces"
              aria-label="Saved pieces"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E67E44] text-white text-[9px] font-mono flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>
          </div>

          {/* Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2.5 px-3.5 py-2 border border-[#181513]/20 hover:border-[#181513] bg-[#EFE7DB] hover:bg-[#FAF7F2] transition-all group"
            aria-label="Open Acquisition Bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#181513] group-hover:scale-105 transition-transform" />
            <span className="hidden sm:inline text-[11px] font-mono tracking-widest uppercase text-[#181513]">
              BAG
            </span>
            <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[11px] font-mono font-bold bg-[#181513] text-white rounded-full">
              {totalItems}
            </span>
          </button>
        </div>
      </div>

      {/* Desktop Department Navigation */}
      <nav className="hidden lg:block border-t border-[#181513]/10 bg-[#FAF7F2]/90">
        <div className="max-w-7xl mx-auto px-8 flex justify-center items-center gap-8 py-2.5">
          {navItems.map((item) => {
            const isActive = activeCategory === item.category;
            return (
              <button
                key={item.category}
                onClick={() => onSelectCategory && onSelectCategory(item.category)}
                className={`text-[11px] font-mono tracking-widest-plus uppercase py-1 transition-all relative group ${
                  isActive ? 'text-[#E67E44] font-bold' : 'text-[#5C564E] hover:text-[#181513]'
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#E67E44] transition-transform duration-300 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </nav>

      {/* Search Overlay Drawer */}
      {searchOpen && (
        <div className="border-t border-[#181513]/15 bg-[#FAF7F2] px-4 py-4 sm:py-6 shadow-inner animate-fadeIn">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
              <Search className="w-5 h-5 text-[#E67E44]" />
              <input
                type="text"
                placeholder="Search boxy shirts, denim, leather jackets, dresses, sizes (e.g., Boxy M, Denim, 90s)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                autoFocus
                className="w-full bg-transparent border-b border-[#181513]/30 focus:border-[#E67E44] py-2 text-sm sm:text-base font-serif italic placeholder:not-italic placeholder:text-[#5C564E]/60 outline-none text-[#181513]"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-[#181513] text-white text-xs font-mono tracking-widest uppercase hover:bg-[#E67E44] transition-colors"
              >
                Find
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  if (onSearchQuery) onSearchQuery('');
                  setSearchOpen(false);
                }}
                className="p-2 text-[#5C564E] hover:text-[#181513]"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#181513]/10 bg-[#FAF7F2] px-6 py-6 space-y-4 shadow-xl animate-fadeIn">
          <div className="text-[10px] font-mono tracking-widest text-[#5C564E] uppercase mb-2">
            CURATED DEPARTMENTS
          </div>
          {navItems.map((item) => (
            <button
              key={item.category}
              onClick={() => {
                if (onSelectCategory) onSelectCategory(item.category);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left font-serif text-lg tracking-wide py-1.5 border-b border-[#181513]/5 ${
                activeCategory === item.category ? 'text-[#E67E44] font-semibold' : 'text-[#181513]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 flex flex-col gap-2">
            <a
              href="https://www.instagram.com/vintagevoguee_in/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-xs font-mono p-3 bg-[#EFE7DB] text-[#181513] font-bold"
            >
              <span>FOLLOW @VINTAGEVOGUEE_IN ON INSTAGRAM</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
