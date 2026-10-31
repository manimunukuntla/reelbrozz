import React from 'react';
import { Check, X, Sparkles, Zap, Shield, IndianRupee } from 'lucide-react';

export const WhyUs: React.FC = () => {
  const comparisonRows = [
    {
      feature: 'Starting Price',
      reelsBrozz: '₹1,500 + GST',
      competitors: '₹2,500 – ₹4,000',
      traditional: '₹15,000 – ₹40,000',
      highlight: true,
    },
    {
      feature: 'Delivery Turnaround',
      reelsBrozz: '⚡ 10 Minutes On-Site',
      competitors: '3 to 6 Hours',
      traditional: '7 to 15 Days',
      highlight: true,
    },
    {
      feature: 'Device Inclusiveness',
      reelsBrozz: 'Android + iPhone (4K 30/60 fps)',
      competitors: 'iPhone Only (Strict lock-in)',
      traditional: 'Heavy bulky DSLRs & monitors',
      highlight: false,
    },
    {
      feature: 'AI Editing Assist',
      reelsBrozz: 'Built-in auto beat sync, hooks & grade',
      competitors: 'Manual mobile template cuts',
      traditional: 'Manual desktop Premiere/FCP',
      highlight: false,
    },
    {
      feature: 'Multi-Language Captions',
      reelsBrozz: 'Hindi, Telugu, Tamil, Kannada, English',
      competitors: 'English only',
      traditional: 'Extra translation agency fee',
      highlight: false,
    },
    {
      feature: '4K Drone On-Demand',
      reelsBrozz: 'Optional +₹1,999 add-on',
      competitors: 'Not available on quick bookings',
      traditional: 'Requires separate pilot (₹10,000+)',
      highlight: false,
    },
    {
      feature: 'Creator Payout & Ownership',
      reelsBrozz: 'Creators earn 80% + keep clients',
      competitors: 'Low gig wages (35–45%)',
      traditional: 'Agency takes 70% commission',
      highlight: true,
    },
    {
      feature: 'Live GPS Tracking',
      reelsBrozz: 'Real-time creator ETA map',
      competitors: 'Uncertain arrival time',
      traditional: 'No tracking (frequent delays)',
      highlight: false,
    },
  ];

  return (
    <section id="why-us" className="py-20 md:py-32 relative bg-zinc-950 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ff4b4b] mb-3">
            Honest Comparison
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-5">
            Why India Chooses <span className="text-[#ff2d2d]">Reels Brozz</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
            See how our tech-enabled on-demand creator network compares to old-school videographers and iPhone-only competitors.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0c0c10] shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th className="py-5 px-6 text-sm font-semibold text-zinc-400 w-1/4">
                  Feature / Capability
                </th>
                <th className="py-5 px-6 text-sm font-extrabold text-white bg-[#ff2d2d]/15 border-x border-[#ff2d2d]/30 w-1/3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff2d2d]" />
                    <span className="text-base font-display">Reels Brozz</span>
                  </div>
                </th>
                <th className="py-5 px-6 text-sm font-semibold text-zinc-400 w-1/4">
                  Other Reel Apps
                </th>
                <th className="py-5 px-6 text-sm font-semibold text-zinc-400 w-1/4">
                  Traditional Videographer
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-xs sm:text-sm">
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-semibold text-zinc-200">
                    {row.feature}
                  </td>
                  <td className="py-4 px-6 font-bold text-white bg-[#ff2d2d]/10 border-x border-[#ff2d2d]/25">
                    <div className="flex items-center gap-2 text-white">
                      <Check className="w-4 h-4 text-[#ff2d2d] shrink-0" />
                      <span>{row.reelsBrozz}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-zinc-400">
                    <span>{row.competitors}</span>
                  </td>
                  <td className="py-4 px-6 text-zinc-400">
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
