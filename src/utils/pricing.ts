/**
 * Pricing and Earnings Calculation Engine for Reels Brozz
 */

export interface PackageConfig {
  id: string;
  name: string;
  basePrice: number;
  durationMinutes: number;
  reelsCount: number;
  resolution: string;
  deliveryTimeMinutes: number;
  isPopular?: boolean;
}

export interface BookingAddons {
  drone4K?: boolean;
  expressMultiAngle?: boolean;
  extraReelsCount?: number;
}

export interface PriceBreakdown {
  basePrice: number;
  addonsTotal: number;
  subtotal: number;
  discountAmount: number;
  discountCodeApplied: string | null;
  taxAmount: number; // 18% GST in India
  totalPrice: number;
}

export const PACKAGES: Record<string, PackageConfig> = {
  'quick-reel': {
    id: 'quick-reel',
    name: 'Quick Reel',
    basePrice: 1500,
    durationMinutes: 60,
    reelsCount: 1,
    resolution: '4K (30/60 fps)',
    deliveryTimeMinutes: 10,
  },
  'half-day': {
    id: 'half-day',
    name: 'Half Day Shoot',
    basePrice: 3999,
    durationMinutes: 180,
    reelsCount: 3,
    resolution: '4K (30/60 fps)',
    deliveryTimeMinutes: 10,
    isPopular: true,
  },
  'wedding-basic': {
    id: 'wedding-basic',
    name: 'Wedding & Sangeet Express',
    basePrice: 7999,
    durationMinutes: 240,
    reelsCount: 5,
    resolution: '4K (30/60 fps)',
    deliveryTimeMinutes: 15,
  },
  'wedding-luxe': {
    id: 'wedding-luxe',
    name: 'Wedding Luxe VIP',
    basePrice: 19999,
    durationMinutes: 480,
    reelsCount: 12,
    resolution: '4K (60 fps HDR)',
    deliveryTimeMinutes: 15,
  },
  'business-growth': {
    id: 'business-growth',
    name: 'Brand & Cafe Monthly',
    basePrice: 9999,
    durationMinutes: 300,
    reelsCount: 8,
    resolution: '4K (30/60 fps)',
    deliveryTimeMinutes: 10,
  },
};

export const ADDON_PRICES = {
  drone4K: 1999,
  expressMultiAngle: 999,
  extraReelPrice: 800,
};

export const PROMO_CODES: Record<string, { type: 'fixed' | 'percent'; value: number }> = {
  FIRSTBROZZ: { type: 'fixed', value: 300 },
  REEL10: { type: 'percent', value: 10 },
  CREATORLOVE: { type: 'fixed', value: 500 },
};

export function calculateBookingPrice(
  packageId: string,
  addons: BookingAddons = {},
  promoCode?: string,
  customPackages?: Array<{ id: string; basePrice: number; name?: string }>,
  customPromos?: Array<{ code: string; type: 'fixed' | 'percent'; value: number; active?: boolean }>
): PriceBreakdown {
  let basePrice = 1500;
  if (customPackages && customPackages.length > 0) {
    const found = customPackages.find((p) => p.id === packageId);
    if (found) {
      basePrice = found.basePrice;
    } else {
      const fallback = PACKAGES[packageId] || PACKAGES['quick-reel'];
      basePrice = fallback.basePrice;
    }
  } else {
    const pkg = PACKAGES[packageId] || PACKAGES['quick-reel'];
    basePrice = pkg.basePrice;
  }

  let addonsTotal = 0;
  if (addons.drone4K) addonsTotal += ADDON_PRICES.drone4K;
  if (addons.expressMultiAngle) addonsTotal += ADDON_PRICES.expressMultiAngle;
  if (addons.extraReelsCount && addons.extraReelsCount > 0) {
    addonsTotal += addons.extraReelsCount * ADDON_PRICES.extraReelPrice;
  }

  const subtotal = basePrice + addonsTotal;

  let discountAmount = 0;
  let validCode: string | null = null;

  if (promoCode) {
    const cleanCode = promoCode.trim().toUpperCase();
    if (customPromos && customPromos.length > 0) {
      const promo = customPromos.find((p) => p.code.toUpperCase() === cleanCode && p.active !== false);
      if (promo) {
        validCode = promo.code;
        if (promo.type === 'fixed') {
          discountAmount = Math.min(promo.value, subtotal);
        } else if (promo.type === 'percent') {
          discountAmount = Math.round((subtotal * promo.value) / 100);
        }
      }
    } else {
      const rule = PROMO_CODES[cleanCode];
      if (rule) {
        validCode = cleanCode;
        if (rule.type === 'fixed') {
          discountAmount = Math.min(rule.value, subtotal);
        } else if (rule.type === 'percent') {
          discountAmount = Math.round((subtotal * rule.value) / 100);
        }
      }
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  // 18% GST (India service tax standard)
  const taxAmount = Math.round(discountedSubtotal * 0.18);
  const totalPrice = discountedSubtotal + taxAmount;

  return {
    basePrice,
    addonsTotal,
    subtotal,
    discountAmount,
    discountCodeApplied: validCode,
    taxAmount,
    totalPrice,
  };
}

export function calculateCreatorEarnings(
  reelsPerWeek: number,
  tier: 'beginner' | 'pro' | 'master' = 'pro'
): {
  monthlyIncome: number;
  creatorSharePercent: number;
  bonusAmount: number;
} {
  const validReels = Math.max(1, Math.min(100, reelsPerWeek));
  
  // Reels Brozz creator-first model: 75% to 85% revenue share
  let sharePercent = 75;
  if (tier === 'pro') sharePercent = 80;
  if (tier === 'master') sharePercent = 85;

  const avgReelBooking = 1800; // avg across quick & multi-reel gigs
  const monthlyReels = validReels * 4;
  const baseEarnings = Math.round(monthlyReels * avgReelBooking * (sharePercent / 100));

  // 4K 60fps equipment & 10-min speed bonus
  const bonusAmount = monthlyReels >= 20 ? 4000 : monthlyReels >= 10 ? 2000 : 500;
  const monthlyIncome = baseEarnings + bonusAmount;

  return {
    monthlyIncome,
    creatorSharePercent: sharePercent,
    bonusAmount,
  };
}
