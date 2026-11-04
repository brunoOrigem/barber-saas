import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../theme';
import { useSettings, WorkingDay } from '../contexts/SettingsContext';
import { TimeRangeFields } from '../components/TimeRangeFields';

export function BarberWorkingHoursScreen() {
  const insets = useSafeAreaInsets();
  const { workingDays, updateWorkingDay, activeShop } = useSettings();

  const openCount = workingDays.filter((d) => d.isOpen).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + THEME.SPACING.LG }]}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.subtitle}>
        {activeShop.name} abre {openCount} {openCount === 1 ? 'dia' : 'dias'} por semana. As
        alterações são salvas automaticamente e já valem para novos agendamentos.
      </Text>

      {workingDays.map((day) => (
        <WorkingDayCard key={day.day} day={day} onChange={(data) => updateWorkingDay(day.day, data)} />
      ))}
    </ScrollView>
  );
}

function WorkingDayCard({
  day,
  onChange,
}: {
  day: WorkingDay;
  onChange: (data: Partial<WorkingDay>) => void;
}) {
  return (
    <View style={[styles.card, !day.isOpen && styles.cardClosed]}>
      <View style={styles.header}>
        <View style={styles.dayInfo}>
          <Text style={styles.dayName}>{day.day}</Text>
          <Text style={[styles.status, day.isOpen ? styles.statusOpen : styles.statusClosed]}>
            {day.isOpen ? `${day.openTime} – ${day.closeTime}` : 'Fechado'}
          </Text>
        </View>
        <Switch
          value={day.isOpen}
          onValueChange={(isOpen) => onChange({ isOpen })}
          trackColor={{ false: THEME.COLORS.CARD_SELECTED, true: THEME.COLORS.PRIMARY }}
          thumbColor={THEME.COLORS.TEXT_PRIMARY}
          accessibilityLabel={`${day.day} aberto`}
        />
      </View>

      {day.isOpen && (
        <TimeRangeFields
          openTime={day.openTime}
          closeTime={day.closeTime}
          onChange={(openTime, closeTime) => onChange({ openTime, closeTime })}
          accessibilitySuffix={`de ${day.day}`}
        />
      )}
    </View>
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
  subtitle: {
    color: THEME.COLORS.TEXT_SECONDARY,
    fontSize: THEME.FONT_SIZE.SM,
    marginBottom: THEME.SPACING.MD,
  },
  card: {
    backgroundColor: THEME.COLORS.CARD_BACKGROUND,
    borderRadius: THEME.BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDER,
    padding: THEME.SPACING.MD,
    marginBottom: THEME.SPACING.SM,
  },
  cardClosed: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.SPACING.MD,
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    color: THEME.COLORS.TEXT_PRIMARY,
    fontSize: THEME.FONT_SIZE.MD,
    fontWeight: '600',
  },
  status: {
    fontSize: THEME.FONT_SIZE.SM,
    marginTop: THEME.SPACING.XS,
  },
  statusOpen: {
    color: THEME.COLORS.PRIMARY,
  },
  statusClosed: {
    color: THEME.COLORS.TEXT_MUTED,
  },
});
