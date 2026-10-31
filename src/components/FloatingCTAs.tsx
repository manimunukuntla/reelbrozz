import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { getWhatsAppLink, PLATFORM_CONFIG } from '../utils/constants';
import { SiteConfig, getWhatsAppUrl } from '../utils/siteConfigStore';

interface FloatingCTAsProps {
  onOpenBooking: () => void;
  config?: SiteConfig;
}

export const FloatingCTAs: React.FC<FloatingCTAsProps> = ({ onOpenBooking, config }) => {
  const rawWhatsApp = config?.rawWhatsAppNumber || PLATFORM_CONFIG.rawWhatsAppNumber;
  const displayPhone = config?.displayPhone || PLATFORM_CONFIG.displayPhone;
  const waUrl = getWhatsAppUrl(rawWhatsApp, 'Hi Reels Brozz! I want to book an on-demand 10-minute reel creator.');

  return (
    <>
      {/* Floating WhatsApp Action Button (bottom right on desktop/tablet) */}
      <aside aria-label="Support and Quick Booking" className="fixed bottom-20 sm:bottom-6 right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Chat with Reels Brozz on WhatsApp at ${displayPhone}`}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-xl shadow-emerald-950/50 hover:scale-105 active:scale-95 transition-all duration-200 group border border-emerald-400/30"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
          </div>
          <span className="hidden sm:inline text-xs font-bold tracking-wide pr-1">
            WhatsApp {displayPhone}
          </span>
        </a>
      </aside>

      {/* Mobile-Only Sticky Booking Bottom Bar (capped strictly under 15% mobile viewport, ~52px height) */}
      <aside aria-label="Mobile Sticky Bar" className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/95 backdrop-blur-xl border-t border-white/[0.1] px-4 py-2.5 flex items-center justify-between shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-white flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d2d] animate-ping" />
            <span>Reels in 10 Mins</span>
          </span>
          <span className="text-[11px] font-extrabold text-[#ff4b4b] font-mono">
            From ₹1,500 + GST
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenBooking}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ff2d2d] active:bg-[#e02424] text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
        >
          <span>Book Creator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </aside>
    </>
  );
};
