import { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type ServiceIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type Service = {
  id: string;
  name: string;
  price: number;
  durationMin: number;
  icon: ServiceIconName;
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
  { id: 'corte', name: 'Corte de Cabelo', price: 45, durationMin: 45, icon: 'content-cut' },
  { id: 'barba', name: 'Barba Completa', price: 35, durationMin: 30, icon: 'razor-double-edge' },
  {
    id: 'combo',
    name: 'Combo Cabelo + Barba',
    price: 70,
    durationMin: 75,
    icon: 'face-man-shimmer',
    includes: ['corte', 'barba'],
  },
  { id: 'sobrancelha', name: 'Sobrancelha', price: 15, durationMin: 15, icon: 'eye-outline' },
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

export type Shop = {
  id: string;
  name: string;
  address: string;
  city: string;
  whatsapp: string;
};

// Barbearias parceiras da plataforma (SaaS). O cliente escolhe uma ativa.
export const PARTNER_SHOPS: Shop[] = [
  {
    id: 'danillo',
    name: 'Danillo Andreoli Barbearia',
    address: 'Rua das Tesouras, 123 – Centro',
    city: 'São Paulo – SP',
    whatsapp: '5511999999999',
  },
  {
    id: 'navalha',
    name: 'Navalha de Ouro',
    address: 'Av. Paulista, 900 – Bela Vista',
    city: 'São Paulo – SP',
    whatsapp: '5511988888888',
  },
  {
    id: 'classic',
    name: 'Classic Barber Club',
    address: 'Rua Augusta, 1500 – Consolação',
    city: 'São Paulo – SP',
    whatsapp: '5511977777777',
  },
];

export const USER = {
  firstName: 'Bruno',
  fullName: 'Bruno Noronha',
  email: 'bruno@exemplo.com',
  phone: '(11) 98888-7777',
};

/** Barbeiro "logado" no modo profissional, até existir autenticação. */
export const DEMO_BARBER_ID = 'b1';

/** Nomes usados para preencher a agenda simulada do barbeiro. */
export const DEMO_CLIENT_NAMES = [
  'André Martins',
  'Felipe Costa',
  'Gustavo Rocha',
  'Henrique Dias',
  'João Pereira',
  'Leonardo Melo',
  'Mateus Ribeiro',
  'Thiago Santos',
];

// Fotos de exemplo usadas para simular o upload de um novo corte.
export const PORTFOLIO_SAMPLE_IMAGES = [
  'https://picsum.photos/seed/corte-degrade/600/750',
  'https://picsum.photos/seed/corte-social/600/750',
  'https://picsum.photos/seed/corte-barba/600/750',
  'https://picsum.photos/seed/corte-navalhado/600/750',
  'https://picsum.photos/seed/corte-texturizado/600/750',
];

export const APP_VERSION = '1.0.0';

export const SLOT_INTERVAL_MIN = 30;
export const BOOKING_DAYS_AHEAD = 7;

export function getServiceById(id: string) {
  return SERVICES.find((service) => service.id === id);
}

export function getBarberById(id: string) {
  return BARBERS.find((barber) => barber.id === id);
}
