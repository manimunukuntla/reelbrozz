// components/ReelsInfiniteSlider.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { InfiniteSlider } from '@/components/core/infinite-slider';
import {
  getReels,
  fetchLatestReelsFromSheet,
  REELS_UPDATED_EVENT,
  type Reel,
} from '@/lib/reels';
import { X, Play, Clock, ExternalLink, Loader2 } from 'lucide-react';
import { parseVideoUrl } from '../utils/videoEmbed';
import { getDesktopVideoUrl } from '../utils/mediaStorage';

const FALLBACK_THUMB =
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=720&q=80';

export function ReelsInfiniteSlider() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [activeModalReel, setActiveModalReel] = useState<Reel | null>(null);
  const [resolvedDesktopUrl, setResolvedDesktopUrl] = useState<string | null>(null);
  const [isLoadingDesktopVideo, setIsLoadingDesktopVideo] = useState(false);

  const loadVisibleReels = useCallback(() => {
    const data = getReels()
      .filter((r) => r.isActive)
      .sort((a, b) => a.order - b.order);
    setReels(data);
  }, []);

  useEffect(() => {
    loadVisibleReels();

    // Fetch freshest data from Google Sheets (cache-busted, no-store)
    fetchLatestReelsFromSheet().then((fresh) => {
      if (fresh) {
        setReels(fresh.filter((r) => r.isActive).sort((a, b) => a.order - b.order));
      }
    });

    // Listen to instant in-app updates from AdminReelsPanel
    const handleReelsUpdated = () => {
      loadVisibleReels();
    };

    // Listen to cross-tab localStorage updates
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'reelsbrozz_reels') {
        loadVisibleReels();
      }
    };

    window.addEventListener(REELS_UPDATED_EVENT, handleReelsUpdated);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(REELS_UPDATED_EVENT, handleReelsUpdated);
      window.removeEventListener('storage', handleStorage);
    };
  }, [loadVisibleReels]);

  // Resolve IndexedDB desktop video (idb://<id>) whenever the user clicks a desktop-uploaded reel
  useEffect(() => {
    let active = true;
    let objectUrlToRevoke: string | null = null;

    if (!activeModalReel?.videoUrl) {
      setResolvedDesktopUrl(null);
      setIsLoadingDesktopVideo(false);
      return;
    }

    const parsed = parseVideoUrl(activeModalReel.videoUrl);
    if (parsed.type === 'desktop' && parsed.desktopId) {
      setIsLoadingDesktopVideo(true);
      setResolvedDesktopUrl(null);
      getDesktopVideoUrl(parsed.desktopId)
        .then((url) => {
          if (!active) {
            if (url) URL.revokeObjectURL(url);
            return;
          }
          objectUrlToRevoke = url;
          setResolvedDesktopUrl(url);
        })
        .finally(() => {
          if (active) setIsLoadingDesktopVideo(false);
        });
    } else {
      setResolvedDesktopUrl(null);
      setIsLoadingDesktopVideo(false);
    }

    return () => {
      active = false;
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
    };
  }, [activeModalReel]);

  if (reels.length === 0) {
    return (
      <div className="text-center py-12 px-4 text-zinc-500 text-sm">
        No reels uploaded yet. Go to Admin Panel to add some.
      </div>
    );
  }

  const embedInfo = activeModalReel ? parseVideoUrl(activeModalReel.videoUrl) : null;
  const sliderKey = reels.map((r) => `${r.id}:${r.updatedAt || r.order}`).join('|');

  return (
    <div id="portfolio" className="w-full overflow-hidden py-7 sm:py-10 relative">
      {/* Top subtle badge and heading */}
      <div className="max-w-7xl mx-auto px-4 text-center mb-5 sm:mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff2d2d]/10 border border-[#ff2d2d]/25 text-[#ff4b4b] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2">
          <span className="w-2 h-2 rounded-full bg-[#ff2d2d] animate-ping shrink-0" />
          <span>Live 4K Portfolio Stream</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight px-2">
          Recent 10-Minute Reel Deliveries
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 px-2">
          Tap any reel to watch 9:16 playback · Hover to slow down
        </p>
      </div>

      <InfiniteSlider key={sliderKey} speedOnHover={55} gap={16}>
        {reels.map((reel) => (
          <button
            key={reel.id}
            type="button"
            onClick={() => setActiveModalReel(reel)}
            aria-label={`Play reel: ${reel.title}`}
            className="relative aspect-[9/16] w-[142px] sm:w-[160px] md:w-[175px] rounded-2xl overflow-hidden shrink-0 group cursor-pointer border border-white/10 hover:border-[#ff2d2d]/60 shadow-lg shadow-black/50 transition-all duration-300 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff2d2d]"
          >
            <img
              src={reel.thumbnail || FALLBACK_THUMB}
              alt={reel.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_THUMB;
              }}
            />

            {/* Play button */}
            <div className="absolute inset-0 bg-black/25 sm:bg-black/30 flex items-center justify-center opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Top location tag if available */}
            {reel.location && (
              <div className="absolute top-2 left-2 right-2 flex justify-start">
                <span className="bg-black/65 backdrop-blur-md text-[9px] text-zinc-200 px-2 py-0.5 rounded-full truncate max-w-[92%]">
                  📍 {reel.location}
                </span>
              </div>
            )}

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 bg-gradient-to-t from-black/90 via-black/55 to-transparent">
              <p className="text-white text-[11px] sm:text-xs font-semibold truncate leading-tight">
                {reel.title}
              </p>
              {reel.views && (
                <p className="text-[#ff4b4b] text-[10px] font-mono mt-0.5 font-bold flex items-center gap-1 truncate">
                  <span>🔥</span> {reel.views}
                </p>
              )}
            </div>
          </button>
        ))}
      </InfiniteSlider>

      {/* Video Modal on Click */}
      {activeModalReel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setActiveModalReel(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[360px] max-h-[90dvh] aspect-[9/16] bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl flex flex-col justify-between p-4 sm:p-5"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalReel(null)}
              className="absolute top-3.5 right-3.5 z-40 p-2 rounded-full bg-black/75 text-white hover:bg-black transition-colors cursor-pointer"
              aria-label="Close reel player"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="relative z-30 pt-1 pr-10 flex items-center gap-2 min-w-0">
              <div className="bg-[#ff2d2d] px-2.5 py-1 rounded-lg text-[11px] font-bold text-white flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" />
                <span>10-Min Reel</span>
              </div>
              {embedInfo?.type === 'gdrive' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Google Drive
                </span>
              )}
              {embedInfo?.type === 'youtube' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                  YouTube
                </span>
              )}
            </div>

            {/* Embed / Video Player Area */}
            {embedInfo?.embedUrl ? (
              <div className="relative w-full flex-1 my-3 rounded-2xl overflow-hidden bg-black border border-white/10">
                <iframe
                  src={embedInfo.embedUrl}
                  title={activeModalReel.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                />
              </div>
            ) : embedInfo?.type === 'desktop' ? (
              <div className="relative w-full flex-1 my-3 rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
                {isLoadingDesktopVideo ? (
                  <div className="flex flex-col items-center gap-2 text-zinc-400 text-xs">
                    <Loader2 className="w-6 h-6 animate-spin text-[#ff2d2d]" />
                    <span>Loading desktop video...</span>
                  </div>
                ) : resolvedDesktopUrl ? (
                  <video
                    src={resolvedDesktopUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-4 text-center space-y-2">
                    <p className="text-xs text-zinc-300 font-semibold">
                      Desktop video is stored only on the uploader’s browser.
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      For public multi-device playback, paste a YouTube or Google Drive link in Admin Panel.
                    </p>
                  </div>
                )}
              </div>
            ) : embedInfo?.type === 'mp4' && embedInfo.directUrl ? (
              <div className="relative w-full flex-1 my-3 rounded-2xl overflow-hidden bg-black border border-white/10">
                <video
                  src={embedInfo.directUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="my-auto text-center space-y-3 py-2">
                <div className="relative aspect-[9/16] max-h-64 mx-auto rounded-xl overflow-hidden border border-white/10 shadow-lg">
                  <img
                    src={activeModalReel.thumbnail || FALLBACK_THUMB}
                    alt={activeModalReel.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#ff2d2d] flex items-center justify-center text-white shadow-xl">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
                {embedInfo?.directUrl && (
                  <a
                    href={embedInfo.directUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                  >
                    <span>Open Video Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="relative z-30 pt-2.5 border-t border-zinc-800 flex items-center justify-between gap-2 text-xs text-zinc-300">
              <div className="min-w-0">
                <p className="font-bold text-white text-xs truncate">{activeModalReel.title}</p>
                {activeModalReel.location && (
                  <p className="text-[11px] text-zinc-400 truncate">{activeModalReel.location}</p>
                )}
              </div>
              <span className="font-mono text-[#ff4b4b] font-bold shrink-0">
                {activeModalReel.views || '4K'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReelsInfiniteSlider;
