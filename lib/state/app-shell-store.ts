"use client";

import { create } from "zustand";

interface AppShellState {
  isCommandOpen: boolean;
  isSidebarCollapsed: boolean;
  isMobileNavOpen: boolean;
  setCommandOpen: (isCommandOpen: boolean) => void;
  setMobileNavOpen: (isMobileNavOpen: boolean) => void;
  toggleSidebar: () => void;
}

export const useAppShellStore = create<AppShellState>((set) => ({
  isCommandOpen: false,
  isSidebarCollapsed: false,
  isMobileNavOpen: false,
  setCommandOpen: (isCommandOpen) => set({ isCommandOpen }),
  setMobileNavOpen: (isMobileNavOpen) => set({ isMobileNavOpen }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
