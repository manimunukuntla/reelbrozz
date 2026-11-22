import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  createBooking,
  updateBookingStatus,
  loadBookingsFromStorage,
  exportBookingsToCSV,
  INITIAL_CLIENT_BOOKINGS,
} from './bookingStore';

const storage = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, val: string) => storage.set(key, val),
  removeItem: (key: string) => storage.delete(key),
  clear: () => storage.clear(),
};

(globalThis as any).window = { localStorage: mockLocalStorage };
(globalThis as any).localStorage = mockLocalStorage;

beforeEach(() => {
  storage.clear();
});

const SAMPLE_INPUT = {
  fullName: 'Test Client',
  phone: '+91 99887 76655',
  email: 'test@client.com',
  city: 'Hyderabad',
  eventType: 'Cafe / Food Menu Sizzler',
  eventDate: '2026-11-05',
  preferredTime: '12:00 PM – 2:00 PM',
  packageId: 'quick-reel',
  packageName: 'Quick Reel (₹1,500)',
  packagePrice: 1500,
  venueLocation: 'Jubilee Hills, Road 36',
  specialRequirements: 'Macro shots',
};

test('createBooking appends without overwriting existing persisted bookings when existingList is omitted', () => {
  const baseline = loadBookingsFromStorage();
  const baseCount = baseline.length;

  const first = createBooking({ ...SAMPLE_INPUT, fullName: 'First New Client' });
  assert.equal(first.updatedList.length, baseCount + 1);

  const second = createBooking({ ...SAMPLE_INPUT, fullName: 'Second New Client' });
  assert.equal(second.updatedList.length, baseCount + 2);

  const persisted = loadBookingsFromStorage();
  assert.equal(persisted.length, baseCount + 2);
  assert.ok(persisted.some((b) => b.fullName === 'First New Client'));
  assert.ok(persisted.some((b) => b.fullName === 'Second New Client'));
  assert.ok(persisted.some((b) => b.fullName === INITIAL_CLIENT_BOOKINGS[0].fullName));
});

test('updateBookingStatus switches status to Approved and updates ONLY the targeted booking row', () => {
  const initialList = [...INITIAL_CLIENT_BOOKINGS];
  const targetId = initialList[0].id;
  const untouchedId = initialList[1].id;
  const untouchedStatus = initialList[1].status;

  const updated = updateBookingStatus(targetId, 'Approved', 'Approved by Mani on call', initialList);
  const found = updated.find((b) => b.id === targetId);
  const untouched = updated.find((b) => b.id === untouchedId);

  assert.ok(found);
  assert.equal(found?.status, 'Approved');
  assert.equal(found?.adminNotes, 'Approved by Mani on call');
  assert.equal(untouched?.status, untouchedStatus);
});

test('exportBookingsToCSV generates expected columns and neutralizes formula injection', () => {
  const maliciousBooking = {
    ...INITIAL_CLIENT_BOOKINGS[0],
    fullName: '=HYPERLINK("http://evil.example","Click")',
  };
  const csv = exportBookingsToCSV([maliciousBooking]);
  assert.ok(csv.includes('Booking ID,Date of Request,Client Name'));
  assert.ok(csv.includes("'=HYPERLINK("));
});
