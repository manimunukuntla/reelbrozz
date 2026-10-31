import React, { useState } from 'react';
import { Play, Eye, Clock, Smartphone, Sparkles, X, Heart, Share2, Volume2, VolumeX, Plus, Edit3 } from 'lucide-react';
import { ReelItem } from '../utils/workStore';

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

  return (
    <section className="py-20 md:py-32 relative bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ff4b4b] mb-3">
            Real Proof · 10-Minute Turnarounds
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Reels That Conquered The Algorithm
          </h2>
          <p className="text-base sm:text-lg text-zinc-300">
            Shot on 4K Android & iPhones, edited on-site in 10 minutes, generating millions of views across India.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#ff2d2d] text-white shadow-md'
                  : 'bg-white/[0.05] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Reels Grid (Vertical 9:16 Aspect Format) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => setActiveModalReel(reel)}
              className="group relative aspect-[9/14] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#ff2d2d]/60 cursor-pointer shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Background gradient simulation */}
              <div className={`absolute inset-0 bg-gradient-to-b ${reel.gradient} opacity-90 group-hover:scale-105 transition-transform duration-500`} />
              
              {/* Overlay vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />

              {/* Top Meta: Speed badge & views */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[11px] font-mono font-bold text-white border border-red-500/30">
                  <Clock className="w-3 h-3 text-[#ff2d2d]" />
                  <span>Delivered in {reel.turnaroundMinutes}m</span>
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-black/50 text-[11px] font-mono text-zinc-300">
                  <Eye className="w-3 h-3 text-emerald-400" />
                  <span>{reel.views}</span>
                </span>
              </div>

              {/* Play Button Indicator */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-14 h-14 rounded-full bg-[#ff2d2d]/90 text-white flex items-center justify-center shadow-lg shadow-[#ff2d2d]/40 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-white ml-1" />
                </div>
              </div>

              {/* Bottom Content Area */}
              <div className="relative z-10 p-5 mt-auto">
                <div className="text-[10px] font-mono text-[#ff7171] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Smartphone className="w-3 h-3" />
                  <span>{reel.device}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-1.5 line-clamp-1 group-hover:text-[#ff4b4b] transition-colors">
                  {reel.title}
                </h3>
                <p className="text-xs text-zinc-300 mb-2">
                  {reel.client} · {reel.city}
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-semibold">{reel.reachMultiplier}</span>
                  <span className="text-zinc-400 truncate max-w-[140px]">{reel.audio}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Player */}
        {activeModalReel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm aspect-[9/16] bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl flex flex-col justify-between p-6">
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalReel(null)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 focus:outline-none"
                aria-label="Close reel modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Top Info */}
              <div className="relative z-20 pt-2 flex items-center justify-between">
                <div className="bg-[#ff2d2d] px-2.5 py-1 rounded text-xs font-bold text-white flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeModalReel.turnaroundMinutes} Min Delivery</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-black/60 text-white"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Animated Reel Canvas */}
              <div className="my-auto text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#ff2d2d] to-amber-500 flex items-center justify-center animate-pulse">
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

              {/* Footer */}
              <div className="relative z-20 pt-4 border-t border-white/10 text-xs text-zinc-300 flex items-center justify-between">
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
