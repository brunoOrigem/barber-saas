import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../theme';
import { Service } from '../data/mock';
import { formatDuration, formatPrice } from '../utils/booking';

type Props = {
  service: Service;
  selected: boolean;
  onPress: () => void;
  /** Exibe um indicador de seleção múltipla (checkbox). */
  showCheckbox?: boolean;
};

export function ServiceCard({ service, selected, onPress, showCheckbox }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole={showCheckbox ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected }}
    >
      {showCheckbox && (
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      )}
      <Text style={styles.icon}>{service.icon}</Text>
      <View style={styles.info}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.duration}>⏱️ {formatDuration(service.durationMin)}</Text>
      </View>
      <Text style={styles.price}>{formatPrice(service.price)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.MD,
    padding: THEME.SPACING.MD,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.SPACING.SM,
    borderWidth: 2,
    borderColor: THEME.COLORS.CARD_BACKGROUND,
  },
  cardSelected: {
    borderColor: THEME.COLORS.PRIMARY,
    backgroundColor: THEME.COLORS.CARD_SELECTED,
  },
  checkbox: {
    width: THEME.SPACING.LG,
    height: THEME.SPACING.LG,
    borderRadius: THEME.BORDER_RADIUS.SM,
    borderWidth: 2,
    borderColor: THEME.COLORS.TEXT_MUTED,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.SPACING.MD,
  },
  checkboxSelected: {
    borderColor: THEME.COLORS.PRIMARY,
    backgroundColor: THEME.COLORS.PRIMARY,
  },
  checkmark: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  icon: {
    fontSize: THEME.FONT_SIZE.XL,
    marginRight: THEME.SPACING.MD,
  },
  info: {
    flex: 1,
  },
  name: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: '600',
  },
  duration: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS,
  },
  price: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
  },
});
