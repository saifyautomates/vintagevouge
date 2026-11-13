import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { CouponRecord } from '../../database/schema';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  appliedCoupon: CouponRecord | null;
  setAppliedCoupon: (c: CouponRecord | null) => void;
  discountAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  currency: 'INR' | 'USD' | 'EUR';
  setCurrency: (c: 'INR' | 'USD' | 'EUR') => void;
  formatPrice: (amountInINR: number) => string;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  recentlyViewed: Product[];
  recordView: (product: Product) => void;
  isExitIntentOpen: boolean;
  setIsExitIntentOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  freeShippingThreshold: number;
  isDropModalOpen: boolean;
  setIsDropModalOpen: (open: boolean) => void;
  isFitAdvisorOpen: boolean;
  setIsFitAdvisorOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  checkoutProduct: Product | null;
  openCheckout: (singleProduct?: Product) => void;
  closeCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vintage_vogue_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vintage_vogue_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('vintage_vogue_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<CouponRecord | null>(() => {
    try {
      const saved = localStorage.getItem('vintage_vogue_applied_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const [isFitAdvisorOpen, setIsFitAdvisorOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isExitIntentOpen, setIsExitIntentOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const freeShippingThreshold = 2999; // ₹2,999 free express shipping across India

  useEffect(() => {
    try {
      localStorage.setItem('vintage_vogue_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('vintage_vogue_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('vintage_vogue_recently_viewed', JSON.stringify(recentlyViewed));
    } catch {}
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('vintage_vogue_applied_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('vintage_vogue_applied_coupon');
      }
    } catch {}
  }, [appliedCoupon]);

  const recordView = (product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  };

  const handleSelectProduct = (p: Product | null) => {
    setSelectedProduct(p);
    if (p) {
      recordView(p);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        showToast(`1-of-1 piece already in bag: [${product.referenceCode}]`);
        return prev;
      }
      showToast(`Claimed 1-of-1: ${product.title}`);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    // Strict 1-of-1 archival constraint: quantity cannot exceed 1
    if (quantity > 1) {
      showToast('Archival specimens are 1-of-1 strictly (max 1 per client)');
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: 1 } : item
      )
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed piece from your saved archive.');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added piece to your saved archive.');
        return [...prev, productId];
      }
    });
  };

  const openCheckout = (singleProduct?: Product) => {
    if (singleProduct) {
      setCheckoutProduct(singleProduct);
    } else {
      setCheckoutProduct(null);
    }
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutModalOpen(false);
    setCheckoutProduct(null);
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? Math.round(subtotal * (appliedCoupon.discountValue / 100))
      : Math.min(appliedCoupon.discountValue, subtotal)
    : 0;

  const formatPrice = (amountInINR: number): string => {
    // 100% Strictly Indian Rupee (₹ INR) with standard Indian numbering format
    return `₹${Math.round(amountInINR).toLocaleString('en-IN')}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        appliedCoupon,
        setAppliedCoupon,
        discountAmount,
        isCartOpen,
        setIsCartOpen,
        currency,
        setCurrency,
        formatPrice,
        selectedProduct,
        setSelectedProduct: handleSelectProduct,
        wishlist,
        toggleWishlist,
        recentlyViewed,
        recordView,
        isExitIntentOpen,
        setIsExitIntentOpen,
        toastMessage,
        showToast,
        freeShippingThreshold,
        isDropModalOpen,
        setIsDropModalOpen,
        isFitAdvisorOpen,
        setIsFitAdvisorOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        checkoutProduct,
        openCheckout,
        closeCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
