import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../theme';
import { USER } from '../data/mock';
import { useBookings } from '../contexts/BookingsContext';
import { useSettings } from '../contexts/SettingsContext';
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
  const { activeShop } = useSettings();

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
        <TouchableOpacity
          style={styles.shopChip}
          onPress={() => navigation.navigate('Settings')}
          accessibilityRole="button"
          accessibilityLabel={`Barbearia ativa: ${activeShop.name}. Trocar barbearia`}
        >
          <Ionicons name="storefront-outline" size={THEME.FONT_SIZE.SM} color={THEME.COLORS.PRIMARY} />
          <Text style={styles.shopChipText} numberOfLines={1}>
            {activeShop.name}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.greeting}>
        <Text style={styles.hello}>Olá, {USER.firstName}</Text>
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
          onPress={() => openShopOnMaps(activeShop)}
        />
        <ShortcutTile
          icon="logo-whatsapp"
          title="Suporte"
          subtitle="Fale conosco pelo WhatsApp"
          onPress={() => openShopWhatsApp(activeShop)}
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
  shopChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.XS,
    flexShrink: 1,
    maxWidth: '50%',
    marginLeft: THEME.SPACING.SM,
    paddingVertical: THEME.SPACING.XS,
    paddingHorizontal: THEME.SPACING.SM,
    borderRadius: THEME.BORDER_RADIUS.FULL,
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
  },
  shopChipText: {
    flexShrink: 1,
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: '600',
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
