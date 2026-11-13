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

export const AdminView: React.FC = () => {
  const { products, orders } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const inStockCount = products.filter((p) => p.inStock).length;

  return (
    <div className="min-h-screen bg-[#0E0D0B] text-white flex flex-col md:flex-row antialiased selection:bg-[#E67E44] selection:text-white">
      {/* Sleek Fixed Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        inStockCount={inStockCount}
        totalOrdersCount={orders.length}
      />

      {/* Main Administrative Workplace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#110F0D]">
        {/* Sticky Utility Header */}
        <AdminHeader
          onOpenAddModal={() => setIsAddModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
        />

        {/* Dynamic Tab Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'overview' && (
            <AdminDashboardOverview
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {activeTab === 'inventory' && (
            <AdminProductsManager
              onOpenAddModal={() => setIsAddModalOpen(true)}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrdersManager searchQuery={searchQuery} />
          )}

          {activeTab === 'pos-audit' && <AdminPOSAudit />}

          {activeTab === 'drop-control' && <AdminDropLaunchpad />}

          {activeTab === 'marketing' && <AdminMarketingStudio />}

          {activeTab === 'settings' && <AdminSettingsModal />}
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
