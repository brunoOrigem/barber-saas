import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../theme';
import { MONTHS, toDayKey } from '../utils/booking';
import { addMonths, getMonthWeeks, isDateInRange, isSameDay, startOfMonth } from '../utils/calendar';

/** Indicador exibido sob o número do dia. */
export type DayMarker = 'special' | 'dayOff' | 'blocked' | 'booked';

export const MARKER_COLORS: Record<DayMarker, string> = {
  special: THEME.COLORS.PRIMARY,
  dayOff: THEME.COLORS.DANGER,
  blocked: THEME.COLORS.WARNING,
  booked: THEME.COLORS.TEXT_PRIMARY,
};

type Props = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  minDate: Date;
  maxDate: Date;
  /** Dias dentro do intervalo que não podem ser escolhidos (ex: barbearia fechada). */
  isDateDisabled?: (date: Date) => boolean;
  getMarker?: (date: Date) => DayMarker | undefined;
};

const WEEKDAY_INITIALS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Calendário mensal com navegação por todos os meses entre `minDate` e `maxDate`. */
export function MonthCalendar({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
  isDateDisabled,
  getMarker,
}: Props) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(selectedDate));
  const today = new Date();

  const firstMonth = startOfMonth(minDate);
  const lastMonth = startOfMonth(maxDate);
  const canGoBack = visibleMonth.getTime() > firstMonth.getTime();
  const canGoForward = visibleMonth.getTime() < lastMonth.getTime();

  const months: Date[] = [];
  for (let m = firstMonth; m.getTime() <= lastMonth.getTime(); m = addMonths(m, 1)) months.push(m);

  const weeks = getMonthWeeks(visibleMonth);

  return (
    <View style={styles.card}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.monthStrip}
      >
        {months.map((month) => {
          const active = month.getTime() === visibleMonth.getTime();
          const showYear = month.getFullYear() !== today.getFullYear();
          return (
            <TouchableOpacity
              key={month.getTime()}
              style={[styles.monthChip, active && styles.monthChipActive]}
              onPress={() => setVisibleMonth(month)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${MONTHS[month.getMonth()]} de ${month.getFullYear()}`}
            >
              <Text style={[styles.monthChipText, active && styles.monthChipTextActive]}>
                {capitalize(MONTHS[month.getMonth()].slice(0, 3))}
                {showYear ? ` ${String(month.getFullYear()).slice(2)}` : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.header}>
        <NavButton icon="chevron-back" disabled={!canGoBack} onPress={() => setVisibleMonth(addMonths(visibleMonth, -1))} label="Mês anterior" />
        <Text style={styles.monthTitle}>
          {capitalize(MONTHS[visibleMonth.getMonth()])} de {visibleMonth.getFullYear()}
        </Text>
        <NavButton icon="chevron-forward" disabled={!canGoForward} onPress={() => setVisibleMonth(addMonths(visibleMonth, 1))} label="Próximo mês" />
      </View>

      <View style={styles.week}>
        {WEEKDAY_INITIALS.map((initial, index) => (
          <Text key={index} style={styles.weekday}>
            {initial}
          </Text>
        ))}
      </View>

      {weeks.map((week, index) => (
        <View key={index} style={styles.week}>
          {week.map((date, column) => {
            if (!date) return <View key={column} style={styles.cell} />;

            const disabled = !isDateInRange(date, minDate, maxDate) || !!isDateDisabled?.(date);
            const selected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);
            const marker = isDateInRange(date, minDate, maxDate) ? getMarker?.(date) : undefined;

            return (
              <TouchableOpacity
                key={toDayKey(date)}
                style={styles.cell}
                disabled={disabled}
                onPress={() => onSelectDate(date)}
                accessibilityRole="button"
                accessibilityState={{ selected, disabled }}
                accessibilityLabel={`${date.getDate()} de ${MONTHS[date.getMonth()]}`}
              >
                <View
                  style={[
                    styles.day,
                    isToday && styles.dayToday,
                    selected && styles.daySelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      disabled && styles.dayTextDisabled,
                      selected && styles.dayTextSelected,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                </View>
                <View
                  style={[
                    styles.marker,
                    marker && { backgroundColor: selected ? THEME.COLORS.TEXT_PRIMARY : MARKER_COLORS[marker] },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function NavButton({
  icon,
  disabled,
  onPress,
  label,
}: {
  icon: 'chevron-back' | 'chevron-forward';
  disabled: boolean;
  onPress: () => void;
  label: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={styles.navButton}
      hitSlop={THEME.SPACING.SM}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons
        name={icon}
        size={THEME.FONT_SIZE.LG}
        color={disabled ? THEME.COLORS.CARD_SELECTED : THEME.COLORS.TEXT_PRIMARY}
      />
    </TouchableOpacity>
  );
}

/** Legenda dos indicadores usados no calendário. */
export function CalendarLegend({ items }: { items: { marker: DayMarker; label: string }[] }) {
  return (
    <View style={styles.legend}>
      {items.map(({ marker, label }) => (
        <View key={marker} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: MARKER_COLORS[marker] }]} />
          <Text style={styles.legendText}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

const DAY_SIZE = THEME.SPACING.XL + THEME.SPACING.XS;
const MARKER_SIZE = THEME.SPACING.XS + 1;

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.LG,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDER,
    paddingVertical: THEME.SPACING.MD,
    paddingHorizontal: THEME.SPACING.SM,
  },
  monthStrip: {
    gap: THEME.SPACING.SM,
    paddingHorizontal: THEME.SPACING.XS,
    paddingBottom: THEME.SPACING.MD,
  },
  monthChip: {
    paddingVertical: THEME.SPACING.XS,
    paddingHorizontal: THEME.SPACING.SM + THEME.SPACING.XS,
    borderRadius: THEME.BORDER_RADIUS.FULL,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDER,
  },
  monthChipActive: {
    backgroundColor: THEME.COLORS.PRIMARY_SOFT,
    borderColor: THEME.COLORS.PRIMARY,
  },
  monthChipText: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: '600',
  },
  monthChipTextActive: {
    color: THEME.COLORS.PRIMARY,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.SPACING.XS,
    marginBottom: THEME.SPACING.SM,
  },
  navButton: {
    padding: THEME.SPACING.XS,
  },
  monthTitle: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: 'bold',
  },
  week: {
    flexDirection: 'row',
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    color: THEME.COLORS.TEXT_MUTED,
    fontSize: THEME.FONT_SIZE.XS,
    fontWeight: '600',
    paddingVertical: THEME.SPACING.XS,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: THEME.SPACING.XS / 2,
  },
  day: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: THEME.BORDER_RADIUS.FULL,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayToday: {
    borderColor: THEME.COLORS.PRIMARY,
  },
  daySelected: {
    backgroundColor: THEME.COLORS.PRIMARY,
    borderColor: THEME.COLORS.PRIMARY,
  },
  dayText: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.SM,
    fontWeight: '600',
  },
  dayTextDisabled: {
    color: THEME.COLORS.TEXT_MUTED,
    opacity: 0.5,
    fontWeight: 'normal',
  },
  dayTextSelected: {
    color: THEME.COLORS.TEXT_PRIMARY,
  },
  marker: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: THEME.BORDER_RADIUS.FULL,
    marginTop: THEME.SPACING.XS / 2,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.SPACING.MD,
    marginTop: THEME.SPACING.SM,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.XS,
  },
  legendDot: {
    width: MARKER_SIZE + 2,
    height: MARKER_SIZE + 2,
    borderRadius: THEME.BORDER_RADIUS.FULL,
  },
  legendText: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.XS,
  },
});
