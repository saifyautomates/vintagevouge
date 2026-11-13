import React, { useState, useEffect } from 'react';
import { Instagram, CheckCircle2, X, ChevronLeft, ChevronRight, Heart, Send, Volume2, VolumeX, Sparkles, MessageSquare } from 'lucide-react';
import { playClickSound, playSuccessChime } from '../utils/audio';

interface StorySlide {
  id: string;
  image: string;
  title: string;
  tag: string;
  era: string;
  provenance: string;
  caption: string;
  timestamp: string;
  price?: string;
  referenceCode?: string;
}

interface StoryHighlight {
  id: string;
  label: string;
  coverImage: string;
  badge?: string;
  slides: StorySlide[];
}

export const InstagramStories: React.FC = () => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(342);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const highlights: StoryHighlight[] = [
    {
      id: 'drop24',
      label: 'Vault Drop #24',
      coverImage: '/assets/images/boxy-embroidered-shirt.jpg',
      badge: 'LIVE',
      slides: [
        {
          id: 'd24-1',
          image: '/assets/images/boxy-embroidered-shirt.jpg',
          title: '1992 Japanese Souvenir Boxy Shirt',
          tag: 'AUTHENTIC ARCHIVE',
          era: 'Heisei Era (1992)',
          provenance: 'Hand-sourced in Koenji, Tokyo',
          caption: 'Chain-stitched silk blend rayon with mother-of-pearl buttons. Unworn archival specimen found in Tokyo collector vault. 1-of-1 globally.',
          timestamp: '2h ago',
          price: '₹4,850',
          referenceCode: 'VV-JP-9201'
        },
        {
          id: 'd24-2',
          image: '/assets/images/vintage-denim-trucker.jpg',
          title: 'Type-II Selvedge Indigo Trucker',
          tag: '14.5 OZ OKAYAMA',
          era: 'Late 1980s Japan',
          provenance: 'Kansai Archive Collector Vault',
          caption: 'Raw rope-dyed indigo aged with authentic honeycomb creasing. Custom brass donut buttons and pink selvedge ID line.',
          timestamp: '3h ago',
          price: '₹6,400',
          referenceCode: 'VV-DN-8842'
        }
      ]
    },
    {
      id: 'tokyo',
      label: 'Tokyo Sourcing',
      coverImage: '/assets/images/lookbook-editorial-1.jpg',
      badge: 'VAULT',
      slides: [
        {
          id: 'tk-1',
          image: '/assets/images/lookbook-editorial-1.jpg',
          title: 'Harajuku & Shibuya Private Archives',
          tag: 'CURATOR DIARY',
          era: 'Autumn 2026 Trip',
          provenance: 'Shibuya Backstreets, Tokyo',
          caption: 'Meeting with third-generation vintage textile archivists in Tokyo. Inspecting 1970s western shirts and 90s Japanese workwear for our Kota studio drops.',
          timestamp: '1d ago'
        },
        {
          id: 'tk-2',
          image: '/assets/images/vintage-workwear-jacket.jpg',
          title: 'Kurashiki Indigo Dye Testing',
          tag: 'TEXTILE VERIFICATION',
          era: 'Showa/Heisei Transition',
          provenance: 'Okayama Prefecture, Japan',
          caption: 'Every denim piece is tested under natural light for authentic shuttle-loom grain and sulfur indigo dip integrity before shipment to India.',
          timestamp: '1d ago'
        }
      ]
    },
    {
      id: 'leather',
      label: 'Ranch Suede',
      coverImage: '/assets/images/vintage-leather-bomber.jpg',
      badge: 'RARE',
      slides: [
        {
          id: 'lt-1',
          image: '/assets/images/vintage-leather-bomber.jpg',
          title: '1976 Western Fringe Suede Jacket',
          tag: 'MUSEUM SPECIMEN',
          era: '1976 American Heritage',
          provenance: 'Wyoming Ranch Estate Sale',
          caption: 'Heavyweight split cowhide suede with hand-cut fringe and antiqued bone bead toggles. Scent-treated with native cedar oil in Kota.',
          timestamp: '2d ago',
          price: '₹7,900',
          referenceCode: 'VV-LT-7612'
        }
      ]
    },
    {
      id: 'atelier',
      label: 'Studio Kota',
      coverImage: '/assets/images/lookbook-editorial-2.jpg',
      badge: 'ATELIER',
      slides: [
        {
          id: 'at-1',
          image: '/assets/images/lookbook-editorial-2.jpg',
          title: 'Eucalyptus Steam & Sanitization Hub',
          tag: 'STUDIO PROTOCOL',
          era: 'Workshop Road, Kota',
          provenance: 'Vintage Vogue India Flagship Studio',
          caption: 'Inside our Kota studio: every archival specimen undergoes a 4-step medical-grade steam wash, cedar pressing, and 0.25-inch flat-laid precision tape measurement.',
          timestamp: '3d ago'
        }
      ]
    },
    {
      id: 'community',
      label: 'Collector Fits',
      coverImage: '/assets/images/retro-floral-dress.jpg',
      slides: [
        {
          id: 'cf-1',
          image: '/assets/images/retro-floral-dress.jpg',
          title: 'Vintage Prairie Calico in South Delhi',
          tag: 'COMMUNITY ARCHIVE',
          era: '1970s Calico Cotton',
          provenance: 'Styled by @tarini_vogue',
          caption: 'Spotted in Hauz Khas: 70s Austrian corset-tie prairie dress with handcrafted horn buttons. Hand-picked from Drop #21.',
          timestamp: '4d ago',
          price: '₹5,200',
          referenceCode: 'VV-DR-7023'
        }
      ]
    },
    {
      id: 'vip',
      label: 'VIP DM Access',
      coverImage: '/assets/images/split-nature-right.jpg',
      slides: [
        {
          id: 'vip-1',
          image: '/assets/images/split-nature-right.jpg',
          title: 'Early Sunday 8 PM Vault Claiming',
          tag: 'INSTAGRAM VIP SALON',
          era: 'Member Privilege',
          provenance: '@vintagevoguee_in Direct Access',
          caption: 'VIP members receive first look at high-demand Japanese denim and western fringe pieces 30 minutes before public site drop.',
          timestamp: '5d ago'
        }
      ]
    }
  ];

  // Auto-progress stories
  useEffect(() => {
    if (activeStoryIndex === null || isPaused) return;

    const currentHighlight = highlights[activeStoryIndex];
    const timer = setTimeout(() => {
      if (currentSlideIndex < currentHighlight.slides.length - 1) {
        setCurrentSlideIndex((prev) => prev + 1);
      } else if (activeStoryIndex < highlights.length - 1) {
        setActiveStoryIndex(activeStoryIndex + 1);
        setCurrentSlideIndex(0);
      } else {
        setActiveStoryIndex(null);
        setCurrentSlideIndex(0);
      }
    }, 5500);

    return () => clearTimeout(timer);
  }, [activeStoryIndex, currentSlideIndex, isPaused, highlights]);

  const handleOpenStory = (index: number) => {
    playClickSound();
    setActiveStoryIndex(index);
    setCurrentSlideIndex(0);
    setIsLiked(false);
  };

  const handleClose = () => {
    playClickSound();
    setActiveStoryIndex(null);
    setCurrentSlideIndex(0);
  };

  const handlePrevSlide = () => {
    playClickSound();
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    } else if (activeStoryIndex !== null && activeStoryIndex > 0) {
      const prevStory = activeStoryIndex - 1;
      setActiveStoryIndex(prevStory);
      setCurrentSlideIndex(highlights[prevStory].slides.length - 1);
    }
  };

  const handleNextSlide = () => {
    playClickSound();
    if (activeStoryIndex === null) return;
    const currentHighlight = highlights[activeStoryIndex];
    if (currentSlideIndex < currentHighlight.slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else if (activeStoryIndex < highlights.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setCurrentSlideIndex(0);
    } else {
      handleClose();
    }
  };

  const handleLike = () => {
    playSuccessChime();
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const activeStory = activeStoryIndex !== null ? highlights[activeStoryIndex] : null;
  const activeSlide = activeStory ? activeStory.slides[currentSlideIndex] : null;

  return (
    <section className="bg-[#FAF7F2] border-b border-[#181513]/10 py-4 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#A65B32] animate-pulse" />
            <span className="font-mono text-[11px] tracking-widest uppercase text-[#5C564E] font-bold">
              LIVE INSTAGRAM VAULT STORIES
            </span>
            <span className="text-[10px] font-mono text-[#A65B32] bg-[#A65B32]/10 px-2 py-0.5 rounded-full border border-[#A65B32]/20 font-semibold">
              @vintagevoguee_in
            </span>
          </div>
          <a
            href="https://www.instagram.com/vintagevoguee_in/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-[#A65B32] hover:text-[#8B2635] flex items-center gap-1 font-bold group"
          >
            <span>Follow Atelier</span>
            <Instagram className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          </a>
        </div>

        {/* Stories Horizontal Tray */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
          {highlights.map((highlight, idx) => (
            <button
              key={highlight.id}
              onClick={() => handleOpenStory(idx)}
              className="flex flex-col items-center gap-2 group flex-shrink-0 cursor-pointer focus:outline-none"
            >
              {/* Instagram Gradient Ring */}
              <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-[#C4975A] via-[#A65B32] to-[#8B2635] shadow-sm group-hover:scale-105 transition-all duration-300">
                <div className="p-0.5 bg-[#FAF7F2] rounded-full">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-[#EAE4D9]">
                    <img
                      src={highlight.coverImage}
                      alt={highlight.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Badge */}
                {highlight.badge && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#8B2635] text-white text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-full uppercase tracking-tighter border border-white shadow">
                    {highlight.badge}
                  </span>
                )}
              </div>

              <span className="font-mono text-[10px] sm:text-[11px] text-[#181513] font-medium tracking-tight group-hover:text-[#A65B32] transition-colors truncate max-w-[72px]">
                {highlight.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Instagram Story Fullscreen Modal */}
      {activeStory && activeSlide && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-fadeIn"
          onClick={handleClose}
        >
          <div
            className="relative w-full h-full sm:h-[88vh] sm:max-w-md bg-[#181513] text-white sm:rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Top Progress Bars */}
            <div className="absolute top-0 left-0 right-0 z-20 p-3 pt-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              <div className="flex gap-1.5 mb-3">
                {activeStory.slides.map((_, sIdx) => (
                  <div
                    key={sIdx}
                    className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
                  >
                    <div
                      className={`h-full bg-white transition-all duration-300 ${
                        sIdx < currentSlideIndex
                          ? 'w-full'
                          : sIdx === currentSlideIndex
                          ? 'w-full animate-storyProgress'
                          : 'w-0'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Story Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border border-[#C4975A] p-0.5 overflow-hidden">
                    <img
                      src={activeStory.coverImage}
                      alt={activeStory.label}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-white tracking-wider">
                        vintagevoguee_in
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3897F0] fill-current" />
                      <span className="text-[10px] text-white/60 font-mono">
                        • {activeSlide.timestamp}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-[#C4975A]">
                      Sogaria Atelier, Kota
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 text-white/70 hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleClose}
                    className="p-1.5 text-white/70 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Click Navigation Zones (Left & Right) */}
            <button
              onClick={handlePrevSlide}
              className="absolute left-0 top-16 bottom-28 w-1/3 z-10 opacity-0 hover:opacity-10 transition-opacity flex items-center justify-start pl-3 text-white cursor-pointer"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-0 top-16 bottom-28 w-1/3 z-10 opacity-0 hover:opacity-10 transition-opacity flex items-center justify-end pr-3 text-white cursor-pointer"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Main Specimen Image */}
            <div className="relative flex-1 w-full h-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeSlide.image}
                alt={activeSlide.title}
                className="w-full h-full object-cover"
              />

              {/* Specimen Tag Overlay */}
              <div className="absolute bottom-28 left-4 right-4 z-10 pointer-events-none">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#A65B32] text-white text-[9px] font-mono font-bold tracking-widest uppercase mb-1.5 shadow-lg">
                  <Sparkles className="w-3 h-3 text-[#C4975A]" />
                  <span>{activeSlide.tag}</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white drop-shadow-md">
                  {activeSlide.title}
                </h3>
                <p className="font-mono text-[11px] text-[#EAE4D9]/90 mt-1 line-clamp-2 drop-shadow">
                  {activeSlide.caption}
                </p>

                {activeSlide.price && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-serif text-lg font-bold text-[#C4975A] bg-black/60 px-2 py-0.5 rounded border border-[#C4975A]/40">
                      {activeSlide.price}
                    </span>
                    {activeSlide.referenceCode && (
                      <span className="font-mono text-[10px] text-white/80 bg-white/10 px-2 py-0.5 rounded">
                        REF: {activeSlide.referenceCode}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Interactive Engagement Bar */}
            <div className="relative z-20 p-3 sm:p-4 bg-gradient-to-t from-black via-black/95 to-transparent border-t border-white/10 flex items-center gap-3">
              <a
                href={`https://wa.me/919829012345?text=${encodeURIComponent(
                  `Hello Vintage Vogue Atelier! I am viewing your Instagram story for [${activeSlide.title}] (${activeSlide.referenceCode || 'Archive'}). Is this 1-of-1 specimen available to claim?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-[#A65B32] hover:bg-[#8B2635] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-center"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#C4975A]" />
                <span>Claim Specimen via WhatsApp</span>
              </a>

              <button
                onClick={handleLike}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-transform active:scale-90 flex items-center gap-1.5"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-white'
                  }`}
                />
                <span className="text-[11px] font-mono">{likeCount}</span>
              </button>

              <a
                href="https://www.instagram.com/vintagevoguee_in/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="View on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
