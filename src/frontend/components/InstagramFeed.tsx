import React, { useState } from 'react';
import {
  Instagram,
  ArrowUpRight,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  MessageSquare,
  X,
  Play,
  Film
} from 'lucide-react';
import { playClickSound, playSuccessChime } from '../utils/audio';

interface InstagramPost {
  id: string;
  img: string;
  tag: string;
  category: 'drops' | 'reels' | 'community' | 'sourcing';
  likes: string;
  comments: string;
  date: string;
  caption: string;
  specimenRef?: string;
  price?: string;
  location: string;
  isReel?: boolean;
}

export const InstagramFeed: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'drops' | 'reels' | 'community' | 'sourcing'>('all');
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const posts: InstagramPost[] = [
    {
      id: 'ig-1',
      img: '/assets/images/boxy-embroidered-shirt.jpg',
      tag: 'DROP #24 VAULT',
      category: 'drops',
      likes: '1,842',
      comments: '124',
      date: 'NOVEMBER 12, 2026',
      caption: 'The 1992 Japanese chain-stitched camp collar. Mother-of-pearl buttons intact. 140gsm breathable rayon-silk weave sourced from a private vintage dealer in Koenji, Tokyo. 1-of-1 globally.',
      specimenRef: 'VV-JP-9201',
      price: '₹4,850',
      location: 'Sogaria Atelier, Kota',
      isReel: false,
    },
    {
      id: 'ig-2',
      img: '/assets/images/vintage-denim-trucker.jpg',
      tag: '14.5 OZ OKAYAMA',
      category: 'drops',
      likes: '2,690',
      comments: '189',
      date: 'NOVEMBER 11, 2026',
      caption: '30-year naturally sun-faded indigo trucker jacket. Hand-loomed on vintage Toyoda shuttle looms in Kurashiki. Finished with authentic pink line selvedge ID and solid brass donut buttons.',
      specimenRef: 'VV-DN-8842',
      price: '₹6,400',
      location: 'Okayama Prefecture / Kota Studio',
      isReel: true,
    },
    {
      id: 'ig-3',
      img: '/assets/images/lookbook-editorial-1.jpg',
      tag: 'CLIENT ARCHIVE',
      category: 'community',
      likes: '4,120',
      comments: '280',
      date: 'NOVEMBER 10, 2026',
      caption: 'Spotted in Bandra, Mumbai: styled by @kabir.mehta wearing our 1989 Heavy Selvedge Work Jacket paired with raw trousers. "The drape on this 30-year Japanese piece is unmatched."',
      specimenRef: 'VV-JK-8911',
      price: '₹5,800',
      location: 'Bandra West, Mumbai',
      isReel: false,
    },
    {
      id: 'ig-4',
      img: '/assets/images/retro-floral-dress.jpg',
      tag: '70S PRAIRIE CALICO',
      category: 'drops',
      likes: '2,340',
      comments: '112',
      date: 'NOVEMBER 09, 2026',
      caption: 'Antique Austrian woodblock calico dress with corset-lacing back and scalloped hemline. Completely hand-sewn, preserved in pristine museum grade condition.',
      specimenRef: 'VV-DR-7023',
      price: '₹5,200',
      location: 'Sogaria Atelier, Kota',
      isReel: false,
    },
    {
      id: 'ig-5',
      img: '/assets/images/vintage-leather-bomber.jpg',
      tag: 'VAULT LEATHER',
      category: 'drops',
      likes: '5,410',
      comments: '412',
      date: 'NOVEMBER 08, 2026',
      caption: '1976 American Ranch Suede Fringe Jacket. Wax-conditioned with organic cedar balm in our Workshop Road studio. Deep caramel patina that cannot be replicated by modern machines.',
      specimenRef: 'VV-LT-7612',
      price: '₹7,900',
      location: 'Sogaria Atelier, Kota',
      isReel: true,
    },
    {
      id: 'ig-6',
      img: '/assets/images/lookbook-editorial-2.jpg',
      tag: 'TOKYO DIARY',
      category: 'sourcing',
      likes: '3,290',
      comments: '198',
      date: 'NOVEMBER 06, 2026',
      caption: 'Curator dispatch from Shibuya backstreets: inspecting rare Heisei-era souvenir shirts and raw selvedge workwear. Every garment in our Sunday 8 PM drops is hand-selected in person.',
      location: 'Shibuya, Tokyo, Japan',
      isReel: true,
    },
  ];

  const filteredPosts = activeFilter === 'all'
    ? posts
    : posts.filter((p) => p.category === activeFilter);

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSuccessChime();
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenModal = (post: InstagramPost) => {
    playClickSound();
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    playClickSound();
    setSelectedPost(null);
  };

  return (
    <section className="bg-[#FAF7F2] py-16 lg:py-24 border-t border-[#181513]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Instagram Profile Header Card */}
        <div className="bg-[#F4EFE6] border border-[#181513]/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5 sm:gap-6">
            {/* Profile Avatar with Story Ring */}
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#C4975A] via-[#A65B32] to-[#8B2635]">
              <div className="p-0.5 bg-[#FAF7F2] rounded-full">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-[#EAE4D9]">
                  <img
                    src="/assets/images/boxy-embroidered-shirt.jpg"
                    alt="Vintage Vogue Atelier"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="absolute bottom-0 right-0 p-1 bg-[#A65B32] text-white rounded-full border-2 border-white shadow">
                <Instagram className="w-3 h-3" />
              </span>
            </div>

            {/* Profile Stats & Bio */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#181513]">
                  @vintagevoguee_in
                </h3>
                <CheckCircle2 className="w-4 h-4 text-[#3897F0] fill-current" />
                <span className="px-2 py-0.5 rounded-full bg-[#A65B32]/10 text-[#A65B32] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#A65B32]/20">
                  Haute Archival Atelier
                </span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#5C564E] max-w-lg leading-relaxed">
                Curated 1-of-1 Japanese Archival & Heritage Western Wear. Hand-sourced from Tokyo collectors.
                Studio: Sogaria, Kota, Rajasthan. Private Drops Every Sunday at 8 PM IST.
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-[#181513] pt-1">
                <span><strong>1,482</strong> Posts</span>
                <span><strong>34.2K</strong> Collectors</span>
                <span><strong>124</strong> Curators</span>
              </div>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <a
              href="https://www.instagram.com/vintagevoguee_in/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none px-6 py-3 bg-[#A65B32] hover:bg-[#8B2635] text-white font-mono text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-md group rounded-lg"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow on Instagram</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a
              href="https://wa.me/919829012345?text=Hello%20Vintage%20Vogue!%20I%20follow%20you%20on%20Instagram%20and%20would%20like%20VIP%20early%20access%20to%20Sunday%20vault%20drops."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none px-5 py-3 bg-white hover:bg-[#FAF7F2] text-[#181513] border border-[#181513]/15 font-mono text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all rounded-lg"
            >
              <MessageSquare className="w-4 h-4 text-[#A65B32]" />
              <span>Join VIP DM List</span>
            </a>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#181513]/10 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Feeds' },
              { id: 'drops', label: 'Vault Drops' },
              { id: 'reels', label: 'Reels & Fit Checks' },
              { id: 'community', label: 'Community Worn' },
              { id: 'sourcing', label: 'Tokyo Diaries' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setActiveFilter(tab.id as any);
                }}
                className={`px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#181513] text-white shadow-sm'
                    : 'bg-[#FAF7F2] text-[#5C564E] hover:text-[#181513] hover:bg-black/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="font-mono text-xs text-[#8C827A]">
            Showing {filteredPosts.length} Archival Stories
          </span>
        </div>

        {/* 6-Grid Instagram Showcase */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredPosts.map((post) => {
            const liked = likedPosts[post.id];
            return (
              <div
                key={post.id}
                onClick={() => handleOpenModal(post)}
                className="group relative aspect-square bg-[#EFE7DB] overflow-hidden border border-[#181513]/10 block cursor-pointer rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={post.img}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Reel / Video Pill */}
                {post.isReel && (
                  <span className="absolute top-2.5 right-2.5 p-1 rounded-md bg-black/60 text-white backdrop-blur-sm z-10">
                    <Film className="w-3 h-3" />
                  </span>
                )}

                {/* Top Badge */}
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/75 text-white text-[9px] font-mono tracking-wider font-bold z-10">
                  {post.tag}
                </span>

                {/* Hover Overlay with Likes, Caption and Action */}
                <div className="absolute inset-0 bg-[#181513]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-between text-white text-[10px] font-mono z-20">
                  <div className="flex items-center justify-between text-white/70">
                    <span className="text-[9px] tracking-widest uppercase">{post.date}</span>
                    <button
                      onClick={(e) => handleToggleLike(post.id, e)}
                      className="p-1 hover:text-red-400 transition-colors"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          liked ? 'fill-red-500 text-red-500' : 'text-white'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="font-sans text-[11px] line-clamp-3 leading-snug text-white/90">
                    {post.caption}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-white/20">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1 text-[#C4975A]">
                        <Heart className="w-3 h-3 fill-current" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1 text-white/80">
                        <MessageCircle className="w-3 h-3" /> {post.comments}
                      </span>
                    </div>

                    {post.price && (
                      <div className="text-right font-serif text-xs font-bold text-[#C4975A]">
                        {post.price}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Post Detail Modal (Instagram Dossier) */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-3xl bg-[#FAF7F2] text-[#181513] rounded-2xl overflow-hidden shadow-2xl border border-[#181513]/20 flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Image Container */}
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-black flex items-center justify-center relative">
              <img
                src={selectedPost.img}
                alt={selectedPost.caption}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 px-2.5 py-1 bg-[#A65B32] text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded shadow">
                {selectedPost.tag}
              </span>
            </div>

            {/* Right: Instagram Dossier */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#181513]/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-[#A65B32] p-0.5">
                      <img
                        src="/assets/images/boxy-embroidered-shirt.jpg"
                        alt="Vintage Vogue"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#181513]">
                        <span>vintagevoguee_in</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3897F0] fill-current" />
                      </div>
                      <p className="text-[10px] font-mono text-[#5C564E]">
                        {selectedPost.location}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCloseModal}
                    className="p-1.5 text-[#5C564E] hover:text-[#181513] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Caption & Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#8C827A] uppercase tracking-wider">
                      {selectedPost.date}
                    </span>
                    {selectedPost.specimenRef && (
                      <span className="font-mono text-[10px] bg-[#181513] text-white px-2 py-0.5 rounded font-bold">
                        REF: {selectedPost.specimenRef}
                      </span>
                    )}
                  </div>

                  <p className="font-sans text-sm text-[#38332E] leading-relaxed">
                    {selectedPost.caption}
                  </p>

                  {selectedPost.price && (
                    <div className="p-3 bg-[#EFE7DB] rounded-xl flex items-center justify-between border border-[#181513]/10">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#8C827A] block">
                          Archival Acquisition Price
                        </span>
                        <span className="font-serif text-xl font-bold text-[#8B2635]">
                          {selectedPost.price}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#A65B32] font-bold">
                        1-OF-1 DISCOVERY
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs font-mono text-[#5C564E] pt-2">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                      <strong>{selectedPost.likes}</strong> likes
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" />
                      <strong>{selectedPost.comments}</strong> comments
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-[#181513]/10 space-y-2 mt-4">
                <a
                  href={`https://wa.me/919829012345?text=${encodeURIComponent(
                    `Hello Vintage Vogue Atelier! I saw your Instagram post for [${selectedPost.tag}] (Ref: ${selectedPost.specimenRef || 'Instagram Post'}). I want to claim this piece.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#A65B32] hover:bg-[#8B2635] text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#C4975A]" />
                  <span>Claim 1-of-1 Piece via WhatsApp</span>
                </a>

                <a
                  href="https://www.instagram.com/vintagevoguee_in/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-transparent hover:bg-black/5 text-[#181513] font-mono text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-[#181513]/15"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Open on Instagram App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
