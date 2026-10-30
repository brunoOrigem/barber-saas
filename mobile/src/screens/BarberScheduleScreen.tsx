import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { DEMO_BARBER_ID, USER } from '../data/mock';
import { useBookings } from '../contexts/BookingsContext';
import { useServices } from '../contexts/ServicesContext';
import { useSettings } from '../contexts/SettingsContext';
import {
  BarberAppointment,
  describeServices,
  formatDuration,
  formatLongDate,
  formatPrice,
  formatTime,
  getSimulatedAppointments,
  minutesOfDay,
  toDayKey,
} from '../utils/booking';

type AppointmentStatus = 'done' | 'ongoing' | 'upcoming';

const STATUS: Record<AppointmentStatus, { label: string; color: string }> = {
  done: { label: 'Concluído', color: THEME.COLORS.TEXT_MUTED },
  ongoing: { label: 'Em atendimento', color: THEME.COLORS.PRIMARY },
  upcoming: { label: 'Agendado', color: THEME.COLORS.TEXT_SECONDARY },
};

function getStatus(appointment: BarberAppointment, nowMin: number): AppointmentStatus {
  if (nowMin >= appointment.startMin + appointment.durationMin) return 'done';
  if (nowMin >= appointment.startMin) return 'ongoing';
  return 'upcoming';
}

export function BarberScheduleScreen() {
  const insets = useSafeAreaInsets();
  const { bookings } = useBookings();
  const { services } = useServices();
  const { activeShop } = useSettings();

  const now = new Date();
  const todayKey = toDayKey(now);
  const nowMin = minutesOfDay(now);

  const appointments = useMemo(() => {
    // Reservas feitas no modo cliente com este barbeiro também entram na agenda.
    const fromApp: BarberAppointment[] = bookings
      .filter(
        (b) =>
          b.barberId === DEMO_BARBER_ID &&
          b.status === 'scheduled' &&
          toDayKey(new Date(b.startsAt)) === todayKey,
      )
      .map((b) => ({
        id: b.id,
        clientName: USER.fullName,
        serviceIds: b.serviceIds,
        startMin: minutesOfDay(new Date(b.startsAt)),
        durationMin: b.totalDuration,
        price: b.totalPrice,
        fromApp: true,
      }));

    return [...getSimulatedAppointments(DEMO_BARBER_ID, new Date(), services), ...fromApp].sort(
      (a, b) => a.startMin - b.startMin,
    );
  }, [bookings, services, todayKey]);

  const revenue = appointments.reduce((sum, a) => sum + a.price, 0);
  const next = appointments.find((a) => getStatus(a, nowMin) !== 'done');

  return (
    <View style={[styles.container, { paddingTop: insets.top + THEME.SPACING.MD }]}>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Agenda de hoje</Text>
            <Text style={styles.subtitle}>
              {formatLongDate(now)} · {activeShop.name}
            </Text>

            <View style={styles.stats}>
              <StatTile label="Atendimentos" value={String(appointments.length)} />
              <StatTile label="Previsto" value={formatPrice(revenue)} highlighted />
              <StatTile label="Próximo" value={next ? formatTime(next.startMin) : '—'} />
            </View>
          </>
        }
        renderItem={({ item }) => <AppointmentRow appointment={item} status={getStatus(item, nowMin)} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cafe-outline" size={THEME.SPACING.XL * 1.5} color={THEME.COLORS.TEXT_MUTED} />
            <Text style={styles.emptyTitle}>Nenhum corte marcado hoje</Text>
            <Text style={styles.emptyText}>Os agendamentos dos clientes aparecerão aqui.</Text>
          </View>
        }
      />
    </View>
  );
}

function StatTile({ label, value, highlighted }: { label: string; value: string; highlighted?: boolean }) {
  return (
    <View style={[styles.stat, highlighted && styles.statHighlighted]}>
      <Text style={[styles.statValue, highlighted && styles.statValueHighlighted]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function AppointmentRow({
  appointment,
  status,
}: {
  appointment: BarberAppointment;
  status: AppointmentStatus;
}) {
  const { services } = useServices();
  const { label, color } = STATUS[status];
  const done = status === 'done';

  return (
    <View style={styles.row}>
      <View style={styles.timeColumn}>
        <Text style={[styles.time, done && styles.textDone]}>{formatTime(appointment.startMin)}</Text>
        <Text style={styles.timeEnd}>
          {formatTime(appointment.startMin + appointment.durationMin)}
        </Text>
      </View>

      <View style={[styles.card, status === 'ongoing' && styles.cardOngoing, done && styles.cardDone]}>
        <View style={styles.cardHeader}>
          <Text style={styles.client} numberOfLines={1}>
            {appointment.clientName}
          </Text>
          <Text style={[styles.status, { color }]}>{label}</Text>
        </View>
        <Text style={styles.services} numberOfLines={2}>
          {describeServices(appointment.serviceIds, services)}
        </Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Ionicons name="hourglass-outline" size={THEME.FONT_SIZE.SM} color={THEME.COLORS.TEXT_MUTED} />
            <Text style={styles.metaText}>{formatDuration(appointment.durationMin)}</Text>
          </View>
          {appointment.fromApp && (
            <View style={styles.appBadge}>
              <Text style={styles.appBadgeText}>Via app</Text>
            </View>
          )}
          <Text style={styles.price}>{formatPrice(appointment.price)}</Text>
        </View>
      </View>
    </View>
  );
}

const TIME_COLUMN_WIDTH = THEME.SPACING.XL + THEME.SPACING.LG;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND,
    paddingHorizontal: THEME.SPACING.MD,
  },
  list: {
    paddingBottom: THEME.SPACING.LG,
    flexGrow: 1,
  },
  title: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.XL,
    fontWeight: 'bold',
  },
  subtitle: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS,
  },
  stats: {
    flexDirection: 'row',
    gap: THEME.SPACING.SM,
    marginTop: THEME.SPACING.MD,
    marginBottom: THEME.SPACING.LG,
  },
  stat: {
    flex: 1,
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.MD,
    padding: THEME.SPACING.SM + THEME.SPACING.XS,
  },
  statHighlighted: {
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
  },
  statValue: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
  },
  statValueHighlighted: {
    color: THEME.COLORS.PRIMARY,
  },
  statLabel: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.XS / 2,
  },
  row: {
    flexDirection: 'row',
    gap: THEME.SPACING.SM,
    marginBottom: THEME.SPACING.SM,
  },
  timeColumn: {
    width: TIME_COLUMN_WIDTH,
    paddingTop: THEME.SPACING.MD,
  },
  time: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  timeEnd: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.XS / 2,
  },
  textDone: {
    color: THEME.COLORS.TEXT_MUTED,
  },
  card: {
    flex: 1,
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.LG,
    padding: THEME.SPACING.MD,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardOngoing: {
    borderColor: THEME.COLORS.PRIMARY,
  },
  cardDone: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.SM,
  },
  client: {
    flex: 1,
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  status: {
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: 'bold',
  },
  services: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.XS,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.SM,
    marginTop: THEME.SPACING.SM,
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
  appBadge: {
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
    borderRadius: THEME.BORDER_RADIUS.FULL,
    paddingHorizontal: THEME.SPACING.SM,
    paddingVertical: THEME.SPACING.XS / 2,
  },
  appBadgeText: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: 'bold',
  },
  price: {
    marginLeft: 'auto',
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  empty: {
    alignItems: 'center',
    paddingTop: THEME.SPACING.XL * 2,
  },
  emptyTitle: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
    marginTop: THEME.SPACING.MD,
  },
  emptyText: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS,
  },
});
