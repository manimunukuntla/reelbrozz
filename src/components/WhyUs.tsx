import React from 'react';
import { Check, X } from 'lucide-react';

export const WhyUs: React.FC = () => {
  const comparisonRows = [
    {
      feature: 'Delivery Speed',
      reelsBrozz: '10 Minutes (On-Site)',
      competitors: '3 to 6 Hours',
      traditional: '7 to 15 Days',
    },
    {
      feature: 'Starting Price',
      reelsBrozz: '₹1,500 + GST',
      competitors: '₹2,500 – ₹4,000',
      traditional: '₹15,000 – ₹40,000',
    },
    {
      feature: 'Hardware Freedom',
      reelsBrozz: 'Android + iPhone (4K 30/60fps)',
      competitors: 'iPhone Only',
      traditional: 'Bulky DSLR rigs',
    },
    {
      feature: 'Editing Turnaround',
      reelsBrozz: 'AI-assisted on location',
      competitors: 'Manual mobile templates',
      traditional: 'Days of desktop Premiere/FCP',
    },
    {
      feature: 'Regional Subtitles',
      reelsBrozz: 'Hindi, Telugu, Tamil, English, etc.',
      competitors: 'English only',
      traditional: 'Extra agency translation fee',
    },
    {
      feature: 'Arrival Tracking',
      reelsBrozz: 'Live GPS ETA on map',
      competitors: 'Uncertain timing',
      traditional: 'No tracking (frequent delays)',
    },
    {
      feature: 'Creator Payout',
      reelsBrozz: 'Creators earn 75–85%',
      competitors: 'Low gig cut (35–45%)',
      traditional: 'Agency retains 70%',
    },
  ];

  return (
    <section id="why-us" className="py-16 md:py-24 relative bg-zinc-950 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ff4b4b] mb-2">
            Comparison
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Why Choose <span className="text-[#ff2d2d]">Reels Brozz</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            High speed, transparent pricing, and verified local talent vs. old agency delays.
          </p>
        </div>

        {/* Mobile Stacked Comparison Cards (zero horizontal overflow) */}
        <div className="md:hidden space-y-3">
          {comparisonRows.map((row) => (
            <div
              key={row.feature}
              className="rounded-2xl border border-white/[0.08] bg-[#0c0c10] p-4 space-y-2.5"
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                {row.feature}
              </div>
              <div className="p-3 rounded-xl bg-[#ff2d2d]/10 border border-[#ff2d2d]/30 flex items-start gap-2">
                <Check className="w-4 h-4 text-[#ff2d2d] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff5757] block">
                    Reels Brozz
                  </span>
                  <span className="text-sm font-bold text-white">{row.reelsBrozz}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] uppercase text-zinc-500 font-semibold block mb-0.5">
                    Other Apps
                  </span>
                  <span className="text-zinc-300 leading-snug block">{row.competitors}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] uppercase text-zinc-500 font-semibold block mb-0.5">
                    Agencies
                  </span>
                  <span className="text-zinc-400 leading-snug block">{row.traditional}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Comparison Table */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0c0c10] shadow-xl">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-1/4">
                  Feature
                </th>
                <th className="py-4 px-6 text-sm font-extrabold text-white bg-[#ff2d2d]/10 border-x border-[#ff2d2d]/30 w-1/3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff2d2d]" />
                    <span>Reels Brozz</span>
                  </div>
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-1/4">
                  Other Reel Apps
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider w-1/4">
                  Traditional Agencies
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs sm:text-sm">
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-6 font-medium text-zinc-300">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-white bg-[#ff2d2d]/5 border-x border-[#ff2d2d]/20">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#ff2d2d] shrink-0" />
                      <span>{row.reelsBrozz}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-zinc-400">
                    <span>{row.competitors}</span>
                  </td>
                  <td className="py-3.5 px-6 text-zinc-500">
                    <span>{row.traditional}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};
