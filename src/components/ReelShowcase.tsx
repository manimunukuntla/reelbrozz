import React, { useState } from 'react';
import { Play, Eye, Clock, Smartphone, Sparkles, X, Heart, Share2, Volume2, VolumeX } from 'lucide-react';
import { ReelItem } from '../utils/workStore';
import { TiltReelsCard } from './motion/TiltReelsCard';
import { parseVideoUrl } from '../utils/videoEmbed';
import { InfiniteSlider } from '@/components/core/infinite-slider';

export function InfiniteSliderHoverSpeed() {
  return (
    <InfiniteSlider speedOnHover={20} gap={24}>
      <img
        src='https://i.scdn.co/image/ab67616d00001e02ad24c5e36ddcd1957ad35677'
        alt='Dean blunt - Black Metal 2'
        className='aspect-square w-[120px] rounded-[4px]'
      />
      <img
        src='https://i.scdn.co/image/ab67616d00001e02af73f776b92d4614152fb141'
        alt='Jungle Jack - JUNGLE DES ILLUSIONS VOL 2'
        className='aspect-square w-[120px] rounded-[4px]'
      />
      <img
        src='https://i.scdn.co/image/ab67616d00001e02ecdb8f824367a53468100faf'
        alt='Yung Lean - Stardust'
        className='aspect-square w-[120px] rounded-[4px]'
      />
      <img
        src='https://i.scdn.co/image/ab67616d00001e021624590458126fc8b8c64c2f'
        alt='Lana Del Rey - Ultraviolence'
        className='aspect-square w-[120px] rounded-[4px]'
      />
      <img
        src='https://i.scdn.co/image/ab67616d00001e020dcf0f3680cff56fe5ff2288'
        alt='A$AP Rocky - Tailor Swif'
        className='aspect-square w-[120px] rounded-[4px]'
      />
      <img
        src='https://i.scdn.co/image/ab67616d00001e02bc1028b7e9cd2b17c770a520'
        alt='Midnight Miami (feat Konvy) - Nino Paid, Konvy'
        className='aspect-square w-[120px] rounded-[4px]'
      />
    </InfiniteSlider>
  );
}

interface ReelShowcaseProps {
  reels: ReelItem[];
  onOpenAdmin?: () => void;
}

export const ReelShowcase: React.FC<ReelShowcaseProps> = ({ reels, onOpenAdmin }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeModalReel, setActiveModalReel] = useState<ReelItem | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const categories = [
    { id: 'all', label: 'All Reels' },
    { id: 'food', label: 'Food & Cafes' },
    { id: 'weddings', label: 'Weddings & Celebrations' },
    { id: 'fashion', label: 'Fashion & OOTD' },
    { id: 'fitness', label: 'Fitness & Gyms' },
    { id: 'products', label: 'D2C & Tech' },
    { id: 'drone', label: 'Drone & Aerials' },
  ];

  const visibleReels = reels.filter((r) => !r.hidden);
  const filteredReels = activeCategory === 'all'
    ? visibleReels
    : visibleReels.filter((r) => r.category === activeCategory);

  const embedInfo = activeModalReel ? parseVideoUrl(activeModalReel.videoUrl) : null;

  return (
    <section className="py-16 md:py-24 relative bg-[#09090b] overflow-hidden border-t border-white/[0.06]">
      {/* Background ambient lighting */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/10 via-[#ff2d2d]/10 to-purple-600/10 blur-[140px] -z-10" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Infinite Slider Header & Soundtracks Showcase */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ff4b4b] mb-3">
            Trending Soundtracks · Hover To Slow Down
          </p>
          <div className="my-6 p-4 bg-white/[0.02] border border-white/[0.08] rounded-2xl backdrop-blur-md overflow-hidden shadow-2xl">
            <InfiniteSliderHoverSpeed />
          </div>
          <p className="text-sm sm:text-base text-zinc-400">
            Shot on 4K Android & iPhones, edited on-site in 10 minutes with trending viral audio beats.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#ff2d2d] text-white shadow-lg shadow-[#ff2d2d]/30 font-bold'
                  : 'bg-white/[0.05] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 3D Floating Tilting Reels Cards Grid */}
        <div className="flex flex-wrap items-center justify-center gap-8">
          {filteredReels.map((reel) => (
            <TiltReelsCard
              key={reel.id}
              reel={reel}
              onClick={() => setActiveModalReel(reel)}
            />
          ))}
        </div>

        {/* Video Player Modal */}
        {activeModalReel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="relative w-full max-w-md aspect-[9/16] bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl flex flex-col justify-between p-6">
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalReel(null)}
                className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/70 text-white hover:bg-black/95 transition-colors cursor-pointer"
                aria-label="Close reel modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Top Info */}
              <div className="relative z-30 pt-2 flex items-center justify-between">
                <div className="bg-[#ff2d2d] px-2.5 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeModalReel.turnaroundMinutes} Min Delivery</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-black/60 text-white cursor-pointer"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Video Embed Player or Simulated Canvas */}
              {embedInfo?.embedUrl ? (
                <div className="relative w-full h-[65%] rounded-2xl overflow-hidden my-auto bg-black border border-white/10">
                  <iframe
                    src={embedInfo.embedUrl}
                    title={activeModalReel.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : embedInfo?.type === 'mp4' && embedInfo.directUrl ? (
                <div className="relative w-full h-[65%] rounded-2xl overflow-hidden my-auto bg-black border border-white/10">
                  <video
                    src={embedInfo.directUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="my-auto text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#ff2d2d] to-amber-500 flex items-center justify-center animate-pulse shadow-lg shadow-[#ff2d2d]/30">
                    <Play className="w-9 h-9 text-white fill-white ml-1" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">
                      {activeModalReel.title}
                    </h4>
                    <p className="text-xs text-zinc-300">
                      {activeModalReel.client} ({activeModalReel.city})
                    </p>
                  </div>
                  <div className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.08] text-xs space-y-1">
                    <div className="text-emerald-400 font-semibold">{activeModalReel.reachMultiplier}</div>
                    <div className="text-zinc-400 font-mono text-[11px]">{activeModalReel.device}</div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="relative z-30 pt-4 border-t border-white/10 text-xs text-zinc-300 flex items-center justify-between">
                <span className="font-mono">{activeModalReel.views} Views</span>
                <span className="text-[#ff4b4b] font-bold">Reels Brozz Certified</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
