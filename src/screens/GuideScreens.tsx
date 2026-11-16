import { AdaptiveGrid } from '../hooks/useLayout';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from '../components/Gradient';
import { guides, venues } from '../data/catalog';
import { images } from '../data/images';
import { Navigation, RootParams } from '../navigation/types';
import { colors, styles as s } from '../theme';
import { Button, Empty, Hero, Page, SectionTitle } from '../components/UI';
function GuideListScreen({ kind }: { kind: 'rules' | 'technology' }) {
  const navigation = useNavigation<Navigation>();
  const rules = kind === 'rules';
  const items = guides.filter(item => item.kind === kind);
  return (
    <Page
      title={rules ? 'Archery Rules' : 'Technology'}
      eyebrow="LEARN & EXPLORE"
    >
      <Hero
        image={rules ? images.arena : images.festival}
        title={rules ? 'Archery Rules' : 'Archery Technology'}
        badge={rules ? 'Official sport guide' : 'Equipment exhibition'}
        subtitle={
          rules
            ? 'Understand the Sport. Master the Rules.'
            : 'Discover the Equipment Behind Precision'
        }
        height={380}
      />
      <View style={s.content}>
        <Text style={s.body}>
          {rules
            ? 'Explore competitive rules, learn how points are calculated, and understand the standards followed in professional tournaments.'
            : 'Explore modern bows, advanced arrows, professional accessories, and innovative systems used in competitive archery.'}
        </Text>
        <View style={s.divider} />
        <SectionTitle
          label={`${items.length} in-depth guides`}
          title={rules ? 'Learn the essentials' : 'Explore the equipment'}
        />
        <AdaptiveGrid>
          {items.map((item, index) => (
            <Pressable
              accessibilityRole="button"
              key={item.id}
              onPress={() => navigation.navigate('Guide', { guideId: item.id })}
              style={[s.card, { flexDirection: 'row', minHeight: 112 }]}
            >
              <View style={{ width: '28%' }}>
                <Image
                  source={images[item.image]}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                  }}
                />
                <Text
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    padding: 6,
                    borderRadius: 4,
                    backgroundColor: '#15210FE6',
                    color: colors.green,
                    fontSize: 9,
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </Text>
              </View>
              <View
                style={{
                  padding: 14,
                  gap: 8,
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 16, color: colors.text }}>
                  {item.title}
                </Text>
                <Text
                  style={{ fontSize: 11, lineHeight: 17, color: colors.muted }}
                >
                  {item.subtitle}
                </Text>
              </View>
              <ChevronRight
                size={17}
                color={colors.green}
                style={{ alignSelf: 'center', marginRight: 12 }}
              />
            </Pressable>
          ))}
        </AdaptiveGrid>
        <Button
          title="Explore Articles & Videos"
          secondary
          onPress={() => navigation.navigate('Main', { screen: 'Learn' })}
        />
      </View>
    </Page>
  );
}
export function RulesScreen() {
  return <GuideListScreen kind="rules" />;
}
export function TechnologyScreen() {
  return <GuideListScreen kind="technology" />;
}
export function GuideScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootParams, 'Guide'>) {
  const guide = guides.find(item => item.id === route.params.guideId);
  if (!guide) {
    return (
      <Page title="Guide" back>
        <Empty
          title="Guide not found"
          description="Choose a guide from the library."
        />
      </Page>
    );
  }
  const rules = guide.kind === 'rules';
  return (
    <Page title={rules ? 'Rules Guide' : 'Equipment Guide'} back split>
      <Hero
        image={images[guide.image]}
        title={guide.title}
        subtitle={guide.subtitle}
        badge={rules ? 'Competition knowledge' : 'Archery engineering'}
      />
      <View style={s.content}>
        <Text style={s.body}>{guide.introduction}</Text>
        {!!guide.fact && (
          <LinearGradient
            colors={['#182211', '#263F18']}
            style={[s.card, { padding: 20, gap: 12 }]}
          >
            <Text style={s.label}>Did you know?</Text>
            <Text style={[s.body, { color: colors.text }]}>{guide.fact}</Text>
          </LinearGradient>
        )}
        {guide.sections.map((section, index) => (
          <View
            key={section.title}
            style={{
              borderTopWidth: 1,
              borderColor: colors.border,
              paddingTop: 24,
              gap: 14,
            }}
          >
            <View style={[s.row, { alignItems: 'flex-start' }]}>
              <Text style={[s.label, { letterSpacing: 0, paddingTop: 5 }]}>
                {String(index + 1).padStart(2, '0')}
              </Text>
              <View style={{ flex: 1, gap: 14 }}>
                <Text style={[s.heading, { fontSize: 20 }]}>
                  {section.title}
                </Text>
                <Text style={s.body}>{section.body}</Text>
              </View>
            </View>
          </View>
        ))}
        <View style={s.card}>
          <Image
            source={rules ? images.range : images.equipment}
            style={{ width: '100%', height: 150 }}
          />
          <View style={{ padding: 20, gap: 14 }}>
            <Text style={s.label}>Keep exploring</Text>
            <Text style={s.heading}>
              {rules ? 'See the rules in action' : 'Visit Technology Hall'}
            </Text>
            <Text style={s.body}>
              {rules
                ? 'Explore the full championship program.'
                : 'Discover equipment exhibitions and practical masterclasses.'}
            </Text>
            <Button
              title={rules ? 'View Championships' : 'Explore Technology Hall'}
              secondary
              onPress={() =>
                rules
                  ? navigation.navigate('Main', { screen: 'Championships' })
                  : navigation.navigate('Venue', {
                      venueId: venues.find(
                        item => item.category === 'Exhibitions',
                      )!.id,
                    })
              }
            />
          </View>
        </View>
      </View>
    </Page>
  );
}
