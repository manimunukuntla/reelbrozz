import React, { useState } from 'react';
import { X, CheckCircle2, Smartphone, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { CITIES } from '../utils/formatters';

interface CreatorApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorApplicationModal: React.FC<CreatorApplicationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [phoneModel, setPhoneModel] = useState('Samsung Galaxy S24 Ultra');
  const [canShoot4K, setCanShoot4K] = useState(true);
  const [hasGimbal, setHasGimbal] = useState(true);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [weeklyAvailability, setWeeklyAvailability] = useState('10-20 hours / week');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-left">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.08]"
          aria-label="Close creator application modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="mb-6 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#ff4b4b] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Creator Partner Onboarding · Keep 80%</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                Apply to Become a Reels Brozz Creator
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                We accept both Android and iPhone devices capable of 4K 30–60 fps. Gigs sent directly within your neighborhood.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full px-3 py-2.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d2d]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d2d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Your Base City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#ff2d2d]"
                  >
                    {CITIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Primary Phone Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={phoneModel}
                    onChange={(e) => setPhoneModel(e.target.value)}
                    placeholder="e.g. Galaxy S24 Ultra, iPhone 15 Pro, Pixel 8"
                    className="w-full px-3 py-2.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d2d]"
                  />
                </div>
              </div>

              {/* Hardware checkboxes */}
              <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-white/[0.08] space-y-2">
                <label className="flex items-center gap-2.5 text-xs font-medium text-zinc-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canShoot4K}
                    onChange={(e) => setCanShoot4K(e.target.checked)}
                    className="rounded text-[#ff2d2d] focus:ring-[#ff2d2d]"
                  />
                  <span>My phone shoots 4K video at 30fps or 60fps</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs font-medium text-zinc-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasGimbal}
                    onChange={(e) => setHasGimbal(e.target.checked)}
                    className="rounded text-[#ff2d2d] focus:ring-[#ff2d2d]"
                  />
                  <span>I own or plan to get a mobile gimbal / wireless lapel mic</span>
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Instagram Handle / Portfolio Link *
                </label>
                <input
                  type="text"
                  required
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                  placeholder="e.g. @yourcreatorhandle or drive link to 1 reel"
                  className="w-full px-3 py-2.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d2d]"
                />
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <div className="text-[11px] text-zinc-400">
                  ⚡ 80% Payout · Direct UPI Payouts
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#ff2d2d] hover:bg-[#e02424] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#ff2d2d]/30 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Submit Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-black text-white">
              Application Received, {name}!
            </h4>
            <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
              Your {phoneModel} meets our 4K video specifications! Our creator team in {city} will WhatsApp you the AI editing app invite link and trial gig details within 2 hours.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl"
              >
                Close & Return to Website
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
