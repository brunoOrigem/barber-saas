export type Service = {
  id: string;
  name: string;
  price: number;
  durationMin: number;
  icon: string;
  /** Serviços já incluídos neste (ex: o combo inclui corte e barba). */
  includes?: string[];
};

export type Barber = {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  specialty: string;
  avatarUrl: string;
};

export const SERVICES: Service[] = [
  { id: 'corte', name: 'Corte de Cabelo', price: 45, durationMin: 45, icon: '✂️' },
  { id: 'barba', name: 'Barba Completa', price: 35, durationMin: 30, icon: '🪒' },
  {
    id: 'combo',
    name: 'Combo Cabelo + Barba',
    price: 70,
    durationMin: 75,
    icon: '💈',
    includes: ['corte', 'barba'],
  },
  { id: 'sobrancelha', name: 'Sobrancelha', price: 15, durationMin: 15, icon: '✨' },
];

export const BARBERS: Barber[] = [
  {
    id: 'b1',
    name: 'Rafael Souza',
    rating: 4.9,
    reviews: 312,
    specialty: 'Degradê e cortes modernos',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 'b2',
    name: 'Marcos Lima',
    rating: 4.8,
    reviews: 245,
    specialty: 'Barba e navalha',
    avatarUrl: 'https://i.pravatar.cc/150?img=53',
  },
  {
    id: 'b3',
    name: 'Diego Alves',
    rating: 4.7,
    reviews: 198,
    specialty: 'Cortes clássicos',
    avatarUrl: 'https://i.pravatar.cc/150?img=59',
  },
  {
    id: 'b4',
    name: 'Lucas Ferreira',
    rating: 4.6,
    reviews: 121,
    specialty: 'Design de sobrancelha',
    avatarUrl: 'https://i.pravatar.cc/150?img=68',
  },
];

export type BusinessHours = { open: number; close: number } | null;

/** Horário de funcionamento indexado por `Date.getDay()` (0 = domingo), em horas. */
export const BUSINESS_HOURS: BusinessHours[] = [
  null,
  { open: 9, close: 19 },
  { open: 9, close: 19 },
  { open: 9, close: 19 },
  { open: 9, close: 19 },
  { open: 9, close: 19 },
  { open: 9, close: 17 },
];

export const SHOP = {
  name: 'CorteApp Barbearia',
  address: 'Rua das Tesouras, 123 – Centro',
  city: 'São Paulo – SP',
  whatsapp: '5511999999999',
};

export const USER = {
  firstName: 'Bruno',
  fullName: 'Bruno Noronha',
  email: 'bruno@exemplo.com',
  phone: '(11) 98888-7777',
};

export const SLOT_INTERVAL_MIN = 30;
export const BOOKING_DAYS_AHEAD = 7;

export function getServiceById(id: string) {
  return SERVICES.find((service) => service.id === id);
}

export function getBarberById(id: string) {
  return BARBERS.find((barber) => barber.id === id);
}
