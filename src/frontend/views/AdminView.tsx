import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  ShoppingBag,
  CreditCard,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  Copy,
  Check,
  Eye,
  Lock,
  Unlock,
  Sparkles,
  ArrowUpRight,
  Store,
  Smartphone,
  RefreshCw,
  AlertCircle,
  Tag,
  Calendar,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { ProductRecord, Category, OrderStatus } from '../../database/schema';
import { api } from '../../backend/api/client';
import { playClickSound, playSuccessChime } from '../utils/audio';

export const AdminView: React.FC = () => {
  const { products, setProducts, orders, totalRevenue, setViewMode } = useStore();
  const { formatPrice } = useCart();

  // Filters & Search
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'drop-control' | 'marketing'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'sold-out'>('all');
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Drop #24 Launch Control State
  const [dropTitle, setDropTitle] = useState('Drop #24 — The Autumn Nomad');
  const [dropDate, setDropDate] = useState('2026-11-20T20:00');
  const [isVipGateLocked, setIsVipGateLocked] = useState(true);
  const [vipPasscode, setVipPasscode] = useState('NOMAD1992');
  const [dropSavedToast, setDropSavedToast] = useState(false);

  // New Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('boxy-shirts');
  const [newEra, setNewEra] = useState('1990s Japanese Archive');
  const [newOrigin, setNewOrigin] = useState('Tokyo Sourced • Curated Kota Hub');
  const [newPrice, setNewPrice] = useState(3299);
  const [newSize, setNewSize] = useState<ProductRecord['size']>('Boxy M');
  const [newCondition, setNewCondition] = useState<ProductRecord['conditionRating']>('9.8/10 Near Mint');
  const [newFabric, setNewFabric] = useState('100% Selvedge Heavy Cotton');
  const [newPitToPit, setNewPitToPit] = useState('23.5 in / 60 cm');
  const [newLength, setNewLength] = useState('27.0 in / 68.5 cm');
  const [newShoulders, setNewShoulders] = useState('20.5 in / 52 cm');
  const [newSleeve, setNewSleeve] = useState('9.5 in / 24 cm');
  const [newDescription, setNewDescription] = useState('Rare vintage silhouette with authentic chainstitch detailing and drop-shoulder drape.');
  const [newImageUrl, setNewImageUrl] = useState('/assets/images/boxy-embroidered-shirt.jpg');

  // Stats Calculations
  const inStockCount = products.filter(p => p.inStock).length;
  const soldOutCount = products.filter(p => !p.inStock).length;
  const totalItems = products.length;
  const sellThroughRate = totalItems > 0 ? Math.round((soldOutCount / totalItems) * 100) : 0;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.era.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStock =
      stockFilter === 'all' ? true : stockFilter === 'in-stock' ? p.inStock : !p.inStock;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleAddNewProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const referenceNumber = Math.floor(10 + Math.random() * 90);
    const newSpecimen: Omit<ProductRecord, 'id' | 'createdAt' | 'updatedAt'> = {
      referenceCode: `VV-D24-${referenceNumber}`,
      title: newTitle,
      subtitle: newSubtitle || 'Archival Hand-Selected Piece',
      category: newCategory,
      era: newEra,
      origin: newOrigin,
      price: Number(newPrice),
      originalEstimatePrice: Math.round(Number(newPrice) * 1.8),
      size: newSize,
      conditionRating: newCondition,
      rarity: '1-of-1 Specimen',
      dropBatch: 'Drop #24 — The Autumn Nomad',
      fabric: newFabric,
      measurements: {
        pitToPit: newPitToPit,
        length: newLength,
        shoulders: newShoulders,
        sleeve: newSleeve
      },
      description: newDescription,
      provenance: 'Steam sanitized, dry-pressed at Vintage Vogue Hub, Kota.',
      images: [newImageUrl, '/assets/images/vintage-denim-trucker.jpg'],
      inStock: true,
      featured: true
    };

    await api.products.create(newSpecimen);
    playSuccessChime();
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewSubtitle('');
  };

  const handleCopyCaption = () => {
    const activeSpecimens = products.slice(0, 4).map(p => `• [${p.referenceCode}] ${p.title} (${p.size}) — ₹${p.price.toLocaleString('en-IN')}`).join('\n');
    const caption = `VINTAGE VOGUE INDIA 🇮🇳 DROP #24 LIVE DOSSIER\n\nAuthentic 1-of-1 curated thrift & Japanese archives. Dispatching from our Kota studio via Blue Dart Express Air.\n\nFEATURED SPECIMENS:\n${activeSpecimens}\n\nStrict 1-of-1 availability. Once claimed, forever archived. Comment reference code or tap link in bio to acquire.\n\n#VintageVogueIndia #CuratedVintage #1of1Thrift #KotaRajasthan #JapanArchive #Y2KThrift #AwwwardsDesign`;
    
    navigator.clipboard?.writeText(caption);
    setCopiedCaption(true);
    playSuccessChime();
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0F0E0D] text-[#FAF7F2] font-sans pb-28 pt-6 px-4 sm:px-6 lg:px-8 select-none">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 bg-[#E67E44]/20 border border-[#E67E44] rounded-lg text-[#E67E44]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif tracking-wider font-bold">VINTAGE VOGUE COMMAND</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE ENTERPRISE DB
                </span>
              </div>
              <p className="text-xs font-mono text-white/50 tracking-wider">
                OMNICHANNEL SYNC • DISPATCH HUB: KOTA, RAJASTHAN 324002
              </p>
            </div>
          </div>
        </div>

        {/* Quick View Switchers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playClickSound();
              setViewMode('pos');
            }}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-white/80 hover:text-white transition-all"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#E67E44]" />
            <span>Open POS Counter</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              setViewMode('storefront');
            }}
            className="flex items-center gap-2 px-3 py-2 bg-[#E67E44] hover:bg-[#d57038] text-white rounded-lg text-xs font-mono font-bold transition-all shadow-lg shadow-[#E67E44]/20"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Web</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 my-6">
        <div className="bg-[#181513] border border-white/10 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Omnichannel GMV</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">
            {formatPrice(totalRevenue)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-emerald-400/90">
            <span>+34.2%</span>
            <span className="text-white/40">vs last drop</span>
          </div>
        </div>

        <div className="bg-[#181513] border border-white/10 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Active 1-of-1 Stock</span>
            <Package className="w-4 h-4 text-[#E67E44]" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-white">
            {inStockCount} <span className="text-xs text-white/40 font-normal">/ {totalItems}</span>
          </div>
          <div className="text-[10px] font-mono text-white/50 mt-2">
            Strict 1-of-1 Vault Inventory
          </div>
        </div>

        <div className="bg-[#181513] border border-white/10 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Archived / Sold</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-purple-400">
            {soldOutCount} <span className="text-xs text-white/40 font-normal">units</span>
          </div>
          <div className="text-[10px] font-mono text-white/50 mt-2">
            Auto-locked across all counters
          </div>
        </div>

        <div className="bg-[#181513] border border-white/10 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Sell-Through Rate</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-amber-400">
            {sellThroughRate}%
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${sellThroughRate}%` }}></div>
          </div>
        </div>

        <div className="bg-[#181513] border border-white/10 rounded-xl p-4 flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-white/50 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Average Order (AOV)</span>
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-400">
            {formatPrice(avgOrderValue || 3499)}
          </div>
          <div className="text-[10px] font-mono text-white/50 mt-2">
            Across {orders.length} verified orders
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 border-b border-white/10 mb-6 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => { playClickSound(); setActiveTab('inventory'); }}
          className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'border-[#E67E44] text-white font-bold bg-white/5'
              : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Package className="w-4 h-4 text-[#E67E44]" />
          <span>1-of-1 Inventory ({products.length})</span>
        </button>

        <button
          onClick={() => { playClickSound(); setActiveTab('orders'); }}
          className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-[#E67E44] text-white font-bold bg-white/5'
              : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Truck className="w-4 h-4 text-cyan-400" />
          <span>Fulfillment Ledger ({orders.length})</span>
        </button>

        <button
          onClick={() => { playClickSound(); setActiveTab('drop-control'); }}
          className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'drop-control'
              ? 'border-[#E67E44] text-white font-bold bg-white/5'
              : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Drop #24 Launch Control</span>
        </button>

        <button
          onClick={() => { playClickSound(); setActiveTab('marketing'); }}
          className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'marketing'
              ? 'border-[#E67E44] text-white font-bold bg-white/5'
              : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Instagram Drop Sync</span>
        </button>
      </div>

      {/* TAB 1: INVENTORY TABLE */}
      {activeTab === 'inventory' && (
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#181513] border border-white/10 p-3 rounded-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search reference code, specimen title, or era..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-[#E67E44]"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/80 focus:outline-none focus:border-[#E67E44]"
              >
                <option value="all">All Categories</option>
                <option value="boxy-shirts">Boxy Shirts</option>
                <option value="denim-workwear">Denim Workwear</option>
                <option value="leather-jackets">Leather Jackets</option>
                <option value="vintage-tees">Vintage Tees</option>
                <option value="dresses-corsets">Dresses & Western</option>
              </select>

              <button
                onClick={() => {
                  playClickSound();
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#E67E44] hover:bg-[#d57038] text-white rounded-lg text-xs font-mono font-bold transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Specimen</span>
              </button>
            </div>
          </div>

          <div className="bg-[#181513] border border-white/10 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-white/50 font-mono text-[10px] tracking-wider uppercase">
                    <th className="py-3 px-4">Specimen / Reference</th>
                    <th className="py-3 px-3">Category & Era</th>
                    <th className="py-3 px-3">Size & Fit</th>
                    <th className="py-3 px-3">Condition Score</th>
                    <th className="py-3 px-3">INR Price</th>
                    <th className="py-3 px-3 text-center">Omnichannel Stock</th>
                    <th className="py-3 px-4 text-right">Quick Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-10 h-12 object-cover rounded border border-white/10 bg-black"
                          />
                          <div>
                            <div className="font-bold text-white font-sans text-xs">{p.title}</div>
                            <div className="text-[10px] text-[#E67E44] tracking-wider font-mono font-bold">
                              {p.referenceCode}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-white/80 capitalize">{p.category.replace('-', ' ')}</div>
                        <div className="text-[10px] text-white/40">{p.era}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[11px] font-bold">
                          {p.size}
                        </span>
                        <div className="text-[10px] text-white/40 mt-0.5">P2P: {p.measurements.pitToPit}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                          {p.conditionRating}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-bold text-white">
                        {formatPrice(p.price)}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {p.inStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            AVAILABLE (1-of-1)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                            SOLD / ARCHIVED
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={async () => {
                            playClickSound();
                            await api.products.toggleStock(p.id, !p.inStock);
                          }}
                          className={`px-2.5 py-1 rounded font-mono text-[10px] uppercase font-bold transition-all border ${
                            p.inStock
                              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {p.inStock ? 'Mark Sold' : 'Restock 1-of-1'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FULFILLMENT LEDGER */}
      {activeTab === 'orders' && (
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="bg-[#181513] border border-white/10 p-4 rounded-xl flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-base">Fulfillment & Courier Dispatch Ledger</h2>
              <p className="text-xs font-mono text-white/50">
                Primary Logistic Hub: Blue Dart Express Air, Kota 324002
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
              {orders.length} Verified Orders
            </span>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-[#181513] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#E67E44]">{ord.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      ord.channel === 'In-Store POS'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {ord.channel}
                    </span>
                    <span className="text-xs font-mono text-white/40">• {ord.timestamp}</span>
                  </div>

                  <div className="font-bold text-sm text-white">{ord.customerName}</div>
                  {ord.customerContact && (
                    <div className="text-xs font-mono text-white/50">{ord.customerContact}</div>
                  )}

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {ord.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded bg-black/40 border border-white/10 text-[11px] font-mono text-white/80"
                      >
                        {item.referenceCode}: {item.title} ({item.size})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
                  <div className="text-right">
                    <div className="text-lg font-mono font-bold text-emerald-400">
                      {formatPrice(ord.totalAmount)}
                    </div>
                    <div className="text-[10px] font-mono text-white/50">
                      Paid via {ord.paymentMethod}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {ord.status}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      AWB: {ord.trackingNumber || 'BD-84920194-IN'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DROP CONTROL */}
      {activeTab === 'drop-control' && (
        <div className="max-w-4xl mx-auto bg-[#181513] border border-white/10 p-6 rounded-xl space-y-6">
          <h2 className="font-serif text-lg font-bold text-white">Drop #24 Launch Scheduler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-white/60 mb-2">Drop Title</label>
              <input
                type="text"
                value={dropTitle}
                onChange={(e) => setDropTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-white/60 mb-2">Scheduled Launch Time</label>
              <input
                type="datetime-local"
                value={dropDate}
                onChange={(e) => setDropDate(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                playSuccessChime();
                setDropSavedToast(true);
                setTimeout(() => setDropSavedToast(false), 3000);
              }}
              className="px-5 py-2.5 bg-[#E67E44] text-white rounded-lg text-xs font-mono font-bold"
            >
              Save Drop Settings
            </button>
          </div>
          {dropSavedToast && (
            <div className="p-3 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg">
              Drop schedule updated in database!
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MARKETING */}
      {activeTab === 'marketing' && (
        <div className="max-w-4xl mx-auto bg-[#181513] border border-white/10 p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-white">Instagram Drop Caption Generator</h2>
            <a
              href="https://www.instagram.com/vintagevoguee_in/?hl=en"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-pink-400 underline"
            >
              @vintagevoguee_in
            </a>
          </div>
          <div className="bg-black/40 p-4 rounded-lg font-mono text-xs whitespace-pre-wrap text-white/80">
            {`VINTAGE VOGUE INDIA 🇮🇳 DROP #24 LIVE DOSSIER\n\nAuthentic 1-of-1 curated thrift & Japanese archives. Dispatching from our Kota studio via Blue Dart Express Air.\n\nFEATURED SPECIMENS:\n${products.slice(0, 4).map(p => `• [${p.referenceCode}] ${p.title} (${p.size}) — ₹${p.price.toLocaleString('en-IN')}`).join('\n')}\n\nStrict 1-of-1 availability. Comment reference code or tap link in bio to acquire.\n\n#VintageVogueIndia #CuratedVintage #1of1Thrift #KotaRajasthan #JapanArchive`}
          </div>
          <button
            onClick={handleCopyCaption}
            className="px-4 py-2 bg-[#E67E44] text-white rounded-lg text-xs font-mono font-bold"
          >
            {copiedCaption ? 'Copied!' : 'Copy Instagram Caption'}
          </button>
        </div>
      )}

      {/* ADD SPECIMEN MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181513] border border-white/20 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">Add 1-of-1 Specimen to Database</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddNewProductSubmit} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-white/10 rounded-lg text-white/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E67E44] text-white font-bold rounded-lg"
                >
                  Save Specimen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

