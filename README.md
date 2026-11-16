# Neospin Archery Pro

React Native 0.86 application with TypeScript, React Navigation, local festival content and offline reservations.

## Run

Use Node.js 22.11 or newer. iOS dependencies require a modern Ruby installation with Bundler 4; this project was verified using Ruby 3.4.

```sh
npm install
bundle install
cd ios && bundle exec pod install && cd ..
npm start
```

In another terminal, run `npm run ios` or `npm run android`.

## Application

- Four-second WebView loading animation and first-launch onboarding.
- Championships and workshops with the supplied descriptions, schedules and participation requirements.
- Guest selection, saved reservations, cancellation and locally generated QR tickets.
- Rules and equipment guides with the complete supplied content.
- Illustrated venue map with category filters, zoom, pan and linked activities.
- English-language learning library: six articles and two videos, searchable by text, topic and format, with persistent bookmarks. Sources: World Archery, Archery Canada and Archery 360.
- Empty initial booking history and reading list; no seeded user records.
- All images are bundled from `src/assets`, named `archery-pro-*`. External resources open in the browser or YouTube; no external images are downloaded.
- Page entrance, button press and target-pulse animations respect Reduce Motion and stop when their screens lose focus.
- Layouts respond to actual content width, orientation and text scaling. Compact screens use one column; expanded windows use two-column lists and detail views, with a centered floating icon navigation bar.

## Structure

- `src/components`: shared interface elements, event and ticket cards.
- `src/screens`: launch, program, bookings, guides and venue screens.
- `src/navigation`: typed stack and bottom-tab navigation.
- `src/data`: local image registry and supplied festival content.
- `src/storage`: AsyncStorage hydration and serialized reservation writes.
- `src/theme`: shared colors and styles.
- `src/types`, `src/utils`: content types, date and ticket helpers.

Festival dates remain September 20–21, 2026, as supplied in the designs. Reservations for elapsed dates appear in Past. Update the event dates in `src/data/festival-content.json` and the festival heading in `src/screens/EventScreens.tsx` when the organizer supplies a new schedule.

Reservations and QR codes are local records on one device. No organizer server, shared capacity service, gate validation or cross-device synchronization is configured. Cancelled tickets no longer display a scannable code. Removing the app removes its local reservations.

## iPhone Duo

iOS uses a scene-based window and supports portrait and landscape. Build with Xcode 27.1 / iOS 27.1 SDK for iPhone Duo. Layouts update on window-size changes without resetting navigation, form selections or saved data. Side safe areas are respected; larger accessibility text switches grids back to a single column.

## Checks

```sh
npx tsc --noEmit
npm run lint
npm test -- --runInBand
```
