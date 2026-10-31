import React, { useState } from 'react';
import { Smartphone, IndianRupee, Sparkles, Award, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { calculateCreatorEarnings } from '../utils/pricing';
import { formatINR } from '../utils/formatters';

interface BecomeCreatorProps {
  onOpenCreatorModal: () => void;
}

export const BecomeCreator: React.FC<BecomeCreatorProps> = ({ onOpenCreatorModal }) => {
  const [reelsPerWeek, setReelsPerWeek] = useState<number>(10);
  const [tier, setTier] = useState<'beginner' | 'pro' | 'master'>('pro');

  const earnings = calculateCreatorEarnings(reelsPerWeek, tier);

  return (
    <section id="creators" className="py-20 md:py-32 relative bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Creator Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#ff4b4b]">
              <Sparkles className="w-4 h-4 text-[#ff2d2d]" />
              <span>Creator First Platform</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Turn your smartphone into an{' '}
              <span className="text-[#ff2d2d]">income machine.</span>
            </h2>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
              Got an Android or iPhone that shoots crisp 4K? Stop doing unpaid spec work. Reels Brozz sends high-paying reel gigs directly to your phone within 5 km of your location.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#ff2d2d]/20 text-[#ff4b4b] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Keep 75% to 85% of Every Booking</h4>
                  <p className="text-xs text-zinc-400">Industry-leading payout rate. Gigs pay out within 24 hours directly via UPI/IMPS.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#ff2d2d]/20 text-[#ff4b4b] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Full Creator Ownership & Client Retention</h4>
                  <p className="text-xs text-zinc-400">Your profile, your brand. Clients can re-hire you directly for repeat monthly gigs.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#ff2d2d]/20 text-[#ff4b4b] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Android & iPhone Welcomed Equally</h4>
                  <p className="text-xs text-zinc-400">Flagship Galaxy, Pixel, OnePlus, Vivo, Xiaomi or iPhone — if it shoots 4K 30/60 fps, you are eligible.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#ff2d2d]/20 text-[#ff4b4b] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Proprietary Mobile AI Edit Tool Suite</h4>
                  <p className="text-xs text-zinc-400">Automate beat snapping, color grades, and subtitles right inside our Creator Partner app.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={onOpenCreatorModal}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-[#ff2d2d] hover:bg-[#e02424] rounded-xl shadow-xl shadow-[#ff2d2d]/25 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Apply as Creator Partner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Earnings Calculator */}
          <div className="lg:col-span-6">
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-6">
                <div>
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                    Earnings Estimator
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    What You Could Make Monthly
                  </h3>
                </div>
                <div className="px-3 py-1 bg-[#ff2d2d]/20 text-[#ff7171] border border-[#ff2d2d]/40 rounded-lg text-xs font-mono font-bold">
                  {earnings.creatorSharePercent}% Payout
                </div>
              </div>

              {/* Slider for Reels per week */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="reels-per-week" className="text-xs font-semibold text-zinc-300">
                    Gigs / Reels Per Week
                  </label>
                  <span className="text-lg font-black text-white font-mono tabular-nums">
                    {reelsPerWeek} reels/wk
                  </span>
                </div>
                <input
                  id="reels-per-week"
                  type="range"
                  min="2"
                  max="35"
                  value={reelsPerWeek}
                  onChange={(e) => setReelsPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ff2d2d]"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>Part-time (2/wk)</span>
                  <span>Full-time Pro (15/wk)</span>
                  <span>Studio Hustle (35/wk)</span>
                </div>
              </div>

              {/* Creator Tier Selector */}
              <div className="mb-8">
                <span className="text-xs font-semibold text-zinc-300 block mb-2.5">
                  Creator Rank & Equipment Tier
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTier('beginner')}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all ${
                      tier === 'beginner'
                        ? 'bg-white/10 text-white border-white/30'
                        : 'bg-black/30 text-zinc-400 border-white/[0.05] hover:text-white'
                    }`}
                  >
                    <span>Beginner (75%)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTier('pro')}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all ${
                      tier === 'pro'
                        ? 'bg-[#ff2d2d]/20 text-[#ff4b4b] border-[#ff2d2d]'
                        : 'bg-black/30 text-zinc-400 border-white/[0.05] hover:text-white'
                    }`}
                  >
                    <span>Pro Brozz (80%)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTier('master')}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all ${
                      tier === 'master'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/60'
                        : 'bg-black/30 text-zinc-400 border-white/[0.05] hover:text-white'
                    }`}
                  >
                    <span>Master VIP (85%)</span>
                  </button>
                </div>
              </div>

              {/* Projected Monthly Income Card */}
              <div className="p-6 bg-black/60 rounded-2xl border border-white/[0.08] text-center space-y-2 mb-6">
                <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider block">
                  Estimated Monthly Income
                </span>
                <div className="text-4xl sm:text-5xl font-black text-white font-display tabular-nums tracking-tight">
                  {formatINR(earnings.monthlyIncome)}
                  <span className="text-base text-zinc-400 font-normal"> /mo</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold pt-1">
                  <span>Includes {formatINR(earnings.bonusAmount)} 4K equipment & speed bonus</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenCreatorModal}
                className="w-full py-3.5 bg-white text-zinc-950 hover:bg-zinc-200 font-bold rounded-xl transition-colors cursor-pointer text-sm flex items-center justify-center gap-2"
              >
                <span>Complete Quick 2-Minute Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
