import React, { useState } from 'react';
import { Ruler, Sparkles, CheckCircle2, Info } from 'lucide-react';
import { Product } from '../types';
import { playClickSound, playHoverSound, playTapeMeasureSound } from '../utils/audio';

interface MeasurementBlueprintProps {
  product: Product;
}

export const MeasurementBlueprint: React.FC<MeasurementBlueprintProps> = ({ product }) => {
  const [activeMetric, setActiveMetric] = useState<'p2p' | 'length' | 'shoulders' | 'sleeve'>('p2p');

  const metrics: {
    id: 'p2p' | 'length' | 'shoulders' | 'sleeve';
    label: string;
    value: string;
    guide: string;
    fitNote: string;
  }[] = [
    {
      id: 'p2p',
      label: 'Pit-to-Pit (Chest)',
      value: product.measurements.pitToPit,
      guide: 'Measured flat from armpit seam to armpit seam without stretching.',
      fitNote: 'Gives that relaxed vintage boxy chest drape without clinging.',
    },
    {
      id: 'length',
      label: 'Center Back Length',
      value: product.measurements.length,
      guide: 'Measured from center back collar seam straight down to bottom hem.',
      fitNote: 'Cropped or classic vintage hem sitting cleanly at belt line.',
    },
    {
      id: 'shoulders',
      label: 'Shoulder Width',
      value: product.measurements.shoulders,
      guide: 'Straight across the back from shoulder seam to shoulder seam.',
      fitNote: 'Intended drop-shoulder silhouette characteristic of 90s archives.',
    },
    {
      id: 'sleeve',
      label: 'Sleeve Length',
      value: product.measurements.sleeve,
      guide: 'Measured from top shoulder seam down to cuff edge.',
      fitNote: 'Wide-arm cut allowing easy layering over tees or thermals.',
    },
  ];

  const current = metrics.find((m) => m.id === activeMetric) || metrics[0];

  return (
    <div className="bg-[#FAF7F2] border border-[#181513]/15 rounded-xl p-4 sm:p-5 space-y-4 text-[#181513]">
      <div className="flex items-center justify-between border-b border-[#181513]/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-[#E67E44]/15 rounded text-[#E67E44]">
            <Ruler className="w-4 h-4" />
          </span>
          <div>
            <h4 className="font-mono text-xs uppercase font-bold tracking-wider">
              Interactive Fit Blueprint
            </h4>
            <span className="text-[10px] font-mono text-[#5C564E]">
              1-of-1 Specimen Flat Tape Protocol
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181513] text-[#FAF7F2] font-bold">
          {product.size}
        </span>
      </div>

      {/* Metric Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
        {metrics.map((m) => {
          const isSelected = activeMetric === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                playTapeMeasureSound();
                setActiveMetric(m.id);
              }}
              onMouseEnter={() => playHoverSound()}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-[#181513] text-white border-[#181513] shadow-md scale-[1.02]'
                  : 'bg-white/80 hover:bg-white text-[#181513] border-[#181513]/15'
              }`}
            >
              <span className="block text-[9px] uppercase tracking-wider text-white/60 mb-0.5">
                {m.label.split(' ')[0]}
              </span>
              <span className="block font-bold text-xs sm:text-sm text-[#E67E44]">{m.value}</span>
            </button>
          );
        })}
      </div>

      {/* SVG Technical Garment Blueprint Diagram */}
      <div className="relative bg-[#F4EFE6] rounded-xl border border-[#181513]/10 p-4 flex items-center justify-center overflow-hidden">
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #181513 1px, transparent 1px), linear-gradient(to bottom, #181513 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        <svg viewBox="0 0 320 280" className="w-full max-w-[280px] h-auto relative z-10">
          {/* Garment Silhouette Wireframe */}
          <path
            d="M100 45 L130 55 L160 65 L190 55 L220 45 L275 95 L250 130 L220 110 L220 250 L100 250 L100 110 L70 130 L45 95 Z"
            fill="#FAF7F2"
            stroke="#181513"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Collar Details */}
          <path
            d="M130 55 Q160 85 190 55"
            fill="none"
            stroke="#181513"
            strokeWidth="1.8"
          />
          <path d="M160 65 L160 250" fill="none" stroke="#181513" strokeWidth="1" strokeDasharray="3 3" />

          {/* Active Measurement Highlight Lines */}

          {/* 1. Shoulder to Shoulder line */}
          <g className={`transition-opacity duration-300 ${activeMetric === 'shoulders' ? 'opacity-100' : 'opacity-25'}`}>
            <line x1="100" y1="45" x2="220" y2="45" stroke="#E67E44" strokeWidth="3" strokeDasharray="4 2" />
            <circle cx="100" cy="45" r="4" fill="#E67E44" />
            <circle cx="220" cy="45" r="4" fill="#E67E44" />
            <text x="160" y="38" textAnchor="middle" fill="#E67E44" fontSize="10" fontFamily="monospace" fontWeight="bold">
              {product.measurements.shoulders}
            </text>
          </g>

          {/* 2. Pit-to-Pit Chest line */}
          <g className={`transition-opacity duration-300 ${activeMetric === 'p2p' ? 'opacity-100' : 'opacity-25'}`}>
            <line x1="100" y1="110" x2="220" y2="110" stroke="#E67E44" strokeWidth="3.5" />
            <circle cx="100" cy="110" r="4.5" fill="#E67E44" />
            <circle cx="220" cy="110" r="4.5" fill="#E67E44" />
            <rect x="130" y="98" width="60" height="18" rx="3" fill="#181513" />
            <text x="160" y="111" textAnchor="middle" fill="#FAF7F2" fontSize="10" fontFamily="monospace" fontWeight="bold">
              {product.measurements.pitToPit}
            </text>
          </g>

          {/* 3. Center Back Length line */}
          <g className={`transition-opacity duration-300 ${activeMetric === 'length' ? 'opacity-100' : 'opacity-25'}`}>
            <line x1="230" y1="55" x2="230" y2="250" stroke="#E67E44" strokeWidth="3" strokeDasharray="4 2" />
            <circle cx="230" cy="55" r="4" fill="#E67E44" />
            <circle cx="230" cy="250" r="4" fill="#E67E44" />
            <rect x="235" y="145" width="65" height="18" rx="3" fill="#181513" />
            <text x="267" y="158" textAnchor="middle" fill="#FAF7F2" fontSize="9" fontFamily="monospace" fontWeight="bold">
              {product.measurements.length}
            </text>
          </g>

          {/* 4. Sleeve line */}
          <g className={`transition-opacity duration-300 ${activeMetric === 'sleeve' ? 'opacity-100' : 'opacity-25'}`}>
            <line x1="220" y1="45" x2="275" y2="95" stroke="#E67E44" strokeWidth="3" />
            <circle cx="220" cy="45" r="4" fill="#E67E44" />
            <circle cx="275" cy="95" r="4" fill="#E67E44" />
            <text x="260" y="65" textAnchor="middle" fill="#E67E44" fontSize="10" fontFamily="monospace" fontWeight="bold">
              {product.measurements.sleeve}
            </text>
          </g>
        </svg>

        <span className="absolute bottom-2 right-2 text-[9px] font-mono text-[#8C857B]">
          * Measured flat in studio
        </span>
      </div>

      {/* Curatorial Fitting Note */}
      <div className="bg-white border border-[#181513]/10 p-3 rounded-lg text-xs font-mono space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-[#181513]">
          <Info className="w-3.5 h-3.5 text-[#E67E44]" />
          <span>{current.label}: {current.value}</span>
        </div>
        <p className="text-[11px] text-[#5C564E] leading-relaxed">
          {current.guide}
        </p>
        <p className="text-[10px] text-[#2D5A3F] font-semibold pt-1 border-t border-[#181513]/5">
          ✦ Fit Analysis: {current.fitNote}
        </p>
      </div>
    </div>
  );
};

