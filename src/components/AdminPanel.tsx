import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Play, 
  RotateCcw, 
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
  User,
  Mail,
  Send,
  RefreshCw,
  Tag,
  DollarSign,
  Settings,
  Megaphone
} from 'lucide-react';
import { 
  ReelItem, 
  addReel, 
  updateReel, 
  deleteReel, 
  resetReelsToDefault,
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
  getWhatsAppApprovalMessage
} from '../utils/bookingStore';
import { 
  DynamicPackage, 
  PromoOffer, 
  savePackagesToStorage, 
  savePromosToStorage,
  DEFAULT_PACKAGES 
} from '../utils/packageStore';
import { SiteConfig, saveSiteConfig, getWhatsAppUrl } from '../utils/siteConfigStore';
import { CITIES, formatINR } from '../utils/formatters';

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
  const [activeTab, setActiveTab] = useState<'bookings' | 'packages' | 'videos' | 'settings' | 'sheets'>('bookings');
  
  // Bookings management state
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [bookingCityFilter, setBookingCityFilter] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Google sheets webhook state
  const [webhookUrl, setWebhookUrl] = useState(() => getStoredWebhookUrl());
  const [webhookSaved, setWebhookSaved] = useState(false);

  // Video management state
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [previewItem, setPreviewItem] = useState<ReelItem | null>(null);
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    client: '',
    category: 'food',
    city: 'Delhi NCR',
    device: 'Samsung Galaxy S24 Ultra (4K 60fps)',
    turnaroundMinutes: 8,
    views: '450K Views',
    reachMultiplier: '+320% Footfall',
    audio: 'Trending Instagram Audio · 4K Sync',
    gradient: 'from-amber-950 via-zinc-950 to-black',
    tags: '#ReelsBrozz, #4KReel, #Trending',
    videoUrl: '',
  });

  // Package editing state
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
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
    features: ['10-Min Fast On-Site Turnaround', 'AI-assisted color grading'],
    active: true,
  });

  // Promo code state
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoValue, setNewPromoValue] = useState(500);
  const [newPromoType, setNewPromoType] = useState<'fixed' | 'percent'>('fixed');
  const [newPromoDesc, setNewPromoDesc] = useState('');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteConfig>(siteConfig);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Calculate booking metrics
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
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 3000);
  };

  // Package management actions
  const handleUpdateSinglePackage = (pkgId: string, updates: Partial<DynamicPackage>) => {
    const updated = packages.map((p) => {
      if (p.id === pkgId) {
        return { ...p, ...updates };
      }
      // If toggling popular, unset on other packages
      if (updates.isPopular) {
        return { ...p, isPopular: false };
      }
      return p;
    });
    onUpdatePackages(updated);
    savePackagesToStorage(updated);
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
      features: ['10-Min Fast On-Site Turnaround', 'AI-assisted color grading'],
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

  // Promo offer actions
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

  // Google Apps Script template for user
  const googleAppsScriptCode = `/**
 * Reels Brozz Google Sheet Auto-Sync Script
 * 1. Open Google Sheets -> Extensions -> Apps Script
 * 2. Paste this code and save
 * 3. Click "Deploy" -> "New deployment" -> Select type "Web app"
 * 4. Execute as: "Me" | Who has access: "Anyone"
 * 5. Copy the Web App URL and paste it into Reels Brozz Admin Panel!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Bookings");
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Bookings");
      sheet.appendRow([
        "Booking ID", 
        "Timestamp", 
        "Client Name", 
        "Phone", 
        "Email", 
        "City", 
        "Event Type", 
        "Event Date", 
        "Time Window", 
        "Package", 
        "Price (INR)", 
        "Location", 
        "Special Requirements", 
        "Status"
      ]);
    }
    
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.bookingId,
      data.timestamp || new Date().toLocaleString(),
      data.fullName,
      data.phone,
      data.email,
      data.city,
      data.eventType,
      data.eventDate,
      data.preferredTime,
      data.package,
      data.price,
      data.location,
      data.specialRequirements || "None",
      data.status || "Pending"
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      message: "Booking row added to Google Sheets successfully"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 font-sans pb-24">
      {/* Top Admin Studio Bar */}
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
                <span className="font-display font-extrabold text-white text-lg sm:text-xl">
                  REELS<span className="text-[#ff2d2d]">BROZZ</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ff2d2d]/20 text-[#ff7171] border border-[#ff2d2d]/40 uppercase">
                  Super Admin Studio
                </span>
              </div>
              <span className="text-xs text-zinc-400">
                Bookings, Packages, Pricing, Videos & Live Controls
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Instagram Link */}
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-950/40 border border-pink-500/30 text-pink-400 text-xs font-mono font-medium hover:bg-pink-900/40 transition-colors"
            >
              <span>{siteConfig.instagramHandle}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

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
              className="px-3 py-2 text-xs font-bold text-zinc-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Lock Admin Studio and log out"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Lock (mani@7)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-white bg-[#ff2d2d] hover:bg-[#e02424] rounded-lg transition-colors shadow-md cursor-pointer"
            >
              View Live Site
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-[#ff2d2d] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
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
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
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
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-[#ff2d2d] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Video className="w-4 h-4 text-sky-400" />
              <span>Portfolio Videos ({reels.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#ff2d2d] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span>Settings & Banner</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sheets')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Bookings CSV</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0e0e14] border border-white/[0.08] rounded-xl p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Total Client Bookings
            </span>
            <div className="text-2xl font-black text-white font-mono">{totalBookings}</div>
            <div className="text-[10px] text-zinc-500 mt-1">From public booking form</div>
          </div>

          <div className="bg-[#0e0e14] border border-amber-500/30 rounded-xl p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
              Pending Approvals
            </span>
            <div className="text-2xl font-black text-amber-400 font-mono">{pendingCount}</div>
            <div className="text-[10px] text-amber-300/80 mt-1">Requires 1-click accept</div>
          </div>

          <div className="bg-[#0e0e14] border border-emerald-500/30 rounded-xl p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Approved Shoots
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono">{approvedCount}</div>
            <div className="text-[10px] text-emerald-300/80 mt-1">Ready for creator dispatch</div>
          </div>

          <div className="bg-[#0e0e14] border border-[#ff2d2d]/30 rounded-xl p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5757] block mb-1">
              Estimated Pipeline Value
            </span>
            <div className="text-2xl font-black text-white font-mono">{formatINR(totalRevenueValue)}</div>
            <div className="text-[10px] text-zinc-400 mt-1">{completedCount} Shoots Completed</div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: CLIENT BOOKINGS & APPROVALS                             */}
        {/* ============================================================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="bg-[#0e0e14] border border-white/[0.08] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[240px] relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search client name, phone, city, venue, booking ID..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d2d]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Status:</span>
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none"
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
                  className="px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none"
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
                          getWhatsAppApprovalMessage(b.fullName)
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
                                    className="w-full p-1.5 text-[11px] bg-zinc-900 border border-zinc-700 rounded text-white"
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
                                  className="text-[10px] text-zinc-500 hover:text-zinc-300 block mt-2 underline"
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
                                    <span>Send WhatsApp Alert</span>
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
                                    <span>Notify Client</span>
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleMarkCompleted(b)}
                                    className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold"
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
                                    className="text-[11px] text-zinc-500 hover:text-zinc-300"
                                  >
                                    Reject
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBooking(b)}
                                  className="text-[11px] text-rose-500 hover:text-rose-400"
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
        {/* TAB 2: PACKAGES & OFFERS MANAGEMENT (NEW!)                     */}
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ff2d2d] hover:bg-[#e02424] text-white text-xs font-bold rounded-lg shadow-md cursor-pointer"
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
                      placeholder="e.g. VIP Club Night Special"
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
                  <button type="submit" className="px-5 py-2 bg-[#ff2d2d] text-white text-xs font-bold rounded-xl shadow-md">
                    Save New Package
                  </button>
                </div>
              </form>
            )}

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => {
                const isEditing = editingPackageId === pkg.id;

                return (
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
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              pkg.active !== false ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-500'
                            }`}
                            title="Toggle active status on website"
                          >
                            {pkg.active !== false ? 'Active' : 'Disabled'}
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="p-1 text-zinc-500 hover:text-rose-400"
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
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleUpdateSinglePackage(pkg.id, { isPopular: !pkg.isPopular })}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
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
                );
              })}
            </div>

            {/* Special Offers / Promo Discounts Manager */}
            <div className="bg-[#0e0e14] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#ff4b4b]" />
                    <span>Special Offers & Promo Discount Codes</span>
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Add discounts like "₹500 off" or "10% off". Clients can apply these in the booking form.
                  </p>
                </div>
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
                        className={`p-1 rounded text-xs font-bold ${
                          promo.active ? 'text-emerald-400 hover:text-emerald-300' : 'text-zinc-600 hover:text-zinc-400'
                        }`}
                        title={promo.active ? 'Disable' : 'Enable'}
                      >
                        {promo.active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePromo(promo.code)}
                        className="p-1 text-zinc-500 hover:text-rose-400"
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
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-sky-400" />
                  <span>Manage Portfolio Videos & Work</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Add, edit, reorder (Up/Down), or hide/show showcased 9:16 reels on the public website.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingVideo(!isAddingVideo)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ff2d2d] hover:bg-[#e02424] text-white text-xs font-bold rounded-lg shadow-md cursor-pointer"
                >
                  {isAddingVideo ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{isAddingVideo ? 'Close Form' : 'Add New Video Reel'}</span>
                </button>
              </div>
            </div>

            {/* Add New Reel Form */}
            {isAddingVideo && (
              <div className="bg-[#0e0e14] border border-[#ff2d2d]/40 rounded-2xl p-6 shadow-xl animate-in fade-in duration-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!videoFormData.title || !videoFormData.client) return;
                    const tagsArray = videoFormData.tags.split(',').map((t) => t.trim()).filter(Boolean);
                    const updated = addReel(
                      {
                        title: videoFormData.title,
                        client: videoFormData.client,
                        category: videoFormData.category,
                        city: videoFormData.city,
                        device: videoFormData.device,
                        turnaroundMinutes: Number(videoFormData.turnaroundMinutes) || 10,
                        views: videoFormData.views || '100K Views',
                        reachMultiplier: videoFormData.reachMultiplier || 'High Reach',
                        audio: videoFormData.audio || 'Trending Audio',
                        gradient: videoFormData.gradient,
                        tags: tagsArray.length > 0 ? tagsArray : ['#ReelsBrozz'],
                        videoUrl: videoFormData.videoUrl || undefined,
                      },
                      reels
                    );
                    onUpdateReels(updated);
                    setIsAddingVideo(false);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">Reel Title *</label>
                      <input
                        type="text"
                        required
                        value={videoFormData.title}
                        onChange={(e) => setVideoFormData({ ...videoFormData, title: e.target.value })}
                        placeholder="e.g. Sizzling Butter Tandoori Platter"
                        className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">Client Name *</label>
                      <input
                        type="text"
                        required
                        value={videoFormData.client}
                        onChange={(e) => setVideoFormData({ ...videoFormData, client: e.target.value })}
                        placeholder="e.g. Mughal Cafe Indiranagar"
                        className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">Category</label>
                      <select
                        value={videoFormData.category}
                        onChange={(e) => setVideoFormData({ ...videoFormData, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                      >
                        <option value="food">Food & Cafes</option>
                        <option value="weddings">Weddings & Celebrations</option>
                        <option value="fashion">Fashion & OOTD</option>
                        <option value="fitness">Fitness & Gyms</option>
                        <option value="products">D2C & Tech</option>
                        <option value="drone">Drone & Aerials</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">City</label>
                      <input
                        type="text"
                        value={videoFormData.city}
                        onChange={(e) => setVideoFormData({ ...videoFormData, city: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">Device & Setup</label>
                      <input
                        type="text"
                        value={videoFormData.device}
                        onChange={(e) => setVideoFormData({ ...videoFormData, device: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1">Video Link (YouTube / Instagram / MP4)</label>
                      <input
                        type="url"
                        value={videoFormData.videoUrl}
                        onChange={(e) => setVideoFormData({ ...videoFormData, videoUrl: e.target.value })}
                        placeholder="https://www.instagram.com/reel/... or https://..."
                        className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setIsAddingVideo(false)} className="px-4 py-2 text-xs text-zinc-400">
                      Cancel
                    </button>
                    <button type="submit" className="px-5 py-2 bg-[#ff2d2d] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer">
                      Save & Publish Reel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reels Grid with Reordering & Visibility Toggling */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reels.map((reel, idx) => (
                <div 
                  key={reel.id} 
                  className={`border rounded-2xl overflow-hidden p-5 flex flex-col justify-between transition-all ${
                    reel.hidden 
                      ? 'bg-zinc-950/40 border-zinc-800 opacity-60' 
                      : 'bg-[#0e0e14] border-white/[0.08]'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-mono text-emerald-400">{reel.views}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {/* Up button */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => onUpdateReels(moveReel(reel.id, 'up', reels))}
                          className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        
                        {/* Down button */}
                        <button
                          type="button"
                          disabled={idx === reels.length - 1}
                          onClick={() => onUpdateReels(moveReel(reel.id, 'down', reels))}
                          className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Visibility eye toggle */}
                        <button
                          type="button"
                          onClick={() => onUpdateReels(toggleReelVisibility(reel.id, reels))}
                          className={`p-1 rounded transition-colors ${
                            reel.hidden ? 'text-zinc-500 hover:text-zinc-300' : 'text-emerald-400 hover:text-emerald-300'
                          }`}
                          title={reel.hidden ? 'Show on website' : 'Hide from website'}
                        >
                          {reel.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-white text-sm mb-1">{reel.title}</h4>
                    <p className="text-xs text-zinc-400 mb-2">{reel.client} · {reel.city}</p>
                    <span className="text-[11px] font-mono text-[#ff7171]">{reel.device}</span>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] mt-4 flex justify-between items-center">
                    <span className="text-xs text-emerald-400">{reel.reachMultiplier}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateReels(deleteReel(reel.id, reels))}
                      className="text-rose-400 hover:text-rose-300 text-xs font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
                      Raw WhatsApp Number (digits only with country code)
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
        {/* TAB 5: GOOGLE SHEETS INTEGRATION & SETUP GUIDE                 */}
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

              <form onSubmit={handleSaveWebhook} className="flex gap-2">
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  className="flex-1 px-3 py-2 text-xs bg-zinc-950 border border-zinc-700 rounded-lg text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {webhookSaved ? 'Saved!' : 'Save Webhook'}
                </button>
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
