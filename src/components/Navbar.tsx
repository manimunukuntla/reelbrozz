import React, { useState } from 'react';
import { Globe, Menu, X, ArrowRight, Zap, Lock } from 'lucide-react';
import { LANGUAGES, Language, TRANSLATIONS } from '../utils/i18n';
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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#09090b]/90 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-6 h-16 sm:h-18">
          {/* Brand Wordmark */}
          <a
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 text-lg sm:text-2xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 focus:outline-none"
          >
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#ff2d2d] flex items-center justify-center text-white shadow-md shadow-[#ff2d2d]/30 shrink-0">
              <Zap className="w-4 h-4 fill-white" />
            </span>
            <span className="font-display">
              REELS<span className="text-[#ff2d2d]">BROZZ</span>
            </span>
          </a>

          {/* Navigation Links - Clean, unboxed typography */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium text-zinc-300">
            <a href="#how-it-works" className="hover:text-white transition-colors whitespace-nowrap">
              {t.howItWorks}
            </a>
            <a href="#features" className="hover:text-white transition-colors whitespace-nowrap">
              {t.features}
            </a>
            <a href="#packages" className="hover:text-white transition-colors whitespace-nowrap">
              {t.packages}
            </a>
            <a href="#why-us" className="hover:text-white transition-colors whitespace-nowrap">
              {t.whyReelsBrozz}
            </a>
            <a href="#creators" className="hover:text-white transition-colors whitespace-nowrap">
              {t.becomeCreator}
            </a>
            <a href="#faq" className="hover:text-white transition-colors whitespace-nowrap">
              FAQ
            </a>
          </nav>

          {/* Action Zone: Language + Staff Lock + Primary CTA */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Subtle Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-2 sm:py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span className="max-w-[54px] sm:max-w-none truncate">{LANGUAGES.find((l) => l.code === currentLang)?.nativeName}</span>
              </button>

              {langMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-32 py-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl shadow-black/70 z-50 animate-in fade-in zoom-in-95 duration-100"
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
                      className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between transition-colors ${
                        currentLang === lang.code
                          ? 'text-[#ff2d2d] bg-white/[0.05]'
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

            {/* Subtle Admin Lock */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="p-2 text-zinc-500 hover:text-zinc-300 rounded-lg transition-colors cursor-pointer"
              title="Admin Portal (mani@7)"
              aria-label="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>

            {/* Primary CTA */}
            <button
              type="button"
              onClick={onOpenBooking}
              className="hidden sm:inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-[#ff2d2d] hover:bg-[#e02424] active:scale-95 rounded-lg shadow-md shadow-[#ff2d2d]/25 transition-all duration-150 whitespace-nowrap cursor-pointer"
            >
              <span>{t.bookCreator}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950/98 border-b border-white/[0.08] px-4 pt-3 pb-6 space-y-3 backdrop-blur-2xl shadow-2xl">
          <nav className="flex flex-col space-y-1 text-sm font-medium text-zinc-300">
            <a
              href="#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-white/[0.05] hover:text-white transition-colors"
            >
              Portfolio Reels
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-white/[0.05] hover:text-white transition-colors"
            >
              {t.howItWorks}
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-white/[0.05] hover:text-white transition-colors"
            >
              {t.features}
            </a>
            <a
              href="#packages"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-white/[0.05] hover:text-white transition-colors"
            >
              {t.packages}
            </a>
            <a
              href="#why-us"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-white/[0.05] hover:text-white transition-colors"
            >
              {t.whyReelsBrozz}
            </a>
            <a
              href="#creators"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-white/[0.05] hover:text-white transition-colors"
            >
              {t.becomeCreator}
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-white/[0.05] hover:text-white transition-colors"
            >
              FAQ
            </a>
          </nav>

          <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 text-sm font-bold text-white bg-[#ff2d2d] hover:bg-[#e02424] rounded-xl text-center shadow-lg shadow-[#ff2d2d]/25 cursor-pointer"
            >
              {t.bookCreator}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCreatorModal();
              }}
              className="w-full py-2.5 text-xs font-semibold text-zinc-300 hover:text-white bg-white/[0.04] rounded-xl text-center cursor-pointer"
            >
              Join as a Creator Partner →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
