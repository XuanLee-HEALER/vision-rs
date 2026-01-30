'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface SideMenuContextValue {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

const SideMenuContext = createContext<SideMenuContextValue | undefined>(undefined);

export function SideMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SideMenuContext.Provider
      value={{
        isOpen,
        toggle: () => setIsOpen((v) => !v),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </SideMenuContext.Provider>
  );
}

export function useSideMenu() {
  const context = useContext(SideMenuContext);
  if (!context) {
    throw new Error('useSideMenu must be used within SideMenuProvider');
  }
  return context;
}
