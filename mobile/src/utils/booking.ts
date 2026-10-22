import {
  BOOKING_DAYS_AHEAD,
  BUSINESS_HOURS,
  BusinessHours,
  DEMO_CLIENT_NAMES,
  SLOT_INTERVAL_MIN,
  getServiceById,
} from '../data/mock';

export type BookingDay = {
  key: string;
  label: string;
  sublabel: string;
  date: Date;
  hours: BusinessHours;
};

/** Intervalo já reservado na agenda, em minutos desde a meia-noite. */
export type TakenRange = { startMin: number; durationMin: number };

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const WEEKDAYS_LONG = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];
const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function formatPrice(value: number) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

export function formatDuration(totalMin: number) {
  if (totalMin < 60) return `${totalMin} min`;
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

export function formatTime(totalMin: number) {
  const hours = String(Math.floor(totalMin / 60)).padStart(2, '0');
  const minutes = String(totalMin % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDayMonth(date: Date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function toDayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function minutesOfDay(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** "Hoje", "Amanhã" ou "Qua, 23/10". */
export function formatRelativeDay(date: Date, now = new Date()) {
  const diff = Math.round((startOfDay(date).getTime() - startOfDay(now).getTime()) / MS_PER_DAY);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Amanhã';
  return `${WEEKDAYS[date.getDay()]}, ${formatDayMonth(date)}`;
}

/** "Quinta-feira, 22 de outubro". */
export function formatLongDate(date: Date) {
  return `${WEEKDAYS_LONG[date.getDay()]}, ${date.getDate()} de ${MONTHS[date.getMonth()]}`;
}

/** "Hoje", "Ontem" ou "Há 3 dias". */
export function formatTimeAgo(timestamp: number, now = new Date()) {
  const diff = Math.round(
    (startOfDay(now).getTime() - startOfDay(new Date(timestamp)).getTime()) / MS_PER_DAY,
  );
  if (diff <= 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  return `Há ${diff} dias`;
}

export function describeServices(serviceIds: string[]) {
  return serviceIds
    .map((id) => getServiceById(id)?.name)
    .filter(Boolean)
    .join(' + ');
}

export function getBookingDays(today = new Date()): BookingDay[] {
  return Array.from({ length: BOOKING_DAYS_AHEAD }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
    const label = index === 0 ? 'Hoje' : index === 1 ? 'Amanhã' : WEEKDAYS[date.getDay()];
    return {
      key: toDayKey(date),
      label,
      sublabel: formatDayMonth(date),
      date,
      hours: BUSINESS_HOURS[date.getDay()],
    };
  });
}

/** Simula a agenda já ocupada do barbeiro de forma determinística (mock). */
function isBlockBusy(barberId: string, dayKey: string, startMin: number) {
  const seed = `${barberId}|${dayKey}|${startMin}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 4 === 0;
}

function overlaps(start: number, duration: number, range: TakenRange) {
  return start < range.startMin + range.durationMin && range.startMin < start + duration;
}

/**
 * Gera os horários livres para o barbeiro no dia, garantindo que todo o
 * intervalo necessário para os serviços escolhidos esteja livre, dentro
 * do horário de funcionamento e sem conflito com reservas do cliente.
 */
export function getAvailableTimes(
  barberId: string,
  day: BookingDay,
  durationMin: number,
  taken: TakenRange[] = [],
  now = new Date(),
): string[] {
  if (durationMin <= 0 || !day.hours) return [];

  const opening = day.hours.open * 60;
  const closing = day.hours.close * 60;
  const isToday = day.key === toDayKey(now);
  const nowMin = minutesOfDay(now);
  const times: string[] = [];

  for (let start = opening; start + durationMin <= closing; start += SLOT_INTERVAL_MIN) {
    if (isToday && start <= nowMin) continue;
    if (taken.some((range) => overlaps(start, durationMin, range))) continue;

    let free = true;
    for (let block = start; block < start + durationMin; block += SLOT_INTERVAL_MIN) {
      if (isBlockBusy(barberId, day.key, block)) {
        free = false;
        break;
      }
    }
    if (free) times.push(formatTime(start));
  }

  return times;
}

export type BarberAppointment = {
  id: string;
  clientName: string;
  serviceIds: string[];
  /** Início em minutos desde a meia-noite. */
  startMin: number;
  durationMin: number;
  price: number;
  /** Reserva feita pelo próprio usuário no modo cliente. */
  fromApp?: boolean;
};

// Serviços que preenchem exatamente 1, 2 ou 3 blocos de 30 min.
const SERVICES_BY_BLOCKS: Record<number, string[]> = {
  1: ['barba'],
  2: ['corte', 'sobrancelha'],
  3: ['combo', 'sobrancelha'],
};
const MAX_BLOCKS_PER_APPOINTMENT = 3;

/**
 * Agenda simulada do barbeiro no dia (mock). Usa os mesmos blocos ocupados
 * que o cliente vê como indisponíveis, mantendo as duas visões consistentes.
 */
export function getSimulatedAppointments(barberId: string, date: Date): BarberAppointment[] {
  const hours = BUSINESS_HOURS[date.getDay()];
  if (!hours) return [];

  const dayKey = toDayKey(date);
  const opening = hours.open * 60;
  const closing = hours.close * 60;
  const appointments: BarberAppointment[] = [];

  const push = (startMin: number, blocks: number) => {
    const serviceIds = SERVICES_BY_BLOCKS[blocks];
    appointments.push({
      id: `${barberId}-${dayKey}-${startMin}`,
      clientName: DEMO_CLIENT_NAMES[(startMin / SLOT_INTERVAL_MIN) % DEMO_CLIENT_NAMES.length],
      serviceIds,
      startMin,
      durationMin: blocks * SLOT_INTERVAL_MIN,
      price: serviceIds.reduce((sum, id) => sum + (getServiceById(id)?.price ?? 0), 0),
    });
  };

  let runStart: number | null = null;
  for (let block = opening; block <= closing; block += SLOT_INTERVAL_MIN) {
    const busy = block < closing && isBlockBusy(barberId, dayKey, block);
    if (busy) {
      runStart ??= block;
      const blocks = (block + SLOT_INTERVAL_MIN - runStart) / SLOT_INTERVAL_MIN;
      if (blocks === MAX_BLOCKS_PER_APPOINTMENT) {
        push(runStart, blocks);
        runStart = null;
      }
    } else if (runStart !== null) {
      push(runStart, (block - runStart) / SLOT_INTERVAL_MIN);
      runStart = null;
    }
  }

  return appointments;
}

export type WeeklyHoursRow ={ label: string; value: string; isToday: boolean };

/** Agrupa dias consecutivos com o mesmo horário, começando na segunda-feira. */
export function getWeeklyHours(now = new Date()): WeeklyHoursRow[] {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const describe = (hours: BusinessHours) =>
    hours ? `${formatTime(hours.open * 60)} – ${formatTime(hours.close * 60)}` : 'Fechado';

  const rows: { days: number[]; value: string }[] = [];
  for (const day of order) {
    const value = describe(BUSINESS_HOURS[day]);
    const last = rows[rows.length - 1];
    if (last && last.value === value) last.days.push(day);
    else rows.push({ days: [day], value });
  }

  return rows.map(({ days, value }) => ({
    label:
      days.length > 1
        ? `${WEEKDAYS[days[0]]} – ${WEEKDAYS[days[days.length - 1]]}`
        : WEEKDAYS[days[0]],
    value,
    isToday: days.includes(now.getDay()),
  }));
}

export function isShopOpen(now = new Date()) {
  const hours = BUSINESS_HOURS[now.getDay()];
  if (!hours) return false;
  const nowMin = minutesOfDay(now);
  return nowMin >= hours.open * 60 && nowMin < hours.close * 60;
}
