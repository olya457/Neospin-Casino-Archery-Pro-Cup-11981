import { Booking, Event } from '../types/content';

export const MAX_GUESTS = 10;
export const formatDate = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
export const eventEnded = (event: Event, now = Date.now()) => {
  const end = event.time.split('–')[1] || event.time;
  return new Date(`${event.date}T${end}:00`).getTime() < now;
};
export const isUpcoming = (booking: Booking, event: Event, now = Date.now()) =>
  booking.status === 'confirmed' && !eventEnded(event, now);
export function validateGuests(guests: number) {
  if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
    throw new Error('Choose between 1 and 10 guests.');
  }
}
export function createBooking(eventId: string, guests: number): Booking {
  validateGuests(guests);
  return {
    id: `WAMC-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 10)
      .toUpperCase()}`,
    eventId,
    guests,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
}
export function ticketPayload(booking: Booking, event: Event) {
  return JSON.stringify({
    version: 1,
    reservation: booking.id,
    event: event.id,
    date: event.date,
    time: event.time,
    guests: booking.guests,
  });
}
export function parseBookings(raw: string | null): Booking[] {
  if (!raw) {
    return [];
  }
  const value: unknown = JSON.parse(raw);
  if (
    !Array.isArray(value) ||
    value.some(
      item =>
        !item ||
        typeof item.id !== 'string' ||
        typeof item.eventId !== 'string' ||
        !Number.isInteger(item.guests) ||
        item.guests < 1 ||
        item.guests > MAX_GUESTS ||
        !['confirmed', 'cancelled'].includes(item.status) ||
        typeof item.createdAt !== 'string',
    )
  ) {
    throw new Error('Saved reservations could not be read. Please retry.');
  }
  return value;
}
