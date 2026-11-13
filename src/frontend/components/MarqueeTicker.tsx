import React from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const MarqueeTicker: React.FC = () => {
  const items = [
    { text: '1-OF-1 CURATED THRIFT & ARCHIVAL WESTERN WEAR', icon: Sparkles },
    { text: 'STEAM SANITIZED & CERTIFIED AUTHENTIC', icon: ShieldCheck },
    { text: 'FREE EXPRESS SHIPPING PAN-INDIA OVER ₹2,999', icon: Truck },
    { text: 'NO RESTOCKS • ONCE CLAIMED, GONE TO THE VAULT', icon: RefreshCw },
    { text: 'FOLLOW @VINTAGEVOGUEE_IN FOR WEEKLY DROP PREVIEWS', icon: Sparkles },
  ];

  return (
    <div className="w-full bg-[#EBE4D8] border-y border-[#181513]/10 py-2.5 overflow-hidden whitespace-nowrap select-none">
      <div className="inline-flex items-center gap-10 animate-marquee text-[#181513] text-[11px] font-mono tracking-widest-plus uppercase">
        {[...items, ...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3">
              <Icon className="w-3.5 h-3.5 text-[#E67E44] flex-shrink-0" />
              <span>{item.text}</span>
              <span className="text-[#181513]/30">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

