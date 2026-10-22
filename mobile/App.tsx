import React from 'react';
import { StatusBar } from 'react-native';
import { DarkTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { THEME } from './src/theme';
import { AppRoutes } from './src/routes';
import { BookingsProvider } from './src/contexts/BookingsContext';
import { SettingsProvider } from './src/contexts/SettingsContext';

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
      <SettingsProvider>
        <BookingsProvider>
          <NavigationContainer theme={navigationTheme}>
            <StatusBar barStyle="light-content" backgroundColor={THEME.COLORS.BACKGROUND} />
            <AppRoutes />
          </NavigationContainer>
        </BookingsProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
