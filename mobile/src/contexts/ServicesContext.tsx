import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { DEFAULT_SERVICES, Service } from '../data/mock';

export type NewService = Pick<Service, 'name' | 'price' | 'durationMin' | 'icon'>;
export type ServiceChanges = Partial<NewService>;

type ServicesContextValue = {
  /** Todos os serviços, inclusive os inativos (necessários para descrever o histórico). */
  services: Service[];
  /** Serviços oferecidos ao cliente no agendamento. */
  activeServices: Service[];
  getServiceById: (id: string) => Service | undefined;
  addService: (service: NewService) => Service;
  updateService: (id: string, changes: ServiceChanges) => void;
  toggleServiceStatus: (id: string) => void;
};

const ServicesContext = createContext<ServicesContextValue | null>(null);

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);

  const addService = useCallback((data: NewService) => {
    const service: Service = { ...data, id: `servico-${Date.now()}`, active: true };
    setServices((current) => [...current, service]);
    return service;
  }, []);

  const updateService = useCallback((id: string, changes: ServiceChanges) => {
    setServices((current) => current.map((s) => (s.id === id ? { ...s, ...changes } : s)));
  }, []);

  const toggleServiceStatus = useCallback((id: string) => {
    setServices((current) => current.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  }, []);

  const value = useMemo(
    () => ({
      services,
      activeServices: services.filter((s) => s.active),
      getServiceById: (id: string) => services.find((s) => s.id === id),
      addService,
      updateService,
      toggleServiceStatus,
    }),
    [services, addService, updateService, toggleServiceStatus],
  );

  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (!context) throw new Error('useServices deve ser usado dentro de ServicesProvider');
  return context;
}
