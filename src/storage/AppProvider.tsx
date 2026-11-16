import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '../types/content';
import { createBooking, parseBookings } from '../utils/booking';
import { findEvent } from '../data/catalog';

const BOOKINGS_KEY = '@archery/booking/v1';
const LEARNING_KEY = '@archery/saved-learning/v1';
const ONBOARDING_KEY = '@archery/onboarding/v1';
type AppState = {
  ready: boolean;
  error: string | null;
  onboarded: boolean;
  bookings: Booking[];
  savedResources: string[];
  toggleResource: (id: string) => Promise<void>;
  retry: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  reserve: (eventId: string, guests: number) => Promise<Booking>;
  cancel: (id: string) => Promise<void>;
};
const Context = createContext<AppState | null>(null);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const savedCurrent = useRef<string[]>([]);
  const current = useRef<Booking[]>([]);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const retry = useCallback(async () => {
    setError(null);
    try {
      const [saved, intro, learning] = await Promise.all([
        AsyncStorage.getItem(BOOKINGS_KEY),
        AsyncStorage.getItem(ONBOARDING_KEY),
        AsyncStorage.getItem(LEARNING_KEY),
      ]);
      const resourceIds: unknown = learning ? JSON.parse(learning) : [];
      if (
        !Array.isArray(resourceIds) ||
        !resourceIds.every(id => typeof id === 'string')
      ) {
        throw new Error('Saved resources are invalid.');
      }
      savedCurrent.current = [...new Set(resourceIds)];
      setSavedResources(savedCurrent.current);
      current.current = parseBookings(saved);
      setBookings(current.current);
      setOnboarded(intro === 'complete');
      setReady(true);
    } catch {
      setError(
        'Unable to read saved data. Your reservations have not been changed.',
      );
    }
  }, []);
  useEffect(() => {
    void retry();
  }, [retry]);
  function mutate<T>(operation: () => Promise<T>): Promise<T> {
    const next = queue.current.then(operation, operation);
    queue.current = next.catch(() => undefined);
    return next;
  }
  async function persist(next: Booking[]) {
    await AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
    current.current = next;
    setBookings(next);
  }
  async function reserve(eventId: string, guests: number) {
    return mutate(async () => {
      if (!findEvent(eventId)) {
        throw new Error('This event is no longer available.');
      }
      const existing = current.current.find(
        item => item.eventId === eventId && item.status === 'confirmed',
      );
      if (existing) {
        return existing;
      }
      const booking = createBooking(eventId, guests);
      await persist([booking, ...current.current]);
      return booking;
    });
  }
  async function cancel(id: string) {
    await mutate(async () => {
      await persist(
        current.current.map(item =>
          item.id === id ? { ...item, status: 'cancelled' } : item,
        ),
      );
    });
  }
  async function toggleResource(id: string) {
    await mutate(async () => {
      const next = savedCurrent.current.includes(id)
        ? savedCurrent.current.filter(value => value !== id)
        : [...savedCurrent.current, id];
      await AsyncStorage.setItem(LEARNING_KEY, JSON.stringify(next));
      savedCurrent.current = next;
      setSavedResources(next);
    });
  }
  async function completeOnboarding() {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'complete');
    setOnboarded(true);
  }
  return (
    <Context.Provider
      value={{
        ready,
        error,
        onboarded,
        bookings,
        savedResources,
        toggleResource,
        retry,
        completeOnboarding,
        reserve,
        cancel,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useApp() {
  const value = useContext(Context);
  if (!value) {
    throw new Error('AppProvider is required.');
  }
  return value;
}
