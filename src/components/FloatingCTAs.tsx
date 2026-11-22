import React from 'react';
import { MessageCircle, Instagram } from 'lucide-react';
import { PLATFORM_CONFIG } from '../utils/constants';
import { SiteConfig, getWhatsAppUrl } from '../utils/siteConfigStore';

interface FloatingCTAsProps {
  onOpenBooking: () => void;
  config?: SiteConfig;
}

const INSTAGRAM_REDIRECT_URL =
  'https://www.instagram.com/reelbrozz?utm_source=ig_web_button_share_sheet&fqnt=ZDNlZDc0MzIxNw==';

export const FloatingCTAs: React.FC<FloatingCTAsProps> = ({ config }) => {
  const rawWhatsApp = config?.rawWhatsAppNumber || PLATFORM_CONFIG.rawWhatsAppNumber;
  const displayPhone = config?.displayPhone || PLATFORM_CONFIG.displayPhone;
  const waUrl = getWhatsAppUrl(rawWhatsApp, 'Hi Reels Brozz! I want to book an on-demand 10-minute reel creator.');

  return (
    <aside
      aria-label="Floating Instagram and WhatsApp shortcuts"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-5 z-40 pointer-events-auto flex flex-col items-end gap-2.5"
    >
      <a
        href={INSTAGRAM_REDIRECT_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow Reels Brozz on Instagram @reelbrozz"
        className="flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] hover:brightness-110 text-white rounded-full shadow-lg shadow-black/50 hover:scale-105 active:scale-95 transition-all duration-150 group border border-pink-300/30"
      >
        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          <Instagram className="w-5 h-5 text-white" />
        </div>
        <span className="hidden sm:inline text-xs font-bold tracking-wide pr-1">
          Instagram
        </span>
      </a>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat on WhatsApp with Reels Brozz at ${displayPhone}`}
        className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg shadow-black/50 hover:scale-105 active:scale-95 transition-all duration-150 group border border-emerald-400/30"
      >
        <div className="w-5 h-5 flex items-center justify-center shrink-0">
          <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
        </div>
        <span className="hidden sm:inline text-xs font-bold tracking-wide pr-1">
          WhatsApp
        </span>
      </a>
    </aside>
  );
};
