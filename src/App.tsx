import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './frontend/context/StoreContext';
import { CartProvider, useCart } from './frontend/context/CartContext';
import { StorefrontView } from './frontend/views/StorefrontView';
import { MobileAppView } from './frontend/views/MobileAppView';
import { POSView } from './frontend/views/POSView';
import { AdminView } from './frontend/views/AdminView';
import { ModeSwitcher } from './frontend/components/ModeSwitcher';
import { CustomCursor } from './frontend/components/CustomCursor';
import { NoiseOverlay } from './frontend/components/NoiseOverlay';
import { CommandPalette } from './frontend/components/CommandPalette';
import { ProductDetailModal } from './frontend/components/ProductDetailModal';
import { CartDrawer } from './frontend/components/CartDrawer';
import { DropAlertModal } from './frontend/components/DropAlertModal';
import { ExpressCheckoutModal } from './frontend/components/ExpressCheckoutModal';
import { FitAdvisorModal } from './frontend/components/FitAdvisorModal';
import { ExitIntentModal } from './frontend/components/ExitIntentModal';
import { WebPushPrompt } from './frontend/components/WebPushPrompt';
import { StudioAudioWidget } from './frontend/components/StudioAudioWidget';
import { SocialProofToast } from './frontend/components/SocialProofToast';
import { Category } from './database/schema';
import { Check } from 'lucide-react';
import { playClickSound } from './frontend/utils/audio';

const AppShell: React.FC = () => {
  const { viewMode } = useStore();
  const { toastMessage, isFitAdvisorOpen, setIsFitAdvisorOpen } = useCart();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  // Global Keyboard listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        playClickSound();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#181513] relative selection:bg-[#E67E44] selection:text-white">
      {/* Awwwards Film Grain / Organic Noise Texture Overlay */}
      <NoiseOverlay />

      {/* Awwwards Custom Cursor with Contextual Action Stamps */}
      <CustomCursor />

      {/* View Mode Router */}
      <main className="w-full">
        {viewMode === 'storefront' && (
          <StorefrontView
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            selectedCategory={activeCategory}
            setSelectedCategory={setActiveCategory}
          />
        )}
        {viewMode === 'mobile-app' && <MobileAppView />}
        {viewMode === 'admin' && <AdminView />}
        {viewMode === 'pos' && <POSView />}
      </main>

      {/* Floating Dynamic Glass Switcher Pill (Fixed Across All Views) */}
      <ModeSwitcher />

      {/* Interactive Command Palette (⌘K) Inspired by navbar.gallery */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      {/* Interactive Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <ExpressCheckoutModal />
      <DropAlertModal />
      <ExitIntentModal />
      <FitAdvisorModal isOpen={isFitAdvisorOpen} onClose={() => setIsFitAdvisorOpen(false)} />

      {/* Floating Retro Studio Cassette / Turntable Widget */}
      <StudioAudioWidget />

      {/* Live Social Proof Real-Time Collector Activity (Storefront) */}
      {viewMode === 'storefront' && <SocialProofToast />}

      {/* 1-Tap Browser Web Push Notification Permission Prompt */}
      {viewMode === 'storefront' && <WebPushPrompt />}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-[#181513] text-[#FAF7F2] px-4 py-3 border border-[#E67E44]/50 shadow-2xl flex items-center gap-3 animate-slideUp">
          <div className="w-5 h-5 rounded-full bg-[#E67E44] text-white flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3" />
          </div>
          <span className="font-mono text-xs tracking-wider">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </StoreProvider>
  );
}

export default App;
