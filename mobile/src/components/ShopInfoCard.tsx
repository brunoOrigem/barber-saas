import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { SHOP } from '../data/mock';
import { getWeeklyHours, isShopOpen } from '../utils/booking';
import { openShopOnMaps } from '../utils/contact';

export function ShopInfoCard() {
  const open = isShopOpen();
  const rows = getWeeklyHours();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Horário de funcionamento</Text>
        <View style={[styles.badge, open ? styles.badgeOpen : styles.badgeClosed]}>
          <Text style={[styles.badgeText, open ? styles.badgeTextOpen : styles.badgeTextClosed]}>
            {open ? 'Aberto agora' : 'Fechado'}
          </Text>
        </View>
      </View>

      {rows.map((row) => (
        <View key={row.label} style={styles.hoursRow}>
          <Text style={[styles.day, row.isToday && styles.today]}>{row.label}</Text>
          <Text style={[styles.hours, row.isToday && styles.today]}>{row.value}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.address} onPress={openShopOnMaps} accessibilityRole="link">
        <Ionicons name="location-outline" size={THEME.FONT_SIZE.LG} color={THEME.COLORS.PRIMARY} />
        <View style={styles.addressText}>
          <Text style={styles.street}>{SHOP.address}</Text>
          <Text style={styles.city}>{SHOP.city}</Text>
        </View>
        <Ionicons name="chevron-forward" size={THEME.FONT_SIZE.MD} color={THEME.COLORS.TEXT_MUTED} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.LG,
    padding: THEME.SPACING.MD,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.SPACING.SM,
  },
  title: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
  },
  badge: {
    borderRadius: THEME.BORDER_RADIUS.FULL,
    paddingVertical: THEME.SPACING.XS / 2,
    paddingHorizontal: THEME.SPACING.SM,
  },
  badgeOpen: {
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
  },
  badgeClosed: {
    backgroundColor: THEME.COLORS.CARD_SELECTED,
  },
  badgeText: {
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: 'bold',
  },
  badgeTextOpen: {
    color: THEME.COLORS.SUCCESS,
  },
  badgeTextClosed: {
    color: THEME.COLORS.DANGER,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: THEME.SPACING.XS,
  },
  day: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
  },
  hours: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
  },
  today: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  address: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.SM,
    marginTop: THEME.SPACING.MD,
    paddingTop: THEME.SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: THEME.COLORS.BORDER,
  },
  addressText: {
    flex: 1,
  },
  street: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: '600',
  },
  city: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.XS / 2,
  },
});
