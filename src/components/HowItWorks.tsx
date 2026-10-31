import React from 'react';
import { Smartphone, Camera, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface HowItWorksProps {
  currentLang: Language;
  onOpenBooking: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ currentLang, onOpenBooking }) => {
  const t = TRANSLATIONS[currentLang];

  const steps = [
    {
      num: '01',
      icon: Smartphone,
      title: 'Book in 30 Seconds',
      description: 'Choose your shoot package, enter your location, select preferred language & time. Instant creator assignment with live GPS ETA.',
      benefit: 'Zero complex booking paperwork',
    },
    {
      num: '02',
      icon: Camera,
      title: 'Creator Shoots in 4K',
      description: 'A verified creator arrives at your doorstep with high-end mobile equipment (Android or iPhone shooting 4K 30/60 fps) and gimbal stabilization.',
      benefit: 'Cinematic angles & smooth pans',
    },
    {
      num: '03',
      icon: Sparkles,
      title: 'AI-Assisted On-Site Edit',
      description: 'Our proprietary AI Assist pairs with creator craft: dynamic beat cuts, auto-color grade, viral hooks, and accurate multi-language captions.',
      benefit: 'Post-ready polish on location',
    },
    {
      num: '04',
      icon: CheckCircle2,
      title: 'Reel Delivered in 10 Mins',
      description: 'No waiting 2 weeks for videographers. The finalized 4K reel is AirDropped or sent via WhatsApp directly to your phone before the creator leaves.',
      benefit: 'Post while the hype is fresh',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 relative bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ff4b4b] mb-3">
            Lightning Fast Speed · Uber For Reels
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-5">
            How Reels Brozz Delivers in{' '}
            <span className="text-[#ff2d2d]">10 Minutes</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
            From booking to ready-to-post 4K reel in your gallery — faster than pizza delivery, tailored for today’s viral feed.
          </p>
        </div>

        {/* 4 Steps Bento / Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.num}
                className="relative bg-zinc-900/60 border border-white/[0.08] hover:border-[#ff2d2d]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 group"
              >
                <div>
                  {/* Step Editorial Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black text-zinc-600 font-display group-hover:text-[#ff2d2d] transition-colors">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white group-hover:bg-[#ff2d2d] group-hover:text-white transition-all shadow-md">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Micro benefit footer */}
                <div className="pt-4 border-t border-white/[0.06] text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{step.benefit}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-[#ff2d2d] hover:bg-[#e02424] rounded-xl shadow-lg shadow-[#ff2d2d]/25 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Book Your 10-Minute Reel Shoot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
