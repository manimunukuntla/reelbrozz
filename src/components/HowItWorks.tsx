import React from 'react';
import { Smartphone, Camera, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../utils/i18n';

interface HowItWorksProps {
  currentLang: Language;
  onOpenBooking: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = () => {
  const steps = [
    {
      num: '01',
      icon: Smartphone,
      title: 'Book in 30 Seconds',
      description: 'Select your package, venue location, and time slot. Get an instant creator match with live GPS tracking.',
    },
    {
      num: '02',
      icon: Camera,
      title: 'Creator Shoots in 4K',
      description: 'Your verified creator arrives on-site with gimbal-stabilized Android or iPhone shooting 4K (30/60 fps).',
    },
    {
      num: '03',
      icon: Sparkles,
      title: 'AI Edit On-Site',
      description: 'Instant dynamic beat cuts, color grading, and accurate multi-language captions assembled right at your venue.',
    },
    {
      num: '04',
      icon: CheckCircle2,
      title: 'Delivered in 10 Mins',
      description: 'Post-ready 4K reels transferred directly to your gallery via AirDrop or WhatsApp before the creator leaves.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 relative bg-[#09090b] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ff4b4b] mb-2">
            Speed SLA
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            How It Works in <span className="text-[#ff2d2d]">4 Simple Steps</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            From booking to ready-to-post 4K reel in your gallery in under 10 minutes.
          </p>
        </div>

        {/* 4 Compact Evenly Spaced Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.num}
                className="bg-zinc-900/40 border border-white/[0.06] hover:border-[#ff2d2d]/30 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-black text-zinc-600 font-display group-hover:text-[#ff2d2d] transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white group-hover:bg-[#ff2d2d] transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {step.description}
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
