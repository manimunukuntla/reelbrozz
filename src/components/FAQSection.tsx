import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [filterQuery, setFilterQuery] = useState('');

  const faqs: FAQItem[] = [
    {
      q: 'How does 10-minute delivery work? Is it really on-site?',
      a: 'Yes, 100%! Our creators are trained in hyper-fast mobile production. While shooting, they capture targeted b-roll with pre-planned hooks. Our on-device AI editing app automatically syncs footage to trending audio beats, color-grades with custom LUTs, and auto-generates dynamic subtitles in minutes. The creator does a quick review and transfers the 4K file directly to your phone via AirDrop or WhatsApp before leaving your premises.',
      category: 'delivery',
    },
    {
      q: 'Why are Reels Brozz prices (from ₹1,500) lower than other platforms?',
      a: 'Traditional agencies and competitor apps charge hefty markups (₹3,000–₹5,000+) because of high middleman overheads and restrictive iPhone-only hiring policies. Reels Brozz runs a decentralized, high-efficiency network powered by AI tools and embraces top Android & iPhone creator talent. We pass the cost savings directly to customers while paying our creators up to 85% of each booking.',
      category: 'pricing',
    },
    {
      q: 'Do you really support Android devices alongside iPhones?',
      a: 'Absolutely! Modern flagship Android devices (Samsung Galaxy S23/S24 Ultra, Google Pixel 8/9 Pro, OnePlus 12, Xiaomi 14 Ultra) capture 4K at 60fps with incredible optical sensors, periscope lenses, and dynamic range. We vet creators strictly on visual output quality, lighting, and camera stabilization — never on phone brand bias.',
      category: 'equipment',
    },
    {
      q: 'Which Indian languages are supported for captions and voiceovers?',
      a: 'We offer full multi-language support in English, Hindi (हिन्दी), Telugu (తెలుగు), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), and Marathi. The creator’s AI app transcribes and styles regional captions with high phonetic accuracy so your content connects with local audiences.',
      category: 'features',
    },
    {
      q: 'How does the 4K Drone add-on work?',
      a: 'When you select the Drone Add-on (+₹1,999), we assign a DGCA-compliant certified drone pilot creator equipped with a compact 4K drone (such as DJI Mini 4 Pro). They shoot 15 minutes of sweeping aerial venue footage, crowd overviews, or architectural exteriors and blend it seamlessly into your reel edit.',
      category: 'drone',
    },
    {
      q: 'What is the Creator Ownership Model?',
      a: 'Unlike other gig platforms where creators are treated as disposable contractors and earn only 30–40%, Reels Brozz pays 75% to 85% revenue share. Creators maintain their own verified public profiles, build direct relationships with clients, and earn recurring retainer revenue from repeat bookings.',
      category: 'creators',
    },
    {
      q: 'What is the cancellation and rescheduling policy?',
      a: 'You can reschedule or cancel for a 100% full refund up to 1 hour before the scheduled shoot time. If a creator is delayed past their promised arrival window, we provide ₹300 Reels Brozz credit directly to your wallet.',
      category: 'booking',
    },
    {
      q: 'Do I get GST tax invoices for business expense reimbursement?',
      a: 'Yes, every booking receives an automated GST tax invoice with your company name and GSTIN number sent directly to your registered email and WhatsApp.',
      category: 'pricing',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(filterQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-20 md:py-32 relative bg-[#09090b]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ff4b4b] mb-3">
            Got Questions? We Have Answers
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-zinc-300">
            Everything you need to know about booking, creators, pricing, and 10-minute delivery.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search questions (e.g., drone, Android, pricing, refund)..."
            className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-white/[0.1] rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d2d]"
          />
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-xl border border-white/[0.08] bg-zinc-950/70 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-4 px-5 text-left font-bold text-sm sm:text-base text-white flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:bg-white/[0.04]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#ff2d2d]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/[0.04]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
