import React from 'react';
import {
  Store,
  DollarSign,
  TrendingUp,
  Receipt,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { playClickSound } from '../../utils/audio';

export const AdminPOSAudit: React.FC = () => {
  const { orders, setViewMode } = useStore();
  const { formatPrice } = useCart();

  const posOrders = orders.filter((o) => o.channel === 'In-Store POS');
  const totalPosGMV = posOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const upiTotal = posOrders
    .filter((o) => o.paymentMethod.includes('UPI'))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const cashTotal = posOrders
    .filter((o) => o.paymentMethod.includes('Cash'))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const cardTotal = posOrders
    .filter((o) => o.paymentMethod.includes('Card'))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6 max-w-5xl text-white">
      {/* Header */}
      <div className="bg-[#181513] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-400" />
            <h3 className="font-serif text-2xl font-bold">Kota Counter POS Audit & Drawer Reconciliation</h3>
          </div>
          <p className="font-sans text-xs text-white/60">
            Fulfillment register audit for walk-in collectors at Sogaria / Workshop Road studio.
          </p>
        </div>

        <button
          onClick={() => {
            playClickSound();
            setViewMode('pos');
          }}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all uppercase"
        >
          <span>Open POS Counter</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* POS KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total In-Store GMV */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-5 space-y-2 shadow-lg">
          <span className="text-[10px] font-mono uppercase text-white/50 block">In-Store Counter GMV</span>
          <span className="font-serif text-3xl font-bold text-white block">
            {formatPrice(totalPosGMV)}
          </span>
          <span className="text-[10px] font-mono text-emerald-400 block font-bold">
            {posOrders.length} walk-in counter tickets
          </span>
        </div>

        {/* UPI Settled */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-5 space-y-2 shadow-lg">
          <span className="text-[10px] font-mono uppercase text-white/50 block">Bharat UPI QR Settled</span>
          <span className="font-serif text-3xl font-bold text-emerald-400 block">
            {formatPrice(upiTotal)}
          </span>
          <span className="text-[10px] font-mono text-white/40 block">
            VPA: vintagevogue@upi
          </span>
        </div>

        {/* Cash Tendered In Drawer */}
        <div className="bg-[#181513] border border-white/10 rounded-2xl p-5 space-y-2 shadow-lg">
          <span className="text-[10px] font-mono uppercase text-white/50 block">Physical Cash In Drawer</span>
          <span className="font-serif text-3xl font-bold text-amber-300 block">
            {formatPrice(cashTotal)}
          </span>
          <span className="text-[10px] font-mono text-white/40 block">
            Counted & balanced for shift close
          </span>
        </div>
      </div>

      {/* POS Transactions List */}
      <div className="bg-[#181513] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h4 className="font-serif font-bold text-base">In-Store Register Ledger</h4>
          <span className="text-xs font-mono text-white/50">{posOrders.length} Tickets Recorded</span>
        </div>

        <div className="divide-y divide-white/5 font-mono text-xs">
          {posOrders.map((order) => (
            <div key={order.id} className="py-3.5 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{order.customerName}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {order.paymentMethod}
                  </span>
                  <span className="text-white/40 text-[10px]">
                    {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-[11px] text-white/50 mt-1">
                  {order.items.map((i) => `[${i.referenceCode}] ${i.title} (${i.size})`).join(', ')}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {order.changeGiven !== undefined && order.changeGiven > 0 && (
                  <span className="text-[10px] text-white/40">
                    Change: {formatPrice(order.changeGiven)}
                  </span>
                )}
                <span className="font-serif font-bold text-base text-white">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

