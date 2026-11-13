import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Package,
  Ruler,
  Sparkles,
  Tag,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductRecord, Category } from '../../../database/schema';
import { api } from '../../../backend/api/client';
import { playClickSound, playSuccessChime } from '../../utils/audio';

interface AdminAddSpecimenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAddSpecimenModal: React.FC<AdminAddSpecimenModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { products, setProducts } = useStore();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<Category>('boxy-shirts');
  const [era, setEra] = useState('1990s Japanese Archive');
  const [origin, setOrigin] = useState('Tokyo Sourced • Curated Kota Hub');
  const [price, setPrice] = useState(3299);
  const [size, setSize] = useState<ProductRecord['size']>('Boxy M');
  const [condition, setCondition] = useState<ProductRecord['conditionRating']>('9.8/10 Near Mint');
  const [fabric, setFabric] = useState('100% Selvedge Heavy Cotton');
  const [pitToPit, setPitToPit] = useState('23.5 in / 60 cm');
  const [length, setLength] = useState('27.0 in / 68.5 cm');
  const [shoulders, setShoulders] = useState('20.5 in / 52 cm');
  const [sleeve, setSleeve] = useState('9.5 in / 24 cm');
  const [description, setDescription] = useState('Rare vintage silhouette with authentic chainstitch detailing and drop-shoulder drape.');
  const [imageUrl, setImageUrl] = useState('/assets/images/boxy-embroidered-shirt.jpg');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      // Guaranteed unique sequential reference code
      const existingCodes = new Set(products.map((p) => p.referenceCode.toUpperCase()));
      let nextNum = 11;
      while (existingCodes.has(`VV-D24-${String(nextNum).padStart(2, '0')}`)) {
        nextNum++;
      }
      const referenceCode = `VV-D24-${String(nextNum).padStart(2, '0')}`;

      const newSpecimen: Omit<ProductRecord, 'id' | 'createdAt' | 'updatedAt'> = {
        referenceCode,
        title,
        subtitle: subtitle || 'Archival Hand-Selected Piece',
        category,
        era,
        origin,
        price: Number(price),
        originalEstimatePrice: Math.round(Number(price) * 1.8),
        size,
        conditionRating: condition,
        rarity: '1-of-1 Specimen',
        dropBatch: 'Drop #24 — The Autumn Nomad',
        fabric,
        measurements: {
          pitToPit,
          length,
          shoulders,
          sleeve,
        },
        description,
        provenance: 'Steam sanitized, dry-pressed at Vintage Vogue Hub, Kota.',
        images: [imageUrl, '/assets/images/vintage-denim-trucker.jpg'],
        inStock: true,
        featured: true,
      };

      const created = await api.products.create(newSpecimen);
      playSuccessChime();
      setProducts((prev) => [created, ...prev]);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to add specimen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn text-white"
    >
      <div
        className="relative bg-[#181513] border border-white/20 max-w-2xl w-full rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-auto animate-scaleUp max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#E67E44]/20 text-[#E67E44] rounded-xl">
              <Package className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif text-xl font-bold">Ingest New 1-of-1 Specimen</h3>
              <p className="font-sans text-xs text-white/50">
                Cataloged & allocated into Drop #24 with flat-laid tape measurements.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
          {/* Title & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase text-white/50 mb-1">
                Specimen Title *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. 1994 Japanese Boxy Worker Shirt"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-sans text-white outline-none focus:border-[#E67E44]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase text-white/50 mb-1">
                Subtitle / Silhouette Callout
              </label>
              <input
                type="text"
                placeholder="e.g. Heavy Double-Weave Raw Cotton"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-sans text-white outline-none focus:border-[#E67E44]"
              />
            </div>
          </div>

          {/* Category, Size & Price in Rupees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] uppercase text-white/50 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#E67E44]"
              >
                <option value="boxy-shirts" className="bg-[#181513]">Boxy Shirts</option>
                <option value="denim-workwear" className="bg-[#181513]">Denim & Workwear</option>
                <option value="leather-jackets" className="bg-[#181513]">Leather Jackets</option>
                <option value="vintage-tees" className="bg-[#181513]">Vintage Tees</option>
                <option value="dresses-corsets" className="bg-[#181513]">Dresses & Corsets</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-white/50 mb-1">
                Fit / Size Tag
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as any)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#E67E44]"
              >
                <option value="Boxy M" className="bg-[#181513]">Boxy M</option>
                <option value="Boxy L" className="bg-[#181513]">Boxy L</option>
                <option value="Oversized XL" className="bg-[#181513]">Oversized XL</option>
                <option value="S" className="bg-[#181513]">S</option>
                <option value="Free Size" className="bg-[#181513]">Free Size</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase text-white/50 mb-1">
                Acquisition Price (₹ INR) *
              </label>
              <input
                required
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-400 font-bold outline-none focus:border-[#E67E44]"
              />
            </div>
          </div>

          {/* Measurements */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
            <span className="text-xs uppercase text-[#E67E44] font-bold flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5" />
              <span>Exact Flat-Laid Tape Blueprint</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] text-white/50 block mb-0.5">Pit-to-Pit (Chest)</label>
                <input
                  type="text"
                  value={pitToPit}
                  onChange={(e) => setPitToPit(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#E67E44]"
                />
              </div>

              <div>
                <label className="text-[10px] text-white/50 block mb-0.5">Center Length</label>
                <input
                  type="text"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#E67E44]"
                />
              </div>

              <div>
                <label className="text-[10px] text-white/50 block mb-0.5">Shoulder Width</label>
                <input
                  type="text"
                  value={shoulders}
                  onChange={(e) => setShoulders(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#E67E44]"
                />
              </div>

              <div>
                <label className="text-[10px] text-white/50 block mb-0.5">Sleeve Length</label>
                <input
                  type="text"
                  value={sleeve}
                  onChange={(e) => setSleeve(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#E67E44]"
                />
              </div>
            </div>
          </div>

          {/* Curatorial Image */}
          <div>
            <label className="block text-[11px] uppercase text-white/50 mb-1">
              Curatorial Photograph Asset Path
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#E67E44]"
              />
              <img
                src={imageUrl}
                alt="Preview"
                className="w-10 h-10 object-cover rounded-lg border border-white/20"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/images/boxy-embroidered-shirt.jpg';
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] uppercase text-white/50 mb-1">
              Archival Curatorial Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-sans text-white outline-none focus:border-[#E67E44]"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#E67E44] hover:bg-[#d57038] text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-xl transition-all uppercase"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Allocating Specimen...' : 'Save & Publish 1-of-1'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

