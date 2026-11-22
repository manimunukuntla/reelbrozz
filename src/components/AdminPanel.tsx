import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Edit3, 
  Save, 
  X, 
  Play, 
  Video, 
  Clock, 
  Eye, 
  EyeOff,
  Sparkles, 
  CheckCircle2, 
  Smartphone, 
  PhoneCall,
  Search,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Lock,
  FileSpreadsheet,
  Download,
  Check,
  XCircle,
  AlertCircle,
  MessageSquare,
  Copy,
  Calendar,
  MapPin,
  Send,
  Tag,
  DollarSign,
  Settings,
  Megaphone,
  BookOpen,
  LayoutDashboard
} from 'lucide-react';
import { 
  ReelItem, 
  addReel, 
  updateReel, 
  deleteReel, 
  moveReel,
  toggleReelVisibility
} from '../utils/workStore';
import { 
  ClientBooking, 
  BookingStatus, 
  updateBookingStatus, 
  updateBookingNotes, 
  deleteBooking, 
  exportBookingsToCSV,
  getStoredWebhookUrl,
  saveStoredWebhookUrl,
  getStoredSheetSecret,
  saveStoredSheetSecret,
  getWhatsAppApprovalMessage
} from '../utils/bookingStore';
import { 
  DynamicPackage, 
  PromoOffer, 
  savePackagesToStorage, 
  savePromosToStorage 
} from '../utils/packageStore';
import { SiteConfig, saveSiteConfig, getWhatsAppUrl } from '../utils/siteConfigStore';
import { CITIES, formatINR } from '../utils/formatters';
import { parseVideoUrl } from '../utils/videoEmbed';
import { getReels, REELS_UPDATED_EVENT } from '@/lib/reels';
import AdminReelsPanel from './AdminReelsPanel';
import { saveDesktopVideo } from '../utils/mediaStorage';

export interface AdminPanelProps {
  reels: ReelItem[];
  bookings: ClientBooking[];
  packages: DynamicPackage[];
  promos: PromoOffer[];
  siteConfig: SiteConfig;
  onUpdateReels: (updated: ReelItem[]) => void;
  onUpdateBookings: (updated: ClientBooking[]) => void;
  onUpdatePackages: (updated: DynamicPackage[]) => void;
  onUpdatePromos: (updated: PromoOffer[]) => void;
  onUpdateSiteConfig: (updated: SiteConfig) => void;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  reels,
  bookings,
  packages,
  promos,
  siteConfig,
  onUpdateReels,
  onUpdateBookings,
  onUpdatePackages,
  onUpdatePromos,
  onUpdateSiteConfig,
  onClose,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'packages' | 'videos' | 'settings' | 'guide' | 'sheets'>('dashboard');
  const [videoSubTab, setVideoSubTab] = useState<'slider' | 'grid'>('slider');
  
  // Bookings management state
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [bookingCityFilter, setBookingCityFilter] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Google sheets webhook & secret state
  const [webhookUrl, setWebhookUrl] = useState(() => getStoredWebhookUrl());
  const [sheetSecret, setSheetSecret] = useState(() => getStoredSheetSecret());
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [liveReelsCount, setLiveReelsCount] = useState<number>(() => getReels().length);

  React.useEffect(() => {
    const syncCount = () => setLiveReelsCount(getReels().length);
    window.addEventListener(REELS_UPDATED_EVENT, syncCount);
    return () => window.removeEventListener(REELS_UPDATED_EVENT, syncCount);
  }, []);

  // Video management state
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [previewVideoItem, setPreviewVideoItem] = useState<ReelItem | null>(null);
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    client: '',
    category: 'weddings',
    city: 'Delhi NCR',
    device: 'iPhone 16 Pro (4K 60fps HDR)',
    turnaroundMinutes: 10,
    views: '250K Views',
    reachMultiplier: '+280% Footfall',
    audio: 'Trending Instagram Audio · 4K Sync',
    gradient: 'from-rose-950 via-zinc-950 to-black',
    tags: '#ReelsBrozz, #4KReel, #Trending',
    videoUrl: '',
  });

  // Package editing state
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [newPackageForm, setNewPackageForm] = useState<DynamicPackage>({
    id: `pkg_${Date.now()}`,
    name: '',
    basePrice: 2499,
    durationMinutes: 90,
    reelsCount: 2,
    resolution: '4K (30/60 fps)',
    deliveryTimeMinutes: 10,
    isPopular: false,
    description: '',
    features: ['2 High-Impact 4K Reels', '10-Min Fast On-Site Turnaround', 'AI-assisted color grading', 'Full raw footage handoff'],
    active: true,
  });

  // Feature bullet input for new package
  const [newFeatureText, setNewFeatureText] = useState('');

  // Promo code state
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoValue, setNewPromoValue] = useState(500);
  const [newPromoType, setNewPromoType] = useState<'fixed' | 'percent'>('fixed');
  const [newPromoDesc, setNewPromoDesc] = useState('');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteConfig>(siteConfig);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Metrics
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const approvedCount = bookings.filter((b) => b.status === 'Approved').length;
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;
  const totalRevenueValue = bookings.reduce((acc, b) => acc + (b.packagePrice || 0), 0);

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
    const matchesCity = bookingCityFilter === 'all' || b.city === bookingCityFilter;
    const query = bookingSearch.toLowerCase().trim();
    const matchesQuery =
      !query ||
      b.id.toLowerCase().includes(query) ||
      b.fullName.toLowerCase().includes(query) ||
      b.phone.toLowerCase().includes(query) ||
      b.email.toLowerCase().includes(query) ||
      b.eventType.toLowerCase().includes(query) ||
      b.venueLocation.toLowerCase().includes(query);
    return matchesStatus && matchesCity && matchesQuery;
  });

  // Booking actions
  const handleApprove = (booking: ClientBooking) => {
    const updated = updateBookingStatus(booking.id, 'Approved', 'Approved by Admin. Ready for creator assignment.', bookings);
    onUpdateBookings(updated);
  };

  const handleReject = (booking: ClientBooking) => {
    const updated = updateBookingStatus(booking.id, 'Rejected', 'Shoot request rejected by Admin.', bookings);
    onUpdateBookings(updated);
  };

  const handleMarkCompleted = (booking: ClientBooking) => {
    const updated = updateBookingStatus(booking.id, 'Completed', 'Shoot finished and 4K reel delivered on-site.', bookings);
    onUpdateBookings(updated);
  };

  const handleDeleteBooking = (booking: ClientBooking) => {
    const updated = deleteBooking(booking.id, bookings);
    onUpdateBookings(updated);
  };

  const handleSaveNotes = (id: string) => {
    const updated = updateBookingNotes(id, tempNoteText, bookings);
    onUpdateBookings(updated);
    setEditingNoteId(null);
  };

  const handleDownloadCSV = () => {
    const csvContent = exportBookingsToCSV(bookings);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ReelsBrozz_Client_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredWebhookUrl(webhookUrl);
    saveStoredSheetSecret(sheetSecret);
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 3000);
  };

  // Package actions
  const handleUpdateSinglePackage = (pkgId: string, updates: Partial<DynamicPackage>) => {
    const updated = packages.map((p) => {
      if (p.id === pkgId) {
        return { ...p, ...updates };
      }
      if (updates.isPopular) {
        return { ...p, isPopular: false };
      }
      return p;
    });
    onUpdatePackages(updated);
    savePackagesToStorage(updated);
  };

  const handleAddFeatureToPackage = (pkgId: string, featureText: string) => {
    if (!featureText.trim()) return;
    const pkg = packages.find((p) => p.id === pkgId);
    if (!pkg) return;
    handleUpdateSinglePackage(pkgId, { features: [...(pkg.features || []), featureText.trim()] });
  };

  const handleRemoveFeatureFromPackage = (pkgId: string, featureIndex: number) => {
    const pkg = packages.find((p) => p.id === pkgId);
    if (!pkg) return;
    const newFeatures = (pkg.features || []).filter((_, idx) => idx !== featureIndex);
    handleUpdateSinglePackage(pkgId, { features: newFeatures });
  };

  const handleAddNewPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackageForm.name) return;
    const newPkg: DynamicPackage = {
      ...newPackageForm,
      id: `pkg_${Date.now()}`,
    };
    const updated = [...packages, newPkg];
    onUpdatePackages(updated);
    savePackagesToStorage(updated);
    setIsAddingPackage(false);
    setNewPackageForm({
      id: `pkg_${Date.now()}`,
      name: '',
      basePrice: 2499,
      durationMinutes: 90,
      reelsCount: 2,
      resolution: '4K (30/60 fps)',
      deliveryTimeMinutes: 10,
      isPopular: false,
      description: '',
      features: ['2 High-Impact 4K Reels', '10-Min Fast On-Site Turnaround', 'AI-assisted color grading'],
      active: true,
    });
  };

  const handleDeletePackage = (pkgId: string) => {
    if (packages.length <= 1) {
      alert('You must have at least one package active!');
      return;
    }
    const updated = packages.filter((p) => p.id !== pkgId);
    onUpdatePackages(updated);
    savePackagesToStorage(updated);
  };

  // Promo actions
  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    const cleanCode = newPromoCode.trim().toUpperCase();
    const newPromo: PromoOffer = {
      code: cleanCode,
      type: newPromoType,
      value: Number(newPromoValue),
      description: newPromoDesc || (newPromoType === 'fixed' ? `₹${newPromoValue} off` : `${newPromoValue}% off`),
      active: true,
    };
    const updated = [...promos.filter((p) => p.code !== cleanCode), newPromo];
    onUpdatePromos(updated);
    savePromosToStorage(updated);
    setNewPromoCode('');
    setNewPromoDesc('');
  };

  const handleTogglePromo = (code: string) => {
    const updated = promos.map((p) => (p.code === code ? { ...p, active: !p.active } : p));
    onUpdatePromos(updated);
    savePromosToStorage(updated);
  };

  const handleDeletePromo = (code: string) => {
    const updated = promos.filter((p) => p.code !== code);
    onUpdatePromos(updated);
    savePromosToStorage(updated);
  };

  // Settings actions
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteConfig(settingsForm);
    saveSiteConfig(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Production-safe Google Apps Script template (LockService, strict appendRow, row-by-ID update, no-cache doGet)
  const googleAppsScriptCode = `/**
 * Reels Brozz Secure Google Sheets Database Script (Bookings + Portfolio)
 *
 * SETUP:
 * 1. Open Google Sheets -> Extensions -> Apps Script
 * 2. Paste this ENTIRE script and click Save
 * 3. (Recommended Security) Project Settings -> Script Properties -> Add property:
 *    Key: API_SECRET | Value: <any random 32-char string>
 * 4. Click "Deploy" -> "New deployment" -> Type: "Web app"
 *    Execute as: "Me" | Who has access: "Anyone"
 * 5. Put the Web App URL + API_SECRET in server env secrets (GOOGLE_SHEETS_WEBHOOK_URL / GOOGLE_SHEETS_SECRET)
 *    or paste them in the Admin Panel below.
 */

function sanitizeCell(val) {
  var s = String(val === undefined || val === null ? "" : val).trim();
  if (/^[=+\\-@\\t\\r]/.test(s)) return "'" + s;
  return s;
}

function getOrCreateSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
  return sheet;
}

function isAuthorized(providedSecret) {
  var expected = PropertiesService.getScriptProperties().getProperty("API_SECRET");
  if (!expected) return true; // If no API_SECRET set yet, allow; set API_SECRET to enforce!
  return String(providedSecret || "") === String(expected);
}

// Public read endpoint for fresh Portfolio items (called with ?action=get_portfolio&t=<timestamp>)
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || "get_portfolio";
    if (action !== "get_portfolio") {
      return jsonOut({ result: "error", error: "Unsupported GET action" });
    }

    var sheet = getOrCreateSheet("Portfolio", [
      "ID", "Title", "Thumbnail", "VideoURL", "Views", "Location", "Category", "Order", "IsActive", "UpdatedAt"
    ]);
    var values = sheet.getDataRange().getValues();
    var reels = [];

    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      if (!row[0] && !row[1]) continue;
      reels.push({
        id: String(row[0] || ("sheet-" + i)),
        title: String(row[1] || ""),
        thumbnail: String(row[2] || ""),
        videoUrl: String(row[3] || ""),
        views: String(row[4] || ""),
        location: String(row[5] || ""),
        category: String(row[6] || ""),
        order: Number(row[7]) || i,
        isActive: String(row[8]).toLowerCase() !== "false"
      });
    }

    return jsonOut({ result: "success", reels: reels });
  } catch (err) {
    return jsonOut({ result: "error", error: err.toString() });
  }
}

// Write endpoint: ALWAYS appends new rows, and updates ONLY matching ID rows (never clears or overwrites!)
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var data = JSON.parse(e.postData.contents || "{}");

    if (!isAuthorized(data.secret)) {
      return jsonOut({ result: "error", error: "Unauthorized" });
    }

    var action = data.action || "append_booking";

    // 1. APPEND NEW BOOKING ROW (Never overwrites existing rows!)
    if (action === "append_booking") {
      var bSheet = getOrCreateSheet("Bookings", [
        "Booking ID", "Timestamp", "Client Name", "Phone", "Email", "City",
        "Event Type", "Event Date", "Time Window", "Package", "Price (INR)",
        "Location", "Special Requirements", "Status", "Admin Notes"
      ]);
      bSheet.appendRow([
        sanitizeCell(data.bookingId),
        sanitizeCell(data.timestamp || new Date().toISOString()),
        sanitizeCell(data.fullName),
        sanitizeCell(data.phone),
        sanitizeCell(data.email),
        sanitizeCell(data.city),
        sanitizeCell(data.eventType),
        sanitizeCell(data.eventDate),
        sanitizeCell(data.preferredTime),
        sanitizeCell(data.package),
        Number(data.price) || 0,
        sanitizeCell(data.location),
        sanitizeCell(data.specialRequirements || "None"),
        sanitizeCell(data.status || "Pending"),
        ""
      ]);
      return jsonOut({ result: "success", message: "Booking appended" });
    }

    // 2. UPDATE SPECIFIC BOOKING STATUS ROW BY ID
    if (action === "update_booking_status") {
      var bSheet2 = getOrCreateSheet("Bookings", [
        "Booking ID", "Timestamp", "Client Name", "Phone", "Email", "City",
        "Event Type", "Event Date", "Time Window", "Package", "Price (INR)",
        "Location", "Special Requirements", "Status", "Admin Notes"
      ]);
      var bRows = bSheet2.getDataRange().getValues();
      for (var bi = 1; bi < bRows.length; bi++) {
        if (String(bRows[bi][0]) === String(data.bookingId)) {
          bSheet2.getRange(bi + 1, 14).setValue(sanitizeCell(data.status));
          if (data.adminNotes !== undefined) {
            bSheet2.getRange(bi + 1, 15).setValue(sanitizeCell(data.adminNotes));
          }
          return jsonOut({ result: "success", message: "Booking row updated" });
        }
      }
      return jsonOut({ result: "error", error: "Booking ID not found" });
    }

    var pSheet = getOrCreateSheet("Portfolio", [
      "ID", "Title", "Thumbnail", "VideoURL", "Views", "Location", "Category", "Order", "IsActive", "UpdatedAt"
    ]);

    // 3. APPEND NEW PORTFOLIO REEL ROW (Never overwrites existing rows!)
    if (action === "append_reel") {
      pSheet.appendRow([
        sanitizeCell(data.id),
        sanitizeCell(data.title),
        sanitizeCell(data.thumbnail),
        sanitizeCell(data.videoUrl),
        sanitizeCell(data.views),
        sanitizeCell(data.location),
        sanitizeCell(data.category),
        Number(data.order) || pSheet.getLastRow(),
        data.isActive !== false ? "TRUE" : "FALSE",
        sanitizeCell(data.updatedAt || new Date().toISOString())
      ]);
      return jsonOut({ result: "success", message: "Portfolio reel appended" });
    }

    // 4. UPDATE ONLY THE SPECIFIC PORTFOLIO ROW MATCHING ID
    if (action === "update_reel") {
      var pRows = pSheet.getDataRange().getValues();
      for (var pi = 1; pi < pRows.length; pi++) {
        if (String(pRows[pi][0]) === String(data.id)) {
          pSheet.getRange(pi + 1, 2, 1, 9).setValues([[
            sanitizeCell(data.title),
            sanitizeCell(data.thumbnail),
            sanitizeCell(data.videoUrl),
            sanitizeCell(data.views),
            sanitizeCell(data.location),
            sanitizeCell(data.category),
            Number(data.order) || pi,
            data.isActive !== false ? "TRUE" : "FALSE",
            sanitizeCell(data.updatedAt || new Date().toISOString())
          ]]);
          return jsonOut({ result: "success", message: "Portfolio row updated" });
        }
      }
      // If row wasn't in Sheet yet, safely append it instead of overwriting anything
      pSheet.appendRow([
        sanitizeCell(data.id),
        sanitizeCell(data.title),
        sanitizeCell(data.thumbnail),
        sanitizeCell(data.videoUrl),
        sanitizeCell(data.views),
        sanitizeCell(data.location),
        sanitizeCell(data.category),
        Number(data.order) || pSheet.getLastRow(),
        data.isActive !== false ? "TRUE" : "FALSE",
        sanitizeCell(data.updatedAt || new Date().toISOString())
      ]);
      return jsonOut({ result: "success", message: "Portfolio row appended" });
    }

    // 5. DELETE ONLY THE SPECIFIC PORTFOLIO ROW MATCHING ID
    if (action === "delete_reel") {
      var dRows = pSheet.getDataRange().getValues();
      for (var di = 1; di < dRows.length; di++) {
        if (String(dRows[di][0]) === String(data.id)) {
          pSheet.deleteRow(di + 1);
          return jsonOut({ result: "success", message: "Portfolio row deleted" });
        }
      }
      return jsonOut({ result: "success", message: "Row already removed" });
    }

    return jsonOut({ result: "error", error: "Unknown action: " + action });
  } catch (err) {
    return jsonOut({ result: "error", error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 font-sans pb-28 selection:bg-[#ff2d2d] selection:text-white">
      {/* Top Admin Studio Header */}
      <header className="sticky top-0 z-40 bg-[#09090e]/95 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-white text-lg sm:text-xl tracking-tight">
                  REELS<span className="text-[#ff2d2d]">BROZZ</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ff2d2d]/20 text-[#ff7171] border border-[#ff2d2d]/40 uppercase">
                  Control Center
                </span>
              </div>
              <span className="text-xs text-zinc-400">
                Full Self-Serve Owner Portal (No Developer Needed)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* WhatsApp Link */}
            <a
              href={getWhatsAppUrl(siteConfig.rawWhatsAppNumber, 'Admin check from Reels Brozz')}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium hover:bg-emerald-900/40 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{siteConfig.displayPhone}</span>
            </a>

            {/* Lock / Logout Session */}
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Lock Admin Studio and log out"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Lock (mani@7)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#ff2d2d] hover:bg-[#e02424] rounded-lg transition-colors shadow-md cursor-pointer"
            >
              View Live Site
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#ff2d2d] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-[#ff2d2d] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Client Bookings ({bookings.length})</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black">
                  {pendingCount} Pending
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('packages')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'packages'
                  ? 'bg-[#ff2d2d] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Packages & Offers ({packages.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-[#ff2d2d] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Video className="w-4 h-4 text-sky-400" />
              <span>Portfolio Videos ({liveReelsCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#ff2d2d] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span>Site & Banner</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-[#ff2d2d] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>How To Manage</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sheets')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'sheets'
                  ? 'bg-[#ff2d2d] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Google Sheets Sync</span>
            </button>
          </div>

          {activeTab === 'bookings' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Bookings CSV</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0e0e14] border border-white/[0.08] rounded-2xl p-5 shadow-lg">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Total Client Bookings
            </span>
            <div className="text-3xl font-black text-white font-mono">{totalBookings}</div>
            <div className="text-[10px] text-zinc-500 mt-1">Live from booking form</div>
          </div>

          <div className="bg-[#0e0e14] border border-amber-500/30 rounded-2xl p-5 shadow-lg">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
              Pending Approvals
            </span>
            <div className="text-3xl font-black text-amber-400 font-mono">{pendingCount}</div>
            <div className="text-[10px] text-amber-300/80 mt-1">Requires 1-click accept</div>
          </div>

          <div className="bg-[#0e0e14] border border-emerald-500/30 rounded-2xl p-5 shadow-lg">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Approved Shoots
            </span>
            <div className="text-3xl font-black text-emerald-400 font-mono">{approvedCount}</div>
            <div className="text-[10px] text-emerald-300/80 mt-1">Ready for creator dispatch</div>
          </div>

          <div className="bg-[#0e0e14] border border-[#ff2d2d]/30 rounded-2xl p-5 shadow-lg">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5757] block mb-1">
              Estimated Pipeline
            </span>
            <div className="text-3xl font-black text-white font-mono">{formatINR(totalRevenueValue)}</div>
            <div className="text-[10px] text-zinc-400 mt-1">{completedCount} Shoots Completed</div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 0: OVERVIEW DASHBOARD                                      */}
        {/* ============================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quick Actions Card */}
              <div className="bg-[#0e0e14] border border-white/[0.08] rounded-2xl p-6 space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff2d2d]" />
                  <span>Quick Actions</span>
                </h4>
                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('packages')}
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-left text-xs font-semibold text-white flex items-center justify-between border border-white/[0.06] transition-colors"
                  >
                    <span>Edit Packages & Pricing</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('videos')}
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-left text-xs font-semibold text-white flex items-center justify-between border border-white/[0.06] transition-colors"
                  >
                    <span>Upload / Add Portfolio Reel</span>
                    <Video className="w-4 h-4 text-sky-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-left text-xs font-semibold text-white flex items-center justify-between border border-white/[0.06] transition-colors"
                  >
                    <span>Change Homepage Offer Banner</span>
                    <Megaphone className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>

              {/* Status Breakdown Card */}
              <div className="bg-[#0e0e14] border border-white/[0.08] rounded-2xl p-6 space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Bookings Breakdown</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Pending Approvals</span>
                    <span className="font-mono font-bold text-amber-400">{pendingCount}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Approved Shoots</span>
                    <span className="font-mono font-bold text-emerald-400">{approvedCount}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Completed Shoots</span>
                    <span className="font-mono font-bold text-blue-400">{completedCount}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-400">Total Bookings</span>
                    <span className="font-mono font-bold text-white">{totalBookings}</span>
                  </div>
                </div>
              </div>

              {/* Live Configuration Info Card */}
              <div className="bg-[#0e0e14] border border-white/[0.08] rounded-2xl p-6 space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-cyan-400" />
                  <span>Active Contact Routing</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[11px]">WhatsApp & Call:</span>
                    <span className="font-mono font-bold text-emerald-400">{siteConfig.displayPhone}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Instagram:</span>
                    <span className="font-mono text-pink-400">{siteConfig.instagramHandle}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Active Promo Banner:</span>
                    <span className="text-zinc-300 font-medium">
                      {siteConfig.banner.enabled ? siteConfig.banner.badge : 'Banner Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: CLIENT BOOKINGS & APPROVALS                             */}
        {/* ============================================================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="bg-[#0e0e14] border border-white/[0.08] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[240px] relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search client name, phone, city, venue, booking ID..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d2d]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Status:</span>
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none"
                >
                  <option value="all">All Statuses ({bookings.length})</option>
                  <option value="Pending">Pending ({pendingCount})</option>
                  <option value="Approved">Approved ({approvedCount})</option>
                  <option value="Completed">Completed ({completedCount})</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <span className="text-xs text-zinc-400 ml-2">City:</span>
                <select
                  value={bookingCityFilter}
                  onChange={(e) => setBookingCityFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none"
                >
                  <option value="all">All Indian Cities</option>
                  {CITIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            {filteredBookings.length === 0 ? (
              <div className="text-center py-16 bg-[#0e0e14] rounded-2xl border border-white/[0.08]">
                <FileSpreadsheet className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">No Bookings Found</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  {bookings.length === 0 
                    ? 'Bookings submitted by clients on your website will appear here in real-time.' 
                    : 'No bookings match your current search or filter criteria.'}
                </p>
              </div>
            ) : (
              <div className="bg-[#0e0e14] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900/90 text-zinc-400 border-b border-white/[0.08]">
                      <tr>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider">Booking ID & Date</th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider">Client Info</th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider">Event & Location</th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider">Package & Price</th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider">Status</th>
                        <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Approval Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {filteredBookings.map((b) => {
                        const waLink = `https://wa.me/${b.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          getWhatsAppApprovalMessage(b.fullName, b.id)
                        )}`;
                        const isPending = b.status === 'Pending';
                        const isApproved = b.status === 'Approved';

                        return (
                          <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                            {/* Col 1: ID & Date */}
                            <td className="py-4 px-4 align-top">
                              <span className="font-mono font-bold text-[#ff7171] block">
                                {b.id}
                              </span>
                              <span className="text-[11px] text-zinc-400 mt-1 block">
                                {new Date(b.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              {b.specialRequirements && (
                                <span className="inline-block mt-2 px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 max-w-[140px] truncate" title={b.specialRequirements}>
                                  Req: {b.specialRequirements}
                                </span>
                              )}
                            </td>

                            {/* Col 2: Client Info */}
                            <td className="py-4 px-4 align-top">
                              <span className="font-bold text-white text-sm block">
                                {b.fullName}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <a
                                  href={`tel:${b.phone}`}
                                  className="text-zinc-300 hover:text-white font-mono text-[11px]"
                                >
                                  {b.phone}
                                </a>
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1 rounded bg-emerald-950 text-emerald-400 hover:bg-emerald-900"
                                  title="Chat with client on WhatsApp"
                                >
                                  <PhoneCall className="w-3 h-3" />
                                </a>
                              </div>
                              <span className="text-zinc-500 text-[11px] block mt-0.5 truncate max-w-[160px]">
                                {b.email}
                              </span>
                            </td>

                            {/* Col 3: Event & Location */}
                            <td className="py-4 px-4 align-top">
                              <span className="font-semibold text-zinc-200 block">
                                {b.eventType}
                              </span>
                              <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mt-1">
                                <Calendar className="w-3 h-3 text-zinc-500" />
                                <span>{b.eventDate} · {b.preferredTime}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mt-0.5">
                                <MapPin className="w-3 h-3 text-zinc-500" />
                                <span>{b.venueLocation}, {b.city}</span>
                              </div>
                            </td>

                            {/* Col 4: Package & Price */}
                            <td className="py-4 px-4 align-top">
                              <span className="font-bold text-white block">
                                {b.packageName}
                              </span>
                              <span className="font-mono text-emerald-400 font-bold block mt-1">
                                {formatINR(b.packagePrice)}
                              </span>
                            </td>

                            {/* Col 5: Status */}
                            <td className="py-4 px-4 align-top">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                b.status === 'Approved'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : b.status === 'Pending'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : b.status === 'Completed'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  b.status === 'Approved' ? 'bg-emerald-400' :
                                  b.status === 'Pending' ? 'bg-amber-400' :
                                  b.status === 'Completed' ? 'bg-blue-400' : 'bg-rose-400'
                                }`} />
                                <span>{b.status}</span>
                              </span>

                              {/* Admin Notes */}
                              {editingNoteId === b.id ? (
                                <div className="mt-2 space-y-1">
                                  <textarea
                                    rows={2}
                                    value={tempNoteText}
                                    onChange={(e) => setTempNoteText(e.target.value)}
                                    placeholder="Add staff notes or creator assignment..."
                                    className="w-full p-1.5 text-[11px] bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                                  />
                                  <div className="flex gap-1 justify-end">
                                    <button
                                      type="button"
                                      onClick={() => setEditingNoteId(null)}
                                      className="px-2 py-0.5 text-[10px] text-zinc-400"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSaveNotes(b.id)}
                                      className="px-2 py-0.5 text-[10px] bg-[#ff2d2d] text-white rounded font-bold"
                                    >
                                      Save Note
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingNoteId(b.id);
                                    setTempNoteText(b.adminNotes || '');
                                  }}
                                  className="text-[10px] text-zinc-500 hover:text-zinc-300 block mt-2 underline cursor-pointer"
                                >
                                  {b.adminNotes ? `Note: ${b.adminNotes}` : '+ Add note'}
                                </button>
                              )}
                            </td>

                            {/* Col 6: Actions */}
                            <td className="py-4 px-4 align-top text-right space-y-1.5">
                              {isPending && (
                                <div className="flex flex-col gap-1 items-end">
                                  <button
                                    type="button"
                                    onClick={() => handleApprove(b)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-md text-xs cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Approve Shoot</span>
                                  </button>

                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>WhatsApp Accept Alert</span>
                                  </a>
                                </div>
                              )}

                              {isApproved && (
                                <div className="flex flex-col gap-1 items-end">
                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950 border border-emerald-500/40 text-emerald-400 rounded-lg text-xs font-semibold hover:bg-emerald-900"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>WhatsApp Client</span>
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleMarkCompleted(b)}
                                    className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
                                  >
                                    Mark Completed
                                  </button>
                                </div>
                              )}

                              <div className="flex items-center justify-end gap-2 pt-1">
                                {isPending && (
                                  <button
                                    type="button"
                                    onClick={() => handleReject(b)}
                                    className="text-[11px] text-zinc-500 hover:text-zinc-300 cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBooking(b)}
                                  className="text-[11px] text-rose-500 hover:text-rose-400 cursor-pointer"
                                  title="Delete booking from table"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PACKAGES & OFFERS MANAGEMENT                            */}
        {/* ============================================================== */}
        {activeTab === 'packages' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>Manage Shoot Packages & Pricing</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Control packages, prices, features, and promo discounts. Changes reflect immediately on the live website.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingPackage(!isAddingPackage)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ff2d2d] hover:bg-[#e02424] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {isAddingPackage ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{isAddingPackage ? 'Cancel' : 'Add New Package'}</span>
                </button>
              </div>
            </div>

            {/* Add New Package Form */}
            {isAddingPackage && (
              <form onSubmit={handleAddNewPackage} className="bg-[#0e0e14] border border-[#ff2d2d]/40 rounded-2xl p-6 space-y-4">
                <h4 className="text-sm font-bold text-white mb-2">Create New Shoot Package</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Package Name *</label>
                    <input
                      type="text"
                      required
                      value={newPackageForm.name}
                      onChange={(e) => setNewPackageForm({ ...newPackageForm, name: e.target.value })}
                      placeholder="e.g. Club Night VIP Special"
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Base Price (INR) *</label>
                    <input
                      type="number"
                      required
                      min={500}
                      value={newPackageForm.basePrice}
                      onChange={(e) => setNewPackageForm({ ...newPackageForm, basePrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Shoot Duration (Mins) *</label>
                    <input
                      type="number"
                      required
                      min={15}
                      value={newPackageForm.durationMinutes}
                      onChange={(e) => setNewPackageForm({ ...newPackageForm, durationMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Reels Count *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newPackageForm.reelsCount}
                      onChange={(e) => setNewPackageForm({ ...newPackageForm, reelsCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Delivery Time (Mins) *</label>
                    <input
                      type="number"
                      required
                      min={5}
                      value={newPackageForm.deliveryTimeMinutes}
                      onChange={(e) => setNewPackageForm({ ...newPackageForm, deliveryTimeMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Resolution *</label>
                    <input
                      type="text"
                      value={newPackageForm.resolution}
                      onChange={(e) => setNewPackageForm({ ...newPackageForm, resolution: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Package Description *</label>
                  <input
                    type="text"
                    required
                    value={newPackageForm.description}
                    onChange={(e) => setNewPackageForm({ ...newPackageForm, description: e.target.value })}
                    placeholder="Short description of who this package is best suited for"
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsAddingPackage(false)} className="px-4 py-2 text-xs text-zinc-400">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#ff2d2d] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer">
                    Save New Package
                  </button>
                </div>
              </form>
            )}

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-[#0e0e14] border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        pkg.isPopular ? 'bg-[#ff2d2d] text-white' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {pkg.isPopular ? '★ Most Popular' : 'Standard Tier'}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateSinglePackage(pkg.id, { active: !pkg.active })}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                            pkg.active !== false ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-500'
                          }`}
                          title="Toggle active status on website"
                        >
                          {pkg.active !== false ? 'Active' : 'Disabled'}
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer"
                          title="Delete Package"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Package Name & Price */}
                    <div className="space-y-2 mb-4">
                      <label className="text-[11px] text-zinc-400 block">Package Name</label>
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => handleUpdateSinglePackage(pkg.id, { name: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm font-bold bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                      />

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="text-[11px] text-zinc-400 block">Price (INR)</label>
                          <input
                            type="number"
                            value={pkg.basePrice}
                            onChange={(e) => handleUpdateSinglePackage(pkg.id, { basePrice: Number(e.target.value) })}
                            className="w-full px-2.5 py-1.5 text-xs font-mono font-bold bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-zinc-400 block">Reels Count</label>
                          <input
                            type="number"
                            value={pkg.reelsCount}
                            onChange={(e) => handleUpdateSinglePackage(pkg.id, { reelsCount: Number(e.target.value) })}
                            className="w-full px-2.5 py-1.5 text-xs font-mono font-bold bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-zinc-400 block">Description / Ideal For</label>
                        <textarea
                          rows={2}
                          value={pkg.description}
                          onChange={(e) => handleUpdateSinglePackage(pkg.id, { description: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                        />
                      </div>

                      {/* What's Included Features List */}
                      <div className="pt-2">
                        <label className="text-[11px] font-bold text-zinc-300 block mb-1">What's Included (Features):</label>
                        <ul className="space-y-1 mb-2">
                          {(pkg.features || []).map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-center justify-between text-[11px] text-zinc-300 bg-zinc-900/60 px-2 py-1 rounded">
                              <span className="truncate pr-1">• {feat}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFeatureFromPackage(pkg.id, fIdx)}
                                className="text-zinc-500 hover:text-rose-400 cursor-pointer ml-1"
                                title="Remove feature"
                              >
                                ×
                              </button>
                            </li>
                          ))}
                        </ul>

                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Add feature bullet..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddFeatureToPackage(pkg.id, (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                            className="flex-1 px-2 py-1 text-[11px] bg-zinc-900 border border-zinc-800 rounded text-white"
                          />
                          <span className="text-[10px] text-zinc-500 self-center">Press Enter</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleUpdateSinglePackage(pkg.id, { isPopular: !pkg.isPopular })}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        pkg.isPopular 
                          ? 'bg-[#ff2d2d]/20 border-[#ff2d2d] text-[#ff4b4b]' 
                          : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {pkg.isPopular ? '★ Popular Choice' : 'Make Most Popular'}
                    </button>

                    <span className="text-[11px] text-zinc-500 font-mono">
                      {pkg.deliveryTimeMinutes}m Delivery
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Offers / Promo Discounts Manager */}
            <div className="bg-[#0e0e14] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#ff4b4b]" />
                  <span>Special Offers & Promo Discount Codes</span>
                </h4>
                <p className="text-xs text-zinc-400">
                  Add discounts like "₹500 off" or "10% off". Clients can click or apply these during checkout.
                </p>
              </div>

              {/* Add Promo Form */}
              <form onSubmit={handleAddPromo} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-zinc-900/60 p-4 rounded-xl border border-white/[0.06]">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                    placeholder="e.g. FESTIVAL500"
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-zinc-900 border border-zinc-700 rounded-lg text-white uppercase"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Discount Type</label>
                  <select
                    value={newPromoType}
                    onChange={(e) => setNewPromoType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                  >
                    <option value="fixed">Fixed INR (₹ Off)</option>
                    <option value="percent">Percentage (% Off)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPromoValue}
                    onChange={(e) => setNewPromoValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
                  >
                    + Add Coupon Code
                  </button>
                </div>
              </form>

              {/* Promo List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {promos.map((promo) => (
                  <div key={promo.code} className="bg-zinc-900/80 border border-white/[0.08] rounded-xl p-3.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-xs">{promo.code}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400">
                          {promo.type === 'fixed' ? `₹${promo.value} OFF` : `${promo.value}% OFF`}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 block mt-1">{promo.description}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleTogglePromo(promo.code)}
                        className={`p-1 rounded text-xs font-bold cursor-pointer ${
                          promo.active ? 'text-emerald-400 hover:text-emerald-300' : 'text-zinc-600 hover:text-zinc-400'
                        }`}
                        title={promo.active ? 'Disable' : 'Enable'}
                      >
                        {promo.active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePromo(promo.code)}
                        className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer"
                        title="Delete promo code"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: PORTFOLIO WORK & VIDEOS MANAGER                         */}
        {/* ============================================================== */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <AdminReelsPanel onReelsChanged={(updated) => setLiveReelsCount(updated.length)} />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: SITE SETTINGS & ANNOUNCEMENT BANNER                     */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl bg-[#0e0e14] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                <span>Site Contact & Announcement Banner</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Update your official WhatsApp number, phone, Instagram, and homepage banner offers.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-zinc-200 border-b border-white/[0.08] pb-2">
                  Contact & Social Information
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Raw WhatsApp Number (digits with country code)
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.rawWhatsAppNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, rawWhatsAppNumber: e.target.value })}
                      placeholder="916305729387"
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                    />
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Currently: {settingsForm.rawWhatsAppNumber}
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Display Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.displayPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, displayPhone: e.target.value })}
                      placeholder="+91 63057 29387"
                      className="w-full px-3 py-2 text-xs font-mono bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Instagram Profile URL
                    </label>
                    <input
                      type="url"
                      required
                      value={settingsForm.instagramUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Announcement Top Banner */}
              <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-[#ff2d2d]" />
                    <span>Top Promotional Announcement Banner</span>
                  </h4>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
                    <input
                      type="checkbox"
                      checked={settingsForm.banner.enabled}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        banner: { ...settingsForm.banner, enabled: e.target.checked }
                      })}
                      className="rounded text-[#ff2d2d] focus:ring-[#ff2d2d]"
                    />
                    <span>Show Banner on Website</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={settingsForm.banner.badge}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        banner: { ...settingsForm.banner, badge: e.target.value }
                      })}
                      placeholder="e.g. LIMITED OFFER"
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Coupon Code (Optional)</label>
                    <input
                      type="text"
                      value={settingsForm.banner.couponCode || ''}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        banner: { ...settingsForm.banner, couponCode: e.target.value.toUpperCase() }
                      })}
                      placeholder="FIRSTBROZZ"
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-zinc-900 border border-zinc-700 rounded-lg text-white uppercase"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-xs font-bold text-zinc-300 block mb-1">Banner Announcement Text</label>
                    <input
                      type="text"
                      value={settingsForm.banner.text}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        banner: { ...settingsForm.banner, text: e.target.value }
                      })}
                      placeholder="e.g. ⚡ Instant ₹500 OFF on your first 4K Reel! Use promo code FIRSTBROZZ on checkout."
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                {settingsSaved ? (
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>Settings Saved & Applied Live!</span>
                  </span>
                ) : (
                  <span className="text-zinc-500 text-xs">Click save to update public website instantly.</span>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#ff2d2d] hover:bg-[#e02424] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#ff2d2d]/30 cursor-pointer"
                >
                  Save Settings & Banner
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: HOW TO MANAGE GUIDE (NON-TECHNICAL OWNER MANUAL)        */}
        {/* ============================================================== */}
        {activeTab === 'guide' && (
          <div className="max-w-4xl bg-[#0e0e14] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Zero-Developer Owner Manual</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                How to Control Everything Yourself in 60 Seconds
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                You never have to pay or wait for a developer to update your packages, change prices, add portfolio reels, or handle bookings. Everything is automated.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Step 1: Packages */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#ff2d2d]/20 text-[#ff4b4b] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="text-sm font-bold text-white">Change Prices or Create New Packages</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Go to the <strong>Packages & Offers</strong> tab. Click any price or name to edit it directly. Click <strong>+ Add New Package</strong> to create festival or seasonal bundles. Changes reflect immediately on the website without rebuilding!
                </p>
              </div>

              {/* Step 2: Videos */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="text-sm font-bold text-white">Add New Videos & Reorder Portfolio</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Go to <strong>Portfolio Videos</strong>. Click <strong>+ Add New Video Reel</strong>. Paste your YouTube link, Vimeo link, Instagram reel link, or direct MP4 URL. Use the <strong>↑ and ↓</strong> buttons to move videos up or down, and the eye icon to temporarily hide or show any reel.
                </p>
              </div>

              {/* Step 3: Bookings */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="text-sm font-bold text-white">Approve Bookings & WhatsApp Clients</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  When a client requests a shoot on your site, it appears in <strong>Client Bookings</strong> as <em>Pending</em>. Click <strong>Approve Shoot</strong> to mark it Accepted, and click <strong>WhatsApp Accept Alert</strong> to send them an instant pre-written WhatsApp confirmation!
                </p>
              </div>

              {/* Step 4: WhatsApp & Banners */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h4 className="text-sm font-bold text-white">Update Phone & Launch Promo Banners</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Go to <strong>Site & Banner</strong>. You can update your official WhatsApp number (currently <code>916305729387</code>), Instagram URL, and edit or toggle the top announcement offer banner across the entire homepage.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: GOOGLE SHEETS INTEGRATION & SETUP GUIDE                 */}
        {/* ============================================================== */}
        {activeTab === 'sheets' && (
          <div className="max-w-4xl bg-[#0e0e14] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Google Sheets Live Database Integration</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                Connect Reels Brozz Directly to Google Sheets
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Whenever a client submits the booking form on your website, their booking is automatically appended as a new row into your Google Sheet!
              </p>
            </div>

            {/* Webhook URL Input */}
            <div className="p-5 bg-zinc-900 rounded-xl border border-white/[0.08] space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center justify-between">
                <span>1. Google Apps Script Webhook URL</span>
                {webhookUrl && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                    CONFIGURED
                  </span>
                )}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Paste your deployed Google Apps Script Web App URL below:
              </p>

              <form onSubmit={handleSaveWebhook} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="flex-1 px-3 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-lg text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    {webhookSaved ? 'Saved!' : 'Save Config'}
                  </button>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                    Optional Shared API Secret (matches Apps Script <code className="text-emerald-400">API_SECRET</code> property — for maximum security, set <code className="text-emerald-400">GOOGLE_SHEETS_WEBHOOK_URL</code> &amp; <code className="text-emerald-400">GOOGLE_SHEETS_SECRET</code> in server Secrets)
                  </label>
                  <input
                    type="password"
                    value={sheetSecret}
                    onChange={(e) => setSheetSecret(e.target.value)}
                    placeholder="Optional shared secret token"
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-lg text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </form>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">
                2. Copy the Free Google Apps Script (30 Seconds Setup)
              </h4>

              <div className="relative">
                <pre className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-64">
                  {googleAppsScriptCode}
                </pre>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(googleAppsScriptCode);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied Code!' : 'Copy Script'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-zinc-400">
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-white/[0.04]">
                  <span className="font-bold text-white block mb-1">Step 1</span>
                  Create a new Google Sheet named <strong className="text-emerald-400">Reels Brozz Bookings</strong>.
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-white/[0.04]">
                  <span className="font-bold text-white block mb-1">Step 2</span>
                  Click <strong className="text-white">Extensions → Apps Script</strong>, paste the copied code, and click Save.
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-white/[0.04]">
                  <span className="font-bold text-white block mb-1">Step 3</span>
                  Click <strong className="text-white">Deploy → New deployment → Web app</strong> (Access: Anyone). Copy URL above.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
