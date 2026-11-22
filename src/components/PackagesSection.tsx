import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  Plane, 
  Camera, 
  ArrowRight, 
  Clock 
} from 'lucide-react';
import { calculateBookingPrice, BookingAddons } from '../utils/pricing';
import { formatINR } from '../utils/formatters';
import { DynamicPackage, PromoOffer, loadPackagesFromStorage, loadPromosFromStorage } from '../utils/packageStore';

interface PackagesSectionProps {
  onSelectPackage: (packageId: string, addons: BookingAddons, promoCode?: string) => void;
  packages?: DynamicPackage[];
  promos?: PromoOffer[];
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({ 
  onSelectPackage,
  packages: propsPackages,
  promos: propsPromos,
}) => {
  const packagesList = propsPackages && propsPackages.length > 0 ? propsPackages : loadPackagesFromStorage();
  const promosList = propsPromos && propsPromos.length > 0 ? propsPromos : loadPromosFromStorage();
  const activePackages = packagesList.filter((p) => p.active !== false);

  const initialPkgId = activePackages.find((p) => p.isPopular)?.id || activePackages[0]?.id || 'half-day';
  const [selectedPackageId, setSelectedPackageId] = useState<string>(initialPkgId);
  const [addons, setAddons] = useState<BookingAddons>({
    drone4K: false,
    expressMultiAngle: false,
    extraReelsCount: 0,
  });
  const [promoCodeInput, setPromoCodeInput] = useState<string>('FIRSTBROZZ');
  const [appliedPromo, setAppliedPromo] = useState<string>('FIRSTBROZZ');

  const pricing = calculateBookingPrice(selectedPackageId, addons, appliedPromo, activePackages, promosList);

  // Take the 4 primary tiers
  const displayCards = activePackages.slice(0, 4).map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    price: pkg.basePrice,
    duration: pkg.durationMinutes >= 60 ? `${Math.round(pkg.durationMinutes / 60)}h shoot` : `${pkg.durationMinutes}m shoot`,
    reels: `${pkg.reelsCount} Reel${pkg.reelsCount > 1 ? 's' : ''}`,
    isPopular: !!pkg.isPopular,
    features: (pkg.features && pkg.features.length > 0 ? pkg.features : [
      `${pkg.reelsCount} 4K Reels`,
      '10-Min Delivery',
      'AI Color Grade & Beat Sync',
      'Raw Footage Handoff',
    ]).slice(0, 4),
    idealFor: pkg.description || 'Fast on-demand reel package',
  }));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedPromo(promoCodeInput.trim().toUpperCase());
  };

  return (
    <section id="packages" className="py-16 md:py-24 relative bg-[#09090b] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ff4b4b] mb-2">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Transparent Rates, <span className="text-[#ff2d2d]">Zero Surprises</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Flat pricing from ₹1,500 with guaranteed 10-minute on-site delivery. Select your package below.
          </p>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-6 mb-10 sm:mb-12 items-stretch pt-2 sm:pt-0">
          {displayCards.map((card) => {
            const isSelected = selectedPackageId === card.id;
            const isPopular = card.isPopular;

            return (
              <div
                key={card.id}
                onClick={() => setSelectedPackageId(card.id)}
                className={`relative rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer border ${
                  isPopular
                    ? 'bg-zinc-900 border-[#ff2d2d] shadow-xl shadow-[#ff2d2d]/20 ring-1 ring-[#ff2d2d] lg:-translate-y-2'
                    : isSelected
                    ? 'bg-zinc-900/90 border-[#ff2d2d]/60 shadow-lg'
                    : 'bg-zinc-950/60 border-white/[0.08] hover:border-white/20'
                }`}
              >
                {/* Most Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#ff2d2d] text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-lg font-bold text-white">{card.name}</h3>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#ff2d2d] text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2">
                    {card.idealFor}
                  </p>

                  <div className="mb-5 pb-5 border-b border-white/[0.06]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white font-display tabular-nums">
                        {formatINR(card.price)}
                      </span>
                      <span className="text-xs text-zinc-500 font-medium">+ GST</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 text-xs font-semibold text-[#ff5757]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{card.duration}</span>
                      <span aria-hidden="true" className="text-zinc-600">·</span>
                      <span>{card.reels}</span>
                    </div>
                  </div>

                  {/* Feature Checklist - Clean 3-4 bullets */}
                  <ul className="space-y-2.5 mb-6">
                    {card.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-xs text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-[#ff2d2d] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Consistent Select & Book Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPackageId(card.id);
                    onSelectPackage(card.id, addons, appliedPromo);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isPopular || isSelected
                      ? 'bg-[#ff2d2d] text-white shadow-md hover:bg-[#e02424]'
                      : 'bg-white/[0.06] text-zinc-200 hover:bg-[#ff2d2d] hover:text-white'
                  }`}
                >
                  <span>Select & Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Compact Add-on Bar & Real-time Quote */}
        <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left: Optional Add-ons */}
            <div className="lg:col-span-7 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#ff2d2d]" />
                <span>Optional Gear Add-ons</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 text-xs ${
                  addons.drone4K ? 'bg-[#ff2d2d]/10 border-[#ff2d2d]' : 'bg-black/30 border-white/[0.06] hover:border-white/20'
                }`}>
                  <input
                    type="checkbox"
                    checked={!!addons.drone4K}
                    onChange={(e) => setAddons({ ...addons, drone4K: e.target.checked })}
                    className="mt-0.5 w-3.5 h-3.5 rounded text-[#ff2d2d] focus:ring-[#ff2d2d]"
                  />
                  <div>
                    <div className="flex items-center gap-1 font-bold text-white">
                      <Plane className="w-3.5 h-3.5 text-[#ff2d2d]" />
                      <span>4K Drone Pilot (+₹1,999)</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      15 mins 4K aerial shots of venue/crowd.
                    </p>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 text-xs ${
                  addons.expressMultiAngle ? 'bg-[#ff2d2d]/10 border-[#ff2d2d]' : 'bg-black/30 border-white/[0.06] hover:border-white/20'
                }`}>
                  <input
                    type="checkbox"
                    checked={!!addons.expressMultiAngle}
                    onChange={(e) => setAddons({ ...addons, expressMultiAngle: e.target.checked })}
                    className="mt-0.5 w-3.5 h-3.5 rounded text-[#ff2d2d] focus:ring-[#ff2d2d]"
                  />
                  <div>
                    <div className="flex items-center gap-1 font-bold text-white">
                      <Camera className="w-3.5 h-3.5 text-[#ff2d2d]" />
                      <span>Dual-Angle Cam (+₹999)</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Simultaneous wide + close-up capture.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Right: Live Quote Summary & Book Button */}
            <div className="lg:col-span-5 bg-black/40 border border-white/[0.06] rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
                <span className="text-xs text-zinc-400">Total with 18% GST</span>
                <span className="text-lg font-extrabold text-white font-mono">
                  {formatINR(pricing.totalPrice)}
                </span>
              </div>

              {/* Promo input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  placeholder="Coupon code (FIRSTBROZZ)"
                  className="flex-1 min-w-0 px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d2d]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-xs font-semibold text-white rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  Apply
                </button>
              </form>

              <button
                type="button"
                onClick={() => onSelectPackage(selectedPackageId, addons, appliedPromo)}
                className="w-full py-2.5 px-4 bg-[#ff2d2d] hover:bg-[#e02424] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#ff2d2d]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue Booking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
