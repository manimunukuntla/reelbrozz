import React, { useState, useEffect } from 'react';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SocialProof } from './components/SocialProof';
import { HowItWorks } from './components/HowItWorks';
import { KeyFeatures } from './components/KeyFeatures';
import { PackagesSection } from './components/PackagesSection';
import { WhyUs } from './components/WhyUs';
import { ReelShowcase } from './components/ReelShowcase';
import { CitiesSection } from './components/CitiesSection';
import { BecomeCreator } from './components/BecomeCreator';
import { Testimonials } from './components/Testimonials';
import { FAQSection } from './components/FAQSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { CreatorApplicationModal } from './components/CreatorApplicationModal';
import { FloatingCTAs } from './components/FloatingCTAs';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Language } from './utils/i18n';
import { BookingAddons } from './utils/pricing';
import { ReelItem, loadReelsFromStorage, saveReelsToStorage } from './utils/workStore';
import { 
  ClientBooking, 
  loadBookingsFromStorage, 
  saveBookingsToStorage 
} from './utils/bookingStore';
import { 
  DynamicPackage, 
  PromoOffer, 
  loadPackagesFromStorage, 
  savePackagesToStorage, 
  loadPromosFromStorage, 
  savePromosToStorage 
} from './utils/packageStore';
import { 
  SiteConfig, 
  loadSiteConfig, 
  saveSiteConfig 
} from './utils/siteConfigStore';
import { isAdminAuthenticated, setAdminAuthenticated, logoutAdmin } from './utils/auth';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  
  // Hidden & Password-protected Admin States (mani@7)
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isAdminAuthenticated());

  // Dynamic portfolio reels & videos store
  const [reels, setReels] = useState<ReelItem[]>(() => loadReelsFromStorage());

  // Dynamic client shoot bookings store
  const [bookings, setBookings] = useState<ClientBooking[]>(() => loadBookingsFromStorage());

  // Dynamic packages & pricing store
  const [packages, setPackages] = useState<DynamicPackage[]>(() => loadPackagesFromStorage());

  // Dynamic promo discounts & offers store
  const [promos, setPromos] = useState<PromoOffer[]>(() => loadPromosFromStorage());

  // Dynamic site settings & announcement banner store
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => loadSiteConfig());

  // Package prefill state for booking modal
  const [selectedPackageId, setSelectedPackageId] = useState<string>('half-day');
  const [selectedAddons, setSelectedAddons] = useState<BookingAddons>({});
  const [appliedPromo, setAppliedPromo] = useState<string>('FIRSTBROZZ');

  // Trigger admin access: if already authenticated, open admin; else show password prompt (mani@7)
  const handleOpenAdminTrigger = () => {
    if (isAuthenticated || isAdminAuthenticated()) {
      setIsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Check URL query (?admin=true or #admin) or keyboard shortcut (Ctrl+Shift+A) for admin access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || window.location.hash === '#admin') {
        handleOpenAdminTrigger();
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        // Secret shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
          e.preventDefault();
          handleOpenAdminTrigger();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isAuthenticated]);

  const handleOpenBooking = (
    pkgId: string = 'half-day',
    addons: BookingAddons = {},
    promo: string = 'FIRSTBROZZ'
  ) => {
    setSelectedPackageId(pkgId);
    setSelectedAddons(addons);
    setAppliedPromo(promo);
    setIsBookingModalOpen(true);
  };

  const scrollToPackages = () => {
    const el = document.getElementById('packages');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCityForBooking = (cityName: string) => {
    handleOpenBooking(selectedPackageId, selectedAddons, appliedPromo);
  };

  const handleUpdateReels = (updated: ReelItem[]) => {
    setReels(updated);
    saveReelsToStorage(updated);
  };

  const handleUpdateBookings = (updated: ClientBooking[]) => {
    setBookings(updated);
    saveBookingsToStorage(updated);
  };

  const handleUpdatePackages = (updated: DynamicPackage[]) => {
    setPackages(updated);
    savePackagesToStorage(updated);
  };

  const handleUpdatePromos = (updated: PromoOffer[]) => {
    setPromos(updated);
    savePromosToStorage(updated);
  };

  const handleUpdateSiteConfig = (updated: SiteConfig) => {
    setSiteConfig(updated);
    saveSiteConfig(updated);
  };

  const handleNewBookingCreated = (newBooking: ClientBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleLoginSuccess = () => {
    setAdminAuthenticated(true);
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    setIsAdminOpen(true);
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setIsAdminOpen(false);
  };

  // If Admin Panel is open and authenticated, render the full-screen Admin Studio view
  if (isAdminOpen && isAuthenticated) {
    return (
      <AdminPanel
        reels={reels}
        bookings={bookings}
        packages={packages}
        promos={promos}
        siteConfig={siteConfig}
        onUpdateReels={handleUpdateReels}
        onUpdateBookings={handleUpdateBookings}
        onUpdatePackages={handleUpdatePackages}
        onUpdatePromos={handleUpdatePromos}
        onUpdateSiteConfig={handleUpdateSiteConfig}
        onClose={() => setIsAdminOpen(false)}
        onLogout={handleAdminLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans selection:bg-[#ff2d2d] selection:text-white">
      {/* Top Promotional Announcement Offer Banner */}
      <AnnouncementBanner
        config={siteConfig}
        onApplyPromo={(code) => setAppliedPromo(code)}
      />

      {/* Top Navigation Bar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenBooking={() => handleOpenBooking()}
        onOpenCreatorModal={() => setIsCreatorModalOpen(true)}
        onOpenAdmin={handleOpenAdminTrigger}
        config={siteConfig}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          currentLang={currentLang}
          onOpenBooking={() => handleOpenBooking()}
          onScrollToPackages={scrollToPackages}
        />

        {/* 2. Social Proof & Media Mentions */}
        <SocialProof />

        {/* 3. How It Works (4-Step Flow) */}
        <HowItWorks
          currentLang={currentLang}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 4. Key Differentiators / Bento Grid */}
        <KeyFeatures />

        {/* 5. Packages & Pricing Customizer (Dynamic from Admin Panel) */}
        <PackagesSection
          packages={packages}
          promos={promos}
          onSelectPackage={(pkgId, addons, promo) => handleOpenBooking(pkgId, addons, promo)}
        />

        {/* 6. Why Reels Brozz (Comparison Table) */}
        <WhyUs />

        {/* 7. Interactive Reel Showcase & Player (Dynamic from workStore) */}
        <ReelShowcase
          reels={reels}
        />

        {/* 8. Pan-India Cities Coverage */}
        <CitiesSection
          onSelectCity={handleSelectCityForBooking}
        />

        {/* 9. Become a Creator & Earnings Calculator */}
        <BecomeCreator
          onOpenCreatorModal={() => setIsCreatorModalOpen(true)}
        />

        {/* 10. Authentic Customer & Creator Testimonials */}
        <Testimonials />

        {/* 11. Frequently Asked Questions */}
        <FAQSection />

        {/* 12. Final CTA & App Download */}
        <FinalCTA
          onOpenBooking={() => handleOpenBooking()}
        />
      </main>

      {/* Footer with Instagram @reelbrozz & lock for staff */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenCreatorModal={() => setIsCreatorModalOpen(true)}
        onOpenAdmin={handleOpenAdminTrigger}
        config={siteConfig}
      />

      {/* Floating CTAs: WhatsApp Pill (+91 63057 29387) & Mobile Sticky Bar */}
      <FloatingCTAs
        onOpenBooking={() => handleOpenBooking()}
        config={siteConfig}
      />

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialPackageId={selectedPackageId}
        initialAddons={selectedAddons}
        initialPromoCode={appliedPromo}
        packages={packages}
        promos={promos}
        onNewBookingCreated={handleNewBookingCreated}
      />

      {/* Interactive Creator Onboarding Application Modal */}
      <CreatorApplicationModal
        isOpen={isCreatorModalOpen}
        onClose={() => setIsCreatorModalOpen(false)}
      />

      {/* Protected Admin Password Modal (mani@7) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
