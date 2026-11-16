import { Photo } from '../components/Photo';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Bookmark,
  BookOpen,
  ExternalLink,
  PlayCircle,
  Search,
  X,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  learningResources,
  filterLearning,
  LearningResource,
} from '../data/learning';
import { images } from '../data/images';
import { colors, styles as s } from '../theme';
import { Navigation, RootParams } from '../navigation/types';
import { useApp } from '../storage/AppProvider';
import { AdaptiveGrid } from '../hooks/useLayout';
import {
  Badge,
  Button,
  Card,
  Empty,
  Hero,
  IconButton,
  Page,
  SectionTitle,
} from '../components/UI';

function SaveButton({ resource }: { resource: LearningResource }) {
  const { savedResources, toggleResource } = useApp();
  const [busy, setBusy] = useState(false);
  const saved = savedResources.includes(resource.id);
  async function toggle() {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      await toggleResource(resource.id);
    } catch {
      Alert.alert(
        'Unable to save',
        'Please try again. Your saved list has not changed.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        saved ? `Remove ${resource.title} from saved` : `Save ${resource.title}`
      }
      accessibilityState={{ selected: saved, disabled: busy }}
      disabled={busy}
      onPress={toggle}
      style={{
        minHeight: 44,
        minWidth: 44,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Bookmark
        size={22}
        color={colors.green}
        fill={saved ? colors.green : 'transparent'}
      />
    </Pressable>
  );
}
function FilterRow({
  values,
  selected,
  onChange,
}: {
  values: string[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {values.map(value => (
        <Pressable
          key={value}
          accessibilityRole="button"
          accessibilityState={{ selected: selected === value }}
          onPress={() => onChange(value)}
          style={{
            minHeight: 44,
            paddingHorizontal: 16,
            justifyContent: 'center',
            borderRadius: 24,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: selected === value ? colors.green : colors.surface,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: selected === value ? colors.background : colors.muted,
            }}
          >
            {value}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
export function LearningScreen() {
  const navigation = useNavigation<Navigation>();
  const { savedResources } = useApp();
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All');
  const [kind, setKind] = useState('All formats');
  const resources = filterLearning(query, topic, kind, savedResources);
  return (
    <Page title="Archery Library" eyebrow="READ · WATCH · DISCOVER">
      <Hero
        image={images.coaching}
        title="Take your curiosity further"
        subtitle="English-language articles and videos from trusted archery organisations."
        badge="Learn at your pace"
        height={300}
      />
      <View style={s.content}>
        <View style={[s.card, s.row, { paddingHorizontal: 14 }]}>
          <Search size={20} color={colors.muted} />
          <TextInput
            accessibilityLabel="Search learning resources"
            placeholder="Search articles and videos"
            placeholderTextColor={colors.dim}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            returnKeyType="search"
            style={{ flex: 1, minHeight: 52, color: colors.text, fontSize: 14 }}
          />
          {!!query && (
            <IconButton label="Clear search" onPress={() => setQuery('')}>
              <X size={16} color={colors.text} />
            </IconButton>
          )}
        </View>
        <FilterRow
          values={['All', 'Beginners', 'Equipment', 'Competition', 'Saved']}
          selected={topic}
          onChange={setTopic}
        />
        <FilterRow
          values={['All formats', 'Article', 'Video']}
          selected={kind}
          onChange={setKind}
        />
        <SectionTitle
          label="English-language resources"
          title={
            topic === 'Saved' ? 'Your reading list' : 'Explore the library'
          }
          count={resources.length}
        />
        {resources.length === 0 && (
          <Empty
            title={
              topic === 'Saved' && !savedResources.length
                ? 'Your reading list is empty'
                : 'No matching resources'
            }
            description="Save a resource with the bookmark button, or change your search and filters."
          >
            <Button
              title="Show all resources"
              secondary
              onPress={() => {
                setQuery('');
                setTopic('All');
                setKind('All formats');
              }}
            />
          </Empty>
        )}
        <AdaptiveGrid>
          {resources.map(resource => (
            <View key={resource.id} style={s.card}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Read about ${resource.title}`}
                onPress={() =>
                  navigation.navigate('Resource', { resourceId: resource.id })
                }
              >
                <Photo source={images[resource.image]} ratio={1.9} />
                <View style={{ position: 'absolute', left: 14, bottom: 14 }}>
                  <Badge
                    text={
                      resource.kind === 'Video'
                        ? 'Watch in English'
                        : 'Read in English'
                    }
                  />
                </View>
              </Pressable>
              <View style={{ padding: 18, gap: 12 }}>
                <View style={[s.row, { justifyContent: 'space-between' }]}>
                  <Text style={[s.label, { flex: 1 }]}>{resource.topic}</Text>
                  <SaveButton resource={resource} />
                </View>
                <Text style={[s.heading, { fontSize: 21 }]}>
                  {resource.title}
                </Text>
                <Text style={s.body}>{resource.description}</Text>
                <Text style={{ fontSize: 11, color: colors.dim }}>
                  {resource.publisher}
                </Text>
                <Button
                  title={
                    resource.kind === 'Video'
                      ? 'Explore Video'
                      : 'Explore Article'
                  }
                  secondary
                  onPress={() =>
                    navigation.navigate('Resource', { resourceId: resource.id })
                  }
                />
              </View>
            </View>
          ))}
        </AdaptiveGrid>
        <Text style={[s.body, { fontSize: 12 }]}>
          Summaries and your saved list are available offline. Full articles and
          videos open on the publisher’s website and require internet access.
        </Text>
      </View>
    </Page>
  );
}
export function ResourceScreen({
  route,
}: NativeStackScreenProps<RootParams, 'Resource'>) {
  const resource = learningResources.find(
    item => item.id === route.params.resourceId,
  );
  const [opening, setOpening] = useState(false);
  if (!resource) {
    return (
      <Page title="Learning Resource" back>
        <Empty
          title="Resource not found"
          description="Choose another article or video from the library."
        />
      </Page>
    );
  }
  async function open() {
    if (!resource || opening) {
      return;
    }
    setOpening(true);
    try {
      await Linking.openURL(resource.url);
    } catch {
      Alert.alert(
        'Unable to open this link',
        'Check your internet connection and try again.',
      );
    } finally {
      setOpening(false);
    }
  }
  const Icon = resource.kind === 'Video' ? PlayCircle : BookOpen;
  return (
    <Page
      title={resource.kind === 'Video' ? 'Video Guide' : 'Reading Guide'}
      back
      split
    >
      <Hero
        image={images[resource.image]}
        title={resource.title}
        badge={`${resource.kind} · English`}
        subtitle={resource.publisher}
      />
      <View style={s.content}>
        <View style={[s.row, { justifyContent: 'space-between' }]}>
          <View style={s.row}>
            <Icon color={colors.green} size={24} />
            <Text style={s.label}>{resource.topic}</Text>
          </View>
          <SaveButton resource={resource} />
        </View>
        <Text style={s.body}>{resource.description}</Text>
        <SectionTitle label="Before you explore" title="What to look for" />
        <Card>
          {resource.highlights.map((line, index) => (
            <View key={line} style={[s.row, { alignItems: 'flex-start' }]}>
              <Text style={s.label}>{String(index + 1).padStart(2, '0')}</Text>
              <Text style={[s.body, { flex: 1 }]}>{line}</Text>
            </View>
          ))}
        </Card>
        <Card>
          <View style={s.row}>
            <ExternalLink size={20} color={colors.green} />
            <Text style={{ color: colors.text, flex: 1, fontWeight: '700' }}>
              {resource.publisher}
            </Text>
          </View>
          <Text style={s.body}>
            Open the original English-language {resource.kind.toLowerCase()} in
            your browser or video app.
          </Text>
          <Button
            title={
              resource.kind === 'Video'
                ? 'Watch on YouTube'
                : 'Read Original Article'
            }
            onPress={open}
            loading={opening}
          />
        </Card>
        <Text selectable style={[s.body, { fontSize: 11 }]}>
          {resource.url}
        </Text>
      </View>
    </Page>
  );
}
