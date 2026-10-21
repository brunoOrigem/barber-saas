import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../theme';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ title, onPress, disabled }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: THEME.COLORS.PRIMARY,
    borderRadius: THEME.BORDER_RADIUS.SM,
    paddingVertical: THEME.SPACING.MD,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: THEME.COLORS.PRIMARY_DISABLED,
  },
  text: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
  },
  textDisabled: {
    color: THEME.COLORS.TEXT_SECONDARY,
  },
});
