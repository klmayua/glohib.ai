'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'
import { useRouter } from 'next/navigation'

export function useLogin() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      const { user } = response.data
      // Store user info in zustand store (persisted to localStorage)
      login({
        id: user.id,
        email: user.email,
        role: user.role,
        studentProfile: user.studentProfile,
        employerProfile: user.employerProfile,
        mentorProfile: user.mentorProfile,
      })
      // Invalidate any existing queries
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      // Navigate to dashboard
      router.push('/dashboard')
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: authAPI.register,
    // Success redirect handled by the register page component
  })
}

export function useLogout() {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      logout()
      router.push('/login')
    },
  })
}

export function useCurrentUser() {
  const storedUser = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // Return stored user data instead of making API call
  return {
    data: storedUser ? { success: true, data: storedUser } : null,
    error: null,
    isLoading: !storedUser && isAuthenticated,
  }
}
