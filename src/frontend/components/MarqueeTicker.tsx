import React from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const MarqueeTicker: React.FC = () => {
  const items = [
    { text: '1-OF-1 HAUTE ARCHIVAL & HERITAGE WESTERN WEAR', icon: Sparkles },
    { text: 'EUCALYPTUS STEAM SANITIZED & ARCHIVE CERTIFIED', icon: ShieldCheck },
    { text: 'FREE BLUE DART AIR EXPRESS PAN-INDIA OVER ₹2,999', icon: Truck },
    { text: 'STRICT SINGLE SPECIMEN • ONCE CLAIMED, FOREVER ARCHIVED', icon: RefreshCw },
    { text: 'FOLLOW @VINTAGEVOGUEE_IN FOR SUNDAY 8 PM VAULT DROPS', icon: Sparkles },
  ];

  return (
    <div className="w-full bg-[#EBE4D8] border-y border-[#181513]/10 py-2.5 overflow-hidden whitespace-nowrap select-none">
      <div className="inline-flex items-center gap-10 animate-marquee text-[#181513] text-[11px] font-mono tracking-widest-plus uppercase">
        {[...items, ...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3">
              <Icon className="w-3.5 h-3.5 text-[#A65B32] flex-shrink-0" />
              <span>{item.text}</span>
              <span className="text-[#181513]/30">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

