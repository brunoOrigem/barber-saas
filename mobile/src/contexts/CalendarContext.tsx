import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useSettings } from './SettingsContext';
import { toDayKey, WEEKDAYS_LONG } from '../utils/booking';
import { DateRule, DayAvailability, isEmptyRule, resolveDayAvailability } from '../utils/calendar';

/** Regras por barbeiro e por data (`toDayKey`), até existir backend. */
type RulesByBarber = Record<string, Record<string, DateRule>>;

type CalendarContextValue = {
  /** Regra explícita do barbeiro para a data, se houver. */
  getDateRule: (barberId: string, date: Date) => DateRule | undefined;
  /** Horário efetivo do barbeiro na data: horário semanal + exceções + bloqueios. */
  getDayAvailability: (barberId: string, date: Date) => DayAvailability;
  /** Altera parcialmente a regra da data (cria a regra se ainda não existir). */
  updateDateRule: (barberId: string, date: Date, patch: Partial<DateRule>) => void;
  /** Bloqueia ou libera um bloco de horário ("HH:MM") na data. */
  toggleBlockedTime: (barberId: string, date: Date, time: string) => void;
  /** Volta a data ao horário semanal padrão, sem bloqueios. */
  clearDateRule: (barberId: string, date: Date) => void;
};

const CalendarContext = createContext<CalendarContextValue | null>(null);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const { workingDays, businessHours } = useSettings();
  const [rules, setRules] = useState<RulesByBarber>({});

  const getDateRule = useCallback(
    (barberId: string, date: Date) => rules[barberId]?.[toDayKey(date)],
    [rules],
  );

  const getDayAvailability = useCallback(
    (barberId: string, date: Date) =>
      resolveDayAvailability(date, businessHours, rules[barberId]?.[toDayKey(date)]),
    [businessHours, rules],
  );

  const updateDateRule = useCallback(
    (barberId: string, date: Date, patch: Partial<DateRule>) => {
      const key = toDayKey(date);
      // Um horário especial começa a partir do horário semanal daquele dia da semana.
      const weekday = workingDays.find((d) => d.day === WEEKDAYS_LONG[date.getDay()]);

      setRules((current) => {
        const barberRules = { ...current[barberId] };
        const base: DateRule = barberRules[key] ?? {
          mode: 'default',
          openTime: weekday?.openTime ?? '09:00',
          closeTime: weekday?.closeTime ?? '19:00',
          blockedTimes: [],
        };
        const next = { ...base, ...patch };

        if (isEmptyRule(next)) delete barberRules[key];
        else barberRules[key] = next;
        return { ...current, [barberId]: barberRules };
      });
    },
    [workingDays],
  );

  const toggleBlockedTime = useCallback(
    (barberId: string, date: Date, time: string) => {
      const blocked = rules[barberId]?.[toDayKey(date)]?.blockedTimes ?? [];
      updateDateRule(barberId, date, {
        blockedTimes: blocked.includes(time)
          ? blocked.filter((t) => t !== time)
          : [...blocked, time].sort(),
      });
    },
    [rules, updateDateRule],
  );

  const clearDateRule = useCallback((barberId: string, date: Date) => {
    const key = toDayKey(date);
    setRules((current) => {
      if (!current[barberId]?.[key]) return current;
      const barberRules = { ...current[barberId] };
      delete barberRules[key];
      return { ...current, [barberId]: barberRules };
    });
  }, []);

  const value = useMemo(
    () => ({ getDateRule, getDayAvailability, updateDateRule, toggleBlockedTime, clearDateRule }),
    [getDateRule, getDayAvailability, updateDateRule, toggleBlockedTime, clearDateRule],
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) throw new Error('useCalendar deve ser usado dentro de CalendarProvider');
  return context;
}
