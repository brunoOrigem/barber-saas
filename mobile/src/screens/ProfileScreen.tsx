import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { USER } from '../data/mock';
import { useBookings } from '../contexts/BookingsContext';
import { useSettings } from '../contexts/SettingsContext';
import { SettingsRow, SettingsSection } from '../components/SettingsList';
import { openShopWhatsApp } from '../utils/contact';

const AVATAR_SIZE = THEME.SPACING.XL * 2 + THEME.SPACING.MD;
const HEADER_BUTTON_SIZE = THEME.SPACING.XL + THEME.SPACING.SM;

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { history } = useBookings();
  const { activeShop } = useSettings();

  const completedCount = history.filter((b) => b.status === 'completed').length;
  const initials = USER.fullName
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + THEME.SPACING.MD }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
          accessibilityRole="button"
          accessibilityLabel="Configurações"
        >
          <Ionicons name="settings-outline" size={THEME.FONT_SIZE.LG} color={THEME.COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <Text style={styles.name}>{USER.fullName}</Text>
        <Text style={styles.stat}>
          {completedCount} {completedCount === 1 ? 'corte realizado' : 'cortes realizados'}
        </Text>
      </View>

      <SettingsSection title="Dados da conta">
        <SettingsRow icon="person-outline" label="Nome" value={USER.fullName} />
        <SettingsRow icon="mail-outline" label="E-mail" value={USER.email} />
        <SettingsRow icon="call-outline" label="Telefone" value={USER.phone} last />
      </SettingsSection>

      <SettingsSection title="Geral">
        <SettingsRow
          icon="settings-outline"
          label="Configurações"
          value="Lembretes, barbearia e privacidade"
          onPress={() => navigation.navigate('Settings')}
        />
        <SettingsRow
          icon="logo-whatsapp"
          label="Falar com o suporte"
          value={activeShop.name}
          onPress={() => openShopWhatsApp(activeShop)}
          last
        />
      </SettingsSection>
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
    marginBottom: THEME.SPACING.MD,
  },
  title: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.XL,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: HEADER_BUTTON_SIZE,
    height: HEADER_BUTTON_SIZE,
    borderRadius: THEME.BORDER_RADIUS.MD,
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.LG,
    padding: THEME.SPACING.LG,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: THEME.BORDER_RADIUS.FULL,
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
    borderWidth: 2,
    borderColor: THEME.COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.XL,
    fontWeight: 'bold',
  },
  name: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.LG,
    fontWeight: 'bold',
    marginTop: THEME.SPACING.MD,
  },
  stat: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS,
  },
});
