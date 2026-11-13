import React, { useState } from 'react';
import { X, Bell, Check, Sparkles, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const DropAlertModal: React.FC = () => {
  const { isDropModalOpen, setIsDropModalOpen, showToast } = useCart();
  const [contact, setContact] = useState('');
  const [size, setSize] = useState('Boxy M');
  const [submitted, setSubmitted] = useState(false);

  if (!isDropModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contact.trim()) {
      setSubmitted(true);
      showToast('Enrolled in VIP WhatsApp Drop Alerts for Drop #24.');
      setTimeout(() => {
        setIsDropModalOpen(false);
        setSubmitted(false);
        setContact('');
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="relative bg-[#FAF7F2] border border-[#181513]/25 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsDropModalOpen(false)}
          className="absolute top-4 right-4 p-1 text-[#181513] hover:opacity-70 transition-opacity"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#2D5A3F]/10 text-[#2D5A3F] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#181513]">
              VIP Drop Alert Confirmed!
            </h3>
            <p className="font-sans text-xs text-[#5C564E]">
              You will receive an exclusive direct password link 15 minutes before Drop #24 goes live publicly.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFE7DB] text-[#E67E44] text-[10px] font-mono tracking-widest uppercase font-bold">
                <Bell className="w-3 h-3" />
                <span>DROP #24 EARLY ACCESS</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181513] leading-tight">
                Never Miss a 1-of-1 Piece.
              </h3>
              <p className="font-sans text-xs text-[#5C564E] leading-relaxed">
                Our archival drops are strictly 1-of-1 inventory and typically sell out within 15 minutes of release. Get direct WhatsApp & SMS alerts.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="block text-[11px] font-mono uppercase text-[#181513] font-bold">
                  WhatsApp Number or Email
                </label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C857B]" />
                  <input
                    type="text"
                    required
                    placeholder="+91 WhatsApp Number or Email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full bg-[#EFE7DB] border border-[#181513]/20 pl-9 pr-3 py-2.5 text-xs font-mono outline-none focus:border-[#E67E44] text-[#181513]"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="block text-[11px] font-mono uppercase text-[#181513] font-bold">
                  Preferred Sizing Priority
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full bg-[#EFE7DB] border border-[#181513]/20 px-3 py-2.5 text-xs font-mono outline-none focus:border-[#E67E44] text-[#181513] cursor-pointer"
                >
                  <option value="S">Size S (Vintage Slim)</option>
                  <option value="Boxy M">Boxy M (Oversized Chest 23 in)</option>
                  <option value="Oversized L">Oversized L (Chest 25 in)</option>
                  <option value="Relaxed XL">Relaxed XL (Chest 26 in+)</option>
                  <option value="Free Size">Free Size (Dresses & Corsets)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#181513] hover:bg-[#E67E44] text-white text-xs font-mono tracking-widest-plus uppercase transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join VIP Drop Roster</span>
              </button>

              <p className="text-[10px] font-mono text-[#8C857B] text-center">
                Strict privacy. Zero spam. Drop alerts only.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

