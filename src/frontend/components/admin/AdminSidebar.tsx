import React from 'react';
import {
  BarChart3,
  CreditCard,
  ShoppingBag,
  RotateCcw,
  Package,
  Layers,
  LayoutGrid,
  Users,
  Tag,
  Star,
  Images,
  FolderOpen,
  MessageSquare,
  MessageSquareText,
  Megaphone,
  FileText,
  Settings,
  Shield,
  Eye,
  LogOut,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { playClickSound } from '../../utils/audio';

export type AdminTab =
  | 'dashboard'
  | 'billing'
  | 'orders'
  | 'returns'
  | 'products'
  | 'categories'
  | 'sections'
  | 'customers'
  | 'coupons'
  | 'reviews'
  | 'hero'
  | 'media'
  | 'sms'
  | 'queries'
  | 'marketing'
  | 'pages'
  | 'settings'
  | 'admins';

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

  const navigationItems: {
    id: AdminTab;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'billing', label: 'Offline Billing', icon: CreditCard },
    { id: 'orders', label: 'Online Orders', icon: ShoppingBag, badge: totalOrdersCount > 0 ? totalOrdersCount : 1, badgeColor: 'bg-[#E11D48] text-white' },
    { id: 'returns', label: 'Online Returns', icon: RotateCcw },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'sections', label: 'Homepage Sections', icon: LayoutGrid },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'hero', label: 'Hero Media', icon: Images },
    { id: 'media', label: 'Media Library', icon: FolderOpen },
    { id: 'sms', label: 'SMS Logs', icon: MessageSquare },
    { id: 'queries', label: 'Queries', icon: MessageSquareText },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'pages', label: 'Pages & Policies', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'admins', label: 'Admins', icon: Shield },
  ];

  return (
    <aside className="w-60 bg-[#FAF7F2] border-r border-[#EAE3D4] text-[#181513] flex flex-col justify-between flex-shrink-0 min-h-screen select-none font-sans">
      {/* Brand & Nav List */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Brand Header */}
        <div className="p-4 pb-3 border-b border-[#EAE3D4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#8B2635] text-white flex items-center justify-center font-serif font-bold text-sm shadow-sm">
              VV
            </div>
            <div>
              <h2 className="font-serif text-sm font-bold tracking-tight text-[#181513]">
                Vintage Vogue
              </h2>
              <span className="text-[9px] font-mono text-[#8B2635] tracking-widest uppercase font-bold block">
                Executive Suite
              </span>
            </div>
          </div>
          <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
            Live
          </span>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5 text-xs">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playClickSound();
                  onSelectTab(item.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-[#8B2635] text-white font-semibold shadow-xs'
                    : 'text-[#5C564E] hover:text-[#181513] hover:bg-[#F2ECE1]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#7D7569]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold shrink-0 ${
                      item.badgeColor || (isActive ? 'bg-white text-[#8B2635]' : 'bg-red-500 text-white')
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

      {/* Bottom Actions */}
      <div className="p-3 border-t border-[#EAE3D4] bg-[#F7F3EB] space-y-1 text-xs">
        <button
          onClick={() => {
            playClickSound();
            setViewMode('storefront');
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#5C564E] hover:text-[#181513] hover:bg-[#EAE3D4]/80 transition-colors"
        >
          <Eye className="w-4 h-4 text-[#7D7569]" />
          <span className="font-medium">View live store</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setViewMode('storefront');
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#8B2635] hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4 text-[#8B2635]" />
          <span className="font-semibold">Sign out</span>
        </button>

        <div className="px-3 pt-1 text-[10px] font-mono text-[#7D7569] flex items-center gap-1.5">
          <MapPin className="w-2.5 h-2.5 text-[#8B2635]" />
          <span>Sogaria Hub, Kota 324002</span>
        </div>
      </div>
    </aside>
  );
};
