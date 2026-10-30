import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { Booking } from '../contexts/BookingsContext';
import { useServices } from '../contexts/ServicesContext';
import { getBarberById } from '../data/mock';
import { describeServices, formatRelativeDay, formatTime, minutesOfDay } from '../utils/booking';

type Props = {
  booking?: Booking;
  onPressDetails: () => void;
  onPressSchedule: () => void;
};

const AVATAR_SIZE = THEME.SPACING.XL + THEME.SPACING.MD;

export function NextBookingCard({ booking, onPressDetails, onPressSchedule }: Props) {
  const { services } = useServices();

  if (!booking) {
    return (
      <TouchableOpacity
        style={[styles.card, styles.banner]}
        activeOpacity={0.85}
        onPress={onPressSchedule}
        accessibilityRole="button"
      >
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>Agende seu próximo horário</Text>
          <Text style={styles.bannerSubtitle}>
            Escolha o profissional e garanta o seu lugar em poucos toques.
          </Text>
          <View style={styles.bannerCta}>
            <Text style={styles.bannerCtaText}>Agendar agora</Text>
            <Ionicons name="arrow-forward" size={THEME.FONT_SIZE.MD} color={THEME.COLORS.BACKGROUND} />
          </View>
        </View>
        <Ionicons name="cut" size={THEME.SPACING.XL * 2} color={THEME.COLORS.PRIMARY} />
      </TouchableOpacity>
    );
  }

  const barber = getBarberById(booking.barberId);
  const date = new Date(booking.startsAt);

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>SEU PRÓXIMO CORTE</Text>

      <View style={styles.row}>
        {barber && <Image source={{ uri: barber.avatarUrl }} style={styles.avatar} />}
        <View style={styles.info}>
          <Text style={styles.barberName}>{barber?.name}</Text>
          <Text style={styles.services} numberOfLines={1}>
            {describeServices(booking.serviceIds, services)}
          </Text>
        </View>
      </View>

      <View style={styles.dateRow}>
        <View style={styles.dateItem}>
          <Ionicons name="calendar-outline" size={THEME.FONT_SIZE.MD} color={THEME.COLORS.PRIMARY} />
          <Text style={styles.dateText}>{formatRelativeDay(date)}</Text>
        </View>
        <View style={styles.dateItem}>
          <Ionicons name="time-outline" size={THEME.FONT_SIZE.MD} color={THEME.COLORS.PRIMARY} />
          <Text style={styles.dateText}>{formatTime(minutesOfDay(date))}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.detailsButton} onPress={onPressDetails} accessibilityRole="button">
        <Text style={styles.detailsText}>Ver detalhes</Text>
        <Ionicons name="chevron-forward" size={THEME.FONT_SIZE.MD} color={THEME.COLORS.PRIMARY} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.LG,
    padding: THEME.SPACING.MD,
    borderWidth: 1,
    borderColor: THEME.COLORS.PRIMARY_SOFT,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
    borderColor: THEME.COLORS.PRIMARY,
  },
  bannerText: {
    flex: 1,
    marginRight: THEME.SPACING.SM,
  },
  bannerTitle: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.LG,
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS,
  },
  bannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: THEME.SPACING.XS,
    backgroundColor: THEME.COLORS.PRIMARY,
    borderRadius: THEME.BORDER_RADIUS.FULL,
    paddingVertical: THEME.SPACING.SM,
    paddingHorizontal: THEME.SPACING.MD,
    marginTop: THEME.SPACING.MD,
  },
  bannerCtaText: {
    color: THEME.COLORS.BACKGROUND,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  eyebrow: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: THEME.SPACING.SM,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: THEME.BORDER_RADIUS.FULL,
    backgroundColor: THEME.COLORS.CARD_SELECTED,
    marginRight: THEME.SPACING.MD,
  },
  info: {
    flex: 1,
  },
  barberName: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
  },
  services: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS,
  },
  dateRow: {
    flexDirection: 'row',
    gap: THEME.SPACING.LG,
    marginTop: THEME.SPACING.MD,
    paddingTop: THEME.SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: THEME.COLORS.BORDER,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.XS,
  },
  dateText: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: '600',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.SPACING.XS,
    marginTop: THEME.SPACING.MD,
    paddingVertical: THEME.SPACING.SM,
    borderRadius: THEME.BORDER_RADIUS.SM,
    backgroundColor: THEME.COLORS.CARD_SELECTED,
  },
  detailsText: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
});
