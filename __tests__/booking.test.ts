import {
  createBooking,
  isUpcoming,
  parseBookings,
  ticketPayload,
  validateGuests,
} from '../src/utils/booking';
import { events, guides, venues, findVenue } from '../src/data/catalog';

test('guest limits reject invalid values', () => {
  for (const count of [0, -1, 11, 1.5, NaN]) {
    expect(() => validateGuests(count)).toThrow();
  }
  expect(() => validateGuests(1)).not.toThrow();
  expect(() => validateGuests(10)).not.toThrow();
});
test('ticket payload encodes the actual reservation', () => {
  const event = events[0];
  const booking = createBooking(event.id, 4);
  expect(JSON.parse(ticketPayload(booking, event))).toMatchObject({
    reservation: booking.id,
    event: event.id,
    guests: 4,
    date: event.date,
  });
  expect(parseBookings(JSON.stringify([booking]))).toEqual([booking]);
});
test('past and cancelled reservations are not upcoming', () => {
  const event = events[0];
  const booking = createBooking(event.id, 1);
  const before = new Date('2026-09-19T12:00:00').getTime();
  const after = new Date('2026-09-22T12:00:00').getTime();
  expect(isUpcoming(booking, event, before)).toBe(true);
  expect(isUpcoming(booking, event, after)).toBe(false);
  expect(isUpcoming({ ...booking, status: 'cancelled' }, event, before)).toBe(
    false,
  );
});
test('all supplied content is linked to a venue and complete', () => {
  expect(events).toHaveLength(16);
  expect(guides).toHaveLength(12);
  expect(venues).toHaveLength(11);
  for (const event of events) {
    expect(findVenue(event.location)).toBeDefined();
    expect(event.program.length).toBeGreaterThan(0);
    expect(event.title).not.toContain('Location:');
  }
  for (const guide of guides) {
    expect(guide.sections.length).toBeGreaterThan(0);
  }
});
