import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { BOOKING_WINDOW_DAYS, BusinessHours, DEMO_BARBER_ID, SLOT_INTERVAL_MIN } from '../data/mock';
import { useCalendar } from '../contexts/CalendarContext';
import { useBookings } from '../contexts/BookingsContext';
import { CalendarLegend, DayMarker, MonthCalendar } from '../components/MonthCalendar';
import { SelectableChip } from '../components/SelectableChip';
import { TimeRangeFields } from '../components/TimeRangeFields';
import { formatLongDate, formatTime, minutesOfDay, timeToMinutes, toDayKey } from '../utils/booking';
import { addDays, DateMode, getDaySlots } from '../utils/calendar';

const MODES: { mode: DateMode; label: string }[] = [
  { mode: 'default', label: 'Padrão' },
  { mode: 'custom', label: 'Horário especial' },
  { mode: 'dayOff', label: 'Folga' },
];

const LEGEND: { marker: DayMarker; label: string }[] = [
  { marker: 'special', label: 'Horário especial' },
  { marker: 'dayOff', label: 'Folga' },
  { marker: 'blocked', label: 'Bloqueios' },
  { marker: 'booked', label: 'Com agendamentos' },
];

function describeHours(hours: BusinessHours) {
  return hours ? `${formatTime(hours.open)} – ${formatTime(hours.close)}` : 'Fechado';
}

export function BarberCalendarScreen() {
  const insets = useSafeAreaInsets();
  const { bookings } = useBookings();
  const { getDateRule, getDayAvailability, updateDateRule, toggleBlockedTime, clearDateRule } =
    useCalendar();

  const [today] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const barberId = DEMO_BARBER_ID;

  // Reservas de clientes com este barbeiro, agrupadas por dia.
  const bookingsByDay = new Map<string, { startMin: number; durationMin: number }[]>();
  for (const b of bookings) {
    if (b.barberId !== barberId || b.status !== 'scheduled') continue;
    const key = toDayKey(new Date(b.startsAt));
    const list = bookingsByDay.get(key) ?? [];
    list.push({ startMin: minutesOfDay(new Date(b.startsAt)), durationMin: b.totalDuration });
    bookingsByDay.set(key, list);
  }

  function markerFor(date: Date): DayMarker | undefined {
    const rule = getDateRule(barberId, date);
    if (rule?.mode === 'dayOff') return 'dayOff';
    if (rule?.mode === 'custom') return 'special';
    if (rule?.blockedTimes.length) return 'blocked';
    if (bookingsByDay.has(toDayKey(date))) return 'booked';
    return undefined;
  }

  const dayKey = toDayKey(selectedDate);
  const rule = getDateRule(barberId, selectedDate);
  const mode = rule?.mode ?? 'default';
  const { hours, weeklyHours, blocked } = getDayAvailability(barberId, selectedDate);
  const dayBookings = bookingsByDay.get(dayKey) ?? [];

  function isBooked(time: string) {
    const start = timeToMinutes(time);
    return dayBookings.some(
      (b) => start < b.startMin + b.durationMin && b.startMin < start + SLOT_INTERVAL_MIN,
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + THEME.SPACING.MD, paddingBottom: THEME.SPACING.LG },
      ]}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Calendário</Text>
      <Text style={styles.subtitle}>
        Escolha uma data para definir folgas, horários especiais ou bloquear horários.
      </Text>

      <MonthCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        minDate={today}
        maxDate={addDays(today, BOOKING_WINDOW_DAYS)}
        getMarker={markerFor}
      />
      <CalendarLegend items={LEGEND} />

      <View style={styles.card}>
        <Text style={styles.dateTitle}>
          {formatLongDate(selectedDate)}
          {selectedDate.getFullYear() !== today.getFullYear() ? ` de ${selectedDate.getFullYear()}` : ''}
        </Text>
        <Text style={styles.dateMeta}>
          Horário semanal: {describeHours(weeklyHours)}
          {mode !== 'default' && ` · Nesta data: ${describeHours(hours)}`}
        </Text>

        <View style={styles.modes}>
          {MODES.map((option) => (
            <SelectableChip
              key={option.mode}
              label={option.label}
              selected={mode === option.mode}
              onPress={() => updateDateRule(barberId, selectedDate, { mode: option.mode })}
              style={styles.modeChip}
            />
          ))}
        </View>

        {mode === 'custom' && rule && (
          <TimeRangeFields
            key={dayKey}
            openTime={rule.openTime}
            closeTime={rule.closeTime}
            onChange={(openTime, closeTime) =>
              updateDateRule(barberId, selectedDate, { openTime, closeTime })
            }
            accessibilitySuffix={`em ${formatLongDate(selectedDate)}`}
          />
        )}

        {dayBookings.length > 0 && (
          <View style={[styles.notice, !hours && styles.noticeDanger]}>
            <Ionicons
              name={hours ? 'people-outline' : 'warning-outline'}
              size={THEME.FONT_SIZE.MD}
              color={hours ? THEME.COLORS.TEXT_SECONDARY : THEME.COLORS.DANGER}
            />
            <Text style={[styles.noticeText, !hours && styles.noticeTextDanger]}>
              {dayBookings.length} {dayBookings.length === 1 ? 'cliente agendado' : 'clientes agendados'}{' '}
              nesta data{!hours ? '. Avise-os antes de folgar.' : '.'}
            </Text>
          </View>
        )}

        {rule && (
          <TouchableOpacity
            style={styles.reset}
            onPress={() => clearDateRule(barberId, selectedDate)}
            accessibilityRole="button"
          >
            <Ionicons name="refresh" size={THEME.FONT_SIZE.SM} color={THEME.COLORS.TEXT_SECONDARY} />
            <Text style={styles.resetText}>Restaurar horário padrão</Text>
          </TouchableOpacity>
        )}
      </View>

      {hours && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Bloquear horários</Text>
          <Text style={styles.dateMeta}>
            Toque num horário para bloqueá-lo ou liberá-lo. {blocked.length}{' '}
            {blocked.length === 1 ? 'bloqueado' : 'bloqueados'}.
          </Text>
          <View style={styles.slots}>
            {getDaySlots(hours).map((time) => (
              <SlotChip
                key={time}
                time={time}
                state={
                  isBooked(time)
                    ? 'booked'
                    : rule?.blockedTimes.includes(time)
                      ? 'blocked'
                      : 'free'
                }
                onPress={() => toggleBlockedTime(barberId, selectedDate, time)}
              />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

type SlotState = 'free' | 'blocked' | 'booked';

function SlotChip({ time, state, onPress }: { time: string; state: SlotState; onPress: () => void }) {
  const label = state === 'booked' ? 'Reservado' : state === 'blocked' ? 'Bloqueado' : 'Livre';
  return (
    <TouchableOpacity
      style={[styles.slot, state === 'blocked' && styles.slotBlocked, state === 'booked' && styles.slotBooked]}
      disabled={state === 'booked'}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ selected: state === 'blocked', disabled: state === 'booked' }}
      accessibilityLabel={`${time}, ${label}`}
    >
      <Text style={[styles.slotTime, state !== 'free' && styles.slotTimeMuted]}>{time}</Text>
      <Text style={[styles.slotLabel, state === 'blocked' && styles.slotLabelBlocked]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND,
  },
  content: {
    paddingHorizontal: THEME.SPACING.MD,
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
    marginBottom: THEME.SPACING.MD,
  },
  card: {
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.LG,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDER,
    padding: THEME.SPACING.MD,
    marginTop: THEME.SPACING.MD,
  },
  dateTitle: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
  },
  dateMeta: {
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS,
  },
  modes: {
    flexDirection: 'row',
    gap: THEME.SPACING.SM,
    marginTop: THEME.SPACING.MD,
  },
  modeChip: {
    flex: 1,
    paddingHorizontal: THEME.SPACING.XS,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.SM,
    marginTop: THEME.SPACING.MD,
    padding: THEME.SPACING.SM,
    borderRadius: THEME.BORDER_RADIUS.MD,
    backgroundColor: THEME.COLORS.CARD_SELECTED,
  },
  noticeDanger: {
    borderWidth: 1,
    borderColor: THEME.COLORS.DANGER,
  },
  noticeText: {
    flex: 1,
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
  },
  noticeTextDanger: {
    color: THEME.COLORS.DANGER,
  },
  reset: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: THEME.SPACING.XS,
    marginTop: THEME.SPACING.MD,
  },
  resetText: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: '600',
  },
  sectionTitle: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
  },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.SPACING.SM,
    marginTop: THEME.SPACING.MD,
  },
  slot: {
    width: '22%',
    alignItems: 'center',
    paddingVertical: THEME.SPACING.SM,
    borderRadius: THEME.BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: THEME.COLORS.PRIMARY,
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
  },
  slotBlocked: {
    borderColor: THEME.COLORS.BORDER,
    backgroundColor: THEME.COLORS.BACKGROUND,
  },
  slotBooked: {
    borderColor: THEME.COLORS.BORDER,
    backgroundColor: THEME.COLORS.CARD_SELECTED,
    opacity: 0.6,
  },
  slotTime: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: 'bold',
  },
  slotTimeMuted: {
    color: THEME.COLORS.TEXT_MUTED,
  },
  slotLabel: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.XS,
    marginTop: THEME.SPACING.XS / 2,
  },
  slotLabelBlocked: {
    color: THEME.COLORS.WARNING,
  },
});
