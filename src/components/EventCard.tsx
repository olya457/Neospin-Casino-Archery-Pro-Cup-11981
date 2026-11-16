import { Photo } from './Photo';
import React from 'react';
import { Text, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Event } from '../types/content';
import { images } from '../data/images';
import { colors, styles as s } from '../theme';
import { Badge, Button, InfoRow } from './UI';
import { formatDate } from '../utils/booking';
export function EventCard({
  event,
  onPress,
}: {
  event: Event;
  onPress: () => void;
}) {
  return (
    <View style={s.card}>
      <View>
        <Photo source={images[event.image]} ratio={1.85} />
        <View style={{ position: 'absolute', left: 14, bottom: 14 }}>
          <Badge
            text={
              event.kind === 'workshop' ? 'Practical session' : event.category
            }
          />
        </View>
      </View>
      <View style={{ padding: 17, gap: 15 }}>
        <Text style={[s.label, { letterSpacing: 0.7 }]}>
          {formatDate(event.date)} · {event.time}
        </Text>
        <Text style={{ fontSize: 19, color: colors.text }}>{event.title}</Text>
        <Text style={[s.body, { fontSize: 12, lineHeight: 20 }]}>
          {event.description}
        </Text>
        <InfoRow
          icon={<MapPin size={16} color={colors.green} />}
          text={event.location}
        />
        {event.kind === 'workshop' && (
          <View style={[s.row, { flexWrap: 'wrap' }]}>
            {[event.category, event.duration, `Age ${event.age}`].map(value => (
              <Text
                key={value}
                style={{
                  fontSize: 10,
                  color: colors.muted,
                  backgroundColor: colors.raised,
                  padding: 8,
                  borderRadius: 5,
                }}
              >
                {value}
              </Text>
            ))}
          </View>
        )}
        <View style={s.divider} />
        <View
          style={[s.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}
        >
          <Text style={[s.label, { fontSize: 8, letterSpacing: 0.8 }]}>
            ● Free entry
          </Text>
          <Button title="View Details" onPress={onPress} compact />
        </View>
      </View>
    </View>
  );
}
