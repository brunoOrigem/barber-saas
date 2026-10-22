import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { Booking, BookingStatus } from '../contexts/BookingsContext';
import { getBarberById } from '../data/mock';
import {
  describeServices,
  formatDuration,
  formatPrice,
  formatRelativeDay,
  formatTime,
  minutesOfDay,
} from '../utils/booking';

type Props = {
  booking: Booking;
  onCancel?: () => void;
  onRebook?: () => void;
};

const STATUS: Record<BookingStatus, { label: string; color: string }> = {
  scheduled: { label: 'Confirmado', color: THEME.COLORS.SUCCESS },
  completed: { label: 'Concluído', color: THEME.COLORS.TEXT_SECONDARY },
  cancelled: { label: 'Cancelado', color: THEME.COLORS.DANGER },
};

const AVATAR_SIZE = THEME.SPACING.XL + THEME.SPACING.SM;

export function BookingCard({ booking, onCancel, onRebook }: Props) {
  const barber = getBarberById(booking.barberId);
  const date = new Date(booking.startsAt);
  const status = STATUS[booking.status];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {barber && <Image source={{ uri: barber.avatarUrl }} style={styles.avatar} />}
        <View style={styles.info}>
          <Text style={styles.services} numberOfLines={2}>
            {describeServices(booking.serviceIds)}
          </Text>
          <Text style={styles.barber}>com {barber?.name}</Text>
        </View>
        <Text style={[styles.status, { color: status.color }]}>{status.label}</Text>
      </View>

      <View style={styles.meta}>
        <MetaItem icon="calendar-outline" text={formatRelativeDay(date)} />
        <MetaItem icon="time-outline" text={formatTime(minutesOfDay(date))} />
        <MetaItem icon="hourglass-outline" text={formatDuration(booking.totalDuration)} />
        <Text style={styles.price}>{formatPrice(booking.totalPrice)}</Text>
      </View>

      {(onCancel || onRebook) && (
        <View style={styles.actions}>
          {onCancel && (
            <TouchableOpacity style={styles.action} onPress={onCancel} accessibilityRole="button">
              <Text style={[styles.actionText, styles.cancelText]}>Cancelar</Text>
            </TouchableOpacity>
          )}
          {onRebook && (
            <TouchableOpacity style={styles.action} onPress={onRebook} accessibilityRole="button">
              <Text style={styles.actionText}>Agendar novamente</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

function MetaItem({ icon, text }: { icon: React.ComponentProps<typeof Ionicons>['name']; text: string }) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={THEME.FONT_SIZE.SM} color={THEME.COLORS.TEXT_MUTED} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.LG,
    padding: THEME.SPACING.MD,
    marginBottom: THEME.SPACING.SM,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: THEME.BORDER_RADIUS.FULL,
    backgroundColor: THEME.COLORS.CARD_SELECTED,
    marginRight: THEME.SPACING.SM,
  },
  info: {
    flex: 1,
  },
  services: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  barber: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.XS / 2,
  },
  status: {
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: 'bold',
    marginLeft: THEME.SPACING.SM,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: THEME.SPACING.MD,
    marginTop: THEME.SPACING.MD,
    paddingTop: THEME.SPACING.SM,
    borderTopWidth: 1,
    borderTopColor: THEME.COLORS.BORDER,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.XS,
  },
  metaText: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.XS,
  },
  price: {
    marginLeft: 'auto',
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: THEME.SPACING.SM,
    marginTop: THEME.SPACING.MD,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: THEME.SPACING.SM,
    borderRadius: THEME.BORDER_RADIUS.SM,
    backgroundColor: THEME.COLORS.CARD_SELECTED,
  },
  actionText: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  cancelText: {
    color: THEME.COLORS.DANGER,
  },
});
