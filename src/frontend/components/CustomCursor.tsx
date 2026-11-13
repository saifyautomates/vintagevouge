import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState<{ isHovered: boolean; label?: string }>({
    isHovered: false,
    label: undefined,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop with fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        setCursorState({
          isHovered: true,
          label: cursorTarget.getAttribute('data-cursor') || undefined,
        });
      } else if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setCursorState({ isHovered: true, label: undefined });
      } else {
        setCursorState({ isHovered: false, label: undefined });
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out hidden md:block"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
      }}
    >
      {/* Outer Glow Halo */}
      <div
        className={`rounded-full flex items-center justify-center transition-all duration-200 border ${
          cursorState.label
            ? 'w-20 h-20 bg-[#181513]/92 text-white border-[#C4975A] backdrop-blur-md shadow-[0_0_24px_rgba(196,151,90,0.35)] scale-105'
            : cursorState.isHovered
            ? 'w-10 h-10 bg-[#181513]/80 text-white border-[#C4975A]/80 backdrop-blur-sm shadow-[0_0_15px_rgba(196,151,90,0.3)] scale-100'
            : 'w-3.5 h-3.5 bg-[#A65B32]/85 border-white/80 shadow-[0_0_8px_rgba(166,91,50,0.4)]'
        }`}
      >
        {cursorState.label && (
          <span className="text-[8px] font-mono tracking-[0.25em] uppercase font-bold text-[#C4975A] animate-fadeIn text-center px-1">
            {cursorState.label}
          </span>
        )}
      </div>
    </div>
  );
};

