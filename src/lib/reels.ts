// lib/reels.ts
import { getStoredWebhookUrl, getStoredSheetSecret } from '../utils/bookingStore';
import { sanitizeSafeUrl, sanitizeSheetCell, parseVideoUrl } from '../utils/videoEmbed';

export type Reel = {
  id: string;
  title: string;
  thumbnail: string; // image URL or compressed data:image/*
  videoUrl?: string; // YouTube, Google Drive, Vimeo, Instagram, MP4, or idb://<id>
  views?: string;
  location?: string;
  category?: string;
  order: number;
  isActive: boolean;
  updatedAt?: number;
};

const STORAGE_KEY = 'reelsbrozz_reels';
export const REELS_UPDATED_EVENT = 'reelsbrozz:reels-updated';

export const DEFAULT_REELS: Reel[] = [
  {
    id: 'reel-1',
    title: 'Molten Belgian Chocolate Lava Sizzle',
    thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=720&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chocolate-dessert-with-ice-cream-42777-large.mp4',
    views: '540K views',
    location: 'Cafe Mocha Roast · Bengaluru',
    category: 'Food & Cafes',
    order: 1,
    isActive: true,
  },
  {
    id: 'reel-2',
    title: 'Haldi Colors Slow-Mo Splash',
    thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=720&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-traditional-wedding-ceremony-in-india-42991-large.mp4',
    views: '1.2M views',
    location: 'Aerocity · New Delhi',
    category: 'Weddings',
    order: 2,
    isActive: true,
  },
  {
    id: 'reel-3',
    title: 'Oversized Streetwear Autumn Drop',
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=720&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-colorful-streetwear-43403-large.mp4',
    views: '390K views',
    location: 'Bandra West · Mumbai',
    category: 'Fashion',
    order: 3,
    isActive: true,
  },
  {
    id: 'reel-4',
    title: '220kg Sumo Deadlift & Chalk Burst',
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=720&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-exercising-with-a-barbell-in-a-gym-42646-large.mp4',
    views: '780K views',
    location: 'Alpha Strength Lab · Hyderabad',
    category: 'Fitness',
    order: 4,
    isActive: true,
  },
  {
    id: 'reel-5',
    title: 'Woodfired Neapolitan Burrata Pizza Pull',
    thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=720&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-spreading-cheese-on-a-pizza-43034-large.mp4',
    views: '620K views',
    location: 'Luigi Osteria · Pune',
    category: 'Food & Cafes',
    order: 5,
    isActive: true,
  },
  {
    id: 'reel-6',
    title: 'Minimalist Titanium Desk Setup ASMR',
    thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=720&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-mechanical-keyboard-42981-large.mp4',
    views: '410K views',
    location: 'NovaKey Studios · Bengaluru',
    category: 'Products',
    order: 6,
    isActive: true,
  },
  {
    id: 'reel-7',
    title: '4K Sunset Rooftop Drone Flight',
    thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=720&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-sunset-41551-large.mp4',
    views: '890K views',
    location: 'SkyBar Facade · Gurgaon',
    category: 'Drone',
    order: 7,
    isActive: true,
  },
];

function notifyReelsUpdated(reels: Reel[]): void {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
    window.dispatchEvent(new CustomEvent(REELS_UPDATED_EVENT, { detail: reels }));
  }
}

export function getReels(): Reel[] {
  if (typeof window === 'undefined') return DEFAULT_REELS;
  const data = localStorage.getItem(STORAGE_KEY);
  if (data === null) {
    saveReels(DEFAULT_REELS);
    return DEFAULT_REELS;
  }
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return DEFAULT_REELS;
  } catch {
    return DEFAULT_REELS;
  }
}

export function saveReels(reels: Reel[]): { ok: boolean; error?: string } {
  if (typeof window === 'undefined') return { ok: true };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reels));
    notifyReelsUpdated(reels);
    return { ok: true };
  } catch (err) {
    console.error('Failed to save reels to localStorage:', err);
    return {
      ok: false,
      error: 'Browser storage is full. Please use a compressed thumbnail or external video link (YouTube / Google Drive).',
    };
  }
}

/**
 * Strictly APPENDS a new reel to the latest stored reels list (never overwrites existing rows).
 */
export function appendReel(
  input: Omit<Reel, 'id' | 'order' | 'isActive'> & { id?: string; isActive?: boolean },
  existingList?: Reel[]
): { reel: Reel; updatedList: Reel[]; saveResult: { ok: boolean; error?: string } } {
  const current = existingList !== undefined ? [...existingList] : getReels();
  const maxOrder = current.reduce((max, r) => Math.max(max, Number(r.order) || 0), 0);
  const safeVideo = sanitizeSafeUrl(input.videoUrl);
  const parsedVideo = parseVideoUrl(safeVideo);
  const safeThumb =
    sanitizeSafeUrl(input.thumbnail) ||
    parsedVideo.thumbnailUrl ||
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=720&q=80';

  const newReel: Reel = {
    id: input.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `reel_${Date.now()}`),
    title: input.title.trim(),
    thumbnail: safeThumb,
    videoUrl: safeVideo || undefined,
    views: input.views?.trim() || undefined,
    location: input.location?.trim() || undefined,
    category: input.category?.trim() || undefined,
    order: maxOrder + 1,
    isActive: input.isActive !== undefined ? input.isActive : true,
    updatedAt: Date.now(),
  };

  const updatedList = [...current, newReel];
  const saveResult = saveReels(updatedList);

  if (saveResult.ok) {
    syncPortfolioMutationToSheet('append_reel', newReel).catch(() => {});
  }

  return { reel: newReel, updatedList, saveResult };
}

/**
 * Updates ONLY the specific reel matching `id` while preserving every other row untouched.
 */
export function updateReelById(
  id: string,
  updates: Partial<Omit<Reel, 'id'>>,
  existingList?: Reel[]
): { reel: Reel | null; updatedList: Reel[]; saveResult: { ok: boolean; error?: string } } {
  const current = existingList !== undefined ? [...existingList] : getReels();
  let updatedReel: Reel | null = null;

  const updatedList = current.map((r) => {
    if (r.id !== id) return r;
    const nextVideo =
      updates.videoUrl !== undefined ? sanitizeSafeUrl(updates.videoUrl) || undefined : r.videoUrl;
    const parsedVideo = parseVideoUrl(nextVideo);
    const nextThumb =
      updates.thumbnail !== undefined
        ? sanitizeSafeUrl(updates.thumbnail) || parsedVideo.thumbnailUrl || r.thumbnail
        : r.thumbnail;

    updatedReel = {
      ...r,
      ...updates,
      title: updates.title !== undefined ? updates.title.trim() : r.title,
      thumbnail: nextThumb,
      videoUrl: nextVideo,
      views: updates.views !== undefined ? updates.views.trim() || undefined : r.views,
      location: updates.location !== undefined ? updates.location.trim() || undefined : r.location,
      updatedAt: Date.now(),
    };
    return updatedReel;
  });

  const saveResult = saveReels(updatedList);
  if (saveResult.ok && updatedReel) {
    syncPortfolioMutationToSheet('update_reel', updatedReel).catch(() => {});
  }

  return { reel: updatedReel, updatedList, saveResult };
}

/**
 * Deletes ONLY the reel matching `id` and re-indexes remaining order numbers.
 */
export function deleteReelById(
  id: string,
  existingList?: Reel[]
): { updatedList: Reel[]; saveResult: { ok: boolean; error?: string } } {
  const current = existingList !== undefined ? [...existingList] : getReels();
  const updatedList = current
    .filter((r) => r.id !== id)
    .map((r, idx) => ({ ...r, order: idx + 1 }));
  const saveResult = saveReels(updatedList);

  if (saveResult.ok) {
    syncPortfolioMutationToSheet('delete_reel', { id }).catch(() => {});
  }

  return { updatedList, saveResult };
}

/**
 * Sends append / update / delete mutations for Portfolio rows to Google Sheets
 * (via secure backend proxy first, then admin-configured webhook fallback).
 */
export async function syncPortfolioMutationToSheet(
  action: 'append_reel' | 'update_reel' | 'delete_reel',
  reel: Partial<Reel> & { id: string }
): Promise<boolean> {
  // Don't send huge base64 images or local idb:// blobs into Google Sheet cells
  const sheetThumbnail =
    reel.thumbnail && reel.thumbnail.startsWith('data:')
      ? ''
      : sanitizeSheetCell(reel.thumbnail || '');
  const sheetVideoUrl =
    reel.videoUrl && (reel.videoUrl.startsWith('idb://') || reel.videoUrl.startsWith('blob:'))
      ? ''
      : sanitizeSheetCell(reel.videoUrl || '');

  const payload = {
    action,
    id: sanitizeSheetCell(reel.id),
    title: sanitizeSheetCell(reel.title || ''),
    thumbnail: sheetThumbnail,
    videoUrl: sheetVideoUrl,
    views: sanitizeSheetCell(reel.views || ''),
    location: sanitizeSheetCell(reel.location || ''),
    category: sanitizeSheetCell(reel.category || ''),
    order: Number(reel.order) || 1,
    isActive: reel.isActive !== false,
    updatedAt: new Date(reel.updatedAt || Date.now()).toISOString(),
  };

  // 1. Try server-side proxy first
  if (typeof window !== 'undefined' && typeof fetch === 'function') {
    try {
      const res = await fetch('/api/sheets/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        if (json.synced) return true;
      }
    } catch {
      // fall through to direct webhook if configured
    }
  }

  const webhookUrl = getStoredWebhookUrl();
  if (!webhookUrl) return false;

  try {
    const secret = getStoredSheetSecret();
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(secret ? { ...payload, secret } : payload),
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Fetches the freshest portfolio items from Google Sheets (bypassing browser/CDN cache
 * via `cache: 'no-store'` and a timestamp query param) and merges them cleanly with any
 * local IndexedDB desktop videos so neither local desktop uploads nor Sheet rows are lost.
 */
export async function fetchLatestReelsFromSheet(): Promise<Reel[] | null> {
  if (typeof window === 'undefined' || typeof fetch !== 'function') return null;

  const parseSheetRows = (rows: unknown[]): Reel[] =>
    rows
      .filter((row): row is Record<string, unknown> => Boolean(row && typeof row === 'object'))
      .map((row, idx) => {
        const videoUrl = sanitizeSafeUrl(String(row.videoUrl || ''));
        const parsed = parseVideoUrl(videoUrl);
        const thumbnail =
          sanitizeSafeUrl(String(row.thumbnail || '')) ||
          parsed.thumbnailUrl ||
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=720&q=80';
        return {
          id: String(row.id || `sheet-reel-${idx + 1}`),
          title: String(row.title || 'Untitled Reel').trim(),
          thumbnail,
          videoUrl: videoUrl || undefined,
          views: row.views ? String(row.views).trim() : undefined,
          location: row.location ? String(row.location).trim() : undefined,
          category: row.category ? String(row.category).trim() : undefined,
          order: Number(row.order) || idx + 1,
          isActive: row.isActive !== false && String(row.isActive).toLowerCase() !== 'false',
        };
      })
      .filter((r) => Boolean(r.title));

  let remoteReels: Reel[] | null = null;

  // 1. Try secure backend proxy first (no-store, cache-busted)
  try {
    const res = await fetch(`/api/sheets/portfolio?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.reels) && json.reels.length > 0) {
        remoteReels = parseSheetRows(json.reels);
      }
    }
  } catch {
    // ignore if backend proxy not configured with remote Sheet URL
  }

  // 2. Fallback to direct Apps Script GET if user configured a webhook URL in Admin Panel
  if (!remoteReels) {
    const webhookUrl = getStoredWebhookUrl();
    if (webhookUrl) {
      try {
        const sep = webhookUrl.includes('?') ? '&' : '?';
        const res = await fetch(`${webhookUrl}${sep}action=get_portfolio&t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.reels) && json.reels.length > 0) {
            remoteReels = parseSheetRows(json.reels);
          }
        }
      } catch {
        // Apps Script GET may not be enabled yet; keep local cache intact
      }
    }
  }

  if (!remoteReels || remoteReels.length === 0) return null;

  // Preserve any local-only desktop IndexedDB reels while refreshing all Sheet-backed rows
  const localCurrent = getReels();
  const remoteIds = new Set(remoteReels.map((r) => r.id));
  const localDesktopOnly = localCurrent.filter(
    (r) => !remoteIds.has(r.id) && r.videoUrl?.startsWith('idb://')
  );

  const merged = [...remoteReels, ...localDesktopOnly].sort((a, b) => a.order - b.order);
  saveReels(merged);
  return merged;
}
