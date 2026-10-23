import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Bookings: undefined;
  Profile: undefined;
};

export type BarberTabParamList = {
  BarberSchedule: undefined;
  BarberPortfolio: undefined;
  BarberProfile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  BarberTabs: NavigatorScreenParams<BarberTabParamList>;
  SelectBarber: { serviceIds?: string[]; barberId?: string } | undefined;
  Team: undefined;
  BarberDetail: { barberId: string };
  Settings: undefined;
  Legal: { type: 'terms' | 'privacy' };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
