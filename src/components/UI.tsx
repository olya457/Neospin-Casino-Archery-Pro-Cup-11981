import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import React, { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from './Gradient';
import { LayoutProvider, useLayout } from '../hooks/useLayout';
import { PageMotion, TargetPulse, usePressMotion } from './Motion';
import { ArrowLeft, ChevronRight, Ticket } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, styles as s } from '../theme';
import { Navigation } from '../navigation/types';

export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
  loading = false,
  compact = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  loading?: boolean;
  compact?: boolean;
}) {
  const { scale, press } = usePressMotion();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      onPressIn={() => press(true)}
      onPressOut={() => press(false)}
      style={({ pressed }) => [
        { opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
        compact && { alignSelf: 'flex-start' },
      ]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient
          colors={
            secondary
              ? [colors.surface, colors.surface]
              : ['#87E637', '#4BC900']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            local.button,
            secondary && local.secondary,
            compact && { paddingHorizontal: 18 },
          ]}
        >
          {loading ? (
            <ActivityIndicator
              color={secondary ? colors.green : colors.background}
            />
          ) : (
            <Text
              style={[local.buttonText, secondary && { color: colors.text }]}
            >
              {title}
            </Text>
          )}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}
export function IconButton({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        local.iconButton,
        { opacity: pressed ? 0.6 : 1 },
      ]}
    >
      {children}
    </Pressable>
  );
}
export function Header({
  title,
  eyebrow,
  back = false,
  bookings = false,
}: {
  title: string;
  eyebrow?: string;
  back?: boolean;
  bookings?: boolean;
}) {
  const navigation = useNavigation<Navigation>();
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={local.headerSafe}>
      <View style={local.header}>
        <View style={local.headerSide}>
          {back && (
            <IconButton
              label="Go back"
              onPress={() =>
                navigation.canGoBack()
                  ? navigation.goBack()
                  : navigation.navigate('Main')
              }
            >
              <ArrowLeft size={20} color={colors.text} />
            </IconButton>
          )}
        </View>
        <View style={local.headerTitle}>
          {eyebrow && <Text style={local.headerEyebrow}>{eyebrow}</Text>}
          <Text style={local.headerText}>{title}</Text>
        </View>
        <View style={local.headerSide}>
          {bookings && (
            <IconButton
              label="My bookings"
              onPress={() => navigation.navigate('Bookings')}
            >
              <Ticket size={21} color={colors.green} />
            </IconButton>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
export function Page({
  children,
  title,
  eyebrow,
  back,
  bookings,
  split = false,
}: {
  children: React.ReactNode;
  title: string;
  eyebrow?: string;
  back?: boolean;
  bookings?: boolean;
  split?: boolean;
}) {
  const [width, setWidth] = useState(0);
  const tabBarHeight = useContext(BottomTabBarHeightContext) ?? 0;
  const layout = useLayout();
  const items = React.Children.toArray(children);
  const paired = split && width >= 640 && layout.wide && items.length === 2;
  return (
    <View style={s.screen}>
      <Header title={title} eyebrow={eyebrow} back={back} bookings={bookings} />
      <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
        <LayoutProvider value={width || layout.width}>
          <ScrollView
            contentContainerStyle={[
              local.scroll,
              tabBarHeight > 0 && { paddingBottom: tabBarHeight + 40 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={[local.maxWidth, { maxWidth: 1120 }]}
              onLayout={event => setWidth(event.nativeEvent.layout.width)}
            >
              <PageMotion>
                <View
                  style={
                    paired
                      ? {
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          gap: 32,
                          padding: 20,
                        }
                      : undefined
                  }
                >
                  {paired ? (
                    <>
                      <View
                        style={{
                          width: (width - 72) * 0.45,
                          minWidth: 0,
                          borderRadius: 22,
                          overflow: 'hidden',
                        }}
                      >
                        {items[0]}
                      </View>
                      <View style={{ width: (width - 72) * 0.55, minWidth: 0 }}>
                        {items[1]}
                      </View>
                    </>
                  ) : (
                    children
                  )}
                </View>
              </PageMotion>
            </View>
          </ScrollView>
        </LayoutProvider>
      </SafeAreaView>
    </View>
  );
}
export function Hero({
  image,
  title,
  subtitle,
  badge,
  height = 360,
}: {
  image: ImageSourcePropType;
  title: string;
  subtitle?: string;
  badge?: string;
  height?: number;
}) {
  const layout = useLayout();
  return (
    <ImageBackground
      source={image}
      style={{
        minHeight: layout.compact ? Math.min(height, 280) : height,
        justifyContent: 'flex-end',
      }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['transparent', '#0B100A70', colors.background]}
        locations={[0, 0.4, 1]}
        style={{
          padding: layout.compact ? 18 : 22,
          paddingTop: layout.compact ? 65 : 110,
          gap: 12,
        }}
      >
        <View style={[s.row, { justifyContent: 'space-between' }]}>
          {badge && (
            <View style={{ flexShrink: 1 }}>
              <Badge text={badge} />
            </View>
          )}
          <TargetPulse />
        </View>
        <Text style={[s.title, layout.compact && { fontSize: 26 }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[s.body, { color: '#D0D7C9' }]}>{subtitle}</Text>
        )}
      </LinearGradient>
    </ImageBackground>
  );
}
export function Badge({ text }: { text: string }) {
  return (
    <View style={local.badge}>
      <Text style={local.badgeText}>{text}</Text>
    </View>
  );
}
export function SectionTitle({
  label,
  title,
  count,
}: {
  label: string;
  title: string;
  count?: number;
}) {
  return (
    <View style={{ gap: 12 }}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.row, { justifyContent: 'space-between' }]}>
        <Text style={[s.heading, { flex: 1 }]}>{title}</Text>
        {count !== undefined && (
          <View style={local.count}>
            <Text style={{ color: colors.green, fontSize: 12 }}>{count}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
export function InfoRow({
  icon,
  text,
  dark = false,
}: {
  icon: React.ReactNode;
  text: string;
  dark?: boolean;
}) {
  return (
    <View style={[s.row, { alignItems: 'flex-start' }]}>
      {icon}
      <Text
        style={[
          s.body,
          { flex: 1, fontSize: 12, lineHeight: 20 },
          dark && { color: '#53604E' },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}
export function Partner() {
  return (
    <LinearGradient
      colors={['#161E12', '#243B17']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[s.card, { padding: 22, gap: 12 }]}
    >
      <Text style={s.label}>Official event partner</Text>
      <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>
        Organized by Neospin Casino
      </Text>
      <Text style={[s.body, { fontSize: 12 }]}>
        Supporting world-class sport, learning and visitor experiences.
      </Text>
    </LinearGradient>
  );
}
export function Footer() {
  return <Text style={local.footer}>Organized by Neospin Casino</Text>;
}
export function Empty({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <View
      style={{
        alignItems: 'center',
        gap: 18,
        paddingVertical: 60,
        paddingHorizontal: 20,
      }}
    >
      <View style={local.emptyIcon}>
        <Ticket color={colors.green} size={28} />
      </View>
      <Text style={[s.heading, { textAlign: 'center', fontSize: 20 }]}>
        {title}
      </Text>
      <Text style={[s.body, { textAlign: 'center' }]}>{description}</Text>
      {children}
    </View>
  );
}
export function LinkRow({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ color: colors.text, fontWeight: '600' }}>{title}</Text>
        {subtitle && <Text style={[s.body, { fontSize: 11 }]}>{subtitle}</Text>}
      </View>
      <ChevronRight size={18} color={colors.green} />
    </Pressable>
  );
}
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[s.card, { padding: 18, gap: 16 }, style]}>{children}</View>
  );
}
const local = StyleSheet.create({
  button: {
    borderRadius: 14,
    minHeight: 52,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B1604',
    textAlign: 'center',
  },
  secondary: { borderWidth: 1, borderColor: colors.border },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSafe: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#20271B',
  },
  header: {
    minHeight: 70,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerSide: { width: 44, alignItems: 'center' },
  headerTitle: { flex: 1, alignItems: 'center', gap: 5 },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  headerEyebrow: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#8AA379',
    textAlign: 'center',
  },
  scroll: { paddingBottom: 36 },
  maxWidth: { width: '100%', maxWidth: 650, alignSelf: 'center' },
  badge: {
    alignSelf: 'flex-start',
    borderColor: '#65B32B',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: '#1C3412E8',
  },
  badgeText: {
    fontSize: 8,
    letterSpacing: 1.3,
    fontWeight: '800',
    color: '#D5FFBE',
    textTransform: 'uppercase',
  },
  count: { borderRadius: 20, backgroundColor: '#1C2B15', padding: 8 },
  footer: {
    fontSize: 9,
    color: colors.dim,
    textAlign: 'center',
    paddingVertical: 20,
  },
  emptyIcon: {
    height: 70,
    width: 70,
    borderRadius: 40,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
