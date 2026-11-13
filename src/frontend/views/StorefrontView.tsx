import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { DropCountdownRibbon } from '../components/DropCountdownRibbon';
import { Header } from '../components/Header';
import { MarqueeTicker } from '../components/MarqueeTicker';
import { EditorialHero } from '../components/EditorialHero';
import { LookbookSplit } from '../components/LookbookSplit';
import { ProductGrid } from '../components/ProductGrid';
import { InstagramFeed } from '../components/InstagramFeed';
import { Footer } from '../components/Footer';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { Category } from '../../database/schema';

interface StorefrontViewProps {
  onOpenCommandPalette: () => void;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
}

export const StorefrontView: React.FC<StorefrontViewProps> = ({
  onOpenCommandPalette,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { products } = useStore();

  const handleExploreClick = () => {
    const el = document.getElementById('archive-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col relative selection:bg-[#E67E44] selection:text-white">
      {/* Top Drop Countdown Ribbon with Instagram & Indian Rupee Badge */}
      <DropCountdownRibbon />

      {/* Main Luxury Header with Command Palette Trigger (⌘K) */}
      <Header
        onSearchQuery={(q) => setSearchQuery(q)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        activeCategory={selectedCategory}
        onOpenCommandPalette={onOpenCommandPalette}
      />

      {/* Ticker Tape Ribbon */}
      <MarqueeTicker />

      {/* $10,000 Luxury Editorial Hero with Specimen Dossier */}
      <EditorialHero onExploreClick={handleExploreClick} />

      {/* 45 / 55 Campaign Lookbook with Interactive SVG Hotspots ("Shop The Look") */}
      <LookbookSplit />

      {/* 1-of-1 Catalog Grid Connected to Live Inventory */}
      <ProductGrid
        products={products as any}
        selectedCategory={selectedCategory as any}
        onSelectCategory={setSelectedCategory as any}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery('')}
      />

      {/* Instagram Community Feed (@vintagevoguee_in) */}
      <InstagramFeed />

      {/* Comprehensive Kota Hub Studio Location & Logistics Footer */}
      <Footer />

      {/* Floating Glassmorphic Mobile Action Dock (Visible on Mobile) */}
      <MobileBottomNav onOpenCommandPalette={onOpenCommandPalette} />
    </div>
  );
};

