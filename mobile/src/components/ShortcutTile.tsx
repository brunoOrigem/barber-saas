import React, { ComponentProps } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';

type Props = {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
  /** Destaque em verde para a ação principal. */
  highlighted?: boolean;
};

export function ShortcutTile({ icon, title, subtitle, onPress, highlighted }: Props) {
  return (
    <TouchableOpacity
      style={[styles.tile, highlighted && styles.tileHighlighted]}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={[styles.iconBox, highlighted && styles.iconBoxHighlighted]}>
        <Ionicons
          name={icon}
          size={THEME.FONT_SIZE.XL}
          color={highlighted ? THEME.COLORS.TEXT_PRIMARY : THEME.COLORS.PRIMARY}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.subtitle, highlighted && styles.subtitleHighlighted]} numberOfLines={2}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.LG,
    padding: THEME.SPACING.MD,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDER,
  },
  tileHighlighted: {
    backgroundColor: THEME.COLORS.PRIMARY,
    borderColor: THEME.COLORS.PRIMARY,
  },
  iconBox: {
    width: THEME.SPACING.XL + THEME.SPACING.MD,
    height: THEME.SPACING.XL + THEME.SPACING.MD,
    borderRadius: THEME.BORDER_RADIUS.MD,
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.SPACING.MD,
  },
  iconBoxHighlighted: {
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
  },
  title: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
  },
  subtitle: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.XS,
  },
  subtitleHighlighted: {
    color: THEME.COLORS.TEXT_PRIMARY,
  },
});
