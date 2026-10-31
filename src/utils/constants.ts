/**
 * Central platform constants for Reels Brozz
 */

export const PLATFORM_CONFIG = {
  brandName: 'Reels Brozz',
  tagline: 'Reels in 10 Minutes',
  supportPhone: '+91 63057 29387',
  rawWhatsAppNumber: '916305729387',
  displayPhone: '+91 63057 29387',
  supportEmail: 'support@reelsbrozz.in',
  instagramUrl: 'https://www.instagram.com/reelbrozz?utm_source=ig_web_button_share_sheet&rpxt=ZDNlZDc0MzIxNw==',
  instagramHandle: '@reelbrozz',
  startingPrice: 1500,
  adminPassword: 'mani@7',
};

export function getWhatsAppLink(customMessage?: string): string {
  const message = customMessage || 'Hi Reels Brozz! I want to book a 10-minute reel creator.';
  return `https://wa.me/${PLATFORM_CONFIG.rawWhatsAppNumber}?text=${encodeURIComponent(message)}`;
}
