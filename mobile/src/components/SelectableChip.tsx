import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { THEME } from '../theme';

type Props = {
  label: string;
  sublabel?: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Chip selecionável usado para datas e horários. */
export function SelectableChip({ label, sublabel, selected, onPress, style }: Props) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected, style]}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
      {sublabel && (
        <Text style={[styles.sublabel, selected && styles.labelSelected]}>{sublabel}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.MD,
    paddingVertical: THEME.SPACING.SM,
    paddingHorizontal: THEME.SPACING.MD,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDER,
  },
  chipSelected: {
    backgroundColor: THEME.COLORS.PRIMARY,
    borderColor: THEME.COLORS.PRIMARY,
  },
  label: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: '600',
  },
  sublabel: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.XS,
  },
  labelSelected: {
    color: THEME.COLORS.TEXT_PRIMARY,
  },
});
