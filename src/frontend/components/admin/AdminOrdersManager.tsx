import React, { useState } from 'react';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  MessageCircle,
  ExternalLink,
  Store,
  Filter,
  Search,
  Check,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { OrderRecord, OrderStatus } from '../../../database/schema';
import { api } from '../../../backend/api/client';
import { playClickSound, playSuccessChime } from '../../utils/audio';

interface AdminOrdersManagerProps {
  searchQuery: string;
}

export const AdminOrdersManager: React.FC<AdminOrdersManagerProps> = ({ searchQuery }) => {
  const { orders } = useStore();
  const { formatPrice } = useCart();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<OrderRecord | null>(null);

  const statuses: OrderStatus[] = ['Sanitizing', 'Wax-Sealing', 'Dispatched', 'Completed', 'Cancelled'];

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.customerName.toLowerCase().includes(q) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q)) ||
      (o.customerContact && o.customerContact.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    playClickSound();
    await api.orders.updateStatus(orderId, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="bg-[#181513] border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-white">
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'Sanitizing', 'Wax-Sealing', 'Dispatched', 'Completed'].map((s) => (
            <button
              key={s}
              onClick={() => {
                playClickSound();
                setStatusFilter(s);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                statusFilter === s
                  ? 'bg-[#E67E44] text-white font-bold shadow'
                  : 'bg-white/5 hover:bg-white/10 text-white/70'
              }`}
            >
              {s === 'all' ? 'All Orders' : s}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-white/50">
          Showing {filteredOrders.length} of {orders.length} orders
        </span>
      </div>

      {/* Orders Ledger Cards */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-[#181513] border border-white/10 rounded-2xl p-5 text-white space-y-4 shadow-xl hover:border-white/20 transition-all"
          >
            {/* Top Strip */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3 text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                  order.channel === 'In-Store POS'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                }`}>
                  {order.channel}
                </span>

                <span className="text-white/40">•</span>
                <span className="font-bold text-white">{order.customerName}</span>
                <span className="text-white/40">•</span>
                <span className="text-white/60">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-white/50">Tracking:</span>
                <span className="font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10 text-[#E67E44]">
                  {order.trackingNumber || 'POS-RECEIPT'}
                </span>
              </div>
            </div>

            {/* Middle: Items & Address */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-mono">
              {/* Items List (7 cols) */}
              <div className="md:col-span-7 space-y-2">
                <span className="text-[10px] uppercase text-white/40 font-bold block">Specimens in Order</span>
                <div className="space-y-1.5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/[0.03] p-2 rounded-lg border border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-[#E67E44] font-bold">[{item.referenceCode}]</span>
                        <span className="text-white font-serif">{item.title}</span>
                        <span className="text-[10px] text-white/40">({item.size})</span>
                      </div>
                      <span className="font-bold text-white">{formatPrice(item.unitPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery & Payment (5 cols) */}
              <div className="md:col-span-5 space-y-2 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-[10px] uppercase text-white/40 font-bold block">Dispatch Destination</span>
                  <p className="text-[11px] text-white/80 mt-0.5 leading-relaxed">
                    {order.customerContact || 'Studio Counter Collection • Sogaria Hub, Kota'}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[11px]">
                  <span className="text-white/50">Payment Mode:</span>
                  <span className="font-bold text-emerald-400">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-white/5 font-serif text-sm">
                  <span className="font-sans text-[11px] text-white/50 font-mono">Total Paid:</span>
                  <span className="font-bold text-white text-base">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions & Status Changer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-white/40">Fulfillment Status:</span>
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                  className="bg-white/5 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white outline-none focus:border-[#E67E44] cursor-pointer"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st} className="bg-[#181513] text-white">
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                {/* Print Receipt */}
                <button
                  onClick={() => {
                    playClickSound();
                    setActiveReceiptOrder(order);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[11px] flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-white/70" />
                  <span>Thermal Receipt</span>
                </button>

                {/* WhatsApp Dispatch Notification */}
                <a
                  href={api.notifications.getWhatsAppUrl(order)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/30 text-[#25D366] text-[11px] flex items-center gap-1.5 transition-colors font-bold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send WhatsApp Alert</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Printable Receipt Modal */}
      {activeReceiptOrder && (
        <div 
          onClick={() => setActiveReceiptOrder(null)} 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-[#FAF7F2] text-[#181513] max-w-sm w-full rounded-2xl shadow-2xl p-6 font-mono text-xs space-y-4 animate-slideUp border border-[#181513]/20"
          >
            <div className="flex items-center justify-between border-b border-[#181513]/10 pb-2">
              <span className="font-bold text-xs uppercase">THERMAL DISPATCH INVOICE</span>
              <button
                onClick={() => setActiveReceiptOrder(null)}
                className="p-1 rounded hover:bg-black/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-4 border border-[#181513]/15 rounded shadow-inner whitespace-pre font-mono text-[11px] leading-tight overflow-x-auto text-[#181513]">
              {api.notifications.getThermalReceipt(activeReceiptOrder)}
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
                <span>Print</span>
              </button>

              <button
                onClick={() => setActiveReceiptOrder(null)}
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

