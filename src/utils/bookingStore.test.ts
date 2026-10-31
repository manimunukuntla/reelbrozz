import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  createBooking, 
  updateBookingStatus, 
  updateBookingNotes, 
  deleteBooking, 
  exportBookingsToCSV,
  INITIAL_CLIENT_BOOKINGS 
} from './bookingStore';

test('createBooking adds a pending booking with generated ID and timestamps', () => {
  const input = {
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

  const initialList = [...INITIAL_CLIENT_BOOKINGS];
  const { newBooking, updatedList } = createBooking(input, initialList);

  assert.equal(updatedList.length, initialList.length + 1);
  assert.equal(newBooking.status, 'Pending');
  assert.ok(newBooking.id.startsWith('RB-'));
  assert.equal(newBooking.fullName, 'Test Client');
});

test('updateBookingStatus switches status to Approved and updates updatedAt', () => {
  const initialList = [...INITIAL_CLIENT_BOOKINGS];
  const targetId = initialList[0].id;

  const updated = updateBookingStatus(targetId, 'Approved', 'Approved by Mani on call', initialList);
  const found = updated.find((b) => b.id === targetId);

  assert.ok(found);
  assert.equal(found?.status, 'Approved');
  assert.equal(found?.adminNotes, 'Approved by Mani on call');
});

test('exportBookingsToCSV generates CSV string with expected columns', () => {
  const csv = exportBookingsToCSV(INITIAL_CLIENT_BOOKINGS);
  assert.ok(csv.includes('Booking ID,Date of Request,Client Name'));
  assert.ok(csv.includes('Aditya Singhania'));
  assert.ok(csv.includes('Pending'));
});
