import React from 'react';
import { View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  BookOpen,
  GraduationCap,
  Map,
  Crosshair,
  Trophy,
  Library,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLayout } from '../hooks/useLayout';
import { useReducedMotion } from '../components/Motion';
import { LearningScreen, ResourceScreen } from '../screens/LearningScreens';
import { RootParams, TabParams } from './types';
import { colors } from '../theme';
import {
  ChampionshipsScreen,
  EventDetailsScreen,
  WorkshopsScreen,
} from '../screens/EventScreens';
import {
  GuideScreen,
  RulesScreen,
  TechnologyScreen,
} from '../screens/GuideScreens';
import { ArenaMapScreen, VenueScreen } from '../screens/MapScreens';
import {
  BookingsScreen,
  ReserveScreen,
  TicketScreen,
} from '../screens/BookingScreens';
const Stack = createNativeStackNavigator<RootParams>();
const Tab = createBottomTabNavigator<TabParams>();
const icons = {
  Championships: Trophy,
  Rules: BookOpen,
  ArenaMap: Map,
  Technology: Crosshair,
  Workshops: GraduationCap,
  Learn: Library,
};
function Tabs() {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const reduced = useReducedMotion();
  const availableWidth = layout.width - insets.left - insets.right;
  const barWidth = Math.min(560, availableWidth - 24);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: reduced ? 'none' : 'fade',
        tabBarPosition: 'bottom',
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarAccessibilityLabel: {
          Championships: 'Championships',
          Rules: 'Archery rules',
          ArenaMap: 'Arena map',
          Technology: 'Archery equipment',
          Workshops: 'Workshops',
          Learn: 'Learning library',
        }[route.name],
        tabBarActiveTintColor: '#102006',
        tabBarInactiveTintColor: '#9AA88F',
        tabBarStyle: {
          position: 'absolute',
          bottom: insets.bottom + 20,
          start: insets.left + (availableWidth - barWidth) / 2,
          end: undefined,
          width: barWidth,
          height: 68,
          borderRadius: 26,
          backgroundColor: '#182014',
          borderWidth: 1,
          borderTopWidth: 1,
          borderColor: '#3A4930',
          borderTopColor: '#3A4930',
          paddingHorizontal: 6,
          paddingTop: 8,
          paddingBottom: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 16,
          elevation: 12,
        },
        tabBarItemStyle: { height: 50 },
        tabBarIconStyle: { width: 44, height: 44 },
        tabBarIcon: ({ color, focused }) => {
          const Icon = icons[route.name];
          return (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? colors.green : 'transparent',
                shadowColor: colors.green,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: focused ? 0.3 : 0,
                shadowRadius: 8,
              }}
            >
              <Icon size={24} strokeWidth={focused ? 2.3 : 1.8} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Championships"
        component={ChampionshipsScreen}
        options={{ tabBarLabel: 'Events' }}
      />
      <Tab.Screen name="Rules" component={RulesScreen} />
      <Tab.Screen
        name="ArenaMap"
        component={ArenaMapScreen}
        options={{ title: 'Arena Map', tabBarLabel: 'Map' }}
      />
      <Tab.Screen
        name="Technology"
        component={TechnologyScreen}
        options={{ tabBarLabel: 'Tech' }}
      />
      <Tab.Screen name="Workshops" component={WorkshopsScreen} />
      <Tab.Screen name="Learn" component={LearningScreen} />
    </Tab.Navigator>
  );
}
export function AppNavigator() {
  const reduced = useReducedMotion();
  return (
    <NavigationContainer
      theme={{
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: colors.green,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: reduced ? 'none' : 'slide_from_right',
        }}
      >
        <Stack.Screen name="Main" component={Tabs} />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        <Stack.Screen name="Reserve" component={ReserveScreen} />
        <Stack.Screen name="Ticket" component={TicketScreen} />
        <Stack.Screen name="Bookings" component={BookingsScreen} />
        <Stack.Screen name="Guide" component={GuideScreen} />
        <Stack.Screen name="Venue" component={VenueScreen} />
        <Stack.Screen name="Resource" component={ResourceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
