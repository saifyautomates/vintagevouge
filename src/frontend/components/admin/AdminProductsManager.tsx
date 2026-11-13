import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Eye,
  Lock,
  Unlock,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Tag,
  Ruler,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { ProductRecord, Category } from '../../../database/schema';
import { api } from '../../../backend/api/client';
import { playClickSound, playSuccessChime } from '../../utils/audio';

interface AdminProductsManagerProps {
  onOpenAddModal: () => void;
  searchQuery: string;
}

export const AdminProductsManager: React.FC<AdminProductsManagerProps> = ({
  onOpenAddModal,
  searchQuery,
}) => {
  const { products, setProducts } = useStore();
  const { formatPrice, setSelectedProduct } = useCart();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'sold-out'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories: { label: string; value: string }[] = [
    { label: 'All Categories', value: 'all' },
    { label: 'Boxy Shirts', value: 'boxy-shirts' },
    { label: 'Denim & Workwear', value: 'denim-workwear' },
    { label: 'Leather Jackets', value: 'leather-jackets' },
    { label: 'Vintage Tees', value: 'vintage-tees' },
    { label: 'Dresses & Corsets', value: 'dresses-corsets' },
  ];

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.referenceCode.toLowerCase().includes(q) ||
      p.era.toLowerCase().includes(q) ||
      p.size.toLowerCase().includes(q);

    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStock =
      stockFilter === 'all' ? true : stockFilter === 'in-stock' ? p.inStock : !p.inStock;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleToggleStock = async (product: ProductRecord) => {
    playClickSound();
    const updated = await api.products.toggleStock(product.id, !product.inStock);
    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
  };

  const handleCopyRef = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    playClickSound();
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-[#181513] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => {
                playClickSound();
                setCategoryFilter(c.value);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                categoryFilter === c.value
                  ? 'bg-[#E67E44] text-white font-bold shadow'
                  : 'bg-white/5 hover:bg-white/10 text-white/70'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Stock Filter & Add Action */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-xl text-[11px] font-mono">
            {[
              { id: 'all', label: 'All' },
              { id: 'in-stock', label: 'In Stock' },
              { id: 'sold-out', label: 'Claimed' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStockFilter(s.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  stockFilter === s.id ? 'bg-[#E67E44] text-white font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              playClickSound();
              onOpenAddModal();
            }}
            className="px-4 py-2 bg-[#E67E44] hover:bg-[#d57038] text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Specimen</span>
          </button>
        </div>
      </div>

      {/* Specimen Inventory Table */}
      <div className="bg-[#181513] border border-white/10 rounded-2xl overflow-hidden shadow-xl text-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white/50 text-[10px] tracking-wider uppercase">
                <th className="py-3.5 px-4">Specimen Details</th>
                <th className="py-3.5 px-4">Origin & Era</th>
                <th className="py-3.5 px-4">Dimensions</th>
                <th className="py-3.5 px-4">Acquisition Price</th>
                <th className="py-3.5 px-4">Condition</th>
                <th className="py-3.5 px-4">1-of-1 Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                  {/* Photo & Title */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-12 h-14 object-cover rounded-lg border border-white/10 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyRef(p.referenceCode)}
                            className="font-bold text-[#E67E44] hover:underline flex items-center gap-1"
                            title="Copy code"
                          >
                            <span>{p.referenceCode}</span>
                            {copiedCode === p.referenceCode ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-2.5 h-2.5 opacity-60" />
                            )}
                          </button>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/70">
                            {p.size}
                          </span>
                        </div>
                        <span className="font-serif font-bold text-sm text-white block mt-0.5 truncate max-w-xs">
                          {p.title}
                        </span>
                        <span className="text-[10px] text-white/40 block truncate max-w-xs">
                          {p.subtitle}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Era & Origin */}
                  <td className="py-3.5 px-4">
                    <span className="text-white block font-medium">{p.era}</span>
                    <span className="text-[10px] text-white/40 block">{p.origin.split('•')[0]}</span>
                  </td>

                  {/* Tape Measurements */}
                  <td className="py-3.5 px-4 text-[11px] text-white/70">
                    <div className="space-y-0.5">
                      <span>P2P: <strong className="text-white">{p.measurements.pitToPit.split('/')[0]}</strong></span>
                      <span className="block text-white/40">Len: {p.measurements.length.split('/')[0]}</span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-serif font-bold text-sm text-white">
                    {formatPrice(p.price)}
                  </td>

                  {/* Condition Rating */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {p.conditionRating.split(' ')[0]}
                    </span>
                  </td>

                  {/* 1-of-1 Status Toggle */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleStock(p)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all ${
                        p.inStock
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      <span>{p.inStock ? 'In Stock' : 'Archived'}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedProduct(p as any)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                        title="Inspect Specimen"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

