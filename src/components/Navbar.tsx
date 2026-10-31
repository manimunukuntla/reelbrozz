import React, { useState } from 'react';
import { Sparkles, Globe, Menu, X, ArrowRight, Zap, Instagram, Lock } from 'lucide-react';
import { LANGUAGES, Language, TRANSLATIONS } from '../utils/i18n';
import { PLATFORM_CONFIG } from '../utils/constants';
import { SiteConfig } from '../utils/siteConfigStore';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenBooking: () => void;
  onOpenCreatorModal: () => void;
  onOpenAdmin: () => void;
  config?: SiteConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  onOpenBooking,
  onOpenCreatorModal,
  onOpenAdmin,
  config,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const t = TRANSLATIONS[currentLang];
  const instagramUrl = config?.instagramUrl || PLATFORM_CONFIG.instagramUrl;
  const instagramHandle = config?.instagramHandle || PLATFORM_CONFIG.instagramHandle;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#09090b]/85 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="/"
            className="flex items-center gap-2.5 text-xl sm:text-2xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2d2d]"
          >
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#ff2d2d] to-[#b91c1c] flex items-center justify-center text-white shadow-lg shadow-[#ff2d2d]/30 group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-5 h-5 fill-white" />
            </span>
            <span className="font-display">
              REELS<span className="text-[#ff2d2d]">BROZZ</span>
            </span>
          </a>

          {/* Zone 2: Navigation Links (single-line, clean unboxed typography) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300">
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {t.howItWorks}
            </a>
            <a
              href="#features"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {t.features}
            </a>
            <a
              href="#packages"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {t.packages}
            </a>
            <a
              href="#why-us"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {t.whyReelsBrozz}
            </a>
            <a
              href="#creators"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {t.becomeCreator}
            </a>
            <a
              href="#faq"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              FAQ
            </a>
          </nav>

          {/* Zone 3: Language Selector & Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-lg border border-white/[0.08] transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2d2d]"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span>{LANGUAGES.find((l) => l.code === currentLang)?.nativeName}</span>
              </button>

              {langMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-36 py-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl shadow-black/60 z-50 animate-in fade-in zoom-in-95 duration-150"
                  role="menu"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors ${
                        currentLang === lang.code
                          ? 'text-[#ff2d2d] bg-white/[0.06]'
                          : 'text-zinc-300 hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-zinc-500 uppercase">{lang.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Official Instagram Icon Link */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-lg border border-white/[0.08] transition-colors whitespace-nowrap shrink-0 group"
              title="Follow Reels Brozz on Instagram"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
              <span className="hidden xl:inline text-[11px] font-mono">{instagramHandle}</span>
            </a>

            {/* Discreet Admin Login Button */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="p-2 text-zinc-400 hover:text-white rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors cursor-pointer"
              title="Admin Panel Login (mani@7)"
              aria-label="Admin Portal"
            >
              <Lock className="w-4 h-4 text-amber-400" />
            </button>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={onOpenBooking}
              className="hidden sm:inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#ff2d2d] hover:bg-[#e02424] active:scale-95 rounded-lg shadow-lg shadow-[#ff2d2d]/25 transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>{t.bookCreator}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2d2d]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 border-b border-white/[0.08] px-4 pt-3 pb-6 space-y-3 backdrop-blur-2xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2 text-base font-medium text-zinc-300">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/[0.06] hover:text-white"
            >
              {t.howItWorks}
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/[0.06] hover:text-white"
            >
              {t.features}
            </a>
            <a
              href="#packages"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/[0.06] hover:text-white"
            >
              {t.packages}
            </a>
            <a
              href="#why-us"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/[0.06] hover:text-white"
            >
              {t.whyReelsBrozz}
            </a>
            <a
              href="#creators"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/[0.06] hover:text-white"
            >
              {t.becomeCreator}
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/[0.06] hover:text-white"
            >
              FAQ
            </a>
            <a
              href={PLATFORM_CONFIG.instagramUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/[0.06] text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-2"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow @reelbrozz on Instagram</span>
            </a>
          </nav>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-center font-bold text-white bg-[#ff2d2d] rounded-lg shadow-md hover:bg-[#e02424]"
            >
              <span>{t.bookCreator}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCreatorModal();
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-zinc-300 hover:text-white bg-white/[0.05] rounded-lg border border-white/[0.08]"
            >
              {t.becomeCreator} (Earn 80%)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
