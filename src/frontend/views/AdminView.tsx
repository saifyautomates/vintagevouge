import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { AdminSidebar, AdminTab } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminDashboardOverview } from '../components/admin/AdminDashboardOverview';
import { AdminProductsManager } from '../components/admin/AdminProductsManager';
import { AdminOrdersManager } from '../components/admin/AdminOrdersManager';
import { AdminDropLaunchpad } from '../components/admin/AdminDropLaunchpad';
import { AdminPOSAudit } from '../components/admin/AdminPOSAudit';
import { AdminMarketingStudio } from '../components/admin/AdminMarketingStudio';
import { AdminSettingsModal } from '../components/admin/AdminSettingsModal';
import { AdminAddSpecimenModal } from '../components/admin/AdminAddSpecimenModal';
import {
  AdminBillingTab,
  AdminReturnsTab,
  AdminCustomersTab,
  AdminCouponsTab,
  AdminQueriesTab,
  AdminSmsLogsTab,
  AdminStaffTab
} from '../components/admin/AdminExtendedTabs';
import { Layers, Star, Images, FolderOpen, FileText } from 'lucide-react';

export const AdminView: React.FC = () => {
  const { products, orders } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const inStockCount = products.filter((p) => p.inStock).length;

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#181513] flex flex-col md:flex-row antialiased selection:bg-[#8B2635] selection:text-white">
      {/* ─── LEFT SIDEBAR (Matching Zerah & Screenshot) ─── */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        inStockCount={inStockCount}
        totalOrdersCount={orders.length}
      />

      {/* ─── MAIN ADMINISTRATIVE WORKSPACE ─── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#FBF9F5]">
        {/* Sticky Utility Header */}
        <AdminHeader
          onOpenAddModal={() => setIsAddModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
        />

        {/* Dynamic Tab Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto max-w-[1600px] w-full mx-auto space-y-6">
          {/* Tab 1: Dashboard (Executive Performance Overview) */}
          {activeTab === 'dashboard' && (
            <AdminDashboardOverview
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {/* Tab 2: Offline Billing POS Register */}
          {activeTab === 'billing' && <AdminBillingTab />}

          {/* Tab 3: Online Orders & Air Dispatch */}
          {activeTab === 'orders' && (
            <AdminOrdersManager searchQuery={searchQuery} />
          )}

          {/* Tab 4: Online Returns & Exchanges */}
          {activeTab === 'returns' && <AdminReturnsTab />}

          {/* Tab 5: Catalog Products Manager */}
          {activeTab === 'products' && (
            <AdminProductsManager
              onOpenAddModal={() => setIsAddModalOpen(true)}
              searchQuery={searchQuery}
            />
          )}

          {/* Tab 6: Categories Manager */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold font-sans">Archival Department Categories</h2>
                <p className="text-xs text-[#6B6358] mt-0.5">
                  Curated taxonomies sourced from Tokyo, Osaka, and vintage American flea markets.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'Japanese Selvedge Denim', count: '142 Items', desc: '14oz-16oz Kurabo & Kojima milled raw denim jackets and jeans.' },
                  { name: 'Leather Bombers & Motor', count: '89 Items', desc: 'Heavyweight steerhide, lambskin and distressed 90s flight jackets.' },
                  { name: 'Vintage Boxy Camp Shirts', count: '168 Items', desc: 'Chain-stitched rayon, embroidered silk, and 70s bowling silhouettes.' },
                  { name: 'Prairie & Floral Midi Dresses', count: '112 Items', desc: 'Deadstock Osaka florals, tiered hem cotton, and bohemian lace.' },
                  { name: 'Detroit Canvas Workwear', count: '94 Items', desc: 'Blanket-lined chore jackets and double-knee distressed work pants.' },
                  { name: 'Band & Archival Graphic Tees', count: '27 Items', desc: 'Single-stitch 1990s Japanese tour merchandise and rock archives.' },
                ].map((cat) => (
                  <div key={cat.name} className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-2xs space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#8B2635]/10 text-[#8B2635] flex items-center justify-center font-bold">
                      <Layers className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-[#181513]">{cat.name}</h3>
                    <p className="text-xs text-[#6B6358] leading-relaxed">{cat.desc}</p>
                    <span className="text-[10px] font-mono text-[#8B2635] font-bold block pt-1">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 7: Homepage Sections (Drop Launchpad) */}
          {activeTab === 'sections' && <AdminDropLaunchpad />}

          {/* Tab 8: Customers CRM */}
          {activeTab === 'customers' && <AdminCustomersTab />}

          {/* Tab 9: Coupons & Promos */}
          {activeTab === 'coupons' && <AdminCouponsTab />}

          {/* Tab 10: Reviews & Provenance */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold font-sans">Verified Collector Provenance Reviews</h2>
                <p className="text-xs text-[#6B6358] mt-0.5">
                  Archival condition authenticity feedback from Blue Dart delivered orders.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Dr. Arjun M. (Bengaluru)', piece: '14oz Denim Trucker Overshirt', rating: 5, comment: 'Museum grade quality. The Kojima selvedge patina is unbelievable. Steam sealed packaging from Kota studio was top tier.', date: 'Nov 12, 2026' },
                  { name: 'Rhea Sengupta (Mumbai)', piece: 'Prairie Floral Midi Dress', rating: 5, comment: 'Exactly as described flat measurements. Fits like a glove. 100% authentic vintage Tokyo thrift.', date: 'Nov 10, 2026' },
                ].map((rev) => (
                  <div key={rev.name} className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-[#8C857B]">{rev.date}</span>
                    </div>
                    <h4 className="font-bold text-xs text-[#181513]">{rev.name} • <span className="text-[#8B2635]">{rev.piece}</span></h4>
                    <p className="text-xs text-[#5C564E] leading-relaxed italic">&ldquo;{rev.comment}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 11: Hero Media Manager */}
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold font-sans">Hero Media & Drop Banners</h2>
                <p className="text-xs text-[#6B6358] mt-0.5">
                  Curate the editorial lookbook video background and drop countdown hero artwork.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-2xs space-y-4">
                <div className="aspect-[21/9] bg-[#FAF7F2] rounded-xl border border-[#E5E0D8] overflow-hidden flex items-center justify-center relative">
                  <img src="/assets/images/vintage-denim-trucker.jpg" alt="Active Hero Banner" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-center p-4">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-[#8B2635] text-white text-[10px] font-mono font-bold uppercase">Active Drop #24 Banner</span>
                      <h3 className="text-2xl font-serif font-bold mt-2">Japanese Selvedge & Archival Thrift</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 12: Media Library */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold font-sans">Archival Photography Vault (Media Library)</h2>
                <p className="text-xs text-[#6B6358] mt-0.5">
                  High-resolution flat lay measurements and macro grain details for all 632 catalog items.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {products.map((p) => (
                  <div key={p.id} className="bg-white p-2 rounded-xl border border-[#E5E0D8] shadow-2xs space-y-1.5">
                    <div className="aspect-square bg-[#FAF7F2] rounded-lg overflow-hidden">
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </div>
                    <span className="font-mono text-[9px] font-bold text-[#8B2635] block truncate">[{p.referenceCode}]</span>
                    <span className="text-[10px] text-[#181513] font-medium block truncate">{p.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 13: SMS Logs */}
          {activeTab === 'sms' && <AdminSmsLogsTab />}

          {/* Tab 14: Queries */}
          {activeTab === 'queries' && <AdminQueriesTab />}

          {/* Tab 15: Marketing Studio */}
          {activeTab === 'marketing' && <AdminMarketingStudio />}

          {/* Tab 16: Pages & Policies */}
          {activeTab === 'pages' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold font-sans">Legal Policies & Studio Guarantees</h2>
                <p className="text-xs text-[#6B6358] mt-0.5">
                  Published customer contracts governing pan-India dispatches from Kota, Rajasthan.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: '48-Hour Studio Exchange Protocol', desc: 'Allows customers to swap sizes or receive 100% store credit with zero deduction.' },
                  { title: '100% Archival Authenticity Certificate', desc: 'Triple-stage verification: single-stitch hems, YKK/Talon brass zippers, and Kurabo selvedge ID.' },
                  { title: 'Blue Dart Air Express SLA', desc: 'Guaranteed dispatch within 24 business hours from Sogaria Hub (Pincode: 324002).' },
                ].map((pol) => (
                  <div key={pol.title} className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-2xs space-y-2">
                    <FileText className="w-5 h-5 text-[#8B2635]" />
                    <h3 className="font-bold text-sm text-[#181513]">{pol.title}</h3>
                    <p className="text-xs text-[#6B6358] leading-relaxed">{pol.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 17: Settings (Payment Switchboard) */}
          {activeTab === 'settings' && <AdminSettingsModal />}

          {/* Tab 18: Admins */}
          {activeTab === 'admins' && <AdminStaffTab />}
        </main>
      </div>

      {/* Ingest New 1-of-1 Specimen Modal */}
      <AdminAddSpecimenModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
