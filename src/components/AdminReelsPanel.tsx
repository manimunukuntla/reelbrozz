// components/AdminReelsPanel.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  getReels,
  saveReels,
  appendReel,
  updateReelById,
  deleteReelById,
  fetchLatestReelsFromSheet,
  type Reel,
} from '@/lib/reels';
import {
  Film,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Upload,
  Video,
  Image as ImageIcon,
  Play,
  Sparkles,
  RefreshCw,
  Link as LinkIcon,
} from 'lucide-react';
import {
  saveDesktopVideoRecord,
  extractVideoThumbnail,
  compressImageFileToDataUrl,
  getDesktopVideoUrl,
  deleteDesktopVideo,
} from '../utils/mediaStorage';
import { parseVideoUrl } from '../utils/videoEmbed';

interface AdminReelsPanelProps {
  onClose?: () => void;
  onReelsChanged?: (reels: Reel[]) => void;
}

export default function AdminReelsPanel({ onClose, onReelsChanged }: AdminReelsPanelProps) {
  const [reels, setReels] = useState<Reel[]>([]);
  const [form, setForm] = useState({
    title: '',
    thumbnail: '',
    videoUrl: '',
    views: '',
    location: '',
    category: 'Food & Cafes',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDesktopId, setPendingDesktopId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loaded = getReels().sort((a, b) => a.order - b.order);
    setReels(loaded);
  }, []);

  const resetForm = () => {
    setForm({
      title: '',
      thumbnail: '',
      videoUrl: '',
      views: '',
      location: '',
      category: 'Food & Cafes',
    });
    setEditingId(null);
    setPendingDesktopId(null);
    setLocalPreviewUrl(null);
  };

  // Handle direct desktop video file selection (persisted as idb://<id>)
  const handleDesktopVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingVideo(true);
    setErrorMessage(null);

    try {
      const targetId =
        editingId ||
        pendingDesktopId ||
        (typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `reel_${Date.now()}`);

      const extractedThumb = await extractVideoThumbnail(file);
      const stored = await saveDesktopVideoRecord(targetId, file);

      const cleanFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      const autoTitle = cleanFileName.charAt(0).toUpperCase() + cleanFileName.slice(1);

      setPendingDesktopId(targetId);
      setLocalPreviewUrl(stored.previewUrl);
      setForm((prev) => ({
        ...prev,
        videoUrl: stored.idbRef,
        thumbnail: prev.thumbnail || extractedThumb,
        title: prev.title.trim() ? prev.title : autoTitle,
        views: prev.views || '100K views',
        location: prev.location || 'On-Site 4K',
      }));

      setSuccessMessage(
        `Desktop video saved ("${file.name}", ${(file.size / (1024 * 1024)).toFixed(1)} MB) with persistent IndexedDB playback & auto-captured thumbnail!`
      );
    } catch (err) {
      console.error('Error processing desktop video:', err);
      setErrorMessage('Could not process this video file. Ensure it is a valid MP4, MOV, or WebM video.');
    } finally {
      setIsProcessingVideo(false);
      e.target.value = '';
    }
  };

  // Handle custom desktop thumbnail image upload (compressed to stay lightweight in localStorage)
  const handleDesktopThumbnailSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageFileToDataUrl(file);
      setForm((prev) => ({ ...prev, thumbnail: compressed }));
      setSuccessMessage(`Custom thumbnail uploaded & optimized: ${file.name}`);
    } catch {
      setErrorMessage('Could not read the selected thumbnail image.');
    } finally {
      e.target.value = '';
    }
  };

  // When pasting a YouTube or Google Drive URL, auto-fill the thumbnail if empty
  const handleVideoUrlChange = (rawUrl: string) => {
    const parsed = parseVideoUrl(rawUrl);
    setLocalPreviewUrl(null);
    setForm((prev) => ({
      ...prev,
      videoUrl: rawUrl,
      thumbnail:
        !prev.thumbnail.trim() && parsed.thumbnailUrl ? parsed.thumbnailUrl : prev.thumbnail,
    }));
  };

  const handleSave = () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const parsedVideo = parseVideoUrl(form.videoUrl);
    const resolvedThumb = form.thumbnail.trim() || parsedVideo.thumbnailUrl || '';

    if (!form.title.trim()) {
      setErrorMessage('Reel Title is required.');
      return;
    }

    if (!resolvedThumb) {
      setErrorMessage(
        'Please paste a YouTube / Google Drive link (thumbnail auto-fills), paste a Thumbnail URL, or upload a desktop video above.'
      );
      return;
    }

    if (editingId) {
      // Strictly updates ONLY this matching row without affecting any other portfolio item
      const { updatedList, saveResult } = updateReelById(editingId, {
        title: form.title.trim(),
        thumbnail: resolvedThumb,
        videoUrl: form.videoUrl.trim() || undefined,
        views: form.views.trim() || undefined,
        location: form.location.trim() || undefined,
        category: form.category,
      });

      if (!saveResult.ok) {
        setErrorMessage(saveResult.error || 'Could not update reel.');
        return;
      }

      const sorted = [...updatedList].sort((a, b) => a.order - b.order);
      setReels(sorted);
      if (onReelsChanged) onReelsChanged(sorted);
      resetForm();
      setSuccessMessage('Portfolio item updated! The website now displays your latest changes.');
    } else {
      // Strictly APPENDS a brand new row without overwriting existing items
      const { updatedList, saveResult } = appendReel({
        id: pendingDesktopId || undefined,
        title: form.title.trim(),
        thumbnail: resolvedThumb,
        videoUrl: form.videoUrl.trim() || undefined,
        views: form.views.trim() || undefined,
        location: form.location.trim() || undefined,
        category: form.category,
      });

      if (!saveResult.ok) {
        setErrorMessage(saveResult.error || 'Could not publish reel.');
        return;
      }

      const sorted = [...updatedList].sort((a, b) => a.order - b.order);
      setReels(sorted);
      if (onReelsChanged) onReelsChanged(sorted);
      resetForm();
      setSuccessMessage('New reel appended to portfolio! It is now live on your website.');
    }
  };

  const handleEdit = async (reel: Reel) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setForm({
      title: reel.title,
      thumbnail: reel.thumbnail,
      videoUrl: reel.videoUrl || '',
      views: reel.views || '',
      location: reel.location || '',
      category: reel.category || 'Food & Cafes',
    });
    setEditingId(reel.id);
    setPendingDesktopId(reel.videoUrl?.startsWith('idb://') ? reel.id : null);

    if (reel.videoUrl?.startsWith('idb://')) {
      const url = await getDesktopVideoUrl(reel.videoUrl);
      setLocalPreviewUrl(url);
    } else {
      setLocalPreviewUrl(null);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    const target = reels.find((r) => r.id === id);
    if (target?.videoUrl?.startsWith('idb://')) {
      deleteDesktopVideo(target.videoUrl);
    }

    const { updatedList } = deleteReelById(id);
    setReels(updatedList);
    if (onReelsChanged) onReelsChanged(updatedList);
    setDeleteConfirmId(null);

    if (editingId === id) {
      resetForm();
    }
    setSuccessMessage('Reel deleted from portfolio.');
  };

  const toggleActive = (id: string) => {
    const target = reels.find((r) => r.id === id);
    if (!target) return;
    const { updatedList } = updateReelById(id, { isActive: !target.isActive });
    setReels(updatedList);
    if (onReelsChanged) onReelsChanged(updatedList);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...reels];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    updated.forEach((r, i) => {
      r.order = i + 1;
      r.updatedAt = Date.now();
    });
    setReels(updated);
    saveReels(updated);
    if (onReelsChanged) onReelsChanged(updated);
  };

  const moveDown = (index: number) => {
    if (index === reels.length - 1) return;
    const updated = [...reels];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    updated.forEach((r, i) => {
      r.order = i + 1;
      r.updatedAt = Date.now();
    });
    setReels(updated);
    saveReels(updated);
    if (onReelsChanged) onReelsChanged(updated);
  };

  const handleSyncFromSheets = async () => {
    setIsSyncingSheet(true);
    setErrorMessage(null);
    try {
      const fresh = await fetchLatestReelsFromSheet();
      if (fresh && fresh.length > 0) {
        const sorted = [...fresh].sort((a, b) => a.order - b.order);
        setReels(sorted);
        if (onReelsChanged) onReelsChanged(sorted);
        setSuccessMessage(`Synced ${sorted.length} portfolio items live from Google Sheets!`);
      } else {
        setSuccessMessage('Local portfolio is up to date. Connect Google Sheets in the "Google Sheets Sync" tab for cloud sync.');
      }
    } finally {
      setIsSyncingSheet(false);
    }
  };

  const isDesktopVideo = form.videoUrl.startsWith('idb://') || form.videoUrl.startsWith('blob:');
  const isDataThumbnail = form.thumbnail.startsWith('data:');
  const detectedVideoInfo = parseVideoUrl(form.videoUrl);

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#ff2d2d] flex items-center justify-center text-white shadow-lg shadow-[#ff2d2d]/30 shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-white">Portfolio Reels Manager</h1>
            <p className="text-xs text-zinc-400">
              Append new reels or edit specific rows — supports YouTube, Google Drive, Vimeo, Instagram & Desktop uploads
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSyncingSheet}
            onClick={handleSyncFromSheets}
            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSheet ? 'animate-spin' : ''}`} />
            <span>Refresh from Sheet</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition cursor-pointer"
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">{errorMessage}</p>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-red-400 hover:text-white"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">{successMessage}</p>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="ml-auto text-emerald-400 hover:text-white"
            aria-label="Dismiss message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Upload / Add / Edit Form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6 mb-10 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            {editingId ? (
              <>
                <Edit2 className="w-5 h-5 text-[#ff4b4b]" />
                <span>Edit Portfolio Reel</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-[#ff4b4b]" />
                <span>Add New Reel (YouTube, Google Drive, or Desktop)</span>
              </>
            )}
          </h2>
          {editingId && (
            <span className="text-xs bg-[#ff2d2d]/20 text-[#ff4b4b] border border-[#ff2d2d]/30 px-2.5 py-1 rounded-full font-mono font-bold truncate max-w-full">
              Updating Row: {form.title || editingId}
            </span>
          )}
        </div>

        {/* 1. Direct Desktop File Upload Highlight Box */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border-2 border-dashed border-[#ff2d2d]/40 hover:border-[#ff2d2d] transition-colors text-center relative group">
          <input
            ref={videoFileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/*"
            onChange={handleDesktopVideoSelect}
            className="hidden"
          />
          <input
            ref={thumbnailFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleDesktopThumbnailSelect}
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#ff2d2d]/10 border border-[#ff2d2d]/30 flex items-center justify-center text-[#ff4b4b] group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Upload from Desktop or Paste YouTube / Google Drive Link Below
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                For public multi-device visitors, paste a YouTube or Google Drive video link (set Drive sharing to &ldquo;Anyone with the link&rdquo;). Desktop files save locally in IndexedDB.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                disabled={isProcessingVideo}
                onClick={() => videoFileInputRef.current?.click()}
                className="px-4 py-2.5 bg-[#ff2d2d] hover:bg-[#e02626] disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-[#ff2d2d]/30 transition"
              >
                <Video className="w-4 h-4" />
                <span>{isProcessingVideo ? 'Processing...' : 'Choose Video from Desktop'}</span>
              </button>

              <button
                type="button"
                onClick={() => thumbnailFileInputRef.current?.click()}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition border border-zinc-700"
              >
                <ImageIcon className="w-4 h-4 text-zinc-400" />
                <span>Upload Custom Thumbnail</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video & Thumbnail Live Previews if loaded */}
        {(localPreviewUrl || form.thumbnail || detectedVideoInfo.embedUrl) && (
          <div className="mb-6 p-4 rounded-xl bg-black/60 border border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {localPreviewUrl ? (
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Desktop Video Preview:</span>
                </p>
                <div className="relative aspect-[9/16] max-h-56 mx-auto sm:mx-0 rounded-xl overflow-hidden bg-black border border-zinc-700">
                  <video src={localPreviewUrl} controls playsInline className="w-full h-full object-cover" />
                </div>
              </div>
            ) : detectedVideoInfo.embedUrl ? (
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Detected {detectedVideoInfo.type.toUpperCase()} Embed Preview:</span>
                </p>
                <div className="relative aspect-[9/16] max-h-56 mx-auto sm:mx-0 rounded-xl overflow-hidden bg-black border border-zinc-700">
                  <iframe
                    src={detectedVideoInfo.embedUrl}
                    title="Video preview"
                    className="w-full h-full border-0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : null}

            {form.thumbnail && (
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>9:16 Poster Thumbnail:</span>
                </p>
                <div className="relative aspect-[9/16] max-h-56 mx-auto sm:mx-0 rounded-xl overflow-hidden bg-black border border-zinc-700">
                  <img
                    src={form.thumbnail}
                    alt="Reel poster"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (!img.dataset.fallbackApplied) {
                        img.dataset.fallbackApplied = '1';
                        img.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=720&q=80';
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="reel-title-input" className="block text-xs font-semibold text-zinc-400 mb-1">
              Reel Title <span className="text-[#ff4b4b]">*</span>
            </label>
            <input
              id="reel-title-input"
              placeholder="e.g. Sizzling Truffle Burger Pour"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#ff2d2d] transition text-sm text-white placeholder-zinc-500"
            />
          </div>

          <div>
            <label htmlFor="reel-video-url-input" className="block text-xs font-semibold text-zinc-400 mb-1">
              Video Link (YouTube, Google Drive, Vimeo, Instagram, MP4)
            </label>
            {isDesktopVideo ? (
              <div className="flex items-center justify-between gap-2 bg-zinc-800 border border-emerald-500/40 rounded-lg px-3.5 py-2.5">
                <span className="text-xs font-mono text-emerald-400 truncate">
                  📁 Persistent Desktop Video ({form.videoUrl})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, videoUrl: '' }));
                    setLocalPreviewUrl(null);
                  }}
                  className="text-[11px] text-zinc-300 hover:text-white underline shrink-0 cursor-pointer"
                >
                  Use URL instead
                </button>
              </div>
            ) : (
              <input
                id="reel-video-url-input"
                placeholder="https://drive.google.com/file/d/.../view or https://youtube.com/shorts/..."
                value={form.videoUrl}
                onChange={(e) => handleVideoUrlChange(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#ff2d2d] transition font-mono text-xs text-white placeholder-zinc-500"
              />
            )}
          </div>

          <div>
            <label htmlFor="reel-thumb-input" className="block text-xs font-semibold text-zinc-400 mb-1">
              Thumbnail URL (auto-filled for YouTube & Google Drive)
            </label>
            {isDataThumbnail ? (
              <div className="flex items-center justify-between gap-2 bg-zinc-800 border border-amber-500/40 rounded-lg px-3.5 py-2.5">
                <span className="text-xs font-mono text-amber-300 truncate">
                  🖼️ Captured Desktop Poster Thumbnail
                </span>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, thumbnail: '' }))}
                  className="text-[11px] text-zinc-300 hover:text-white underline shrink-0 cursor-pointer"
                >
                  Use URL instead
                </button>
              </div>
            ) : (
              <input
                id="reel-thumb-input"
                placeholder="Auto-filled from video link or paste image URL"
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#ff2d2d] transition font-mono text-xs text-white placeholder-zinc-500"
              />
            )}
          </div>

          <div>
            <label htmlFor="reel-views-input" className="block text-xs font-semibold text-zinc-400 mb-1">
              Views Display Metric
            </label>
            <input
              id="reel-views-input"
              placeholder="e.g. 540K views, 1.2M views"
              value={form.views}
              onChange={(e) => setForm({ ...form, views: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#ff2d2d] transition text-sm text-white placeholder-zinc-500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="reel-location-input" className="block text-xs font-semibold text-zinc-400 mb-1">
              Client & Location Tag
            </label>
            <input
              id="reel-location-input"
              placeholder="e.g. Cafe Mocha Roast · Indiranagar, Bengaluru"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#ff2d2d] transition text-sm text-white placeholder-zinc-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto justify-center bg-[#ff2d2d] hover:bg-[#e02626] text-white px-6 py-3 rounded-lg font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-[#ff2d2d]/25 text-sm"
          >
            <Check className="w-4 h-4" />
            <span>{editingId ? 'Update This Reel Row' : 'Publish Reel to Portfolio'}</span>
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                setErrorMessage(null);
              }}
              className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-6 py-3 rounded-lg transition font-medium cursor-pointer text-sm"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* List of reels in the portfolio stream */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <span>Live Portfolio Reels</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
            {reels.length} total
          </span>
        </h2>
        <span className="text-xs text-zinc-400">
          Use ↑ ↓ to reorder sequence on website
        </span>
      </div>

      {reels.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400">
          <Film className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
          <p className="font-semibold text-white">No reels in database yet</p>
          <p className="text-xs mt-1">Paste a YouTube / Google Drive link or upload a desktop video above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reels.map((reel, index) => (
            <div
              key={reel.id}
              className={`flex flex-col sm:flex-row sm:items-center gap-4 bg-zinc-900 border rounded-xl p-4 transition-all ${
                reel.isActive ? 'border-zinc-800' : 'border-zinc-800/50 opacity-60 bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-800 text-xs font-mono text-zinc-400 font-bold shrink-0">
                  #{index + 1}
                </div>

                {/* Thumbnail */}
                <div className="relative w-14 h-24 sm:w-16 sm:h-28 shrink-0 overflow-hidden rounded-lg border border-zinc-700 bg-black">
                  <img
                    src={reel.thumbnail}
                    alt={reel.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=720&q=80';
                    }}
                  />
                  {!reel.isActive && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <EyeOff className="w-5 h-5 text-zinc-400" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                      {reel.title}
                    </h3>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        reel.isActive
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {reel.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 truncate">
                    <span className="font-mono text-zinc-300">{reel.views || 'No views'}</span>
                    {' • '}
                    <span>{reel.location || 'Pan-India'}</span>
                  </p>
                  {reel.videoUrl && (
                    <p className="text-[11px] text-zinc-500 font-mono truncate mt-1">
                      {reel.videoUrl.startsWith('idb://') || reel.videoUrl.startsWith('blob:')
                        ? '📁 Desktop Video Stored'
                        : `🔗 ${reel.videoUrl}`}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 sm:shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-zinc-800 rounded-lg text-xs font-bold transition cursor-pointer"
                  aria-label={`Move ${reel.title} up`}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === reels.length - 1}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-zinc-800 rounded-lg text-xs font-bold transition cursor-pointer"
                  aria-label={`Move ${reel.title} down`}
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleActive(reel.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    reel.isActive
                      ? 'bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {reel.isActive ? (
                    <>
                      <Eye className="w-3.5 h-3.5" /> Active
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Hidden
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(reel)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  aria-label={`Edit ${reel.title}`}
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>

                {deleteConfirmId === reel.id ? (
                  <div className="flex items-center gap-1 bg-red-950/80 p-1 rounded-lg border border-red-800">
                    <span className="text-[11px] text-red-300 font-semibold px-1">Delete?</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(reel.id)}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold cursor-pointer"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-white rounded text-[11px] cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(reel.id)}
                    className="px-3 py-1.5 bg-red-950/40 hover:bg-red-950/80 border border-red-900/40 text-red-400 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    aria-label={`Delete ${reel.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
