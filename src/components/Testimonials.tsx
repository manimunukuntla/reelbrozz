import React, { useState } from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  business: string;
  city: string;
  category: 'cafe' | 'wedding' | 'influencer' | 'brand';
  avatarInitials: string;
  accentColor: string;
  rating: number;
  quote: string;
  concreteResult: string;
  deviceUsed: string;
}

export const Testimonials: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const testimonials: Testimonial[] = [
    {
      name: 'Rohan Mehta',
      role: 'Founder',
      business: 'BrewCraft Artisanal Cafe',
      city: 'Indiranagar, Bengaluru',
      category: 'cafe',
      avatarInitials: 'RM',
      accentColor: 'from-amber-500 to-orange-600',
      rating: 5,
      quote: 'We booked the Quick Reel (₹1,500) during Sunday brunch rush. The creator arrived in 12 mins with a Galaxy S24 Ultra gimbal rig, shot the sizzling brownie pour, and handed us the finalized 4K reel right before the customers left! Got 450K organic views.',
      concreteResult: '+380% Walk-in traffic within 48 hours',
      deviceUsed: 'Shot on Galaxy S24 Ultra 4K 60fps',
    },
    {
      name: 'Ananya & Kabir Roy',
      role: 'Bride & Groom',
      business: 'Destination Wedding',
      city: 'Udaipur / Delhi NCR',
      category: 'wedding',
      avatarInitials: 'AK',
      accentColor: 'from-rose-500 to-pink-600',
      rating: 5,
      quote: 'Traditional wedding videographers quoted ₹80,000 and promised deliverables after 30 days. We booked Reels Brozz for our Sangeet. We had 5 cinematic 4K reels on our WhatsApp before our midnight afterparty ended. Our friends were shocked by the speed!',
      concreteResult: 'Shared with 400+ guests same night',
      deviceUsed: 'Shot on iPhone 16 Pro 4K HDR',
    },
    {
      name: 'Ayesha Khan',
      role: 'Fashion & Lifestyle Creator',
      business: '180K Instagram Followers',
      city: 'Bandra West, Mumbai',
      category: 'influencer',
      avatarInitials: 'AK',
      accentColor: 'from-purple-500 to-indigo-600',
      rating: 5,
      quote: 'As an influencer, editing reels yourself when you shoot 5 outfits a day is exhausting. Reels Brozz creator was like my personal production crew for 3 hours. The AI hook framing and color grading matched my aesthetic effortlessly.',
      concreteResult: 'Saved 14 hours of weekly editing time',
      deviceUsed: 'Shot on Vivo X100 Pro + Lapel Mic',
    },
    {
      name: 'Dr. Siddharth Varma',
      role: 'Chief Orthodontist',
      business: 'Apex Dental & Smile Studio',
      city: 'Jubilee Hills, Hyderabad',
      category: 'brand',
      avatarInitials: 'SV',
      accentColor: 'from-cyan-500 to-blue-600',
      rating: 5,
      quote: 'We took the Brand Monthly Pass (8 reels). The creators understand clinic lighting and patient sensitivity. Fast turnaround means we post patient transformation reels instantly with accurate Telugu and English subtitles.',
      concreteResult: '+72 New consultations booked this month',
      deviceUsed: 'Shot on iPhone 15 Pro 4K',
    },
    {
      name: 'Vikram Sharma',
      role: 'Creator Partner',
      business: 'Ex-Freelance Videographer',
      city: 'Delhi NCR',
      category: 'influencer',
      avatarInitials: 'VS',
      accentColor: 'from-emerald-500 to-teal-600',
      rating: 5,
      quote: 'Other platforms rejected me because I shoot on an Android S23 Ultra instead of an iPhone, even though my 4K 60fps bitrate is superior. Reels Brozz onboarded me based on my skills. I earn ₹80,000/month consistently with next-day UPI payouts.',
      concreteResult: 'Earns ₹80K+/mo with 80% payout',
      deviceUsed: 'Creator Partner with 5.0 Star Rating',
    },
    {
      name: 'Karan Malhotra',
      role: 'Marketing Head',
      business: 'VoltGrip Gym & Fitness Hub',
      city: 'Koregaon Park, Pune',
      category: 'brand',
      avatarInitials: 'KM',
      accentColor: 'from-red-500 to-amber-600',
      rating: 5,
      quote: 'The drone add-on is insane! For just ₹1,999 extra, we got epic sweeping aerial 4K shots of our CrossFit arena combined with raw powerlifting chalk lifts. Delivered in 15 minutes flat.',
      concreteResult: 'Over 820K viral Instagram views',
      deviceUsed: 'Shot on DJI Mini 4K + OnePlus 12',
    },
  ];

  const filteredTestimonials = filter === 'all'
    ? testimonials
    : testimonials.filter((t) => t.category === filter);

  return (
    <section className="py-20 md:py-32 relative bg-zinc-950 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ff4b4b] mb-3">
            Real Stories · Real Views
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Loved by 50,000+ Brands & Creators
          </h2>
          <p className="text-base sm:text-lg text-zinc-300">
            See how fast 10-minute 4K reel delivery transforms footfall, social reach, and creator livelihoods.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'cafe', label: 'Cafes & Food' },
            { id: 'wedding', label: 'Weddings & Sangeet' },
            { id: 'brand', label: 'Brands & Clinics' },
            { id: 'influencer', label: 'Creators & Influencers' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                filter === cat.id
                  ? 'bg-[#ff2d2d] text-white shadow-md'
                  : 'bg-white/[0.05] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((item) => (
            <div
              key={item.name}
              className="bg-[#0e0e12] border border-white/[0.08] rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all duration-200"
            >
              <div>
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-zinc-700" />
                </div>

                {/* Quote Text */}
                <p className="text-sm text-zinc-300 leading-relaxed mb-6 italic">
                  "{item.quote}"
                </p>
              </div>

              <div>
                {/* Quantified Outcome Kicker */}
                <div className="py-2.5 px-3 bg-white/[0.03] rounded-xl border border-white/[0.05] mb-4 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.concreteResult}</span>
                </div>

                {/* Author Details */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${item.accentColor} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                    {item.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate">
                      {item.role}, {item.business}
                    </p>
                    <p className="text-[11px] text-[#ff7171] truncate font-mono">
                      {item.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
