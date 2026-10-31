import React from 'react';

export const SocialProof: React.FC = () => {
  const mediaMentions = [
    { name: 'YourStory', tag: 'Startup Spotlight' },
    { name: 'Inc42', tag: 'Creator Economy 2026' },
    { name: 'TechInAsia', tag: 'Fastest Reel Platform' },
    { name: 'Economic Times', tag: 'Retail Innovation' },
    { name: 'Entrackr', tag: 'On-Demand Growth' },
  ];

  const brandCategories = [
    { count: '1,200+', label: 'Cafes & Cloud Kitchens' },
    { count: '850+', label: 'Fashion & D2C Brands' },
    { count: '3,400+', label: 'Weddings & Celebrations' },
    { count: '12,000+', label: 'Independent Creators' },
  ];

  return (
    <section className="py-12 border-y border-white/[0.08] bg-zinc-950/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Media Mentions */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-zinc-400 mb-6">
            Featured Across Leading Indian Tech & Media Outlets
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75">
            {mediaMentions.map((item) => (
              <div key={item.name} className="flex flex-col items-center">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-zinc-300 font-display hover:text-white transition-colors">
                  {item.name}
                </span>
                <span className="text-[10px] text-[#ff4b4b] font-mono tracking-wider">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quantified Reach Strip */}
        <div className="pt-8 border-t border-white/[0.05] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {brandCategories.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-display tabular-nums">
                {stat.count}
              </span>
              <span className="text-xs text-zinc-400 mt-1 font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
