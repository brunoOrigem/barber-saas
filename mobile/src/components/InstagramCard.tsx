import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { useSettings } from '../contexts/SettingsContext';
import { openInstagramProfile } from '../utils/contact';

const ICON_BOX_SIZE = THEME.SPACING.XL + THEME.SPACING.MD;

/** Atalho para o Instagram da barbearia ativa; não renderiza nada se não houver perfil. */
export function InstagramCard() {
  const { activeShop } = useSettings();
  const handle = activeShop.instagram;

  if (!handle) return null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openInstagramProfile(handle)}
      activeOpacity={0.8}
      accessibilityRole="link"
      accessibilityLabel={`Abrir o Instagram da ${activeShop.name}: @${handle}`}
    >
      <View style={styles.iconBox}>
        <FontAwesome name="instagram" size={THEME.FONT_SIZE.XL} color={THEME.COLORS.PRIMARY} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>Siga no Instagram</Text>
        <Text style={styles.handle} numberOfLines={1}>
          @{handle}
        </Text>
      </View>
      <Ionicons name="open-outline" size={THEME.FONT_SIZE.MD} color={THEME.COLORS.TEXT_MUTED} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.MD,
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.LG,
    padding: THEME.SPACING.MD,
    marginTop: THEME.SPACING.SM,
  },
  iconBox: {
    width: ICON_BOX_SIZE,
    height: ICON_BOX_SIZE,
    borderRadius: THEME.BORDER_RADIUS.MD,
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
  title: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
  },
  handle: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: '600',
    marginTop: THEME.SPACING.XS / 2,
  },
});
