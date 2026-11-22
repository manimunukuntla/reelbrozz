import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { TextScrambleMorph } from './motion/TextScrambleMorph';
import { MagneticButton } from './motion/MagneticButton';
import { ParticleBackground } from './motion/ParticleBackground';

interface HeroProps {
  currentLang: Language;
  onOpenBooking: () => void;
  onScrollToPackages: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentLang,
  onOpenBooking,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-20 md:pb-24 bg-[#09090b]">
      {/* Floating geometric particles & soft ambient glow */}
      <ParticleBackground />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        {/* Animated Motion Graphics Scramble Text Banner */}
        <div className="w-full mb-5 sm:mb-6 flex justify-center">
          <TextScrambleMorph />
        </div>

        {/* Speed & Value Kicker */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] sm:text-xs font-semibold tracking-wide text-[#ff4b4b] uppercase mb-3 sm:mb-4 px-2">
          <span className="flex h-2 w-2 rounded-full bg-[#ff2d2d] animate-ping shrink-0" />
          <span>{t.heroTagline}</span>
          <span aria-hidden="true" className="hidden sm:inline text-zinc-600">·</span>
          <span className="text-zinc-400 font-mono">FROM ₹1,500</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-[2rem] leading-[1.12] sm:text-5xl lg:text-6xl font-black tracking-tight text-white sm:leading-[1.08] text-balance mb-4 sm:mb-6 max-w-3xl">
          Reels Delivered in{' '}
          <span className="bg-gradient-to-r from-[#ff2d2d] via-[#ff5757] to-[#ff8f8f] bg-clip-text text-transparent underline decoration-[#ff2d2d]/30 decoration-4 underline-offset-4 sm:underline-offset-8">
            10 Minutes.
          </span>
        </h1>

        {/* Subheadline - Sized cleanly for scannability */}
        <p className="text-sm sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mb-7 sm:mb-8 px-1">
          Book a verified mobile creator in 30 seconds. They shoot on 4K Android or iPhone, edit on-site with AI, and deliver ready-to-post reels before leaving your venue.
        </p>

        {/* Key Differentiator Badges */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-x-4 sm:gap-x-5 gap-y-2.5 mb-8 sm:mb-10 text-xs sm:text-sm font-medium text-zinc-300 w-full max-w-sm sm:max-w-none">
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#ff2d2d] shrink-0" />
            <span>Android + iPhone 4K</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#ff2d2d] shrink-0" />
            <span>AI On-Site Edit</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#ff2d2d] shrink-0" />
            <span>Starts at ₹1,500</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#ff2d2d] shrink-0" />
            <span>Live GPS Tracking</span>
          </div>
        </div>

        {/* Single Primary Call to Action */}
        <div className="flex items-center justify-center gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
          <MagneticButton onClick={onOpenBooking}>
            <span className="flex items-center justify-center gap-2">
              <span>Start Creating</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </MagneticButton>
        </div>

        {/* Trust Bar (clean metadata) */}
        <div className="w-full pt-5 sm:pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 gap-y-2 text-[11px] sm:text-xs text-zinc-400">
          <div className="flex items-center gap-1 text-amber-400 font-semibold">
            <span>★ 4.9</span>
            <span className="text-zinc-400 font-normal">Rating</span>
          </div>
          <span aria-hidden="true" className="text-zinc-700">·</span>
          <div className="font-medium text-zinc-300">
            50,000+ Reels Delivered
          </div>
          <span aria-hidden="true" className="text-zinc-700 hidden sm:inline">·</span>
          <div>
            20+ Indian Metros
          </div>
          <span aria-hidden="true" className="text-zinc-700">·</span>
          <div className="text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>On-Site SLA Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
};

