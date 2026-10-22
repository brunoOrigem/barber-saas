import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export type BookingStatus = 'scheduled' | 'completed' | 'cancelled';

export type Booking = {
  id: string;
  barberId: string;
  serviceIds: string[];
  /** Início do atendimento em milissegundos (epoch). */
  startsAt: number;
  totalPrice: number;
  totalDuration: number;
  status: BookingStatus;
};

type NewBooking = Omit<Booking, 'id' | 'status'>;

type BookingsContextValue = {
  bookings: Booking[];
  /** Agendamentos ativos e futuros, do mais próximo para o mais distante. */
  upcoming: Booking[];
  /** Agendamentos concluídos ou cancelados, do mais recente para o mais antigo. */
  history: Booking[];
  addBooking: (booking: NewBooking) => Booking;
  cancelBooking: (id: string) => void;
};

const BookingsContext = createContext<BookingsContextValue | null>(null);

function daysAgo(days: number, hour: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.getTime();
}

// Histórico mockado até existir backend.
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'h1',
    barberId: 'b1',
    serviceIds: ['combo'],
    startsAt: daysAgo(14, 10),
    totalPrice: 70,
    totalDuration: 75,
    status: 'completed',
  },
  {
    id: 'h2',
    barberId: 'b2',
    serviceIds: ['barba'],
    startsAt: daysAgo(30, 16),
    totalPrice: 35,
    totalDuration: 30,
    status: 'cancelled',
  },
  {
    id: 'h3',
    barberId: 'b3',
    serviceIds: ['corte', 'sobrancelha'],
    startsAt: daysAgo(45, 14),
    totalPrice: 60,
    totalDuration: 60,
    status: 'completed',
  },
];

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  const addBooking = useCallback((data: NewBooking) => {
    const booking: Booking = { ...data, id: String(Date.now()), status: 'scheduled' };
    setBookings((current) => [...current, booking]);
    return booking;
  }, []);

  const cancelBooking = useCallback((id: string) => {
    setBookings((current) =>
      current.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)),
    );
  }, []);

  const value = useMemo(() => {
    const now = Date.now();
    const isUpcoming = (b: Booking) => b.status === 'scheduled' && b.startsAt > now;

    // Agendamentos que já passaram contam como concluídos no histórico.
    const history = bookings
      .filter((b) => !isUpcoming(b))
      .map((b) => (b.status === 'scheduled' ? { ...b, status: 'completed' as const } : b))
      .sort((a, b) => b.startsAt - a.startsAt);

    return {
      bookings,
      upcoming: bookings.filter(isUpcoming).sort((a, b) => a.startsAt - b.startsAt),
      history,
      addBooking,
      cancelBooking,
    };
  }, [bookings, addBooking, cancelBooking]);

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
}

export function useBookings() {
  const context = useContext(BookingsContext);
  if (!context) throw new Error('useBookings deve ser usado dentro de BookingsProvider');
  return context;
}
