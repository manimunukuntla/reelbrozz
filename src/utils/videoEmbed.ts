/**
 * Utility to parse, validate, and transform video URLs
 * (YouTube, Google Drive, Vimeo, Instagram, MP4/WebM/MOV, Desktop IndexedDB)
 * into safe embeddable URLs, plus XSS & Spreadsheet Formula Injection guards.
 */

export interface VideoEmbedInfo {
  type: 'youtube' | 'gdrive' | 'vimeo' | 'instagram' | 'mp4' | 'desktop' | 'unknown';
  embedUrl?: string;
  directUrl?: string;
  thumbnailUrl?: string;
  desktopId?: string;
}

const DANGEROUS_PROTOCOLS = /^(javascript|vbscript|data:text\/html|file):/i;

/**
 * Ensures a URL uses only safe protocols (https, http, blob, idb, or data:image/*).
 * Blocks javascript:, vbscript:, data:text/html, etc. to prevent XSS.
 */
export function sanitizeSafeUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (DANGEROUS_PROTOCOLS.test(trimmed)) return '';
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('idb://') ||
    /^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(trimmed)
  ) {
    return trimmed;
  }
  return '';
}

/**
 * Prevents CSV / Google Sheets Formula Injection (DDE / formula execution)
 * by prefixing cells that begin with =, +, -, @, tab, or carriage return with a single quote.
 */
export function sanitizeSheetCell(value: unknown): string {
  const str = String(value ?? '').trim();
  if (!str) return '';
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

/**
 * Extracts a Google Drive file ID from common sharing/view/open/uc/preview links.
 */
export function extractGoogleDriveFileId(url: string): string | null {
  const clean = url.trim();
  // Format 1: https://drive.google.com/file/d/<FILE_ID>/view?usp=sharing
  // Format 2: https://drive.google.com/file/d/<FILE_ID>/preview
  const fileMatch = clean.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{10,})/);
  if (fileMatch && fileMatch[1]) return fileMatch[1];

  // Format 3: https://drive.google.com/open?id=<FILE_ID> or /uc?id=<FILE_ID>
  const queryMatch = clean.match(/drive\.google\.com\/(?:open|uc|thumbnail)\?[^#]*\bid=([a-zA-Z0-9_-]{10,})/);
  if (queryMatch && queryMatch[1]) return queryMatch[1];

  return null;
}

export function parseVideoUrl(url?: string): VideoEmbedInfo {
  if (!url || typeof url !== 'string') {
    return { type: 'unknown' };
  }

  const clean = sanitizeSafeUrl(url);
  if (!clean) {
    return { type: 'unknown' };
  }

  // Persistent Desktop Video stored in IndexedDB (idb://<id>)
  if (clean.startsWith('idb://')) {
    const desktopId = clean.slice('idb://'.length).trim();
    if (desktopId) {
      return {
        type: 'desktop',
        desktopId,
      };
    }
    return { type: 'unknown' };
  }

  // Session Blob video URL
  if (clean.startsWith('blob:')) {
    return {
      type: 'mp4',
      directUrl: clean,
    };
  }

  // Direct video file (mp4, webm, mov, m4v)
  if (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(clean)) {
    return {
      type: 'mp4',
      directUrl: clean,
    };
  }

  // Google Drive video links
  const driveFileId = extractGoogleDriveFileId(clean);
  if (driveFileId) {
    return {
      type: 'gdrive',
      embedUrl: `https://drive.google.com/file/d/${driveFileId}/preview`,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w720`,
    };
  }

  // YouTube standard, shorts, live, embed, or youtu.be
  const ytMatch = clean.match(
    /(?:(?:www\.|m\.)?youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&playsinline=1`,
      thumbnailUrl: `https://i.ytimg.com/vi/${ytMatch[1]}/hqdefault.jpg`,
    };
  }

  // Vimeo
  const vimeoMatch = clean.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/
  );
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1&muted=0`,
    };
  }

  // Instagram Reel / Post
  const igMatch = clean.match(/instagram\.com\/(?:reel|reels|p)\/([a-zA-Z0-9_-]+)/);
  if (igMatch && igMatch[1]) {
    return {
      type: 'instagram',
      embedUrl: `https://www.instagram.com/reel/${igMatch[1]}/embed/captioned/`,
    };
  }

  return {
    type: 'unknown',
    directUrl: clean,
  };
}
