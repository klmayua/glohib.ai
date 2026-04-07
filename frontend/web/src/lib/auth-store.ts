import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  role: string
  studentProfile?: any
  employerProfile?: any
  mentorProfile?: any
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user) => {
        set({ user, isAuthenticated: true, isLoading: false })
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
