import React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider, useApp } from '../src/storage/AppProvider';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
let state: ReturnType<typeof useApp>;
function Probe() {
  state = useApp();
  return null;
}
let renderer: ReactTestRenderer;
async function mount() {
  await act(async () => {
    renderer = create(
      <AppProvider>
        <Probe />
      </AppProvider>,
    );
  });
}
beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
});
afterEach(async () => {
  if (renderer) {
    await act(async () => renderer.unmount());
  }
});
it('starts with no reservations and persists onboarding', async () => {
  await mount();
  expect(state.ready).toBe(true);
  expect(state.bookings).toEqual([]);
  expect(state.onboarded).toBe(false);
  await act(async () => state.completeOnboarding());
  expect(await AsyncStorage.getItem('@archery/onboarding/v1')).toBe('complete');
});
it('persists guest count, prevents duplicate bookings and restores cancellation', async () => {
  await mount();
  await act(async () => {
    await Promise.all([
      state.reserve('championship-1', 3),
      state.reserve('championship-1', 3),
    ]);
  });
  expect(state.bookings).toHaveLength(1);
  expect(state.bookings[0].guests).toBe(3);
  const id = state.bookings[0].id;
  await act(async () => state.cancel(id));
  await act(async () => renderer.unmount());
  await mount();
  expect(state.bookings[0]).toMatchObject({
    id,
    guests: 3,
    status: 'cancelled',
  });
});
it('does not confirm a booking when persistence fails', async () => {
  await mount();
  jest
    .mocked(AsyncStorage.setItem)
    .mockRejectedValueOnce(new Error('Disk full'));
  await act(async () => {
    await expect(state.reserve('workshop-1', 2)).rejects.toThrow('Disk full');
  });
  expect(state.bookings).toEqual([]);
});
it('preserves unreadable storage and exposes a retry state', async () => {
  await AsyncStorage.setItem('@archery/booking/v1', '{bad-json');
  await mount();
  expect(state.ready).toBe(false);
  expect(state.error).toBeTruthy();
  expect(await AsyncStorage.getItem('@archery/booking/v1')).toBe('{bad-json');
});

it('persists bookmarks across remounts and serializes simultaneous changes', async () => {
  await mount();
  expect(state.savedResources).toEqual([]);
  await act(async () => {
    await Promise.all([
      state.toggleResource('recurve-guide'),
      state.toggleResource('getting-started'),
    ]);
  });
  await act(async () => renderer.unmount());
  await mount();
  expect(state.savedResources).toEqual(['recurve-guide', 'getting-started']);
  await act(async () => {
    await Promise.all([
      state.toggleResource('recurve-guide'),
      state.toggleResource('recurve-guide'),
    ]);
  });
  expect(state.savedResources).toEqual(['getting-started', 'recurve-guide']);
});
it('keeps saved resources unchanged on storage failure and permits retry', async () => {
  await mount();
  jest
    .mocked(AsyncStorage.setItem)
    .mockRejectedValueOnce(new Error('Disk full'));
  await act(async () => {
    await expect(state.toggleResource('recurve-guide')).rejects.toThrow(
      'Disk full',
    );
  });
  expect(state.savedResources).toEqual([]);
  await act(async () => state.toggleResource('recurve-guide'));
  expect(state.savedResources).toEqual(['recurve-guide']);
});
