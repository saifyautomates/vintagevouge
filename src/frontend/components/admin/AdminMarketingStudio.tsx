import React, { useState } from 'react';
import {
  Instagram,
  Copy,
  Check,
  Sparkles,
  Share2,
  ExternalLink,
  Flame,
  Tag,
  MessageCircle,
  Plus,
  Trash2,
  Ticket,
  Send
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { playClickSound, playSuccessChime } from '../../utils/audio';

export const AdminMarketingStudio: React.FC = () => {
  const { products, dropConfig, coupons, createCoupon, toggleCoupon, deleteCoupon } = useStore();
  const { formatPrice, showToast } = useCart();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // New Coupon Form state
  const [newCode, setNewCode] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'flat' | 'percentage'>('flat');
  const [newDiscountValue, setNewDiscountValue] = useState('500');
  const [newMinOrder, setNewMinOrder] = useState('1500');
  const [newNotes, setNewNotes] = useState('Exclusive WhatsApp VIP Drop Privilege');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    playSuccessChime();
    createCoupon({
      code: newCode.trim().toUpperCase(),
      discountType: newDiscountType,
      discountValue: Number(newDiscountValue) || 500,
      minOrderValue: Number(newMinOrder) || 0,
      active: true,
      notes: newNotes.trim(),
    });
    showToast(`VIP Coupon [${newCode.trim().toUpperCase()}] Created!`);
    setNewCode('');
  };

  const activeSpecimens = products
    .filter((p) => p.inStock)
    .slice(0, 5)
    .map((p) => `• [${p.referenceCode}] ${p.title} (${p.size}) — ${formatPrice(p.price)}`)
    .join('\n');

  const mainPostCaption = `VINTAGE VOGUE INDIA 🇮🇳 DROP #24 LIVE DOSSIER\n\nAuthentic 1-of-1 archival Western wear & Japanese heritage garments. Dispatching direct from our Sogaria / Workshop Road atelier in Kota, Rajasthan via Blue Dart Express Air ⚡\n\nFEATURED SPECIMENS:\n${activeSpecimens}\n\nStrict 1-of-1 availability. Once claimed, forever archived. Comment specimen reference code or tap link in bio to acquire.\n\n#VintageVogueIndia #ArchivalFashion #HauteAtelier #KotaRajasthan #JapaneseArchive #SelvedgeDenim #VintageIndia #BoxyCampShirt`;

  const reelCaption = `90s Shibuya & Osaka Archives to Kota Studio Atelier 🇯🇵 🇮🇳\n\nDrop #24 is officially live with 10 hand-authenticated Japanese archive specimens. Each measured with flat-laid tape. Steam sanitized with eucalyptus.\n\nComment "VAULT" to receive instant secret VIP checkout link in your DMs!\n\nStudio Hub: Sogaria, Kota, Rajasthan – 324002\n#VintageVogue #ArchivalFashion #JapaneseArchive #BoxyShirt #VintageIndia #HauteWestern`;

  const storyAnnouncement = `DROP #24 LIVE NOW 🚨\nOnly 1 of each piece in existence.\nTap link sticker or head to website to lock your piece.\nAll prices in ₹ INR with Free Blue Dart Air Shipping over ₹2,999!`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard?.writeText(text);
    playSuccessChime();
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl text-white">
      {/* Header */}
      <div className="bg-[#181513] border border-white/10 rounded-2xl p-6 space-y-2 shadow-xl">
        <div className="flex items-center gap-2">
          <Instagram className="w-5 h-5 text-[#E67E44]" />
          <h3 className="font-serif text-2xl font-bold">Instagram Marketing Studio</h3>
        </div>
        <p className="font-sans text-xs text-white/60">
          Auto-generated captions, hashtags, and release copy synced with live inventory for <strong className="text-white">@vintagevoguee_in</strong>.
        </p>
      </div>

      {/* Copy Templates */}
      <div className="space-y-4">
        {/* Template 1: Feed Carousel Caption */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-mono text-xs uppercase font-bold text-[#E67E44] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Drop #24 Main Feed Carousel Copy</span>
            </span>
            <button
              onClick={() => handleCopy(mainPostCaption, 'feed')}
              className="px-3 py-1.5 bg-[#E67E44] hover:bg-[#d57038] text-white text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all font-bold"
            >
              {copiedType === 'feed' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'feed' ? 'Copied!' : 'Copy Caption'}</span>
            </button>
          </div>
          <div className="bg-white/5 p-4 rounded-xl font-mono text-xs text-white/80 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
            {mainPostCaption}
          </div>
        </div>

        {/* Template 2: Instagram Reel Script */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-mono text-xs uppercase font-bold text-purple-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              <span>Viral Instagram Reel Hook & Script</span>
            </span>
            <button
              onClick={() => handleCopy(reelCaption, 'reel')}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all font-bold"
            >
              {copiedType === 'reel' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'reel' ? 'Copied!' : 'Copy Reel Copy'}</span>
            </button>
          </div>
          <div className="bg-white/5 p-4 rounded-xl font-mono text-xs text-white/80 whitespace-pre-line leading-relaxed">
            {reelCaption}
          </div>
        </div>

        {/* Template 3: 24h Story Text */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-mono text-xs uppercase font-bold text-emerald-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Drop Day Story Announcement</span>
            </span>
            <button
              onClick={() => handleCopy(storyAnnouncement, 'story')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all font-bold"
            >
              {copiedType === 'story' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'story' ? 'Copied!' : 'Copy Story Text'}</span>
            </button>
          </div>
          <div className="bg-white/5 p-4 rounded-xl font-mono text-xs text-white/80 whitespace-pre-line leading-relaxed">
            {storyAnnouncement}
          </div>
        </div>

        {/* WhatsApp VIP Promo Coupons Generator & Broadcaster */}
        <div className="bg-[#181513] border border-[#E67E44]/30 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="space-y-1">
              <h4 className="font-mono text-sm uppercase font-bold text-[#E67E44] flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                <span>WhatsApp VIP Promo Coupons & Broadcast Studio</span>
              </h4>
              <p className="text-xs text-white/60">
                Create custom promo discount codes and share them directly with VIP patrons on WhatsApp with 1-click auto-apply links.
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              {coupons.length} Coupons Configured
            </span>
          </div>

          {/* Form to create new coupon */}
          <form onSubmit={handleCreateCoupon} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
            <span className="font-mono text-xs uppercase font-bold text-white block">
              + Generate New VIP Privilege Code
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Coupon Code *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. VIP500"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono uppercase text-white outline-none focus:border-[#E67E44]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Discount Type</label>
                <select
                  value={newDiscountType}
                  onChange={(e) => setNewDiscountType(e.target.value as any)}
                  className="w-full bg-[#1e1b18] border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#E67E44]"
                >
                  <option value="flat">Flat ₹ (INR Off)</option>
                  <option value="percentage">Percentage (% Off)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">
                  {newDiscountType === 'flat' ? 'Amount (₹ INR)' : 'Percent (%)'}
                </label>
                <input
                  required
                  type="number"
                  placeholder="500"
                  value={newDiscountValue}
                  onChange={(e) => setNewDiscountValue(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#E67E44]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-white/50 mb-1">Min Order Value (₹)</label>
                <input
                  type="number"
                  placeholder="1500"
                  value={newMinOrder}
                  onChange={(e) => setNewMinOrder(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-[#E67E44]"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <input
                type="text"
                placeholder="Internal Notes (e.g. Sunday Drop Private Reward for Kota Collectors)"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full sm:flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white/80 outline-none"
              />

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 bg-[#E67E44] hover:bg-orange-600 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Coupon</span>
              </button>
            </div>
          </form>

          {/* Active Coupons Grid */}
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase font-bold text-white/60 block">
              Active VIP Promo Codes (Shareable via WhatsApp)
            </span>

            <div className="divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden bg-white/5">
              {coupons.map((c) => {
                const whatsappShareText = `🎁 *Vintage Vogue India Private VIP Privilege!*\n\nUse secret promo code *${c.code}* for ${
                  c.discountType === 'flat' ? `₹${c.discountValue} OFF` : `${c.discountValue}% OFF`
                } your 1-of-1 archival order${c.minOrderValue ? ` (Min Order: ₹${c.minOrderValue})` : ''}.\n\nDirect 1-Click Auto-Apply Link:\nhttp://localhost:1234/?promo=${c.code}\n\nStrictly single-piece discoveries from Kota Studio Hub. Once claimed, forever archived!`;

                return (
                  <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-extrabold text-[#E67E44] bg-[#E67E44]/15 border border-[#E67E44]/30 px-2.5 py-0.5 rounded tracking-wider">
                          {c.code}
                        </span>
                        <span className="text-xs font-bold text-white font-mono">
                          {c.discountType === 'flat' ? `Flat ₹${c.discountValue} Off` : `${c.discountValue}% Off`}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          c.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {c.active ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60 font-mono">
                        {c.notes || 'VIP Privilege'} • Min Order: ₹{c.minOrderValue || 0}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 sm:pt-0">
                      {/* WhatsApp 1-Click Share Button */}
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(whatsappShareText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-mono font-bold tracking-wider uppercase rounded-lg flex items-center gap-1.5 transition-colors shadow"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Share on WhatsApp</span>
                      </a>

                      {/* Toggle Active Status */}
                      <button
                        onClick={() => {
                          playClickSound();
                          toggleCoupon(c.id);
                        }}
                        className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 text-[11px] font-mono rounded-lg transition-colors"
                      >
                        {c.active ? 'Disable' : 'Enable'}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          playClickSound();
                          deleteCoupon(c.id);
                        }}
                        className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

