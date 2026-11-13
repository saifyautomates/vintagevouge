import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductRecord, OrderRecord, DropConfigRecord } from '../../database/schema';
import { db } from '../../database/db';
import { api } from '../../backend/api/client';
import { startVinylCrackle, stopVinylCrackle, setSoundEnabled } from '../utils/audio';

export type ViewMode = 'storefront' | 'mobile-app' | 'admin' | 'pos';

interface StoreContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  products: ProductRecord[];
  setProducts: React.Dispatch<React.SetStateAction<ProductRecord[]>>;
  orders: OrderRecord[];
  totalRevenue: number;
  dropConfig: DropConfigRecord;
  isVinylAudioOn: boolean;
  toggleVinylAudio: () => void;
  refreshData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlView = params.get('view') as ViewMode;
      if (urlView && ['storefront', 'mobile-app', 'admin', 'pos'].includes(urlView)) {
        return urlView;
      }
      const saved = localStorage.getItem('vv_active_view_mode') as ViewMode;
      if (saved && ['storefront', 'mobile-app', 'admin', 'pos'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'storefront';
  });

  const [dbState, setDbState] = useState(() => db.getState());
  const [isVinylAudioOn, setIsVinylAudioOn] = useState(false);

  // Subscribe to Transactional Database Engine
  useEffect(() => {
    const unsubscribe = db.subscribe((newState) => {
      setDbState(newState);
    });
    return () => unsubscribe();
  }, []);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    try {
      localStorage.setItem('vv_active_view_mode', mode);
      const url = new URL(window.location.href);
      if (mode === 'storefront') {
        url.searchParams.delete('view');
      } else {
        url.searchParams.set('view', mode);
      }
      window.history.replaceState({}, '', url.toString());
    } catch {}
  };

  const toggleVinylAudio = () => {
    if (isVinylAudioOn) {
      stopVinylCrackle();
      setIsVinylAudioOn(false);
    } else {
      setSoundEnabled(true);
      startVinylCrackle();
      setIsVinylAudioOn(true);
    }
  };

  const totalRevenue = dbState.orders.reduce((sum, ord) => sum + ord.totalAmount, 0);

  const refreshData = () => {
    setDbState(db.getState());
  };

  return (
    <StoreContext.Provider
      value={{
        viewMode,
        setViewMode,
        products: dbState.products,
        setProducts: (prods) => {
          if (typeof prods === 'function') {
            db.setProducts(prods(dbState.products));
          } else {
            db.setProducts(prods);
          }
        },
        orders: dbState.orders,
        totalRevenue,
        dropConfig: dbState.dropConfig,
        isVinylAudioOn,
        toggleVinylAudio,
        refreshData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};

