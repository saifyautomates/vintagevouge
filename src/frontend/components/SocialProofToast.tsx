import React, { useState, useEffect } from 'react';
import { Sparkles, X, ShieldCheck, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';

interface ActivityItem {
  id: string;
  customerName: string;
  city: string;
  action: 'claimed' | 'reserved' | 'measuring';
  referenceCode: string;
  productTitle: string;
  image: string;
  timeAgo: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    customerName: 'Aniket M.',
    city: 'Jaipur, Rajasthan',
    action: 'claimed',
    referenceCode: 'VV-D24-02',
    productTitle: '14oz Denim Trucker Overshirt',
    image: '/assets/images/vintage-denim-trucker.jpg',
    timeAgo: '3m ago',
  },
  {
    id: 'act-2',
    customerName: 'Rhea S.',
    city: 'Bandra West, Mumbai',
    action: 'reserved',
    referenceCode: 'VV-D24-05',
    productTitle: '70s Prairie Floral Midi Dress',
    image: '/assets/images/retro-floral-dress.jpg',
    timeAgo: '7m ago',
  },
  {
    id: 'act-3',
    customerName: 'Kabir V.',
    city: 'Hauz Khas, New Delhi',
    action: 'claimed',
    referenceCode: 'VV-D24-01',
    productTitle: 'Boxy Chain-Stitched Camp Shirt',
    image: '/assets/images/boxy-embroidered-shirt.jpg',
    timeAgo: '12m ago',
  },
  {
    id: 'act-4',
    customerName: 'Arjun K.',
    city: 'Indiranagar, Bengaluru',
    action: 'measuring',
    referenceCode: 'VV-D24-08',
    productTitle: 'Blanket-Lined Detroit Canvas Jacket',
    image: '/assets/images/vintage-workwear-jacket.jpg',
    timeAgo: 'Just now',
  },
  {
    id: 'act-5',
    customerName: 'Devika P.',
    city: 'Koregaon Park, Pune',
    action: 'claimed',
    referenceCode: 'VV-D24-03',
    productTitle: '1988 Lambskin Aviator Bomber',
    image: '/assets/images/vintage-leather-bomber.jpg',
    timeAgo: '18m ago',
  },
];

export const SocialProofToast: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { setSelectedProduct } = useCart();
  const { products } = useStore();

  useEffect(() => {
    if (isDismissed) return;

    // Show initial notification after 6 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 6000);

    // Cycle every 16 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ACTIVITIES.length);
        setIsVisible(true);
      }, 800);
    }, 16000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (isDismissed || !isVisible) return null;

  const current = ACTIVITIES[currentIndex];

  const handleClick = () => {
    const prod = products.find((p) => p.referenceCode === current.referenceCode);
    if (prod) {
      setSelectedProduct(prod);
    }
  };

  return (
    <div className="fixed bottom-24 sm:bottom-6 left-3 sm:left-6 z-40 max-w-[calc(100vw-24px)] sm:max-w-sm w-full sm:w-auto animate-slideUp">
      <div 
        onClick={handleClick}
        className="bg-[#FAF7F2]/95 backdrop-blur-md border border-[#181513]/20 shadow-2xl p-3 sm:p-3.5 rounded-xl flex items-center gap-3.5 text-[#181513] cursor-pointer hover:border-[#E67E44] transition-all group relative pr-8"
      >
        {/* Specimen Thumbnail */}
        <div className="relative w-12 h-14 bg-[#EAE3D4] rounded overflow-hidden flex-shrink-0 border border-[#181513]/10">
          <img
            src={current.image}
            alt={current.productTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <span className="absolute bottom-0 right-0 bg-[#181513] text-white text-[7px] font-mono px-1 font-bold">
            1-OF-1
          </span>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#5C564E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E67E44] animate-ping" />
            <span className="font-bold text-[#181513]">{current.customerName}</span>
            <span>in</span>
            <span className="text-[#E67E44] font-medium flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5 inline" /> {current.city}
            </span>
          </div>

          <p className="font-serif font-bold text-xs text-[#181513] truncate mt-0.5">
            {current.action === 'claimed' ? 'Acquired' : current.action === 'reserved' ? 'Wax-Sealed' : 'Measuring'}{' '}
            [{current.referenceCode}] {current.productTitle}
          </p>

          <div className="flex items-center gap-2 text-[9px] font-mono text-[#8C857B] mt-0.5">
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" /> Verified Dispatch
            </span>
            <span>•</span>
            <span>{current.timeAgo}</span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          className="absolute top-2 right-2 p-1 text-[#8C857B] hover:text-[#181513] transition-colors"
          title="Dismiss alerts"
          aria-label="Dismiss alerts"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

