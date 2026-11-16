import { Photo } from '../components/Photo';
import React, { useRef, useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Check,
  Info,
  Minus,
  Plus,
  ShieldCheck,
  Ticket,
} from 'lucide-react-native';
import LinearGradient from '../components/Gradient';
import { RootParams } from '../navigation/types';
import { useApp } from '../storage/AppProvider';
import { findEvent } from '../data/catalog';
import { images } from '../data/images';
import { colors, styles as s } from '../theme';
import {
  Badge,
  Button,
  Card,
  Empty,
  Footer,
  InfoRow,
  Page,
} from '../components/UI';
import { AdaptiveGrid } from '../hooks/useLayout';
import { Reveal } from '../components/Motion';
import { TicketCard } from '../components/TicketCard';
import { formatDate, isUpcoming, MAX_GUESTS } from '../utils/booking';

export function ReserveScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootParams, 'Reserve'>) {
  const event = findEvent(route.params.eventId);
  const [guests, setGuests] = useState(1);
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const { reserve } = useApp();
  if (!event) {
    return (
      <Page title="Reserve Places" back>
        <Empty
          title="Event not found"
          description="Please select an event from the program."
        />
      </Page>
    );
  }
  async function confirm() {
    if (submitting.current || !event) {
      return;
    }
    submitting.current = true;
    setBusy(true);
    try {
      const booking = await reserve(event.id, guests);
      navigation.replace('Ticket', { bookingId: booking.id, justBooked: true });
    } catch {
      Alert.alert(
        'Reservation not saved',
        'Unable to save your reservation on this device. Please try again.',
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  return (
    <Page title="Reserve Places" eyebrow="STEP 1 OF 1" back>
      <View
        style={[
          s.content,
          { maxWidth: 600, alignSelf: 'center', width: '100%' },
        ]}
      >
        <Card>
          <View style={[s.row, { alignItems: 'stretch' }]}>
            <Image
              source={images[event.image]}
              style={{ width: 85, height: 115, borderRadius: 10 }}
            />
            <View style={{ flex: 1, gap: 10, paddingVertical: 6 }}>
              <Text style={s.label}>{event.kind}</Text>
              <Text style={{ fontSize: 17, color: colors.text }}>
                {event.title}
              </Text>
              <Text
                style={{ fontSize: 10, color: colors.muted, lineHeight: 18 }}
              >
                {formatDate(event.date)} · {event.time}
                {'\n'}
                {event.location}
              </Text>
            </View>
          </View>
        </Card>
        <View
          style={{
            borderLeftWidth: 2,
            borderColor: colors.green,
            backgroundColor: '#11190D',
            padding: 15,
          }}
        >
          <InfoRow
            icon={<Info size={20} color={colors.green} />}
            text="No account or personal details needed. Choose only how many guests will attend."
          />
        </View>
        <Card style={{ alignItems: 'center', paddingVertical: 26, gap: 24 }}>
          <Text style={s.label}>Number of guests</Text>
          <Text
            style={{ fontSize: 19, color: colors.text, textAlign: 'center' }}
          >
            How many are attending?
          </Text>
          <View
            style={[s.row, { width: '100%', justifyContent: 'space-between' }]}
          >
            <CounterButton
              label="Remove one guest"
              disabled={guests === 1 || busy}
              onPress={() => setGuests(value => value - 1)}
            >
              <Minus size={22} color={colors.green} />
            </CounterButton>
            <View
              accessibilityLiveRegion="polite"
              style={{ alignItems: 'center' }}
            >
              <Reveal key={guests}>
                <Text
                  style={{
                    fontSize: 58,
                    fontWeight: '800',
                    color: colors.green,
                  }}
                >
                  {guests}
                </Text>
              </Reveal>
              <Text style={{ fontSize: 10, color: colors.muted }}>
                {guests === 1 ? 'GUEST' : 'GUESTS'}
              </Text>
            </View>
            <CounterButton
              label="Add one guest"
              disabled={guests === MAX_GUESTS || busy}
              onPress={() => setGuests(value => value + 1)}
            >
              <Plus size={22} color={colors.green} />
            </CounterButton>
          </View>
          <Text
            style={{ fontSize: 11, color: colors.dim, textAlign: 'center' }}
          >
            You can reserve up to {MAX_GUESTS} places in one booking.
          </Text>
        </Card>
        <Card>
          <Text style={s.label}>Reservation summary</Text>
          <SummaryRow label="Admission" value={`${guests} × Festival guest`} />
          <SummaryRow label="Booking fee" value="Free" />
          <View style={s.divider} />
          <SummaryRow label="Total places" value={String(guests)} />
        </Card>
        {!!event.requirements && (
          <Text style={[s.body, { fontSize: 12 }]}>{event.requirements}</Text>
        )}
        <InfoRow
          icon={<ShieldCheck size={18} color={colors.green} />}
          text={`One QR ticket for ${
            guests === 1 ? 'your visit' : `all ${guests} guests`
          }. Saved on this device.`}
        />
        <Button title="Confirm Booking" onPress={confirm} loading={busy} />
      </View>
    </Page>
  );
}
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={[s.row, { justifyContent: 'space-between' }]}>
      <Text style={[s.body, { fontSize: 12 }]}>{label}</Text>
      <Text
        style={{
          color: colors.text,
          fontSize: 12,
          fontWeight: '700',
          flexShrink: 1,
          textAlign: 'right',
        }}
      >
        {value}
      </Text>
    </View>
  );
}
function CounterButton({
  label,
  onPress,
  disabled,
  children,
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={{
        height: 52,
        width: 52,
        borderRadius: 26,
        borderWidth: 1,
        borderColor: '#3E5031',
        backgroundColor: '#26321F',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.3 : 1,
      }}
    >
      {children}
    </Pressable>
  );
}
export function TicketScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootParams, 'Ticket'>) {
  const { bookings } = useApp();
  const booking = bookings.find(item => item.id === route.params.bookingId);
  const event = booking && findEvent(booking.eventId);
  if (!booking || !event) {
    return (
      <Page title="QR Ticket" back>
        <Empty
          title="Ticket not found"
          description="Your saved tickets are available in My Bookings."
        >
          <Button
            title="My Bookings"
            onPress={() => navigation.navigate('Bookings')}
          />
        </Empty>
      </Page>
    );
  }
  const confirmed = route.params.justBooked && booking.status === 'confirmed';
  return (
    <Page title={confirmed ? 'Reservation Confirmed' : 'QR Ticket'} back>
      <View
        style={[
          s.content,
          { maxWidth: 600, alignSelf: 'center', width: '100%' },
        ]}
      >
        {confirmed && (
          <View style={{ alignItems: 'center', gap: 16, paddingVertical: 12 }}>
            <LinearGradient
              colors={['#91F04B', '#4CC800']}
              style={{
                width: 74,
                height: 74,
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Check size={32} color="#16350C" />
            </LinearGradient>
            <Text style={s.label}>Reservation confirmed</Text>
            <Text style={[s.heading, { fontSize: 29 }]}>You're all set.</Text>
            <Text style={[s.body, { fontSize: 12, textAlign: 'center' }]}>
              Your ticket is saved on this device and is available offline.
            </Text>
          </View>
        )}
        <TicketCard booking={booking} event={event} />
        <Footer />
        <Button
          title="View My Bookings"
          onPress={() => navigation.navigate('Bookings')}
        />
        <Button
          title={
            event.kind === 'workshop'
              ? 'Back to Workshops'
              : 'Back to Championships'
          }
          secondary
          onPress={() =>
            navigation.navigate('Main', {
              screen: event.kind === 'workshop' ? 'Workshops' : 'Championships',
            })
          }
        />
      </View>
    </Page>
  );
}
export function BookingsScreen({
  navigation,
}: NativeStackScreenProps<RootParams, 'Bookings'>) {
  const { bookings, cancel } = useApp();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [busyId, setBusyId] = useState<string | null>(null);
  const valid = bookings.flatMap(booking => {
    const event = findEvent(booking.eventId);
    return event ? [{ booking, event }] : [];
  });
  const visible = valid.filter(({ booking, event }) =>
    tab === 'upcoming'
      ? isUpcoming(booking, event)
      : !isUpcoming(booking, event),
  );
  const active = valid.filter(({ booking, event }) =>
    isUpcoming(booking, event),
  ).length;
  function requestCancel(id: string) {
    Alert.alert(
      'Cancel reservation?',
      'This ticket will be moved to Past and will no longer be valid.',
      [
        { text: 'Keep reservation', style: 'cancel' },
        {
          text: 'Cancel reservation',
          style: 'destructive',
          onPress: async () => {
            setBusyId(id);
            try {
              await cancel(id);
            } catch {
              Alert.alert(
                'Unable to cancel',
                'Your reservation has not changed. Please try again.',
              );
            } finally {
              setBusyId(null);
            }
          },
        },
      ],
    );
  }
  return (
    <Page title="My Bookings" back>
      <View style={s.content}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 4,
          }}
        >
          {(['upcoming', 'past'] as const).map(value => (
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === value }}
              key={value}
              onPress={() => setTab(value)}
              style={{
                flex: 1,
                minHeight: 44,
                borderRadius: 9,
                backgroundColor: tab === value ? colors.lime : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: tab === value ? colors.background : colors.muted,
                  fontWeight: '700',
                  fontSize: 12,
                }}
              >
                {value === 'upcoming' ? 'Upcoming' : 'Past'}
              </Text>
            </Pressable>
          ))}
        </View>
        <Card>
          <InfoRow
            icon={<Ticket size={20} color={colors.green} />}
            text={`${active} active ${
              active === 1 ? 'ticket' : 'tickets'
            }\nSaved on this device`}
          />
        </Card>
        {visible.length === 0 && (
          <Empty
            title={
              tab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'
            }
            description={
              tab === 'upcoming'
                ? 'Reserve a championship or workshop and your ticket will appear here. Reservations for past dates appear in Past.'
                : 'Completed and cancelled reservations will appear here.'
            }
          >
            <Button
              title="Explore Championships"
              secondary
              onPress={() =>
                navigation.navigate('Main', { screen: 'Championships' })
              }
            />
          </Empty>
        )}
        <AdaptiveGrid>
          {visible.map(({ booking, event }) => (
            <View key={booking.id} style={s.card}>
              <Photo source={images[event.image]} ratio={2} />
              <View style={{ padding: 17, gap: 14 }}>
                <Badge
                  text={
                    booking.status === 'cancelled'
                      ? 'Cancelled'
                      : isUpcoming(booking, event)
                      ? 'Confirmed'
                      : 'Past event'
                  }
                />
                <Text style={{ fontSize: 18, color: colors.text }}>
                  {event.title}
                </Text>
                <Text style={[s.body, { fontSize: 11 }]}>
                  {formatDate(event.date)} · {event.time}
                  {'\n'}
                  {event.location} · {booking.guests}{' '}
                  {booking.guests === 1 ? 'guest' : 'guests'}
                </Text>
                <Button
                  title="View QR Ticket"
                  onPress={() =>
                    navigation.navigate('Ticket', { bookingId: booking.id })
                  }
                />
                {booking.status === 'confirmed' && (
                  <Pressable
                    accessibilityRole="button"
                    disabled={busyId !== null}
                    onPress={() => requestCancel(booking.id)}
                    style={{
                      minHeight: 44,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: colors.danger, fontSize: 12 }}>
                      {busyId === booking.id
                        ? 'Cancelling…'
                        : 'Cancel reservation'}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </AdaptiveGrid>
      </View>
    </Page>
  );
}
