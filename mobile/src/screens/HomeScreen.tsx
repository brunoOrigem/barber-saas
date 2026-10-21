import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { THEME } from '../theme';
import { SERVICES } from '../data/mock';
import { RootStackParamList } from '../routes';
import { ServiceCard } from '../components/ServiceCard';
import { PrimaryButton } from '../components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Bem-vindo à</Text>
        <Text style={styles.shopName}>Barbearia VIP 💈</Text>
        <Text style={styles.subtitle}>Escolha o serviço desejado para agendar:</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            selected={selectedServiceId === service.id}
            onPress={() => setSelectedServiceId(service.id)}
          />
        ))}
      </ScrollView>

      <SafeAreaView style={styles.footer} edges={['bottom']}>
        <PrimaryButton
          title={selectedServiceId ? 'Continuar Agendamento' : 'Selecione um serviço'}
          disabled={!selectedServiceId}
          onPress={() =>
            selectedServiceId &&
            navigation.navigate('SelectBarber', { serviceId: selectedServiceId })
          }
        />
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND,
  },
  header: {
    paddingHorizontal: THEME.SPACING.MD,
    paddingTop: THEME.SPACING.XL,
    paddingBottom: THEME.SPACING.MD,
  },
  welcome: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.MD,
  },
  shopName: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.XXL,
    fontWeight: 'bold',
    marginVertical: THEME.SPACING.XS,
  },
  subtitle: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.SM,
  },
  list: {
    paddingHorizontal: THEME.SPACING.MD,
    paddingBottom: THEME.SPACING.MD,
  },
  footer: {
    padding: THEME.SPACING.MD,
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: THEME.COLORS.BORDER,
  },
});
