import React, { useState } from 'react';
import { MapPin, Search, CheckCircle2, Clock, Users } from 'lucide-react';
import { CITIES } from '../utils/formatters';

interface CitiesSectionProps {
  onSelectCity: (cityName: string) => void;
}

export const CitiesSection: React.FC<CitiesSectionProps> = ({ onSelectCity }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = CITIES.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <section className="py-20 md:py-28 relative bg-zinc-950 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ff4b4b] mb-3">
            Pan-India Network
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Live in 20+ Major Indian Metros
          </h2>
          <p className="text-base sm:text-lg text-zinc-300">
            Over 9,500 trained mobile videographers ready to reach your cafe, venue, or studio in under 15 minutes.
          </p>
        </div>

        {/* City Search Bar */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Check your city (e.g. Delhi, Mumbai, Bengaluru)..."
              className="w-full pl-11 pr-4 py-3 bg-[#0d0d12] border border-white/[0.1] rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d2d] transition-colors"
            />
          </div>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCities.map((city) => (
            <div
              key={city.id}
              onClick={() => onSelectCity(city.name)}
              className="p-4 rounded-xl bg-[#0e0e13] border border-white/[0.08] hover:border-[#ff2d2d]/60 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white group-hover:text-[#ff4b4b] transition-colors">
                    {city.name}
                  </span>
                  {city.popular && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#ff2d2d]/20 text-[#ff7171]">
                      HOT
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{city.creatorsCount}+ Active Creators</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Avg ETA: {city.avgEtaMinutes} mins</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-white/[0.05] text-[11px] font-semibold text-[#ff2d2d] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Book in {city.name} →</span>
              </div>
            </div>
          ))}
        </div>

        {filteredCities.length === 0 && (
          <div className="text-center py-8 text-zinc-400 text-sm">
            No exact match found for "{searchQuery}". We are launching in 15 new tier-2 cities this month!
          </div>
        )}

        <div className="mt-8 text-center text-xs text-zinc-500">
          Expanding rapidly: Surat, Indore, Nagpur, Coimbatore, Bhubaneswar & Vadodara coming next.
        </div>

      </div>
    </section>
  );
};
