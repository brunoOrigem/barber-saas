import React from 'react';
import { StatusBar } from 'react-native';
import { DarkTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { THEME } from './src/theme';
import { AppRoutes } from './src/routes';
import { BookingsProvider } from './src/contexts/BookingsContext';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { UserRoleProvider } from './src/contexts/UserRoleContext';
import { PortfolioProvider } from './src/contexts/PortfolioContext';
import { ServicesProvider } from './src/contexts/ServicesContext';

const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: THEME.COLORS.PRIMARY,
    background: THEME.COLORS.BACKGROUND,
    card: THEME.COLORS.BACKGROUND,
    text: THEME.COLORS.TEXT_PRIMARY,
    border: THEME.COLORS.BORDER,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <UserRoleProvider>
        <SettingsProvider>
          <ServicesProvider>
            <BookingsProvider>
              <PortfolioProvider>
                <NavigationContainer theme={navigationTheme}>
                  <StatusBar barStyle="light-content" />
                  <AppRoutes />
                </NavigationContainer>
              </PortfolioProvider>
            </BookingsProvider>
          </ServicesProvider>
        </SettingsProvider>
      </UserRoleProvider>
    </SafeAreaProvider>
  );
}
