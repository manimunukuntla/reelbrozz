import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Sparkles, 
  Clock, 
  Video, 
  ShieldCheck, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  Volume2, 
  VolumeX,
  Share2,
  Heart,
  MessageCircle,
  Smartphone
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface HeroProps {
  currentLang: Language;
  onOpenBooking: () => void;
  onScrollToPackages: () => void;
}

interface SceneData {
  id: string;
  category: string;
  title: string;
  location: string;
  views: string;
  fps: string;
  audioTrack: string;
  accentBg: string;
}

const SCENES: SceneData[] = [
  {
    id: 'cafe',
    category: 'Food & Cafes',
    title: 'Smoked Truffle Burger & Fries Sizzle',
    location: 'Third Wave Roastery, Bengaluru',
    views: '480K Views',
    fps: '4K @ 60fps',
    audioTrack: 'Original Audio · Reels Brozz Viral Beat',
    accentBg: 'from-amber-900/60 via-zinc-950 to-zinc-950',
  },
  {
    id: 'sangeet',
    category: 'Weddings & Celebrations',
    title: 'Bride Candid Entry & Fireworks',
    location: 'The Leela Palace, Udaipur',
    views: '890K Views',
    fps: '4K @ 60fps HDR',
    audioTrack: 'Trending Dhol Mix · AI Audio Mastered',
    accentBg: 'from-rose-950/70 via-zinc-950 to-zinc-950',
  },
  {
    id: 'fashion',
    category: 'Fashion & OOTD',
    title: 'Streetwear Oversized Fit Showcase',
    location: 'Connaught Place, New Delhi',
    views: '320K Views',
    fps: '4K @ 30fps',
    audioTrack: 'Hip Hop Bassline · Sync Cut',
    accentBg: 'from-indigo-950/60 via-zinc-950 to-zinc-950',
  },
  {
    id: 'fitness',
    category: 'Gyms & Athletics',
    title: 'Deadlift PR & Chalk Explosion Slow-Mo',
    location: 'Cult.fit Elite, Mumbai',
    views: '610K Views',
    fps: '4K @ 60fps',
    audioTrack: 'High BPM Gym Drop · AI Speed Ramp',
    accentBg: 'from-emerald-950/60 via-zinc-950 to-zinc-950',
  },
];

export const Hero: React.FC<HeroProps> = ({
  currentLang,
  onOpenBooking,
  onScrollToPackages,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(582); // 9 mins 42 sec
  const [liked, setLiked] = useState(false);

  // Simulated countdown timer for 10-minute delivery
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 10 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeScene = SCENES[activeSceneIndex];
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedCountdown = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <section className="relative overflow-hidden pt-8 pb-20 md:pt-14 md:pb-32 bg-[#09090b]">
      {/* Background ambient red glow gradient */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] sm:w-[900px] h-[550px] bg-gradient-to-b from-[#ff2d2d]/20 via-[#ff2d2d]/5 to-transparent blur-[120px] -z-10" 
      />

      {/* Subtle geometric grid background */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 subtle-grid opacity-30 -z-10" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Speed & Value Kicker - clean unboxed metadata */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm font-semibold tracking-wide text-[#ff4b4b] uppercase mb-4">
              <span className="flex h-2 w-2 rounded-full bg-[#ff2d2d] animate-ping shrink-0" />
              <span>{t.heroTagline}</span>
              <span aria-hidden="true" className="text-zinc-600">/</span>
              <span className="text-zinc-300 font-mono">FROM ₹1,500</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] text-balance mb-6">
              Reels Delivered in{' '}
              <span className="bg-gradient-to-r from-[#ff2d2d] via-[#ff5757] to-[#ff8f8f] bg-clip-text text-transparent underline decoration-[#ff2d2d]/40 decoration-4 underline-offset-8">
                10 Minutes.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl text-zinc-300 leading-relaxed max-w-2xl mb-8">
              {t.heroSubheadline}
            </p>

            {/* Differentiator Highlights list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-9 text-xs sm:text-sm font-medium text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff2d2d] shrink-0" />
                <span>Android + iPhone 4K</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff2d2d] shrink-0" />
                <span>AI On-Site Edit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff2d2d] shrink-0" />
                <span>Starts at ₹1,500</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff2d2d] shrink-0" />
                <span>Live GPS Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff2d2d] shrink-0" />
                <span>4K Drone Add-on</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff2d2d] shrink-0" />
                <span>5+ Indian Languages</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                type="button"
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 text-base font-bold text-white bg-[#ff2d2d] hover:bg-[#e02424] active:scale-98 rounded-xl shadow-xl shadow-[#ff2d2d]/30 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>{t.bookCreator}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onScrollToPackages}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-zinc-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] active:scale-98 rounded-xl border border-white/[0.1] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2d2d]"
              >
                <span>{t.viewPackages} (₹1,500+)</span>
              </button>
            </div>

            {/* Trust Bar (unboxed clean metadata) */}
            <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm text-zinc-400">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span>★ 4.9 Rating</span>
              </div>
              <span aria-hidden="true" className="text-zinc-700 hidden sm:inline">·</span>
              <div className="font-semibold text-zinc-200">
                50,000+ Reels Delivered
              </div>
              <span aria-hidden="true" className="text-zinc-700 hidden sm:inline">·</span>
              <div>
                Live in 20+ Indian Cities
              </div>
              <span aria-hidden="true" className="text-zinc-700 hidden sm:inline">·</span>
              <div className="text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>100% On-Site SLA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Reel Simulator & Phone Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[360px] aspect-[9/18.5] bg-zinc-950 rounded-[42px] border-[5px] border-zinc-800 shadow-2xl shadow-red-950/40 p-3 overflow-hidden flex flex-col justify-between select-none">
              
              {/* Phone Dynamic Island / Camera Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-900 rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-800" />
              </div>

              {/* Simulated Reel Video Canvas / Viewport */}
              <div className={`relative w-full h-full rounded-[32px] overflow-hidden bg-gradient-to-b ${activeScene.accentBg} flex flex-col justify-between p-4`}>
                
                {/* Header HUD: Live Delivery Countdown & Speed Meter */}
                <div className="relative z-20 pt-4 flex items-center justify-between">
                  {/* Delivery countdown timer */}
                  <div className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-red-500/30 flex items-center gap-1.5 text-[11px] font-mono font-semibold text-white">
                    <Clock className="w-3 h-3 text-[#ff2d2d] animate-spin" style={{ animationDuration: '6s' }} />
                    <span className="text-[#ff4b4b]">DELIVERY:</span>
                    <span className="tabular-nums font-bold text-white">{formattedCountdown}</span>
                  </div>

                  {/* 4K Resolution & FPS pill */}
                  <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300 border border-white/10 flex items-center gap-1">
                    <Video className="w-2.5 h-2.5 text-emerald-400" />
                    <span>{activeScene.fps}</span>
                  </div>
                </div>

                {/* Central Visual Motion / Reel Simulation Graphic */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto py-8">
                  {/* Pulsing Reel Ring Visual */}
                  <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#ff2d2d]/20 animate-ping" style={{ animationDuration: '3s' }} />
                    <div className="absolute inset-2 rounded-full border border-dashed border-[#ff2d2d]/60 animate-spin" style={{ animationDuration: '12s' }} />
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#ff2d2d] to-amber-500 flex items-center justify-center shadow-lg shadow-[#ff2d2d]/40">
                      <Play className="w-7 h-7 text-white fill-white ml-1" />
                    </div>
                  </div>

                  {/* AI Edit Assist Live Status */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/80 rounded-full border border-red-500/40 text-[11px] font-medium text-white mb-2">
                    <Sparkles className="w-3 h-3 text-amber-400 animate-bounce" />
                    <span>AI On-Site Sync & Color Grade</span>
                  </div>

                  <p className="text-xs text-zinc-300 font-medium px-4 line-clamp-2">
                    {activeScene.title}
                  </p>
                </div>

                {/* Right Action Icons (like real Instagram/YouTube Shorts) */}
                <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4">
                  <button 
                    type="button" 
                    onClick={() => setLiked(!liked)} 
                    className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform"
                    aria-label="Like reel"
                  >
                    <div className={`p-2 rounded-full bg-black/50 backdrop-blur-md ${liked ? 'text-[#ff2d2d]' : 'text-white'}`}>
                      <Heart className={`w-5 h-5 ${liked ? 'fill-[#ff2d2d]' : ''}`} />
                    </div>
                    <span className="text-[10px] font-mono">{liked ? '48.1K' : '48K'}</span>
                  </button>

                  <div className="flex flex-col items-center gap-1 text-white">
                    <div className="p-2 rounded-full bg-black/50 backdrop-blur-md">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono">1.2K</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 text-white">
                    <div className="p-2 rounded-full bg-black/50 backdrop-blur-md">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono">14K</span>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => setIsMuted(!isMuted)} 
                    className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:text-[#ff2d2d]"
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Reel Footer: Creator Handle, Caption, Audio ticker */}
                <div className="relative z-20 text-left space-y-1.5 pt-2">
                  <div className="flex items-center gap-2">
                    <a
                      href="https://www.instagram.com/reelbrozz?utm_source=ig_web_button_share_sheet&rpxt=ZDNlZDc0MzIxNw=="
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-amber-500 flex items-center justify-center text-[10px] font-bold text-white">
                        RB
                      </div>
                      <span className="text-xs font-bold text-white tracking-wide">
                        @reelbrozz
                      </span>
                    </a>
                    <span className="text-[10px] bg-[#ff2d2d]/30 text-[#ff7171] px-1.5 py-0.2 rounded font-mono">
                      VERIFIED
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-200 line-clamp-1">
                    Shot & edited on-site in 8 mins! ✨ {activeScene.location}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                    <span className="text-zinc-500">♫</span>
                    <span className="truncate max-w-[200px]">{activeScene.audioTrack}</span>
                  </div>

                  {/* Interactive Scene Selector tabs inside phone */}
                  <div className="pt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {SCENES.map((scene, idx) => (
                      <button
                        key={scene.id}
                        type="button"
                        onClick={() => setActiveSceneIndex(idx)}
                        className={`text-[9px] px-2 py-1 rounded transition-colors whitespace-nowrap ${
                          activeSceneIndex === idx
                            ? 'bg-[#ff2d2d] text-white font-bold'
                            : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                        }`}
                      >
                        {scene.category.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Caption Under Phone */}
            <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
              <Smartphone className="w-4 h-4 text-[#ff2d2d]" />
              <span>Simulated 10-Minute Creator Reel Workflow (Android & iPhone)</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
