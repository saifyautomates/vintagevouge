import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductRecord, OrderRecord, DropConfigRecord, CouponRecord } from '../../database/schema';
import { db } from '../../database/db';
import { api } from '../../backend/api/client';
import { startVinylCrackle, stopVinylCrackle, setSoundEnabled } from '../utils/audio';

export type ViewMode = 'storefront' | 'mobile-app' | 'admin' | 'pos';

export interface PaymentSettings {
  enableUpi: boolean;
  enableCod: boolean;
  enableRazorpay: boolean;
  enableCashfree: boolean;
  upiVpa: string;
  codMaxAmount: number;
  partialCodAdvance: number;
}

const defaultPaymentSettings: PaymentSettings = {
  enableUpi: true,
  enableCod: true,
  enableRazorpay: true,
  enableCashfree: true,
  upiVpa: 'vintagevogue@upi',
  codMaxAmount: 7000,
  partialCodAdvance: 0,
};

interface StoreContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  products: ProductRecord[];
  setProducts: React.Dispatch<React.SetStateAction<ProductRecord[]>>;
  orders: OrderRecord[];
  totalRevenue: number;
  dropConfig: DropConfigRecord;
  coupons: CouponRecord[];
  createCoupon: (coupon: Omit<CouponRecord, 'id' | 'createdAt'>) => void;
  toggleCoupon: (id: string) => void;
  deleteCoupon: (id: string) => void;
  paymentSettings: PaymentSettings;
  updatePaymentSettings: (updates: Partial<PaymentSettings>) => void;
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
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    try {
      const saved = localStorage.getItem('vintage_vogue_payment_config');
      return saved ? { ...defaultPaymentSettings, ...JSON.parse(saved) } : defaultPaymentSettings;
    } catch {
      return defaultPaymentSettings;
    }
  });

  const updatePaymentSettings = (updates: Partial<PaymentSettings>) => {
    setPaymentSettings(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('vintage_vogue_payment_config', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

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

  const createCoupon = (coupon: Omit<CouponRecord, 'id' | 'createdAt'>) => {
    const newCoupon: CouponRecord = {
      ...coupon,
      id: `coupon-${Date.now()}`,
      code: coupon.code.trim().toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    const currentCoupons = dbState.coupons || [];
    db.setCoupons([newCoupon, ...currentCoupons]);
  };

  const toggleCoupon = (id: string) => {
    const currentCoupons = dbState.coupons || [];
    const updated = currentCoupons.map(c => c.id === id ? { ...c, active: !c.active } : c);
    db.setCoupons(updated);
  };

  const deleteCoupon = (id: string) => {
    const currentCoupons = dbState.coupons || [];
    db.setCoupons(currentCoupons.filter(c => c.id !== id));
  };

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
        coupons: dbState.coupons || [],
        createCoupon,
        toggleCoupon,
        deleteCoupon,
        paymentSettings,
        updatePaymentSettings,
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

