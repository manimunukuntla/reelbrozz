import React from 'react';
import { Zap, Heart, Lock, Instagram } from 'lucide-react';
import { PLATFORM_CONFIG } from '../utils/constants';
import { SiteConfig } from '../utils/siteConfigStore';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenCreatorModal: () => void;
  onOpenAdmin: () => void;
  config?: SiteConfig;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenCreatorModal,
  onOpenAdmin,
  config,
}) => {
  const instagramUrl = config?.instagramUrl || PLATFORM_CONFIG.instagramUrl;
  const instagramHandle = config?.instagramHandle || PLATFORM_CONFIG.instagramHandle;
  const whatsappNumber = config?.rawWhatsAppNumber || PLATFORM_CONFIG.rawWhatsAppNumber;
  const displayPhone = config?.displayPhone || PLATFORM_CONFIG.displayPhone;
  const email = config?.supportEmail || PLATFORM_CONFIG.supportEmail;
  return (
    <footer className="border-t border-white/[0.08] bg-[#070709] text-zinc-400 text-xs pt-12 pb-24 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-white/[0.06]">
          
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <a href="/" className="inline-flex items-center gap-2 text-xl font-black text-white font-display">
              <span className="w-7 h-7 rounded-md bg-[#ff2d2d] flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-white" />
              </span>
              <span>REELS<span className="text-[#ff2d2d]">BROZZ</span></span>
            </a>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              India’s fastest on-demand 4K reel delivery platform. Shoot, edit with AI, and deliver post-ready reels in 10 minutes across 20+ Indian cities.
            </p>
            <div className="text-[11px] text-zinc-500">
              A product of Reels Brozz Technologies Pvt. Ltd. · Registered in India
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#portfolio" className="hover:text-white transition-colors">Portfolio Reels</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">Key Differentiators</a>
              </li>
              <li>
                <a href="#packages" className="hover:text-white transition-colors">Pricing & Packages</a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-white transition-colors">Reels Brozz vs Agencies</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">FAQs</a>
              </li>
            </ul>
          </div>

          {/* For Creators */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              For Creators
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onOpenCreatorModal}
                  className="text-left hover:text-[#ff4b4b] transition-colors cursor-pointer"
                >
                  Become a Creator Partner
                </button>
              </li>
              <li>
                <a href="#creators" className="hover:text-white transition-colors">Earnings Calculator</a>
              </li>
              <li>
                <a href="#creators" className="hover:text-white transition-colors">Creator Ownership Model</a>
              </li>
              <li>
                <a href="#creators" className="hover:text-white transition-colors">Android & iPhone Specs</a>
              </li>
              <li>
                <a href="#creators" className="hover:text-white transition-colors">AI Edit Suite</a>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div className="col-span-2 sm:col-span-1 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Connect & Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-pink-400 hover:text-pink-300 transition-colors inline-flex items-center gap-1.5 font-medium"
                >
                  <Instagram className="w-3.5 h-3.5 shrink-0" />
                  <span>Instagram {instagramHandle}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors font-mono break-all"
                >
                  WhatsApp: {displayPhone}
                </a>
              </li>
              <li>
                <a href={`tel:${whatsappNumber}`} className="hover:text-white transition-colors">
                  Call: {displayPhone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="hover:text-white transition-colors break-all">
                  {email}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Privacy Policy & Footages SLA
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Terms of Service & 10-Min Guarantee
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & discreet hidden staff lock */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] text-zinc-500 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <span>© {new Date().getFullYear()} Reels Brozz Technologies Pvt. Ltd. All rights reserved.</span>
            {/* Hidden admin trigger for owner */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-zinc-700 hover:text-zinc-400 p-1 rounded transition-colors cursor-pointer"
              title="Staff Portal (Password Protected)"
              aria-label="Staff Portal"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <span>Built with speed & passion for India's creator economy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
