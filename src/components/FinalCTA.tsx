import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Apple, Play, Sparkles, Send } from 'lucide-react';
import { CITIES } from '../utils/formatters';

interface FinalCTAProps {
  onOpenBooking: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenBooking }) => {
  const [enquirySent, setEnquirySent] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');

  const handleEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (website.trim()) return;
    if (!name.trim() || !phone.trim()) return;
    setEnquirySent(true);
  };

  return (
    <section className="py-14 sm:py-16 md:py-24 relative bg-zinc-950 border-t border-white/[0.06] overflow-hidden">
      
      {/* Background glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#ff2d2d]/10 blur-[120px] -z-10" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: App download & special offer */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#ff4b4b]">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Limited Time Launch Offer</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Get <span className="text-[#ff2d2d]">₹500 OFF</span> your first 10-minute reel booking.
            </h2>

            <p className="text-sm sm:text-lg text-zinc-300 leading-relaxed">
              Use promo code <span className="text-white font-mono font-bold bg-white/[0.08] px-2 py-0.5 rounded border border-white/10">FIRSTBROZZ</span> at checkout. Download the Reels Brozz customer app or book instantly from your browser.
            </p>

            {/* App Store & Play Store Download Badges */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 sm:gap-4">
              <button
                type="button"
                onClick={onOpenBooking}
                className="flex items-center justify-center sm:justify-start gap-3 px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white transition-all shadow-md cursor-pointer text-left w-full lg:w-auto"
              >
                <Apple className="w-6 h-6 fill-white shrink-0" />
                <div className="text-left">
                  <div className="text-[10px] text-zinc-400 uppercase font-medium">Book Instantly via</div>
                  <div className="text-sm font-bold tracking-tight">iOS & Web App</div>
                </div>
              </button>

              <button
                type="button"
                onClick={onOpenBooking}
                className="flex items-center justify-center sm:justify-start gap-3 px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white transition-all shadow-md cursor-pointer text-left w-full lg:w-auto"
              >
                <Play className="w-6 h-6 fill-white shrink-0" />
                <div className="text-left">
                  <div className="text-[10px] text-zinc-400 uppercase font-medium">Book Instantly via</div>
                  <div className="text-sm font-bold tracking-tight">Android & Web App</div>
                </div>
              </button>
            </div>

            <div className="pt-1 flex items-center gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Zero Installation Required to Book Online</span>
              </div>
            </div>
          </div>

          {/* Right Column: Custom Corporate / Brand Enquiry Card */}
          <div className="lg:col-span-6">
            <div className="bg-[#0e0e13] border border-white/[0.1] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl relative">
              <div className="mb-5 sm:mb-6 pb-4 border-b border-white/[0.08]">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                  Custom Event or Multi-City Brand Shoot?
                </h3>
                <p className="text-xs text-zinc-400">
                  Fill in your details for custom restaurant chains, wedding mandates, or enterprise packages.
                </p>
              </div>

              {!enquirySent ? (
                <form onSubmit={handleEnquiry} className="space-y-4">
                  {/* Anti-spam honeypot field */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="enquiry-website">Website</label>
                    <input
                      id="enquiry-website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sameer Kapoor"
                        className="w-full px-3 py-2.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d2d]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 00000"
                        className="w-full px-3 py-2.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d2d]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Target City
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
                      Project Requirements & Shoot Details
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about the occasion, number of reels needed, dates, or drone requirements..."
                      className="w-full px-3 py-2.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d2d]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#ff2d2d] hover:bg-[#e02424] text-white font-bold rounded-xl shadow-lg shadow-[#ff2d2d]/30 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Custom Shoot Enquiry</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    Thank You, {name}!
                  </h4>
                  <p className="text-xs text-zinc-300 max-w-sm mx-auto">
                    Our creator operations lead for {city} will WhatsApp you a custom proposal within 15 minutes.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
