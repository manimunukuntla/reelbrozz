import React, { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
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
    <div className="relative bg-zinc-950/95 border-b border-white/[0.06] text-white py-2 sm:py-1.5 px-3 sm:px-4 flex items-center justify-between gap-2 z-40 backdrop-blur-md">
      <div className="flex-1 min-w-0 flex flex-wrap sm:flex-nowrap items-center justify-center gap-x-2 gap-y-1 sm:gap-3 text-center">
        {config.banner.badge && (
          <span className="px-2 py-0.5 rounded-full bg-[#ff2d2d] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shrink-0">
            {config.banner.badge}
          </span>
        )}
        <span className="font-medium text-zinc-300 text-[11px] sm:text-xs leading-snug sm:truncate max-w-full sm:max-w-xl">
          {config.banner.text}
        </span>
        {config.banner.couponCode && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-zinc-200 hover:text-white font-mono text-[10px] sm:text-[11px] font-semibold cursor-pointer transition-colors shrink-0"
            title="Click to copy coupon code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <span>Code: {config.banner.couponCode}</span>
            )}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 transition-colors shrink-0 cursor-pointer"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
