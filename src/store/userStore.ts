import { create } from 'zustand'

export const useUserStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user: any) => set({ user, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false }),
}))