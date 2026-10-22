import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../theme';
import { USER } from '../data/mock';
import { useBookings } from '../contexts/BookingsContext';
import { NextBookingCard } from '../components/NextBookingCard';
import { ShortcutTile } from '../components/ShortcutTile';
import { ShopInfoCard } from '../components/ShopInfoCard';
import { openShopOnMaps, openShopWhatsApp } from '../utils/contact';

const LOGO_SIZE = THEME.SPACING.XL + THEME.SPACING.MD;

function getGreeting(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { upcoming } = useBookings();

  const goToNewBooking = () => navigation.navigate('SelectBarber');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + THEME.SPACING.MD }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.brand}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
          <Text style={styles.brandName}>
            Corte<Text style={styles.brandAccent}>App</Text>
          </Text>
        </View>
      </View>

      <View style={styles.greeting}>
        <Text style={styles.hello}>Olá, {USER.firstName} 👋</Text>
        <Text style={styles.greetingSubtitle}>{getGreeting()}! Pronto para renovar o visual?</Text>
      </View>

      <NextBookingCard
        booking={upcoming[0]}
        onPressDetails={() => navigation.navigate('MainTabs', { screen: 'Bookings' })}
        onPressSchedule={goToNewBooking}
      />

      <Text style={styles.sectionTitle}>Acesso rápido</Text>
      <View style={styles.grid}>
        <ShortcutTile
          icon="add-circle-outline"
          title="Novo agendamento"
          subtitle="Escolha serviço, barbeiro e horário"
          onPress={goToNewBooking}
          highlighted
        />
        <ShortcutTile
          icon="people-outline"
          title="Equipe"
          subtitle="Profissionais e especialidades"
          onPress={() => navigation.navigate('Team')}
        />
        <ShortcutTile
          icon="navigate-outline"
          title="Localização"
          subtitle="Veja como chegar"
          onPress={openShopOnMaps}
        />
        <ShortcutTile
          icon="logo-whatsapp"
          title="Suporte"
          subtitle="Fale conosco pelo WhatsApp"
          onPress={() => openShopWhatsApp()}
        />
      </View>

      <Text style={styles.sectionTitle}>Informações</Text>
      <ShopInfoCard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND,
  },
  content: {
    paddingHorizontal: THEME.SPACING.MD,
    paddingBottom: THEME.SPACING.LG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.SM,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: THEME.BORDER_RADIUS.MD,
  },
  brandName: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.LG,
    fontWeight: 'bold',
  },
  brandAccent: {
    color: THEME.COLORS.PRIMARY,
  },
  greeting: {
    marginTop: THEME.SPACING.LG,
    marginBottom: THEME.SPACING.MD,
  },
  hello: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.XL,
    fontWeight: 'bold',
  },
  greetingSubtitle: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS,
  },
  sectionTitle: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
    marginTop: THEME.SPACING.LG,
    marginBottom: THEME.SPACING.SM,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.SPACING.SM,
  },
});
