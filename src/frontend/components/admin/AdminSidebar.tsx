import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  Clock,
  Instagram,
  Settings,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { playClickSound } from '../../utils/audio';

export type AdminTab =
  | 'overview'
  | 'inventory'
  | 'orders'
  | 'pos-audit'
  | 'drop-control'
  | 'marketing'
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  inStockCount: number;
  totalOrdersCount: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  inStockCount,
  totalOrdersCount,
}) => {
  const { setViewMode } = useStore();

  const navItems: { id: AdminTab; label: string; icon: React.ElementType; badge?: string | number }[] = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'inventory', label: '1-of-1 Catalog', icon: Package, badge: inStockCount },
    { id: 'orders', label: 'Orders & Air Dispatch', icon: ShoppingBag, badge: totalOrdersCount },
    { id: 'pos-audit', label: 'Kota POS Counter Audit', icon: Store },
    { id: 'drop-control', label: 'Drop #24 Launchpad', icon: Clock, badge: 'GATE' },
    { id: 'marketing', label: 'Instagram Caption Studio', icon: Instagram },
    { id: 'settings', label: 'Studio Configuration', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#141210] border-r border-white/10 text-white flex flex-col justify-between flex-shrink-0 min-h-screen">
      {/* Top Header & Brand */}
      <div>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E67E44] flex items-center justify-center font-serif font-bold text-white shadow-lg text-sm">
              VV
            </div>
            <div>
              <h2 className="font-serif text-sm font-bold tracking-wider text-white">
                VINTAGE VOGUE
              </h2>
              <span className="text-[10px] font-mono text-[#E67E44] tracking-widest uppercase block font-semibold">
                ADMIN COMMAND SUITE
              </span>
            </div>
          </div>

          <div className="mt-3.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-[10px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>KOTA HUB LIVE</span>
            </span>
            <span className="text-white/40">v3.4.0</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playClickSound();
                  onSelectTab(item.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-[#E67E44] text-white font-bold shadow-md shadow-[#E67E44]/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/60'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer & Storefront Switcher */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <button
          onClick={() => {
            playClickSound();
            setViewMode('storefront');
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/90 flex items-center justify-center gap-2 transition-all group"
        >
          <span>View Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#E67E44] group-hover:translate-x-0.5 transition-transform" />
        </button>

        <div className="px-2 pt-1 flex items-center gap-2 text-[10px] font-mono text-white/40">
          <MapPin className="w-3 h-3 text-[#E67E44]" />
          <span>Sogaria Studio, Kota, RJ – 324002</span>
        </div>
      </div>
    </aside>
  );
};

