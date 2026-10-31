/**
 * Work and Video Management Store for Reels Brozz
 */

export interface ReelItem {
  id: string;
  category: string; // 'food' | 'weddings' | 'fashion' | 'fitness' | 'products' | 'drone'
  title: string;
  client: string;
  city: string;
  device: string;
  turnaroundMinutes: number;
  views: string;
  reachMultiplier: string;
  audio: string;
  gradient: string;
  tags: string[];
  videoUrl?: string; // Optional direct video URL or MP4/WebM
  aspectRatio?: '9:16' | '16:9';
  featured?: boolean;
  hidden?: boolean;
  createdAt: number;
}

export const INITIAL_REELS: ReelItem[] = [
  {
    id: 'r1',
    category: 'food',
    title: 'Molten Belgian Chocolate Lava Sizzle',
    client: 'Cafe Mocha Roast',
    city: 'Indiranagar, Bengaluru',
    device: 'Samsung S24 Ultra (4K 60fps)',
    turnaroundMinutes: 8,
    views: '540K',
    reachMultiplier: '+380% Footfall',
    audio: 'Lo-Fi Chill Hop · Trending Cut',
    gradient: 'from-amber-950 via-zinc-950 to-black',
    tags: ['#FoodPorn', '#CafeVibes', '#ReelsBrozz'],
    featured: true,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'r2',
    category: 'weddings',
    title: 'Haldi Colors Slow-Mo Splash',
    client: 'Priya & Arjun Wedding',
    city: 'Aerocity, New Delhi',
    device: 'iPhone 16 Pro (4K 60fps HDR)',
    turnaroundMinutes: 10,
    views: '1.2M',
    reachMultiplier: '52K Shares',
    audio: 'Trending Sangeet Dhol AI Master',
    gradient: 'from-yellow-950 via-zinc-950 to-black',
    tags: ['#HaldiCeremony', '#BigFatIndianWedding', '#Candid'],
    featured: true,
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'r3',
    category: 'fashion',
    title: 'Oversized Streetwear Autumn Drop',
    client: 'UrbanDrift Apparel',
    city: 'Bandra, Mumbai',
    device: 'OnePlus 12 4K 60fps + Gimbal',
    turnaroundMinutes: 9,
    views: '390K',
    reachMultiplier: '+240% Web Orders',
    audio: 'Metro Boomin Synth Wave',
    gradient: 'from-purple-950 via-zinc-950 to-black',
    tags: ['#StreetwearIndia', '#OOTD', '#DropDay'],
    featured: false,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'r4',
    category: 'fitness',
    title: '220kg Sumo Deadlift & Chalk Burst',
    client: 'Alpha Strength Lab',
    city: 'Jubilee Hills, Hyderabad',
    device: 'Google Pixel 8 Pro (4K 30fps Cinematic)',
    turnaroundMinutes: 7,
    views: '780K',
    reachMultiplier: '+45 Gym Signups',
    audio: 'Hardstyle Phonk Boost',
    gradient: 'from-red-950 via-zinc-950 to-black',
    tags: ['#GymTok', '#Powerlifting', '#FitnessGoals'],
    featured: true,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'r5',
    category: 'products',
    title: 'Minimalist Titanium Mechanical Keyboard',
    client: 'NovaKey Studios',
    city: 'Koramangala, Bengaluru',
    device: 'iPhone 15 Pro Max (Macro 4K)',
    turnaroundMinutes: 10,
    views: '410K',
    reachMultiplier: 'Sold Out Batch in 2h',
    audio: 'ASMR Crisp Keystroke Audio',
    gradient: 'from-cyan-950 via-zinc-950 to-black',
    tags: ['#MechanicalKeyboard', '#DeskSetup', '#ASMR'],
    featured: false,
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'r6',
    category: 'food',
    title: 'Woodfired Neapolitan Burrata Pizza Pull',
    client: 'Luigi Osteria',
    city: 'Koregaon Park, Pune',
    device: 'Xiaomi 14 Ultra (Leica 4K)',
    turnaroundMinutes: 8,
    views: '620K',
    reachMultiplier: 'Weekend Fully Booked',
    audio: 'Italian Accordion Hip-Hop Remix',
    gradient: 'from-rose-950 via-zinc-950 to-black',
    tags: ['#PizzaPull', '#PuneFoodie', '#ItalianEats'],
    featured: true,
    createdAt: Date.now(),
  },
];

const STORAGE_KEY = 'reelsbrozz_portfolio_work';

export function loadReelsFromStorage(): ReelItem[] {
  if (typeof window === 'undefined') {
    return INITIAL_REELS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_REELS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_REELS;
  } catch (err) {
    console.error('Error reading reels from storage:', err);
    return INITIAL_REELS;
  }
}

export function saveReelsToStorage(reels: ReelItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reels));
  } catch (err) {
    console.error('Error saving reels to storage:', err);
  }
}

export function addReel(newReel: Omit<ReelItem, 'id' | 'createdAt'>, existingReels: ReelItem[]): ReelItem[] {
  const item: ReelItem = {
    ...newReel,
    id: `r_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    createdAt: Date.now(),
  };
  const updated = [item, ...existingReels];
  saveReelsToStorage(updated);
  return updated;
}

export function updateReel(id: string, updates: Partial<ReelItem>, existingReels: ReelItem[]): ReelItem[] {
  const updated = existingReels.map((r) => (r.id === id ? { ...r, ...updates } : r));
  saveReelsToStorage(updated);
  return updated;
}

export function deleteReel(id: string, existingReels: ReelItem[]): ReelItem[] {
  const updated = existingReels.filter((r) => r.id !== id);
  saveReelsToStorage(updated);
  return updated;
}

export function toggleReelVisibility(id: string, existingReels: ReelItem[]): ReelItem[] {
  const updated = existingReels.map((r) => (r.id === id ? { ...r, hidden: !r.hidden } : r));
  saveReelsToStorage(updated);
  return updated;
}

export function moveReel(id: string, direction: 'up' | 'down', existingReels: ReelItem[]): ReelItem[] {
  const index = existingReels.findIndex((r) => r.id === id);
  if (index === -1) return existingReels;
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= existingReels.length) return existingReels;

  const copy = [...existingReels];
  const [removed] = copy.splice(index, 1);
  copy.splice(targetIndex, 0, removed);
  saveReelsToStorage(copy);
  return copy;
}

export function resetReelsToDefault(): ReelItem[] {
  saveReelsToStorage(INITIAL_REELS);
  return INITIAL_REELS;
}

