import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
export type TabParams = {
  Championships: undefined;
  Rules: undefined;
  ArenaMap: { venueId?: string } | undefined;
  Technology: undefined;
  Workshops: undefined;
  Learn: undefined;
};
export type RootParams = {
  Main: NavigatorScreenParams<TabParams> | undefined;
  EventDetails: { eventId: string };
  Reserve: { eventId: string };
  Ticket: { bookingId: string; justBooked?: boolean };
  Bookings: undefined;
  Guide: { guideId: string };
  Venue: { venueId: string };
  Resource: { resourceId: string };
};
export type Navigation = NativeStackNavigationProp<RootParams>;
