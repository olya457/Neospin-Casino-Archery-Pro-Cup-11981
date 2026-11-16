import { Photo } from '../components/Photo';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {
  Compass,
  GraduationCap,
  Info,
  MapPin,
  Sun,
  Trophy,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react-native';
import { events, findVenue, venues } from '../data/catalog';
import { images } from '../data/images';
import { Venue } from '../types/content';
import { Navigation, RootParams, TabParams } from '../navigation/types';
import { colors, styles as s } from '../theme';
import {
  Button,
  Card,
  Empty,
  Hero,
  IconButton,
  InfoRow,
  LinkRow,
  Page,
  SectionTitle,
} from '../components/UI';
import { Reveal } from '../components/Motion';
import { EventCard } from '../components/EventCard';
const categories = [
  'All Locations',
  'Arenas',
  'Workshops',
  'Exhibitions',
  'Facilities',
];
function VenueIcon({
  category,
  color = '#17330B',
  size = 18,
}: {
  category: string;
  color?: string;
  size?: number;
}) {
  const Icon =
    category === 'Arenas'
      ? Trophy
      : category === 'Workshops'
      ? GraduationCap
      : category === 'Exhibitions'
      ? Sun
      : Info;
  return <Icon color={color} size={size} />;
}
export function ArenaMapScreen({
  route,
  navigation: tabNavigation,
}: BottomTabScreenProps<TabParams, 'ArenaMap'>) {
  const navigation = useNavigation<Navigation>();
  const [category, setCategory] = useState('All Locations');
  const [selected, setSelected] = useState<Venue | undefined>();
  const [zoom, setZoom] = useState(1);
  const horizontal = useRef<ScrollView>(null);
  const vertical = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const mapWidth = Math.max(180, measuredWidth || Math.min(width - 40, 610));
  const mapHeight = mapWidth * 1.78;
  const visible = venues.filter(
    venue => category === 'All Locations' || venue.category === category,
  );
  useEffect(() => {
    if (route.params?.venueId) {
      setCategory('All Locations');
      setSelected(venues.find(venue => venue.id === route.params?.venueId));
      tabNavigation.setParams({ venueId: undefined });
    }
  }, [route.params?.venueId, tabNavigation]);
  const reset = () => {
    setZoom(1);
    horizontal.current?.scrollTo({ x: 0, animated: true });
    vertical.current?.scrollTo({ y: 0, animated: true });
  };
  return (
    <Page title="Arena Map" eyebrow="FESTIVAL NAVIGATION">
      <View style={s.content}>
        <SectionTitle
          label="World Archery Masters Cup"
          title="Explore Every Corner"
        />
        <Text style={s.body}>
          Tap a marker to discover arenas, sessions and visitor facilities.
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {categories.map(value => (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityState={{ selected: value === category }}
              onPress={() => {
                setCategory(value);
                setSelected(undefined);
              }}
              style={{
                padding: 13,
                minHeight: 44,
                borderRadius: 25,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor:
                  category === value ? colors.green : colors.surface,
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: category === value ? '#14210B' : colors.muted,
                  fontWeight: category === value ? '700' : '400',
                }}
              >
                {value}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <View
          onLayout={event =>
            setMeasuredWidth(event.nativeEvent.layout.width - 2)
          }
          style={[
            s.card,
            { height: Math.min(510, mapHeight), backgroundColor: '#293E25' },
          ]}
        >
          <ScrollView
            ref={horizontal}
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
          >
            <ScrollView
              ref={vertical}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              bounces={false}
              style={{ width: mapWidth * zoom }}
            >
              <View
                style={{ width: mapWidth * zoom, height: mapHeight * zoom }}
              >
                <Image
                  source={images.map}
                  style={{ width: '100%', height: '100%', opacity: 0.68 }}
                  resizeMode="stretch"
                />
                {visible.map(venue => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={venue.title}
                    accessibilityState={{ selected: selected?.id === venue.id }}
                    key={venue.id}
                    onPress={() => setSelected(venue)}
                    style={{
                      position: 'absolute',
                      left: `${venue.x}%`,
                      top: `${venue.y}%`,
                      width: 44,
                      height: 48,
                      marginLeft: -22,
                      marginTop: -24,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <View
                      style={{
                        width: 33,
                        height: 33,
                        backgroundColor:
                          selected?.id === venue.id ? '#FFFFFF' : '#77E52E',
                        borderWidth: 2,
                        borderColor: '#D9FFBC',
                        borderRadius: 18,
                        borderBottomRightRadius: 3,
                        transform: [{ rotate: '45deg' }],
                        shadowColor: '#000',
                        shadowOpacity: 0.5,
                        shadowRadius: 4,
                        elevation: 4,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <View style={{ transform: [{ rotate: '-45deg' }] }}>
                        <VenueIcon category={venue.category} />
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </ScrollView>
          <View style={{ position: 'absolute', right: 12, top: 12, gap: 5 }}>
            <IconButton
              label="Zoom in"
              onPress={() => setZoom(value => Math.min(3, value + 0.5))}
            >
              <ZoomIn size={20} color={colors.text} />
            </IconButton>
            <IconButton
              label="Zoom out"
              onPress={() => setZoom(value => Math.max(1, value - 0.5))}
            >
              <ZoomOut size={20} color={colors.text} />
            </IconButton>
            <IconButton label="Reset map" onPress={reset}>
              <Compass size={20} color={colors.green} />
            </IconButton>
          </View>
          <Text
            style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              padding: 10,
              borderRadius: 10,
              backgroundColor: '#0B100AE6',
              color: '#C2CFB8',
              fontSize: 9,
            }}
          >
            ● {visible.length} locations · {zoom.toFixed(1)}×
          </Text>
        </View>
        <Text style={{ fontSize: 10, color: colors.dim, textAlign: 'center' }}>
          Drag to pan · Use controls to zoom · Illustrated venue map
        </Text>
        {selected && (
          <Reveal key={selected.id} style={s.card}>
            <View>
              <Photo source={images[selected.image]} ratio={2.2} />
              <View style={{ position: 'absolute', right: 10, top: 10 }}>
                <IconButton
                  label="Close location"
                  onPress={() => setSelected(undefined)}
                >
                  <X size={20} color={colors.text} />
                </IconButton>
              </View>
            </View>
            <View style={{ padding: 20, gap: 16 }}>
              <Text style={s.label}>{selected.category}</Text>
              <Text style={s.heading}>{selected.title}</Text>
              <Text style={s.body}>{selected.description}</Text>
              <Button
                title="View Location & Activities"
                onPress={() =>
                  navigation.navigate('Venue', { venueId: selected.id })
                }
              />
            </View>
          </Reveal>
        )}
        <SectionTitle
          label="Venue directory"
          title="Festival locations"
          count={visible.length}
        />
        <View style={s.card}>
          {visible.map((venue, index) => (
            <View key={venue.id}>
              {index > 0 && <View style={s.divider} />}
              <LinkRow
                title={venue.title}
                subtitle={venue.category}
                onPress={() =>
                  navigation.navigate('Venue', { venueId: venue.id })
                }
              />
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
}
export function VenueScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootParams, 'Venue'>) {
  const venue = venues.find(item => item.id === route.params.venueId);
  if (!venue) {
    return (
      <Page title="Location" back>
        <Empty
          title="Location not found"
          description="Choose a location on the arena map."
        />
      </Page>
    );
  }
  const related = events.filter(
    event => findVenue(event.location)?.id === venue.id,
  );
  return (
    <Page title="Location Details" back split>
      <Hero
        image={images[venue.image]}
        title={venue.title}
        badge={venue.category}
        subtitle={venue.description}
      />
      <View style={s.content}>
        <Text style={s.body}>{venue.introduction}</Text>
        <Card>
          <InfoRow
            icon={<MapPin color={colors.green} size={20} />}
            text={`Access: ${venue.access}`}
          />
          <InfoRow
            icon={<VenueIcon category={venue.category} color={colors.green} />}
            text={venue.activities}
          />
        </Card>
        <Button
          title="Show on Arena Map"
          secondary
          onPress={() =>
            navigation.navigate('Main', {
              screen: 'ArenaMap',
              params: { venueId: venue.id },
            })
          }
        />
        <SectionTitle
          label="Explore the venue"
          title="What you can find here"
        />
        <Card>
          {venue.features.map(feature => (
            <Text key={feature} style={s.body}>
              • {feature}
            </Text>
          ))}
        </Card>
        <Card>
          <Text style={{ color: colors.text, fontWeight: '700' }}>
            Visitor information
          </Text>
          <Text style={s.body}>{venue.information}</Text>
        </Card>
        {related.length > 0 && (
          <>
            <SectionTitle
              label="Happening here"
              title="Events & workshops"
              count={related.length}
            />
            {related.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() =>
                  navigation.navigate('EventDetails', { eventId: event.id })
                }
              />
            ))}
          </>
        )}
        {venue.category === 'Exhibitions' && (
          <Button
            title="Explore Technology"
            onPress={() =>
              navigation.navigate('Main', { screen: 'Technology' })
            }
          />
        )}
      </View>
    </Page>
  );
}
