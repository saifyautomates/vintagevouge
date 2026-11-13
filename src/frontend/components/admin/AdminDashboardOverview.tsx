import React from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Store,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../../backend/api/client';
import { playClickSound } from '../../utils/audio';

interface AdminDashboardOverviewProps {
  onNavigateToTab: (tab: any) => void;
  onOpenAddModal: () => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  onNavigateToTab,
  onOpenAddModal,
}) => {
  const { products, orders, totalRevenue, dropConfig } = useStore();
  const { formatPrice } = useCart();

  const inStockCount = products.filter((p) => p.inStock).length;
  const soldOutCount = products.filter((p) => !p.inStock).length;
  const totalCount = products.length;
  const sellThroughRate = totalCount > 0 ? Math.round((soldOutCount / totalCount) * 100) : 0;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const onlineOrders = orders.filter((o) => o.channel === 'Online Store');
  const posOrders = orders.filter((o) => o.channel === 'In-Store POS');

  const onlineRevenue = onlineOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const posRevenue = posOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-[#1E1B18] via-[#241F1A] to-[#1E1B18] border border-white/10 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#E67E44]/20 border border-[#E67E44]/40 text-[#E67E44] text-[10px] font-mono font-bold uppercase">
              {dropConfig.title}
            </span>
            <span className="text-white/40 text-xs font-mono">•</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">LIVE TELEMETRY</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold">
            Executive Performance Dossier
          </h3>
          <p className="font-sans text-xs text-white/60">
            Real-time multi-channel aggregation across Sogaria Studio Counter & Online Flagship.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToTab('drop-control')}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-mono rounded-xl transition-all"
          >
            Drop Controls
          </button>
          <button
            onClick={() => onNavigateToTab('inventory')}
            className="px-4 py-2 bg-[#E67E44] hover:bg-[#d57038] text-white text-xs font-mono rounded-xl font-bold shadow-md transition-all"
          >
            Manage Catalog
          </button>
        </div>
      </div>

      {/* 4 Main Key Metric Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-5 text-white space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/60 uppercase font-semibold">Total GMV Revenue</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div>
            <span className="font-serif text-3xl font-bold text-white block">
              {formatPrice(totalRevenue)}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+24.6% vs previous drop</span>
            </span>
          </div>
        </div>

        {/* Card 2: 1-of-1 Inventory */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-5 text-white space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/60 uppercase font-semibold">Live 1-of-1 Catalog</span>
            <span className="p-2 rounded-xl bg-[#E67E44]/10 text-[#E67E44] border border-[#E67E44]/20">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-white">
                {inStockCount}
              </span>
              <span className="text-xs font-mono text-white/40">of {totalCount} remaining</span>
            </div>
            <span className="text-[10px] font-mono text-[#E67E44] block mt-1">
              {soldOutCount} specimens claimed & archived
            </span>
          </div>
        </div>

        {/* Card 3: Sell-Through Rate */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-5 text-white space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/60 uppercase font-semibold">Drop Sell-Through Rate</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div>
            <span className="font-serif text-3xl font-bold text-white block">
              {sellThroughRate}%
            </span>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#E67E44] h-full rounded-full transition-all duration-500"
                style={{ width: `${sellThroughRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Average Order Value */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-5 text-white space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/60 uppercase font-semibold">Average Order Value</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div>
            <span className="font-serif text-3xl font-bold text-white block">
              {formatPrice(avgOrderValue)}
            </span>
            <span className="text-[10px] font-mono text-white/40 block mt-1">
              Across {orders.length} total orders
            </span>
          </div>
        </div>
      </div>

      {/* Multi-Channel Split: Online Storefront vs In-Store Kota POS Counter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel 1: Online Storefront */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-6 text-white space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base">Online Web Storefront</h4>
                <span className="text-[10px] font-mono text-white/50">Pan-India Express Dispatches</span>
              </div>
            </div>
            <span className="font-serif text-xl font-bold text-white">
              {formatPrice(onlineRevenue)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-white/40 text-[10px] block">ORDERS COUNT</span>
              <span className="text-lg font-bold">{onlineOrders.length} Completed</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-white/40 text-[10px] block">FULFILLMENT</span>
              <span className="text-emerald-400 font-bold">Blue Dart Express Air</span>
            </div>
          </div>
        </div>

        {/* Channel 2: Kota POS Register */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-6 text-white space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base">Kota Studio In-Store POS</h4>
                <span className="text-[10px] font-mono text-white/50">Workshop Road Walk-in Register</span>
              </div>
            </div>
            <span className="font-serif text-xl font-bold text-white">
              {formatPrice(posRevenue)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-white/40 text-[10px] block">ORDERS COUNT</span>
              <span className="text-lg font-bold">{posOrders.length} Completed</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-white/40 text-[10px] block">SETTLEMENT</span>
              <span className="text-emerald-400 font-bold">Bharat UPI + Cash</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Ledger Snapshot */}
      <div className="bg-[#181513] border border-white/10 rounded-2xl p-6 text-white space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h4 className="font-serif font-bold text-base">Recent Fulfillment Ledger</h4>
            <span className="text-[10px] font-mono text-white/50">Live orders synchronized with database engine</span>
          </div>
          <button
            onClick={() => onNavigateToTab('orders')}
            className="text-xs font-mono text-[#E67E44] hover:underline flex items-center gap-1"
          >
            <span>View All ({orders.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-white/5">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="py-3 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  order.channel === 'In-Store POS' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'
                }`}>
                  {order.channel === 'In-Store POS' ? <Store className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{order.customerName}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                      {order.trackingNumber || 'POS-RECEIPT'}
                    </span>
                  </div>
                  <span className="text-[11px] text-white/50 block">
                    {order.items.map((i) => `[${i.referenceCode}] ${i.title}`).join(', ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  order.status === 'Completed' || order.status === 'Dispatched'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {order.status}
                </span>

                <span className="font-bold text-white text-sm font-serif">
                  {formatPrice(order.totalAmount)}
                </span>

                <a
                  href={api.notifications.getWhatsAppUrl(order)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 transition-colors"
                  title="Notify on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

