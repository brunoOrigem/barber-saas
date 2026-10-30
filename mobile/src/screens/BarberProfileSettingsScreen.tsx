import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { APP_VERSION, DEMO_BARBER_ID, getBarberById } from '../data/mock';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useServices } from '../contexts/ServicesContext';
import { useSettings } from '../contexts/SettingsContext';
import { SettingsRow, SettingsSection } from '../components/SettingsList';
import { RoleModeSwitch } from '../components/RoleModeSwitch';
import { InstagramLinkEditor } from '../components/InstagramLinkEditor';

const AVATAR_SIZE = THEME.SPACING.XL * 2 + THEME.SPACING.MD;

export function BarberProfileSettingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { posts } = usePortfolio();
  const { activeServices } = useServices();
  const { activeShop } = useSettings();

  const barber = getBarberById(DEMO_BARBER_ID);
  const postsCount = posts.filter((post) => post.barberId === DEMO_BARBER_ID).length;

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + THEME.SPACING.MD }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Perfil profissional</Text>

      {barber && (
        <View style={styles.profileCard}>
          <Image source={{ uri: barber.avatarUrl }} style={styles.avatar} />
          <Text style={styles.name}>{barber.name}</Text>
          <Text style={styles.specialty}>{barber.specialty}</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={THEME.FONT_SIZE.SM} color={THEME.COLORS.WARNING} />
            <Text style={styles.ratingText}>
              {barber.rating.toFixed(1)} · {barber.reviews} avaliações
            </Text>
          </View>
        </View>
      )}

      <SettingsSection title="Dados do profissional">
        <SettingsRow icon="person-outline" label="Nome" value={barber?.name} />
        <SettingsRow icon="cut-outline" label="Especialidade" value={barber?.specialty} />
        <SettingsRow icon="storefront-outline" label="Barbearia" value={activeShop.name} />
        <SettingsRow
          icon="images-outline"
          label="Portfólio"
          value={`${postsCount} ${postsCount === 1 ? 'publicação' : 'publicações'} no feed`}
          onPress={() => navigation.navigate('BarberTabs', { screen: 'BarberPortfolio' })}
        />
        <SettingsRow
          icon="pricetags-outline"
          label="Gerenciar serviços"
          value={`${activeServices.length} ${activeServices.length === 1 ? 'serviço ativo' : 'serviços ativos'} · preços e durações`}
          onPress={() => navigation.navigate('BarberServices')}
          last
        />
      </SettingsSection>

      <InstagramLinkEditor />

      <RoleModeSwitch />

      <SettingsSection title="Sobre e privacidade">
        <SettingsRow
          icon="document-text-outline"
          label="Termos de Uso"
          onPress={() => navigation.navigate('Legal', { type: 'terms' })}
        />
        <SettingsRow
          icon="shield-checkmark-outline"
          label="Política de Privacidade"
          onPress={() => navigation.navigate('Legal', { type: 'privacy' })}
        />
        <SettingsRow
          icon="information-circle-outline"
          label="Versão do app"
          right={<Text style={styles.version}>v{APP_VERSION} · CorteApp Pro</Text>}
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
  title: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.XL,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.MD,
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
    borderWidth: 2,
    borderColor: THEME.COLORS.PRIMARY,
    backgroundColor: THEME.COLORS.CARD_SELECTED,
  },
  name: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.LG,
    fontWeight: 'bold',
    marginTop: THEME.SPACING.MD,
  },
  specialty: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.XS,
    marginTop: THEME.SPACING.SM,
    paddingVertical: THEME.SPACING.XS,
    paddingHorizontal: THEME.SPACING.SM,
    borderRadius: THEME.BORDER_RADIUS.FULL,
    backgroundColor: THEME.COLORS.CARD_SELECTED,
  },
  ratingText: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: '600',
  },
  version: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
  },
});
