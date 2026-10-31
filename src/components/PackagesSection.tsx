import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  Plane, 
  Camera, 
  Plus, 
  ArrowRight, 
  Percent,
  Clock,
  Video,
  ShieldCheck
} from 'lucide-react';
import { ADDON_PRICES, calculateBookingPrice, BookingAddons } from '../utils/pricing';
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

  const displayCards = activePackages.map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    price: pkg.basePrice,
    duration: pkg.durationMinutes >= 60 ? `Up to ${Math.round(pkg.durationMinutes / 60)} Hours` : `${pkg.durationMinutes} Mins`,
    reels: `${pkg.reelsCount} Edited 4K Reel${pkg.reelsCount > 1 ? 's' : ''}`,
    turnaround: `${pkg.deliveryTimeMinutes} Mins On-Site`,
    isPopular: !!pkg.isPopular,
    features: pkg.features && pkg.features.length > 0 ? pkg.features : [
      `${pkg.reelsCount} Final Cut 4K Reels`,
      `${pkg.resolution} Resolution`,
      'AI Beat Sync & Fast Cut',
      'Instant On-Site Delivery',
    ],
    idealFor: pkg.description || 'Dynamic reel package for creators & brands',
  }));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedPromo(promoCodeInput.trim().toUpperCase());
  };

  const handleQuickApplyPromo = (code: string) => {
    setPromoCodeInput(code);
    setAppliedPromo(code);
  };

  return (
    <section id="packages" className="py-20 md:py-32 relative bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#ff4b4b] mb-3">
            Transparent Pricing · No Hidden Agency Markups
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-5">
            Simple Packages for Every Moment
          </h2>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
            Starting at just ₹1,500 with guaranteed 10-minute on-site delivery. Select your base package and customize optional gear add-ons below.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {displayCards.map((card) => {
            const isSelected = selectedPackageId === card.id;
            return (
              <div
                key={card.id}
                onClick={() => setSelectedPackageId(card.id)}
                className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'bg-zinc-900 border-[#ff2d2d] shadow-xl shadow-[#ff2d2d]/15 ring-1 ring-[#ff2d2d]'
                    : 'bg-zinc-950/70 border-white/[0.08] hover:border-white/20'
                }`}
              >
                {/* Popular Badge */}
                {card.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#ff2d2d] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{card.name}</h3>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#ff2d2d] text-white flex items-center justify-center text-xs">
                        ✓
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 mb-5 min-h-[32px]">
                    {card.idealFor}
                  </p>

                  <div className="mb-6 pb-6 border-b border-white/[0.08]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white font-display tabular-nums">
                        {formatINR(card.price)}
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">+ GST</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-[#ff5757]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{card.duration}</span>
                      <span aria-hidden="true" className="text-zinc-600">·</span>
                      <span>{card.reels}</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3 mb-8">
                    {card.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <Check className="w-4 h-4 text-[#ff2d2d] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPackageId(card.id);
                    onSelectPackage(card.id, addons, appliedPromo);
                  }}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#ff2d2d] text-white shadow-md hover:bg-[#e02424]'
                      : 'bg-white/[0.06] text-zinc-200 hover:bg-white/[0.1] hover:text-white'
                  }`}
                >
                  <span>Select & Book Package</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Interactive Add-on Configurator & Real-time Quote Panel */}
        <div className="bg-zinc-900/80 border border-white/[0.08] rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Optional Add-ons */}
            <div className="lg:col-span-7 space-y-4">
              <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ff2d2d]" />
                <span>Customize Add-Ons for Your Shoot</span>
              </h4>
              <p className="text-xs text-zinc-400 mb-4">
                Want cinematic aerial shots or multiple creators? Add with one click.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Drone Add-on */}
                <label className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  addons.drone4K ? 'bg-[#ff2d2d]/10 border-[#ff2d2d]' : 'bg-black/40 border-white/[0.08] hover:border-white/20'
                }`}>
                  <input
                    type="checkbox"
                    checked={!!addons.drone4K}
                    onChange={(e) => setAddons({ ...addons, drone4K: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded text-[#ff2d2d] focus:ring-[#ff2d2d]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                      <Plane className="w-4 h-4 text-[#ff2d2d]" />
                      <span>4K Drone Pilot Add-on</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      15 mins 4K aerial shots of venue/crowd.
                    </p>
                    <span className="text-xs font-semibold text-[#ff5757] mt-1 block">
                      +₹1,999
                    </span>
                  </div>
                </label>

                {/* Multi Angle Camera Add-on */}
                <label className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  addons.expressMultiAngle ? 'bg-[#ff2d2d]/10 border-[#ff2d2d]' : 'bg-black/40 border-white/[0.08] hover:border-white/20'
                }`}>
                  <input
                    type="checkbox"
                    checked={!!addons.expressMultiAngle}
                    onChange={(e) => setAddons({ ...addons, expressMultiAngle: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded text-[#ff2d2d] focus:ring-[#ff2d2d]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                      <Camera className="w-4 h-4 text-[#ff2d2d]" />
                      <span>Dual-Angle Secondary Cam</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Simultaneous wide + close-up capture.
                    </p>
                    <span className="text-xs font-semibold text-[#ff5757] mt-1 block">
                      +₹999
                    </span>
                  </div>
                </label>
              </div>

              {/* Extra Reels Counter */}
              <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/[0.08] rounded-xl text-xs text-zinc-300">
                <div>
                  <span className="font-semibold text-white block">Need Extra 4K Reels?</span>
                  <span className="text-zinc-400">Additional edited reel delivered on-site (+₹800/reel)</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAddons({ ...addons, extraReelsCount: Math.max(0, (addons.extraReelsCount || 0) - 1) })}
                    className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-white"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-white tabular-nums w-4 text-center">
                    {addons.extraReelsCount || 0}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAddons({ ...addons, extraReelsCount: (addons.extraReelsCount || 0) + 1 })}
                    className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Live Price Breakdown & Checkout Action */}
            <div className="lg:col-span-5 bg-black/60 border border-white/[0.08] rounded-xl p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Package Selected
                  </span>
                  <span className="text-sm font-bold text-[#ff4b4b]">
                    {activePackages.find((p) => p.id === selectedPackageId)?.name || 'Selected Package'}
                  </span>
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. FIRSTBROZZ)"
                    className="flex-1 px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d2d]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-xs font-semibold text-white rounded-lg transition-colors whitespace-nowrap"
                  >
                    Apply
                  </button>
                </form>

                {/* Quick Promo Chips */}
                {promosList.filter((p) => p.active !== false).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {promosList.filter((p) => p.active !== false).map((p) => (
                      <button
                        key={p.code}
                        type="button"
                        onClick={() => handleQuickApplyPromo(p.code)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-all ${
                          appliedPromo.toUpperCase() === p.code.toUpperCase()
                            ? 'bg-[#ff2d2d]/20 border-[#ff2d2d] text-[#ff4b4b] font-bold'
                            : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        🏷️ {p.code} ({p.type === 'fixed' ? `₹${p.value} off` : `${p.value}% off`})
                      </button>
                    ))}
                  </div>
                )}

                {/* Pricing Line items */}
                <div className="space-y-2 text-xs text-zinc-300 mb-4">
                  <div className="flex justify-between">
                    <span>Base Package Price</span>
                    <span className="tabular-nums font-mono">{formatINR(pricing.basePrice)}</span>
                  </div>
                  {pricing.addonsTotal > 0 && (
                    <div className="flex justify-between text-zinc-400">
                      <span>Add-ons Total</span>
                      <span className="tabular-nums font-mono">+{formatINR(pricing.addonsTotal)}</span>
                    </div>
                  )}
                  {pricing.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Promo Discount ({pricing.discountCodeApplied})</span>
                      <span className="tabular-nums font-mono">-{formatINR(pricing.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400">
                    <span>GST (18% Service Tax)</span>
                    <span className="tabular-nums font-mono">{formatINR(pricing.taxAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Total & Action */}
              <div className="pt-4 border-t border-white/[0.1]">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-sm font-bold text-white">Total Amount</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white font-display tabular-nums">
                      {formatINR(pricing.totalPrice)}
                    </span>
                    <span className="text-[10px] text-zinc-400 block">Includes on-site delivery</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPackage(selectedPackageId, addons, appliedPromo)}
                  className="w-full py-3.5 px-4 bg-[#ff2d2d] hover:bg-[#e02424] text-white font-bold rounded-xl shadow-lg shadow-[#ff2d2d]/30 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>Book This Package Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
