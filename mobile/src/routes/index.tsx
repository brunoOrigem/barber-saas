import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { THEME } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { SelectBarberScreen } from '../screens/SelectBarberScreen';

export type RootStackParamList = {
  Home: undefined;
  SelectBarber: { serviceId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: THEME.COLORS.BACKGROUND },
        headerTintColor: THEME.COLORS.TEXT_PRIMARY,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: THEME.COLORS.BACKGROUND },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="SelectBarber"
        component={SelectBarberScreen}
        options={{ title: 'Agendamento', headerBackTitle: 'Voltar' }}
      />
    </Stack.Navigator>
  );
}
