import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { APP_VERSION } from '../data/mock';
import { RootStackParamList } from '../routes/types';
import { useSettings } from '../contexts/SettingsContext';
import { SettingsRow, SettingsSection, SettingsSwitchRow } from '../components/SettingsList';
import { ShopPickerModal } from '../components/ShopPickerModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { activeShop, setActiveShopId, preferences, setPreference } = useSettings();
  const [shopPickerVisible, setShopPickerVisible] = useState(false);

  function confirmLogout() {
    Alert.alert('Sair da conta', 'Tem certeza de que deseja sair? Você precisará entrar novamente.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        // Sem autenticação no MVP: volta para o início do app.
        onPress: () => navigation.popTo('MainTabs', { screen: 'Home' }),
      },
    ]);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + THEME.SPACING.LG }]}
      showsVerticalScrollIndicator={false}
    >
      <SettingsSection title="Preferências e notificações">
        <SettingsSwitchRow
          icon="alarm-outline"
          label="Lembrete 24h antes"
          value="Aviso um dia antes do corte"
          enabled={preferences.reminder24h}
          onChange={(value) => setPreference('reminder24h', value)}
        />
        <SettingsSwitchRow
          icon="time-outline"
          label="Lembrete 2h antes"
          value="Aviso no dia, perto do horário"
          enabled={preferences.reminder2h}
          onChange={(value) => setPreference('reminder2h', value)}
        />
        <SettingsSwitchRow
          icon="logo-whatsapp"
          label="Notificações via WhatsApp"
          value="Confirmações e lembretes no WhatsApp"
          enabled={preferences.whatsappNotifications}
          onChange={(value) => setPreference('whatsappNotifications', value)}
          last
        />
      </SettingsSection>

      <Text style={styles.sectionTitle}>Barbearia parceira</Text>
      <View style={styles.shopCard}>
        <View style={styles.shopIcon}>
          <Ionicons name="storefront" size={THEME.FONT_SIZE.XL} color={THEME.COLORS.PRIMARY} />
        </View>
        <View style={styles.shopText}>
          <Text style={styles.shopLabel}>Barbearia ativa</Text>
          <Text style={styles.shopName}>{activeShop.name}</Text>
          <Text style={styles.shopAddress} numberOfLines={1}>
            {activeShop.address}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.switchShopButton}
        onPress={() => setShopPickerVisible(true)}
        accessibilityRole="button"
      >
        <Ionicons name="swap-horizontal" size={THEME.FONT_SIZE.MD} color={THEME.COLORS.PRIMARY} />
        <Text style={styles.switchShopText}>Trocar Barbearia</Text>
      </TouchableOpacity>

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
          right={<Text style={styles.version}>v{APP_VERSION} · CorteApp SaaS</Text>}
          last
        />
      </SettingsSection>

      <SettingsSection title="Conta">
        <SettingsRow icon="log-out-outline" label="Sair da Conta" danger last onPress={confirmLogout} />
      </SettingsSection>

      <ShopPickerModal
        visible={shopPickerVisible}
        activeShopId={activeShop.id}
        onSelect={(id) => {
          setActiveShopId(id);
          setShopPickerVisible(false);
        }}
        onClose={() => setShopPickerVisible(false)}
      />
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
  },
  sectionTitle: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: THEME.SPACING.LG,
    marginBottom: THEME.SPACING.SM,
  },
  shopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.MD,
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.LG,
    padding: THEME.SPACING.MD,
    borderWidth: 1,
    borderColor: THEME.COLORS.PRIMARY_SOFT,
  },
  shopIcon: {
    width: THEME.SPACING.XL + THEME.SPACING.MD,
    height: THEME.SPACING.XL + THEME.SPACING.MD,
    borderRadius: THEME.BORDER_RADIUS.MD,
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopText: {
    flex: 1,
  },
  shopLabel: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: 'bold',
  },
  shopName: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
    marginTop: THEME.SPACING.XS / 2,
  },
  shopAddress: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.XS / 2,
  },
  switchShopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.SPACING.SM,
    marginTop: THEME.SPACING.SM,
    paddingVertical: THEME.SPACING.MD,
    borderRadius: THEME.BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: THEME.COLORS.PRIMARY,
  },
  switchShopText: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  version: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
  },
});
