import { getUserInformation } from '@/apis/user'
import { create } from 'zustand'

interface User {
  _id: string
  full_name: string
  email: string
  cccd: string
  isAdmin: boolean
}

interface UserStore {
  user: User | null
  isLoggedIn: boolean
  setUser: (user: User) => void
  logout: () => void
  fetchUser: () => Promise<void>
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user: User) => set({ user, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false }),

  fetchUser: async () => {
    try {
      const { data } = await getUserInformation()
      // console.log(data.user);
      set({ user: data.user })
    } catch (error) {
      console.log(error)
      set({ user: null })
    }
  }
}))