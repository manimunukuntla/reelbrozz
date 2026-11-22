/**
 * Client-Side Media Storage using IndexedDB and Canvas Frame Extraction
 * Allows saving full-resolution desktop video files (MP4, WebM, MOV)
 * without hitting localStorage's 5MB limit.
 */

const DB_NAME = 'reelsbrozz_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'desktop_videos';

function openMediaDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface StoredDesktopVideo {
  id: string;
  idbRef: string;
  previewUrl: string;
}

/**
 * Save a desktop video file to IndexedDB and return both a persistent `idb://<id>` reference
 * (safe to store in localStorage across reloads) and an immediate `blob:` preview URL.
 */
export async function saveDesktopVideoRecord(id: string, file: File | Blob): Promise<StoredDesktopVideo> {
  const previewUrl = URL.createObjectURL(file);
  try {
    const db = await openMediaDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const putReq = store.put({
        id,
        blob: file,
        name: (file as File).name || 'desktop_video.mp4',
        type: file.type || 'video/mp4',
        updatedAt: Date.now(),
      });
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    });

    return {
      id,
      idbRef: `idb://${id}`,
      previewUrl,
    };
  } catch (err) {
    console.warn('Could not store in IndexedDB, using memory ObjectURL:', err);
    return {
      id,
      idbRef: previewUrl,
      previewUrl,
    };
  }
}

/**
 * Legacy helper returning the persistent `idb://` reference.
 */
export async function saveDesktopVideo(id: string, file: File | Blob): Promise<string> {
  const saved = await saveDesktopVideoRecord(id, file);
  return saved.idbRef;
}

/**
 * Retrieve a playable ObjectURL for a stored desktop video from IndexedDB
 */
export async function getDesktopVideoUrl(idOrRef: string): Promise<string | null> {
  const cleanId = idOrRef.startsWith('idb://') ? idOrRef.slice('idb://'.length) : idOrRef;
  try {
    const db = await openMediaDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    const record = await new Promise<{ blob: Blob } | undefined>((resolve, reject) => {
      const getReq = store.get(cleanId);
      getReq.onsuccess = () => resolve(getReq.result);
      getReq.onerror = () => reject(getReq.error);
    });

    if (record && record.blob) {
      return URL.createObjectURL(record.blob);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Delete a stored desktop video from IndexedDB to free space when a reel is removed
 */
export async function deleteDesktopVideo(idOrRef: string): Promise<void> {
  const cleanId = idOrRef.startsWith('idb://') ? idOrRef.slice('idb://'.length) : idOrRef;
  try {
    const db = await openMediaDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(cleanId);
  } catch {
    // ignore cleanup errors
  }
}

/**
 * Automatically captures a compact 9:16 vertical poster frame (max 360x640, ~30KB)
 * so storing multiple desktop video thumbnails never exhausts localStorage quota.
 */
export function extractVideoThumbnail(videoFile: File | Blob): Promise<string> {
  return new Promise((resolve) => {
    const fallback =
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=720&q=80';
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      const objectUrl = URL.createObjectURL(videoFile);
      video.src = objectUrl;

      const finish = (result: string) => {
        URL.revokeObjectURL(objectUrl);
        resolve(result);
      };

      const timeout = setTimeout(() => finish(fallback), 5000);

      video.onloadeddata = () => {
        video.currentTime = Math.min(0.5, video.duration / 4 || 0.1);
      };

      video.onseeked = () => {
        clearTimeout(timeout);
        try {
          const rawW = video.videoWidth || 720;
          const rawH = video.videoHeight || 1280;
          const maxDim = 640;
          const scale = Math.min(1, maxDim / Math.max(rawW, rawH));

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(180, Math.round(rawW * scale));
          canvas.height = Math.max(180, Math.round(rawH * scale));

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
            finish(dataUrl);
            return;
          }
        } catch (e) {
          console.warn('Canvas export failed, using fallback thumbnail', e);
        }
        finish(fallback);
      };

      video.onerror = () => {
        clearTimeout(timeout);
        finish(fallback);
      };
    } catch {
      resolve(fallback);
    }
  });
}

/**
 * Downscales an uploaded image file to a lightweight JPEG data URL (< 60KB)
 * so custom thumbnails never cause localStorage QuotaExceededError.
 */
export function compressImageFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file'));
      img.onload = () => {
        const maxDim = 720;
        const scale = Math.min(1, maxDim / Math.max(img.width || maxDim, img.height || maxDim));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(180, Math.round(img.width * scale));
        canvas.height = Math.max(180, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
