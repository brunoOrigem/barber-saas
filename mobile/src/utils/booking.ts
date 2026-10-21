import {
  BOOKING_DAYS_AHEAD,
  CLOSING_HOUR,
  OPENING_HOUR,
  SLOT_INTERVAL_MIN,
} from '../data/mock';

export type BookingDay = {
  key: string;
  label: string;
  sublabel: string;
  date: Date;
};

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function formatPrice(value: number) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

export function formatDuration(totalMin: number) {
  if (totalMin < 60) return `${totalMin} min`;
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

function formatTime(totalMin: number) {
  const hours = String(Math.floor(totalMin / 60)).padStart(2, '0');
  const minutes = String(totalMin % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function toDayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function getBookingDays(today = new Date()): BookingDay[] {
  return Array.from({ length: BOOKING_DAYS_AHEAD }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
    const dayMonth = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = index === 0 ? 'Hoje' : index === 1 ? 'Amanhã' : WEEKDAYS[date.getDay()];
    return { key: toDayKey(date), label, sublabel: dayMonth, date };
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

/**
 * Gera os horários livres para o barbeiro no dia, garantindo que todo o
 * intervalo necessário para os serviços escolhidos esteja livre e dentro
 * do horário de funcionamento.
 */
export function getAvailableTimes(
  barberId: string,
  day: BookingDay,
  durationMin: number,
  now = new Date(),
): string[] {
  if (durationMin <= 0) return [];

  const opening = OPENING_HOUR * 60;
  const closing = CLOSING_HOUR * 60;
  const isToday = day.key === toDayKey(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const times: string[] = [];

  for (let start = opening; start + durationMin <= closing; start += SLOT_INTERVAL_MIN) {
    if (isToday && start <= nowMin) continue;

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
