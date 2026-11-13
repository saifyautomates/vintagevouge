import React from 'react';
import { Instagram, ArrowUpRight, Heart, MessageCircle } from 'lucide-react';

export const InstagramFeed: React.FC = () => {
  const posts = [
    {
      img: '/assets/images/boxy-embroidered-shirt.jpg',
      tag: 'DROP #24 PREVIEW',
      likes: '1,420',
      comments: '84',
      caption: 'The 1992 Japanese chain-stitched camp collar. Mother of pearl buttons intact. 1-of-1.'
    },
    {
      img: '/assets/images/vintage-denim-trucker.jpg',
      tag: 'STREETWEAR ARCHIVE',
      likes: '2,190',
      comments: '142',
      caption: '30-year naturally sun-faded indigo trucker. Styled over vintage white tee.'
    },
    {
      img: '/assets/images/lookbook-editorial-1.jpg',
      tag: 'COMMUNITY FIT',
      likes: '3,840',
      comments: '210',
      caption: 'Tagged by @arjun.sharma in Delhi wearing our Drop #22 Carhartt work jacket.'
    },
    {
      img: '/assets/images/retro-floral-dress.jpg',
      tag: '70S PRAIRIE',
      likes: '1,890',
      comments: '95',
      caption: 'Antique calico woodblock dress with corset tie back. Pure French vintage.'
    },
    {
      img: '/assets/images/vintage-leather-bomber.jpg',
      tag: 'VAULT LEATHER',
      likes: '4,120',
      comments: '318',
      caption: '1988 Lambskin aviator. Oil-waxed deep patina that cannot be replicated.'
    },
    {
      img: '/assets/images/lookbook-editorial-2.jpg',
      tag: 'WESTERN NOMAD',
      likes: '2,650',
      comments: '164',
      caption: 'Behind the scenes at our Rajasthan desert lookbook shoot for Drop #24.'
    }
  ];

  return (
    <section className="bg-[#FAF7F2] py-16 lg:py-24 border-t border-[#181513]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#181513]/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#E67E44] font-bold">
              <Instagram className="w-4 h-4" />
              <span>COMMUNITY & STYLING ARCHIVE</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#181513]">
              Follow @vintagevoguee_in
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#5C564E] max-w-xl">
              Real customers styling our 1-of-1 archival drops across Mumbai, Delhi, Bangalore, and Jaipur.
            </p>
          </div>

          <a
            href="https://www.instagram.com/vintagevoguee_in/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#181513] hover:bg-[#E67E44] text-white font-mono text-xs tracking-widest uppercase flex items-center gap-2 self-start md:self-auto transition-colors group shadow-sm"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow on Instagram</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* 6-Grid Instagram Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {posts.map((post, idx) => (
            <a
              key={idx}
              href="https://www.instagram.com/vintagevoguee_in/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square bg-[#EFE7DB] overflow-hidden border border-[#181513]/10 block"
            >
              <img
                src={post.img}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Hover Overlay with Likes & Caption */}
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-between text-white text-[10px] font-mono">
                <span className="text-[#E67E44] font-bold">{post.tag}</span>
                <p className="font-sans text-[11px] line-clamp-3 leading-snug">
                  {post.caption}
                </p>
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/20">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-current text-[#E67E44]" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" /> {post.comments}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

