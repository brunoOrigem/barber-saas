import React, { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { BarberTabParamList, TabParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { BookingsScreen } from '../screens/BookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { BarberScheduleScreen } from '../screens/BarberScheduleScreen';
import { BarberPortfolioManagerScreen } from '../screens/BarberPortfolioManagerScreen';
import { BarberProfileSettingsScreen } from '../screens/BarberProfileSettingsScreen';

type IconName = ComponentProps<typeof Ionicons>['name'];
type TabIcon = { active: IconName; inactive: IconName };

const Tab = createBottomTabNavigator<TabParamList>();
const BarberTab = createBottomTabNavigator<BarberTabParamList>();

const ICONS: Record<keyof TabParamList, TabIcon> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Bookings: { active: 'calendar', inactive: 'calendar-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

const BARBER_ICONS: Record<keyof BarberTabParamList, TabIcon> = {
  BarberSchedule: { active: 'calendar', inactive: 'calendar-outline' },
  BarberPortfolio: { active: 'camera', inactive: 'camera-outline' },
  BarberProfile: { active: 'person', inactive: 'person-outline' },
};

/** Opções visuais compartilhadas pelas abas do cliente e do barbeiro. */
function tabScreenOptions(icons: Record<string, TabIcon>) {
  return ({ route }: { route: { name: string } }): BottomTabNavigationOptions => ({
    headerShown: false,
    tabBarActiveTintColor: THEME.COLORS.PRIMARY,
    tabBarInactiveTintColor: THEME.COLORS.TEXT_MUTED,
    tabBarStyle: styles.tabBar,
    tabBarLabelStyle: styles.label,
    tabBarIcon: ({ focused, color }) => (
      <Ionicons
        name={focused ? icons[route.name].active : icons[route.name].inactive}
        size={THEME.FONT_SIZE.XL}
        color={color}
      />
    ),
  });
}

export function TabRoutes() {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions(ICONS)}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{ title: 'Agendamentos' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

export function BarberTabRoutes() {
  return (
    <BarberTab.Navigator screenOptions={tabScreenOptions(BARBER_ICONS)}>
      <BarberTab.Screen
        name="BarberSchedule"
        component={BarberScheduleScreen}
        options={{ title: 'Agenda Hoje' }}
      />
      <BarberTab.Screen
        name="BarberPortfolio"
        component={BarberPortfolioManagerScreen}
        options={{ title: 'Portfólio' }}
      />
      <BarberTab.Screen
        name="BarberProfile"
        component={BarberProfileSettingsScreen}
        options={{ title: 'Perfil' }}
      />
    </BarberTab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: THEME.COLORS.BACKGROUND,
    borderTopColor: THEME.COLORS.BORDER,
    paddingTop: THEME.SPACING.XS,
  },
  label: {
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: '600',
  },
});
