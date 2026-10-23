import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { THEME } from '../theme';
import { RootStackParamList } from './types';
import { BarberTabRoutes, TabRoutes } from './TabRoutes';
import { useUserRole } from '../contexts/UserRoleContext';
import { SelectBarberScreen } from '../screens/SelectBarberScreen';
import { TeamScreen } from '../screens/TeamScreen';
import { BarberDetailScreen } from '../screens/BarberDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { LegalScreen } from '../screens/LegalScreen';

export type { RootStackParamList, TabParamList, BarberTabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppRoutes() {
  const { userRole } = useUserRole();

  // As telas são registradas conforme o papel: ao trocar o modo, o navegador
  // descarta as rotas do papel anterior e abre a primeira tela do novo.
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: THEME.COLORS.BACKGROUND },
        headerTintColor: THEME.COLORS.TEXT_PRIMARY,
        headerShadowVisible: false,
        headerBackTitle: 'Voltar',
        contentStyle: { backgroundColor: THEME.COLORS.BACKGROUND },
      }}
    >
      {userRole === 'barber' ? (
        <Stack.Screen name="BarberTabs" component={BarberTabRoutes} options={{ headerShown: false }} />
      ) : (
        <Stack.Group>
          <Stack.Screen name="MainTabs" component={TabRoutes} options={{ headerShown: false }} />
          <Stack.Screen
            name="SelectBarber"
            component={SelectBarberScreen}
            options={{ title: 'Novo agendamento' }}
          />
          <Stack.Screen name="Team" component={TeamScreen} options={{ title: 'Nossa equipe' }} />
          <Stack.Screen
            name="BarberDetail"
            component={BarberDetailScreen}
            options={{ title: 'Profissional' }}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configurações' }} />
        </Stack.Group>
      )}
      <Stack.Screen name="Legal" component={LegalScreen} />
    </Stack.Navigator>
  );
}
