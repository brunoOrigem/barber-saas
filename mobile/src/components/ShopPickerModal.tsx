import React from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { PARTNER_SHOPS } from '../data/mock';

type Props = {
  visible: boolean;
  activeShopId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
};

export function ShopPickerModal({ visible, activeShopId, onSelect, onClose }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Fechar">
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + THEME.SPACING.LG }]}>
          <Text style={styles.title}>Trocar barbearia</Text>
          <Text style={styles.subtitle}>Escolha a barbearia parceira que deseja usar no app.</Text>

          {PARTNER_SHOPS.map((shop) => {
            const active = shop.id === activeShopId;
            return (
              <TouchableOpacity
                key={shop.id}
                style={[styles.option, active && styles.optionActive]}
                onPress={() => onSelect(shop.id)}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
              >
                <View style={styles.optionIcon}>
                  <Ionicons name="storefront-outline" size={THEME.FONT_SIZE.LG} color={THEME.COLORS.PRIMARY} />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionName}>{shop.name}</Text>
                  <Text style={styles.optionAddress} numberOfLines={1}>
                    {shop.address}
                  </Text>
                </View>
                <Ionicons
                  name={active ? 'radio-button-on' : 'radio-button-off'}
                  size={THEME.FONT_SIZE.LG}
                  color={active ? THEME.COLORS.PRIMARY : THEME.COLORS.TEXT_MUTED}
                />
              </TouchableOpacity>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: THEME.COLORS.OVERLAY,
  },
  sheet: {
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderTopLeftRadius: THEME.BORDER_RADIUS.LG,
    borderTopRightRadius: THEME.BORDER_RADIUS.LG,
    padding: THEME.SPACING.LG,
  },
  title: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.LG,
    fontWeight: 'bold',
  },
  subtitle: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS,
    marginBottom: THEME.SPACING.MD,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.MD,
    padding: THEME.SPACING.MD,
    borderRadius: THEME.BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDER,
    marginBottom: THEME.SPACING.SM,
  },
  optionActive: {
    borderColor: THEME.COLORS.PRIMARY,
    backgroundColor: THEME.COLORS.CARD_SELECTED,
  },
  optionIcon: {
    width: THEME.SPACING.XL + THEME.SPACING.SM,
    height: THEME.SPACING.XL + THEME.SPACING.SM,
    borderRadius: THEME.BORDER_RADIUS.MD,
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionName: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  optionAddress: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.XS / 2,
  },
});
