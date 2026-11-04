import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { BusinessHours, PARTNER_SHOPS, Shop } from '../data/mock';
import { toBusinessHours } from '../utils/booking';

export type Preferences = {
  reminder24h: boolean;
  reminder2h: boolean;
  whatsappNotifications: boolean;
};

export interface WorkingDay {
  /** Nome do dia por extenso, ex: "Segunda-feira". */
  day: string;
  isOpen: boolean;
  /** Abertura no formato "HH:MM" (24h). */
  openTime: string;
  /** Fecho no formato "HH:MM" (24h). */
  closeTime: string;
}

export const DEFAULT_WORKING_DAYS: readonly WorkingDay[] = [
  { day: 'Segunda-feira', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'Terça-feira', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'Quarta-feira', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'Quinta-feira', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'Sexta-feira', isOpen: true, openTime: '09:00', closeTime: '19:00' },
  { day: 'Sábado', isOpen: true, openTime: '09:00', closeTime: '17:00' },
  { day: 'Domingo', isOpen: false, openTime: '09:00', closeTime: '13:00' },
];

type SettingsContextValue = {
  activeShop: Shop;
  setActiveShopId: (id: string) => void;
  preferences: Preferences;
  setPreference: (key: keyof Preferences, value: boolean) => void;
  /** Atualiza o Instagram da barbearia ativa (handle já normalizado; null remove). */
  setShopInstagram: (handle: string | null) => void;
  /** Dias e horários de funcionamento da barbearia ativa (segunda a domingo). */
  workingDays: WorkingDay[];
  /** Os mesmos horários, indexados por `Date.getDay()`, prontos para a agenda. */
  businessHours: BusinessHours[];
  /** Atualiza um dia da barbearia ativa; as alterações valem de imediato em todo o app. */
  updateWorkingDay: (dayName: string, data: Partial<WorkingDay>) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

const DEFAULT_PREFERENCES: Preferences = {
  reminder24h: true,
  reminder2h: true,
  whatsappNotifications: false,
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [activeShopId, setActiveShopId] = useState(PARTNER_SHOPS[0].id);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  // Edições feitas pelo barbeiro sobre os dados de cada barbearia, até existir backend.
  const [instagramByShop, setInstagramByShop] = useState<Record<string, string | null>>({});
  const [workingDaysByShop, setWorkingDaysByShop] = useState<Record<string, WorkingDay[]>>({});

  const setPreference = useCallback((key: keyof Preferences, value: boolean) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  }, []);

  const setShopInstagram = useCallback(
    (handle: string | null) => {
      setInstagramByShop((current) => ({ ...current, [activeShopId]: handle }));
    },
    [activeShopId],
  );

  const updateWorkingDay = useCallback(
    (dayName: string, data: Partial<WorkingDay>) => {
      setWorkingDaysByShop((current) => {
        const days = current[activeShopId] ?? DEFAULT_WORKING_DAYS;
        return {
          ...current,
          // `day` é a chave do registo e não pode ser renomeado.
          [activeShopId]: days.map((d) => (d.day === dayName ? { ...d, ...data, day: d.day } : d)),
        };
      });
    },
    [activeShopId],
  );

  const workingDays = useMemo(
    () => workingDaysByShop[activeShopId] ?? [...DEFAULT_WORKING_DAYS],
    [activeShopId, workingDaysByShop],
  );
  const businessHours = useMemo(() => toBusinessHours(workingDays), [workingDays]);

  const value = useMemo(() => {
    const baseShop = PARTNER_SHOPS.find((shop) => shop.id === activeShopId) ?? PARTNER_SHOPS[0];
    const instagram =
      baseShop.id in instagramByShop ? instagramByShop[baseShop.id] ?? undefined : baseShop.instagram;

    return {
      activeShop: { ...baseShop, instagram },
      setActiveShopId,
      preferences,
      setPreference,
      setShopInstagram,
      workingDays,
      businessHours,
      updateWorkingDay,
    };
  }, [
    activeShopId,
    instagramByShop,
    preferences,
    setPreference,
    setShopInstagram,
    workingDays,
    businessHours,
    updateWorkingDay,
  ]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings deve ser usado dentro de SettingsProvider');
  return context;
}
