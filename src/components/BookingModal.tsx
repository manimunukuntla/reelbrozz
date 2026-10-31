import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  Clock, 
  MapPin, 
  Calendar, 
  Smartphone, 
  Plane, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  Languages,
  FileSpreadsheet,
  ShieldAlert
} from 'lucide-react';
import { PACKAGES, calculateBookingPrice, BookingAddons } from '../utils/pricing';
import { CITIES, formatINR } from '../utils/formatters';
import { LANGUAGES, Language } from '../utils/i18n';
import { createBooking, ClientBooking } from '../utils/bookingStore';
import { DynamicPackage, PromoOffer, loadPackagesFromStorage, loadPromosFromStorage } from '../utils/packageStore';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPackageId?: string;
  initialAddons?: BookingAddons;
  initialPromoCode?: string;
  onNewBookingCreated?: (booking: ClientBooking) => void;
  packages?: DynamicPackage[];
  promos?: PromoOffer[];
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialPackageId = 'half-day',
  initialAddons = {},
  initialPromoCode = 'FIRSTBROZZ',
  onNewBookingCreated,
  packages: propsPackages,
  promos: propsPromos,
}) => {
  const packagesList = propsPackages && propsPackages.length > 0 ? propsPackages : loadPackagesFromStorage();
  const promosList = propsPromos && propsPromos.length > 0 ? propsPromos : loadPromosFromStorage();
  const activePackages = packagesList.filter((p) => p.active !== false);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [packageId, setPackageId] = useState(initialPackageId);
  const [addons, setAddons] = useState<BookingAddons>(initialAddons);
  const [promoCode, setPromoCode] = useState(initialPromoCode);
  
  // Client Form fields required by user specification
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [eventType, setEventType] = useState('Cafe / Food Menu Sizzler');
  const [eventDate, setEventDate] = useState('2026-11-05');
  const [preferredTime, setPreferredTime] = useState('11:00 AM – 1:00 PM');
  const [venueLocation, setVenueLocation] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [preferredLang, setPreferredLang] = useState<Language>('en');

  // Booking result state
  const [createdBooking, setCreatedBooking] = useState<ClientBooking | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const pricing = calculateBookingPrice(packageId, addons, promoCode, activePackages, promosList);
  const selectedPkg = activePackages.find((p) => p.id === packageId) || PACKAGES[packageId] || PACKAGES['half-day'];

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !venueLocation.trim()) {
      setFormError('Please fill in your Full Name, Phone Number, and Venue Address.');
      return;
    }
    setFormError(null);

    const { newBooking } = createBooking({
      fullName: name.trim(),
      phone: phone.trim(),
      email: email.trim() || `${phone.replace(/\D/g, '')}@client.reelsbrozz.in`,
      city,
      eventType,
      eventDate,
      preferredTime,
      packageId,
      packageName: `${selectedPkg.name} (${formatINR(pricing.totalPrice)})`,
      packagePrice: pricing.totalPrice,
      venueLocation: venueLocation.trim(),
      specialRequirements: specialRequirements.trim() || undefined,
    });

    setCreatedBooking(newBooking);
    if (onNewBookingCreated) {
      onNewBookingCreated(newBooking);
    }
    setStep(3); // Confirmation step
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-left">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#ff4b4b] uppercase tracking-wider mb-1">
            <span>⚡ Client Shoot Request Portal</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>10-Minute Reel Delivery Guarantee</span>
          </div>
          <h3 className="text-2xl font-black text-white">
            {step === 3 ? '🎉 Request Received!' : 'Book Your Reels Brozz Shoot'}
          </h3>
        </div>

        {/* Step 1: Package & Add-ons confirmation */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                1. Select Shoot Package
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activePackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setPackageId(pkg.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      packageId === pkg.id
                        ? 'bg-[#ff2d2d]/10 border-[#ff2d2d] ring-1 ring-[#ff2d2d]'
                        : 'bg-zinc-900 border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-sm text-white">{pkg.name}</span>
                      <span className="font-mono text-sm font-extrabold text-[#ff4b4b]">
                        {formatINR(pkg.basePrice)}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {pkg.reelsCount} 4K Reel{pkg.reelsCount > 1 ? 's' : ''} · {pkg.durationMinutes >= 60 ? `${Math.round(pkg.durationMinutes / 60)} hrs` : `${pkg.durationMinutes} mins`} shoot
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Gear Add-ons */}
            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                2. Optional Add-ons
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                  addons.drone4K ? 'bg-[#ff2d2d]/10 border-[#ff2d2d]' : 'bg-zinc-900 border-white/[0.08]'
                }`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!addons.drone4K}
                      onChange={(e) => setAddons({ ...addons, drone4K: e.target.checked })}
                      className="rounded text-[#ff2d2d] focus:ring-[#ff2d2d]"
                    />
                    <span className="text-xs font-semibold text-white">4K Drone Add-on</span>
                  </div>
                  <span className="text-xs font-mono text-[#ff5757]">+₹1,999</span>
                </label>

                <label className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                  addons.expressMultiAngle ? 'bg-[#ff2d2d]/10 border-[#ff2d2d]' : 'bg-zinc-900 border-white/[0.08]'
                }`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!addons.expressMultiAngle}
                      onChange={(e) => setAddons({ ...addons, expressMultiAngle: e.target.checked })}
                      className="rounded text-[#ff2d2d] focus:ring-[#ff2d2d]"
                    />
                    <span className="text-xs font-semibold text-white">Dual-Angle Cam</span>
                  </div>
                  <span className="text-xs font-mono text-[#ff5757]">+₹999</span>
                </label>
              </div>
            </div>

            {/* Summary Strip */}
            <div className="p-4 bg-zinc-900 rounded-xl border border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 block">Total Package with 18% GST</span>
                <span className="text-xl font-black text-white font-display tabular-nums">
                  {formatINR(pricing.totalPrice)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-[#ff2d2d] hover:bg-[#e02424] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Continue to Client Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Client Booking Form */}
        {step === 2 && (
          <form onSubmit={handleSubmitBooking} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d2d]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Phone Number (for WhatsApp updates) *
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
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full px-3 py-2.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d2d]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#ff2d2d]"
                >
                  {CITIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.creatorsCount} active creators)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Event / Shoot Type *
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#ff2d2d]"
                >
                  <option value="Cafe / Food Menu Sizzler">Cafe / Food Menu Sizzler</option>
                  <option value="Wedding / Sangeet / Haldi">Wedding / Sangeet / Haldi</option>
                  <option value="Fashion / OOTD Lookbook">Fashion / OOTD Lookbook</option>
                  <option value="Clinic / Salon Tour">Clinic / Salon Tour</option>
                  <option value="Gym / Fitness Athletic">Gym / Fitness Athletic</option>
                  <option value="Product Launch / Unboxing">Product Launch / Unboxing</option>
                  <option value="Personal Birthday / Party">Personal Birthday / Party</option>
                  <option value="Corporate / Event">Corporate / Event</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#ff2d2d]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  Preferred Time Window *
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-[#ff2d2d]"
                >
                  <option value="Immediate (15-min ETA)">Immediate (15-min ETA)</option>
                  <option value="Morning (9:00 AM – 12:00 PM)">Morning (9:00 AM – 12:00 PM)</option>
                  <option value="Afternoon (12:00 PM – 4:00 PM)">Afternoon (12:00 PM – 4:00 PM)</option>
                  <option value="Evening (4:00 PM – 8:00 PM)">Evening (4:00 PM – 8:00 PM)</option>
                  <option value="Night / Late (8:00 PM onwards)">Night / Late (8:00 PM onwards)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">
                Location / Venue Address *
              </label>
              <textarea
                required
                rows={2}
                value={venueLocation}
                onChange={(e) => setVenueLocation(e.target.value)}
                placeholder="Exact cafe, store, banquet hall, street, floor, landmark..."
                className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d2d]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">
                Special Requirements (Optional)
              </label>
              <textarea
                rows={2}
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                placeholder="Specific music vibe, slow-mo angles, drone needs, product hooks..."
                className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d2d]"
              />
            </div>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                ← Back to Package
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-[#ff2d2d] hover:bg-[#e02424] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-[#ff2d2d]/30 cursor-pointer"
              >
                <span>Submit Shoot Request ({formatINR(pricing.totalPrice)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Exact Requested Confirmation Message */}
        {step === 3 && createdBooking && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                Booking ID: <span className="text-white font-bold">{createdBooking.id}</span>
              </div>
              <h4 className="text-2xl font-black text-white">
                Thank you! Your request has been received.
              </h4>
              <p className="text-sm font-semibold text-emerald-400 mt-2">
                We will confirm soon.
              </p>
              <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 leading-relaxed">
                Our admin team is reviewing your shoot schedule for {createdBooking.city}. You will receive a WhatsApp confirmation and creator assignment shortly.
              </p>
            </div>

            {/* Booking Details Card */}
            <div className="bg-zinc-900 border border-white/[0.08] rounded-2xl p-5 text-left max-w-md mx-auto space-y-2.5 text-xs">
              <div className="flex justify-between items-baseline border-b border-white/[0.06] pb-2">
                <span className="text-zinc-400">Client Name:</span>
                <span className="font-bold text-white">{createdBooking.fullName}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-white/[0.06] pb-2">
                <span className="text-zinc-400">Shoot Package:</span>
                <span className="font-bold text-[#ff4b4b]">{createdBooking.packageName}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-white/[0.06] pb-2">
                <span className="text-zinc-400">Date & Window:</span>
                <span className="font-mono text-white">{createdBooking.eventDate} ({createdBooking.preferredTime})</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-white/[0.06] pb-2">
                <span className="text-zinc-400">Venue:</span>
                <span className="font-medium text-zinc-300 truncate max-w-[200px]">{createdBooking.venueLocation}</span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-zinc-400">Status:</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold text-[11px]">
                  Pending Admin Approval
                </span>
              </div>
            </div>

            {/* Direct WhatsApp Follow-up action */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={`https://wa.me/916305729387?text=Hi%20Reels%20Brozz!%20My%20Shoot%20Booking%20ID%20is%20${createdBooking.id}%20for%20${encodeURIComponent(createdBooking.fullName)}.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp (+91 63057 29387)</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl"
              >
                Close & Return Home
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
