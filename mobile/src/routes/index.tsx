import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { THEME } from '../theme';
import { RootStackParamList } from './types';
import { TabRoutes } from './TabRoutes';
import { SelectBarberScreen } from '../screens/SelectBarberScreen';
import { TeamScreen } from '../screens/TeamScreen';

export type { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerStyle: { backgroundColor: THEME.COLORS.BACKGROUND },
        headerTintColor: THEME.COLORS.TEXT_PRIMARY,
        headerShadowVisible: false,
        headerBackTitle: 'Voltar',
        contentStyle: { backgroundColor: THEME.COLORS.BACKGROUND },
      }}
    >
      <Stack.Screen name="MainTabs" component={TabRoutes} options={{ headerShown: false }} />
      <Stack.Screen
        name="SelectBarber"
        component={SelectBarberScreen}
        options={{ title: 'Novo agendamento' }}
      />
      <Stack.Screen name="Team" component={TeamScreen} options={{ title: 'Nossa equipe' }} />
    </Stack.Navigator>
  );
}
