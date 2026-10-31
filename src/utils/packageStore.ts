/**
 * Dynamic Packages & Offers Management Store for Reels Brozz
 * Allows the admin to edit pricing, packages, descriptions, and promo discounts in real-time.
 */

export interface DynamicPackage {
  id: string;
  name: string;
  basePrice: number;
  durationMinutes: number;
  reelsCount: number;
  resolution: string;
  deliveryTimeMinutes: number;
  isPopular?: boolean;
  description: string;
  features: string[];
  active: boolean;
}

export interface PromoOffer {
  code: string;
  type: 'fixed' | 'percent';
  value: number; // e.g. 500 for ₹500 off, or 10 for 10%
  description: string;
  active: boolean;
}

export const DEFAULT_PACKAGES: DynamicPackage[] = [
  {
    id: 'quick-reel',
    name: 'Quick Reel',
    basePrice: 1500,
    durationMinutes: 60,
    reelsCount: 1,
    resolution: '4K (30/60 fps)',
    deliveryTimeMinutes: 10,
    isPopular: false,
    description: 'Perfect for cafe dishes, OOTD fits, gym PRs, or quick promotional drops.',
    features: [
      '1 Post-Ready 4K Reel in 10 mins',
      'AI-assisted color grading & audio sync',
      'Trending Instagram audio included',
      'Full raw footage handoff on phone',
    ],
    active: true,
  },
  {
    id: 'half-day',
    name: 'Half Day Shoot',
    basePrice: 3999,
    durationMinutes: 180,
    reelsCount: 3,
    resolution: '4K (30/60 fps)',
    deliveryTimeMinutes: 10,
    isPopular: true,
    description: 'Most popular choice for restaurants, multi-outfit creators, and mini events.',
    features: [
      '3 Post-Ready 4K Reels delivered on-site',
      'Gimbal stabilized dynamic motion shots',
      'Voiceover / mic lapel recording included',
      'Multi-language captions (Hindi/English/Regional)',
      '10-Minute post-shoot turnaround',
    ],
    active: true,
  },
  {
    id: 'wedding-basic',
    name: 'Wedding & Sangeet Express',
    basePrice: 7999,
    durationMinutes: 240,
    reelsCount: 5,
    resolution: '4K (30/60 fps)',
    deliveryTimeMinutes: 15,
    isPopular: false,
    description: 'Live viral reels from your Haldi, Mehendi, or Sangeet delivered same night.',
    features: [
      '5 Cinematic 4K Wedding Reels',
      'Candid bride & groom portraits',
      'Guest dance performances sync cut',
      'Delivered in 15 mins for immediate Instagram posting',
    ],
    active: true,
  },
  {
    id: 'business-growth',
    name: 'Brand & Business Monthly',
    basePrice: 9999,
    durationMinutes: 300,
    reelsCount: 8,
    resolution: '4K (30/60 fps)',
    deliveryTimeMinutes: 10,
    isPopular: false,
    description: 'Designed for clinics, real estate tours, SaaS offices, and fashion brands.',
    features: [
      '8 Commercial Grade 4K Reels',
      'Full script & hook consultation',
      'Dedicated creator assigned',
      'Thumbnails & viral hook text included',
    ],
    active: true,
  },
  {
    id: 'wedding-luxe',
    name: 'Wedding Luxe VIP + Drone',
    basePrice: 19999,
    durationMinutes: 480,
    reelsCount: 12,
    resolution: '4K (60 fps HDR)',
    deliveryTimeMinutes: 15,
    isPopular: false,
    description: 'All-day VIP coverage with dual camera crew and 4K aerial drone coverage.',
    features: [
      '12 Master 4K HDR Reels delivered same night',
      '4K Aerial Drone footage included',
      'Dual creator team (A-Roll + B-Roll)',
      'VIP Priority rapid editing pipeline',
    ],
    active: true,
  },
];

export const DEFAULT_PROMOS: PromoOffer[] = [
  { code: 'FIRSTBROZZ', type: 'fixed', value: 500, description: '₹500 off on first booking', active: true },
  { code: 'FESTIVAL500', type: 'fixed', value: 500, description: 'Festival special ₹500 discount', active: true },
  { code: 'REEL10', type: 'percent', value: 10, description: '10% off on all packages', active: true },
  { code: 'CREATORLOVE', type: 'fixed', value: 300, description: '₹300 creator referral credit', active: true },
];

const PACKAGES_STORAGE_KEY = 'reelsbrozz_packages';
const PROMOS_STORAGE_KEY = 'reelsbrozz_promos';

export function loadPackagesFromStorage(): DynamicPackage[] {
  if (typeof window === 'undefined') return DEFAULT_PACKAGES;
  try {
    const raw = localStorage.getItem(PACKAGES_STORAGE_KEY);
    if (!raw) return DEFAULT_PACKAGES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_PACKAGES;
  } catch {
    return DEFAULT_PACKAGES;
  }
}

export function savePackagesToStorage(packages: DynamicPackage[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packages));
  } catch (err) {
    console.error('Error saving packages:', err);
  }
}

export function loadPromosFromStorage(): PromoOffer[] {
  if (typeof window === 'undefined') return DEFAULT_PROMOS;
  try {
    const raw = localStorage.getItem(PROMOS_STORAGE_KEY);
    if (!raw) return DEFAULT_PROMOS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_PROMOS;
  } catch {
    return DEFAULT_PROMOS;
  }
}

export function savePromosToStorage(promos: PromoOffer[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROMOS_STORAGE_KEY, JSON.stringify(promos));
  } catch (err) {
    console.error('Error saving promos:', err);
  }
}
