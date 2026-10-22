import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type UserRole = 'client' | 'barber';

type UserRoleContextValue = {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
};

const UserRoleContext = createContext<UserRoleContextValue | null>(null);

// Sem autenticação no MVP: o papel é alternado manualmente no modo demonstração.
export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('client');

  const value = useMemo(() => ({ userRole, setUserRole }), [userRole]);

  return <UserRoleContext.Provider value={value}>{children}</UserRoleContext.Provider>;
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (!context) throw new Error('useUserRole deve ser usado dentro de UserRoleProvider');
  return context;
}
