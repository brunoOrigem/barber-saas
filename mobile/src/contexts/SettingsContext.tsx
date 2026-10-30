import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { PARTNER_SHOPS, Shop } from '../data/mock';

export type Preferences = {
  reminder24h: boolean;
  reminder2h: boolean;
  whatsappNotifications: boolean;
};

type SettingsContextValue = {
  activeShop: Shop;
  setActiveShopId: (id: string) => void;
  preferences: Preferences;
  setPreference: (key: keyof Preferences, value: boolean) => void;
  /** Atualiza o Instagram da barbearia ativa (handle já normalizado; null remove). */
  setShopInstagram: (handle: string | null) => void;
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

  const setPreference = useCallback((key: keyof Preferences, value: boolean) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  }, []);

  const setShopInstagram = useCallback(
    (handle: string | null) => {
      setInstagramByShop((current) => ({ ...current, [activeShopId]: handle }));
    },
    [activeShopId],
  );

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
    };
  }, [activeShopId, instagramByShop, preferences, setPreference, setShopInstagram]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings deve ser usado dentro de SettingsProvider');
  return context;
}
