import catalog from './festival-content.json';
import { Event, Guide, Venue } from '../types/content';
export const events = catalog.events as Event[];
export const guides = catalog.guides as Guide[];
export const venues = catalog.venues as Venue[];
export const findEvent = (id: string) => events.find(event => event.id === id);
export const findVenue = (name: string) =>
  venues.find(
    venue =>
      venue.title === name ||
      (name === 'Precision Training Area' && venue.title === 'Training Field'),
  );
