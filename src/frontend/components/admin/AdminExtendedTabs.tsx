import React, { useState } from 'react';
import {
  CreditCard,
  RotateCcw,
  Layers,
  Users,
  Tag,
  Star,
  Images,
  FolderOpen,
  MessageSquare,
  MessageSquareText,
  FileText,
  Shield,
  Plus,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  Printer,
  Trash2,
  Copy,
  Send,
  MessageCircle,
  Truck,
  Sparkles,
  Barcode,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { playClickSound, playSuccessChime } from '../../utils/audio';

// ─── 1. OFFLINE BILLING POS TAB ───
export const AdminBillingTab: React.FC = () => {
  const { products } = useStore();
  const { formatPrice, showToast } = useCart();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Bharat UPI' | 'POS Card'>('Bharat UPI');
  const [barcodeInput, setBarcodeInput] = useState('');

  const inStockProducts = products.filter((p) => p.inStock);
  const billedItems = products.filter((p) => selectedProductIds.includes(p.id));
  const subtotal = billedItems.reduce((sum, item) => sum + item.price, 0);

  const handleAddItem = (id: string) => {
    if (!selectedProductIds.includes(id)) {
      setSelectedProductIds([...selectedProductIds, id]);
      playClickSound();
    }
  };

  const handleRemoveItem = (id: string) => {
    setSelectedProductIds(selectedProductIds.filter((item) => item !== id));
    playClickSound();
  };

  const handleSimulateScan = (e: React.FormEvent) => {
    e.preventDefault();
    const found = products.find(
      (p) => p.referenceCode.toLowerCase() === barcodeInput.trim().toLowerCase()
    );
    if (found) {
      handleAddItem(found.id);
      setBarcodeInput('');
      showToast(`Scanned: [${found.referenceCode}] ${found.title}`);
    } else {
      showToast('Specimen reference not found in active catalog.');
    }
  };

  const handleCompleteSale = () => {
    if (billedItems.length === 0) {
      showToast('Please add at least one specimen to bill.');
      return;
    }
    playSuccessChime();
    showToast(`POS Sale completed (${formatPrice(subtotal)}). Receipt printed.`);
    setSelectedProductIds([]);
    setCustomerPhone('');
    setCustomerName('');
  };

  return (
    <div className="space-y-6 text-[#181513]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans">Sogaria Studio Offline Billing POS</h2>
          <p className="text-xs text-[#6B6358] mt-0.5">
            Physical counter register at Workshop Road, Kota. Generates instant tax invoices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            Counter #01 Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Barcode Input & Specimen Catalog */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Scan Bar */}
          <form onSubmit={handleSimulateScan} className="bg-white p-4 rounded-2xl border border-[#E5E0D8] shadow-2xs flex gap-2">
            <div className="relative flex-1">
              <Barcode className="w-4 h-4 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Scan physical barcode or enter ref code (e.g. VV-D24-01)..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl text-xs font-mono focus:outline-none focus:border-[#8B2635]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#8B2635] text-white rounded-xl text-xs font-bold hover:bg-[#731F2C] transition-colors"
            >
              Add Specimen
            </button>
          </form>

          {/* Rapid Click Specimen Shelf */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E0D8] shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-[#6B6358] uppercase tracking-wider">
              Quick Pick Specimens in Studio (1-Click Add)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {inStockProducts.map((p) => {
                const isSelected = selectedProductIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => (isSelected ? handleRemoveItem(p.id) : handleAddItem(p.id))}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#8B2635] bg-[#8B2635]/5 shadow-xs'
                        : 'border-[#E5E0D8] bg-[#FAF7F2] hover:border-[#8B2635]/40'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[10px] font-bold text-[#8B2635]">
                        {p.referenceCode}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/5 text-[#181513] font-bold">
                        {p.size}
                      </span>
                    </div>
                    <p className="font-bold text-xs truncate mt-1 text-[#181513]">{p.title}</p>
                    <div className="mt-2 flex items-center justify-between text-xs font-bold">
                      <span className="text-[#181513]">{formatPrice(p.price)}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-[#8B2635] font-bold' : 'text-[#6B6358]'}`}>
                        {isSelected ? '✓ Added' : '+ Tap'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Active Bill Register */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <h3 className="text-sm font-bold text-[#181513]">Current Billing Register</h3>
              <span className="text-xs font-mono text-[#8B2635] font-bold">
                {billedItems.length} {billedItems.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            {/* Billed Items List */}
            <div className="divide-y divide-[#E5E0D8]/60 my-3 max-h-52 overflow-y-auto">
              {billedItems.length === 0 ? (
                <div className="py-8 text-center text-[#8C857B] text-xs">
                  <CreditCard className="w-6 h-6 mx-auto mb-1.5 opacity-30" />
                  No items added to current register.
                </div>
              ) : (
                billedItems.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <span className="font-mono text-[10px] text-[#8B2635] font-bold block">
                        [{item.referenceCode}] {item.size}
                      </span>
                      <span className="font-medium text-[#181513] truncate block">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#181513]">{formatPrice(item.price)}</span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-[#8C857B] hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Customer Inputs */}
            <div className="space-y-2 pt-2 border-t border-[#E5E0D8]">
              <input
                type="text"
                placeholder="Customer Phone (for WhatsApp e-bill)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl focus:outline-none"
              />
              <input
                type="text"
                placeholder="Customer Name (optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl focus:outline-none"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="pt-3 space-y-1.5">
              <span className="text-[10px] font-bold text-[#6B6358] uppercase">Settlement Mode:</span>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
                {(['Bharat UPI', 'Cash', 'POS Card'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPaymentMode(mode)}
                    className={`py-1.5 rounded-xl border transition-colors ${
                      paymentMode === mode
                        ? 'bg-[#8B2635] text-white border-[#8B2635]'
                        : 'bg-[#FAF7F2] text-[#5C564E] border-[#E5E0D8]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subtotal & Print CTA */}
          <div className="pt-3 border-t border-[#E5E0D8] space-y-3">
            <div className="flex justify-between items-center text-sm font-bold text-[#181513]">
              <span>Grand Total</span>
              <span className="text-xl font-serif text-[#8B2635]">{formatPrice(subtotal)}</span>
            </div>

            <button
              onClick={handleCompleteSale}
              disabled={billedItems.length === 0}
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                billedItems.length === 0
                  ? 'bg-black/10 text-black/30 cursor-not-allowed'
                  : 'bg-[#00875A] hover:bg-[#00704A] text-white shadow-md'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Complete Sale & Print Bill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── 2. ONLINE RETURNS & EXCHANGES TAB ───
export const AdminReturnsTab: React.FC = () => {
  const { formatPrice, showToast } = useCart();
  const [returnStatus, setReturnStatus] = useState<Record<string, string>>({
    'RET-101': 'Inspection Passed',
    'RET-102': 'Exchange In Transit',
  });

  const returns = [
    {
      id: 'RET-101',
      orderId: '#VV-ORD-912',
      customer: 'Siddharth Rao (Bengaluru)',
      specimen: '14oz Denim Trucker Overshirt',
      reason: 'Size exchange requested: prefers chest 44" over 42"',
      date: 'Nov 12, 2026',
      creditAmount: 4899,
      status: returnStatus['RET-101'] || 'Pending Inspection',
    },
    {
      id: 'RET-102',
      orderId: '#VV-ORD-894',
      customer: 'Tanya Sen (Kolkata)',
      specimen: '70s Prairie Floral Midi Dress',
      reason: 'Authentic 48-Hour Studio Exchange Protocol',
      date: 'Nov 11, 2026',
      creditAmount: 3200,
      status: returnStatus['RET-102'] || 'Exchange In Transit',
    },
  ];

  const handleApprove = (id: string) => {
    setReturnStatus({ ...returnStatus, [id]: '100% Studio Credit Issued' });
    playSuccessChime();
    showToast(`Return ${id} approved. ₹ Credit voucher dispatched to customer WhatsApp.`);
  };

  return (
    <div className="space-y-4 text-[#181513]">
      <div>
        <h2 className="text-xl font-bold font-sans">Online Returns & 48-Hour Studio Exchanges</h2>
        <p className="text-xs text-[#6B6358] mt-0.5">
          Archival 1-of-1 pieces are eligible for 48-Hour size swaps or 100% studio credit vouchers.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E0D8] shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2] border-b border-[#E5E0D8] text-[#6B6358] font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Return ID</th>
              <th className="py-3 px-3">Order #</th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-4">Specimen & Reason</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Credit Value</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D8]/60">
            {returns.map((r) => (
              <tr key={r.id} className="hover:bg-[#FAF7F2]/80">
                <td className="py-3 px-4 font-mono font-bold text-[#8B2635]">{r.id}</td>
                <td className="py-3 px-3 font-mono text-[#181513]">{r.orderId}</td>
                <td className="py-3 px-3 font-semibold text-[#181513]">{r.customer}</td>
                <td className="py-3 px-4 text-[#5C564E]">
                  <span className="font-bold text-[#181513] block">{r.specimen}</span>
                  <span className="text-[10px] text-[#7D7569]">{r.reason}</span>
                </td>
                <td className="py-3 px-3 text-[#6B6358] whitespace-nowrap">{r.date}</td>
                <td className="py-3 px-3 font-bold text-[#181513]">{formatPrice(r.creditAmount)}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {r.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleApprove(r.id)}
                    className="px-3 py-1 bg-[#8B2635] text-white rounded-lg text-[11px] font-bold hover:bg-[#731F2C]"
                  >
                    Issue Credit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── 3. CUSTOMERS CRM DIRECTORY TAB ───
export const AdminCustomersTab: React.FC = () => {
  const { formatPrice, showToast } = useCart();
  const [search, setSearch] = useState('');

  const customers = [
    { id: 'CUST-01', name: 'Kabir Verma', phone: '+91 98290 55432', city: 'Jaipur, RJ', ordersCount: 5, totalSpent: 28400, vipTier: 'Atelier Collector' },
    { id: 'CUST-02', name: 'Rhea Singhania', phone: '+91 98110 33211', city: 'Bandra West, Mumbai', ordersCount: 3, totalSpent: 16900, vipTier: 'VIP Tier' },
    { id: 'CUST-03', name: 'Ananya Sharma', phone: '+94 1408 8219', city: 'Kota, RJ', ordersCount: 4, totalSpent: 12450, vipTier: 'Studio Regular' },
    { id: 'CUST-04', name: 'Arjun K.', phone: '+91 97850 11294', city: 'Indiranagar, BLR', ordersCount: 2, totalSpent: 9800, vipTier: 'Collector' },
    { id: 'CUST-05', name: 'Devika Patel', phone: '+91 99280 44321', city: 'Ahmedabad, GJ', ordersCount: 6, totalSpent: 34100, vipTier: 'Archival Patron' },
  ];

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 text-[#181513]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans">Archival Collectors CRM</h2>
          <p className="text-xs text-[#6B6358] mt-0.5">
            Verified buyers across India with aggregate lifetime spend and direct WhatsApp links.
          </p>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search collector name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E5E0D8] rounded-xl focus:outline-none w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E0D8] shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2] border-b border-[#E5E0D8] text-[#6B6358] font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Collector #</th>
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">City / Hub</th>
              <th className="py-3 px-3">Pieces Acquired</th>
              <th className="py-3 px-3">Total Spend</th>
              <th className="py-3 px-3">VIP Tier</th>
              <th className="py-3 px-4 text-center">Direct Trigger</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D8]/60">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-[#FAF7F2]/80">
                <td className="py-3 px-4 font-mono font-bold text-[#8B2635]">{c.id}</td>
                <td className="py-3 px-3 font-bold text-[#181513]">
                  <div>{c.name}</div>
                  <div className="text-[10px] text-[#7D7569] font-mono">{c.phone}</div>
                </td>
                <td className="py-3 px-3 text-[#5C564E]">{c.city}</td>
                <td className="py-3 px-3 font-mono font-semibold text-[#181513]">{c.ordersCount} Specimens</td>
                <td className="py-3 px-3 font-bold text-emerald-700">{formatPrice(c.totalSpent)}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#8B2635]/10 text-[#8B2635] border border-[#8B2635]/20">
                    {c.vipTier}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <a
                    href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${c.name}! Vintage Vogue Studio, Kota is dropping Drop #25 this Sunday at 8 PM. As an archival patron, here is your early access link.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#25D366]/10 text-[#128C7E] rounded-lg text-[11px] font-bold hover:bg-[#25D366]/20 transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp VIP</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── 4. PROMO COUPONS MANAGER TAB ───
export const AdminCouponsTab: React.FC = () => {
  const { showToast } = useCart();
  const [coupons, setCoupons] = useState([
    { code: 'KOTA24', type: 'Flat ₹ Discount', value: '₹500 OFF', minCart: '₹3,000', usedCount: 84, active: true },
    { code: 'ARCHIVE10', type: 'Percentage', value: '10% OFF', minCart: '₹2,500', usedCount: 142, active: true },
    { code: 'VOGUEVIP', type: 'Flat ₹ Discount', value: '₹1,000 OFF', minCart: '₹6,000', usedCount: 29, active: true },
  ]);
  const [newCode, setNewCode] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    setCoupons([
      ...coupons,
      { code: newCode.toUpperCase(), type: 'Flat ₹ Discount', value: newValue || '₹500 OFF', minCart: '₹3,000', usedCount: 0, active: true },
    ]);
    setNewCode('');
    setNewValue('');
    playSuccessChime();
    showToast(`VIP Promo coupon ${newCode.toUpperCase()} activated!`);
  };

  return (
    <div className="space-y-6 text-[#181513]">
      <div>
        <h2 className="text-xl font-bold font-sans">VIP Promo & Influencer Coupons</h2>
        <p className="text-xs text-[#6B6358] mt-0.5">
          Active coupon codes auto-apply from links (?promo=CODE) and sync to checkout.
        </p>
      </div>

      {/* Create New Code Box */}
      <form onSubmit={handleCreateCoupon} className="bg-white p-4 rounded-2xl border border-[#E5E0D8] shadow-2xs flex flex-wrap gap-2.5 items-center">
        <input
          type="text"
          placeholder="New Code (e.g. TOKYO500)"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          className="px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl font-mono uppercase focus:outline-none w-44"
        />
        <input
          type="text"
          placeholder="Discount Value (e.g. ₹500 OFF)"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E5E0D8] rounded-xl font-mono focus:outline-none w-44"
        />
        <button
          type="submit"
          className="px-4 py-1.5 bg-[#8B2635] text-white rounded-xl text-xs font-bold hover:bg-[#731F2C]"
        >
          Create Promo Code
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-[#E5E0D8] shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2] border-b border-[#E5E0D8] text-[#6B6358] font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Coupon Code</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Discount Value</th>
              <th className="py-3 px-3">Minimum Cart</th>
              <th className="py-3 px-3">Redemptions</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-center">Share Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D8]/60">
            {coupons.map((c) => (
              <tr key={c.code} className="hover:bg-[#FAF7F2]/80">
                <td className="py-3 px-4 font-mono font-bold text-[#8B2635]">{c.code}</td>
                <td className="py-3 px-3 text-[#5C564E]">{c.type}</td>
                <td className="py-3 px-3 font-bold text-emerald-700">{c.value}</td>
                <td className="py-3 px-3 text-[#181513] font-mono">{c.minCart}</td>
                <td className="py-3 px-3 font-mono font-bold text-[#181513]">{c.usedCount} used</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://vintagevogue.in/?promo=${c.code}`);
                      showToast(`Shareable promo link for ${c.code} copied to clipboard!`);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-[#E5E0D8] text-[11px] font-bold text-[#181513] hover:bg-[#FAF7F2]"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Link</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── 5. QUERIES & SUPPORT CHATS TAB ───
export const AdminQueriesTab: React.FC = () => {
  const { showToast } = useCart();
  const queries = [
    { id: 'Q-401', client: 'Rohit K.', phone: '+91 98290 12345', text: 'Can you confirm chest measurements for VV-D24-02 before I order?', time: '10m ago', status: 'Unread' },
    { id: 'Q-402', client: 'Pooja Iyer', phone: '+91 94140 88219', text: 'Is Blue Dart delivery to Chennai within 2 days?', time: '45m ago', status: 'Replied' },
    { id: 'Q-403', client: 'Farhan Zaidi', phone: '+91 97850 11294', text: 'Does the selvedge denim have any distress or fraying?', time: '2h ago', status: 'Replied' },
  ];

  return (
    <div className="space-y-4 text-[#181513]">
      <div>
        <h2 className="text-xl font-bold font-sans">Live Customer Inquiries & Chat Queries</h2>
        <p className="text-xs text-[#6B6358] mt-0.5">
          Real-time inquiries submitted from the Storefront inquiry drawer.
        </p>
      </div>

      <div className="space-y-2.5">
        {queries.map((q) => (
          <div key={q.id} className="bg-white p-4 rounded-2xl border border-[#E5E0D8] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#8B2635]">{q.id}</span>
                <span className="font-bold text-xs text-[#181513]">{q.client}</span>
                <span className="text-[10px] font-mono text-[#7D7569]">({q.phone})</span>
                <span className="text-[10px] text-[#8C857B]">• {q.time}</span>
              </div>
              <p className="text-xs text-[#181513]">{q.text}</p>
            </div>
            <a
              href={`https://wa.me/${q.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hello ${q.client}! This is Vintage Vogue Studio, Kota answering your inquiry regarding: "${q.text}".`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Reply on WhatsApp</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── 6. SMS & DISPATCH LOGS TAB ───
export const AdminSmsLogsTab: React.FC = () => {
  const logs = [
    { id: 'SMS-901', recipient: '+91 98290 55432', type: 'Blue Dart AWB Dispatched', message: 'Your Vintage Vogue piece #VV-9428 is dispatched via Blue Dart AWB #8492019284.', status: 'Delivered', time: 'Today • 07:45 PM' },
    { id: 'SMS-902', recipient: '+91 94140 88219', type: 'OTP Order Verification', message: 'Your Vintage Vogue Studio OTP is 4920 for COD order confirmation.', status: 'Delivered', time: 'Today • 06:16 PM' },
    { id: 'SMS-903', recipient: '+91 97850 11294', type: 'Sunday 8 PM Drop Alert', message: 'Archival Drop #24 is live! 1-of-1 pieces now open for claiming.', status: 'Delivered', time: 'Nov 10 • 08:00 PM' },
  ];

  return (
    <div className="space-y-4 text-[#181513]">
      <div>
        <h2 className="text-xl font-bold font-sans">Automated SMS & Airway Notification Logs</h2>
        <p className="text-xs text-[#6B6358] mt-0.5">
          Fast2SMS & WhatsApp Business API gateway delivery telemetry.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E0D8] shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2] border-b border-[#E5E0D8] text-[#6B6358] font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Log ID</th>
              <th className="py-3 px-3">Recipient Phone</th>
              <th className="py-3 px-3">Notification Event</th>
              <th className="py-3 px-4">SMS Payload</th>
              <th className="py-3 px-3">Gateway Status</th>
              <th className="py-3 px-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D8]/60">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-[#FAF7F2]/80">
                <td className="py-3 px-4 font-mono font-bold text-[#8B2635]">{l.id}</td>
                <td className="py-3 px-3 font-mono text-[#181513]">{l.recipient}</td>
                <td className="py-3 px-3 font-semibold text-[#181513]">{l.type}</td>
                <td className="py-3 px-4 text-[#5C564E] max-w-sm truncate">{l.message}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {l.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-[#6B6358] whitespace-nowrap">{l.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── 7. ADMIN STAFF & ROLES TAB ───
export const AdminStaffTab: React.FC = () => {
  const staff = [
    { name: 'Saify (Studio Principal)', email: 'saifyautomates@gmail.com', role: 'Super Admin', access: 'Full Root Access' },
    { name: 'Bhanu (Senior Curator)', email: 'curator@vintagevogue.in', role: 'Catalog & Appraisal', access: 'Catalog, Pricing & Drops' },
    { name: 'Kota POS Counter Desk', email: 'pos@vintagevogue.in', role: 'Counter Cashier', access: 'Offline Billing & Returns' },
  ];

  return (
    <div className="space-y-4 text-[#181513]">
      <div>
        <h2 className="text-xl font-bold font-sans">Authorized Studio Administrators</h2>
        <p className="text-xs text-[#6B6358] mt-0.5">
          Role-based security access management for Vintage Vogue India operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staff.map((s) => (
          <div key={s.email} className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#8B2635] text-white flex items-center justify-center font-bold text-sm">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-[#181513]">{s.name}</h3>
            <p className="font-mono text-xs text-[#6B6358]">{s.email}</p>
            <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#8B2635]">{s.role}</span>
              <span className="text-[10px] text-[#7D7569]">{s.access}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
