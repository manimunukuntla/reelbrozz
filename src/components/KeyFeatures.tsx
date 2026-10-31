import React from 'react';
import { 
  Zap, 
  Smartphone, 
  Sparkles, 
  Navigation, 
  Languages, 
  Plane, 
  ShieldCheck, 
  IndianRupee, 
  HeartHandshake, 
  Headphones 
} from 'lucide-react';

export const KeyFeatures: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: '10-Minute Delivery SLA',
      description: 'Your ready-to-post 4K reel is rendered, synced, and handed over before the creator packs up. Zero waiting days.',
      tag: 'Fastest in India',
      colSpan: 'lg:col-span-2',
      badge: 'SPEED',
    },
    {
      icon: Smartphone,
      title: 'Android + iPhone (4K 30–60 fps)',
      description: 'We do not discriminate against hardware. Creators shoot on flagship Androids (S24 Ultra, Pixel 8) and iPhones with high bitrate 4K video.',
      tag: 'Inclusive Tech',
      colSpan: 'lg:col-span-1',
      badge: '4K GEAR',
    },
    {
      icon: Sparkles,
      title: 'AI Editing Assist Engine',
      description: 'On-site smart AI auto-detects highlights, aligns viral audio beats, auto-generates engaging animated captions, and applies LUT color grading.',
      tag: 'Smart Cuts',
      colSpan: 'lg:col-span-1',
      badge: 'AI MAGIC',
    },
    {
      icon: IndianRupee,
      title: 'Transparent Pricing from ₹1,500',
      description: 'No hidden travel fees or surprise equipment charges. Flat, predictable, high-value pricing that beats conventional agency rates by 70%.',
      tag: 'Unbeatable Value',
      colSpan: 'lg:col-span-2',
      badge: 'AFFORDABLE',
    },
    {
      icon: Navigation,
      title: 'Live GPS Creator Tracking',
      description: 'Track your assigned creator on an interactive map as they navigate to your venue. Know their exact arrival minute down to the second.',
      tag: 'Real-time ETA',
      colSpan: 'lg:col-span-1',
      badge: 'TRACKING',
    },
    {
      icon: Languages,
      title: 'Multi-Language Voice & Subtitles',
      description: 'Engage regional audiences across India with native captions and hooks in Hindi, English, Telugu, Tamil, Kannada, and Marathi.',
      tag: 'Pan-India Reach',
      colSpan: 'lg:col-span-1',
      badge: 'REGIONAL',
    },
    {
      icon: Plane,
      title: '4K Drone Add-on Available',
      description: 'Elevate outdoor events, weddings, restaurant facades, and property tours with sweeping cinematic drone b-roll on demand.',
      tag: 'Aerial Cinema',
      colSpan: 'lg:col-span-1',
      badge: 'DRONE READY',
    },
    {
      icon: HeartHandshake,
      title: 'Creator Ownership Model',
      description: 'We put creators first. Our makers keep 75–85% of booking fees and retain their profile, recurring clients, and creative autonomy.',
      tag: 'Creator First',
      colSpan: 'lg:col-span-2',
      badge: 'ETHICAL',
    },
    {
      icon: ShieldCheck,
      title: 'Verified & Background-Checked',
      description: 'Every creator passes a strict 5-tier technical test covering 4K framing, audio leveling, lighting, and customer etiquette.',
      tag: 'Top 5% Talent',
      colSpan: 'lg:col-span-1',
      badge: 'VETTED',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-32 relative bg-zinc-950 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ff4b4b] mb-3">
            Why Reels Brozz Outpaces Everyone
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-5">
            Engineered for Pure Speed, Quality & Scale
          </h2>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
            The traditional videographer agency model is broken with high fees and week-long delays. We built an on-demand machine powered by trained local talent and AI.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={feat.title}
                className={`${feat.colSpan} bg-[#0e0e12] border border-white/[0.08] hover:border-[#ff2d2d]/50 rounded-2xl p-7 flex flex-col justify-between transition-all duration-200 group hover:shadow-xl hover:shadow-[#ff2d2d]/5`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#ff2d2d] group-hover:scale-105 group-hover:bg-[#ff2d2d] group-hover:text-white transition-all shadow-md">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded bg-white/[0.05] text-zinc-300 group-hover:text-white border border-white/[0.08]">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-[#ff4b4b] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-5 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
                  <span>{feat.tag}</span>
                  <span className="text-[#ff2d2d] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Instant Booking →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
