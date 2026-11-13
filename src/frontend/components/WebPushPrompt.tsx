import React, { useState, useEffect } from 'react';
import { Bell, X, Sparkles, Check } from 'lucide-react';
import { playClickSound, playSuccessChime } from '../utils/audio';
import { useCart } from '../context/CartContext';

export const WebPushPrompt: React.FC = () => {
  const { showToast } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (!('Notification' in window)) return;

    setPermissionStatus(Notification.permission);

    // If already decided (granted or denied), or dismissed in this session, don't show
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
      return;
    }

    const dismissed = sessionStorage.getItem('vv_web_push_dismissed');
    if (dismissed) return;

    // Show after 3 seconds of browsing for a smooth non-intrusive arrival
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleRequestPermission = async () => {
    playClickSound();
    if (!('Notification' in window)) {
      showToast('Push notifications not supported on this browser.');
      setIsVisible(false);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      setIsVisible(false);

      if (permission === 'granted') {
        playSuccessChime();
        showToast('⚡ Drop Alerts Enabled! You will be alerted for Drop #25.');

        // Trigger welcome sample notification
        try {
          new Notification('Vintage Vogue India • Drop Alerts Active ⚡', {
            body: 'You will receive immediate 1-tap alerts when new 1-of-1 archival specimens go live every Sunday 8 PM IST.',
            icon: '/assets/images/boxy-embroidered-shirt.jpg',
            badge: '/assets/images/boxy-embroidered-shirt.jpg',
          });
        } catch {}
      } else {
        showToast('Notification access skipped.');
      }
    } catch {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    playClickSound();
    setIsVisible(false);
    sessionStorage.setItem('vv_web_push_dismissed', 'true');
  };

  if (!isVisible || permissionStatus === 'granted') return null;

  return (
    <div className="fixed top-16 right-4 sm:right-6 z-40 max-w-sm w-full animate-slideDown">
      <div className="bg-[#181513] text-[#FAF7F2] border border-[#E67E44]/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#E67E44]/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E67E44]/20 text-[#E67E44] flex items-center justify-center flex-shrink-0 border border-[#E67E44]/30">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-[#E67E44] tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Live Drop Notifications
              </span>
              <button
                onClick={handleDismiss}
                className="text-white/40 hover:text-white transition-colors p-1"
                aria-label="Dismiss alert"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="font-serif text-sm font-bold text-white">
              Get 1-Tap Browser Alerts When Drop #25 Drops
            </h4>

            <p className="text-[11px] font-sans text-white/70 leading-relaxed font-light">
              Archival pieces sell out in minutes. Allow notifications on your device to secure 1-of-1 pieces before anyone else.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleRequestPermission}
                className="px-3.5 py-1.5 bg-[#E67E44] hover:bg-[#d57038] text-white text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Allow Drop Alerts</span>
              </button>

              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-white/60 hover:text-white text-[11px] font-mono transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

