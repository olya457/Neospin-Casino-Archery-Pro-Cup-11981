import { AdaptiveGrid } from '../hooks/useLayout';
import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  CalendarDays,
  Clock3,
  MapPin,
  ShieldCheck,
  Trophy,
  Users,
} from 'lucide-react-native';
import { events, findEvent, findVenue } from '../data/catalog';
import { images } from '../data/images';
import { colors, styles as s } from '../theme';
import { Navigation, RootParams } from '../navigation/types';
import {
  Button,
  Card,
  Empty,
  Hero,
  InfoRow,
  Page,
  Partner,
  SectionTitle,
} from '../components/UI';
import { EventCard } from '../components/EventCard';
import { formatDate } from '../utils/booking';
import { useApp } from '../storage/AppProvider';

function EventListScreen({ kind }: { kind: 'championship' | 'workshop' }) {
  const navigation = useNavigation<Navigation>();
  const workshop = kind === 'workshop';
  const items = events.filter(event => event.kind === kind);
  return (
    <Page
      title={workshop ? 'Workshops' : 'Championships'}
      eyebrow="Masters Cup · 2026"
      bookings
    >
      <Hero
        image={images.entrance}
        badge="Organized by Neospin Casino"
        title={workshop ? 'Archery Workshops' : 'World Archery Masters Cup'}
        subtitle={
          workshop
            ? 'Learn from Professional Archery Instructors'
            : 'Experience the Precision of Champions'
        }
        height={390}
      />
      <View style={s.content}>
        <Text style={s.body}>
          {workshop
            ? 'Explore interactive workshops, discover essential archery techniques, and learn about professional equipment in supervised sessions.'
            : 'Discover international competitions, professional tournaments, traditional bow demonstrations, and championship finals.'}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 22,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.border,
          }}
        >
          {[
            [String(items.length), workshop ? 'Sessions' : 'Competitions'],
            ['2', 'Festival days'],
            ['Free', 'Entry with QR'],
          ].map(([value, label], index) => (
            <View
              key={label}
              style={{
                flex: 1,
                alignItems: 'center',
                gap: 7,
                borderLeftWidth: index ? 1 : 0,
                borderColor: colors.border,
                paddingHorizontal: 4,
              }}
            >
              <Text
                style={{ color: colors.green, fontWeight: '800', fontSize: 20 }}
              >
                {value}
              </Text>
              <Text
                style={{
                  fontSize: 8,
                  color: colors.muted,
                  textTransform: 'uppercase',
                  textAlign: 'center',
                }}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>
        <SectionTitle
          label="September 20–21, 2026"
          title={workshop ? 'Available Workshops' : 'Championship Program'}
          count={items.length}
        />
        <AdaptiveGrid>
          {items.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() =>
                navigation.navigate('EventDetails', { eventId: event.id })
              }
            />
          ))}
        </AdaptiveGrid>
        <Partner />
      </View>
    </Page>
  );
}
export function ChampionshipsScreen() {
  return <EventListScreen kind="championship" />;
}
export function WorkshopsScreen() {
  return <EventListScreen kind="workshop" />;
}
export function EventDetailsScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootParams, 'EventDetails'>) {
  const event = findEvent(route.params.eventId);
  const { bookings } = useApp();
  if (!event) {
    return (
      <Page title="Event Details" back>
        <Empty
          title="Event not found"
          description="Return to the festival program to choose another event."
        />
      </Page>
    );
  }
  const workshop = event.kind === 'workshop';
  const venue = findVenue(event.location);
  const booking = bookings.find(
    item => item.eventId === event.id && item.status === 'confirmed',
  );
  return (
    <Page title={workshop ? 'Workshop Details' : 'Event Details'} back split>
      <Hero
        image={images[event.image]}
        title={event.title}
        subtitle={event.description}
        badge={workshop ? 'Practical session' : event.category}
      />
      <View style={s.content}>
        <Text style={s.label}>Organized by Neospin Casino</Text>
        <Text style={s.body}>{event.introduction}</Text>
        <Card>
          <InfoRow
            icon={<CalendarDays color={colors.green} size={17} />}
            text={formatDate(event.date)}
          />
          <InfoRow
            icon={<Clock3 color={colors.green} size={17} />}
            text={`${event.time} · ${event.duration}`}
          />
          <InfoRow
            icon={<MapPin color={colors.green} size={17} />}
            text={event.location}
          />
          <InfoRow
            icon={<Users color={colors.green} size={17} />}
            text={`${event.category}${event.age ? ` · Age ${event.age}` : ''}`}
          />
        </Card>
        {venue && (
          <Button
            title="View on Arena Map"
            secondary
            onPress={() =>
              navigation.navigate('Main', {
                screen: 'ArenaMap',
                params: { venueId: venue.id },
              })
            }
          />
        )}
        <SectionTitle
          label="Event format"
          title={workshop ? 'Session experience' : 'Competition details'}
        />
        <Card>
          <InfoRow
            icon={<Trophy color={colors.green} size={20} />}
            text={event.highlights || event.equipment}
          />
        </Card>
        <SectionTitle label="Program" title="What to expect" />
        <Card>
          {event.program.map((line, index) => (
            <View key={line} style={{ gap: 16 }}>
              {index > 0 && <View style={s.divider} />}
              <View style={[s.row, { alignItems: 'flex-start' }]}>
                <Text style={[s.label, { letterSpacing: 0, paddingTop: 4 }]}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <Text style={[s.body, { flex: 1 }]}>{line}</Text>
              </View>
            </View>
          ))}
        </Card>
        {event.learns.length > 0 && (
          <>
            <SectionTitle label="Learn & explore" title="What you will learn" />
            <Card>
              {event.learns.map(line => (
                <Text key={line} style={s.body}>
                  • {line}
                </Text>
              ))}
            </Card>
          </>
        )}
        <Card style={{ backgroundColor: '#182212' }}>
          <InfoRow
            icon={<ShieldCheck color={colors.green} size={22} />}
            text={`Visitor information\n${
              event.requirements ||
              'Please arrive before the scheduled event. Follow venue signals and remain behind spectator barriers.'
            }`}
          />
        </Card>
        <View style={{ gap: 14 }}>
          <Text style={s.label}>Reservation</Text>
          <Text style={s.body}>
            Free admission · Up to 10 guests per reservation
          </Text>
          <Button
            title={booking ? 'View My QR Ticket' : 'Book Now'}
            onPress={() =>
              booking
                ? navigation.navigate('Ticket', { bookingId: booking.id })
                : navigation.navigate('Reserve', { eventId: event.id })
            }
          />
        </View>
      </View>
    </Page>
  );
}
