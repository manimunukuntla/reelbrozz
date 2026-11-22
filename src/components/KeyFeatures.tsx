import React from 'react';
import { 
  Zap, 
  Smartphone, 
  Sparkles, 
  Navigation, 
  Languages, 
  ShieldCheck, 
  IndianRupee, 
  HeartHandshake 
} from 'lucide-react';

export const KeyFeatures: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: '10-Minute Delivery SLA',
      description: 'Your ready-to-post 4K reel is synced, color-graded, and delivered before the creator packs up.',
      tag: 'Speed SLA',
    },
    {
      icon: Smartphone,
      title: 'Android + iPhone (4K)',
      description: 'Shot on flagship devices (Galaxy S24 Ultra, Pixel 8, iPhone 15/16 Pro) with high bitrate 4K video.',
      tag: 'Flagship 4K',
    },
    {
      icon: Sparkles,
      title: 'AI Editing Assist',
      description: 'On-site smart AI auto-detects highlights, aligns viral audio beats, and generates animated captions.',
      tag: 'Smart Cuts',
    },
    {
      icon: IndianRupee,
      title: 'Transparent from ₹1,500',
      description: 'Flat, predictable pricing with zero travel markups or surprise equipment rental fees.',
      tag: 'Predictable',
    },
    {
      icon: Navigation,
      title: 'Live GPS Creator Tracking',
      description: 'Track your assigned creator on an interactive map in real-time as they navigate to your venue.',
      tag: 'Live ETA',
    },
    {
      icon: Languages,
      title: 'Multi-Language Captions',
      description: 'Accurate dynamic subtitles in Hindi, English, Telugu, Tamil, Kannada, and Marathi.',
      tag: 'Pan-India',
    },
    {
      icon: HeartHandshake,
      title: 'Creator Ownership Model',
      description: 'Creators keep 75–85% of booking fees, driving passionate craft and consistent high quality.',
      tag: 'Creator First',
    },
    {
      icon: ShieldCheck,
      title: 'Verified & Vetted Talent',
      description: 'Every mobile videographer is background-checked and passes a strict 5-tier technical test.',
      tag: 'Top 5%',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 relative bg-zinc-950 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ff4b4b] mb-2">
            Why Reels Brozz
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Engineered for <span className="text-[#ff2d2d]">Pure Speed & Quality</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            A tech-enabled creator network built to replace slow, expensive videographer agencies.
          </p>
        </div>

        {/* Uniform 8-Card Grid (4 cols on lg, 2 on sm/md) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-[#0e0e12] border border-white/[0.06] hover:border-[#ff2d2d]/30 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#ff2d2d] group-hover:scale-105 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#ff4b4b] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
