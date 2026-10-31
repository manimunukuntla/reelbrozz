/**
 * Dynamic Site Configuration & Announcement Store for Reels Brozz
 * Allows the admin to update WhatsApp, phone, Instagram, and top promotional banner.
 */

export interface SiteConfig {
  brandName: string;
  tagline: string;
  rawWhatsAppNumber: string; // e.g. 916305729387
  displayPhone: string;      // e.g. +91 63057 29387
  supportEmail: string;
  instagramUrl: string;
  instagramHandle: string;
  banner: {
    enabled: boolean;
    badge: string;
    text: string;
    couponCode?: string;
  };
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: 'Reels Brozz',
  tagline: 'Reels in 10 Minutes',
  rawWhatsAppNumber: '916305729387',
  displayPhone: '+91 63057 29387',
  supportEmail: 'support@reelsbrozz.in',
  instagramUrl: 'https://www.instagram.com/reelbrozz?utm_source=ig_web_button_share_sheet&rpxt=ZDNlZDc0MzIxNw==',
  instagramHandle: '@reelbrozz',
  banner: {
    enabled: true,
    badge: 'FLASH LAUNCH OFFER',
    text: '⚡ Instant ₹500 OFF on your first 4K Reel! Use promo code FIRSTBROZZ on checkout.',
    couponCode: 'FIRSTBROZZ',
  },
};

const STORAGE_KEY = 'reelsbrozz_site_config';

export function loadSiteConfig(): SiteConfig {
  if (typeof window === 'undefined') {
    return DEFAULT_SITE_CONFIG;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SITE_CONFIG,
      ...parsed,
      banner: {
        ...DEFAULT_SITE_CONFIG.banner,
        ...(parsed.banner || {}),
      },
    };
  } catch (err) {
    console.error('Error reading site config from storage:', err);
    return DEFAULT_SITE_CONFIG;
  }
}

export function saveSiteConfig(config: SiteConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving site config:', err);
  }
}

export function getWhatsAppUrl(phoneOrRaw: string, message: string = 'Hi Reels Brozz! I want to book a shoot.'): string {
  const cleanPhone = phoneOrRaw.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
