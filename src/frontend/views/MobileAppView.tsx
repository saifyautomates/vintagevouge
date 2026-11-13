import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Sparkles,
  Flame,
  Search,
  Filter,
  Check,
  ChevronRight,
  SlidersHorizontal,
  X,
  CreditCard,
  Maximize2,
  Minimize2,
  Clock,
  Layers,
  ArrowRight,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Ruler
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { ProductRecord as Product, Category } from '../../database/schema';
import { playClickSound, playSuccessChime } from '../utils/audio';

interface Story {
  id: string;
  title: string;
  tag: string;
  image: string;
  caption: string;
  subcaption: string;
}

const STORIES: Story[] = [
  {
    id: 's1',
    title: 'Drop #24',
    tag: 'NEW',
    image: '/assets/images/boxy-embroidered-shirt.jpg',
    caption: 'DROP #24 — THE AUTUMN NOMAD',
    subcaption: '10 rare curated pieces live tonight from Tokyo & Osaka archives.'
  },
  {
    id: 's2',
    title: 'Kota Studio',
    tag: 'HUB',
    image: '/assets/images/vintage-denim-trucker.jpg',
    caption: 'STEAM SANITIZED IN KOTA',
    subcaption: 'Every specimen dry-pressed with lavender steam before dispatch.'
  },
  {
    id: 's3',
    title: 'Tape Guide',
    tag: 'FIT',
    image: '/assets/images/vintage-leather-bomber.jpg',
    caption: 'HOW WE MEASURE 1-OF-1s',
    subcaption: 'Flat-laid tape method: Pit-to-pit & length never lie.'
  },
  {
    id: 's4',
    title: 'Selvedge',
    tag: 'RAW',
    image: '/assets/images/corduroy-overshirt.jpg',
    caption: '14OZ RAW JAPANESE DENIM',
    subcaption: 'Vintage shuttle loom character with natural honeycombing.'
  },
  {
    id: 's5',
    title: 'Community',
    tag: 'FITS',
    image: '/assets/images/retro-floral-dress.jpg',
    caption: 'TAG @VINTAGEVOGUEE_IN',
    subcaption: 'Get featured on our weekly community lookbook reel.'
  }
];

export const MobileAppView: React.FC = () => {
  const { products, setViewMode } = useStore();
  const {
    cart,
    addToCart,
    wishlist,
    toggleWishlist,
    formatPrice,
    setIsCartOpen,
    setIsDropModalOpen,
    setSelectedProduct,
    currency,
    setCurrency
  } = useCart();

  const handleToggleCurrency = () => {
    if (currency === 'INR') setCurrency('USD');
    else if (currency === 'USD') setCurrency('EUR');
    else setCurrency('INR');
  };

  const [activeTab, setActiveTab] = useState<'shop' | 'drops' | 'saved' | 'pos'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isFramed, setIsFramed] = useState(true);
  const [quickSpecimen, setQuickSpecimen] = useState<Product | null>(null);

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'All 1-of-1s' },
    { id: 'boxy-shirts', label: 'Boxy Shirts' },
    { id: 'denim-workwear', label: 'Denim' },
    { id: 'leather-jackets', label: 'Leather' },
    { id: 'vintage-tees', label: 'Tees' },
    { id: 'dresses-corsets', label: 'Dresses' }
  ];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.referenceCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Story click handler
  const handleOpenStory = (story: Story) => {
    playClickSound();
    setActiveStory(story);
    setStoryProgress(0);
  };

  return (
    <div className={`min-h-screen bg-[#141210] flex flex-col items-center justify-start ${isFramed ? 'py-4 sm:py-8 px-2' : 'p-0'}`}>
      {/* Device Viewport Toggle Controls Bar on Desktop */}
      <div className="w-full max-w-md flex items-center justify-between mb-3 px-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-[11px] font-mono uppercase text-white/70 tracking-wider">
            Mobile WebApp Engine • Port 1234
          </span>
        </div>
        <button
          onClick={() => {
            playClickSound();
            setIsFramed(!isFramed);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono transition-all"
        >
          {isFramed ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          <span>{isFramed ? 'Full Width' : 'Frame Shell'}</span>
        </button>
      </div>

      {/* Smartphone Device Frame Container */}
      <div
        className={`w-full bg-[#FAF7F2] text-[#181513] overflow-hidden flex flex-col relative transition-all duration-300 ${
          isFramed
            ? 'max-w-[410px] rounded-[48px] border-[10px] border-[#2A2623] shadow-[0_25px_60px_rgba(0,0,0,0.8)] min-h-[850px] max-h-[890px]'
            : 'max-w-2xl min-h-screen'
        }`}
      >
        {/* Dynamic Island / Bezel Status Bar */}
        <div className="bg-[#181513] text-white pt-2.5 pb-2 px-6 flex items-center justify-between text-[11px] font-mono select-none">
          <span>9:41</span>
          {/* Dynamic Island pill */}
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E67E44]"></span>
            <span className="text-[9px] font-mono text-white/70">VV KOTA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <div className="w-4 h-2 border border-white/60 rounded-sm p-[1px] flex items-center">
              <div className="w-2.5 h-full bg-white"></div>
            </div>
          </div>
        </div>

        {/* Mobile Top Header */}
        <header className="bg-[#FAF7F2] border-b border-[#181513]/10 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-black tracking-widest text-base">VINTAGE VOGUE</span>
              <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-[#E67E44] text-white">
                IN
              </span>
            </div>
            <div className="text-[9px] font-mono text-[#8C827A] tracking-wider uppercase">
              1-of-1 Vault • Kota Hub
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full border border-[#E67E44]/40 bg-[#E67E44]/10 text-[10px] font-mono font-bold text-[#E67E44]">
              ₹ INR
            </span>

            <button
              onClick={() => {
                playClickSound();
                setIsCartOpen(true);
              }}
              className="relative p-2 rounded-full hover:bg-[#181513]/5 text-[#181513]"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E67E44] text-white text-[9px] font-mono font-bold flex items-center justify-center animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Scrollable Mobile App Body */}
        <div className="flex-1 overflow-y-auto pb-24 scrollbar-none">
          {/* TAB 1: SHOP CATALOG */}
          {activeTab === 'shop' && (
            <div className="space-y-4">
              {/* Instagram Stories Strip */}
              <div className="px-4 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C827A] font-bold">
                    Curator Stories • Kota Studio
                  </span>
                  <span className="text-[9px] font-mono text-[#E67E44]">Tap to view</span>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {STORIES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleOpenStory(s)}
                      className="flex flex-col items-center gap-1 group flex-shrink-0"
                    >
                      <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#E67E44] via-[#C4975A] to-purple-500 shadow-sm group-hover:scale-105 transition-transform">
                        <img
                          src={s.image}
                          alt={s.title}
                          className="w-full h-full rounded-full object-cover border-2 border-[#FAF7F2]"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#181513] font-medium tracking-tight">
                        {s.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Hero Banner */}
              <div className="mx-4 relative rounded-2xl overflow-hidden bg-[#181513] text-white p-5 shadow-lg">
                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E67E44]/20 border border-[#E67E44] text-[#E67E44] text-[9px] font-mono font-bold">
                    <Flame className="w-3 h-3" />
                    <span>DROP #24 LIVE NOW</span>
                  </div>
                  <h2 className="text-xl font-serif font-black tracking-tight leading-tight">
                    Japanese Archive & Denim Specimens
                  </h2>
                  <p className="text-[11px] font-mono text-white/70">
                    Sourced in Tokyo. Hand-curated in Kota. Each item is strictly 1-of-1.
                  </p>
                  <button
                    onClick={() => {
                      playClickSound();
                      setSelectedProduct(products[0]);
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FAF7F2] text-[#181513] rounded-full text-xs font-mono font-bold hover:bg-white transition-all shadow-md"
                  >
                    <span>Claim Specimen #01</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Background wash */}
                <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-30 pointer-events-none">
                  <img
                    src="/assets/images/boxy-embroidered-shirt.jpg"
                    alt="specimen"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Search & Category Pills */}
              <div className="px-4 space-y-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C827A]" />
                  <input
                    type="text"
                    placeholder="Search boxy shirts, leather, denim..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#EFECE6] border border-[#181513]/10 rounded-xl pl-8 pr-4 py-2 text-xs font-mono text-[#181513] placeholder-[#8C827A] focus:outline-none focus:border-[#E67E44]"
                  />
                </div>

                {/* Horizontal Category Pill Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        playClickSound();
                        setSelectedCategory(cat.id);
                      }}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-mono whitespace-nowrap uppercase tracking-wider transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-[#181513] text-white font-bold shadow'
                          : 'bg-[#EFECE6] text-[#6B635B] hover:text-[#181513]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2-Column Product Grid */}
              <div className="px-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-[#181513]">
                    Archive Vault ({filteredProducts.length})
                  </span>
                  <span className="text-[10px] font-mono text-[#8C827A]">1-of-1 Authenticated</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {filteredProducts.map((p) => {
                    const isWishlisted = wishlist.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        className="bg-white rounded-2xl border border-[#181513]/10 overflow-hidden flex flex-col group relative shadow-sm"
                      >
                        {/* Image Container */}
                        <div
                          className="relative aspect-[4/5] overflow-hidden cursor-pointer bg-[#EFECE6]"
                          onClick={() => {
                            playClickSound();
                            setQuickSpecimen(p);
                          }}
                        >
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/assets/images/boxy-embroidered-shirt.jpg';
                            }}
                          />

                          {/* Reference Code Tag */}
                          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white font-mono text-[9px] font-bold">
                            {p.referenceCode}
                          </div>

                          {/* Wishlist Heart */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playClickSound();
                              toggleWishlist(p.id);
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-[#181513] hover:text-red-500 shadow-sm transition-colors"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isWishlisted ? 'fill-red-500 text-red-500' : ''
                              }`}
                            />
                          </button>

                          {/* Stock Overlay */}
                          {!p.inStock && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-2 text-center">
                              <span className="px-2 py-1 rounded bg-red-600 text-white font-mono text-[9px] font-bold tracking-widest uppercase shadow">
                                CLAIMED / SOLD
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Card Info */}
                        <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1.5">
                          <div>
                            <div className="flex items-center justify-between text-[9px] font-mono text-[#8C827A]">
                              <span>{p.size}</span>
                              <span className="text-emerald-600 font-bold">{p.conditionRating.split(' ')[0]}</span>
                            </div>
                            <h3
                              onClick={() => {
                                playClickSound();
                                setQuickSpecimen(p);
                              }}
                              className="font-serif font-bold text-xs text-[#181513] line-clamp-1 cursor-pointer hover:text-[#E67E44] transition-colors mt-0.5"
                            >
                              {p.title}
                            </h3>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-[#181513]/5">
                            <span className="font-mono font-bold text-xs text-[#181513]">
                              {formatPrice(p.price)}
                            </span>

                            <button
                              disabled={!p.inStock}
                              onClick={() => {
                                if (p.inStock) {
                                  playSuccessChime();
                                  addToCart(p);
                                }
                              }}
                              className={`p-1.5 rounded-lg text-[10px] font-mono transition-all ${
                                p.inStock
                                  ? 'bg-[#181513] hover:bg-[#E67E44] text-white'
                                  : 'bg-black/10 text-black/30 cursor-not-allowed'
                              }`}
                              title={p.inStock ? 'Add 1-of-1 to Bag' : 'Sold Out'}
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DROPS TIMELINE */}
          {activeTab === 'drops' && (
            <div className="p-4 space-y-4">
              <div className="bg-[#181513] text-white p-5 rounded-2xl space-y-3">
                <span className="px-2 py-0.5 rounded bg-[#E67E44] text-[9px] font-mono font-bold uppercase tracking-wider">
                  Upcoming Drop #24
                </span>
                <h3 className="font-serif text-lg font-bold">The Autumn Nomad Collection</h3>
                <p className="text-xs font-mono text-white/70">
                  Exclusive vault batch drops in:
                </p>

                {/* Countdown Display */}
                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <span className="block text-base font-bold text-[#E67E44]">01</span>
                    <span className="text-[8px] text-white/60">DAYS</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-lg">
                    <span className="block text-base font-bold text-[#E67E44]">14</span>
                    <span className="text-[8px] text-white/60">HOURS</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-lg">
                    <span className="block text-base font-bold text-[#E67E44]">22</span>
                    <span className="text-[8px] text-white/60">MINS</span>
                  </div>
                  <div className="bg-white/10 p-2 rounded-lg">
                    <span className="block text-base font-bold text-[#E67E44]">48</span>
                    <span className="text-[8px] text-white/60">SECS</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playClickSound();
                    setIsDropModalOpen(true);
                  }}
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-[#E67E44] to-[#C4975A] text-white font-mono text-xs font-bold shadow-lg"
                >
                  Join VIP WhatsApp Early Access
                </button>
              </div>

              {/* Past Archive drops */}
              <div>
                <h4 className="font-serif font-bold text-sm text-[#181513] mb-2">Past Archived Drops</h4>
                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 bg-white border border-[#181513]/10 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold">Drop #23 — Tokyo Cyber Vintage</div>
                      <div className="text-[10px] text-[#8C827A]">October 2026 • 12/12 Sold Out in 8 mins</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-black/10 text-[9px] font-bold">ARCHIVED</span>
                  </div>
                  <div className="p-3 bg-white border border-[#181513]/10 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold">Drop #22 — Western Ranch & Leather</div>
                      <div className="text-[10px] text-[#8C827A]">September 2026 • 15/15 Sold Out in 12 mins</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-black/10 text-[9px] font-bold">ARCHIVED</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SAVED WISHLIST */}
          {activeTab === 'saved' && (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base">Saved Specimens ({wishlist.length})</h3>
                <span className="text-xs font-mono text-[#8C827A]">Syncs locally</span>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#181513]/20 p-6 space-y-2">
                  <Heart className="w-8 h-8 text-[#8C827A] mx-auto stroke-[1.5]" />
                  <p className="font-serif font-bold text-sm">No saved specimens yet</p>
                  <p className="text-xs font-mono text-[#8C827A]">
                    Tap the heart icon on any 1-of-1 piece to save it to your wishlist.
                  </p>
                  <button
                    onClick={() => { playClickSound(); setActiveTab('shop'); }}
                    className="mt-3 px-4 py-2 rounded-full bg-[#181513] text-white text-xs font-mono"
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {products
                    .filter(p => wishlist.includes(p.id))
                    .map(p => (
                      <div
                        key={p.id}
                        className="p-3 bg-white rounded-xl border border-[#181513]/10 flex items-center justify-between gap-3 shadow-sm"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-14 h-16 object-cover rounded-lg bg-[#EFECE6]"
                        />
                        <div className="flex-1">
                          <span className="text-[10px] font-mono text-[#E67E44] font-bold">{p.referenceCode}</span>
                          <h4 className="font-serif font-bold text-xs text-[#181513] line-clamp-1">{p.title}</h4>
                          <span className="font-mono text-xs font-bold text-[#181513]">{formatPrice(p.price)}</span>
                        </div>
                        <button
                          disabled={!p.inStock}
                          onClick={() => {
                            if (p.inStock) {
                              playSuccessChime();
                              addToCart(p);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${
                            p.inStock ? 'bg-[#E67E44] text-white' : 'bg-black/10 text-black/30'
                          }`}
                        >
                          {p.inStock ? 'Acquire' : 'Sold'}
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: QUICK IN-STORE POS ACCESS */}
          {activeTab === 'pos' && (
            <div className="p-4 space-y-4">
              <div className="bg-[#181513] text-white p-5 rounded-2xl space-y-3">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold uppercase tracking-wider">
                  Counter Terminal
                </span>
                <h3 className="font-serif text-lg font-bold">Launch Full Register</h3>
                <p className="text-xs font-mono text-white/70">
                  Switch view to the full desktop/tablet omnichannel POS with Barcode scanner, UPI QR, and thermal receipt printing.
                </p>
                <button
                  onClick={() => {
                    playClickSound();
                    setViewMode('pos');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#E67E44] text-white font-mono text-xs font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Open Full POS Register</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Mobile Bottom Navigation Bar */}
        <nav className="absolute bottom-0 inset-x-0 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#181513]/10 px-4 py-2.5 flex items-center justify-around z-30 shadow-lg">
          <button
            onClick={() => { playClickSound(); setActiveTab('shop'); }}
            className={`flex flex-col items-center gap-1 font-mono text-[9px] transition-colors ${
              activeTab === 'shop' ? 'text-[#E67E44] font-bold' : 'text-[#8C827A] hover:text-[#181513]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Vault</span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveTab('drops'); }}
            className={`flex flex-col items-center gap-1 font-mono text-[9px] transition-colors ${
              activeTab === 'drops' ? 'text-[#E67E44] font-bold' : 'text-[#8C827A] hover:text-[#181513]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Drops</span>
          </button>

          {/* Cart Center Pill */}
          <button
            onClick={() => {
              playClickSound();
              setIsCartOpen(true);
            }}
            className="relative -mt-4 w-12 h-12 rounded-full bg-[#181513] text-white shadow-xl flex items-center justify-center border-2 border-[#FAF7F2] hover:scale-105 transition-transform"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E67E44] text-white text-[9px] font-mono font-bold flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { playClickSound(); setActiveTab('saved'); }}
            className={`flex flex-col items-center gap-1 font-mono text-[9px] transition-colors ${
              activeTab === 'saved' ? 'text-[#E67E44] font-bold' : 'text-[#8C827A] hover:text-[#181513]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved ({wishlist.length})</span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveTab('pos'); }}
            className={`flex flex-col items-center gap-1 font-mono text-[9px] transition-colors ${
              activeTab === 'pos' ? 'text-[#E67E44] font-bold' : 'text-[#8C827A] hover:text-[#181513]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>POS Hub</span>
          </button>
        </nav>

        {/* BOTTOM SHEET: QUICK SPECIMEN INSPECTOR */}
        {quickSpecimen && (
          <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
            <div className="bg-[#FAF7F2] rounded-t-3xl max-h-[85%] overflow-y-auto p-5 space-y-4 animate-slideUp">
              <div className="flex items-center justify-between border-b border-[#181513]/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#E67E44] font-bold">{quickSpecimen.referenceCode}</span>
                  <h3 className="font-serif font-black text-base">{quickSpecimen.title}</h3>
                </div>
                <button
                  onClick={() => setQuickSpecimen(null)}
                  className="p-1 rounded-full hover:bg-black/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black">
                <img
                  src={quickSpecimen.images[0]}
                  alt={quickSpecimen.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Quick Details */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[#EFECE6]">
                  <span className="text-[9px] text-[#8C827A] block">AUTHENTIC FIT</span>
                  <span className="font-bold text-[#181513]">{quickSpecimen.size}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#EFECE6]">
                  <span className="text-[9px] text-[#8C827A] block">CONDITION SCORE</span>
                  <span className="font-bold text-emerald-700">{quickSpecimen.conditionRating}</span>
                </div>
              </div>

              {/* Exact Measurements Table */}
              <div className="border border-[#181513]/10 rounded-xl p-3 bg-white font-mono text-xs">
                <div className="flex items-center gap-1.5 text-[10px] text-[#8C827A] uppercase font-bold mb-2">
                  <Ruler className="w-3.5 h-3.5 text-[#E67E44]" />
                  <span>Exact Flat-Laid Tape (Inches)</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-center">
                  <div className="bg-[#FAF7F2] p-1.5 rounded">
                    <span className="text-[8px] text-[#8C827A] block">P2P</span>
                    <span className="font-bold">{quickSpecimen.measurements.pitToPit}</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-1.5 rounded">
                    <span className="text-[8px] text-[#8C827A] block">LENGTH</span>
                    <span className="font-bold">{quickSpecimen.measurements.length}</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-1.5 rounded">
                    <span className="text-[8px] text-[#8C827A] block">SHOULDER</span>
                    <span className="font-bold">{quickSpecimen.measurements.shoulders}</span>
                  </div>
                  <div className="bg-[#FAF7F2] p-1.5 rounded">
                    <span className="text-[8px] text-[#8C827A] block">SLEEVE</span>
                    <span className="font-bold">{quickSpecimen.measurements.sleeve}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-[10px] font-mono text-[#8C827A] block">TOTAL ACQUISITION</span>
                  <span className="font-mono font-bold text-lg">{formatPrice(quickSpecimen.price)}</span>
                </div>

                <button
                  disabled={!quickSpecimen.inStock}
                  onClick={() => {
                    if (quickSpecimen.inStock) {
                      playSuccessChime();
                      addToCart(quickSpecimen);
                      setQuickSpecimen(null);
                      setIsCartOpen(true);
                    }
                  }}
                  className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold shadow-md flex items-center gap-2 ${
                    quickSpecimen.inStock
                      ? 'bg-[#E67E44] text-white hover:bg-[#d57038]'
                      : 'bg-black/10 text-black/30 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{quickSpecimen.inStock ? 'Acquire 1-of-1' : 'Claimed Out'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FULLSCREEN VERTICAL STORY VIEWER MODAL */}
        {activeStory && (
          <div className="absolute inset-0 z-50 bg-black text-white flex flex-col justify-between p-4 animate-fadeIn">
            {/* Story Progress Bar */}
            <div className="flex items-center gap-1.5 pt-2">
              <div className="flex-1 bg-white/20 h-1 rounded-full overflow-hidden">
                <div className="bg-white h-full animate-[progress_5s_linear_forwards] w-full"></div>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="p-1 rounded-full text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Header */}
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-white/50 overflow-hidden">
                  <img src={activeStory.image} alt={activeStory.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="font-bold text-xs">vintagevoguee_in</span>
                  <span className="text-[10px] font-mono text-white/60 ml-2">Kota Studio • 2h</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-white/20 text-[9px] font-mono font-bold">
                {activeStory.tag}
              </span>
            </div>

            {/* Center Story Visual */}
            <div className="my-auto py-6 flex flex-col items-center text-center space-y-4">
              <div className="w-56 h-72 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                <img
                  src={activeStory.image}
                  alt={activeStory.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-serif font-black text-lg text-[#E67E44]">{activeStory.caption}</h3>
                <p className="text-xs font-mono text-white/80 max-w-xs mt-1">{activeStory.subcaption}</p>
              </div>
            </div>

            {/* Story Footer CTA */}
            <div className="pb-6">
              <button
                onClick={() => {
                  playClickSound();
                  setActiveStory(null);
                  setActiveTab('shop');
                }}
                className="w-full py-3 rounded-full bg-[#E67E44] text-white font-mono text-xs font-bold tracking-wider uppercase shadow-xl flex items-center justify-center gap-2"
              >
                <span>View Featured Specimen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
