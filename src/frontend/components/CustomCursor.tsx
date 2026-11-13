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
          cursorState.isHovered
            ? 'w-16 h-16 bg-[#181513]/90 text-white border-[#E67E44] backdrop-blur-md shadow-[0_0_20px_rgba(230,126,68,0.4)] scale-110'
            : 'w-4 h-4 bg-[#E67E44]/70 border-white/60 shadow-[0_0_10px_rgba(230,126,68,0.6)]'
        }`}
      >
        {cursorState.label && (
          <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-[#E67E44] animate-fadeIn text-center px-1">
            {cursorState.label}
          </span>
        )}
      </div>
    </div>
  );
};

