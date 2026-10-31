/**
 * Client Bookings and Shoot Approvals Store for Reels Brozz
 */

export type BookingStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed';

export interface ClientBooking {
  id: string;
  createdAt: number;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  eventType: string;
  eventDate: string;
  preferredTime: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  venueLocation: string;
  specialRequirements?: string;
  status: BookingStatus;
  adminNotes?: string;
  assignedCreatorName?: string;
  updatedAt: number;
}

const STORAGE_KEY = 'reelsbrozz_client_bookings_v1';
const GOOGLE_SHEETS_WEBHOOK_KEY = 'reelsbrozz_gsheet_webhook_url';

export const INITIAL_CLIENT_BOOKINGS: ClientBooking[] = [
  {
    id: 'RB-829104',
    createdAt: Date.now() - 1000 * 60 * 25, // 25 mins ago
    fullName: 'Aditya Singhania',
    phone: '+91 98201 44552',
    email: 'aditya@brewroastery.in',
    city: 'Mumbai',
    eventType: 'Cafe / Food Menu Sizzler',
    eventDate: '2026-11-02',
    preferredTime: '11:00 AM – 1:00 PM',
    packageId: 'quick-reel',
    packageName: 'Quick Reel (₹1,500)',
    packagePrice: 1500,
    venueLocation: 'Bandra West, Hill Road, Cafe Roast',
    specialRequirements: 'Want slow-mo shots of espresso extraction and croissant steam.',
    status: 'Pending',
    adminNotes: 'High intent cafe client. Prepare 60fps slow-mo gimbal rig.',
    updatedAt: Date.now() - 1000 * 60 * 25,
  },
  {
    id: 'RB-719382',
    createdAt: Date.now() - 1000 * 60 * 90, // 1.5 hours ago
    fullName: 'Pooja & Sameer Malhotra',
    phone: '+91 98112 33441',
    email: 'pooja.wedding@gmail.com',
    city: 'Delhi NCR',
    eventType: 'Wedding / Sangeet / Haldi',
    eventDate: '2026-11-08',
    preferredTime: '5:00 PM – 10:00 PM',
    packageId: 'wedding-basic',
    packageName: 'Wedding & Sangeet Express (₹7,999)',
    packagePrice: 7999,
    venueLocation: 'The Grand Vasant Kunj, New Delhi',
    specialRequirements: 'Need 5 reels delivered same night before afterparty ends.',
    status: 'Pending',
    adminNotes: 'Client wants drone shots if outdoor venue permits.',
    updatedAt: Date.now() - 1000 * 60 * 90,
  },
  {
    id: 'RB-650123',
    createdAt: Date.now() - 1000 * 60 * 240, // 4 hours ago
    fullName: 'Vikrant Roy',
    phone: '+91 97410 88219',
    email: 'vikrant@alphagym.co',
    city: 'Bengaluru',
    eventType: 'Gym / Fitness Athletic',
    eventDate: '2026-11-04',
    preferredTime: '7:00 AM – 10:00 AM',
    packageId: 'half-day',
    packageName: 'Half Day Shoot (₹3,999)',
    packagePrice: 3999,
    venueLocation: 'Indiranagar 100ft Road, Bengaluru',
    specialRequirements: 'Deadlift PR chalk bursts and rapid athletic transition reels.',
    status: 'Approved',
    adminNotes: 'Assigned to creator Karthik R (S24 Ultra 4K 60fps). Approved on WhatsApp.',
    assignedCreatorName: 'Karthik R (★ 4.9)',
    updatedAt: Date.now() - 1000 * 60 * 180,
  },
  {
    id: 'RB-542190',
    createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    fullName: 'Meera Nambiar',
    phone: '+91 98450 77123',
    email: 'meera@nambiarfashion.com',
    city: 'Bengaluru',
    eventType: 'Fashion / OOTD Lookbook',
    eventDate: '2026-10-30',
    preferredTime: '3:00 PM – 6:00 PM',
    packageId: 'half-day',
    packageName: 'Half Day Shoot (₹3,999)',
    packagePrice: 3999,
    venueLocation: 'Koramangala 4th Block, Studio 12',
    specialRequirements: 'Autumn oversized drop lookbook. Delivered 3 reels in 10 mins each.',
    status: 'Completed',
    adminNotes: 'Delivered successfully. Client posted reels; crossed 120K views.',
    assignedCreatorName: 'Sanjay Nair (★ 5.0)',
    updatedAt: Date.now() - 1000 * 60 * 60 * 12,
  },
];

export function loadBookingsFromStorage(): ClientBooking[] {
  if (typeof window === 'undefined') return INITIAL_CLIENT_BOOKINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveBookingsToStorage(INITIAL_CLIENT_BOOKINGS);
      return INITIAL_CLIENT_BOOKINGS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_CLIENT_BOOKINGS;
  } catch (err) {
    console.error('Error reading bookings from storage:', err);
    return INITIAL_CLIENT_BOOKINGS;
  }
}

export function saveBookingsToStorage(bookings: ClientBooking[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch (err) {
    console.error('Error saving bookings:', err);
  }
}

export function createBooking(
  input: Omit<ClientBooking, 'id' | 'createdAt' | 'status' | 'updatedAt'>,
  existingList: ClientBooking[] = []
): { newBooking: ClientBooking; updatedList: ClientBooking[] } {
  const newBooking: ClientBooking = {
    ...input,
    id: `RB-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: Date.now(),
    status: 'Pending',
    updatedAt: Date.now(),
  };

  const updatedList = [newBooking, ...existingList];
  saveBookingsToStorage(updatedList);

  // Background trigger Google Sheets webhook if configured
  triggerGoogleSheetSync(newBooking).catch(() => {});

  return { newBooking, updatedList };
}

export function updateBookingStatus(
  bookingId: string,
  newStatus: BookingStatus,
  note?: string,
  existingList: ClientBooking[] = []
): ClientBooking[] {
  const updatedList = existingList.map((b) => {
    if (b.id === bookingId) {
      return {
        ...b,
        status: newStatus,
        adminNotes: note !== undefined ? note : b.adminNotes,
        updatedAt: Date.now(),
      };
    }
    return b;
  });
  saveBookingsToStorage(updatedList);
  return updatedList;
}

export function updateBookingNotes(
  bookingId: string,
  adminNotes: string,
  existingList: ClientBooking[] = []
): ClientBooking[] {
  const updatedList = existingList.map((b) => {
    if (b.id === bookingId) {
      return {
        ...b,
        adminNotes,
        updatedAt: Date.now(),
      };
    }
    return b;
  });
  saveBookingsToStorage(updatedList);
  return updatedList;
}

export function deleteBooking(
  bookingId: string,
  existingList: ClientBooking[] = []
): ClientBooking[] {
  const updatedList = existingList.filter((b) => b.id !== bookingId);
  saveBookingsToStorage(updatedList);
  return updatedList;
}

export function getStoredWebhookUrl(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(GOOGLE_SHEETS_WEBHOOK_KEY) || '';
  } catch {
    return '';
  }
}

export function saveStoredWebhookUrl(url: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GOOGLE_SHEETS_WEBHOOK_KEY, url.trim());
  } catch (err) {
    console.error('Error saving webhook URL:', err);
  }
}

export async function triggerGoogleSheetSync(booking: ClientBooking): Promise<boolean> {
  const webhookUrl = getStoredWebhookUrl();
  if (!webhookUrl) return false;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors', // standard for Google Apps Script Web App endpoints
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingId: booking.id,
        timestamp: new Date(booking.createdAt).toISOString(),
        fullName: booking.fullName,
        phone: booking.phone,
        email: booking.email,
        city: booking.city,
        eventType: booking.eventType,
        eventDate: booking.eventDate,
        preferredTime: booking.preferredTime,
        package: booking.packageName,
        price: booking.packagePrice,
        location: booking.venueLocation,
        specialRequirements: booking.specialRequirements || 'None',
        status: booking.status,
      }),
    });
    return true;
  } catch (err) {
    console.warn('Google Sheet Webhook sync attempted:', err);
    return false;
  }
}

export function exportBookingsToCSV(bookings: ClientBooking[]): string {
  const headers = [
    'Booking ID',
    'Date of Request',
    'Client Name',
    'Phone',
    'Email',
    'City',
    'Event Type',
    'Event Date',
    'Time Window',
    'Package',
    'Price (INR)',
    'Venue Location',
    'Special Requirements',
    'Status',
    'Admin Notes',
  ];

  const rows = bookings.map((b) => [
    `"${b.id}"`,
    `"${new Date(b.createdAt).toLocaleString('en-IN')}"`,
    `"${b.fullName.replace(/"/g, '""')}"`,
    `"${b.phone}"`,
    `"${b.email}"`,
    `"${b.city}"`,
    `"${b.eventType}"`,
    `"${b.eventDate}"`,
    `"${b.preferredTime}"`,
    `"${b.packageName.replace(/"/g, '""')}"`,
    `"${b.packagePrice}"`,
    `"${b.venueLocation.replace(/"/g, '""')}"`,
    `"${(b.specialRequirements || '').replace(/"/g, '""')}"`,
    `"${b.status}"`,
    `"${(b.adminNotes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function getWhatsAppApprovalMessage(clientName: string, bookingId?: string): string {
  if (bookingId) {
    return `Hi ${clientName}, your shoot request (${bookingId}) has been accepted by Reels Brozz. We will assign a creator soon.`;
  }
  return `Hi ${clientName}, your shoot request has been accepted by Reels Brozz. We will assign a creator soon.`;
}

