import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { Service } from '../data/mock';
import { formatDuration, formatPrice } from '../utils/booking';

type Props = {
  service: Service;
  selected: boolean;
  onPress: () => void;
  /** Exibe um indicador de seleção múltipla (checkbox). */
  showCheckbox?: boolean;
  disabled?: boolean;
  /** Texto curto exibido no lugar da duração (ex: motivo do bloqueio). */
  note?: string;
};

export function ServiceCard({ service, selected, onPress, showCheckbox, disabled, note }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected, disabled && styles.cardDisabled]}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={showCheckbox ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected, disabled }}
      accessibilityHint={note}
    >
      {showCheckbox && (
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && (
            <Ionicons name="checkmark" size={THEME.FONT_SIZE.SM} color={THEME.COLORS.TEXT_PRIMARY} />
          )}
        </View>
      )}
      <View style={[styles.iconBox, selected && styles.iconBoxSelected]}>
        <MaterialCommunityIcons
          name={service.icon}
          size={THEME.FONT_SIZE.XL}
          color={selected ? THEME.COLORS.TEXT_PRIMARY : THEME.COLORS.PRIMARY}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{service.name}</Text>
        <View style={styles.durationRow}>
          <Ionicons
            name={note ? 'lock-closed-outline' : 'time-outline'}
            size={THEME.FONT_SIZE.SM}
            color={THEME.COLORS.TEXT_MUTED}
          />
          <Text style={styles.duration}>{note ?? formatDuration(service.durationMin)}</Text>
        </View>
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
  cardDisabled: {
    opacity: 0.45,
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
  iconBox: {
    width: THEME.SPACING.XL + THEME.SPACING.SM,
    height: THEME.SPACING.XL + THEME.SPACING.SM,
    borderRadius: THEME.BORDER_RADIUS.MD,
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.SPACING.MD,
  },
  iconBoxSelected: {
    backgroundColor: THEME.COLORS.PRIMARY,
  },
  info: {
    flex: 1,
  },
  name: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: '600',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.XS,
    marginTop: THEME.SPACING.XS,
  },
  duration: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.SM,
  },
  price: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
  },
});
