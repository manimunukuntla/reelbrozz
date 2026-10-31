import React, { useState } from 'react';
import { Sparkles, Copy, Check, X, ArrowRight } from 'lucide-react';
import { SiteConfig } from '../utils/siteConfigStore';

interface AnnouncementBannerProps {
  config: SiteConfig;
  onApplyPromo?: (code: string) => void;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ config, onApplyPromo }) => {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!config.banner.enabled || dismissed) return null;

  const handleCopy = () => {
    if (config.banner.couponCode) {
      navigator.clipboard?.writeText(config.banner.couponCode);
      setCopied(true);
      if (onApplyPromo) onApplyPromo(config.banner.couponCode);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-red-950 via-zinc-900 to-red-950 border-b border-[#ff2d2d]/30 text-white text-xs py-2 px-3 sm:px-6 flex items-center justify-between z-40 transition-all">
      <div className="flex-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center">
        {config.banner.badge && (
          <span className="px-2 py-0.5 rounded-full bg-[#ff2d2d] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
            {config.banner.badge}
          </span>
        )}
        <span className="font-medium text-zinc-200 text-[11px] sm:text-xs">
          {config.banner.text}
        </span>
        {config.banner.couponCode && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-black/60 border border-[#ff2d2d]/50 hover:border-[#ff2d2d] text-[#ff4b4b] font-mono text-[11px] font-bold cursor-pointer transition-colors"
            title="Click to copy coupon code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>CODE: {config.banner.couponCode}</span>
              </>
            )}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="p-1 rounded text-zinc-400 hover:text-white transition-colors ml-2"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
