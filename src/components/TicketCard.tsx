import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import LinearGradient from './Gradient';
import QRCode from 'react-native-qrcode-svg';
import { CalendarDays, Clock3, MapPin, Ban } from 'lucide-react-native';
import { Booking, Event } from '../types/content';
import { formatDate, ticketPayload } from '../utils/booking';
import { InfoRow } from './UI';
import { colors, styles as s } from '../theme';
export function TicketCard({
  booking,
  event,
}: {
  booking: Booking;
  event: Event;
}) {
  const { width } = useWindowDimensions();
  const cancelled = booking.status === 'cancelled';
  return (
    <View style={[local.ticket, cancelled && { opacity: 0.6 }]}>
      <LinearGradient
        colors={['#7CE83A', '#4BC900']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={local.header}
      >
        <Text style={local.brand}>WORLD ARCHERY{'\n'}MASTERS CUP</Text>
        <Text style={local.pass}>
          {event.kind === 'workshop' ? 'WORKSHOP PASS' : 'EVENT PASS'}
        </Text>
      </LinearGradient>
      <View style={local.details}>
        <Text
          style={[s.label, { color: '#419B11', fontSize: 8, letterSpacing: 1 }]}
        >
          {event.category}
        </Text>
        <Text style={local.title}>{event.title}</Text>
        <InfoRow
          dark
          icon={<CalendarDays size={15} color="#5CAC31" />}
          text={formatDate(event.date)}
        />
        <InfoRow
          dark
          icon={<Clock3 size={15} color="#5CAC31" />}
          text={event.time}
        />
        <InfoRow
          dark
          icon={<MapPin size={15} color="#5CAC31" />}
          text={event.location}
        />
      </View>
      <View style={local.tear}>
        <View style={[local.cutout, { left: -13 }]} />
        <View style={[local.cutout, { right: -13 }]} />
      </View>
      <View style={local.qr}>
        {cancelled ? (
          <View
            style={{
              height: Math.min(210, width - 110),
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <Ban size={70} color="#9E4B32" />
            <Text style={{ fontWeight: '700', color: '#9E4B32' }}>
              Reservation cancelled
            </Text>
          </View>
        ) : (
          <View style={{ padding: 10, backgroundColor: 'white' }}>
            <QRCode
              value={ticketPayload(booking, event)}
              size={Math.max(130, Math.min(210, width - 110))}
              ecl="M"
            />
          </View>
        )}
        <Text style={{ fontSize: 9, color: '#7E8877', textAlign: 'center' }}>
          {cancelled
            ? 'This ticket is no longer valid'
            : 'Present this code at the entrance'}
        </Text>
        <Text selectable style={local.code}>
          {booking.id}
        </Text>
      </View>
      <View style={local.bottom}>
        <View style={local.cell}>
          <Text style={local.small}>GUESTS</Text>
          <Text style={local.value}>{booking.guests}</Text>
        </View>
        <View
          style={[local.cell, { borderLeftWidth: 1, borderColor: '#CED5C9' }]}
        >
          <Text style={local.small}>STATUS</Text>
          <Text style={[local.value, cancelled && { color: '#9E4B32' }]}>
            {cancelled ? 'Cancelled' : 'Confirmed'}
          </Text>
        </View>
      </View>
    </View>
  );
}
const local = StyleSheet.create({
  ticket: { borderRadius: 22, overflow: 'hidden', backgroundColor: '#F5F7F1' },
  header: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  brand: { fontSize: 10, lineHeight: 11, fontWeight: '900', color: '#112006' },
  pass: {
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#469E18',
    color: '#19310B',
  },
  details: { padding: 20, gap: 9 },
  title: { fontSize: 21, color: '#252E20', marginBottom: 6 },
  tear: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#9DA694',
    position: 'relative',
    marginVertical: 8,
  },
  cutout: {
    position: 'absolute',
    top: -13,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.background,
  },
  qr: { alignItems: 'center', padding: 20, gap: 10 },
  code: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1.2,
    color: '#253020',
    textAlign: 'center',
  },
  bottom: {
    flexDirection: 'row',
    backgroundColor: '#E4E9E0',
    marginBottom: 16,
  },
  cell: { flex: 1, padding: 18, gap: 5 },
  small: { fontSize: 7, color: '#58644F', fontWeight: '700' },
  value: { fontSize: 14, fontWeight: '700', color: '#459E16' },
});
