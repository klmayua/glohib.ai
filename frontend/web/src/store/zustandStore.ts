import { create } from 'zustand'

interface User {
  id: string
  email: string
  name?: string
  roles: string[]
}

interface Internship {
  id: string
  title: string
  company: string
  location: string
  match: number
  stipend?: number
}

interface DashboardState {
  user: User | null
  internships: Internship[]
  applications: any[]
  notifications: any[]
  isLoading: boolean
  setUser: (user: User | null) => void
  setInternships: (data: Internship[]) => void
  setApplications: (data: any[]) => void
  setNotifications: (data: any[]) => void
  setLoading: (loading: boolean) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  user: null,
  internships: [],
  applications: [],
  notifications: [],
  isLoading: true,
  setUser: (user) => set({ user }),
  setInternships: (data) => set({ internships: data }),
  setApplications: (data) => set({ applications: data }),
  setNotifications: (data) => set({ notifications: data }),
  setLoading: (loading) => set({ isLoading: loading }),
}))
