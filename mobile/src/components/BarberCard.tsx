import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { Barber } from '../data/mock';

type Props = {
  barber: Barber;
  selected: boolean;
  onPress: () => void;
};

const AVATAR_SIZE = THEME.SPACING.XL * 2;

export function BarberCard({ barber, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
    >
      <Image source={{ uri: barber.avatarUrl }} style={styles.avatar} />
      <Text style={styles.name} numberOfLines={1}>
        {barber.name}
      </Text>
      <View style={styles.ratingRow}>
        <Ionicons name="star" size={THEME.FONT_SIZE.XS} color={THEME.COLORS.WARNING} />
        <Text style={styles.rating}> {barber.rating.toFixed(1)}</Text>
        <Text style={styles.reviews}> ({barber.reviews})</Text>
      </View>
      <Text style={styles.specialty} numberOfLines={2}>
        {barber.specialty}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.LG,
    padding: THEME.SPACING.MD,
    marginRight: THEME.SPACING.SM,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME.COLORS.CARD_BACKGROUND,
  },
  cardSelected: {
    borderColor: THEME.COLORS.PRIMARY,
    backgroundColor: THEME.COLORS.CARD_SELECTED,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: THEME.BORDER_RADIUS.FULL,
    backgroundColor: THEME.COLORS.CARD_SELECTED,
    marginBottom: THEME.SPACING.SM,
  },
  name: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: THEME.SPACING.XS,
  },
  rating: {
    color: THEME.COLORS.WARNING,
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: 'bold',
  },
  reviews: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
  },
  specialty: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.XS,
    textAlign: 'center',
    marginTop: THEME.SPACING.XS,
  },
});
