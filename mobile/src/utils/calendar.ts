import { BusinessHours, SLOT_INTERVAL_MIN } from '../data/mock';
import { formatTime, isValidTime, startOfDay, TakenRange, timeToMinutes } from './booking';

/**
 * Como o barbeiro trata uma data específica:
 * - `default`: segue o horário semanal da barbearia;
 * - `dayOff`: folga, sem atendimentos;
 * - `custom`: horário especial só para aquela data (pode até abrir um dia normalmente fechado).
 */
export type DateMode = 'default' | 'dayOff' | 'custom';

export interface DateRule {
  mode: DateMode;
  /** Usados apenas no modo `custom`, no formato "HH:MM". */
  openTime: string;
  closeTime: string;
  /** Inícios de blocos de `SLOT_INTERVAL_MIN` minutos indisponíveis para clientes ("HH:MM"). */
  blockedTimes: string[];
}

export type DayAvailability = {
  /** Janela efetiva de atendimento do dia (`null` = sem atendimento). */
  hours: BusinessHours;
  /** Janela que valeria sem exceções (horário semanal). */
  weeklyHours: BusinessHours;
  /** Blocos bloqueados pelo barbeiro, dentro da janela efetiva. */
  blocked: TakenRange[];
  rule?: DateRule;
};

/** Combina o horário semanal com a regra da data e devolve a disponibilidade efetiva. */
export function resolveDayAvailability(
  date: Date,
  weekly: BusinessHours[],
  rule?: DateRule,
): DayAvailability {
  const weeklyHours = weekly[date.getDay()];
  let hours = weeklyHours;

  if (rule?.mode === 'dayOff') {
    hours = null;
  } else if (rule?.mode === 'custom' && isValidTime(rule.openTime) && isValidTime(rule.closeTime)) {
    const open = timeToMinutes(rule.openTime);
    const close = timeToMinutes(rule.closeTime);
    hours = open < close ? { open, close } : null;
  }

  const blocked: TakenRange[] = hours
    ? (rule?.blockedTimes ?? [])
        .map(timeToMinutes)
        .filter((start) => start >= hours.open && start < hours.close)
        .map((startMin) => ({ startMin, durationMin: SLOT_INTERVAL_MIN }))
    : [];

  return { hours, weeklyHours, blocked, rule };
}

/** Todos os inícios de bloco ("HH:MM") dentro da janela do dia. */
export function getDaySlots(hours: BusinessHours): string[] {
  if (!hours) return [];
  const slots: string[] = [];
  for (let start = hours.open; start < hours.close; start += SLOT_INTERVAL_MIN) {
    slots.push(formatTime(start));
  }
  return slots;
}

export function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function isSameDay(a: Date, b: Date) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function isDateInRange(date: Date, min: Date, max: Date) {
  const time = startOfDay(date).getTime();
  return time >= startOfDay(min).getTime() && time <= startOfDay(max).getTime();
}

/**
 * Semanas do mês (domingo a sábado). Posições fora do mês ficam `null`,
 * para a grade manter sempre 7 colunas alinhadas.
 */
export function getMonthWeeks(month: Date): (Date | null)[][] {
  const first = startOfMonth(month);
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: first.getDay() }, () => null);

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(first.getFullYear(), first.getMonth(), day));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/** Regra vazia: não precisa ser guardada. */
export function isEmptyRule(rule: DateRule) {
  return rule.mode === 'default' && rule.blockedTimes.length === 0;
}
