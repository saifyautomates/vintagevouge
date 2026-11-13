import React, { useState, useEffect, useRef } from 'react';
import {
  CreditCard,
  QrCode,
  DollarSign,
  Scan,
  Printer,
  Trash2,
  CheckCircle2,
  X,
  Search,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Store,
  RefreshCw,
  Plus,
  Minus,
  Sparkles,
  Zap,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { ProductRecord } from '../../database/schema';
import { api } from '../../backend/api/client';
import { playScanBeep, playClickSound, playSuccessChime } from '../utils/audio';

export const POSView: React.FC = () => {
  const { products, setViewMode } = useStore();
  const { formatPrice } = useCart();

  const [registerCart, setRegisterCart] = useState<{ product: ProductRecord; quantity: number }[]>([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash' | 'Card'>('UPI');
  const [cashTendered, setCashTendered] = useState<number | ''>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);
  const [isScanningAnimation, setIsScanningAnimation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus barcode scanner on mount
  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  // Keyboard shortcut listener (F1, F2, F3, F4, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      } else if (e.key === 'F2') {
        e.preventDefault();
        setDiscountPercent((prev) => (prev === 10 ? 0 : 10));
        playClickSound();
      } else if (e.key === 'F3') {
        e.preventDefault();
        setPaymentMethod('UPI');
        playClickSound();
      } else if (e.key === 'F4') {
        e.preventDefault();
        setPaymentMethod('Cash');
        playClickSound();
      } else if (e.key === 'Escape' && registerCart.length > 0) {
        if (confirm('Void active ticket?')) {
          setRegisterCart([]);
          playClickSound();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [registerCart]);

  // Cart operations
  const addToRegister = (product: ProductRecord) => {
    if (!product.inStock) return;
    playClickSound();
    setRegisterCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) return prev; // 1-of-1 pieces strictly quantity 1
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromRegister = (productId: string) => {
    playClickSound();
    setRegisterCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Barcode / SKU scanner
  const handleBarcodeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = barcodeInput.trim().toUpperCase();
    if (!cleanCode) return;

    setIsScanningAnimation(true);
    setTimeout(() => setIsScanningAnimation(false), 400);

    const match = products.find(
      (p) =>
        p.referenceCode.toUpperCase() === cleanCode ||
        p.id.toUpperCase() === cleanCode ||
        p.title.toUpperCase().includes(cleanCode)
    );

    if (match) {
      if (!match.inStock) {
        alert(`Specimen [${match.referenceCode}] is marked SOLD OUT in inventory!`);
      } else {
        playScanBeep();
        addToRegister(match);
        setBarcodeInput('');
      }
    } else {
      alert(`SKU "${cleanCode}" not found in active inventory.`);
    }
  };

  // Calculations
  const subtotal = registerCart.reduce((sum, item) => sum + item.product.price, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalDue = subtotal - discountAmount;
  const cashGivenNumber = Number(cashTendered) || 0;
  const changeDue = Math.max(0, cashGivenNumber - totalDue);

  // Complete In-Store Transaction
  const handleCompleteSale = async () => {
    if (registerCart.length === 0 || isProcessing) return;
    if (paymentMethod === 'Cash' && cashGivenNumber < totalDue) {
      alert(`Insufficient cash tendered. Total due is ₹${totalDue.toLocaleString('en-IN')}`);
      return;
    }

    setIsProcessing(true);
    try {
      const result = await api.checkout.process({
        channel: 'In-Store POS',
        customerName: customerName.trim() || 'Walk-in Customer',
        customerContact: customerPhone.trim() || undefined,
        productIds: registerCart.map((item) => item.product.id),
        discountPercent,
        paymentMethod:
          paymentMethod === 'UPI'
            ? 'UPI (GPay / PhonePe / Paytm)'
            : paymentMethod === 'Cash'
            ? 'Cash Tender'
            : 'Card / POS Terminal',
        cashTendered: paymentMethod === 'Cash' ? cashGivenNumber : undefined,
      });

      playSuccessChime();
      setActiveReceipt(result.order);
      setRegisterCart([]);
      setCashTendered('');
      setCustomerPhone('');
      setCustomerName('Walk-in Customer');
    } catch (err: any) {
      alert(err.message || 'Transaction failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter products for left touch grid
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.size.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#FAF7F2] font-mono select-none flex flex-col pb-24">
      {/* Top POS Header */}
      <header className="bg-[#141210] border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-[#E67E44] text-white rounded-lg shadow-md">
            <Store className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold font-serif tracking-wider text-white">
                VINTAGE VOGUE IN-STORE POS
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold animate-pulse">
                LIVE TERMINAL
              </span>
            </div>
            <p className="text-[10px] text-white/50 tracking-wider">
              KOTA STUDIO HUB • RAJASTHAN COUNTER • OMNICHANNEL 1-OF-1 SYNC
            </p>
          </div>
        </div>

        {/* Hotkey Guide */}
        <div className="hidden lg:flex items-center gap-3 text-[10px] text-white/60 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">F1</kbd> Scan</span>
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">F2</kbd> 10% Off</span>
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">F3</kbd> UPI</span>
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">F4</kbd> Cash</span>
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">ESC</kbd> Void</span>
        </div>

        {/* Exit Button */}
        <button
          onClick={() => {
            playClickSound();
            setViewMode('storefront');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <span>Exit to Storefront</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Main POS Split Screen: 65% Catalog Grid | 35% Active Ticket Register */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: 65% Touch Catalog & Barcode Scanner */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          
          {/* Barcode / SKU Scanner Input Strip */}
          <div className="bg-[#141210] border border-white/10 p-3 rounded-xl shadow-lg relative overflow-hidden">
            {isScanningAnimation && (
              <div className="absolute inset-0 bg-[#E67E44]/15 animate-pulse pointer-events-none border border-[#E67E44]"></div>
            )}
            <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Scan className="w-4 h-4 text-[#E67E44] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={barcodeInputRef}
                  type="text"
                  placeholder="Scan barcode or type SKU (e.g. VV-D24-01)... [Press Enter]"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#E67E44] transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#E67E44] hover:bg-[#d57038] text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Scan SKU</span>
              </button>
            </form>

            {/* Quick Test Barcode Pills */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none text-[10px]">
              <span className="text-white/40 uppercase whitespace-nowrap">Quick Scan:</span>
              {['VV-D24-01', 'VV-D24-02', 'VV-D24-03', 'VV-D24-05'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setBarcodeInput(code);
                    playScanBeep();
                    const p = products.find((item) => item.referenceCode === code);
                    if (p) addToRegister(p);
                  }}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition-colors"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Category Filter Tabs & Instant Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-[#141210] border border-white/10 p-2 rounded-xl">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'boxy-shirts', label: 'Boxy Shirts' },
                { id: 'denim-workwear', label: 'Denim' },
                { id: 'leather-jackets', label: 'Leather' },
                { id: 'vintage-tees', label: 'Tees' },
                { id: 'dresses-corsets', label: 'Dresses' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    playClickSound();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-[#E67E44] text-white shadow'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#E67E44]"
              />
            </div>
          </div>

          {/* Touch-Friendly Visual Catalog Grid */}
          <div className="flex-1 bg-[#141210] border border-white/10 rounded-xl p-3 overflow-y-auto max-h-[640px] scrollbar-none">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
              {filteredProducts.map((p) => {
                const isInTicket = registerCart.some((item) => item.product.id === p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (p.inStock && !isInTicket) addToRegister(p);
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group ${
                      !p.inStock
                        ? 'bg-black/30 border-red-500/20 opacity-50 cursor-not-allowed'
                        : isInTicket
                        ? 'bg-[#E67E44]/15 border-[#E67E44] shadow-lg ring-1 ring-[#E67E44]'
                        : 'bg-[#181513] border-white/10 hover:border-white/30 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div>
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/60 mb-2">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/assets/images/boxy-embroidered-shirt.jpg';
                          }}
                        />
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-bold text-[#E67E44]">
                          {p.referenceCode}
                        </span>
                        <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-sm text-[9px] font-bold text-white">
                          {p.size}
                        </span>
                        {!p.inStock && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-1 text-center">
                            <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">
                              SOLD OUT
                            </span>
                          </div>
                        )}
                      </div>

                      <h4 className="font-serif font-bold text-xs text-white line-clamp-1">
                        {p.title}
                      </h4>
                      <p className="text-[10px] text-white/50">{p.era}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2">
                      <span className="text-xs font-bold text-[#E67E44]">
                        {formatPrice(p.price)}
                      </span>
                      <button
                        disabled={!p.inStock || isInTicket}
                        className={`p-1.5 rounded-md text-[10px] transition-all ${
                          isInTicket
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : p.inStock
                            ? 'bg-white/10 hover:bg-[#E67E44] text-white'
                            : 'bg-black/20 text-white/20'
                        }`}
                      >
                        {isInTicket ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 35% Live Transaction Register & Checkout Terminal */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-[#141210] border border-white/10 rounded-xl p-4 shadow-2xl space-y-3">
          
          {/* Ticket Header & Customer Profile */}
          <div className="space-y-3 border-b border-white/10 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white font-serif">CURRENT TICKET</span>
                <span className="px-2 py-0.2 rounded-full bg-[#E67E44] text-white text-[10px] font-bold">
                  {registerCart.length} Items
                </span>
              </div>
              {registerCart.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Void entire active ticket?')) setRegisterCart([]);
                  }}
                  className="text-[10px] text-red-400 hover:text-red-300 transition-colors"
                >
                  Void (Esc)
                </button>
              )}
            </div>

            {/* Customer Inputs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[9px] text-white/50 mb-0.5">Customer Name</label>
                <div className="relative">
                  <User className="w-3 h-3 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-7 pr-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#E67E44]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] text-white/50 mb-0.5">WhatsApp / Phone</label>
                <div className="relative">
                  <Phone className="w-3 h-3 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+91..."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-7 pr-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#E67E44]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Active Ticket Items List */}
          <div className="flex-1 overflow-y-auto max-h-[200px] divide-y divide-white/5 pr-1 scrollbar-none">
            {registerCart.length === 0 ? (
              <div className="py-10 text-center text-white/40 text-xs">
                Ticket is empty.<br />Scan a barcode or tap specimens to add.
              </div>
            ) : (
              registerCart.map((item) => (
                <div key={item.product.id} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#E67E44] font-bold text-[10px]">{item.product.referenceCode}</span>
                      <span className="text-white font-serif font-bold text-xs">{item.product.title}</span>
                    </div>
                    <span className="text-[10px] text-white/50">{item.product.size} • 1-of-1</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{formatPrice(item.product.price)}</span>
                    <button
                      onClick={() => removeFromRegister(item.product.id)}
                      className="p-1 text-white/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment & Calculations Container */}
          <div className="border-t border-white/10 pt-3 space-y-3">
            {/* Discount Selector */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Discount:</span>
              <div className="flex items-center gap-1">
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setDiscountPercent(pct);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      discountPercent === pct
                        ? 'bg-[#E67E44] text-white'
                        : 'bg-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {pct === 0 ? 'None' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1 text-xs text-white/70">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({discountPercent}%):</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base font-bold text-white pt-1 border-t border-white/10">
                <span>TOTAL DUE (₹):</span>
                <span className="text-emerald-400 font-mono">{formatPrice(totalDue)}</span>
              </div>
            </div>

            {/* Tender Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[
                { id: 'UPI', label: 'UPI QR (F3)', icon: QrCode },
                { id: 'Cash', label: 'Cash (F4)', icon: DollarSign },
                { id: 'Card', label: 'Card POS', icon: CreditCard },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setPaymentMethod(m.id as any);
                    }}
                    className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-emerald-500 text-black shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-white/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* UPI QR Display Mode */}
            {paymentMethod === 'UPI' && totalDue > 0 && (
              <div className="bg-black/40 border border-emerald-500/30 p-2.5 rounded-lg flex items-center gap-3">
                <div className="w-14 h-14 bg-white p-1 rounded flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-12 h-12 text-black" />
                </div>
                <div className="text-[10px] leading-tight space-y-0.5">
                  <span className="text-emerald-400 font-bold block">Scan Bharat UPI QR</span>
                  <span className="text-white/70 block">VPA: vintagevogue@upi</span>
                  <span className="text-white/40 block text-[9px]">GPay • PhonePe • Paytm • BHIM</span>
                </div>
              </div>
            )}

            {/* Cash Tender Input Mode with Rupee Denomination Buttons */}
            {paymentMethod === 'Cash' && (
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Cash tendered (₹)..."
                    value={cashTendered}
                    onChange={(e) => setCashTendered(Number(e.target.value))}
                    className="flex-1 bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => setCashTendered(totalDue)}
                    className="px-2 py-1 rounded bg-white/10 text-[10px] hover:bg-white/20 text-white"
                  >
                    Exact
                  </button>
                </div>

                <div className="flex items-center gap-1 text-[9px]">
                  {[100, 200, 500, 2000].map((note) => (
                    <button
                      key={note}
                      type="button"
                      onClick={() => setCashTendered((prev) => (Number(prev) || 0) + note)}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-white/80"
                    >
                      +₹{note}
                    </button>
                  ))}
                </div>

                {cashGivenNumber > 0 && (
                  <div className="flex justify-between text-xs pt-1 border-t border-white/10">
                    <span className="text-white/60">Change Return:</span>
                    <span className={`font-bold ${changeDue >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatPrice(changeDue)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Checkout Action Button */}
            <button
              disabled={registerCart.length === 0 || isProcessing}
              onClick={handleCompleteSale}
              className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl ${
                registerCart.length === 0
                  ? 'bg-white/10 text-white/30 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Processing Transaction...'
                  : `Complete Sale & Lock Inventory (${formatPrice(totalDue)})`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* THERMAL PAPER RECEIPT MODAL */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] text-[#181513] max-w-sm w-full rounded-2xl shadow-2xl p-6 font-mono text-xs space-y-4 animate-slideUp border border-[#181513]/20">
            <div className="flex items-center justify-between border-b border-[#181513]/10 pb-2">
              <span className="font-bold text-xs">THERMAL RECEIPT PREVIEW</span>
              <button
                onClick={() => setActiveReceipt(null)}
                className="p-1 rounded hover:bg-black/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-4 border border-[#181513]/15 rounded shadow-inner whitespace-pre font-mono text-[11px] leading-tight overflow-x-auto text-[#181513]">
              {api.notifications.getThermalReceipt(activeReceipt)}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  playClickSound();
                  window.print();
                }}
                className="flex-1 py-2.5 bg-[#181513] hover:bg-[#E67E44] text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={() => setActiveReceipt(null)}
                className="px-4 py-2.5 bg-black/10 hover:bg-black/20 text-[#181513] rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
